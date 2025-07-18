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
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="chat-welcome">
          <div className="chat-welcome-icon">🏙️</div>
          <h3>Welcome to Oakland AI!</h3>
          <p>Ask me anything about running your business in Oakland.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type}`}
          >
            <div className={`message-content ${message.type}`}>
              {message.content}
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="loading-message">
          <div className="loading-content">
            <div className="spinner"></div>
            Oakland AI is thinking...
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow; 