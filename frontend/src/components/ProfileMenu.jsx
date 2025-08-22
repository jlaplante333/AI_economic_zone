import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { stopAllSpeech } from '../utils/speechUtils';

const ProfileMenu = ({ 
  selectedVoice, 
  setSelectedVoice, 
  selectedLanguage, 
  setSelectedLanguage, 
  testSpeechSynthesis, 
  toggleTheme, 
  isToggling, 
  currentThemeName 
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Stop speech when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🔇 ProfileMenu: Stopping speech before page unload');
      stopAllSpeech();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔇 ProfileMenu: Stopping speech when page becomes hidden');
        stopAllSpeech();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleProfileClick = () => {
    console.log('Profile button clicked');
    console.log('Current location:', window.location.href);
    console.log('Current hash:', window.location.hash);
    console.log('Setting hash to #/profile');
    
    // Use hash navigation directly for HashRouter
    window.location.hash = '#/profile';
    
    // Also try React Router navigation as backup
    try {
      navigate('/profile');
    } catch (error) {
      console.error('React Router navigation failed:', error);
    }
  };

  const handleAnalyticsClick = () => {
    console.log('Analytics button clicked');
    console.log('Current location:', window.location.href);
    console.log('Current hash:', window.location.hash);
    console.log('Setting hash to #/analytics');
    
    // Use hash navigation directly for HashRouter
    window.location.hash = '#/analytics';
    
    // Also try React Router navigation as backup
    try {
      navigate('/analytics');
    } catch (error) {
      console.error('React Router navigation failed:', error);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 20,
        zIndex: 999999,
        background: theme.modalBg,
        border: `1px solid ${theme.primaryBorder}`,
        color: theme.primaryText,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        minWidth: '160px',
        maxWidth: '180px',
        gap: '6px',
        borderRadius: 8,
        boxShadow: `0 8px 20px ${theme.primaryShadow}`,
        fontSize: '14px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <button
        onClick={handleProfileClick}
        style={{ fontSize: 14, padding: 6, background: 'none', border: 'none', color: theme.primaryText, borderRadius: 6, transition: 'background 0.2s', textAlign: 'left', width: '100%', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >Profile</button>
      <button
        onClick={handleAnalyticsClick}
        style={{ fontSize: 14, padding: 6, background: 'none', border: 'none', color: theme.primaryText, borderRadius: 6, transition: 'background 0.2s', textAlign: 'left', width: '100%', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >Analytics</button>
      <button
        type="button"
        style={{ fontSize: 14, padding: 6, background: 'none', border: 'none', color: theme.primaryText, borderRadius: 6, cursor: isToggling ? 'not-allowed' : 'pointer', transition: 'background 0.2s', textAlign: 'left', width: '100%' }}
        onClick={() => { if (!isToggling) toggleTheme(); }}
        disabled={isToggling}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.16)'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        {isToggling
          ? 'Switching...'
          : currentThemeName === 'dark'
            ? 'Change to Beige'
            : currentThemeName === 'beige'
              ? 'Change to White'
              : 'Change to Dark'}
      </button>
      <button
        onClick={() => {
          // Clear authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login';
        }}
        style={{ fontSize: 14, padding: 6, background: 'none', border: 'none', color: '#ef4444', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left', width: '100%' }}
        onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >Logout</button>
      <button
        onClick={testSpeechSynthesis}
        style={{ fontSize: 14, padding: 6, background: 'none', border: 'none', color: '#10b981', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left', width: '100%' }}
        onMouseEnter={e => e.currentTarget.style.background = '#d1fae5'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >Test Speech</button>
      <select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        style={{ fontSize: 12, padding: 4, borderRadius: 4, border: '1px solid #ccc', background: 'white', color: '#333', textAlign: 'left', width: '100%' }}
      >
        <option value="none">No Voice</option>
        <option value="alloy">Alloy - Balanced</option>
        <option value="echo">Echo - Professional</option>
        <option value="fable">Fable - Friendly</option>
        <option value="onyx">Onyx - Authoritative</option>
        <option value="nova">Nova - Energetic</option>
        <option value="shimmer">Shimmer - Melodic</option>
      </select>
      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        style={{ fontSize: 12, padding: 4, borderRadius: 4, border: '1px solid #ccc', background: 'white', color: '#333', textAlign: 'left', width: '100%' }}
      >
        <option value="en-US">English (US)</option>
        <option value="vi-VN">Tiếng Việt (Vietnamese)</option>
        <option value="ar-SA">العربية (Arabic)</option>
        <option value="es-ES">Español (Spanish)</option>
        <option value="zh-CN">中文 (Chinese)</option>
        <option value="fr-FR">Français (French)</option>
        <option value="de-DE">Deutsch (German)</option>
        <option value="it-IT">Italiano (Italian)</option>
        <option value="pt-BR">Português (Portuguese)</option>
        <option value="ru-RU">Русский (Russian)</option>
        <option value="ja-JP">日本語 (Japanese)</option>
        <option value="ko-KR">한국어 (Korean)</option>
        <option value="hi-IN">हिन्दी (Hindi)</option>
        <option value="km-KH">ភាសាខ្មែរ (Khmer)</option>
        <option value="lo-LA">ພາສາລາວ (Laos)</option>
        <option value="ti-ER">ትግርኛ (Tigrinya)</option>
        <option value="prs-AF">دری (Dari)</option>
        <option value="mam-GT">Mam (Mam)</option>
      </select>
      <div style={{ fontSize: 11, color: '#666', textAlign: 'left', marginTop: 2 }}>
        🗣️ Language: {selectedLanguage.split('-')[0].toUpperCase()}
      </div>
    </div>
  );
};

export default ProfileMenu; 