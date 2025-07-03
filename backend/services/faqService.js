const faqs = {
  restaurant: [
    'What food permits do I need in Oakland?',
    'How do I handle food waste disposal?'
  ],
  retail: [
    'How do I get a seller\'s permit in Oakland?',
    'What are the local tax requirements?'
  ],
  // Add more business types as needed
};

function getFAQsForBusinessType(businessType) {
  return faqs[businessType] || [];
}

module.exports = { getFAQsForBusinessType }; 