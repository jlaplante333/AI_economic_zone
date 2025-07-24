const { getOpenAIResponse } = require('../services/openaiService');
const { translate } = require('../services/translationService');
const { logChat } = require('../models/ChatLog');
const { findById } = require('../models/User');

exports.handleChat = async (req, res) => {
  console.log('=== handleChat called ===');
  console.log('Request body:', req.body);
  const { message, language = 'en', businessType: requestBusinessType = '', userId = 1 } = req.body;
  
  try {
    // Fetch user's business type, revenue, and postal code from database if userId is provided
    let userBusinessType = requestBusinessType;
    let userRevenue = null;
    let userPostalCode = null;
    console.log('Attempting to fetch user data for userId:', userId);
    
    if (userId && userId !== 1) { // Skip for default user ID 1
      try {
        console.log('Calling findById for userId:', userId);
        const user = await findById(userId);
        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
          console.log('User business_type field:', user.business_type);
          console.log('User revenue fields:', {
            annual_revenue_2022: user.annual_revenue_2022,
            annual_revenue_2023: user.annual_revenue_2023,
            annual_revenue_2024: user.annual_revenue_2024
          });
          console.log('User postal code:', user.zip_code);
          console.log('User object keys:', Object.keys(user));
        }
        
        if (user && user.business_type) {
          userBusinessType = user.business_type;
          console.log('User business type from database:', userBusinessType);
        } else {
          console.log('No business_type found in user object');
        }
        
        // Get the most recent revenue data
        if (user) {
          userRevenue = user.annual_revenue_2024 || user.annual_revenue_2023 || user.annual_revenue_2022;
          userPostalCode = user.zip_code;
          console.log('User revenue from database:', userRevenue);
          console.log('User postal code from database:', userPostalCode);
        }
      } catch (userError) {
        console.log('Could not fetch user data, using request business type:', userError.message);
        console.log('Error details:', userError);
      }
    } else {
      console.log('Skipping user lookup - using default userId or userId is 1');
    }
    
    // Use the business type from user profile, fallback to request business type, then default
    const finalBusinessType = userBusinessType || requestBusinessType || 'restaurant';
    console.log('Final business type being used:', finalBusinessType);
    console.log('User revenue being used:', userRevenue);
    console.log('User postal code being used:', userPostalCode);
    
    console.log('Calling translate...');
    const englishMessage = await translate(message, language, 'en');
    console.log('English message:', englishMessage);
    console.log('Calling getOpenAIResponse with business type, revenue, and postal code');
    const openaiResponse = await getOpenAIResponse(englishMessage, finalBusinessType, userRevenue, userPostalCode);
    console.log('OpenAI response:', openaiResponse);
    console.log('Calling translate for response...');
    const translatedResponse = await translate(openaiResponse, 'en', language);
    
    // Try to log to database, but don't fail if it doesn't work
    try {
      await logChat(userId, message, translatedResponse, {
        businessType: finalBusinessType,
        language: language,
        revenue: userRevenue,
        postalCode: userPostalCode
      });
    } catch (dbError) {
      console.log('Database logging failed (this is OK for testing):', dbError.message);
    }
    
    res.json({ response: translatedResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      response: "I'm having trouble connecting right now. Please try again in a moment." 
    });
  }
};

exports.getAIStatus = async (req, res) => {
  console.log('=== getAIStatus called ===');
  
  const status = {
    timestamp: new Date().toISOString(),
    environment: {
      openaiApiKey: process.env.OPENAI_API_KEY ? 'Configured' : 'Missing',
      openaiApiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
      nodeEnv: process.env.NODE_ENV || 'development'
    },
    connection: {
      status: 'unknown',
      message: '',
      responseTime: null,
      error: null
    },
    test: {
      simplePrompt: 'Hello, this is a test.',
      businessType: 'restaurant'
    }
  };

  try {
    console.log('Testing OpenAI API connection...');
    const startTime = Date.now();
    
    // Test with a simple prompt
    const testResponse = await getOpenAIResponse(status.test.simplePrompt, status.test.businessType);
    const responseTime = Date.now() - startTime;
    
    console.log('Test response received:', testResponse);
    
    // Check if we got a real response or fallback
    const isFallback = testResponse.includes('Hello! I\'m here to help with your') && 
                      testResponse.includes('What specific question do you have');
    
    if (isFallback) {
      status.connection.status = 'yellow';
      status.connection.message = 'API key configured but fallback response used';
      status.connection.responseTime = responseTime;
      status.test.response = testResponse;
      status.test.isFallback = true;
    } else {
      status.connection.status = 'green';
      status.connection.message = 'OpenAI API working correctly';
      status.connection.responseTime = responseTime;
      status.test.response = testResponse;
      status.test.isFallback = false;
    }
    
  } catch (error) {
    console.error('AI Status test error:', error);
    status.connection.status = 'red';
    status.connection.message = 'OpenAI API connection failed';
    status.connection.error = error.message;
  }
  
  console.log('AI Status result:', status.connection.status);
  res.json(status);
}; 