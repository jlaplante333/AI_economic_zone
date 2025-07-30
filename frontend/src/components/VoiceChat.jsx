import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const VoiceChat = ({ onVoiceMessage, isListening, setIsListening, isProcessing }) => {
  const { theme, currentThemeName } = useTheme();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setError('');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          handleVoiceMessage(transcript);
        }
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    // Initialize text-to-speech
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
    } else {
      setError('Text-to-speech not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechRef.current && speechRef.current.speaking) {
        speechRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceMessage = async (message) => {
    if (!message.trim()) return;
    
    try {
      // Call the parent's onVoiceMessage function
      const response = await onVoiceMessage(message);
      
      // Speak the response
      if (response && response.trim()) {
        speakResponse(response);
      }
    } catch (error) {
      console.error('Error processing voice message:', error);
      setError('Error processing voice message');
    }
  };

  const speakResponse = (text) => {
    if (speechRef.current) {
      // Cancel any ongoing speech
      speechRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };
      
      speechRef.current.speak(utterance);
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const stopSpeaking = () => {
    if (speechRef.current && speechRef.current.speaking) {
      speechRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      {/* Voice Status Display */}
      {(isListening || isSpeaking || isProcessing) && (
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
          borderRadius: '16px',
          padding: '16px 20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          minWidth: '200px',
          textAlign: 'center'
        }}>
          {isListening && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6' }}>
              <Mic size={16} />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Listening...</span>
            </div>
          )}
          {isProcessing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
              <Loader size={16} className="animate-spin" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Processing...</span>
            </div>
          )}
          {isSpeaking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
              <Volume2 size={16} />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Speaking...</span>
            </div>
          )}
          {transcript && (
            <div style={{ 
              marginTop: '8px', 
              fontSize: '13px', 
              color: currentThemeName === 'dark' ? '#9ca3af' : '#6b7280',
              fontStyle: 'italic'
            }}>
              "{transcript}"
            </div>
          )}
          {error && (
            <div style={{ 
              marginTop: '8px', 
              fontSize: '13px', 
              color: '#ef4444',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* Voice Control Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Microphone Button */}
        <button
          onClick={toggleMicrophone}
          disabled={isProcessing}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: 'none',
            background: isListening
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : currentThemeName === 'dark'
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : currentThemeName === 'beige'
              ? 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            opacity: isProcessing ? 0.6 : 1,
            transform: isListening ? 'scale(1.1)' : 'scale(1)'
          }}
          onMouseEnter={(e) => {
            if (!isProcessing) {
              e.target.style.transform = isListening ? 'scale(1.15)' : 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = isListening ? 'scale(1.1)' : 'scale(1)';
            e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
          }}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            }}
          >
            <VolumeX size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceChat; 