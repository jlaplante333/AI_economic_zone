import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Available languages for cycling
  const availableLanguages = [
    { code: 'en', name: 'Language' },
    { code: 'es', name: 'Idioma' },
    { code: 'fr', name: 'Langue' },
    { code: 'de', name: 'Sprache' },
    { code: 'it', name: 'Lingua' },
    { code: 'pt', name: 'Idioma' },
    { code: 'ru', name: 'Язык' },
    { code: 'zh', name: '语言' },
    { code: 'ja', name: '言語' },
    { code: 'ko', name: '언어' },
    { code: 'ar', name: 'لغة' },
    { code: 'hi', name: 'भाषा' },
    { code: 'tr', name: 'Dil' },
    { code: 'nl', name: 'Taal' },
    { code: 'sv', name: 'Språk' },
    { code: 'no', name: 'Språk' },
    { code: 'da', name: 'Sprog' },
    { code: 'fi', name: 'Kieli' },
    { code: 'pl', name: 'Język' },
    { code: 'cs', name: 'Jazyk' },
    { code: 'sk', name: 'Jazyk' },
    { code: 'hu', name: 'Nyelv' },
    { code: 'ro', name: 'Limbă' },
    { code: 'bg', name: 'Език' },
    { code: 'hr', name: 'Jezik' },
    { code: 'sr', name: 'Језик' },
    { code: 'sl', name: 'Jezik' },
    { code: 'et', name: 'Keel' },
    { code: 'lv', name: 'Valoda' },
    { code: 'lt', name: 'Kalba' },
    { code: 'mt', name: 'Lingwa' },
    { code: 'el', name: 'Γλώσσα' },
    { code: 'he', name: 'שפה' },
    { code: 'th', name: 'ภาษา' },
    { code: 'vi', name: 'Ngôn ngữ' },
    { code: 'id', name: 'Bahasa' },
    { code: 'ms', name: 'Bahasa' },
    { code: 'tl', name: 'Wika' },
    { code: 'bn', name: 'ভাষা' },
    { code: 'ur', name: 'زبان' },
    { code: 'fa', name: 'زبان' },
    { code: 'ku', name: 'Ziman' },
    { code: 'am', name: 'ቋንቋ' },
    { code: 'sw', name: 'Lugha' },
    { code: 'yo', name: 'Èdè' },
    { code: 'ig', name: 'Asụsụ' },
    { code: 'ha', name: 'Harshe' },
    { code: 'zu', name: 'Ulimi' },
    { code: 'xh', name: 'Ulwimi' },
    { code: 'af', name: 'Taal' },
    { code: 'is', name: 'Tungumál' },
    { code: 'ga', name: 'Teanga' },
    { code: 'cy', name: 'Iaith' },
    { code: 'eu', name: 'Hizkuntza' },
    { code: 'ca', name: 'Idioma' },
    { code: 'gl', name: 'Lingua' },
    { code: 'sq', name: 'Gjuha' },
    { code: 'mk', name: 'Јазик' },
    { code: 'bs', name: 'Jezik' },
    { code: 'me', name: 'Jezik' },
    { code: 'mn', name: 'Хэл' },
    { code: 'ka', name: 'ენა' },
    { code: 'hy', name: 'Լեզու' },
    { code: 'az', name: 'Dil' },
    { code: 'kk', name: 'Тіл' },
    { code: 'ky', name: 'Тил' },
    { code: 'uz', name: 'Til' },
    { code: 'tg', name: 'Забон' },
    { code: 'ps', name: 'ژبه' },
    { code: 'sd', name: 'ٻولي' },
    { code: 'ne', name: 'भाषा' },
    { code: 'si', name: 'භාෂාව' },
    { code: 'my', name: 'ဘာသာစကား' },
    { code: 'km', name: 'ភាសា' },
    { code: 'lo', name: 'ພາສາ' },
    { code: 'ka', name: 'ᏗᏕᏠᏱᏍᎩ' },
    { code: 'mi', name: 'Reo' },
    { code: 'haw', name: 'ʻŌlelo' },
    { code: 'sm', name: 'Gagana' },
    { code: 'fj', name: 'Vosa' },
    { code: 'to', name: 'Lea' },
    { code: 'ty', name: 'Reo' },
    { code: 'qu', name: 'Simi' },
    { code: 'ay', name: 'Aru' },
    { code: 'gn', name: 'Ñe\'ẽ' },
    { code: 'gu', name: 'ભાષા' },
    { code: 'pa', name: 'ਭਾਸ਼ਾ' },
    { code: 'or', name: 'ଭାଷା' },
    { code: 'as', name: 'ভাষা' },
    { code: 'ml', name: 'ഭാഷ' },
    { code: 'te', name: 'భాష' },
    { code: 'kn', name: 'ಭಾಷೆ' },
    { code: 'ta', name: 'மொழி' },
    { code: 'si', name: 'භාෂාව' }
  ];

  // Cycle through languages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguageIndex((prevIndex) => 
        (prevIndex + 1) % availableLanguages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // For now, simulate a login - accept any username and password
      // In production, this would call your actual API
      if (username.trim() && password.trim()) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({ 
          name: username,
          email: username + '@example.com',
          id: Date.now()
        }));
        
        // Redirect directly to full chat
        navigate('/fullchat');
      } else {
        alert('Please enter both username and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLanguage = () => {
    navigate('/');
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
          Don't have an account? <a href="#" className="signup-link" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>Sign up</a>
        </p>
      </div>

      {/* Right side - Login section */}
      <div className="login-section">
        <div className="login-container">
          <h2 className="login-title">{t('welcome')}</h2>
          
          {/* Change Language Button */}
          <button 
            onClick={handleChangeLanguage}
            className="change-language-button"
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '6px 10px',
              color: '#3b82f6',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Globe size={14} />
            {availableLanguages[currentLanguageIndex].name}
          </button>
          <p className="login-subtitle">Sign in to access your Oakland AI assistant</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="login-footer">
            <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
            <p><a href="#" className="forgot-password">Forgot password?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 