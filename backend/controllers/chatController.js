const { getOpenAIResponse } = require('../services/openaiService');
const { translate } = require('../services/translationService');
const { logChat } = require('../models/ChatLog');

exports.handleChat = async (req, res) => {
  console.log('=== handleChat called ===');
  console.log('Request body:', req.body);
  const { message, language = 'en', businessType = 'restaurant', userId = 1 } = req.body;
  
  try {
    console.log('Calling translate...');
    const englishMessage = await translate(message, language, 'en');
    console.log('English message:', englishMessage);
    console.log('Calling getOpenAIResponse...');
    const openaiResponse = await getOpenAIResponse(englishMessage, businessType);
    console.log('OpenAI response:', openaiResponse);
    console.log('Calling translate for response...');
    const translatedResponse = await translate(openaiResponse, 'en', language);
    
    // Try to log to database, but don't fail if it doesn't work
    try {
      await logChat(userId, message, translatedResponse);
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