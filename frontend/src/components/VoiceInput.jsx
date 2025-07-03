import React, { useState } from 'react';

function VoiceInput({ onResult, disabled }) {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        onResult(transcript);
        setListening(false);
        setError('');
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.onstart = () => {
        setListening(true);
        setError('');
      };

      setRecognition(recognition);
    }
  }, [onResult]);

  const startListening = () => {
    if (!recognition) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    if (listening) {
      recognition.stop();
      return;
    }

    try {
      setError('');
      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Error starting voice recognition');
    }
  };

  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
    }
  };

  return (
    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
      <button
        onClick={startListening}
        disabled={disabled}
        style={{
          padding: '15px 30px',
          fontSize: '16px',
          backgroundColor: disabled ? '#6c757d' : (listening ? '#dc3545' : '#28a745'),
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        {listening ? '🛑 Stop Listening' : '🎤 Speak'}
      </button>
      
      {listening && (
        <div style={{ marginTop: '10px', color: '#666' }}>
          🎤 Listening... Speak now!
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '10px', color: '#dc3545', fontSize: '14px' }}>
          {error}
        </div>
      )}
      
      {listening && (
        <button
          onClick={stopListening}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default VoiceInput; 