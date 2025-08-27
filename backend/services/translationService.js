const { apiKey, apiUrl } = require('../config/openaiConfig');
const axios = require('axios');

// Function to get language-specific translation instructions
function getLanguageInstructions(fromLang, toLang) {
  const instructions = {
    'en-vi': 'Use SOUTHERN VIETNAMESE (Saigon dialect). Avoid Northern/Communist style language. Use warm, friendly Southern Vietnamese expressions and vocabulary.',
    'vi-en': 'Translate from Southern Vietnamese (Saigon dialect) to natural, conversational English.',
    'en-zh-cn': 'Use MANDARIN CHINESE (Simplified Chinese). Use proper Mandarin grammar and formal business vocabulary.',
    'zh-cn-en': 'Translate from Mandarin Chinese (Simplified) to natural, conversational English.',
    'en-zh-hk': 'Use CANTONESE CHINESE (Traditional Chinese). Use proper Cantonese grammar and formal business vocabulary typical of Hong Kong.',
    'zh-hk-en': 'Translate from Cantonese Chinese (Traditional) to natural, conversational English.',
    'en-ar': 'Use MODERN STANDARD ARABIC. Use proper Arabic grammar and formal business vocabulary.',
    'ar-en': 'Translate from Modern Standard Arabic to natural, conversational English.',
    'en-es': 'Use LATIN AMERICAN SPANISH (Mexican/Central American style). Use vocabulary common in Latin American business contexts.',
    'es-en': 'Translate from Latin American Spanish to natural, conversational English.'
  };
  
  const key = `${fromLang}-${toLang}`;
  return instructions[key] || `Translate naturally and accurately from ${fromLang} to ${toLang}.`;
}

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
      },
      'en-vi': {
        'hello': 'xin chào',
        'help': 'giúp đỡ',
        'business': 'kinh doanh',
        'restaurant': 'nhà hàng',
        'retail': 'bán lẻ',
        'permit': 'giấy phép',
        'license': 'giấy phép kinh doanh',
        'thank you': 'cảm ơn',
        'goodbye': 'tạm biệt'
      },
      'vi-en': {
        'xin chào': 'hello',
        'giúp đỡ': 'help',
        'kinh doanh': 'business',
        'nhà hàng': 'restaurant',
        'bán lẻ': 'retail',
        'giấy phép': 'permit',
        'giấy phép kinh doanh': 'license',
        'cảm ơn': 'thank you',
        'tạm biệt': 'goodbye'
      },
      'en-zh-cn': {
        'hello': '你好',
        'help': '帮助',
        'business': '商业',
        'restaurant': '餐厅',
        'retail': '零售',
        'permit': '许可证',
        'license': '执照',
        'thank you': '谢谢',
        'goodbye': '再见'
      },
      'zh-cn-en': {
        '你好': 'hello',
        '帮助': 'help',
        '商业': 'business',
        '餐厅': 'restaurant',
        '零售': 'retail',
        '许可证': 'permit',
        '执照': 'license',
        '谢谢': 'thank you',
        '再见': 'goodbye'
      },
      'en-zh-hk': {
        'hello': '你好',
        'help': '幫助',
        'business': '商業',
        'restaurant': '餐廳',
        'retail': '零售',
        'permit': '許可證',
        'license': '執照',
        'thank you': '謝謝',
        'goodbye': '再見'
      },
              'zh-hk-en': {
        '你好': 'hello',
        '幫助': 'help',
        '商業': 'business',
        '餐廳': 'restaurant',
        '零售': 'retail',
        '許可證': 'permit',
        '執照': 'license',
        '謝謝': 'thank you',
        '再見': 'goodbye'
      },
      'en-ar': {
        'hello': 'مرحبا',
        'help': 'مساعدة',
        'business': 'عمل تجاري',
        'restaurant': 'مطعم',
        'retail': 'بيع بالتجزئة',
        'permit': 'تصريح',
        'license': 'رخصة',
        'thank you': 'شكرا لك',
        'goodbye': 'وداعا'
      },
      'ar-en': {
        'مرحبا': 'hello',
        'مساعدة': 'help',
        'عمل تجاري': 'business',
        'مطعم': 'restaurant',
        'بيع بالتجزئة': 'retail',
        'تصريح': 'permit',
        'رخصة': 'license',
        'شكرا لك': 'thank you',
        'وداعا': 'goodbye'
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
            content: `You are a professional translator. Translate the following text from ${fromLang} to ${toLang}. 

IMPORTANT LANGUAGE-SPECIFIC INSTRUCTIONS:
${getLanguageInstructions(fromLang, toLang)}

Only return the translated text, nothing else.`
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