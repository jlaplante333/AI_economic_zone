const { apiKey, apiUrl } = require('../config/openaiConfig');
const axios = require('axios');

// Function to validate AI response for logical inconsistencies
function validateResponse(response, userData) {
  console.log('🔍 Validating response for logical consistency...');
  
  const issues = [];
  
  // Check for ethnicity-based inconsistencies
  if (userData?.ethnicity) {
    const ethnicity = userData.ethnicity.toLowerCase();
    const responseLower = response.toLowerCase();
    
    if ((ethnicity === 'white' || ethnicity === 'caucasian') && 
        (responseLower.includes('minority grant') || 
         responseLower.includes('minority program') || 
         responseLower.includes('minority business') ||
         responseLower.includes('hispanic grant') ||
         responseLower.includes('black business') ||
         responseLower.includes('asian business'))) {
      issues.push('Minority-specific program recommended for White user');
    }
  }
  
  // Check for gender-based inconsistencies
  if (userData?.gender) {
    const gender = userData.gender.toLowerCase();
    const responseLower = response.toLowerCase();
    
    if (gender === 'male' && 
        (responseLower.includes('women grant') || 
         responseLower.includes('women program') || 
         responseLower.includes('female business'))) {
      issues.push('Women-specific program recommended for Male user');
    }
  }
  
  // Check for revenue-based inconsistencies
  if (userData?.annual_revenue_2024 || userData?.annual_revenue_2023 || userData?.annual_revenue_2022) {
    const revenue = userData.annual_revenue_2024 || userData.annual_revenue_2023 || userData.annual_revenue_2022;
    const responseLower = response.toLowerCase();
    
    if (revenue > 1000000 && 
        (responseLower.includes('small business grant') || 
         responseLower.includes('startup grant') ||
         responseLower.includes('micro business'))) {
      issues.push('Small business program recommended for large business');
    }
  }
  
  if (issues.length > 0) {
    console.log('⚠️ Logical inconsistencies found:', issues);
    return {
      hasIssues: true,
      issues: issues,
      correctedResponse: response + '\n\n⚠️ CORRECTION: I need to clarify that some of the programs I mentioned may not be suitable for your specific profile. Please contact the Oakland Business Assistance Center at (510) 238-7398 for personalized recommendations that match your business profile exactly.'
    };
  }
  
  console.log('✅ Response validation passed');
  return {
    hasIssues: false,
    issues: [],
    correctedResponse: response
  };
}

async function getOpenAIResponse(prompt, businessType, revenue = null, postalCode = null, userData = null, language = 'en') {
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

    // Language-specific instructions
    let languageInstructions = '';
    switch (language) {
      case 'zh-cn':
        languageInstructions = `IMPORTANT: Respond in MANDARIN CHINESE (Simplified Chinese). Use proper Mandarin grammar, vocabulary, and cultural context. Write in a formal but friendly tone appropriate for business communication in Chinese culture.`;
        break;
      case 'zh-hk':
        languageInstructions = `IMPORTANT: Respond in CANTONESE CHINESE (Traditional Chinese). Use proper Cantonese grammar, vocabulary, and cultural context. Write in a formal but friendly tone appropriate for business communication in Hong Kong culture.`;
        break;
      case 'vi':
        languageInstructions = `IMPORTANT: Respond in SOUTHERN VIETNAMESE (Saigon dialect). Use Southern Vietnamese vocabulary, grammar, and cultural context. Avoid Northern/Communist style language. Write in a warm, friendly tone typical of Southern Vietnamese business communication.`;
        break;
      case 'ar':
        languageInstructions = `IMPORTANT: Respond in MODERN STANDARD ARABIC. Use proper Arabic grammar, vocabulary, and cultural context. Write in a formal but approachable tone appropriate for business communication in Arab culture.`;
        break;
      case 'es':
        languageInstructions = `IMPORTANT: Respond in LATIN AMERICAN SPANISH (Mexican/Central American style). Use vocabulary and expressions common in Latin American business contexts. Write in a warm, friendly tone typical of Latin American business communication.`;
        break;
      default:
        languageInstructions = `IMPORTANT: Respond in ${language.toUpperCase()}. Use proper grammar, vocabulary, and cultural context for this language.`;
    }

    const systemPrompt = `You are an Oakland, California local small business expert. You help immigrant-owned businesses navigate Oakland-specific regulations, permits, and business requirements.

${languageInstructions}

${contextInfo}

CRITICAL VALIDATION RULES - ALWAYS CHECK BEFORE RECOMMENDING:

1. ETHNICITY-BASED PROGRAMS:
   - If user ethnicity is "White" or "Caucasian": DO NOT recommend minority-specific grants, programs, or resources
   - If user ethnicity is "Hispanic", "Black", "Asian", "Native American", etc.: You MAY recommend minority-specific programs
   - If ethnicity is not specified: Ask for clarification before recommending ethnicity-based programs

2. GENDER-BASED PROGRAMS:
   - If user gender is "Male": DO NOT recommend women-specific grants or programs
   - If user gender is "Female": You MAY recommend women-specific programs
   - If gender is not specified: Ask for clarification before recommending gender-based programs

3. AGE-BASED PROGRAMS:
   - If user age is under 35: You MAY recommend young entrepreneur programs
   - If user age is over 65: You MAY recommend senior-specific programs
   - If age is not specified: Ask for clarification before recommending age-based programs

4. REVENUE-BASED PROGRAMS:
   - If annual revenue > $1M: DO NOT recommend small business grants (<$50K)
   - If annual revenue < $100K: DO NOT recommend large business programs
   - Always match program requirements to actual business size

5. LOCATION-BASED PROGRAMS:
   - Only recommend programs available in Oakland, California
   - Consider specific Oakland neighborhoods and postal codes
   - DO NOT recommend programs from other cities or states

LOGICAL CONSISTENCY CHECK:
Before making any recommendation, verify:
- Does this program match the user's ethnicity? (if ethnicity-specific)
- Does this program match the user's gender? (if gender-specific)  
- Does this program match the user's age? (if age-specific)
- Does this program match the user's business size/revenue?
- Is this program available in Oakland, California?

If any of these checks fail, either:
1. Recommend an alternative that DOES match the user's profile, OR
2. Explain why the requested program doesn't match their profile and suggest alternatives

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

    const aiResponse = response.data.choices[0].message.content;
    
    // Validate the response for logical inconsistencies
    const validation = validateResponse(aiResponse, userData);
    
    if (validation.hasIssues) {
      console.log('⚠️ Returning corrected response due to logical inconsistencies');
      return validation.correctedResponse;
    }
    
    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    return `I'm having trouble connecting right now. Please try again in a moment. (Error: ${error.message})`;
  }
}

module.exports = { getOpenAIResponse }; 