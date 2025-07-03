const { getOpenAIResponse } = require('../services/openaiService');
const { translate } = require('../services/translationService');
const { logChat } = require('../models/ChatLog');

exports.handleChat = async (req, res) => {
  const { message, language = 'en', businessType = 'restaurant', userId = 1 } = req.body;
  
  try {
    const englishMessage = await translate(message, language, 'en');
    const openaiResponse = await getOpenAIResponse(englishMessage, businessType);
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