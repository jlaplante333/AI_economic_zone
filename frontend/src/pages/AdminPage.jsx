import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      // For now, skip the analytics call since it requires authentication
      // and we don't have a proper auth system set up yet
      setStats({
        totalChats: 0,
        activeUsers: 0,
        businessTypes: [],
        recentChats: 0,
        message: 'Analytics data (mock - authentication required)'
      });
      
      // Uncomment this when you have proper authentication set up:
      /*
      const response = await fetch('/api/analytics/stats', {
        headers: {
          'Authorization': 'Bearer mock-token' // In real app, get from localStorage
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in.');
        navigate('/login');
      } else {
        setError('Failed to fetch analytics data');
      }
      */
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
      }}>
        <div style={{ fontSize: '24px', color: '#64748b', marginBottom: '16px' }}>Loading...</div>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Fetching analytics data</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: '50px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
      }}>
        <div style={{ fontSize: '24px', color: '#ef4444', marginBottom: '16px' }}>❌ Error</div>
        <div style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px' }}>{error}</div>
        <button
          onClick={() => navigate('/fullchat')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Go to Chat
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white'
          }}>
            📊
          </div>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0'
            }}>
              Analytics Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: '8px 0 0 0'
            }}>
              {stats?.message || 'Analytics overview'}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.totalChats || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Total Chats</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.activeUsers || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Active Users</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.recentChats || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Recent Activity</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏢</div>
            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {stats?.businessTypes?.length || 0}
            </div>
            <div style={{ fontSize: '14px', opacity: '0.9' }}>Business Types</div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => navigate('/fullchat')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Go to Chat
          </button>
          
          <button
            onClick={() => navigate('/test')}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#3b82f6',
              background: 'transparent',
              border: '2px solid #3b82f6',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3b82f6';
            }}
          >
            Test AI Connection
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage; 