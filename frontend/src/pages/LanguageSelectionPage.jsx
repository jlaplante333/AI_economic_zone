import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './LanguageSelectionPage.css';

const languages = [
  // Most common languages in Oakland, CA (based on demographic data)
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Español', native: 'Español' },
  { code: 'zh', name: '中文', native: '中文' },
  { code: 'vi', name: 'Tiếng Việt', native: 'Tiếng Việt' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'ar', name: 'العربية', native: 'العربية' },
  { code: 'ko', name: '한국어', native: '한국어' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी' },
  { code: 'th', name: 'ไทย', native: 'ไทย' },
  { code: 'ja', name: '日本語', native: '日本語' },
  { code: 'ru', name: 'Русский', native: 'Русский' },
  { code: 'fr', name: 'Français', native: 'Français' },
  { code: 'pt', name: 'Português', native: 'Português' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch' },
  { code: 'it', name: 'Italiano', native: 'Italiano' },
  { code: 'tr', name: 'Türkçe', native: 'Türkçe' },
  { code: 'nl', name: 'Nederlands', native: 'Nederlands' },
  { code: 'sv', name: 'Svenska', native: 'Svenska' },
  { code: 'no', name: 'Norsk', native: 'Norsk' },
  { code: 'da', name: 'Dansk', native: 'Dansk' },
  { code: 'fi', name: 'Suomi', native: 'Suomi' },
  { code: 'pl', name: 'Polski', native: 'Polski' },
  { code: 'cs', name: 'Čeština', native: 'Čeština' },
  { code: 'sk', name: 'Slovenčina', native: 'Slovenčina' },
  { code: 'hu', name: 'Magyar', native: 'Magyar' },
  { code: 'ro', name: 'Română', native: 'Română' },
  { code: 'bg', name: 'Български', native: 'Български' },
  { code: 'hr', name: 'Hrvatski', native: 'Hrvatski' },
  { code: 'sr', name: 'Српски', native: 'Српски' },
  { code: 'sl', name: 'Slovenščina', native: 'Slovenščina' },
  { code: 'et', name: 'Eesti', native: 'Eesti' },
  { code: 'lv', name: 'Latviešu', native: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių', native: 'Lietuvių' },
  { code: 'el', name: 'Ελληνικά', native: 'Ελληνικά' },
  { code: 'he', name: 'עברית', native: 'עברית' },
  { code: 'id', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu', native: 'Bahasa Melayu' },
  { code: 'bn', name: 'বাংলা', native: 'বাংলা' },
  { code: 'ur', name: 'اردو', native: 'اردو' },
  { code: 'fa', name: 'فارسی', native: 'فارسی' },
  { code: 'ku', name: 'Kurdî', native: 'Kurdî' },
  { code: 'am', name: 'አማርኛ', native: 'አማርኛ' },
  { code: 'sw', name: 'Kiswahili', native: 'Kiswahili' },
  { code: 'zu', name: 'isiZulu', native: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'is', name: 'Íslenska', native: 'Íslenska' },
  { code: 'mt', name: 'Malti', native: 'Malti' },
  { code: 'ga', name: 'Gaeilge', native: 'Gaeilge' },
  { code: 'cy', name: 'Cymraeg', native: 'Cymraeg' },
  { code: 'eu', name: 'Euskara', native: 'Euskara' },
  { code: 'ca', name: 'Català', native: 'Català' },
  { code: 'gl', name: 'Galego', native: 'Galego' },
  { code: 'sq', name: 'Shqip', native: 'Shqip' },
  { code: 'mk', name: 'Македонски', native: 'Македонски' },
  { code: 'bs', name: 'Bosanski', native: 'Bosanski' },
  { code: 'me', name: 'Crnogorski', native: 'Crnogorski' },
  { code: 'ka', name: 'ქართული', native: 'ქართული' },
  { code: 'hy', name: 'Հայերեն', native: 'Հայերեն' },
  { code: 'az', name: 'Azərbaycan', native: 'Azərbaycan' },
  { code: 'kk', name: 'Қазақ', native: 'Қазақ' },
  { code: 'ky', name: 'Кыргызча', native: 'Кыргызча' },
  { code: 'uz', name: 'O\'zbek', native: 'O\'zbek' },
  { code: 'mn', name: 'Монгол', native: 'Монгол' },
  { code: 'ne', name: 'नेपाली', native: 'नेपाली' },
  { code: 'si', name: 'සිංහල', native: 'සිංහල' },
  { code: 'my', name: 'မြန်မာ', native: 'မြန်မာ' },
  { code: 'km', name: 'ខ្មែរ', native: 'ខ្មែរ' },
  { code: 'lo', name: 'ລາວ', native: 'ລາວ' },
  { code: 'jw', name: 'Jawa', native: 'Jawa' },
  { code: 'su', name: 'Sunda', native: 'Sunda' },
  { code: 'ceb', name: 'Cebuano', native: 'Cebuano' },
  { code: 'haw', name: 'ʻŌlelo Hawaiʻi', native: 'ʻŌlelo Hawaiʻi' },
  { code: 'mi', name: 'Māori', native: 'Māori' },
  { code: 'sm', name: 'Gagana Samoa', native: 'Gagana Samoa' },
  { code: 'fj', name: 'Vosa Vakaviti', native: 'Vosa Vakaviti' },
  { code: 'to', name: 'Lea faka-Tonga', native: 'Lea faka-Tonga' },
  { code: 'ty', name: 'Reo Tahiti', native: 'Reo Tahiti' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy' },
  { code: 'yo', name: 'Yorùbá', native: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'so', name: 'Soomaali', native: 'Soomaali' },
  { code: 'om', name: 'Afaan Oromoo', native: 'Afaan Oromoo' },
  { code: 'ti', name: 'ትግርኛ', native: 'ትግርኛ' },
  { code: 'sn', name: 'chiShona', native: 'chiShona' },
  { code: 'xh', name: 'isiXhosa', native: 'isiXhosa' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho' },
  { code: 'tn', name: 'Setswana', native: 'Setswana' },
  { code: 'ts', name: 'Xitsonga', native: 'Xitsonga' },
  { code: 've', name: 'Tshivenda', native: 'Tshivenda' },
  { code: 'nr', name: 'isiNdebele', native: 'isiNdebele' },
  { code: 'ss', name: 'siSwati', native: 'siSwati' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Kinyarwanda' },
  { code: 'lg', name: 'Luganda', native: 'Luganda' },
  { code: 'ak', name: 'Akan', native: 'Akan' },
  { code: 'tw', name: 'Twi', native: 'Twi' },
  { code: 'ee', name: 'Eʋegbe', native: 'Eʋegbe' },
  { code: 'fon', name: 'Fɔngbè', native: 'Fɔngbè' },
  { code: 'dyo', name: 'Joola', native: 'Joola' },
  { code: 'wo', name: 'Wolof', native: 'Wolof' },
  { code: 'ff', name: 'Fulfulde', native: 'Fulfulde' },
  { code: 'bm', name: 'Bamanankan', native: 'Bamanankan' },
  { code: 'sg', name: 'Sängö', native: 'Sängö' },
  { code: 'dz', name: 'རྫོང་ཁ', native: 'རྫོང་ཁ' },
  { code: 'bo', name: 'བོད་ཡིག', native: 'བོད་ཡིག' },
  { code: 'ug', name: 'ئۇيغۇرچە', native: 'ئۇيغۇرچە' },
  { code: 'ii', name: 'ꆈꌠꉙ', native: 'ꆈꌠꉙ' },
  { code: 'za', name: 'Vahcuengh', native: 'Vahcuengh' },
  { code: 'br', name: 'Brezhoneg', native: 'Brezhoneg' },
  { code: 'co', name: 'Corsu', native: 'Corsu' },
  { code: 'fur', name: 'Furlan', native: 'Furlan' },
  { code: 'rm', name: 'Rumantsch', native: 'Rumantsch' },
  { code: 'lb', name: 'Lëtzebuergesch', native: 'Lëtzebuergesch' },
  { code: 'fy', name: 'Frysk', native: 'Frysk' },
  { code: 'gv', name: 'Gaelg', native: 'Gaelg' },
  { code: 'kw', name: 'Kernewek', native: 'Kernewek' },
  { code: 'fo', name: 'Føroyskt', native: 'Føroyskt' },
  { code: 'kl', name: 'Kalaallisut', native: 'Kalaallisut' },
  { code: 'se', name: 'Davvisámegiella', native: 'Davvisámegiella' },
  { code: 'smn', name: 'Anarâškielâ', native: 'Anarâškielâ' },
  { code: 'sms', name: 'Nuõrttsääʹmǩiõll', native: 'Nuõrttsääʹmǩiõll' },
  { code: 'sma', name: 'Åarjelsaemien gïele', native: 'Åarjelsaemien gïele' },
  { code: 'smj', name: 'Julevsámegiella', native: 'Julevsámegiella' },
  { code: 'sme', name: 'Davvisámegiella', native: 'Davvisámegiella' }
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

  // Inline styles
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    position: 'relative',
    overflow: 'auto',
    padding: '2rem 0'
  };

  // Update containerStyle and languageGridStyle to allow natural scrolling
  const containerStyle = {
    textAlign: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '2rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // allow content to grow down
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  const logoSectionStyle = {
    marginBottom: '2rem',
    animation: 'logoEntrance 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)'
  };

  const logoTextStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
    lineHeight: '1.2'
  };

  const welcomeTextStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '2rem',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)',
    willChange: 'transform, opacity',
    lineHeight: '1.2',
    letterSpacing: '-0.01em'
  };

  const languageGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto 2rem auto',
    padding: '0 1rem'
  };

  const getLanguageItemStyle = (language) => {
    const baseStyle = {
      background: '#ffffff',
      border: '2px solid #e2e8f0',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      padding: '1.5rem 1rem',
      borderRadius: '20px',
      fontWeight: '500',
      letterSpacing: '0.01em',
      opacity: '1',
      whiteSpace: 'nowrap',
      filter: 'none',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      pointerEvents: 'auto',
      zIndex: '10',
      userSelect: 'none',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80px',
      maxHeight: '80px',
      willChange: 'transform, opacity',
      backdropFilter: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      fontSize: '1.1rem'
    };

    // Highlight the most common languages in Oakland
    const commonLanguages = ['en', 'es', 'zh', 'vi', 'tl', 'ar', 'ko', 'hi', 'th', 'ja'];
    if (commonLanguages.includes(language.code)) {
      baseStyle.border = '2px solid #3b82f6';
      baseStyle.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
      baseStyle.color = '#1e40af';
      baseStyle.fontWeight = '600';
      baseStyle.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)';
    }

    // Matrix effect highlighting
    if (highlightedLanguages.includes(language.code)) {
      baseStyle.border = '2px solid #10b981';
      baseStyle.background = 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
      baseStyle.color = '#065f46';
      baseStyle.fontWeight = '600';
      baseStyle.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
      baseStyle.animation = 'matrixGlow 2s ease-in-out infinite';
      baseStyle.transform = 'scale(1.05)';
      baseStyle.zIndex = '20';
    }

    // Hover effects
    if (hoveredLanguage && hoveredLanguage.code === language.code) {
      baseStyle.opacity = '1';
      baseStyle.filter = 'none';
      baseStyle.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)';
      baseStyle.border = '2px solid #3b82f6';
      baseStyle.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      baseStyle.color = '#ffffff';
      baseStyle.transform = 'translateY(-4px) scale(1.05)';
    }

    return baseStyle;
  };

  const languageTextStyle = {
    fontSize: '1rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)',
    lineHeight: '1.4'
  };

  const activeLanguageTextStyle = {
    fontSize: '1.25rem',
    fontWeight: '600'
  };

  const selectionOverlayStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: theme.modalOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'none',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const selectedContentStyle = {
    textAlign: 'center',
    color: theme.primaryText,
    animation: 'scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)'
  };

  const checkIconStyle = {
    fontSize: '4rem',
    color: '#22c55e',
    marginBottom: '1rem',
    animation: 'bounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    transform: 'translateZ(0)'
  };

  const selectedTitleStyle = {
    fontSize: '2rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  const selectedSubtitleStyle = {
    fontSize: '1rem',
    opacity: '0.8'
  };

  const scrollIndicatorStyle = {
    position: 'relative',
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '0.875rem',
    textAlign: 'center',
    pointerEvents: 'auto',
    userSelect: 'none',
    background: '#ffffff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    maxWidth: '280px',
    width: '280px',
    margin: '0 auto',
    boxSizing: 'border-box',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: '5'
  };

  return (
    <div className="apple-language-page theme-white" style={{
      ...pageStyle,
      animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
              <div style={containerStyle}>
          <div style={logoSectionStyle}>
            <div style={logoTextStyle}>Oakland AI</div>
          </div>
          
          <div style={welcomeTextStyle}>
            {selectedLanguage ? selectedLanguage.native : getWelcomeText()}
          </div>
          
          <div style={languageGridStyle}>
            {getVisibleLanguages().map((language, index) => (
              <div
                key={`${language.code}-${index}`}
                style={getLanguageItemStyle(language)}
                onClick={(event) => handleLanguageClick(language, event)}
                onMouseEnter={() => setHoveredLanguage(language)}
                onMouseLeave={() => setHoveredLanguage(null)}
              >
                <span style={languageTextStyle}>
                  {language.native}
                </span>
              </div>
            ))}
          </div>

          {!selectedLanguage && (
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              fontWeight: '500',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              Select your preferred language to continue
            </div>
          )}

        </div>

      <style>{`
        /* Prevent layout shifts during scrolling */
        * {
          box-sizing: border-box;
        }
        
        /* Optimize animations */
        .language-item {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          contain: layout style paint;
        }
        
        /* Prevent layout shifts during transitions */
        .language-list {
          contain: layout style;
          transform: translateZ(0);
        }
        
        /* Ensure smooth transitions for all language items */
        .language-item {
          transform-origin: center center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Prevent any potential flickering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Ensure language list is above any potential overlays */
        .language-list {
          position: relative;
          z-index: 10;
        }
        
        /* Ensure scroll indicator is properly positioned */
        .scroll-indicator {
          position: relative;
          z-index: 5;
          left: 30% !important;
          transform: translateX(-50%) !important;
          top: 40px;
          margin: 0 auto !important;
        }

        /* Matrix effect animations */
        @keyframes matrixGlow {
          0%, 100% {
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1);
            transform: scale(1.05);
          }
          50% {
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.5), 0 6px 12px rgba(0, 0, 0, 0.15);
            transform: scale(1.08);
          }
        }

        @keyframes matrixPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes matrixFloat {
          0%, 100% {
            transform: translateY(0) scale(1.05);
          }
          50% {
            transform: translateY(-2px) scale(1.08);
          }
        }
        
        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes floatCenter {
          0%, 100% {
            transform: scale(1.1) translateY(0);
          }
          50% {
            transform: scale(1.12) translateY(-1px);
          }
        }

        @keyframes floatNear {
          0%, 100% {
            transform: scale(0.85) translateY(4px);
          }
          50% {
            transform: scale(0.87) translateY(2px);
          }
        }

        @keyframes floatDistant {
          0%, 100% {
            transform: scale(0.6) translateY(15px);
          }
          50% {
            transform: scale(0.62) translateY(13px);
          }
        }



        @keyframes scrollDirectionPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .welcome-text {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }
          
          .language-list {
            height: 300px;
            min-height: 300px;
            max-height: 300px;
            margin-bottom: 1.5rem;
          }
          
          .language-item {
            padding: 0.6rem 1.5rem;
            height: 50px;
            min-height: 50px;
            max-height: 50px;
          }
          
          .language-text {
            font-size: 1rem;
          }
          
          .language-item.active .language-text {
            font-size: 1.4rem;
          }
          
          .selected-content {
            padding: 2rem;
          }
          
          .selected-content h2 {
            font-size: 1.5rem;
          }
          
          .scroll-indicator {
            max-width: 90%;
            width: 90%;
            margin: 1rem auto 0 auto;
          }
        }

        @media (max-width: 480px) {
          .language-container {
            padding: 1rem;
            max-width: 100%;
          }
          
          .welcome-text {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }
          
          .language-list {
            height: 250px;
            min-height: 250px;
            max-height: 250px;
            margin-bottom: 1rem;
          }
          
          .language-item {
            padding: 0.5rem 1rem;
            height: 45px;
            min-height: 45px;
            max-height: 45px;
          }
          
          .language-text {
            font-size: 0.9rem;
          }
          
          .language-item.active .language-text {
            font-size: 1.2rem;
          }
          
          .scroll-indicator {
            max-width: 95%;
            width: 95%;
            margin: 1rem auto 0 auto;
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LanguageSelectionPage; 