import React, { useRef, useEffect } from 'react';

function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div style={{
      height: '400px',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      padding: '20px',
      overflowY: 'auto',
      backgroundColor: 'white',
      marginBottom: '20px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {messages.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏙️</div>
          <h3>Welcome to Oakland AI!</h3>
          <p>Ask me anything about running your business in Oakland.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className="message"
            style={{
              marginBottom: '15px',
              textAlign: message.type === 'user' ? 'right' : 'left'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '18px',
                backgroundColor: message.type === 'user' 
                  ? 'linear-gradient(135deg, #007bff, #0056b3)' 
                  : '#f8f9fa',
                color: message.type === 'user' ? '#333' : '#333',
                wordWrap: 'break-word',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {message.content}
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '12px 16px',
              borderRadius: '18px',
              backgroundColor: '#f8f9fa',
              color: '#666'
            }}
          >
            <div className="spinner" style={{ width: '20px', height: '20px', margin: '0' }}></div>
            Oakland AI is thinking...
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow; 