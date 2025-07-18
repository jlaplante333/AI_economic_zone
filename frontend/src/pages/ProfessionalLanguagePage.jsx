import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import FlagDisplay from '../components/FlagDisplay';
import '../css/pages/ProfessionalLanguagePage.css';
import '../css/components/FlagDisplay.css';

// Curated language data with AI-optimized selection
const languages = [
  { code: 'en', name: 'English', native: 'English', priority: 1 },
  { code: 'es', name: 'Spanish', native: 'Español', priority: 2 },
  { code: 'zh', name: 'Chinese', native: '中文', priority: 3 },
  { code: 'ar', name: 'Arabic', native: 'العربية', priority: 4 },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', priority: 5 },
  { code: 'fr', name: 'French', native: 'Français', priority: 6 },
  { code: 'de', name: 'German', native: 'Deutsch', priority: 7 },
  { code: 'ja', name: 'Japanese', native: '日本語', priority: 8 },
  { code: 'ko', name: 'Korean', native: '한국어', priority: 9 },
  { code: 'pt', name: 'Portuguese', native: 'Português', priority: 10 },
  { code: 'ru', name: 'Russian', native: 'Русский', priority: 11 },
  { code: 'it', name: 'Italian', native: 'Italiano', priority: 12 },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', priority: 13 },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', priority: 14 },
  { code: 'th', name: 'Thai', native: 'ไทย', priority: 15 },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', priority: 16 },
];

function ProfessionalLanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();
  const { theme } = useTheme();

  // Filter languages based on search
  useEffect(() => {
    const filtered = languages.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLanguages(filtered);
  }, [searchTerm]);

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
    return languages.filter(lang => lang.priority <= 8);
  };

  const getOtherLanguages = () => {
    return languages.filter(lang => lang.priority > 8);
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
        {/* Header Section */}
        <header className="header">
          <div className="logo-section">
            <div className="logo-icon">🤖</div>
            <h1 className="logo-text">Oakland AI</h1>
            <p className="logo-subtitle">Intelligent Multilingual Assistant</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="welcome-section">
            <h2 className="welcome-title">
              {selectedLanguage ? `Welcome to ${selectedLanguage.native}` : 'Choose Your Language'}
            </h2>
            <p className="welcome-description">
              {selectedLanguage 
                ? 'Preparing your personalized AI experience...' 
                : 'Select your preferred language to begin your AI-powered journey'
              }
            </p>
          </div>

          {/* Search Bar */}
          {!selectedLanguage && (
            <div className="search-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="search-icon">🔍</div>
              </div>
            </div>
          )}

          {/* Language Grid */}
          {!selectedLanguage && (
            <div className="language-section">
              {/* Priority Languages */}
              <div className="priority-languages">
                <h3 className="section-title">Popular Languages</h3>
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
              {searchTerm === '' && (
                <div className="other-languages">
                  <h3 className="section-title">All Languages</h3>
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
              )}

              {/* Search Results */}
              {searchTerm !== '' && (
                <div className="search-results">
                  <h3 className="section-title">Search Results</h3>
                  <div className="language-grid">
                    {filteredLanguages.map((language) => (
                      <LanguageCard
                        key={language.code}
                        language={language}
                        onSelect={handleLanguageSelect}
                        isPriority={language.priority <= 8}
                      />
                    ))}
                  </div>
                </div>
              )}
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