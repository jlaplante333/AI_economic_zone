import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { Send, Plus, RefreshCw, User, MessageCircle, Home, UtensilsCrossed, ShoppingBag, Coffee, Scissors, Camera, Briefcase, BookOpen, Book, Building2, Heart, Star, Shield, Edit, Trash2, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Gem, Bell, Mail, Settings, MapPin, Calendar, Lock, Unlock, Eye, EyeOff, Check, X, Minus, ArrowRight, ArrowLeft, Bookmark, Share, Upload, Download, Play, MonitorSmartphone, FileText, Car, File, DollarSign, Map, ShieldCheck, Users, Lightbulb, Gift, Droplet, Flame, KeyRound, Megaphone, ClipboardCheck, Trash, AlertTriangle, Building, BadgeCheck, Mic, MicOff, Leaf, Globe, Package, Truck, Monitor, BarChart3, Handshake, ArrowUpRight, AlertCircle, UserCheck, Sun, Moon, LogOut, Loader, Square } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { config } from '../env';
import path from 'path';
import { useNavigate, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import ProfileMenu from '../components/ProfileMenu';
import { stopAllSpeech, setCurrentAudio, initializeSpeechCleanup, getCurrentAudio } from '../utils/speechUtils';
import { useLanguage } from '../context/LanguageContext';

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
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
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
  // Theme context
  const { theme, toggleTheme, isToggling, currentThemeName } = useTheme();
  const { t, currentLanguage } = useLanguage();
  
  const [user, setUser] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [wasVoiceMessage, setWasVoiceMessage] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Map language codes from LanguageContext to speech recognition language codes
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'vi': 'vi-VN',
      'ar': 'ar-SA',
      'zh-cn': 'zh-cn',
      'zh-hk': 'zh-hk',
      'prs': 'prs-AF',
      'mam': 'mam-GT'
    };
    return languageMap[currentLanguage] || 'en-US';
  });
  const [hasManuallyChangedLanguage, setHasManuallyChangedLanguage] = useState(false);
  const [showQuickOptionsModal, setShowQuickOptionsModal] = useState(false);
  const [showBusinessOptionsModal, setShowBusinessOptionsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechRef = useRef(null);
  const currentAudioRef = useRef(null);
  
  // Debug theme context
  useEffect(() => {
    console.log('Theme context loaded:', { currentThemeName, theme: theme.primaryBg });
  }, [currentThemeName, theme]);
  
  // Monitor theme changes
  useEffect(() => {
    console.log('Theme changed! currentThemeName:', currentThemeName);
    console.log('New theme primaryBg:', theme.primaryBg);
  }, [currentThemeName]);

  // Update selectedLanguage when currentLanguage changes
  useEffect(() => {
    const languageMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'vi': 'vi-VN',
      'ar': 'ar-SA',
      'zh-cn': 'zh-cn',
      'zh-hk': 'zh-hk',
      'prs': 'prs-AF',
      'mam': 'mam-GT'
    };
    const newSelectedLanguage = languageMap[currentLanguage] || 'en-US';
    
    // Only auto-update if the user hasn't manually changed the language
    if (!hasManuallyChangedLanguage && newSelectedLanguage !== selectedLanguage) {
      setSelectedLanguage(newSelectedLanguage);
      console.log('🎤 Auto-updated speech language to match interface language:', newSelectedLanguage);
    }
  }, [currentLanguage, selectedLanguage, hasManuallyChangedLanguage]);

  // Update speech recognition language when selectedLanguage changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
      console.log('🎤 Speech recognition language updated to:', selectedLanguage);
    }
  }, [selectedLanguage]);

  // Load chat history from database on component mount
  useEffect(() => {
    if (user && user.id) {
      loadChatHistory();
    }
  }, [user]);

  // Save chat history to localStorage when messages change (for persistence during navigation)
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history from localStorage on component mount (for persistence during navigation)
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory && messages.length === 0) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setMessages(parsedHistory);
        console.log('📚 Loaded chat history from localStorage:', parsedHistory.length, 'messages');
      } catch (error) {
        console.error('Failed to parse saved chat history:', error);
      }
    }
  }, []);

  const [randomBusinessOptions, setRandomBusinessOptions] = useState([]);
  const [quickOptions, setQuickOptions] = useState([]);
  const [changingOptions, setChangingOptions] = useState(new Set());
  const [changingBusinessOptions, setChangingBusinessOptions] = useState(new Set());
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isQuickOptionsAtBottom, setIsQuickOptionsAtBottom] = useState(false);
  
  // New state for temporary business type override
  const [temporaryBusinessType, setTemporaryBusinessType] = useState(null);
  const [originalBusinessType, setOriginalBusinessType] = useState(null);
  
  // New state for STOP button
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started with language:', selectedLanguage);
        setIsRecording(true);
        setIsListening(true);
        // Clear any stored final transcript
        recognitionRef.current.finalTranscript = '';
        // Stop any currently playing speech
        stopCurrentSpeech();
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

        console.log('Speech recognition result:', { finalTranscript, interimTranscript });
        
        // Update input message with transcript
        setInputMessage(finalTranscript || interimTranscript);
        
        // Store the final transcript for later use
        if (finalTranscript) {
          recognitionRef.current.finalTranscript = finalTranscript;
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsRecording(false);
        setIsListening(false);
        
        // Add a delay to ensure final transcript is captured
        setTimeout(() => {
          // Get the final transcript directly from the recognition results
          let finalTranscript = '';
          if (recognitionRef.current && recognitionRef.current.results) {
            console.log('Recognition results:', recognitionRef.current.results);
            console.log('Number of results:', recognitionRef.current.results.length);
            
            for (let i = 0; i < recognitionRef.current.results.length; i++) {
              const result = recognitionRef.current.results[i];
              console.log(`Result ${i}:`, result);
              console.log(`Is final:`, result.isFinal);
              console.log(`Transcript:`, result[0]?.transcript);
              
              if (result.isFinal) {
                finalTranscript += result[0].transcript;
              }
            }
          }
          
          // Also try to get from the current input message as fallback
          const inputMessageText = inputMessage.trim();
          const storedFinalTranscript = recognitionRef.current.finalTranscript || '';
          const finalMessage = finalTranscript.trim() || storedFinalTranscript.trim() || inputMessageText;
          
          console.log('Final transcript from results:', finalTranscript);
          console.log('Stored final transcript:', storedFinalTranscript);
          console.log('Input message text:', inputMessageText);
          console.log('Final message to send:', finalMessage);
          
          if (finalMessage) {
            console.log('🎤 VOICE MESSAGE DETECTED!');
            console.log('📝 Final message to send:', finalMessage);
            console.log('🚀 Sending voice message to OpenAI...');
            
            // Clear the input immediately
            setInputMessage('');
            // Set processing state
            setIsProcessingVoice(true);
            // Set voice message flag
            setWasVoiceMessage(true);
            
            // Send the message immediately without delay
            handleSendMessage(finalMessage).finally(() => {
              console.log('✅ Voice message processing completed');
              setIsProcessingVoice(false);
            });
          } else {
            console.log('❌ No final transcript to send');
          }
        }, 500); // Wait 500ms for final transcript to be captured
      };
    } else {
      console.error('Speech recognition not supported in this browser');
    }

    // Initialize text-to-speech
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
      console.log('🔊 Speech synthesis initialized successfully');
      
      // Test speech synthesis
      const testUtterance = new SpeechSynthesisUtterance('Test');
      testUtterance.volume = 0; // Silent test
      speechRef.current.speak(testUtterance);
      console.log('🔊 Speech synthesis test completed');
    } else {
      console.error('❌ Text-to-speech not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (speechRef.current && speechRef.current.speaking) {
        speechRef.current.cancel();
      }
    };
  }, [selectedLanguage]); // Remove inputMessage dependency to prevent infinite re-renders

  // Close profile menu and modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if click is outside BOTH the user-info button and the dropdown
      if (
        showProfileMenu &&
        !event.target.closest('.user-info') &&
        !event.target.closest('[data-profile-menu]')
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

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

  // Debug state changes
  useEffect(() => {
    console.log('Quick Options at bottom changed:', isQuickOptionsAtBottom);
  }, [isQuickOptionsAtBottom]);

  useEffect(() => {
    console.log('Business Modal at bottom changed:', isAtBottom);
  }, [isAtBottom]);

  // All available business options - use useMemo to recalculate when translations change
  const allBusinessOptions = useMemo(() => {
    console.log('🔄 Recalculating business options with translations, t function:', typeof t);
    return [
    { type: 'beauty salon', icon: <Scissors size={48} color="#60a5fa" />, label: t('businessTypes.beautySalon') },
    { type: 'restaurant', icon: <UtensilsCrossed size={48} color="#f59e42" />, label: t('businessTypes.restaurant') },
    { type: 'retail store', icon: <ShoppingBag size={48} color="#f472b6" />, label: t('businessTypes.retailStore') },
    { type: 'coffee shop', icon: <Coffee size={48} color="#a3a3a3" />, label: t('businessTypes.coffeeShop') },
    { type: 'barbershop', icon: <Scissors size={48} color="#f87171" />, label: t('businessTypes.barbershop') },
    { type: 'bakery', icon: <Star size={48} color="#fbbf24" />, label: t('businessTypes.bakery') },
    { type: 'gym', icon: <Heart size={48} color="#34d399" />, label: t('businessTypes.gym') },
    { type: 'auto repair', icon: <Settings size={48} color="#f59e42" />, label: t('businessTypes.autoRepair') },
    { type: 'laundry', icon: <Droplet size={48} color="#60a5fa" />, label: t('businessTypes.laundry') },
    { type: 'pet grooming', icon: <Heart size={48} color="#fbbf24" />, label: t('businessTypes.petGrooming') },
    { type: 'tattoo parlor', icon: <Edit size={48} color="#a78bfa" />, label: t('businessTypes.tattooParlor') },
    { type: 'nail salon', icon: <Star size={48} color="#f472b6" />, label: t('businessTypes.nailSalon') },
    { type: 'photography studio', icon: <Camera size={48} color="#60a5fa" />, label: t('businessTypes.photographyStudio') },
    { type: 'consulting', icon: <Briefcase size={48} color="#a3a3a3" />, label: t('businessTypes.consulting') },
    { type: 'daycare', icon: <Users size={48} color="#fbbf24" />, label: t('businessTypes.daycare') },
    { type: 'cleaning service', icon: <Droplet size={48} color="#34d399" />, label: t('businessTypes.cleaningService') },
    { type: 'food truck', icon: <Truck size={48} color="#f59e42" />, label: t('businessTypes.foodTruck') },
    { type: 'yoga studio', icon: <Heart size={48} color="#a78bfa" />, label: t('businessTypes.yogaStudio') },
    { type: 'music school', icon: <Star size={48} color="#60a5fa" />, label: t('businessTypes.musicSchool') },
    { type: 'dance studio', icon: <Users size={48} color="#f472b6" />, label: t('businessTypes.danceStudio') },
    { type: 'art gallery', icon: <BookOpen size={48} color="#fbbf24" />, label: t('businessTypes.artGallery') },
    { type: 'bookstore', icon: <BookOpen size={48} color="#a3a3a3" />, label: t('businessTypes.bookstore') },
    { type: 'florist', icon: <Leaf size={48} color="#34d399" />, label: t('businessTypes.florist') },
    { type: 'jewelry store', icon: <Gem size={48} color="#60a5fa" />, label: t('businessTypes.jewelryStore') },
    { type: 'vintage shop', icon: <Package size={48} color="#f59e42" />, label: t('businessTypes.vintageShop') },
    { type: 'tech startup', icon: <MonitorSmartphone size={48} color="#a78bfa" />, label: t('businessTypes.techStartup') },
    { type: 'dental office', icon: <User size={48} color="#60a5fa" />, label: t('businessTypes.dentalOffice') },
    { type: 'law firm', icon: <Briefcase size={48} color="#f59e42" />, label: t('businessTypes.lawFirm') },
    { type: 'real estate', icon: <Building2 size={48} color="#34d399" />, label: t('businessTypes.realEstate') },
    { type: 'insurance agency', icon: <Shield size={48} color="#f472b6" />, label: t('businessTypes.insuranceAgency') },
    { type: 'accounting firm', icon: <DollarSign size={48} color="#fbbf24" />, label: t('businessTypes.accountingFirm') },
    { type: 'marketing agency', icon: <Megaphone size={48} color="#a78bfa" />, label: t('businessTypes.marketingAgency') },
    { type: 'web design', icon: <MonitorSmartphone size={48} color="#60a5fa" />, label: t('businessTypes.webDesign') },
    { type: 'construction', icon: <Building size={48} color="#f59e42" />, label: t('businessTypes.construction') },
    { type: 'landscaping', icon: <Leaf size={48} color="#34d399" />, label: t('businessTypes.landscaping') },
    { type: 'plumbing', icon: <Droplet size={48} color="#60a5fa" />, label: t('businessTypes.plumbing') },
    { type: 'electrical', icon: <Lightbulb size={48} color="#fbbf24" />, label: t('businessTypes.electrical') },
    { type: 'HVAC', icon: <Flame size={48} color="#f59e42" />, label: t('businessTypes.hvac') },
    { type: 'roofing', icon: <Building size={48} color="#a3a3a3" />, label: t('businessTypes.roofing') },
    { type: 'painting', icon: <Edit size={48} color="#f472b6" />, label: t('businessTypes.painting') },
    { type: 'carpentry', icon: <Settings size={48} color="#f59e42" />, label: t('businessTypes.carpentry') },
    { type: 'other', icon: <Building2 size={48} color="#a3a3a3" />, label: t('businessTypes.other') }
    ];
  }, [t]);

  // Quick options for common business questions - use useMemo to recalculate when translations change
  const quickOptionsData = useMemo(() => {
    console.log('🔄 Recalculating quick options with translations, t function:', typeof t);
    return [
    { label: t('quickOptions.businessLicense'), icon: <FileText size={32} color="#93c5fd" />, value: 'Business License' },
    { label: t('quickOptions.parkingRules'), icon: <Car size={32} color="#93c5fd" />, value: 'Parking Rules' },
    { label: t('quickOptions.permits'), icon: <File size={32} color="#93c5fd" />, value: 'Permits' },
    { label: t('quickOptions.taxes'), icon: <DollarSign size={32} color="#93c5fd" />, value: 'Taxes' },
    { label: t('quickOptions.zoning'), icon: <Map size={32} color="#93c5fd" />, value: 'Zoning' },
    { label: t('quickOptions.healthSafety'), icon: <ShieldCheck size={32} color="#93c5fd" />, value: 'Health & Safety' },
    { label: t('quickOptions.employmentLaw'), icon: <Users size={32} color="#93c5fd" />, value: 'Employment Law' },
    { label: t('quickOptions.insurance'), icon: <Shield size={32} color="#93c5fd" />, value: 'Insurance' },
    { label: t('quickOptions.accessibility'), icon: <KeyRound size={32} color="#93c5fd" />, value: 'Accessibility' },
    { label: t('quickOptions.marketing'), icon: <Megaphone size={32} color="#93c5fd" />, value: 'Marketing' },
    { label: t('quickOptions.grants'), icon: <Gift size={32} color="#93c5fd" />, value: 'Grants' },
    { label: t('quickOptions.utilities'), icon: <Droplet size={32} color="#93c5fd" />, value: 'Utilities' },
    { label: t('quickOptions.inspections'), icon: <ClipboardCheck size={32} color="#93c5fd" />, value: 'Inspections' },
    { label: t('quickOptions.wasteDisposal'), icon: <Trash size={32} color="#93c5fd" />, value: 'Waste Disposal' },
    { label: t('quickOptions.fireSafety'), icon: <Flame size={32} color="#93c5fd" />, value: 'Fire Safety' },
    { label: t('quickOptions.security'), icon: <ShieldCheck size={32} color="#93c5fd" />, value: 'Security' },
    { label: t('quickOptions.buildingCodes'), icon: <Building size={32} color="#93c5fd" />, value: 'Building Codes' },
    { label: t('quickOptions.certifications'), icon: <BadgeCheck size={32} color="#93c5fd" />, value: 'Certifications' },
    { label: t('quickOptions.emergencies'), icon: <AlertTriangle size={32} color="#93c5fd" />, value: 'Emergencies' },
    { label: t('quickOptions.innovation'), icon: <Lightbulb size={32} color="#93c5fd" />, value: 'Innovation' },
    { label: t('quickOptions.networking'), icon: <Users size={32} color="#93c5fd" />, value: 'Business Networking' },
    { label: t('quickOptions.financing'), icon: <DollarSign size={32} color="#93c5fd" />, value: 'Business Financing' },
    { label: t('quickOptions.legalHelp'), icon: <Briefcase size={32} color="#93c5fd" />, value: 'Legal Assistance' },
    { label: t('quickOptions.accounting'), icon: <FileText size={32} color="#93c5fd" />, value: 'Accounting Services' },
    { label: t('quickOptions.technology'), icon: <MonitorSmartphone size={32} color="#93c5fd" />, value: 'Technology Support' },
    { label: t('quickOptions.sustainability'), icon: <Leaf size={32} color="#93c5fd" />, value: 'Green Business' },
    { label: t('quickOptions.exportImport'), icon: <Globe size={32} color="#93c5fd" />, value: 'International Trade' }
    ];
  }, [t]);

  // Function to get random quick options (4 for pre-conversation, 8 for during conversation)
  const getRandomQuickOptions = (isConversationStarted = false) => {
    const shuffled = [...quickOptionsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, isConversationStarted ? 8 : 4);
  };

  // Function to get random business options
  const getRandomBusinessOptions = () => {
    const shuffled = [...allBusinessOptions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
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
      const randomIndex = Math.floor(Math.random() * quickOptionsData.length);
      setChangingOptions(prev => new Set([...prev, randomIndex]));
      // After matrix effect duration, update the option
      setTimeout(() => {
        const newOptions = [...quickOptionsData];
        const availableOptions = quickOptionsData.filter(option => 
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
  }, [quickOptionsData]);

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
    
    console.log('📨 handleSendMessage called with:', message);
    
    // Add user message to chat
    const userMessage = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Scroll down when user sends a message
    setTimeout(() => scrollToBottom(), 100);

    try {
      console.log('🌐 Sending request to OpenAI...');
      console.log('🗣️ Using language:', selectedLanguage.split('-')[0]);
      // Get user ID from user state or localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id || 1; // Fallback to 1 if no user ID
      const response = await fetch(`${config.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: selectedLanguage.split('-')[0], // Extract language code (e.g., 'en' from 'en-US')
          businessType, 
          userId: userId 
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data || !data.response) {
        throw new Error('Invalid response format from server');
      }
      console.log('🤖 Received AI response:', data.response);
      const botMessage = { type: 'answer', content: data.response, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
      
      // Save message to database
      await saveMessageToDatabase(message, data.response, businessType);
      
      // Speak ALL AI responses using OpenAI TTS
      if (speechRef.current && data.response) {
        console.log('🔊 Speaking AI response...');
        console.log('Speech synthesis available:', !!speechRef.current);
        console.log('Response to speak:', data.response);
        console.log('Was voice message:', wasVoiceMessage);
        
        // Use OpenAI TTS for natural voice
        speakTextWithOpenAI(data.response);
        
        // Reset the voice message flag after speaking
        setWasVoiceMessage(false);
      } else {
        console.log('🔇 Not speaking response. Reasons:');
        console.log('- Speech synthesis available:', !!speechRef.current);
        console.log('- Has response:', !!data.response);
        console.log('- Was voice message:', wasVoiceMessage);
        console.log('- Is recording:', isRecording);
        console.log('- Is listening:', isListening);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
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
    setWasVoiceMessage(false); // Reset voice message flag for text input
    // Only stop speech if we're about to send a new message
    if (getCurrentAudio()) {
      stopCurrentSpeech();
    }
    handleSendMessage(inputMessage);
  };

  const handleQuickOption = (option) => {
    setWasVoiceMessage(false); // Reset voice message flag for quick options
    // Only stop speech if we're about to send a new message
    if (getCurrentAudio()) {
      stopCurrentSpeech();
    }
    handleSendMessage(`Tell me about ${option.toLowerCase()}`);
  };

  const handleBusinessTypeSelect = (type) => {
    console.log('🏢 Business type selected:', type);
    
    // If this is a different business type than the user's profile, set temporary override
    if (type !== user?.business_type) {
      setTemporaryBusinessType(type);
      setOriginalBusinessType(user?.business_type || '');
      console.log('🔄 Setting temporary business type override:', type);
    } else {
      // If user selects their own business type, clear temporary override
      setTemporaryBusinessType(null);
      setOriginalBusinessType(null);
      console.log('🔄 Clearing temporary business type override, using profile type');
    }
    
    setBusinessType(type);
    setShowBusinessOptionsModal(false);
    
    // Only stop speech if we're about to send a new message
    if (getCurrentAudio()) {
      stopCurrentSpeech();
    }
    
    const userMessage = { type: 'user', content: `I own a ${type}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Add a system message about the business type change
    const systemMessage = type !== user?.business_type 
      ? `I'm now helping you with ${type} business questions. You can ask me anything about running a ${type} business in Oakland.`
      : `I'm now helping you with your ${type} business. You can ask me anything about your business in Oakland.`;
    
    const botMessage = { type: 'question', content: systemMessage, timestamp: new Date() };
    setMessages(prev => [...prev, botMessage]);
  };

  // Function to reset to user's profile business type
  const resetToProfileBusinessType = () => {
    if (temporaryBusinessType) {
      setTemporaryBusinessType(null);
      setOriginalBusinessType(null);
      setBusinessType(user?.business_type || '');
      
      const resetMessage = `I'm now helping you with your ${user?.business_type} business again.`;
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: resetMessage,
        isUser: false,
        timestamp: new Date()
      }]);
      
      console.log('🔄 Reset to profile business type:', user?.business_type);
    }
  };

  // STOP button functionality
  const handleStopSpeech = () => {
    console.log('🛑 STOP button clicked - stopping all speech');
    setIsSpeaking(false);
    
    // Stop current audio if playing
    const currentAudio = getCurrentAudio();
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    // Stop browser speech synthesis
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    console.log('🔇 All speech stopped');
  };

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked, isRecording:', isRecording);
    console.log('Current selected language:', selectedLanguage);
    
    if (recognitionRef.current) {
      if (isRecording) {
        // Stop recording
        console.log('Stopping speech recognition');
        recognitionRef.current.stop();
      } else {
        // Start recording
        console.log('Starting speech recognition with language:', selectedLanguage);
        
        // Reinitialize speech recognition with current language
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = selectedLanguage;
          
          // Reattach event handlers
          recognitionRef.current.onstart = () => {
            console.log('Speech recognition started with language:', selectedLanguage);
            setIsRecording(true);
            setIsListening(true);
            recognitionRef.current.finalTranscript = '';
            // Only stop speech if there's actually audio playing
            if (getCurrentAudio()) {
              stopCurrentSpeech();
            }
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

            console.log('Speech recognition result:', { finalTranscript, interimTranscript, language: selectedLanguage });
            
            setInputMessage(finalTranscript || interimTranscript);
            
            if (finalTranscript) {
              recognitionRef.current.finalTranscript = finalTranscript;
            }
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
            setIsListening(false);
          };

          recognitionRef.current.onend = () => {
            console.log('Speech recognition ended');
            setIsRecording(false);
            setIsListening(false);
            
            setTimeout(() => {
              let finalTranscript = '';
              if (recognitionRef.current && recognitionRef.current.results) {
                for (let i = 0; i < recognitionRef.current.results.length; i++) {
                  const result = recognitionRef.current.results[i];
                  if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                  }
                }
              }
              
              const inputMessageText = inputMessage.trim();
              const storedFinalTranscript = recognitionRef.current.finalTranscript || '';
              const finalMessage = finalTranscript.trim() || storedFinalTranscript.trim() || inputMessageText;
              
              console.log('Final message to send:', finalMessage, 'in language:', selectedLanguage);
              
              if (finalMessage) {
                console.log('🎤 VOICE MESSAGE DETECTED!');
                console.log('📝 Final message to send:', finalMessage);
                console.log('🚀 Sending voice message to OpenAI...');
                
                setInputMessage('');
                setIsProcessingVoice(true);
                setWasVoiceMessage(true);
                
                handleSendMessage(finalMessage).finally(() => {
                  console.log('✅ Voice message processing completed');
                  setIsProcessingVoice(false);
                });
              }
            }, 500);
          };
        }
        
        setInputMessage(''); // Clear input before starting
        recognitionRef.current.finalTranscript = '';
        // Only stop speech if there's actually audio playing
        if (getCurrentAudio()) {
          stopCurrentSpeech();
        }
        recognitionRef.current.start();
      }
    } else {
      console.error('Speech recognition not available');
    }
  };

  const handleVoiceMessage = async (message) => {
    if (!message.trim()) return '';
    
    setIsProcessingVoice(true);
    
    try {
      // Add user voice message to chat
      const userMessage = { type: 'user', content: message, timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      // Get user ID from user state or localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id || 1; // Fallback to 1 if no user ID
      // Send to backend
      const response = await fetch(`${config.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: message,
          language: selectedLanguage.split('-')[0], // Use selected language
          businessType: businessType,
          userId: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response to chat
        const aiMessage = { type: 'answer', content: data.response, timestamp: new Date() };
        setMessages(prev => [...prev, aiMessage]);
        
        // Speak the response if speech synthesis is available
        if (speechRef.current && data.response) {
          const utterance = new SpeechSynthesisUtterance(data.response);
          utterance.rate = 0.9; // Slightly slower for clarity
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
          speechRef.current.speak(utterance);
        }
        
        // Return the response for text-to-speech
        return data.response;
      } else {
        throw new Error('Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error processing voice message:', error);
      const errorMessage = { type: 'answer', content: 'Sorry, I encountered an error processing your voice message. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
      return 'Sorry, I encountered an error processing your voice message. Please try again.';
    } finally {
      setIsProcessingVoice(false);
    }
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
    // Use public folder path that works in both development and production
    return `/assets/businessPhoto/${type.replace(/\s+/g, '-').toLowerCase()}.jpg`;
  }

  const navigate = useNavigate();

  const avatarRef = useRef(null);

  // Test speech synthesis function
  const testSpeechSynthesis = () => {
    console.log('🔊 Testing OpenAI TTS...');
    speakTextWithOpenAI('Hello, this is a test of the OpenAI text-to-speech system with natural voice.');
  };

  // Function to speak text with better error handling
  const speakText = (text) => {
    if (!speechRef.current) {
      console.error('❌ Speech synthesis not available');
      return;
    }
    
    if (!text || text.trim() === '') {
      console.log('🔇 No text to speak');
      return;
    }
    
    setIsSpeaking(true);
    console.log('🔊 Speaking text:', text);
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        console.log('🔊 Speech started');
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('🔊 Speech ended');
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('🔊 Speech error:', event.error);
        console.error('🔊 Error details:', event);
        setIsSpeaking(false);
      };
      
      speechRef.current.speak(utterance);
      console.log('🔊 Speech synthesis initiated');
    } catch (error) {
      console.error('🔊 Error with speech synthesis:', error);
      setIsSpeaking(false);
    }
  };

  // Function to stop any currently playing speech
  const stopCurrentSpeech = () => {
    console.log('🔇 Stopping current speech only');
    
    // Use the speech utility to stop current audio
    if (getCurrentAudio()) {
      const currentAudio = getCurrentAudio();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
    }
    
    // Don't call stopAllSpeech() here as it's too aggressive
    // Only stop browser speech synthesis if it's actively speaking
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      console.log('🔇 Stopping browser speech synthesis');
      window.speechSynthesis.cancel();
    }
  };

  // Function to test TTS endpoint
  const testTTSEndpoint = async () => {
    try {
      console.log('🔍 Testing TTS endpoint...');
      const response = await fetch(`${config.VITE_API_URL}/api/tts/test`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ TTS endpoint test successful:', data);
        return true;
      } else {
        console.error('❌ TTS endpoint test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ TTS endpoint test error:', error);
      return false;
    }
  };

  // Get the effective business type (temporary override or user's profile type)
  const getEffectiveBusinessType = () => {
    return temporaryBusinessType || user?.business_type || '';
  };

  // Load chat history from database
  const loadChatHistory = async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          // Convert database format to frontend format
          const formattedMessages = data.messages.map(msg => ({
            id: msg.id,
            text: msg.message,
            isUser: true,
            timestamp: new Date(msg.created_at)
          })).concat(
            data.messages.map(msg => ({
              id: `response-${msg.id}`,
              text: msg.response,
              isUser: false,
              timestamp: new Date(msg.created_at)
            }))
          ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          setMessages(formattedMessages);
          console.log('📚 Loaded chat history from database:', formattedMessages.length, 'messages');
        }
      }
    } catch (error) {
      console.error('Failed to load chat history from database:', error);
      // Fallback to localStorage if database fails
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          setMessages(parsedHistory);
          console.log('📚 Loaded chat history from localStorage (fallback):', parsedHistory.length, 'messages');
        } catch (parseError) {
          console.error('Failed to parse saved chat history:', parseError);
        }
      }
    }
  };

  // Save message to database
  const saveMessageToDatabase = async (message, response, businessType) => {
    if (!user || !user.id) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chat/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          response,
          businessType: businessType || temporaryBusinessType || user.business_type,
          language: currentLanguage
        })
      });
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }
  };

  // Function to speak text using OpenAI TTS API
  const speakTextWithOpenAI = async (text) => {
    if (!text || text.trim() === '') {
      console.log('🔇 No text to speak');
      return;
    }
    
    // Check if voice is set to "none"
    if (selectedVoice === 'none') {
      console.log('🔇 Voice disabled - skipping speech');
      return;
    }
    
    setIsSpeaking(true);
    console.log('🎤 Speaking text with OpenAI TTS:', text.substring(0, 100) + '...');
    
    // First test if the TTS endpoint is accessible
    const ttsWorking = await testTTSEndpoint();
    if (!ttsWorking) {
      console.log('🔄 TTS endpoint not accessible, falling back to browser speech synthesis...');
      speakText(text);
      return;
    }
    
    try {
      console.log('🔍 Making TTS request to /api/tts/generate');
      const response = await fetch(`${config.VITE_API_URL}/api/tts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: selectedVoice // Use the selected voice
        })
      });
      
      console.log('🔍 TTS response status:', response.status);
      console.log('🔍 TTS response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API error response:', errorText);
        throw new Error(`TTS API error: ${response.status} - ${errorText}`);
      }
      
      // Get the audio blob with proper MIME type
      console.log('🔍 Creating audio blob from response...');
      const audioBlob = await response.blob();
      console.log('🔊 Audio blob created:', audioBlob.type, 'size:', audioBlob.size);
      
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Audio blob is empty or invalid');
      }
      
      // Create blob URL with proper MIME type
      const blobUrl = URL.createObjectURL(audioBlob);
      console.log('🔊 Blob URL created:', blobUrl);
      
      // Create an audio element and play it
      const audio = new Audio(blobUrl);
      
      // Track the current audio element using the utility
      setCurrentAudio(audio);
      
      audio.onloadstart = () => console.log('🔊 Audio loading started');
      audio.oncanplay = () => console.log('🔊 Audio can play');
      audio.onplay = () => console.log('🔊 Audio playing started');
      audio.onended = () => {
        console.log('🔊 Audio playing ended');
        setIsSpeaking(false);
        setCurrentAudio(null);
        // Clean up blob URL
        URL.revokeObjectURL(blobUrl);
      };
      audio.onerror = (error) => {
        console.error('🔊 Audio error:', error);
        console.error('🔊 Audio error details:', {
          error: error.target.error,
          networkState: error.target.networkState,
          readyState: error.target.readyState
        });
        setIsSpeaking(false);
        setCurrentAudio(null);
        // Clean up blob URL on error
        URL.revokeObjectURL(blobUrl);
      };
      
      // Play the audio
      console.log('🔊 Attempting to play audio...');
      await audio.play();
      console.log('🔊 OpenAI TTS audio initiated successfully');
      
    } catch (error) {
      console.error('❌ OpenAI TTS Error:', error);
      console.error('❌ Error stack:', error.stack);
      setIsSpeaking(false);
      // Fallback to browser speech synthesis
      console.log('🔄 Falling back to browser speech synthesis...');
      speakText(text);
    }
  };

  // Initialize global speech cleanup
  useEffect(() => {
    const cleanup = initializeSpeechCleanup();
    return cleanup;
  }, []);

  // Cleanup speech synthesis when component unmounts or navigates away
  useEffect(() => {
    return () => {
      console.log('🔇 Cleaning up speech synthesis on component unmount');
      stopAllSpeech();
    };
  }, []);

  // Stop speech when navigating away (beforeunload event)
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🔇 Stopping speech before page unload');
      stopAllSpeech();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔇 Stopping speech when page becomes hidden');
        stopAllSpeech();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <ProfileMenu 
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        hasManuallyChangedLanguage={hasManuallyChangedLanguage}
        setHasManuallyChangedLanguage={setHasManuallyChangedLanguage}
        testSpeechSynthesis={testSpeechSynthesis}
        toggleTheme={toggleTheme}
        isToggling={isToggling}
        currentThemeName={currentThemeName}
      />
      <div className="full-chat-container" style={{ 
        background: theme.primaryBg,
        marginRight: showProfileMenu ? '200px' : '40px',
        transition: 'margin-right 0.3s ease',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        {/* Header */}
        <header className="chat-header" style={{ background: theme.modalBg, borderBottom: `1px solid ${theme.primaryBorder}` }}>
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">🌳</div>
              <div className="logo-text" style={{
                fontSize: 24,
                fontWeight: 600,
                color: currentThemeName === 'dark' 
                  ? 'white' 
                  : currentThemeName === 'beige'
                  ? '#5d4037'
                  : '#1f2937',
                background: 'none',
                backgroundClip: 'unset',
                WebkitBackgroundClip: 'unset',
                WebkitTextFillColor: 'unset'
              }}>
                Oakland AI
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info" style={{ cursor: 'pointer' }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="user-avatar">
                {(user?.firstName || user?.first_name)?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="user-name" style={{ color: theme.primaryText }}>
                  {user?.firstName || user?.first_name || 'User'}
                </div>
                <div className="user-role" style={{ color: theme.secondaryText }}>
                  {user?.role || 'Business Owner'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <div className="chat-main" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          {/* New Chat Button and Quick Options Row - When conversation started */}
          {(messages.length > 0 || businessType) && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '16px 32px 0 32px',
              paddingBottom: '12px',
              marginTop: '40px' // Increased from 20px to 40px for more space
            }}>
              {/* Quick Options */}
              <div className="quick-options" style={{ 
                display: 'flex', 
                gap: '16px',
                alignItems: 'center'
              }}>
                {quickOptionsData.map((option, idx) => (
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
                
                {/* New Chat Button - Next to Change Business */}
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
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
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
                
                {/* Reset to Profile Business Type Button - Only show when temporary override is active */}
                {temporaryBusinessType && (
                  <button
                    onClick={resetToProfileBusinessType}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
                    }}
                  >
                    <ArrowLeft size={14} />
                    Reset to Profile
                  </button>
                )}
              </div>
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
                  {quickOptionsData.map((option, idx) => (
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
                      {t('chat.businessTypeQuestion')}
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
                    
                    {/* Reset to Profile Business Type Button - Only show when temporary override is active */}
                    {temporaryBusinessType && (
                      <button
                        onClick={resetToProfileBusinessType}
                        style={{
                          background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '14px',
                          padding: '10px 18px',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 2px 12px 0 rgba(139, 92, 246, 0.18)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s',
                          outline: 'none',
                          borderBottom: '2px solid #7c3aed',
                          margin: '16px auto 0 auto',
                          justifyContent: 'center',
                          minWidth: '160px'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 20px 0 rgba(139, 92, 246, 0.25)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(139, 92, 246, 0.18)';
                        }}
                      >
                        <ArrowLeft size={16} />
                        Reset to Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Messages */}
          <div className="chat-messages" ref={chatMessagesRef} style={{
            paddingRight: '20px',
            paddingLeft: '20px',
            paddingTop: '80px', // Increased from 40px to 80px to move chat further from menu
            maxWidth: 'calc(100vw - 240px)',
            minWidth: '600px',
            marginRight: 'auto',
            marginLeft: 'auto'
          }}>
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
                                  }}>{t('chat.welcomeTitle')}</h2>
                <p style={{
                  fontSize: '16px',
                  color: theme.textSecondary,
                  textAlign: 'center',
                  maxWidth: '600px',
                  margin: '0 auto',
                  lineHeight: '1.6',
                  marginBottom: '60px'
                }}>{t('chat.welcomeMessage')}</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type === 'question' ? 'chat-question' : message.type === 'answer' ? 'chat-answer' : message.type === 'processing' ? 'processing-message' : 'user-message'}`} style={{
                display: 'flex',
                justifyContent: message.type === 'question' ? 'flex-start' : 'flex-end', // User questions on left, AI answers on right
                marginBottom: '16px',
                padding: '0 8px'
              }}>
                {message.type === 'answer' ? (
                  <div className="bubble" style={{
                    background: theme.primary,
                    color: 'white', // White text on blue background
                    maxWidth: '70%'
                  }}>{formatAnswer(message.content, index)}</div>
                ) : message.type === 'question' ? (
                  <div className="bubble" style={{
                    background: theme.cardBg,
                    color: currentThemeName === 'dark' ? 'white' : '#1f2937', // White text in dark theme, dark text in light themes
                    border: `1px solid ${theme.border}`,
                    maxWidth: '70%'
                  }}>{message.content}</div>
                ) : message.type === 'processing' ? (
                  <div className="bubble" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    maxWidth: '70%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontStyle: 'italic'
                  }}>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    {message.content}
                  </div>
                ) : (
                  <div className="bubble" style={{
                    background: theme.cardBg,
                    color: currentThemeName === 'dark' ? 'white' : '#1f2937', // White text in dark theme, dark text in light themes
                    border: `1px solid ${theme.border}`,
                    maxWidth: '70%'
                  }}>{message.content}</div>
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  className="voice-btn"
                  onClick={handleVoiceToggle}
                  disabled={isProcessingVoice}
                  style={{
                    background: isRecording 
                      ? theme.voiceButtonRecording
                      : isProcessingVoice
                      ? theme.primaryButton
                      : theme.voiceButtonIdle,
                    border: 'none',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '50%',
                    cursor: isProcessingVoice ? 'not-allowed' : 'pointer',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isRecording 
                      ? '0 4px 16px rgba(239, 68, 68, 0.4)' 
                      : isProcessingVoice
                      ? '0 4px 16px rgba(59, 130, 246, 0.4)'
                      : `0 2px 8px ${theme.accentShadow}`,
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    opacity: isProcessingVoice ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (!isRecording && !isProcessingVoice) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${theme.accentShadow}`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isRecording && !isProcessingVoice) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = `0 2px 8px ${theme.accentShadow}`;
                    }
                  }}
                >
                  {(isRecording || isProcessingVoice) && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isProcessingVoice 
                        ? 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                      animation: 'pulse 1.5s infinite',
                      borderRadius: '50%'
                    }} />
                  )}
                  {isProcessingVoice ? <Loader size={20} /> : isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                
                {/* STOP Button */}
                <button 
                  type="button" 
                  className="stop-btn"
                  onClick={handleStopSpeech}
                  disabled={!isSpeaking}
                  style={{
                    background: isSpeaking 
                      ? '#ef4444'
                      : '#6b7280',
                    border: 'none',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '50%',
                    cursor: isSpeaking ? 'pointer' : 'not-allowed',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isSpeaking 
                      ? '0 4px 16px rgba(239, 68, 68, 0.4)' 
                      : '0 2px 8px rgba(107, 114, 128, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    opacity: isSpeaking ? 1 : 0.5
                  }}
                  onMouseEnter={e => {
                    if (isSpeaking) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.6)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (isSpeaking) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                    }
                  }}
                >
                  <Square size={20} />
                </button>
              </div>
              <input
                type="text"
                                        placeholder={t('chat.inputPlaceholder')}
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
                  {quickOptionsData.map((option, index) => (
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
                position: 'sticky',
                bottom: 0,
                background: '#ffffff',
                borderTop: '1px solid #e5e7eb',
                marginTop: '20px',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px',
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
    </>
  );
}

export default FullChatPage; 