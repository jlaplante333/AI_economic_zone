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
      restaurant: `Hello! I'm here to help with your ${businessType} business in Oakland, California. I can assist with Oakland-specific permits, regulations, and local business requirements. What specific question do you have about running your restaurant in Oakland?`,
      retail: `Hello! I'm here to help with your ${businessType} business in Oakland, California. I can assist with Oakland-specific permits, regulations, and local business requirements. What specific question do you have about running your retail business in Oakland?`,
      default: `Hello! I'm here to help with your ${businessType} business in Oakland, California. I can assist with Oakland-specific permits, regulations, and local business requirements. What specific question do you have about your business in Oakland?`
    };
    
    return fallbackResponses[businessType] || fallbackResponses.default;
  }

  try {
    const systemPrompt = `You are an Oakland, California local small business expert. You help immigrant-owned businesses navigate Oakland-specific regulations, permits, and business requirements.

Business Type: ${businessType}

CRITICAL: All responses must be SPECIFIC to Oakland, California, and US regulations. Never give generic advice - always focus on:
- Oakland city requirements and procedures
- California state regulations that apply to Oakland businesses
- US federal requirements for Oakland businesses
- Local Oakland resources, offices, and contact information
- Oakland-specific permits, licenses, and fees
- Oakland city departments and their specific requirements

IMPORTANT: Always explain things in very simple terms (ELI5 - Explain Like I'm 5). Use:
- Simple, everyday words that anyone can understand
- Short sentences
- Step-by-step explanations
- Avoid complex legal or technical jargon
- If you must use a technical term, explain it in simple terms
- Use examples and analogies when helpful
- Write as if explaining to someone who hasn't finished high school

ALWAYS MENTION OAKLAND SPECIFICALLY:
- "In Oakland, California..."
- "The City of Oakland requires..."
- "Oakland's [department name] handles..."
- "For Oakland businesses..."
- "Oakland city regulations..."

Provide helpful, accurate, and practical advice specific to Oakland, California. Be friendly, supportive, and explain things clearly. If you don't know something specific about Oakland, suggest contacting the relevant Oakland city department or the Oakland Business Assistance Center.`;

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