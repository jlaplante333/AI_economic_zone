import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import FlagDisplay from '../components/FlagDisplay';
import '../css/pages/ProfessionalLanguagePage.css';
import '../css/components/FlagDisplay.css';

// Updated language data with Oakland-specific selection
const languages = [
  { code: 'en', name: 'English', native: 'English', priority: 1 },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', priority: 2 },
  { code: 'ar', name: 'Arabic', native: 'العربية', priority: 3 },
  { code: 'mam', name: 'Mam', native: 'Mam', priority: 4 },
  { code: 'es', name: 'Spanish', native: 'Español', priority: 5 },
  { code: 'zh', name: 'Chinese', native: '中文', priority: 6 },
  { code: 'prs', name: 'Dari', native: 'دری', priority: 7 },
  { code: 'lo', name: 'Laos', native: 'ລາວ', priority: 8 },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', priority: 9 },
  { code: 'km', name: 'Khmer', native: 'ខ្មែរ', priority: 10 },
];

function ProfessionalLanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();
  const { theme } = useTheme();

  const handleLanguageSelect = async (language) => {
    setIsLoading(true);
    setSelectedLanguage(language);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    changeLanguage(language.code);
    
    // Navigate to login with smooth transition
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  const getPriorityLanguages = () => {
    return languages.filter(lang => lang.priority <= 5);
  };

  const getOtherLanguages = () => {
    return languages.filter(lang => lang.priority > 5);
  };

  return (
    <div className="professional-language-page">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`shape shape-${i + 1}`}></div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Main Content */}
        <main className="main-content" style={{ gap: '1rem' }}>
          <div className="welcome-section">
            <h2 className="welcome-title" style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              {selectedLanguage ? `Welcome to ${selectedLanguage.native}` : 'Choose Your Language'}
            </h2>
            <p className="welcome-description">
              {selectedLanguage 
                ? 'Preparing your personalized AI experience...' 
                : 'Select your preferred language to begin your AI-powered journey'
              }
            </p>
          </div>

          {/* Language Grid */}
          {!selectedLanguage && (
            <div className="language-section">
              {/* Priority Languages */}
              <div className="priority-languages">
                <h3 className="section-title">Most Common Languages</h3>
                <div className="language-grid priority-grid">
                  {getPriorityLanguages().map((language) => (
                    <LanguageCard
                      key={language.code}
                      language={language}
                      onSelect={handleLanguageSelect}
                      isPriority={true}
                    />
                  ))}
                </div>
              </div>

              {/* Other Languages */}
              <div className="other-languages">
                <h3 className="section-title">Additional Languages</h3>
                <div className="language-grid">
                  {getOtherLanguages().map((language) => (
                    <LanguageCard
                      key={language.code}
                      language={language}
                      onSelect={handleLanguageSelect}
                      isPriority={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">Configuring AI for {selectedLanguage?.native}...</p>
            </div>
          )}
        </main>



        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">
            Powered by Advanced AI Technology • Secure & Private
          </p>
        </footer>
      </div>
    </div>
  );
}

// Language Card Component
function LanguageCard({ language, onSelect, isPriority }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`language-card ${isPriority ? 'priority' : ''} ${isHovered ? 'hovered' : ''}`}
      onClick={() => onSelect(language)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        <div className="flag-section">
          <FlagDisplay countryCode={language.code} />
        </div>
        <div className="language-info">
          <h4 className="language-name">{language.native}</h4>
          <p className="language-english">{language.name}</p>
        </div>
        <div className="select-indicator">
          <div className="arrow">→</div>
        </div>
      </div>
    </div>
  );
}

export default ProfessionalLanguagePage; 