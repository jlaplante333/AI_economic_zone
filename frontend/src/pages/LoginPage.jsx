import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLanguageNames } from '../language/languages';
import { config } from '../env';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Available languages - use centralized language data
  const availableLanguages = getLanguageNames();
  
  // Get user's selected language from localStorage
  const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
  
  // Find the index of the selected language
  const selectedLanguageIndex = availableLanguages.findIndex(lang => lang.code === selectedLanguage);
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(selectedLanguageIndex >= 0 ? selectedLanguageIndex : 0);
  
  // Update language index when selected language changes
  useEffect(() => {
    const newIndex = availableLanguages.findIndex(lang => lang.code === selectedLanguage);
    if (newIndex >= 0) {
      setCurrentLanguageIndex(newIndex);
    }
  }, [selectedLanguage, availableLanguages]);

  // Function to manually change language
  const handleLanguageChange = (languageCode) => {
    const newIndex = availableLanguages.findIndex(lang => lang.code === languageCode);
    if (newIndex >= 0) {
      setCurrentLanguageIndex(newIndex);
      localStorage.setItem('selectedLanguage', languageCode);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Form submitted!');
    console.log('🔐 Username:', username);
    console.log('🔐 Password length:', password.length);
    
    if (!username || !password) {
      console.error('❌ Missing username or password');
      alert('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    console.log('🔐 Login attempt for:', username);
    console.log('🔐 API URL:', config.VITE_API_URL);
    
    try {
      const response = await fetch(`${config.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      
      console.log('🔐 Response status:', response.status);
      console.log('🔐 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('🔐 Login response:', data);
      
      if (response.ok && data.success) {
        // Check if user needs email verification
        if (data.needsVerification) {
          setVerificationMessage('Please verify your email address before logging in. Check your email for a verification link.');
          return;
        }
        
        // CRITICAL: Store ALL user data in localStorage
        const userData = {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          phone: data.user.phone,
          language: data.user.language,
          business_type: data.user.business_type,
          is_admin: data.user.is_admin,
          is_verified: data.user.is_verified,
          last_login: data.user.last_login,
          created_at: data.user.created_at,
          // Address fields
          address_line1: data.user.address_line1,
          address_line2: data.user.address_line2,
          city: data.user.city,
          state: data.user.state,
          zip_code: data.user.zip_code,
          // Demographics
          age: data.user.age,
          ethnicity: data.user.ethnicity,
          gender: data.user.gender,
          // Business details
          employee_count: data.user.employee_count,
          years_in_business: data.user.years_in_business,
          corporation_type: data.user.corporation_type,
          // Financial information
          annual_revenue_2022: data.user.annual_revenue_2022,
          annual_revenue_2023: data.user.annual_revenue_2023,
          annual_revenue_2024: data.user.annual_revenue_2024,
          // Additional fields for profile
          name: `${data.user.first_name} ${data.user.last_name}`,
          firstName: data.user.first_name,
          lastName: data.user.last_name
        };
        
        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ User data saved to localStorage:', userData);
        console.log('✅ Token saved to localStorage');
        
        // Redirect to chat
        console.log('🔄 Navigating to /fullchat...');
        navigate('/fullchat');
        // Also try window.location as fallback
        setTimeout(() => {
          if (window.location.pathname !== '/fullchat') {
            console.log('🔄 Fallback navigation using window.location...');
            window.location.href = '/fullchat';
          }
        }, 100);
      } else {
        console.error('❌ Login failed:', data.message);
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          {t('welcome.smartHelp')}<br />
          {t('welcome.smallBusinesses')}<br />
          {t('welcome.inOakland')}
        </h1>
        <p className="sub-heading">
          {t('welcome.speakYourLanguage')}<br />
          {t('welcome.getAnswers')}
        </p>

      </div>

      {/* Right side - Login form */}
      <div className="login-section">
        <div className="login-container">
          <div className="language-selector" style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button
              onClick={() => handleLanguageChange(availableLanguages[currentLanguageIndex]?.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
            >
              <Globe size={16} />
              {availableLanguages[currentLanguageIndex]?.name || 'English'}
            </button>
          </div>

          <h2 className="login-title">Login</h2>
          
          {verificationMessage && (
            <div className="verification-message" style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: '#3b82f6',
              fontSize: '14px'
            }}>
              {verificationMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">{t('auth.email')}</label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t('auth.emailPlaceholder')}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('auth.password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('auth.passwordPlaceholder')}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              {t('auth.forgotPassword')} <button onClick={() => navigate('/forgot-password')} className="forgot-password-link" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{t('auth.resetPassword')}</button>
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>
              {t('auth.noAccount')} <button onClick={() => navigate('/signup')} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>{t('auth.signUp')}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 