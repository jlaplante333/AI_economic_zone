import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import FlagDisplay from '../components/FlagDisplay';
import { oaklandLanguages } from '../language/languages';
import '../css/pages/ProfessionalLanguagePage.css';
import '../css/components/FlagDisplay.css';

// Use Oakland-specific languages from centralized file
const languages = oaklandLanguages;

function ProfessionalLanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();
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

  return (
    <div className="main-container">
      {/* Left side - Welcome section */}
      <div className="welcome-section">
        <div className="logo-section">
          <div className="logo-text" style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>Oakland AI</div>
        </div>
        
        <h1 className="main-heading">
          Smart help for<br />
          small businesses<br />
          in Oakland.
        </h1>
        <p className="sub-heading">
          Speak your language.<br />
          Get answers. No paperwork.
        </p>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Choose your preferred language to get started
        </p>
      </div>

      {/* Right side - Language selection section */}
      <div className="login-section">
        <div className="login-container">
          <h2 className="login-title">
            {selectedLanguage ? `Welcome to ${selectedLanguage.native}` : t('languageSelection.title')}
          </h2>
          <p className="login-subtitle">
            {selectedLanguage 
              ? t('languageSelection.preparingExperience')
              : t('languageSelection.subtitle')
            }
          </p>

          {/* Language Grid */}
          {!selectedLanguage && (
            <div className="language-grid-container">
              <div className="language-grid">
                {languages.map((language) => (
                  <LanguageCard
                    key={language.code}
                    language={language}
                    onSelect={handleLanguageSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">{t('languageSelection.configuringAI', { language: selectedLanguage?.native })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Language Card Component
function LanguageCard({ language, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="language-card"
      onClick={() => onSelect(language)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.8)',
        border: isHovered ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '10px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <FlagDisplay countryCode={language.code} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '13px', 
          fontWeight: '600', 
          color: '#f1f5f9',
          marginBottom: '1px'
        }}>
          {language.native}
        </h4>
        <p style={{ 
          margin: 0, 
          fontSize: '11px', 
          color: '#94a3b8'
        }}>
          {language.name}
        </p>
      </div>
      <div style={{ 
        color: isHovered ? '#3b82f6' : '#64748b',
        fontSize: '18px',
        fontWeight: '600',
        transition: 'color 0.2s ease'
      }}>
        →
      </div>
    </div>
  );
}

export default ProfessionalLanguagePage; 