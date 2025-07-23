import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, RefreshCw, User, MessageCircle, Home, UtensilsCrossed, ShoppingBag, Coffee, Scissors, Camera, Briefcase, BookOpen, Book, Building2, Heart, Star, Shield, Edit, Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Gem, Bell, Mail, Settings, MapPin, Calendar, Lock, Unlock, Eye, EyeOff, Check, X, Minus, ArrowRight, ArrowLeft, Bookmark, Share, Upload, Download, Play, MonitorSmartphone, FileText, Car, File, DollarSign, Map, ShieldCheck, Users, Lightbulb, Gift, Droplet, Flame, KeyRound, Megaphone, ClipboardCheck, Trash, AlertTriangle, Building, BadgeCheck, Mic, MicOff, Leaf, Globe, Package, Truck, Monitor, BarChart3, Handshake, ArrowUpRight, AlertCircle, UserCheck, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import path from 'path';

function FullChatPage() {
  // Add bounce animation CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateX(-50%) translateY(0);
        }
        40% {
          transform: translateX(-50%) translateY(-5px);
        }
        60% {
          transform: translateX(-50%) translateY(-3px);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [user, setUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickOptionsModal, setShowQuickOptionsModal] = useState(false);
  const [showBusinessOptionsModal, setShowBusinessOptionsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  
  // Theme context
  const { theme, currentThemeName, toggleTheme, isToggling } = useTheme();
  
  // Debug theme context
  useEffect(() => {
    console.log('Theme context loaded:', { currentThemeName, theme: theme.primaryBg });
  }, [currentThemeName, theme]);
  
  // Monitor theme changes
  useEffect(() => {
    console.log('Theme changed! currentThemeName:', currentThemeName);
    console.log('New theme primaryBg:', theme.primaryBg);
  }, [currentThemeName]);

  const [randomBusinessOptions, setRandomBusinessOptions] = useState([]);
  
  // Close profile menu and modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.user-info') && !event.target.closest('[data-profile-menu]')) {
        setShowProfileMenu(false);
      }
      if (showQuickOptionsModal && !event.target.closest('.modal-content')) {
        setShowQuickOptionsModal(false);
      }
      if (showBusinessOptionsModal && !event.target.closest('.modal-content')) {
        setShowBusinessOptionsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showQuickOptionsModal, showBusinessOptionsModal]);

  // Scroll event listener to show/hide scroll button
  useEffect(() => {
    const chatMessages = chatMessagesRef.current;
    if (!chatMessages) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatMessages;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20; // 20px threshold
      setShowScrollButton(!isAtBottom);
    };

    // Check initial scroll position
    handleScroll();

    chatMessages.addEventListener('scroll', handleScroll);
    return () => chatMessages.removeEventListener('scroll', handleScroll);
  }, [messages, isLoading]); // Re-run when messages or loading state changes

  const [changingOptions, setChangingOptions] = useState(new Set());
  const [changingBusinessOptions, setChangingBusinessOptions] = useState(new Set());
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isQuickOptionsAtBottom, setIsQuickOptionsAtBottom] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log('Quick Options at bottom changed:', isQuickOptionsAtBottom);
  }, [isQuickOptionsAtBottom]);

  useEffect(() => {
    console.log('Business Modal at bottom changed:', isAtBottom);
  }, [isAtBottom]);

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
    { type: 'dental office', icon: <User size={32} color="#60a5fa" />, label: 'I own a dental office' },
    { type: 'law firm', icon: <Briefcase size={32} color="#f59e42" />, label: 'I own a law firm' },
    { type: 'real estate', icon: <Building2 size={32} color="#34d399" />, label: 'I own a real estate business' },
    { type: 'insurance agency', icon: <Shield size={32} color="#f472b6" />, label: 'I own an insurance agency' },
    { type: 'accounting firm', icon: <DollarSign size={32} color="#fbbf24" />, label: 'I own an accounting firm' },
    { type: 'marketing agency', icon: <Megaphone size={32} color="#a78bfa" />, label: 'I own a marketing agency' },
    { type: 'web design', icon: <MonitorSmartphone size={32} color="#60a5fa" />, label: 'I own a web design business' },
    { type: 'construction', icon: <Building size={32} color="#f59e42" />, label: 'I own a construction business' },
    { type: 'landscaping', icon: <Droplet size={32} color="#34d399" />, label: 'I own a landscaping business' },
    { type: 'plumbing', icon: <Settings size={32} color="#60a5fa" />, label: 'I own a plumbing business' },
    { type: 'electrical', icon: <Lightbulb size={32} color="#fbbf24" />, label: 'I own an electrical business' },
    { type: 'HVAC', icon: <Flame size={32} color="#f59e42" />, label: 'I own an HVAC business' },
    { type: 'roofing', icon: <Building size={32} color="#a3a3a3" />, label: 'I own a roofing business' },
    { type: 'painting', icon: <Edit size={32} color="#f472b6" />, label: 'I own a painting business' },
    { type: 'carpentry', icon: <Settings size={32} color="#f59e42" />, label: 'I own a carpentry business' },
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
    { label: 'Networking', icon: <Users size={32} color="#93c5fd" />, value: 'Business Networking' },
    { label: 'Financing', icon: <DollarSign size={32} color="#93c5fd" />, value: 'Business Financing' },
    { label: 'Legal Help', icon: <Briefcase size={32} color="#93c5fd" />, value: 'Legal Assistance' },
    { label: 'Accounting', icon: <FileText size={32} color="#93c5fd" />, value: 'Accounting Services' },
    { label: 'Technology', icon: <MonitorSmartphone size={32} color="#93c5fd" />, value: 'Technology Support' },
    { label: 'Sustainability', icon: <Leaf size={32} color="#93c5fd" />, value: 'Green Business' },
    { label: 'Export/Import', icon: <Globe size={32} color="#93c5fd" />, value: 'International Trade' },
    { label: 'E-commerce', icon: <ShoppingBag size={32} color="#93c5fd" />, value: 'Online Business' },
    { label: 'Social Media', icon: <Share size={32} color="#93c5fd" />, value: 'Social Media Marketing' },
    { label: 'Customer Service', icon: <MessageCircle size={32} color="#93c5fd" />, value: 'Customer Support' },
    { label: 'Inventory', icon: <Package size={32} color="#93c5fd" />, value: 'Inventory Management' },
    { label: 'Shipping', icon: <Truck size={32} color="#93c5fd" />, value: 'Shipping & Logistics' },
    { label: 'Data Protection', icon: <Lock size={32} color="#93c5fd" />, value: 'Data Security' },
    { label: 'Remote Work', icon: <Home size={32} color="#93c5fd" />, value: 'Remote Work Policies' },
    { label: 'Diversity', icon: <Users size={32} color="#93c5fd" />, value: 'Diversity & Inclusion' },
    { label: 'Mental Health', icon: <Heart size={32} color="#93c5fd" />, value: 'Employee Wellness' },
    { label: 'Training', icon: <BookOpen size={32} color="#93c5fd" />, value: 'Employee Training' },
    { label: 'Equipment', icon: <Settings size={32} color="#93c5fd" />, value: 'Business Equipment' },
    { label: 'Software', icon: <Monitor size={32} color="#93c5fd" />, value: 'Business Software' },
    { label: 'Analytics', icon: <BarChart3 size={32} color="#93c5fd" />, value: 'Business Analytics' },
    { label: 'Partnerships', icon: <Handshake size={32} color="#93c5fd" />, value: 'Business Partnerships' },
    { label: 'Expansion', icon: <ArrowUpRight size={32} color="#93c5fd" />, value: 'Business Growth' },
    { label: 'Crisis Management', icon: <AlertCircle size={32} color="#93c5fd" />, value: 'Crisis Planning' },
    { label: 'Succession', icon: <UserCheck size={32} color="#93c5fd" />, value: 'Succession Planning' },
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

  // Monitor scroll position in business modal
  useEffect(() => {
    if (!showBusinessOptionsModal) return;

    const modalContent = document.querySelector('.business-modal-content');
    if (!modalContent) return;

    const handleModalScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = modalContent;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      console.log('Business Modal Scroll:', { scrollTop, scrollHeight, clientHeight, isAtBottom });
      setIsAtBottom(isAtBottom);
    };

    // Check initial scroll position
    handleModalScroll();

    modalContent.addEventListener('scroll', handleModalScroll);
    return () => modalContent.removeEventListener('scroll', handleModalScroll);
  }, [showBusinessOptionsModal]);

  // Monitor scroll position in quick options modal
  useEffect(() => {
    if (!showQuickOptionsModal) return;

    const modalContent = document.querySelector('.quick-options-modal-content');
    if (!modalContent) return;

    const handleQuickOptionsScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = modalContent;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      console.log('Quick Options Scroll:', { scrollTop, scrollHeight, clientHeight, isAtBottom });
      setIsQuickOptionsAtBottom(isAtBottom);
    };

    // Check initial scroll position
    handleQuickOptionsScroll();

    modalContent.addEventListener('scroll', handleQuickOptionsScroll);
    return () => modalContent.removeEventListener('scroll', handleQuickOptionsScroll);
  }, [showQuickOptionsModal]);

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
      }, 2000);
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
      }, 2100);
    }, 2110);
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [randomBusinessOptions]);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll functions for modals
  const scrollBusinessModal = (direction) => {
    const modalContent = document.querySelector('.business-modal-content');
    if (!modalContent) return;
    
    const scrollAmount = 300; // Scroll by 300px
    const currentScroll = modalContent.scrollTop;
    const newScroll = direction === 'down' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;
    
    modalContent.scrollTo({
      top: newScroll,
      behavior: 'smooth'
    });
  };

  const scrollQuickOptionsModal = (direction) => {
    const modalContent = document.querySelector('.quick-options-modal-content');
    if (!modalContent) return;
    
    const scrollAmount = 300; // Scroll by 300px
    const currentScroll = modalContent.scrollTop;
    const newScroll = direction === 'down' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;
    
    modalContent.scrollTo({
      top: newScroll,
      behavior: 'smooth'
    });
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.response) {
        throw new Error('Invalid response format from server');
      }
      
      const botMessage = { type: 'answer', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        type: 'answer', 
        content: 'Sorry, I\'m having trouble connecting. Please try again.', 
        timestamp: new Date() 
      };
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

  // Helper to get kebab-case filename for business type
  function getBusinessPhoto(type) {
    return `/src/assets/businessPhoto/${type.replace(/\s+/g, '-').toLowerCase()}.jpg`;
  }

  return (
    <div className="full-chat-container" style={{ background: theme.primaryBg }}>
      {/* Header */}
      <div className="chat-header" style={{ 
        background: theme.secondaryBg,
        borderBottom: `1px solid ${theme.primaryBorder}`
      }}>
        <div className="header-left">
          <div className="logo-text" style={{
            fontSize: '24px',
            fontWeight: '700',
            backgroundImage: theme.logoGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>Oakland AI</div>
        </div>
        <div className="header-right">
          <div className="user-info" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = theme.tertiaryBg;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div className="user-avatar" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: theme.primaryButton,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.primaryText,
                fontWeight: '600',
                fontSize: '16px'
              }}>{user?.name?.charAt(0) || 'U'}</div>
              <div>
                <div className="user-name" style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.primaryText
                }}>{user?.name || 'User'}</div>
                <div className="user-role" style={{
                  fontSize: '14px',
                  color: theme.tertiaryText
                }}>Business Owner</div>
              </div>
            </button>
            
            {/* Profile Menu */}
            {showProfileMenu && (
              <div 
                data-profile-menu
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  marginTop: '8px',
                  background: theme.modalBg,
                  borderRadius: '12px',
                  border: `1px solid ${theme.primaryBorder}`,
                  boxShadow: `0 10px 25px ${theme.primaryShadow}`,
                  minWidth: '200px',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isToggling) return;
                    console.log('Theme toggle button clicked!');
                    console.log('Current theme state:', currentThemeName);
                    console.log('Current theme object:', theme);
                    toggleTheme();
                  }}
                  disabled={isToggling}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: isToggling ? '#9ca3af' : theme.primaryButton,
                    border: 'none',
                    color: 'white',
                    cursor: isToggling ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: isToggling ? 0.6 : 1,
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!isToggling) {
                      e.currentTarget.style.background = theme.primaryButton;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isToggling) {
                      e.currentTarget.style.background = theme.primaryButton;
                    }
                  }}
                >
                  {isToggling ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Switching...
                    </>
                  ) : (
                    <>
                      {currentThemeName === 'dark' ? <Sun size={16} /> : currentThemeName === 'beige' ? <Moon size={16} /> : <Sun size={16} />}
                      {currentThemeName === 'dark' ? 'Switch to Beige' : currentThemeName === 'beige' ? 'Switch to White' : 'Switch to Dark'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Clear user data and redirect to login
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#ef4444',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'left',
                    justifyContent: 'flex-start'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#dc2626';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#ef4444';
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
                


              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {/* New Chat Button and Quick Options Row - When conversation started */}
        {(messages.length > 0 || businessType) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px 32px 0 32px',
            paddingBottom: '12px'
          }}>
            {/* Quick Options */}
            <div className="quick-options" style={{ 
              display: 'flex', 
              gap: '16px',
              alignItems: 'center'
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
                    background: changingOptions.has(idx) ? 'rgba(34,197,94,0.15)' : theme.quickOptionBg, 
                    border: changingOptions.has(idx) ? '1px solid #22c55e' : `1px solid ${theme.quickOptionBorder}`, 
                    color: changingOptions.has(idx) ? '#22c55e' : theme.quickOptionText, 
                    fontWeight: 600, 
                    fontSize: '12px',
                    boxShadow: changingOptions.has(idx) ? '0 0 20px rgba(34,197,94,0.2)' : `0 2px 8px ${theme.accentShadow}`, 
                    transition: changingOptions.has(idx) ? 'all 0.3s ease' : 'background 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!changingOptions.has(idx)) {
                      e.currentTarget.style.background = theme.quickOptionHover;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!changingOptions.has(idx)) {
                      e.currentTarget.style.background = theme.quickOptionBg;
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
                      background: `linear-gradient(45deg, transparent 30%, rgba(34,197,94,0.08) 50%, transparent 70%)`,
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
              
              {/* View All Quick Options Button */}
              <button
                onClick={() => setShowQuickOptionsModal(true)}
                style={{
                  background: theme.accentButton,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: `0 2px 8px ${theme.accentShadow}`,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.accentShadow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accentShadow}`;
                }}
              >
                <Plus size={14} />
                View All
              </button>
              
              {/* Change Business Type Button */}
              <button
                onClick={() => setShowBusinessOptionsModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                }}
              >
                <Settings size={14} />
                Change Business
              </button>
            </div>
            
            {/* New Chat Button - Right Side */}
            <button
              onClick={() => {
                setMessages([]);
                setInputMessage('');
                setBusinessType('');
                setShowProfileMenu(false);
                setRandomBusinessOptions(getRandomBusinessOptions());
                setQuickOptions(getRandomQuickOptions(false));
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                marginTop: '-40px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(34, 197, 94, 0.3)';
              }}
            >
              <Plus size={14} />
              New Chat
            </button>
          </div>
        )}

        {/* Quick Options - When conversation hasn't started */}
        {messages.length === 0 && !businessType && (
          <>
            <div className="quick-options-row" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              margin: '32px 0',
              position: 'relative',
            }}>
              <div className="quick-options" style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
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
                      minWidth: '120px',
                      padding: '18px 12px',
                      borderRadius: '18px',
                      background: changingOptions.has(idx) ? 'rgba(34,197,94,0.15)' : theme.quickOptionBg,
                      border: changingOptions.has(idx) ? '1px solid #22c55e' : `1px solid ${theme.quickOptionBorder}`,
                      color: changingOptions.has(idx) ? '#22c55e' : theme.quickOptionText,
                      fontWeight: 600,
                      fontSize: '15px',
                      boxShadow: changingOptions.has(idx) ? '0 0 12px rgba(34,197,94,0.2)' : `0 2px 8px ${theme.accentShadow}`,
                      transition: changingOptions.has(idx) ? 'all 0.3s ease' : 'background 0.2s',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={e => {
                      if (!changingOptions.has(idx)) {
                        e.currentTarget.style.background = theme.quickOptionHover;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!changingOptions.has(idx)) {
                        e.currentTarget.style.background = theme.quickOptionBg;
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
                        background: `linear-gradient(45deg, transparent 30%, rgba(34,197,94,0.08) 50%, transparent 70%)`,
                        animation: 'matrix-sweep 1s linear infinite',
                        zIndex: 1
                      }} />
                    )}
                    <div style={{
                      fontSize: '22px',
                      marginBottom: '6px',
                      zIndex: 2,
                      position: 'relative',
                    }}>{option.icon}</div>
                    <span style={{
                      fontSize: '15px',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      zIndex: 2,
                      position: 'relative',
                    }}>{option.label}</span>
                  </button>
                ))}
              </div>
              {/* Mor View More butonu quick options'ın sağında */}
              <button
                onClick={() => setShowQuickOptionsModal(true)}
                style={{
                  background: 'linear-gradient(90deg, #a78bfa 0%, #6366f1 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(99,102,241,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  borderBottom: '2px solid #7c3aed',
                  marginLeft: '10px',
                  height: '34px',
                  marginTop: '-35px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(99,102,241,0.28)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(99,102,241,0.18)';
                }}
              >
                <Plus size={14} />
                View More
              </button>
            </div>

            {/* Business Type Section + Turuncu View More butonu sağda */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '20px',
              marginBottom: '24px',
              marginTop: '-76px',
              zIndex: 2,
              position: 'relative',
            }}>
              <div className="business-type-section" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '340px',
                margin: '0',
                scale: '0.8',
              }}>
                <div style={{
                  background: theme.modalBg,
                  borderRadius: '32px',
                  boxShadow: `0 4px 32px ${theme.primaryShadow}`,
                  padding: '40px 32px 32px 32px',
                  minWidth: '340px',
                  maxWidth: '90vw',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: `1.5px solid ${theme.secondaryBorder}`,
                }}>
                  <div className="business-type-question" style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: theme.secondaryText,
                    marginBottom: '32px',
                    textAlign: 'center',
                    letterSpacing: '0.01em',
                    textShadow: `0 2px 12px ${theme.accentShadow}`
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
                          minWidth: '160px',
                          minHeight: '80px',
                          fontSize: '15px',
                          padding: '18px',
                          background: changingBusinessOptions.has(index) ? 'rgba(34,197,94,0.2)' : theme.businessTypeBg,
                          border: changingBusinessOptions.has(index) ? '1.5px solid #22c55e' : `1.5px solid ${theme.secondaryBorder}`,
                          borderRadius: '18px',
                          color: changingBusinessOptions.has(index) ? '#22c55e' : theme.businessTypeText,
                          fontWeight: 600,
                          boxShadow: changingBusinessOptions.has(index) ? '0 0 12px rgba(34,197,94,0.3)' : `0 2px 8px ${theme.accentShadow}`,
                          transition: changingBusinessOptions.has(index) ? 'all 0.3s ease' : 'background 0.2s, color 0.2s, box-shadow 0.2s',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        onClick={() => handleBusinessTypeSelect(option.type)}
                        onMouseEnter={e => {
                          if (!changingBusinessOptions.has(index)) {
                            e.currentTarget.style.background = theme.businessTypeHover;
                            e.currentTarget.style.color = theme.primaryText;
                            e.currentTarget.style.boxShadow = `0 4px 18px ${theme.accentShadow}`;
                          }
                        }}
                        onMouseLeave={e => {
                          if (!changingBusinessOptions.has(index)) {
                            e.currentTarget.style.background = theme.businessTypeBg;
                            e.currentTarget.style.color = theme.businessTypeText;
                            e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accentShadow}`;
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
                          fontSize: '22px',
                          marginBottom: '8px',
                          zIndex: 2,
                          position: 'relative',
                        }}>{option.icon}</span>
                        <span style={{
                          zIndex: 2,
                          position: 'relative',
                        }}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                  {/* Turuncu View More butonu business type'ın ALTINDA ortalanmış */}
                  <button
                    onClick={() => setShowBusinessOptionsModal(true)}
                    style={{
                      background: 'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '10px 18px',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px 0 rgba(251,191,36,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      outline: 'none',
                      borderBottom: '2px solid #f59e42',
                      margin: '28px auto 0 auto',
                      height: '44px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 4px 18px 0 rgba(251,191,36,0.28)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(251,191,36,0.18)';
                    }}
                  >
                    <Settings size={16} />
                    View More
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Messages */}
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.length === 0 && !businessType && (
            <div className="welcome-message" style={{
              textAlign: 'center',
              padding: '8px 20px',
              color: theme.welcomeText
            }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: theme.welcomeText
              }}>Welcome to Oakland AI! 👋</h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: theme.welcomeSubtext,
                maxWidth: '600px',
                margin: '0 auto'
              }}>I'm here to help you navigate running your business in Oakland. Ask me anything about licenses, permits, regulations, or local business resources.</p>
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

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="scroll-to-bottom-btn"
            style={{
              background: theme.primaryButton,
              color: 'white',
              boxShadow: `0 4px 16px ${theme.primaryShadow}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 6px 20px ${theme.primaryShadow}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = `0 4px 16px ${theme.primaryShadow}`;
            }}
          >
            <ChevronDown size={20} />
          </button>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="message-input-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: theme.modalBg,
            border: `2px solid ${theme.primaryBorder}`,
            borderRadius: '50px',
            padding: '8px 8px 8px 20px',
            boxShadow: `0 8px 32px ${theme.primaryShadow}`,
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = `0 12px 40px ${theme.primaryShadow}`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = `0 8px 32px ${theme.primaryShadow}`;
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <button 
              type="button" 
              className="voice-btn"
              onClick={handleVoiceToggle}
              style={{
                background: isRecording 
                  ? theme.voiceButtonRecording
                  : theme.voiceButtonIdle,
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
                  : `0 2px 8px ${theme.accentShadow}`,
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.accentShadow}`;
                }
              }}
              onMouseLeave={e => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accentShadow}`;
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
              style={{
                background: 'transparent',
                border: 'none',
                color: theme.primaryText,
                outline: 'none',
                flex: 1,
                fontSize: '16px',
                padding: '12px 0',
                minWidth: 0
              }}
              onFocus={(e) => {
                e.target.parentElement.style.borderColor = theme.inputFocusBorder;
              }}
              onBlur={(e) => {
                e.target.parentElement.style.borderColor = theme.primaryBorder;
              }}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={isLoading || !inputMessage.trim()}
              style={{
                background: theme.primaryButton,
                border: 'none',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                cursor: isLoading || !inputMessage.trim() ? 'not-allowed' : 'pointer',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                opacity: isLoading || !inputMessage.trim() ? 0.5 : 1,
                boxShadow: `0 2px 8px ${theme.accentShadow}`,
                flexShrink: 0
              }}
              onMouseEnter={e => {
                if (!isLoading && inputMessage.trim()) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 16px ${theme.accentShadow}`;
                }
              }}
              onMouseLeave={e => {
                if (!isLoading && inputMessage.trim()) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accentShadow}`;
                }
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="chat-footer" style={{
        background: theme.secondaryBg,
        borderTop: `1px solid ${theme.primaryBorder}`,
        padding: '16px 32px',
        textAlign: 'center'
      }}>
        <div className="footer-links" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <a href="#privacy" style={{
            color: theme.tertiaryText,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s ease'
          }} onMouseEnter={e => e.target.style.color = theme.secondaryText}
             onMouseLeave={e => e.target.style.color = theme.tertiaryText}>Privacy</a>
          <a href="#language" style={{
            color: theme.tertiaryText,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s ease'
          }} onMouseEnter={e => e.target.style.color = theme.secondaryText}
             onMouseLeave={e => e.target.style.color = theme.tertiaryText}>Language</a>
          <a href="#help" style={{
            color: theme.tertiaryText,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'color 0.2s ease'
          }} onMouseEnter={e => e.target.style.color = theme.secondaryText}
             onMouseLeave={e => e.target.style.color = theme.tertiaryText}>Help</a>
        </div>
      </div>

      {/* Quick Options Modal */}
      {showQuickOptionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.modalOverlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: theme.modalBg,
            borderRadius: '24px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            border: `1px solid ${theme.modalBorder}`,
            boxShadow: `0 20px 40px ${theme.primaryShadow}`,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '32px 32px 24px 32px',
              borderBottom: `1px solid ${theme.primaryBorder}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: theme.primaryText,
                  margin: 0
                }}>Quick Options</h2>
                <button
                  onClick={() => setShowQuickOptionsModal(false)}
                  style={{
                    background: theme.closeButtonBg,
                    border: `1px solid ${theme.closeButtonBorder}`,
                    color: theme.closeButtonText,
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = theme.closeButtonHover;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = theme.closeButtonBg;
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="quick-options-modal-content" style={{
              flex: 1,
              overflow: 'auto',
              padding: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '60px'
              }}>
                {allQuickOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleQuickOption(option.value);
                      setShowQuickOptionsModal(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '20px',
                      background: theme.cardBg,
                      border: `1px solid ${theme.primaryBorder}`,
                      borderRadius: '16px',
                      color: theme.primaryText,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = theme.cardHoverBg;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = theme.cardBg;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>{option.icon}</div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Scroll indicator footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 0',
              position: 'sticky',
              bottom: 0,
              background: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              marginTop: '20px',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              minHeight: '60px'
            }}>
              <div 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  animation: 'bounce 2s infinite',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                onClick={() => scrollQuickOptionsModal(isQuickOptionsAtBottom ? 'up' : 'down')}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                {isQuickOptionsAtBottom ? '↑ Scroll up to see more quick options ↑' : '↓ Scroll to see more quick options ↓'}
                {/* Debug: {isQuickOptionsAtBottom ? 'AT BOTTOM' : 'NOT AT BOTTOM'} */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Options Modal */}
      {showBusinessOptionsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.modalOverlay,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: theme.modalBg,
            borderRadius: '24px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '80vh',
            border: `1px solid ${theme.modalBorder}`,
            boxShadow: `0 20px 40px ${theme.primaryShadow}`,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '32px 32px 24px 32px',
              borderBottom: `1px solid ${theme.primaryBorder}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: theme.primaryText,
                  margin: 0
                }}>Select Business Type</h2>
                <button
                  onClick={() => setShowBusinessOptionsModal(false)}
                  style={{
                    background: theme.closeButtonBg,
                    border: `1px solid ${theme.closeButtonBorder}`,
                    color: theme.closeButtonText,
                    padding: '8px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = theme.closeButtonHover;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = theme.closeButtonBg;
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="business-modal-content" style={{
              flex: 1,
              overflow: 'auto',
              padding: '32px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {allBusinessOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleBusinessTypeSelect(option.type);
                      setShowBusinessOptionsModal(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '24px',
                      background: theme.cardBg,
                      border: `1px solid ${theme.primaryBorder}`,
                      borderRadius: '20px',
                      color: theme.primaryText,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center',
                      minHeight: '140px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = theme.cardHoverBg;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = theme.cardBg;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '120px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f3f4f6',
                      marginBottom: 12,
                      position: 'relative',
                    }}>
                      <img
                        src={getBusinessPhoto(option.type)}
                        alt={option.label}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { 
                          e.target.style.display = 'none'; 
                          // Create a fallback div with the icon
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.style.display = 'flex';
                          fallbackDiv.style.alignItems = 'center';
                          fallbackDiv.style.justifyContent = 'center';
                          fallbackDiv.style.width = '100%';
                          fallbackDiv.style.height = '100%';
                          fallbackDiv.style.background = '#f3f4f6';
                          fallbackDiv.innerHTML = '🏢'; // Fallback emoji
                          e.target.parentNode.appendChild(fallbackDiv);
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.3' }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Scroll indicator footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px 0',
              background: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
              minHeight: '60px'
            }}>
              <div 
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  animation: 'bounce 2s infinite',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                onClick={() => scrollBusinessModal(isAtBottom ? 'up' : 'down')}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                }}
              >
                {isAtBottom ? '↑ Scroll up to see more business types ↑' : '↓ Scroll to see more business types ↓'}
                {/* Debug: {isAtBottom ? 'AT BOTTOM' : 'NOT AT BOTTOM'} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FullChatPage; 