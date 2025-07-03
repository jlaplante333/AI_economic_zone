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
    <div style={{ marginTop: '20px' }}>
      <h3>Popular Questions for {businessType} businesses:</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {currentFAQs.map((faq, index) => (
          <button
            key={index}
            onClick={() => onSelect(faq)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          >
            {faq}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FAQSuggestions; 