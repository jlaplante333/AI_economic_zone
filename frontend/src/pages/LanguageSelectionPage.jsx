import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import FlagDisplay from '../components/FlagDisplay';
import CountryIcon from '../components/CountryIcon';
import { languages } from '../language/languages';
import '../css/components/FlagDisplay.css';
import '../css/components/CountryIcon.css';

function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [highlightedLanguages, setHighlightedLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();
  const { theme } = useTheme();

  // Matrix effect - randomly highlight one language at a time
  useEffect(() => {
    const matrixEffect = () => {
      const visibleLanguages = getVisibleLanguages();
      if (visibleLanguages.length === 0) return;
      
      const shuffled = [...visibleLanguages].sort(() => 0.5 - Math.random());
      const selected = shuffled[0]; // Select only one language
      setHighlightedLanguages([selected.code]);
      
      // Clear highlights after 2-4 seconds
      setTimeout(() => {
        setHighlightedLanguages([]);
      }, Math.random() * 2000 + 2000);
    };

    // Start matrix effect after initial delay
    const initialDelay = setTimeout(() => {
      matrixEffect();
      
      // Continue matrix effect every 4-8 seconds
      const interval = setInterval(() => {
        matrixEffect();
      }, Math.random() * 4000 + 4000);
      
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(initialDelay);
  }, [searchTerm]); // Add searchTerm as dependency

  const getWelcomeText = () => {
    return 'Welcome';
  };

  const handleLanguageClick = (language, event) => {
    console.log('Language clicked:', language); // Debug log
    // Add visual feedback
    const element = event.target.closest('.language-item');
    if (element) {
      element.style.transform = 'scale(0.95)';
      setTimeout(() => {
        element.style.transform = '';
      }, 150);
    }
    setSelectedLanguage(language);
    changeLanguage(language.code);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const getVisibleLanguages = () => {
    // Filter languages based on search term
    let filteredLanguages = languages;
    if (searchTerm.trim()) {
      filteredLanguages = languages.filter(language => 
        language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        language.native.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Show more languages when searching, otherwise limit to 16
    const maxLanguages = searchTerm.trim() ? filteredLanguages.length : 16;
    return filteredLanguages.slice(0, maxLanguages).map((language, index) => ({
      ...language,
      position: index,
      isActive: false
    }));
  };

  return (
    <div className="language-selection-page">
      <div className="language-container">
        <div className="logo-section">
          <div className="logo-text">Oakland AI</div>
          <div className="logo-subtitle">Multilingual AI Assistant</div>
        </div>
        

        
        <div className="welcome-text">
          {selectedLanguage ? selectedLanguage.native : getWelcomeText()}
        </div>
        
        {!selectedLanguage && (
          <div className="welcome-subtitle">
            Choose your preferred language to get started
          </div>
        )}
        
        <div className="language-grid">
          {getVisibleLanguages().length > 0 ? (
            getVisibleLanguages().map((language, index) => {
              const commonLanguages = [];
              const isCommon = commonLanguages.includes(language.code);
              const isHighlighted = highlightedLanguages.includes(language.code);
              
              return (
                <div
                  key={`${language.code}-${index}`}
                  className={`language-item ${isCommon ? 'common' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={(event) => handleLanguageClick(language, event)}
                  onMouseEnter={() => setHoveredLanguage(language)}
                  onMouseLeave={() => setHoveredLanguage(null)}
                >
                  {/* Realistic flag in top right corner */}
                  <FlagDisplay countryCode={language.code} />
                  
                  {/* Iconic country image in top left */}
                  <CountryIcon countryCode={language.code} />
                  
                  {/* Language text below icon */}
                  <span className="language-text">
                    {language.native}
                  </span>
                </div>
              );
            })
          ) : searchTerm.trim() ? (
            <div className="no-results">
              <div className="no-results-text">
                No languages found for "{searchTerm}"
              </div>
              <div className="no-results-subtext">
                Try searching with different terms
              </div>
            </div>
          ) : null}
        </div>

        {!selectedLanguage && (
          <div className="instruction-text">
            Select your preferred language to continue
          </div>
        )}

        {/* Search Bar at Bottom */}
        {!selectedLanguage && (
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LanguageSelectionPage; 