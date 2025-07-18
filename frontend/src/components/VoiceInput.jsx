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
    <div className="voice-input-container">
      <button
        onClick={startListening}
        disabled={disabled}
        className={`voice-button ${listening ? 'listening' : ''}`}
      >
        {listening ? '🛑 Stop Listening' : '🎤 Speak'}
      </button>
      
      {listening && (
        <div className="listening-status">
          🎤 Listening... Speak now!
        </div>
      )}
      
      {error && (
        <div className="voice-error">
          {error}
        </div>
      )}
      
      {listening && (
        <button
          onClick={stopListening}
          className="stop-button"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default VoiceInput; 