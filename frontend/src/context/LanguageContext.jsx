import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../env';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  // Initialize language from localStorage on startup
  useEffect(() => {
    // PRIORITY: Use selected language, fallback to user profile language, then default to English
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    const userLanguage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).language : null;
    
    console.log('Language initialization - selectedLanguage:', selectedLanguage, 'userLanguage:', userLanguage);
    
    if (selectedLanguage) {
      console.log('Setting language from user selection:', selectedLanguage);
      setCurrentLanguage(selectedLanguage);
    } else if (userLanguage) {
      console.log('Setting language from user profile:', userLanguage);
      setCurrentLanguage(userLanguage);
    } else {
      console.log('Setting language to default (English)');
      setCurrentLanguage('en');
    }
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log('Loading translations for language:', currentLanguage);
        // Import the translation file for the current language
        const translationModule = await import(`../language/${currentLanguage}.json`);
        setTranslations(translationModule.default || translationModule);
        console.log('Successfully loaded translations for:', currentLanguage);
      } catch (error) {
        console.warn(`Failed to load translations for ${currentLanguage}, falling back to English:`, error);
        try {
          const fallbackModule = await import('../language/en.json');
          setTranslations(fallbackModule.default || fallbackModule);
          console.log('Successfully loaded fallback English translations');
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
          setTranslations({});
        }
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = async (languageCode) => {
    setCurrentLanguage(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Update user's profile language in database if user is logged in
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('authToken'); // Fixed: use correct token key
      
      if (user && token) {
        const userData = JSON.parse(user);
        const response = await fetch(`${config.VITE_API_URL}/api/auth/update-language`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ language: languageCode })
        });
        
        if (response.ok) {
          console.log('Updated user profile language to:', languageCode);
          // Update local user data
          const updatedUser = { ...userData, language: languageCode };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          console.error('Failed to update user profile language, status:', response.status);
        }
      }
    } catch (error) {
      console.error('Failed to update user profile language:', error);
    }
  };

  // Enhanced translation function that uses the loaded JSON translations
  const t = (key, params = {}) => {
    if (!translations || Object.keys(translations).length === 0) {
      // Fallback to basic translations if JSON not loaded yet
      const basicTranslations = {
        'languageSelection.title': 'Choose Your Language',
        'languageSelection.subtitle': 'Select your preferred language to begin your AI-powered journey',
        'languageSelection.preparingExperience': 'Preparing your personalized AI experience...',
        'languageSelection.configuringAI': 'Configuring AI for {{language}}...',
      };
      
      let translation = basicTranslations[key] || key;
      
      // Replace parameters
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
      
      return translation;
    }

    // Use the loaded JSON translations
    const keys = key.split('.');
    let translation = translations;
    
    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) break;
    }
    
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param]);
    });
    
    return translation;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 