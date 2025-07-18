import React from 'react';

function FAQSuggestions({ businessType, onSelect }) {
  const faqs = {
    restaurant: [
      'What food permits do I need in Oakland?',
      'How do I handle food waste disposal?',
      'What are the health inspection requirements?',
      'How do I get a liquor license?'
    ],
    retail: [
      'How do I get a seller\'s permit in Oakland?',
      'What are the local tax requirements?',
      'How do I handle sales tax collection?',
      'What are the zoning requirements for retail?'
    ]
  };

  const currentFAQs = faqs[businessType] || [];

  return (
    <div className="faq-suggestions">
      <h3>Popular Questions for {businessType} businesses:</h3>
      <div className="faq-buttons">
        {currentFAQs.map((faq, index) => (
          <button
            key={index}
            onClick={() => onSelect(faq)}
            className="faq-button"
          >
            {faq}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FAQSuggestions; 