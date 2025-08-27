import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowLeft, User, Mail, Phone, Globe, Building2, Shield, CheckCircle, 
  Clock, Calendar, MapPin, Users, TrendingUp, DollarSign, Award,
  Home, Briefcase, Heart, Star
} from 'lucide-react';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, currentThemeName } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    // Always fetch complete user data from database
    const loadUserData = async () => {
      const localUser = localStorage.getItem('user');
      console.log('Local user from localStorage:', localUser);
      
      if (localUser) {
        try {
          const userData = JSON.parse(localUser);
          console.log('Parsed user data:', userData);
          
          // Always fetch complete data from database using current user's email
          try {
            console.log('Fetching user data for email:', userData.email);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/get-user-by-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: userData.email })
            });
            
            console.log('Response status:', response.status);
            if (response.ok) {
              const data = await response.json();
              console.log('Response data:', data);
              if (data.success) {
                console.log('Got complete data from database:', data.user);
                // Store complete data in localStorage
                const completeUserData = { ...data.user, token: userData.token };
                localStorage.setItem('user', JSON.stringify(completeUserData));
                setUser(completeUserData);
                setLoading(false);
                return;
              } else {
                console.log('Database response not successful:', data);
              }
            } else {
              console.log('Database fetch failed with status:', response.status);
              const errorText = await response.text();
              console.log('Error response:', errorText);
            }
          } catch (error) {
            console.log('Database fetch failed, using localStorage:', error);
          }
          
          // Fallback to localStorage data
          setUser(userData);
        } catch (error) {
          console.log('Error parsing localStorage data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    loadUserData();
  }, []);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('User state updated:', user);
  }, [user]);

  if (loading) {
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
          {t('profile.loadingProfile')}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: currentThemeName === 'dark'
          ? '#0f172a'
          : currentThemeName === 'beige'
          ? '#f5f5dc'
          : '#ffffff',
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: currentThemeName === 'dark'
            ? 'rgba(30, 41, 59, 0.9)'
            : currentThemeName === 'beige'
            ? 'rgba(245, 245, 220, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          border: currentThemeName === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : currentThemeName === 'beige'
            ? '1px solid rgba(139, 69, 19, 0.15)'
            : '1px solid rgba(59, 130, 246, 0.1)',
          borderRadius: 16,
          padding: 40,
          boxShadow: currentThemeName === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : currentThemeName === 'beige'
            ? '0 8px 32px rgba(139, 69, 19, 0.1)'
            : '0 8px 32px rgba(59, 130, 246, 0.08)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 16 }}>No User Data Found</h2>
          <p style={{ marginBottom: 24, color: '#6b7280' }}>
            {t('profile.pleaseLogin')}
          </p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const ProfileField = ({ icon: Icon, label, value, color = '#3b82f6' }) => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 20px',
        background: currentThemeName === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : currentThemeName === 'beige'
          ? 'rgba(139, 69, 19, 0.08)'
          : 'rgba(59, 130, 246, 0.08)',
        border: currentThemeName === 'dark'
          ? '1px solid rgba(255, 255, 255, 0.15)'
          : currentThemeName === 'beige'
          ? '1px solid rgba(139, 69, 19, 0.15)'
          : '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: 12,
        marginBottom: 12,
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.background = currentThemeName === 'dark'
          ? 'rgba(255, 255, 255, 0.12)'
          : currentThemeName === 'beige'
          ? 'rgba(139, 69, 19, 0.12)'
          : 'rgba(59, 130, 246, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.background = currentThemeName === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : currentThemeName === 'beige'
          ? 'rgba(139, 69, 19, 0.08)'
          : 'rgba(59, 130, 246, 0.08)';
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: currentThemeName === 'dark'
            ? 'rgba(59, 130, 246, 0.25)'
            : currentThemeName === 'beige'
            ? 'rgba(139, 69, 19, 0.25)'
            : 'rgba(59, 130, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          border: currentThemeName === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.4)'
            : currentThemeName === 'beige'
            ? '1px solid rgba(139, 69, 19, 0.4)'
            : '1px solid rgba(59, 130, 246, 0.25)'
        }}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: 14, 
            color: currentThemeName === 'dark' 
              ? '#d1d5db' 
              : currentThemeName === 'beige'
              ? '#8b4513'
              : '#374151',
            marginBottom: 4,
            fontWeight: 500
          }}>
            {label}
          </div>
          <div style={{ 
            fontSize: 16, 
            fontWeight: 600,
            color: currentThemeName === 'dark' 
              ? '#ffffff' 
              : currentThemeName === 'beige'
              ? '#5d4037'
              : '#111827'
          }}>
            {value || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, title, subtitle, color = '#3b82f6' }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
      padding: '16px 20px',
      background: currentThemeName === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : currentThemeName === 'beige'
        ? 'rgba(139, 69, 19, 0.05)'
        : 'rgba(59, 130, 246, 0.05)',
      border: currentThemeName === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.08)'
        : currentThemeName === 'beige'
        ? '1px solid rgba(139, 69, 19, 0.08)'
        : '1px solid rgba(59, 130, 246, 0.08)',
      borderRadius: 12,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: currentThemeName === 'dark'
          ? 'rgba(59, 130, 246, 0.25)'
          : currentThemeName === 'beige'
          ? 'rgba(139, 69, 19, 0.25)'
          : 'rgba(59, 130, 246, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <Icon size={18} />
      </div>
      <div>
        <h3 style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          margin: '0 0 4px 0',
          color: currentThemeName === 'dark' 
            ? '#ffffff' 
            : currentThemeName === 'beige'
            ? '#5d4037'
            : '#111827'
        }}>
          {title}
        </h3>
        <p style={{ 
          fontSize: 14, 
          color: currentThemeName === 'dark' 
            ? '#d1d5db' 
            : currentThemeName === 'beige'
            ? '#8b4513'
            : '#6b7280',
          margin: 0
        }}>
          {subtitle}
        </p>
      </div>
    </div>
  );

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: currentThemeName === 'dark'
        ? '#0f172a'  // Dark blue background
        : currentThemeName === 'beige'
        ? '#f5f5dc'  // Light beige background
        : '#ffffff', // White background
      color: theme.text,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        position: 'relative', 
        zIndex: 1 
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 40,
          padding: '24px 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Avatar */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: currentThemeName === 'dark'
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : currentThemeName === 'beige'
              ? 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            boxShadow: currentThemeName === 'dark'
              ? '0 4px 16px rgba(59, 130, 246, 0.3)'
              : currentThemeName === 'beige'
              ? '0 4px 16px rgba(139, 69, 19, 0.2)'
              : '0 4px 16px rgba(59, 130, 246, 0.2)'
          }}>
            {user.first_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700, 
              margin: '0 0 8px 0',
              color: currentThemeName === 'dark' 
                ? '#ffffff' 
                : currentThemeName === 'beige'
                ? '#5d4037'
                : '#111827'
            }}>
              {`${user.first_name || ''} ${user.last_name || ''}`.trim() || t('profile.userProfile')}
            </h1>
            <p style={{ 
              fontSize: 16, 
              color: currentThemeName === 'dark' 
                ? '#d1d5db' 
                : currentThemeName === 'beige'
                ? '#8b4513'
                : '#6b7280',
              margin: 0
            }}>
              {user.business_type || 'Business Owner'} • {user.city || 'Oakland'}, {user.state || 'CA'}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <SectionHeader 
          icon={User} 
          title={t('profile.personalInfo')} 
          subtitle={t('profile.personalInfoSubtitle')}
          color="#3b82f6"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={User} 
            label={t('profile.fullName')} 
            value={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
            color="#3b82f6"
          />
          <ProfileField 
            icon={Mail} 
            label={t('profile.emailAddress')} 
            value={user.email || 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={Phone} 
            label={t('profile.phoneNumber')} 
            value={user.phone || 'N/A'}
            color="#f59e0b"
          />
          <ProfileField 
            icon={Globe} 
            label={t('profile.language')} 
            value={user.language ? user.language.toUpperCase() : 'N/A'}
            color="#8b5cf6"
          />
          <ProfileField 
            icon={Heart} 
            label={t('profile.age')} 
            value={user.age ? `${user.age} years old` : 'N/A'}
            color="#ec4899"
          />
          <ProfileField 
            icon={Star} 
            label={t('profile.ethnicity')} 
            value={user.ethnicity || 'N/A'}
            color="#06b6d4"
          />
          <ProfileField 
            icon={User} 
            label={t('profile.gender')} 
            value={user.gender || 'N/A'}
            color="#8b5cf6"
          />
        </div>

        {/* Business Information Section */}
        <SectionHeader 
          icon={Building2} 
          title={t('profile.businessInfo')} 
          subtitle={t('profile.businessInfoSubtitle')}
          color="#ef4444"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Building2} 
            label={t('profile.businessType')} 
            value={user.business_type || 'N/A'}
            color="#ef4444"
          />
          <ProfileField 
            icon={Users} 
            label={t('profile.employeeCount')} 
            value={user.employee_count ? `${user.employee_count} employees` : 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={TrendingUp} 
            label={t('profile.yearsInBusiness')} 
            value={user.years_in_business ? `${user.years_in_business} years` : 'N/A'}
            color="#f59e0b"
          />
          <ProfileField 
            icon={Award} 
            label={t('profile.corporationType')} 
            value={user.corporation_type || 'N/A'}
            color="#8b5cf6"
          />
        </div>

        {/* Address Information Section */}
        <SectionHeader 
          icon={MapPin} 
          title={t('profile.addressInfo')} 
          subtitle={t('profile.addressInfoSubtitle')}
          color="#10b981"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Home} 
            label={t('profile.addressLine1')} 
            value={user.address_line_1 || 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={Home} 
            label={t('profile.addressLine2')} 
            value={user.address_line_2 || 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={MapPin} 
            label={t('profile.city')} 
            value={user.city || 'N/A'}
            color="#f59e0b"
          />
          <ProfileField 
            icon={MapPin} 
            label={t('profile.state')} 
            value={user.state || 'N/A'}
            color="#8b5cf6"
          />
          <ProfileField 
            icon={MapPin} 
            label={t('profile.zipCode')} 
            value={user.zip_code || 'N/A'}
            color="#06b6d4"
          />
        </div>

        {/* Financial Information Section */}
        <SectionHeader 
          icon={DollarSign} 
          title={t('profile.financialInfo')} 
          subtitle={t('profile.financialInfoSubtitle')}
          color="#10b981"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={DollarSign} 
            label={t('profile.annualRevenue2022')} 
            value={user.annual_revenue_2022 ? formatCurrency(user.annual_revenue_2022) : 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={DollarSign} 
            label={t('profile.annualRevenue2023')} 
            value={user.annual_revenue_2023 ? formatCurrency(user.annual_revenue_2023) : 'N/A'}
            color="#f59e0b"
          />
          <ProfileField 
            icon={DollarSign} 
            label={t('profile.annualRevenue2024')} 
            value={user.annual_revenue_2024 ? formatCurrency(user.annual_revenue_2024) : 'N/A'}
            color="#3b82f6"
          />
        </div>

        {/* Account Information Section */}
        <SectionHeader 
          icon={Shield} 
          title={t('profile.accountInfo')} 
          subtitle={t('profile.accountInfoSubtitle')}
          color="#8b5cf6"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Shield} 
            label={t('profile.adminStatus')} 
            value={user.is_admin ? 'Administrator' : 'Regular User'}
            color={user.is_admin ? '#10b981' : '#6b7280'}
          />
          <ProfileField 
            icon={CheckCircle} 
            label={t('profile.emailVerification')} 
            value={user.is_verified ? 'Verified' : 'Not Verified'}
            color={user.is_verified ? '#10b981' : '#f59e0b'}
          />
          <ProfileField 
            icon={Clock} 
            label={t('profile.lastLogin')} 
            value={user.last_login ? formatDate(user.last_login) : 'N/A'}
            color="#06b6d4"
          />
          <ProfileField 
            icon={Calendar} 
            label={t('profile.accountCreated')} 
            value={user.created_at ? formatDate(user.created_at) : 'N/A'}
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
          {t('profile.backToChat')}
        </button>
      </div>
    </div>
  );
}

export default ProfilePage; 