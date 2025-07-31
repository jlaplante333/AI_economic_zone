// Centralized language definitions for Oakland AI
// Based on the main LanguageSelectionPage with Oakland-specific priorities

export const languages = [
  // Oakland-specific languages (high priority)
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', priority: 1 },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', priority: 2 },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', priority: 3 },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', priority: 4 },
  { code: 'zh-cn', name: 'Mandarin', native: '普通话', flag: '🇨🇳', priority: 5 },
  { code: 'zh-hk', name: 'Cantonese', native: '廣東話', flag: '🇭🇰', priority: 6 },
  { code: 'tl', name: 'Filipino', native: 'Filipino', flag: '🇵🇭', priority: 7 },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', priority: 8 },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', priority: 9 },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', priority: 10 },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯��', priority: 11 },
  
  // New languages with flags
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ', flag: '🇰🇭', priority: 12 },
  { code: 'lo', name: 'Laos', native: 'ພາສາລາວ', flag: '🇱🇦', priority: 13 },
  { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ', flag: '🇪🇷', priority: 14 },
  { code: 'prs', name: 'Dari', native: 'دری', flag: '🇦🇫', priority: 15 },
  { code: 'mam', name: 'Mam', native: 'Mam', flag: '🇬🇹', priority: 16 },
  
  // Additional common languages
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', priority: 17 },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', priority: 18 },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', priority: 19 },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', priority: 20 },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', priority: 21 },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', priority: 22 },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', priority: 23 },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', priority: 24 },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', priority: 25 },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', priority: 26 },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', priority: 27 },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', priority: 28 },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', priority: 29 },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰', priority: 30 },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺', priority: 31 },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', priority: 32 },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬', priority: 33 },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', priority: 34 },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸', priority: 35 },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮', priority: 36 },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪', priority: 37 },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻', priority: 38 },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹', priority: 39 },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', priority: 40 },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱', priority: 41 },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', priority: 42 },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', priority: 43 },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', priority: 44 },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', priority: 45 },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', priority: 46 },
  { code: 'ku', name: 'Kurdish', native: 'Kurdî', flag: '🇮🇶', priority: 47 },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹', priority: 48 },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇹🇿', priority: 49 },
  { code: 'zu', name: 'Zulu', native: 'isiZulu', flag: '🇿🇦', priority: 50 },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', priority: 51 },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸', priority: 52 },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹', priority: 53 },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪', priority: 54 },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🇬🇧', priority: 55 },
  { code: 'eu', name: 'Basque', native: 'Euskara', flag: '🇪🇸', priority: 56 },
  { code: 'ca', name: 'Catalan', native: 'Català', flag: '🇪🇸', priority: 57 },
  { code: 'gl', name: 'Galician', native: 'Galego', flag: '🇪🇸', priority: 58 },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱', priority: 59 },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰', priority: 60 },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦', priority: 61 },
  { code: 'me', name: 'Montenegrin', native: 'Crnogorski', flag: '🇲🇪', priority: 62 },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪', priority: 63 },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲', priority: 64 },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿', priority: 65 },
  { code: 'kk', name: 'Kazakh', native: 'Қазақ', flag: '🇰🇿', priority: 66 },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬', priority: 67 },
  { code: 'uz', name: 'Uzbek', native: 'O\'zbek', flag: '🇺🇿', priority: 68 },
];

// Oakland-specific languages (for ProfessionalLanguagePage)
export const oaklandLanguages = languages.filter(lang => 
  ['en', 'vi', 'ar', 'es', 'zh-cn', 'zh-hk', 'tl', 'ko', 'hi', 'th', 'ja', 'km', 'lo', 'ti', 'prs', 'mam'].includes(lang.code)
);

// Get language by code
export const getLanguageByCode = (code) => {
  return languages.find(lang => lang.code === code);
};

// Get all language codes
export const getLanguageCodes = () => {
  return languages.map(lang => lang.code);
};

// Get language names for cycling (used in LoginPage)
export const getLanguageNames = () => {
  return languages.map(lang => ({
    code: lang.code,
    name: lang.native, // Use native name for cycling display
    flag: lang.flag // Include flag for display
  }));
}; 