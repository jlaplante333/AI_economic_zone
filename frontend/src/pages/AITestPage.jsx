import React, { useState, useEffect } from 'react';
import { config } from '../env';

function AITestPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAIStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/chat/status`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in first.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend server is running.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('AI Status check error:', err);
      setError(err.message || 'Failed to check AI status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      checkAIStatus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'green': return '#10b981';
      case 'yellow': return '#f59e0b';
      case 'red': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'green': return '✅';
      case 'yellow': return '⚠️';
      case 'red': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="ai-test-container">
      <div className="test-header">
        <h1>🤖 AI Connection Test</h1>
        <p>Check the status of your OpenAI API connection</p>
      </div>

      <div className="test-controls">
        <button 
          onClick={checkAIStatus} 
          disabled={loading}
          className="test-button"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={checkAIStatus}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/fullchat'}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Go to Chat
            </button>
          </div>
        </div>
      )}

      {status && (
        <div className="status-container">
          {/* Main Status */}
          <div className="main-status">
            <div 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(status.connection.status) }}
            >
              {getStatusIcon(status.connection.status)}
            </div>
            <div className="status-info">
              <h2>Status: {status.connection.status.toUpperCase()}</h2>
              <p>{status.connection.message}</p>
              {status.connection.responseTime && (
                <p>Response Time: {status.connection.responseTime}ms</p>
              )}
            </div>
          </div>

          {/* Environment Info */}
          <div className="status-section">
            <h3>🔧 Environment</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>OpenAI API Key:</strong> 
                <span className={status.environment.openaiApiKey === 'Configured' ? 'success' : 'error'}>
                  {status.environment.openaiApiKey}
                </span>
              </div>
              <div className="info-item">
                <strong>OpenAI API URL:</strong> {status.environment.openaiApiUrl}
              </div>
              <div className="info-item">
                <strong>Node Environment:</strong> {status.environment.nodeEnv}
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="status-section">
            <h3>🧪 Test Results</h3>
            <div className="test-details">
              <div className="info-item">
                <strong>Test Prompt:</strong> "{status.test.simplePrompt}"
              </div>
              <div className="info-item">
                <strong>Business Type:</strong> {status.test.businessType}
              </div>
              <div className="info-item">
                <strong>Response Type:</strong> 
                <span className={status.test.isFallback ? 'warning' : 'success'}>
                  {status.test.isFallback ? 'Fallback Response' : 'Real AI Response'}
                </span>
              </div>
              <div className="response-preview">
                <strong>Response Preview:</strong>
                <div className="response-text">
                  {status.test.response}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="timestamp">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AITestPage; 