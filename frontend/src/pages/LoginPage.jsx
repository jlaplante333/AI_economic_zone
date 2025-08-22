import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLanguageNames } from '../language/languages';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [verificationMessage, setVerificationMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Check for verification message from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('message') === 'verification_required') {
      setVerificationMessage('Please verify your email address before logging in. Check your email for a verification link.');
    }
  }, []);

  // Available languages for cycling - use centralized language data
  const availableLanguages = getLanguageNames();

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Check if user needs email verification
        if (data.needsVerification) {
          setVerificationMessage('Please verify your email address before logging in. Check your email for a verification link.');
          return;
        }
        
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: `${data.user.first_name} ${data.user.last_name}`,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          isAdmin: data.user.is_admin
        }));
        
        // Redirect to the originally requested page or default to fullchat
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || '/fullchat';
        navigate(redirectTo);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed. Please try again.');
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
          {t('smartHelp')}<br />
          {t('smallBusinesses')}<br />
          {t('inOakland')}
        </h1>
        <p className="sub-heading">
          {t('speakYourLanguage')}<br />
          {t('getAnswers')}
        </p>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          {t('noAccount')} <a href="/signup" className="signup-link" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>{t('signUp')}</a>
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
            <span style={{ fontSize: '16px', marginRight: '4px' }}>
              {availableLanguages[currentLanguageIndex].flag}
            </span>
            {availableLanguages[currentLanguageIndex].name}
          </button>
          <p className="login-subtitle">{t('signInToAccess')}</p>
          <form onSubmit={handleSubmit} className="login-form">
            {/* Verification Message */}
            {verificationMessage && (
              <div className="verification-message" style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#92400e',
                fontSize: '14px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {verificationMessage}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">{t('username')}</label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('usernamePlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">{t('password')}</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
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
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
          </form>
          <div className="login-footer">
            <p>{t('noAccount')} <a href="/signup" className="signup-link">{t('signUp')}</a></p>
            <p><a href="#" className="forgot-password">{t('forgotPassword')}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 