import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import FlagDisplay from '../components/FlagDisplay';
import CountryIcon from '../components/CountryIcon';
import '../css/components/FlagDisplay.css';
import '../css/components/CountryIcon.css';

// Language data with flag emojis
const languages = [
  // Most common languages in Oakland, CA (based on demographic data)
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', native: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', native: '中文', flag: '🇨🇳' },
  { code: 'tr', name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Filipino', native: 'Filipino', flag: '🇵🇭' },
  { code: 'ar', name: 'العربية', native: 'العربية', flag: '🇸🇦' },
  { code: 'ko', name: '한국어', native: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'ไทย', native: 'ไทย', flag: '🇹🇭' },
  { code: 'ja', name: '日本語', native: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', native: 'Русский', flag: '🇷🇺' },
  { code: 'fr', name: 'Français', native: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', native: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', native: 'Italiano', flag: '🇮🇹' },
  
  { code: 'nl', name: 'Nederlands', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', native: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', native: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', native: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', native: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polski', native: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', native: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', native: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', native: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', native: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', native: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', native: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'el', name: 'Ελληνικά', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', native: 'עברית', flag: '🇮🇱' },
  { code: 'id', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'bn', name: 'বাংলা', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو', native: 'اردو', flag: '🇵🇰' },
  { code: 'fa', name: 'فارسی', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ku', name: 'Kurdî', native: 'Kurdî', flag: '🇮🇶' },
  { code: 'am', name: 'አማርኛ', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'sw', name: 'Kiswahili', native: 'Kiswahili', flag: '🇹🇿' },
  { code: 'zu', name: 'isiZulu', native: 'isiZulu', flag: '🇿🇦' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦' },
  { code: 'is', name: 'Íslenska', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'mt', name: 'Malti', native: 'Malti', flag: '🇲🇹' },
  { code: 'ga', name: 'Gaeilge', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Cymraeg', native: 'Cymraeg', flag: '🇬🇧' },
  { code: 'eu', name: 'Euskara', native: 'Euskara', flag: '🇪🇸' },
  { code: 'ca', name: 'Català', native: 'Català', flag: '🇪🇸' },
  { code: 'gl', name: 'Galego', native: 'Galego', flag: '🇪🇸' },
  { code: 'sq', name: 'Shqip', native: 'Shqip', flag: '🇦🇱' },
  { code: 'mk', name: 'Македонски', native: 'Македонски', flag: '🇲🇰' },
  { code: 'bs', name: 'Bosanski', native: 'Bosanski', flag: '🇧🇦' },
  { code: 'me', name: 'Crnogorski', native: 'Crnogorski', flag: '🇲🇪' },
  { code: 'ka', name: 'ქართული', native: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Հայերեն', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azərbaycan', native: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'kk', name: 'Қазақ', native: 'Қазақ', flag: '🇰🇿' },
  { code: 'ky', name: 'Кыргызча', native: 'Кыргызча', flag: '🇰🇬' },
  { code: 'uz', name: 'O\'zbek', native: 'O\'zbek', flag: '🇺🇿' },
];

function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [highlightedLanguages, setHighlightedLanguages] = useState([]);
  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();
  const { theme } = useTheme();

  // Matrix effect - randomly highlight one language at a time
  useEffect(() => {
    const matrixEffect = () => {
      const visibleLanguages = getVisibleLanguages();
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
  }, []);

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
    // Show only the first 16 languages
    return languages.slice(0, 16).map((language, index) => ({
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
        </div>
        
        <div className="welcome-text">
          {selectedLanguage ? selectedLanguage.native : getWelcomeText()}
        </div>
        
        <div className="language-grid">
          {getVisibleLanguages().map((language, index) => {
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
          })}
        </div>

        {!selectedLanguage && (
          <div className="instruction-text">
            Select your preferred language to continue
          </div>
        )}
      </div>
    </div>
  );
}

export default LanguageSelectionPage; 