import React, { useState, useEffect } from 'react';

function AITestPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAIStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAIStatus();
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