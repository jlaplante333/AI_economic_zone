import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, User, Mail, Phone, Globe, Building2, Shield, CheckCircle, Clock, Calendar } from 'lucide-react';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme, currentThemeName } = useTheme();

  useEffect(() => {
    // Try to fetch the latest user info from the backend
    const fetchProfile = async () => {
      const localUser = localStorage.getItem('user');
      if (!localUser) return;
      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            // If you use JWT, add Authorization header here
          },
          credentials: 'include', // in case you use cookies for auth
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(JSON.parse(localUser)); // fallback to localStorage
        }
      } catch {
        setUser(JSON.parse(localUser)); // fallback to localStorage
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: theme.bg, 
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: 40,
          boxShadow: theme.shadow
        }}>
          No user info found.
        </div>
      </div>
    );
  }

  const ProfileField = ({ icon: Icon, label, value, color = '#3b82f6' }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      background: currentThemeName === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : currentThemeName === 'beige'
        ? 'rgba(139, 69, 19, 0.05)'
        : 'rgba(59, 130, 246, 0.05)',
      border: currentThemeName === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : currentThemeName === 'beige'
        ? '1px solid rgba(139, 69, 19, 0.1)'
        : '1px solid rgba(59, 130, 246, 0.1)',
      borderRadius: 12,
      marginBottom: 12,
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(4px)';
      e.currentTarget.style.background = currentThemeName === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : currentThemeName === 'beige'
        ? 'rgba(139, 69, 19, 0.08)'
        : 'rgba(59, 130, 246, 0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.background = currentThemeName === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : currentThemeName === 'beige'
        ? 'rgba(139, 69, 19, 0.05)'
        : 'rgba(59, 130, 246, 0.05)';
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: currentThemeName === 'dark'
          ? 'rgba(59, 130, 246, 0.2)'
          : currentThemeName === 'beige'
          ? 'rgba(139, 69, 19, 0.2)'
          : 'rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontSize: 12, 
          fontWeight: 600, 
          color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary,
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {label}
        </div>
        <div style={{ 
          fontSize: 16, 
          fontWeight: 600, 
          color: currentThemeName === 'dark' ? 'white' : theme.text
        }}>
          {value || 'N/A'}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg, 
      color: theme.text,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        background: currentThemeName === 'dark'
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : currentThemeName === 'beige'
          ? 'linear-gradient(135deg, rgba(245, 245, 220, 0.9) 0%, rgba(250, 235, 215, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
        border: currentThemeName === 'dark'
          ? '1px solid rgba(59, 130, 246, 0.2)'
          : currentThemeName === 'beige'
          ? '1px solid rgba(139, 69, 19, 0.15)'
          : '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 24,
        padding: 40,
        minWidth: 400,
        maxWidth: 600,
        width: '100%',
        boxShadow: currentThemeName === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
          : currentThemeName === 'beige'
          ? '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(139, 69, 19, 0.05)'
          : '0 8px 32px rgba(59, 130, 246, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: currentThemeName === 'dark'
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)'
            : currentThemeName === 'beige'
            ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.03) 0%, rgba(160, 82, 45, 0.02) 100%)'
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.01) 100%)',
          pointerEvents: 'none'
        }} />
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 16, 
          marginBottom: 32,
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: currentThemeName === 'dark'
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : currentThemeName === 'beige'
              ? 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
            fontWeight: 700,
            boxShadow: currentThemeName === 'dark'
              ? '0 4px 16px rgba(59, 130, 246, 0.3)'
              : currentThemeName === 'beige'
              ? '0 4px 16px rgba(139, 69, 19, 0.2)'
              : '0 4px 16px rgba(59, 130, 246, 0.2)'
          }}>
            {user.firstName?.charAt(0) || user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 style={{ 
              fontSize: 28, 
              fontWeight: 700, 
              margin: '0 0 8px 0',
              color: currentThemeName === 'dark' ? 'white' : theme.text
            }}>
              User Profile
            </h2>
            <p style={{ 
              fontSize: 16, 
              color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary,
              margin: 0
            }}>
              Account Information & Settings
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ProfileField 
            icon={User} 
            label="Full Name" 
            value={`${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() || 'N/A'}
            color="#3b82f6"
          />
          <ProfileField 
            icon={Mail} 
            label="Email Address" 
            value={user.email}
            color="#10b981"
          />
          <ProfileField 
            icon={Phone} 
            label="Phone Number" 
            value={user.phone}
            color="#f59e0b"
          />
          <ProfileField 
            icon={Globe} 
            label="Language" 
            value={user.language}
            color="#8b5cf6"
          />
          <ProfileField 
            icon={Building2} 
            label="Business Type" 
            value={user.businessType}
            color="#ef4444"
          />
          <ProfileField 
            icon={Shield} 
            label="Admin Status" 
            value={user.isAdmin ? 'Administrator' : 'Regular User'}
            color={user.isAdmin ? '#10b981' : '#6b7280'}
          />
          <ProfileField 
            icon={CheckCircle} 
            label="Email Verification" 
            value={user.isVerified ? 'Verified' : 'Not Verified'}
            color={user.isVerified ? '#10b981' : '#f59e0b'}
          />
          <ProfileField 
            icon={Clock} 
            label="Last Login" 
            value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
            color="#06b6d4"
          />
          <ProfileField 
            icon={Calendar} 
            label="Account Created" 
            value={user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            color="#8b5cf6"
          />
        </div>

        {/* Back Button */}
        <button 
          onClick={() => navigate('/fullchat')} 
          style={{ 
            marginTop: 32, 
            padding: '16px 32px', 
            borderRadius: 12, 
            background: currentThemeName === 'dark'
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : currentThemeName === 'beige'
              ? 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white', 
            border: 'none', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease',
            boxShadow: currentThemeName === 'dark'
              ? '0 4px 16px rgba(59, 130, 246, 0.3)'
              : currentThemeName === 'beige'
              ? '0 4px 16px rgba(139, 69, 19, 0.2)'
              : '0 4px 16px rgba(59, 130, 246, 0.2)',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = currentThemeName === 'dark'
              ? '0 6px 20px rgba(59, 130, 246, 0.4)'
              : currentThemeName === 'beige'
              ? '0 6px 20px rgba(139, 69, 19, 0.3)'
              : '0 6px 20px rgba(59, 130, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = currentThemeName === 'dark'
              ? '0 4px 16px rgba(59, 130, 246, 0.3)'
              : currentThemeName === 'beige'
              ? '0 4px 16px rgba(139, 69, 19, 0.2)'
              : '0 4px 16px rgba(59, 130, 246, 0.2)';
          }}
        >
          <ArrowLeft size={20} />
          Back to Chat
        </button>
      </div>
    </div>
  );
}

export default ProfilePage; 