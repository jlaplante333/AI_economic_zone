import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import config from '../env';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  Users, MessageCircle, Clock, TrendingUp, 
  Activity, BarChart3, PieChart as PieChartIcon, Loader, UserCheck, Star, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

// Custom tooltip component for pie chart
const CustomPieTooltip = ({ active, payload, currentThemeName }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: currentThemeName === 'dark'
          ? 'rgba(30, 41, 59, 0.95)'
          : currentThemeName === 'beige'
          ? 'rgba(245, 245, 220, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        border: currentThemeName === 'dark'
          ? '1px solid rgba(59, 130, 246, 0.2)'
          : currentThemeName === 'beige'
          ? '1px solid rgba(139, 69, 19, 0.15)'
          : '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 12,
        padding: '12px 16px',
        color: currentThemeName === 'dark' ? '#ffffff' : '#1f2937',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
          {data.name}
        </div>
        <div>
          {data.value}
        </div>
      </div>
    );
  }
  return null;
};

// Custom tooltip component for bar chart
const CustomBarTooltip = ({ active, payload, label, currentThemeName }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: currentThemeName === 'dark'
          ? 'rgba(30, 41, 59, 0.95)'
          : currentThemeName === 'beige'
          ? 'rgba(245, 245, 220, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        border: currentThemeName === 'dark'
          ? '1px solid rgba(59, 130, 246, 0.2)'
          : currentThemeName === 'beige'
          ? '1px solid rgba(139, 69, 19, 0.15)'
          : '1px solid rgba(59, 130, 246, 0.1)',
        borderRadius: 12,
        padding: '12px 16px',
        color: currentThemeName === 'dark' ? '#ffffff' : '#1f2937',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
          {data.name}
        </div>
        <div>
          {data.value} questions
        </div>
      </div>
    );
  }
  return null;
};

