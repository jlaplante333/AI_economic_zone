import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
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

  useEffect(() => {
    // Try to fetch the latest user info from the backend
    const fetchProfile = async () => {
      const localUser = localStorage.getItem('user');
      if (!localUser) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localUser).token}`,
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Fallback to localStorage data
          const localUserData = JSON.parse(localUser);
          setUser(localUserData);
        }
      } catch (error) {
        console.log('Error fetching profile:', error);
        // Fallback to localStorage data
        const localUserData = JSON.parse(localUser);
        setUser(localUserData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

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
          Loading profile...
        </div>
      </div>
    );
  }

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
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: currentThemeName === 'dark'
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)'
          : currentThemeName === 'beige'
          ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(160, 82, 45, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
        zIndex: 0
      }} />

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
          padding: '24px',
          background: currentThemeName === 'dark'
            ? 'rgba(30, 41, 59, 0.8)'
            : currentThemeName === 'beige'
            ? 'rgba(245, 245, 220, 0.9)'
            : 'rgba(255, 255, 255, 0.95)',
          border: currentThemeName === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : currentThemeName === 'beige'
            ? '1px solid rgba(139, 69, 19, 0.15)'
            : '1px solid rgba(59, 130, 246, 0.1)',
          borderRadius: 20,
          boxShadow: currentThemeName === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            : currentThemeName === 'beige'
            ? '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(139, 69, 19, 0.05)'
            : '0 8px 32px rgba(59, 130, 246, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)',
          backdropFilter: 'blur(10px)',
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
            {user.first_name?.charAt(0) || user.firstName?.charAt(0) || 'U'}
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
              {`${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || 'User Profile'}
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
              {user.business_type || user.businessType || 'Business Owner'} • {user.city || 'Oakland'}, {user.state || 'CA'}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <SectionHeader 
          icon={User} 
          title="Personal Information" 
          subtitle="Basic contact and demographic details"
          color="#3b82f6"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={User} 
            label="Full Name" 
            value={`${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || 'N/A'}
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
            value={user.language ? user.language.toUpperCase() : 'N/A'}
            color="#8b5cf6"
          />
          <ProfileField 
            icon={Heart} 
            label="Age" 
            value={user.age ? `${user.age} years old` : 'N/A'}
            color="#ec4899"
          />
          <ProfileField 
            icon={Star} 
            label="Ethnicity" 
            value={user.ethnicity}
            color="#06b6d4"
          />
          <ProfileField 
            icon={User} 
            label="Gender" 
            value={user.gender}
            color="#8b5cf6"
          />
        </div>

        {/* Business Information Section */}
        <SectionHeader 
          icon={Building2} 
          title="Business Information" 
          subtitle="Company details and structure"
          color="#ef4444"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Building2} 
            label="Business Type" 
            value={user.business_type || user.businessType}
            color="#ef4444"
          />
          <ProfileField 
            icon={Users} 
            label="Employee Count" 
            value={user.employee_count ? `${user.employee_count} employees` : 'N/A'}
            color="#10b981"
          />
          <ProfileField 
            icon={TrendingUp} 
            label="Years in Business" 
            value={user.years_in_business ? `${user.years_in_business} years` : 'N/A'}
            color="#f59e0b"
          />
          <ProfileField 
            icon={Award} 
            label="Corporation Type" 
            value={user.corporation_type}
            color="#8b5cf6"
          />
        </div>

        {/* Address Information Section */}
        <SectionHeader 
          icon={MapPin} 
          title="Address Information" 
          subtitle="Business location details"
          color="#10b981"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Home} 
            label="Address Line 1" 
            value={user.address_line1}
            color="#10b981"
          />
          <ProfileField 
            icon={Home} 
            label="Address Line 2" 
            value={user.address_line2}
            color="#10b981"
          />
          <ProfileField 
            icon={MapPin} 
            label="City" 
            value={user.city}
            color="#f59e0b"
          />
          <ProfileField 
            icon={MapPin} 
            label="State" 
            value={user.state}
            color="#8b5cf6"
          />
          <ProfileField 
            icon={MapPin} 
            label="ZIP Code" 
            value={user.zip_code}
            color="#06b6d4"
          />
        </div>

        {/* Financial Information Section */}
        <SectionHeader 
          icon={DollarSign} 
          title="Financial Information" 
          subtitle="Annual revenue data"
          color="#10b981"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={DollarSign} 
            label="Annual Revenue 2022" 
            value={formatCurrency(user.annual_revenue_2022)}
            color="#10b981"
          />
          <ProfileField 
            icon={DollarSign} 
            label="Annual Revenue 2023" 
            value={formatCurrency(user.annual_revenue_2023)}
            color="#f59e0b"
          />
          <ProfileField 
            icon={DollarSign} 
            label="Annual Revenue 2024" 
            value={formatCurrency(user.annual_revenue_2024)}
            color="#3b82f6"
          />
        </div>

        {/* Account Information Section */}
        <SectionHeader 
          icon={Shield} 
          title="Account Information" 
          subtitle="Account status and security"
          color="#8b5cf6"
        />
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 40 }}>
          <ProfileField 
            icon={Shield} 
            label="Admin Status" 
            value={user.is_admin || user.isAdmin ? 'Administrator' : 'Regular User'}
            color={user.is_admin || user.isAdmin ? '#10b981' : '#6b7280'}
          />
          <ProfileField 
            icon={CheckCircle} 
            label="Email Verification" 
            value={user.is_verified || user.isVerified ? 'Verified' : 'Not Verified'}
            color={user.is_verified || user.isVerified ? '#10b981' : '#f59e0b'}
          />
          <ProfileField 
            icon={Clock} 
            label="Last Login" 
            value={user.last_login ? formatDate(user.last_login) : 'N/A'}
            color="#06b6d4"
          />
          <ProfileField 
            icon={Calendar} 
            label="Account Created" 
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
          Back to Chat
        </button>
      </div>
    </div>
  );
}

export default ProfilePage; 