import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, RefreshCw, User, MessageCircle, Home, UtensilsCrossed, ShoppingBag, Coffee, Scissors, Camera, Briefcase, BookOpen, Book, Building2, Heart, Star, Shield, Edit, Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Gem, Bell, Mail, Settings, MapPin, Calendar, Lock, Unlock, Eye, EyeOff, Check, X, Minus, ArrowRight, ArrowLeft, Bookmark, Share, Upload, Download, Play, MonitorSmartphone, FileText, Car, File, DollarSign, Map, ShieldCheck, Users, Lightbulb, Gift, Droplet, Flame, KeyRound, Megaphone, ClipboardCheck, Trash, AlertTriangle, Building, BadgeCheck, Mic, MicOff } from 'lucide-react';

function FullChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [user, setUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const [randomBusinessOptions, setRandomBusinessOptions] = useState([]);
  const [changingOptions, setChangingOptions] = useState(new Set());
  const [changingBusinessOptions, setChangingBusinessOptions] = useState(new Set());

  // All available business options
  const allBusinessOptions = [
    { type: 'beauty salon', icon: <Scissors size={32} color="#60a5fa" />, label: 'I own a beauty salon' },
    { type: 'restaurant', icon: <UtensilsCrossed size={32} color="#f59e42" />, label: 'I own a restaurant' },
    { type: 'retail store', icon: <ShoppingBag size={32} color="#f472b6" />, label: 'I own a retail store' },
    { type: 'coffee shop', icon: <Coffee size={32} color="#a3a3a3" />, label: 'I own a coffee shop' },
    { type: 'barbershop', icon: <Scissors size={32} color="#f87171" />, label: 'I own a barbershop' },
    { type: 'bakery', icon: <Home size={32} color="#fbbf24" />, label: 'I own a bakery' },
    { type: 'gym', icon: <Heart size={32} color="#34d399" />, label: 'I own a gym' },
    { type: 'auto repair', icon: <Settings size={32} color="#f59e42" />, label: 'I own an auto repair shop' },
    { type: 'laundry', icon: <ShoppingBag size={32} color="#60a5fa" />, label: 'I own a laundry service' },
    { type: 'pet grooming', icon: <User size={32} color="#fbbf24" />, label: 'I own a pet grooming business' },
    { type: 'tattoo parlor', icon: <Edit size={32} color="#a78bfa" />, label: 'I own a tattoo parlor' },
    { type: 'nail salon', icon: <Star size={32} color="#f472b6" />, label: 'I own a nail salon' },
    { type: 'photography studio', icon: <Camera size={32} color="#60a5fa" />, label: 'I own a photography studio' },
    { type: 'consulting', icon: <Briefcase size={32} color="#a3a3a3" />, label: 'I own a consulting business' },
    { type: 'daycare', icon: <User size={32} color="#fbbf24" />, label: 'I own a daycare center' },
    { type: 'cleaning service', icon: <Home size={32} color="#34d399" />, label: 'I own a cleaning service' },
    { type: 'food truck', icon: <ShoppingBag size={32} color="#f59e42" />, label: 'I own a food truck' },
    { type: 'yoga studio', icon: <User size={32} color="#a78bfa" />, label: 'I own a yoga studio' },
    { type: 'music school', icon: <Star size={32} color="#60a5fa" />, label: 'I own a music school' },
    { type: 'dance studio', icon: <User size={32} color="#f472b6" />, label: 'I own a dance studio' },
    { type: 'art gallery', icon: <BookOpen size={32} color="#fbbf24" />, label: 'I own an art gallery' },
    { type: 'bookstore', icon: <BookOpen size={32} color="#a3a3a3" />, label: 'I own a bookstore' },
    { type: 'florist', icon: <Star size={32} color="#34d399" />, label: 'I own a florist shop' },
    { type: 'jewelry store', icon: <Gem size={32} color="#60a5fa" />, label: 'I own a jewelry store' },
    { type: 'vintage shop', icon: <Book size={32} color="#f59e42" />, label: 'I own a vintage shop' },
    { type: 'tech startup', icon: <MonitorSmartphone size={32} color="#a78bfa" />, label: 'I own a tech startup' },
    { type: 'other', icon: <Building2 size={32} color="#a3a3a3" />, label: 'I own another type of business' }
  ];

  // All available quick options
  const allQuickOptions = [
    { label: 'Business License', icon: <FileText size={32} color="#93c5fd" />, value: 'Business License' },
    { label: 'Parking Rules', icon: <Car size={32} color="#93c5fd" />, value: 'Parking Rules' },
    { label: 'Permits', icon: <File size={32} color="#93c5fd" />, value: 'Permits' },
    { label: 'Taxes', icon: <DollarSign size={32} color="#93c5fd" />, value: 'Taxes' },
    { label: 'Zoning', icon: <Map size={32} color="#93c5fd" />, value: 'Zoning' },
    { label: 'Health & Safety', icon: <ShieldCheck size={32} color="#93c5fd" />, value: 'Health & Safety' },
    { label: 'Employment Law', icon: <Users size={32} color="#93c5fd" />, value: 'Employment Law' },
    { label: 'Insurance', icon: <Shield size={32} color="#93c5fd" />, value: 'Insurance' },
    { label: 'Accessibility', icon: <KeyRound size={32} color="#93c5fd" />, value: 'Accessibility' },
    { label: 'Marketing', icon: <Megaphone size={32} color="#93c5fd" />, value: 'Marketing' },
    { label: 'Grants', icon: <Gift size={32} color="#93c5fd" />, value: 'Grants' },
    { label: 'Utilities', icon: <Droplet size={32} color="#93c5fd" />, value: 'Utilities' },
    { label: 'Inspections', icon: <ClipboardCheck size={32} color="#93c5fd" />, value: 'Inspections' },
    { label: 'Waste Disposal', icon: <Trash size={32} color="#93c5fd" />, value: 'Waste Disposal' },
    { label: 'Fire Safety', icon: <Flame size={32} color="#93c5fd" />, value: 'Fire Safety' },
    { label: 'Security', icon: <ShieldCheck size={32} color="#93c5fd" />, value: 'Security' },
    { label: 'Building Codes', icon: <Building size={32} color="#93c5fd" />, value: 'Building Codes' },
    { label: 'Certifications', icon: <BadgeCheck size={32} color="#93c5fd" />, value: 'Certifications' },
    { label: 'Emergencies', icon: <AlertTriangle size={32} color="#93c5fd" />, value: 'Emergencies' },
    { label: 'Innovation', icon: <Lightbulb size={32} color="#93c5fd" />, value: 'Innovation' },
  ];

  // State for quick options
  const [quickOptions, setQuickOptions] = useState([]);

  // Function to get random business options
  const getRandomBusinessOptions = () => {
    const shuffled = [...allBusinessOptions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Function to get random quick options (4 for pre-conversation, 8 for during conversation)
  const getRandomQuickOptions = (isConversationStarted = false) => {
    const shuffled = [...allQuickOptions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, isConversationStarted ? 8 : 4);
  };

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    
    // Set random business options
    setRandomBusinessOptions(getRandomBusinessOptions());
  }, []);

  // Set initial quick options on mount
  useEffect(() => {
    setQuickOptions(getRandomQuickOptions(false));
  }, []);

  // Update quick options every time user sends a message or starts a new chat
  useEffect(() => {
    if (messages.length > 0 || businessType) {
      setQuickOptions(getRandomQuickOptions(true));
    }
  }, [messages.length, businessType]);

  // Timer to change quick options individually every 1 second (both states)
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      // Change one random option at a time
      const randomIndex = Math.floor(Math.random() * quickOptions.length);
      setChangingOptions(prev => new Set([...prev, randomIndex]));
      
      // After matrix effect duration, update the option
      setTimeout(() => {
        const newOptions = [...quickOptions];
        const availableOptions = allQuickOptions.filter(option => 
          !newOptions.some(existing => existing.label === option.label)
        );
        if (availableOptions.length > 0) {
          const randomNewOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
          newOptions[randomIndex] = randomNewOption;
          setQuickOptions(newOptions);
        }
        setChangingOptions(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomIndex);
          return newSet;
        });
      }, 2000); // Matrix effect duration
    }, 2010);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quickOptions]);

  // Timer to change business type options individually
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      // Change one random business option at a time
      const randomIndex = Math.floor(Math.random() * randomBusinessOptions.length);
      setChangingBusinessOptions(prev => new Set([...prev, randomIndex]));
      
      // After matrix effect duration, update the option
      setTimeout(() => {
        const newOptions = [...randomBusinessOptions];
        const availableOptions = allBusinessOptions.filter(option => 
          !newOptions.some(existing => existing.type === option.type)
        );
        if (availableOptions.length > 0) {
          const randomNewOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
          newOptions[randomIndex] = randomNewOption;
          setRandomBusinessOptions(newOptions);
        }
        setChangingBusinessOptions(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomIndex);
          return newSet;
        });
      }, 2100); // Matrix effect duration
    }, 2110);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [randomBusinessOptions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Scroll down when user sends a message
    setTimeout(() => scrollToBottom(), 100);

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

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording functionality
    // For now, just toggle the state
  };

  // Helper to render markdown-like content for AI answers
  function renderMarkdown(content) {
    // Replace H1 (lines starting with # )
    content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    // Replace H2 (lines starting with ## )
    content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    // Replace bold **text**
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace bullet points
    content = content.replace(/^\s*[-*] (.*$)/gim, '<li>$1</li>');
    // Replace newlines with <br/>
    content = content.replace(/\n/g, '<br/>');
    // Wrap <li> in <ul>
    content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    return content;
  }

  function formatAnswer(content, index) {
    return (
      <div style={{ textAlign: 'left' }}>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      </div>
    );
  }

  return (
    <div className="full-chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="logo-text" style={{
            fontSize: '24px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>Oakland AI</div>
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
        {/* New Chat Button and Quick Options Row - When conversation started */}
        {(messages.length > 0 || businessType) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 32px 0 32px',
            borderBottom: '1px solid rgba(51, 65, 85, 0.3)',
            paddingBottom: '12px'
          }}>
            {/* Quick Options */}
            <div className="quick-options" style={{ 
              display: 'flex', 
              gap: '16px'
            }}>
              {quickOptions.map((option, idx) => (
                <button
                  key={`${option.label}-${idx}-${changingOptions.has(idx) ? 'changing' : 'stable'}`}
                  className="option-pill"
                  onClick={() => handleQuickOption(option.value)}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    minWidth: '80px', 
                    padding: '12px 8px', 
                    borderRadius: '16px', 
                    background: changingOptions.has(idx) ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.8)', 
                    border: changingOptions.has(idx) ? '1px solid #22c55e' : '1px solid #334155', 
                    color: changingOptions.has(idx) ? '#22c55e' : '#93c5fd', 
                    fontWeight: 600, 
                    fontSize: '12px',
                    boxShadow: changingOptions.has(idx) ? '0 0 20px rgba(34,197,94,0.3)' : '0 2px 8px rgba(59,130,246,0.10)', 
                    transition: changingOptions.has(idx) ? 'all 0.3s ease' : 'background 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!changingOptions.has(idx)) {
                      e.currentTarget.style.background = 'rgba(51,65,85,0.9)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!changingOptions.has(idx)) {
                      e.currentTarget.style.background = 'rgba(30,41,59,0.8)';
                    }
                  }}
                >
                  {changingOptions.has(idx) && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(34,197,94,0.1) 50%, transparent 70%)',
                      animation: 'matrix-sweep 1s linear infinite',
                      zIndex: 1
                    }} />
                  )}
                  <div style={{ 
                    fontSize: '20px', 
                    marginBottom: '4px',
                    zIndex: 2,
                    position: 'relative'
                  }}>{option.icon}</div>
                  <span style={{ 
                    fontSize: '11px', 
                    textAlign: 'center', 
                    lineHeight: '1.2',
                    zIndex: 2,
                    position: 'relative'
                  }}>{option.label}</span>
                </button>
              ))}
            </div>

                        {/* New Chat Button */}
            <button
              onClick={() => {
                setMessages([]);
                setInputMessage('');
                setBusinessType('');

                setRandomBusinessOptions(getRandomBusinessOptions());
                setQuickOptions(getRandomQuickOptions(false));
              }}
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '0 24px',
                height: '44px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.10)',
                transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                letterSpacing: '0.01em',
                marginTop: '-40px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.18)';
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.10)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <Plus size={20} style={{ marginRight: '6px' }} />
              New Chat
            </button>
          </div>
        )}

        {/* Quick Options - When conversation hasn't started */}
        {messages.length === 0 && !businessType && (
          <div className="quick-options" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px', 
            margin: '32px 0'
          }}>
            {quickOptions.map((option, idx) => (
              <button
                key={`${option.label}-${idx}-${changingOptions.has(idx) ? 'changing' : 'stable'}`}
                className="option-pill"
                onClick={() => handleQuickOption(option.value)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  minWidth: '140px', 
                  padding: '24px 16px', 
                  borderRadius: '24px', 
                  background: changingOptions.has(idx) ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.8)', 
                  border: changingOptions.has(idx) ? '1px solid #22c55e' : '1px solid #334155', 
                  color: changingOptions.has(idx) ? '#22c55e' : '#93c5fd', 
                  fontWeight: 600, 
                  fontSize: '18px', 
                  boxShadow: changingOptions.has(idx) ? '0 0 20px rgba(34,197,94,0.3)' : '0 2px 8px rgba(59,130,246,0.10)', 
                  transition: changingOptions.has(idx) ? 'all 0.3s ease' : 'background 0.2s',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  if (!changingOptions.has(idx)) {
                    e.currentTarget.style.background = 'rgba(51,65,85,0.9)';
                  }
                }}
                onMouseLeave={e => {
                  if (!changingOptions.has(idx)) {
                    e.currentTarget.style.background = 'rgba(30,41,59,0.8)';
                  }
                }}
              >
                {changingOptions.has(idx) && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(34,197,94,0.1) 50%, transparent 70%)',
                    animation: 'matrix-sweep 1s linear infinite',
                    zIndex: 1
                  }} />
                )}
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '12px',
                  zIndex: 2,
                  position: 'relative'
                }}>{option.icon}</div>
                <span style={{ 
                  fontSize: '18px', 
                  textAlign: 'center', 
                  lineHeight: '1.2',
                  zIndex: 2,
                  position: 'relative'
                }}>{option.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Business Type Selection */}
        {messages.length === 0 && !businessType && (
          <div className="business-type-section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            margin: '-19px 0',
            marginTop: '-58px',
            scale: '0.8',
          }}>
            <div style={{
              background: 'rgba(30,41,59,0.95)',
              borderRadius: '32px',
              boxShadow: '0 4px 32px rgba(30,41,59,0.18)',
              padding: '40px 32px 32px 32px',
              minWidth: '340px',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1.5px solid #334155',
            }}>
              <div className="business-type-question" style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#93c5fd',
                marginBottom: '32px',
                textAlign: 'center',
                letterSpacing: '0.01em',
                textShadow: '0 2px 12px rgba(59,130,246,0.10)'
              }}>
                What type of business do you own?
              </div>
              <div className="business-type-buttons" style={{
                display: 'flex',
                gap: '32px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: '100%'
              }}>
                {randomBusinessOptions.map((option, index) => (
                  <button 
                    key={`${option.type}-${index}-${changingBusinessOptions.has(index) ? 'changing' : 'stable'}`}
                    className="business-type-btn"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '200px',
                      minHeight: '120px',
                      fontSize: '18px',
                      padding: '24px',
                      background: changingBusinessOptions.has(index) ? 'rgba(34,197,94,0.2)' : 'rgba(51,65,85,0.95)',
                      border: changingBusinessOptions.has(index) ? '1.5px solid #22c55e' : '1.5px solid #334155',
                      borderRadius: '24px',
                      color: changingBusinessOptions.has(index) ? '#22c55e' : '#a5b4fc',
                      fontWeight: 600,
                      boxShadow: changingBusinessOptions.has(index) ? '0 0 20px rgba(34,197,94,0.3)' : '0 2px 12px rgba(59,130,246,0.08)',
                      transition: changingBusinessOptions.has(index) ? 'all 0.3s ease' : 'background 0.2s, color 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => handleBusinessTypeSelect(option.type)}
                    onMouseEnter={e => {
                      if (!changingBusinessOptions.has(index)) {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(59,130,246,0.18)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!changingBusinessOptions.has(index)) {
                        e.currentTarget.style.background = 'rgba(51,65,85,0.95)';
                        e.currentTarget.style.color = '#a5b4fc';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(59,130,246,0.08)';
                      }
                    }}
                  >
                    {changingBusinessOptions.has(index) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(34,197,94,0.1) 50%, transparent 70%)',
                        animation: 'matrix-sweep 1s linear infinite',
                        zIndex: 1
                      }} />
                    )}
                    <span style={{
                      fontSize: '32px', 
                      marginBottom: '12px',
                      zIndex: 2,
                      position: 'relative'
                    }}>{option.icon}</span>
                    <span style={{
                      zIndex: 2,
                      position: 'relative'
                    }}>{option.label}</span>
                  </button>
                ))}
              </div>
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
              {message.type === 'answer' ? (
                <div className="bubble">{formatAnswer(message.content, index)}</div>
              ) : message.type === 'question' ? (
                <div className="bubble">{message.content}</div>
              ) : (
                <div className="bubble">{message.content}</div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="thinking-container">
              <div className="atom-container">
                <div className="nucleus"></div>
                <div className="electron"></div>
                <div className="electron"></div>
                <div className="electron"></div>
                <div className="electron"></div>
                <div className="orbit-path"></div>
                <div className="orbit-path"></div>
                <div className="orbit-path"></div>
                <div className="orbit-path"></div>
              </div>
              <div className="thinking-text">Oakland AI is thinking...</div>
              <div className="thinking-dots">
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
                <div className="thinking-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="message-input-container">
            <button 
              type="button" 
              className="voice-btn"
              onClick={handleVoiceToggle}
              style={{
                background: isRecording 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: isRecording 
                  ? '0 4px 16px rgba(239, 68, 68, 0.4)' 
                  : '0 2px 8px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {isRecording && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                  animation: 'pulse 1.5s infinite',
                  borderRadius: '50%'
                }} />
              )}
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
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
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="chat-footer">
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