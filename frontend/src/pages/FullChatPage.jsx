import React, { useState, useRef, useEffect } from 'react';

function FullChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language: 'en', businessType, userId: 1 })
      });
      
      const data = await response.json();
      const botMessage = { type: 'answer', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { type: 'answer', content: 'Sorry, I\'m having trouble connecting. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleQuickOption = (option) => {
    handleSendMessage(`Tell me about ${option.toLowerCase()}`);
  };

  const handleBusinessTypeSelect = (type) => {
    setBusinessType(type);
    const userMessage = { type: 'user', content: `I own a ${type}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Add a follow-up question
    const botMessage = { type: 'question', content: 'Great! What would you like to know about running your business in Oakland?', timestamp: new Date() };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="full-chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="logo-icon">🍃</div>
          <div className="logo-text">Oakland AI</div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <div>
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">Business Owner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {/* Quick Options */}
        <div className="quick-options">
          <button className="option-pill" onClick={() => handleQuickOption('Business License')}>
            📋 Business License
          </button>
          <button className="option-pill" onClick={() => handleQuickOption('Parking Rules')}>
            🚗 Parking Rules
          </button>
          <button className="option-pill" onClick={() => handleQuickOption('Permits')}>
            📄 Permits
          </button>
          <button className="option-pill" onClick={() => handleQuickOption('Taxes')}>
            💰 Taxes
          </button>
        </div>

        {/* Business Type Selection */}
        {!businessType && (
          <div className="business-type-section">
            <div className="business-type-question">What type of business do you own?</div>
            <div className="business-type-buttons">
              <button 
                className="business-type-btn"
                onClick={() => handleBusinessTypeSelect('beauty salon')}
              >
                I own a beauty salon
              </button>
              <button 
                className="business-type-btn"
                onClick={() => handleBusinessTypeSelect('restaurant')}
              >
                I own a restaurant
              </button>
              <button 
                className="business-type-btn"
                onClick={() => handleBusinessTypeSelect('retail store')}
              >
                I own a retail store
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && !businessType && (
            <div className="welcome-message">
              <h2>Welcome to Oakland AI! 👋</h2>
              <p>I'm here to help you navigate running your business in Oakland. Ask me anything about licenses, permits, regulations, or local business resources.</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type === 'question' ? 'chat-question' : message.type === 'answer' ? 'chat-answer' : 'user-message'}`}>
              {message.content}
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-answer">
              <div className="spinner"></div>
              Oakland AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="message-input-container">
            <button type="button" className="voice-btn">
              🎤
            </button>
            <input
              type="text"
              placeholder="Ask me anything about your business in Oakland..."
              className="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={isLoading || !inputMessage.trim()}
            >
              →
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <div>Powered by OpenAI</div>
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#language">Language</a>
          <a href="#help">Help</a>
        </div>
      </div>
    </div>
  );
}

export default FullChatPage; 