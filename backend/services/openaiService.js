const { apiKey, apiUrl } = require('../config/openaiConfig');
const axios = require('axios');

async function getOpenAIResponse(prompt, businessType, revenue = null, postalCode = null, userData = null) {
  console.log('=== getOpenAIResponse called ===');
  console.log('Prompt:', prompt);
  console.log('Business Type:', businessType);
  console.log('Revenue:', revenue);
  console.log('Postal Code:', postalCode);
  console.log('User Data:', userData);
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
    // Build comprehensive context information
    let contextInfo = `Business Type: ${businessType}`;
    
    if (revenue) {
      const formattedRevenue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(revenue);
      contextInfo += `\nAnnual Revenue: ${formattedRevenue}`;
    }
    
    if (postalCode) {
      contextInfo += `\nPostal Code: ${postalCode}`;
    }
    
    // Add comprehensive user data if available
    if (userData) {
      contextInfo += `\n\nCOMPLETE USER PROFILE:`;
      contextInfo += `\nName: ${userData.first_name} ${userData.last_name}`;
      contextInfo += `\nEmail: ${userData.email}`;
      contextInfo += `\nPhone: ${userData.phone || 'Not provided'}`;
      contextInfo += `\nLanguage: ${userData.language || 'English'}`;
      
      // Address information
      if (userData.address_line1) contextInfo += `\nAddress: ${userData.address_line1}`;
      if (userData.address_line2) contextInfo += `\nAddress Line 2: ${userData.address_line2}`;
      if (userData.city) contextInfo += `\nCity: ${userData.city}`;
      if (userData.state) contextInfo += `\nState: ${userData.state}`;
      if (userData.zip_code) contextInfo += `\nZIP Code: ${userData.zip_code}`;
      
      // Demographics
      if (userData.age) contextInfo += `\nAge: ${userData.age} years old`;
      if (userData.ethnicity) contextInfo += `\nEthnicity: ${userData.ethnicity}`;
      if (userData.gender) contextInfo += `\nGender: ${userData.gender}`;
      
      // Business details
      if (userData.employee_count) contextInfo += `\nEmployee Count: ${userData.employee_count} employees`;
      if (userData.years_in_business) contextInfo += `\nYears in Business: ${userData.years_in_business} years`;
      if (userData.corporation_type) contextInfo += `\nCorporation Type: ${userData.corporation_type}`;
      
      // Financial information
      if (userData.annual_revenue_2022) {
        const revenue2022 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(userData.annual_revenue_2022);
        contextInfo += `\nAnnual Revenue 2022: ${revenue2022}`;
      }
      if (userData.annual_revenue_2023) {
        const revenue2023 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(userData.annual_revenue_2023);
        contextInfo += `\nAnnual Revenue 2023: ${revenue2023}`;
      }
      if (userData.annual_revenue_2024) {
        const revenue2024 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(userData.annual_revenue_2024);
        contextInfo += `\nAnnual Revenue 2024: ${revenue2024}`;
      }
    }

    const systemPrompt = `You are an Oakland, California local small business expert. You help immigrant-owned businesses navigate Oakland-specific regulations, permits, and business requirements.

${contextInfo}

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

CONTEXTUAL ADVICE: Use the complete user profile information to provide highly personalized and targeted advice:
- For revenue-based questions (grants, loans, tax breaks), consider the business size, income level, and financial history
- For location-specific questions, consider the exact address and postal code area within Oakland
- For demographic-based programs, consider age, ethnicity, and gender for targeted assistance
- For business structure questions, consider corporation type, employee count, and years in business
- For language-specific resources, consider the user's preferred language
- Tailor all recommendations based on the business's financial capacity, location, and specific circumstances

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