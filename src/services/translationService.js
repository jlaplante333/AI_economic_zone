const { apiKey, apiUrl } = require('../config/openaiConfig');
const axios = require('axios');

async function translate(text, fromLang, toLang) {
  if (fromLang === toLang) return text;
  
  // Check if API key is configured
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    // Simple fallback translations for common phrases
    const translations = {
      'en-es': {
        'hello': 'hola',
        'help': 'ayuda',
        'business': 'negocio',
        'restaurant': 'restaurante',
        'retail': 'comercio',
        'permit': 'permiso',
        'license': 'licencia',
        'thank you': 'gracias',
        'goodbye': 'adiós'
      },
      'es-en': {
        'hola': 'hello',
        'ayuda': 'help',
        'negocio': 'business',
        'restaurante': 'restaurant',
        'comercio': 'retail',
        'permiso': 'permit',
        'licencia': 'license',
        'gracias': 'thank you',
        'adiós': 'goodbye'
      }
    };
    
    const key = `${fromLang}-${toLang}`;
    if (translations[key]) {
      let translatedText = text.toLowerCase();
      for (const [original, translated] of Object.entries(translations[key])) {
        translatedText = translatedText.replace(new RegExp(original, 'gi'), translated);
      }
      return translatedText;
    }
    
    return text; // Return original if no translation available
  }
  
  try {
    const response = await axios.post(
      `${apiUrl}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from ${fromLang} to ${toLang}. Only return the translated text, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation Error:', error.response?.data || error.message);
    return text; // Return original text if translation fails
  }
}

module.exports = { translate }; 