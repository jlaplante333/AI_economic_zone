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
      vi: {
        welcome: 'Chào mừng',
        selectLanguage: 'Chọn ngôn ngữ của bạn',
        continue: 'Tiếp tục',
        back: 'Quay lại',
        language: 'Ngôn ngữ'
      },
      ar: {
        welcome: 'مرحباً',
        selectLanguage: 'اختر لغتك',
        continue: 'متابعة',
        back: 'رجوع',
        language: 'لغة'
      },
      zh: {
        welcome: '欢迎',
        selectLanguage: '选择您的语言',
        continue: '继续',
        back: '返回',
        language: '语言'
      },
      tl: {
        welcome: 'Maligayang pagdating',
        selectLanguage: 'Piliin ang iyong wika',
        continue: 'Magpatuloy',
        back: 'Bumalik',
        language: 'Wika'
      },
      ko: {
        welcome: '환영합니다',
        selectLanguage: '언어를 선택하세요',
        continue: '계속',
        back: '뒤로',
        language: '언어'
      },
      hi: {
        welcome: 'स्वागत है',
        selectLanguage: 'अपनी भाषा चुनें',
        continue: 'जारी रखें',
        back: 'वापस',
        language: 'भाषा'
      },
      th: {
        welcome: 'ยินดีต้อนรับ',
        selectLanguage: 'เลือกภาษาของคุณ',
        continue: 'ดำเนินการต่อ',
        back: 'กลับ',
        language: 'ภาษา'
      },
      ja: {
        welcome: 'ようこそ',
        selectLanguage: '言語を選択してください',
        continue: '続行',
        back: '戻る',
        language: '言語'
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