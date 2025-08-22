import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Import the translation file for the current language
        const translationModule = await import(`../language/${currentLanguage}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.warn(`Failed to load translations for ${currentLanguage}, falling back to English`);
        try {
          const fallbackModule = await import('../language/en.json');
          setTranslations(fallbackModule.default || fallbackModule);
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError);
          setTranslations({});
        }
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
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