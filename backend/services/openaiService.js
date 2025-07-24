const { apiKey, apiUrl } = require('../config/openaiConfig');
const axios = require('axios');

async function getOpenAIResponse(prompt, businessType) {
  console.log('=== getOpenAIResponse called ===');
  console.log('Prompt:', prompt);
  console.log('Business Type:', businessType);
  // Debug: Log API key status
  console.log('API Key configured:', !!apiKey);
  console.log('API Key starts with sk-:', apiKey ? apiKey.startsWith('sk-') : false);
  
  // Check if API key is configured
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('Using fallback response - API key not configured');
    // Return a helpful fallback response
    const fallbackResponses = {
      restaurant: `Hello! I'm here to help with your ${businessType} business in Oakland. I can assist with permits, regulations, and local business requirements. What specific question do you have about running your restaurant in Oakland?`,
      retail: `Hello! I'm here to help with your ${businessType} business in Oakland. I can assist with permits, regulations, and local business requirements. What specific question do you have about running your retail business in Oakland?`,
      default: `Hello! I'm here to help with your ${businessType} business in Oakland. I can assist with permits, regulations, and local business requirements. What specific question do you have?`
    };
    
    return fallbackResponses[businessType] || fallbackResponses.default;
  }

  try {
    const systemPrompt = `You are an Oakland local small business expert. You help immigrant-owned businesses navigate local regulations, permits, and business requirements. 

Business Type: ${businessType}

IMPORTANT: Always explain things in very simple terms (ELI5 - Explain Like I'm 5). Use:
- Simple, everyday words that anyone can understand
- Short sentences
- Step-by-step explanations
- Avoid complex legal or technical jargon
- If you must use a technical term, explain it in simple terms
- Use examples and analogies when helpful
- Write as if explaining to someone who hasn't finished high school

Provide helpful, accurate, and practical advice specific to Oakland, California. Be friendly, supportive, and explain things clearly. If you don't know something specific, suggest where they can find more information.`;

    const response = await axios.post(
      `${apiUrl}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return `I'm having trouble connecting right now. Please try again in a moment. (Error: ${error.message})`;
  }
}

module.exports = { getOpenAIResponse }; 