const { getOpenAIResponse } = require('../services/openaiService');
const { translate } = require('../services/translationService');
const { logChat } = require('../models/ChatLog');
const { findById } = require('../models/User');

exports.handleChat = async (req, res) => {
  console.log('=== handleChat called ===');
  
  // SIMPLE, DIRECT USER ID EXTRACTION
  let userId = null;
  
  // Method 1: Try to get from JWT payload
  if (req.user && req.user.userId) {
    userId = req.user.userId;
    console.log('Got userId from JWT payload:', userId);
  } else if (req.user && req.user.id) {
    userId = req.user.id;
    console.log('Got userId from JWT payload (id field):', userId);
  } else {
    // Method 2: Extract directly from JWT token
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId || decoded.id;
        console.log('Extracted userId from JWT token:', userId);
      } catch (jwtError) {
        console.error('JWT decode error:', jwtError);
      }
    }
  }
  
  if (!userId) {
    console.error('No user ID found - authentication failed');
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  const { message, language = 'en', businessType: requestBusinessType = '', userProfile } = req.body;
  
  // DEBUG: Log the entire request body
  console.log('🔍 DEBUG: Full request body received:', req.body);
  console.log('🔍 DEBUG: userProfile received:', userProfile);
  console.log('🔍 DEBUG: userProfile.ethnicity:', userProfile?.ethnicity);
  
  try {
    // Fetch ALL user data from database using authenticated user ID
    let userBusinessType = requestBusinessType;
    let userData = null;
    console.log('Attempting to fetch user data for authenticated userId:', userId);
    
    // PRIORITY: Use userProfile data sent from frontend if available
    if (userProfile) {
      console.log('🎯 Using userProfile data sent from frontend:', userProfile);
      userData = {
        id: userProfile.id,
        email: userProfile.email,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        phone: null, // Not sent from frontend
        language: language, // Use request language
        business_type: userProfile.business_type,
        is_admin: false, // Default for security
        is_verified: true, // Assume verified if they can chat
        last_login: new Date(),
        created_at: new Date(),
        // Address fields
        address_line1: userProfile.address_line1,
        address_line2: userProfile.address_line2,
        city: userProfile.city,
        state: userProfile.state,
        zip_code: userProfile.zip_code,
        // Demographics
        age: userProfile.age,
        ethnicity: userProfile.ethnicity,
        gender: userProfile.gender,
        // Business details
        employee_count: userProfile.employee_count,
        years_in_business: userProfile.years_in_business,
        corporation_type: userProfile.corporation_type,
        // Financial information
        annual_revenue_2022: null, // Not sent from frontend
        annual_revenue_2023: null, // Not sent from frontend
        annual_revenue_2024: userProfile.annual_revenue_2024
      };
      
      // Prioritize the request business type over profile business type
      userBusinessType = requestBusinessType || userProfile.business_type;
      console.log('✅ Using frontend userProfile data:', userData);
      console.log('🎯 Key profile fields from frontend:');
      console.log('- Ethnicity:', userData.ethnicity);
      console.log('- Gender:', userData.gender);
      console.log('- Age:', userData.age);
      console.log('- Business Type:', userData.business_type);
      console.log('- Revenue 2024:', userData.annual_revenue_2024);
    } else {
      // Fallback: Fetch from database
      try {
        console.log('Calling findById for userId:', userId);
        const user = await findById(userId);
        console.log('User found:', user ? 'Yes' : 'No');
        if (user) {
          console.log('User object keys:', Object.keys(user));
          console.log('Raw user data from database:', user);
          
          // Get ALL user data
          userData = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            language: user.language,
            business_type: user.business_type,
            is_admin: user.is_admin,
            is_verified: user.is_verified,
            last_login: user.last_login,
            created_at: user.created_at,
            // Address fields
            address_line1: user.address_line1,
            address_line2: user.address_line2,
            city: user.city,
            state: user.state,
            zip_code: user.zip_code,
            // Demographics
            age: user.age,
            ethnicity: user.ethnicity,
            gender: user.gender,
            // Business details
            employee_count: user.employee_count,
            years_in_business: user.years_in_business,
            corporation_type: user.corporation_type,
            // Financial information
            annual_revenue_2022: user.annual_revenue_2022,
            annual_revenue_2023: user.annual_revenue_2023,
            annual_revenue_2024: user.annual_revenue_2024
          };
          
          // Prioritize the request business type over profile business type
          // This allows users to temporarily override their profile business type
          userBusinessType = requestBusinessType || user.business_type;
          console.log('Complete user data fetched from database:', userData);
          console.log('Key profile fields from database:');
          console.log('- Ethnicity:', userData.ethnicity);
          console.log('- Gender:', userData.gender);
          console.log('- Age:', userData.age);
          console.log('- Business Type:', userData.business_type);
          console.log('- Revenue 2024:', userData.annual_revenue_2024);
        }
      } catch (userError) {
        console.log('Could not fetch user data, using request business type:', userError.message);
        console.log('Error details:', userError);
      }
    }
    
    // CRITICAL FIX: Prioritize request business type over everything else
    // This ensures that when user selects a different business type, it takes precedence
    const finalBusinessType = requestBusinessType || userBusinessType || 'restaurant';
    console.log('=== BUSINESS TYPE DEBUGGING ===');
    console.log('Request business type (from frontend):', requestBusinessType);
    console.log('User profile business type (from database):', userData?.business_type);
    console.log('userBusinessType (after processing):', userBusinessType);
    console.log('Final business type being used (for OpenAI):', finalBusinessType);
    console.log('=== END BUSINESS TYPE DEBUGGING ===');
    console.log('User revenue being used:', userData?.annual_revenue_2024 || userData?.annual_revenue_2023 || userData?.annual_revenue_2022);
    console.log('User postal code being used:', userData?.zip_code);
    
    // Fetch user's chat history to provide context to OpenAI
    let chatHistory = [];
    try {
      const { getChatsByUser } = require('../models/ChatLog');
      const allChatHistory = await getChatsByUser(userId);
      
      // Filter chat history to prioritize messages with the same business type
      // This prevents OpenAI from being confused by previous business type contexts
      const relevantHistory = allChatHistory.filter(chat => {
        // If the chat has a business type, check if it matches current request
        if (chat.business_type && chat.business_type !== finalBusinessType) {
          console.log(`🔍 Filtering out chat with different business type: ${chat.business_type} vs ${finalBusinessType}`);
          return false;
        }
        return true;
      });
      
      // Limit to last 5 messages to avoid overwhelming context
      chatHistory = relevantHistory.slice(-5);
      
      console.log(`Fetched ${allChatHistory.length} total chat messages, using ${chatHistory.length} relevant messages for context`);
      console.log(`🔍 Current business type: ${finalBusinessType}`);
      console.log(`🔍 Relevant chat history business types:`, chatHistory.map(c => c.business_type || 'unspecified'));
    } catch (historyError) {
      console.log('Failed to fetch chat history for context:', historyError.message);
    }
    
    console.log('Calling translate...');
    const englishMessage = await translate(message, language, 'en');
    console.log('English message:', englishMessage);
    console.log('Calling getOpenAIResponse with business type, revenue, postal code, language, and chat history');
    console.log('🔍 DEBUG: userData being passed to OpenAI:', userData);
    console.log('🔍 DEBUG: userData.ethnicity:', userData?.ethnicity);
    console.log('🔍 DEBUG: userData.gender:', userData?.gender);
    console.log('🔍 DEBUG: userData.age:', userData?.age);
    const openaiResponse = await getOpenAIResponse(englishMessage, finalBusinessType, userData?.annual_revenue_2024 || userData?.annual_revenue_2023 || userData?.annual_revenue_2022, userData?.zip_code, userData, language, chatHistory);
    console.log('OpenAI response:', openaiResponse);
    console.log('Calling translate for response...');
    const translatedResponse = await translate(openaiResponse, 'en', language);
    
    // Try to log to database, but don't fail if it doesn't work
    try {
      await logChat(userId, message, translatedResponse, {
        businessType: finalBusinessType,
        language: language,
        revenue: userData?.annual_revenue_2024 || userData?.annual_revenue_2023 || userData?.annual_revenue_2022,
        postalCode: userData?.zip_code
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
    const testResponse = await getOpenAIResponse(status.test.simplePrompt, status.test.businessType, null, null, null, 'en', []);
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

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
  console.log('=== getChatHistory called ===');
  
  try {
    // SIMPLE, DIRECT USER ID EXTRACTION
    let userId = null;
    
    // Method 1: Try to get from JWT payload
    if (req.user && req.user.userId) {
      userId = req.user.userId;
      console.log('Got userId from JWT payload:', userId);
    } else if (req.user && req.user.id) {
      userId = req.user.id;
      console.log('Got userId from JWT payload (id field):', userId);
    } else {
      // Method 2: Extract directly from JWT token
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId || decoded.id;
          console.log('Extracted userId from JWT token:', userId);
        } catch (jwtError) {
          console.error('JWT decode error:', jwtError);
        }
      }
    }
    
    if (!userId) {
      console.error('No user ID found - authentication failed');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    console.log('Fetching chat history for user ID:', userId);
    
    // Get chat history from database
    const { getChatsByUser } = require('../models/ChatLog');
    const messages = await getChatsByUser(userId);
    
    console.log('Found', messages.length, 'chat messages for user', userId);
    
    res.json({ messages });
    
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Clear chat history for a user
exports.clearChatHistory = async (req, res) => {
  console.log('=== clearChatHistory called ===');
  
  try {
    // SIMPLE, DIRECT USER ID EXTRACTION
    let userId = null;
    
    // Method 1: Try to get from JWT payload
    if (req.user && req.user.userId) {
      userId = req.user.userId;
      console.log('Got userId from JWT payload:', userId);
    } else if (req.user && req.user.id) {
      userId = req.user.id;
      console.log('Got userId from JWT payload (id field):', userId);
    } else {
      // Method 2: Extract directly from JWT token
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId || decoded.id;
          console.log('Extracted userId from JWT token:', userId);
        } catch (jwtError) {
          console.error('JWT decode error:', jwtError);
        }
      }
    }
    
    if (!userId) {
      console.error('No user ID found - authentication failed');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Clear chat history from database
    const pool = getPool();
    if (pool) {
      await pool.query('DELETE FROM chat_logs WHERE user_id = $1', [userId]);
      console.log(`Cleared chat history for user ${userId}`);
      
      res.json({ 
        success: true, 
        message: 'Chat history cleared successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Database not available' 
      });
    }
    
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear chat history' 
    });
  }
};

// Log a chat message to database
exports.logChatMessage = async (req, res) => {
  console.log('=== logChatMessage called ===');
  
  try {
    const { message, response, businessType, language } = req.body;
    
    // SIMPLE, DIRECT USER ID EXTRACTION
    let userId = null;
    
    // Method 1: Try to get from JWT payload
    if (req.user && req.user.userId) {
      userId = req.user.userId;
      console.log('Got userId from JWT payload:', userId);
    } else if (req.user && req.user.id) {
      userId = req.user.id;
      console.log('Got userId from JWT payload (id field):', userId);
    } else {
      // Method 2: Extract directly from JWT token
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId || decoded.id;
          console.log('Extracted userId from JWT token:', userId);
        } catch (jwtError) {
          console.error('JWT decode error:', jwtError);
        }
      }
    }
    
    if (!userId) {
      console.error('No user ID found - authentication failed');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!message || !response) {
      return res.status(400).json({ error: 'Message and response are required' });
    }
    
    console.log('Logging chat message for user ID:', userId);
    console.log('Business type:', businessType);
    console.log('Language:', language);
    
    // Log to database
    const { logChat } = require('../models/ChatLog');
    const result = await logChat(userId, message, response, {
      businessType,
      language: language || 'en'
    });
    
    if (result) {
      console.log('Chat message logged successfully for user', userId);
      res.json({ success: true, messageId: result.id });
    } else {
      console.log('Chat message logging failed');
      res.status(500).json({ error: 'Failed to log chat message' });
    }
    
  } catch (error) {
    console.error('Error logging chat message:', error);
    res.status(500).json({ error: 'Failed to log chat message' });
  }
}; 