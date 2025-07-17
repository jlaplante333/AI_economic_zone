import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userInfo));
  }, [navigate]);

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#64748b'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: '#ffffff',
        padding: '3rem',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Oakland AI
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '1rem',
          lineHeight: '1.3'
        }}>
          Welcome back, {user.name}!
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Ready to get help with your business? Let's start chatting!
        </p>
        
        <button
          onClick={() => navigate('/fullchat')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          Start Chatting
        </button>
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#64748b',
            margin: '0'
          }}>
            Need to switch accounts? <a 
              href="/login" 
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Log out
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage; 