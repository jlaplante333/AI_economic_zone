import React, { createContext, useContext, useState } from 'react';

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

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  };

  // Simple translation function
  const t = (key) => {
    const translations = {
      en: {
        welcome: 'Welcome',
        selectLanguage: 'Select your language',
        continue: 'Continue',
        back: 'Back',
        language: 'Language'
      },
      es: {
        welcome: 'Bienvenido',
        selectLanguage: 'Selecciona tu idioma',
        continue: 'Continuar',
        back: 'Atrás',
        language: 'Idioma'
      },
      fr: {
        welcome: 'Bienvenue',
        selectLanguage: 'Sélectionnez votre langue',
        continue: 'Continuer',
        back: 'Retour',
        language: 'Langue'
      },
      de: {
        welcome: 'Willkommen',
        selectLanguage: 'Wählen Sie Ihre Sprache',
        continue: 'Weiter',
        back: 'Zurück',
        language: 'Sprache'
      },
      // Add more languages as needed
    };

    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  // Initialize language from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

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