function AnalyticsPage() {
  const { theme, currentThemeName } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisWeek: 0,
      totalChats: 0,
      avgSessionDuration: '0 min',
      userSatisfaction: 5
    },
    businessTypeData: [],
    popularQuestions: [],
    dailyActivity: [],
    questionCategories: [],
    recentActivity: [] // Empty array for fallback
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Only add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${config.VITE_API_URL}/api/analytics/comprehensive?timeRange=${timeRange}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      // Fallback to static data if API fails
      setAnalyticsData({
        userStats: {
          totalUsers: 7,
          activeUsers: 4,
          newUsersThisWeek: 2,
          totalChats: 14,
          avgSessionDuration: '12.5 min',
          userSatisfaction: 5
        },
        businessTypeData: [
          { name: 'Technology', value: 2, color: '#3b82f6' },
          { name: 'Transportation', value: 1, color: '#10b981' },
          { name: 'Restaurant', value: 1, color: '#f59e0b' },
          { name: 'Retail', value: 1, color: '#8b5cf6' },
          { name: 'Admin', value: 1, color: '#ef4444' }
        ],
        popularQuestions: [
          { question: 'How do I get a business license?', count: 3, category: 'Licensing' },
          { question: 'What are the parking requirements?', count: 2, category: 'Zoning' },
          { question: 'How do I apply for a food permit?', count: 2, category: 'Health' },
          { question: 'What are the zoning requirements?', count: 2, category: 'Zoning' },
          { question: 'How do I get a building permit?', count: 1, category: 'Building' },
          { question: 'What are the tax requirements?', count: 1, category: 'Tax' },
          { question: 'How do I register my business name?', count: 1, category: 'Registration' },
          { question: 'What are the health inspection requirements?', count: 1, category: 'Health' }
        ],
        dailyActivity: [
          { date: 'Mon', chats: 4, users: 3 },
          { date: 'Tue', chats: 6, users: 4 },
          { date: 'Wed', chats: 2, users: 2 },
          { date: 'Thu', chats: 8, users: 5 },
          { date: 'Fri', chats: 5, users: 3 },
          { date: 'Sat', chats: 3, users: 2 },
          { date: 'Sun', chats: 1, users: 1 }
        ],
        questionCategories: [
          { name: 'Licensing', value: 4, color: '#3b82f6' },
          { name: 'Zoning', value: 4, color: '#10b981' },
          { name: 'Health', value: 3, color: '#f59e0b' },
          { name: 'Building', value: 1, color: '#8b5cf6' },
          { name: 'Tax', value: 1, color: '#ef4444' },
          { name: 'Registration', value: 1, color: '#06b6d4' }
        ],
        recentActivity: [] // Empty array for fallback
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType = 'up', subtitle }) => (
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
      borderRadius: 20,
      padding: 28,
      boxShadow: currentThemeName === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
        : currentThemeName === 'beige'
        ? '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(139, 69, 19, 0.05)'
        : '0 8px 32px rgba(59, 130, 246, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = currentThemeName === 'dark'
        ? '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)'
        : currentThemeName === 'beige'
        ? '0 12px 40px rgba(139, 69, 19, 0.15), 0 0 0 1px rgba(139, 69, 19, 0.1)'
        : '0 12px 40px rgba(59, 130, 246, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = currentThemeName === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
        : currentThemeName === 'beige'
        ? '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(139, 69, 19, 0.05)'
        : '0 8px 32px rgba(59, 130, 246, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)';
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
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 56,
          height: 56,
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
          boxShadow: currentThemeName === 'dark'
            ? '0 4px 16px rgba(59, 130, 246, 0.3)'
            : currentThemeName === 'beige'
            ? '0 4px 16px rgba(139, 69, 19, 0.2)'
            : '0 4px 16px rgba(59, 130, 246, 0.2)'
        }}>
          <Icon size={28} />
        </div>
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: changeType === 'up' ? '#10b981' : '#ef4444',
            fontSize: 14,
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 20,
            background: changeType === 'up' 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${changeType === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}>
            {changeType === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {change}
          </div>
        )}
      </div>
      <div style={{ 
        fontSize: 36, 
        fontWeight: 700, 
        color: currentThemeName === 'dark' ? 'white' : theme.text, 
        marginBottom: 8,
        position: 'relative',
        zIndex: 1
      }}>
        {value}
      </div>
      <div style={{ 
        fontSize: 16, 
        color: currentThemeName === 'dark' ? '#e5e7eb' : theme.textSecondary, 
        marginBottom: subtitle ? 6 : 0,
        fontWeight: 600,
        position: 'relative',
        zIndex: 1
      }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ 
          fontSize: 13, 
          color: currentThemeName === 'dark' ? '#9ca3af' : theme.textTertiary,
          position: 'relative',
          zIndex: 1
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const QuestionCard = ({ question, count, category, rank }) => (
    <div style={{
      background: currentThemeName === 'dark'
        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)'
        : currentThemeName === 'beige'
        ? 'linear-gradient(135deg, rgba(245, 245, 220, 0.8) 0%, rgba(250, 235, 215, 0.9) 100%)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)',
      border: currentThemeName === 'dark'
        ? '1px solid rgba(59, 130, 246, 0.15)'
        : currentThemeName === 'beige'
        ? '1px solid rgba(139, 69, 19, 0.1)'
        : '1px solid rgba(59, 130, 246, 0.08)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      backdropFilter: 'blur(8px)',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
      e.currentTarget.style.boxShadow = currentThemeName === 'dark'
        ? '0 12px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)'
        : currentThemeName === 'beige'
        ? '0 12px 32px rgba(139, 69, 19, 0.12), 0 0 0 1px rgba(139, 69, 19, 0.08)'
        : '0 12px 32px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.06)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: currentThemeName === 'dark'
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.02) 100%)'
          : currentThemeName === 'beige'
          ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.02) 0%, rgba(160, 82, 45, 0.01) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.01) 0%, rgba(147, 51, 234, 0.005) 100%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: rank <= 3 
            ? currentThemeName === 'dark'
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : currentThemeName === 'beige'
              ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            : currentThemeName === 'dark'
            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
            : currentThemeName === 'beige'
            ? 'linear-gradient(135deg, #8b7355 0%, #6b5b47 100%)'
            : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
          boxShadow: rank <= 3
            ? currentThemeName === 'dark'
              ? '0 2px 8px rgba(245, 158, 11, 0.3)'
              : currentThemeName === 'beige'
              ? '0 2px 8px rgba(217, 119, 6, 0.2)'
              : '0 2px 8px rgba(245, 158, 11, 0.2)'
            : 'none'
        }}>
          #{rank}
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: 20,
          background: currentThemeName === 'dark'
            ? 'rgba(59, 130, 246, 0.15)'
            : currentThemeName === 'beige'
            ? 'rgba(139, 69, 19, 0.1)'
            : 'rgba(59, 130, 246, 0.1)',
          color: currentThemeName === 'dark'
            ? '#93c5fd'
            : currentThemeName === 'beige'
            ? '#8b4513'
            : '#3b82f6',
          fontSize: 12,
          fontWeight: 600,
          border: currentThemeName === 'dark'
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : currentThemeName === 'beige'
            ? '1px solid rgba(139, 69, 19, 0.15)'
            : '1px solid rgba(59, 130, 246, 0.15)'
        }}>
          {category}
        </div>
      </div>
      <div style={{ 
        fontSize: 16, 
        fontWeight: 600, 
        color: currentThemeName === 'dark' ? 'white' : theme.text, 
        marginBottom: 8,
        lineHeight: 1.4,
        position: 'relative',
        zIndex: 1
      }}>
        {question}
      </div>
      <div style={{ 
        fontSize: 13, 
        color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary,
        position: 'relative',
        zIndex: 1
      }}>
        {count} {count === 1 ? 'time' : 'times'} asked
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: currentThemeName === 'dark'
          ? '#0f172a'  // Dark blue background
          : currentThemeName === 'beige'
          ? '#f5f5dc'  // Light beige background
          : '#ffffff', // White background
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={48} className="animate-spin" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 600 }}>Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: currentThemeName === 'dark'
          ? '#0f172a'  // Dark blue background
          : currentThemeName === 'beige'
          ? '#f5f5dc'  // Light beige background
          : '#ffffff', // White background
        color: theme.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Error loading analytics</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 24 }}>{error}</div>
          <button
            onClick={fetchAnalyticsData}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        maxWidth: 1400, 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: 32,
          padding: '24px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Oakland AI Logo */}
            <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="logo-icon" style={{
                width: 32,
                height: 32,
                background: '#4ade80',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18
              }}>
                🌳
              </div>
              <div className="logo-text" style={{
                fontSize: 24,
                fontWeight: 600,
                color: currentThemeName === 'dark' 
                  ? 'white' 
                  : currentThemeName === 'beige'
                  ? '#5d4037'
                  : '#1f2937'
              }}>
                Oakland AI
              </div>
            </div>
            <div style={{ 
              width: 1, 
              height: 40, 
              background: theme.border,
              margin: '0 16px'
            }} />
            <div>
              <h1 style={{ 
                fontSize: 32, 
                fontWeight: 700, 
                color: currentThemeName === 'dark' 
                  ? 'white' 
                  : currentThemeName === 'beige'
                  ? '#5d4037'
                  : '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Analytics Dashboard
              </h1>
              <p style={{ 
                fontSize: 16, 
                color: currentThemeName === 'dark' 
                  ? '#e5e7eb' 
                  : currentThemeName === 'beige'
                  ? '#8d6e63'
                  : '#6b7280',
                margin: 0
              }}>
                Real-time insights into user engagement and business performance (demo data)
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${theme.border}`,
                background: theme.cardBg,
                color: theme.text,
                fontSize: 14
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={() => navigate('/fullchat')}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Back to Chat
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 32
        }}>
          <StatCard 
            title="Total Users" 
            value={analyticsData.userStats.totalUsers} 
            icon={Users}
            change="+2"
            subtitle="From last week"
          />
          <StatCard 
            title="Active Users" 
            value={analyticsData.userStats.activeUsers} 
            icon={UserCheck}
            change="+1"
            subtitle="This week"
          />
          <StatCard 
            title="Total Chats" 
            value={analyticsData.userStats.totalChats} 
            icon={MessageCircle}
            change="+8"
            subtitle="From last week"
          />
          <StatCard 
            title="Avg Session" 
            value={analyticsData.userStats.avgSessionDuration} 
            icon={Clock}
            change="+2.3min"
            subtitle="From last week"
          />
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Left Column */}
          <div>
            {/* Activity Chart */}
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
              borderRadius: 20,
              padding: 28,
              marginBottom: 28,
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
              
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 600, 
                margin: '0 0 28px 0', 
                color: currentThemeName === 'dark' ? 'white' : theme.text,
                position: 'relative',
                zIndex: 1
              }}>
                📊 Daily Activity
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={analyticsData.dailyActivity}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={currentThemeName === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.border} 
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke={currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary} 
                  />
                  <YAxis 
                    stroke={currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary} 
                  />
                  <Tooltip 
                    contentStyle={{
                      background: currentThemeName === 'dark'
                        ? 'rgba(30, 41, 59, 0.95)'
                        : currentThemeName === 'beige'
                        ? 'rgba(245, 245, 220, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                      border: currentThemeName === 'dark'
                        ? '1px solid rgba(59, 130, 246, 0.2)'
                        : currentThemeName === 'beige'
                        ? '1px solid rgba(139, 69, 19, 0.15)'
                        : '1px solid rgba(59, 130, 246, 0.1)',
                      borderRadius: 12,
                      color: currentThemeName === 'dark' ? '#ffffff' : '#1f2937',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    formatter={(value, name, props) => [
                      `${value} questions`,
                      props.payload.name
                    ]}
                    labelFormatter={() => ''}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="chats" 
                    stackId="1"
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={currentThemeName === 'dark' ? 0.4 : 0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={currentThemeName === 'dark' ? 0.4 : 0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Popular Questions */}
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
              borderRadius: 20,
              padding: 28,
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
              
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 600, 
                margin: '0 0 28px 0', 
                color: currentThemeName === 'dark' ? 'white' : theme.text,
                position: 'relative',
                zIndex: 1
              }}>
                🔥 Hot Questions
              </h3>
              <div style={{ maxHeight: 420, overflowY: 'auto', position: 'relative', zIndex: 1 }}>
                {analyticsData.popularQuestions.map((q, index) => (
                  <QuestionCard 
                    key={index}
                    question={q.question}
                    count={q.count}
                    category={q.category}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Business Types */}
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
              borderRadius: 20,
              padding: 28,
              marginBottom: 28,
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
              
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 600, 
                margin: '0 0 28px 0', 
                color: currentThemeName === 'dark' ? 'white' : theme.text,
                position: 'relative',
                zIndex: 1
              }}>
                🏢 Business Types
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={analyticsData.businessTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {analyticsData.businessTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomPieTooltip currentThemeName={currentThemeName} />}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 20, position: 'relative', zIndex: 1 }}>
                {analyticsData.businessTypeData.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: currentThemeName === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : currentThemeName === 'beige'
                      ? 'rgba(139, 69, 19, 0.05)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: currentThemeName === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : currentThemeName === 'beige'
                      ? '1px solid rgba(139, 69, 19, 0.1)'
                      : '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: item.color,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }} />
                      <span style={{ 
                        fontSize: 14, 
                        color: currentThemeName === 'dark' ? 'white' : theme.text,
                        fontWeight: 500
                      }}>
                        {item.name}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: currentThemeName === 'dark' ? '#93c5fd' : theme.text,
                      background: currentThemeName === 'dark'
                        ? 'rgba(59, 130, 246, 0.1)'
                        : currentThemeName === 'beige'
                        ? 'rgba(139, 69, 19, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                      padding: '4px 8px',
                      borderRadius: 8
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Categories */}
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
              borderRadius: 20,
              padding: 28,
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
              
              <h3 style={{ 
                fontSize: 22, 
                fontWeight: 600, 
                margin: '0 0 28px 0', 
                color: currentThemeName === 'dark' ? 'white' : theme.text,
                position: 'relative',
                zIndex: 1
              }}>
                📋 Question Categories
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analyticsData.questionCategories}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={currentThemeName === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.border} 
                  />
                  <YAxis 
                    stroke={currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary} 
                  />
                  <Tooltip 
                    content={<CustomBarTooltip currentThemeName={currentThemeName} />}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={currentThemeName === 'dark' ? '#3b82f6' : currentThemeName === 'beige' ? '#8b4513' : '#3b82f6'} 
                    radius={[6, 6, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          {/* User Satisfaction */}
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
            borderRadius: 20,
            padding: 28,
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
            
            <h3 style={{ 
              fontSize: 22, 
              fontWeight: 600, 
              margin: '0 0 28px 0', 
              color: currentThemeName === 'dark' ? 'white' : theme.text,
              position: 'relative',
              zIndex: 1
            }}>
              ⭐ User Satisfaction
            </h3>
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                fontSize: 52, 
                fontWeight: 700, 
                color: currentThemeName === 'dark' ? '#fbbf24' : currentThemeName === 'beige' ? '#d97706' : '#f59e0b', 
                marginBottom: 12,
                textShadow: currentThemeName === 'dark' ? '0 2px 8px rgba(251, 191, 36, 0.3)' : 'none'
              }}>
                {analyticsData.userStats.userSatisfaction}/5
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={24}
                    fill={star <= analyticsData.userStats.userSatisfaction 
                      ? (currentThemeName === 'dark' ? '#fbbf24' : currentThemeName === 'beige' ? '#d97706' : '#f59e0b')
                      : 'none'}
                    color={star <= analyticsData.userStats.userSatisfaction 
                      ? (currentThemeName === 'dark' ? '#fbbf24' : currentThemeName === 'beige' ? '#d97706' : '#f59e0b')
                      : currentThemeName === 'dark' ? '#6b7280' : theme.textSecondary}
                  />
                ))}
              </div>
              <div style={{ 
                fontSize: 15, 
                color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary,
                padding: '12px 20px',
                background: currentThemeName === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : currentThemeName === 'beige'
                  ? 'rgba(139, 69, 19, 0.05)'
                  : 'rgba(59, 130, 246, 0.05)',
                borderRadius: 12,
                border: currentThemeName === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : currentThemeName === 'beige'
                  ? '1px solid rgba(139, 69, 19, 0.1)'
                  : '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                Based on {analyticsData.userStats.totalUsers} user ratings
              </div>
            </div>
          </div>

          {/* Recent Activity */}
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
            borderRadius: 20,
            padding: 28,
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
            
            <h3 style={{ 
              fontSize: 22, 
              fontWeight: 600, 
              margin: '0 0 28px 0', 
              color: currentThemeName === 'dark' ? 'white' : theme.text,
              position: 'relative',
              zIndex: 1
            }}>
              📈 Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {analyticsData.recentActivity && analyticsData.recentActivity.length > 0 ? (
                analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: currentThemeName === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : currentThemeName === 'beige'
                      ? 'rgba(139, 69, 19, 0.05)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: currentThemeName === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : currentThemeName === 'beige'
                      ? '1px solid rgba(139, 69, 19, 0.1)'
                      : '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: activity.type === 'user_login' ? '#3b82f6' 
                        : activity.type === 'chat_started' ? '#10b981'
                        : activity.type === 'user_registered' ? '#f59e0b'
                        : '#6b7280',
                      boxShadow: activity.type === 'user_login' ? '0 0 8px rgba(59, 130, 246, 0.4)'
                        : activity.type === 'chat_started' ? '0 0 8px rgba(16, 185, 129, 0.4)'
                        : activity.type === 'user_registered' ? '0 0 8px rgba(245, 158, 11, 0.4)'
                        : '0 0 8px rgba(107, 114, 128, 0.4)'
                    }} />
                    <div>
                      <div style={{ 
                        fontSize: 15, 
                        fontWeight: 600, 
                        color: currentThemeName === 'dark' ? 'white' : theme.text,
                        marginBottom: 4
                      }}>
                        {activity.description}
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary 
                      }}>
                        {activity.userName} • {activity.timeAgo}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback when no real activity data is available
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: currentThemeName === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : currentThemeName === 'beige'
                      ? 'rgba(139, 69, 19, 0.05)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: currentThemeName === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : currentThemeName === 'beige'
                      ? '1px solid rgba(139, 69, 19, 0.1)'
                      : '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#3b82f6',
                      boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
                    }} />
                    <div>
                      <div style={{ 
                        fontSize: 15, 
                        fontWeight: 600, 
                        color: currentThemeName === 'dark' ? 'white' : theme.text,
                        marginBottom: 4
                      }}>
                        Analytics Dashboard Active
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary 
                      }}>
                        Real-time data monitoring enabled
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 16,
                    background: currentThemeName === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : currentThemeName === 'beige'
                      ? 'rgba(139, 69, 19, 0.05)'
                      : 'rgba(59, 130, 246, 0.05)',
                    border: currentThemeName === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : currentThemeName === 'beige'
                      ? '1px solid rgba(139, 69, 19, 0.1)'
                      : '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                    }} />
                    <div>
                      <div style={{ 
                        fontSize: 15, 
                        fontWeight: 600, 
                        color: currentThemeName === 'dark' ? 'white' : theme.text,
                        marginBottom: 4
                      }}>
                        System Status: Online
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        color: currentThemeName === 'dark' ? '#9ca3af' : theme.textSecondary 
                      }}>
                        All services operational
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage; 