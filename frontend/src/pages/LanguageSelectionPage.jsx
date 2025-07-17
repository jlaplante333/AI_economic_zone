import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './LanguageSelectionPage.css';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Español', native: 'Español' },
  { code: 'fr', name: 'Français', native: 'Français' },
  { code: 'de', name: 'Deutsch', native: 'Deutsch' },
  { code: 'it', name: 'Italiano', native: 'Italiano' },
  { code: 'pt', name: 'Português', native: 'Português' },
  { code: 'ru', name: 'Русский', native: 'Русский' },
  { code: 'ja', name: '日本語', native: '日本語' },
  { code: 'ko', name: '한국어', native: '한국어' },
  { code: 'zh', name: '中文', native: '中文' },
  { code: 'ar', name: 'العربية', native: 'العربية' },
  { code: 'tr', name: 'Türkçe', native: 'Türkçe' },
  { code: 'hi', name: 'हिन्दी', native: 'हिन्दी' },
  { code: 'nl', name: 'Nederlands', native: 'Nederlands' },
  { code: 'sv', name: 'Svenska', native: 'Svenska' },
  { code: 'no', name: 'Norsk', native: 'Norsk' },
  { code: 'da', name: 'Dansk', native: 'Dansk' },
  { code: 'fi', name: 'Suomi', native: 'Suomi' },
  { code: 'pl', name: 'Polski', native: 'Polski' },
  { code: 'cs', name: 'Čeština', native: 'Čeština' },
  { code: 'sk', name: 'Slovenčina', native: 'Slovenčina' },
  { code: 'hu', name: 'Magyar', native: 'Magyar' },
  { code: 'ro', name: 'Română', native: 'Română' },
  { code: 'bg', name: 'Български', native: 'Български' },
  { code: 'hr', name: 'Hrvatski', native: 'Hrvatski' },
  { code: 'sr', name: 'Српски', native: 'Српски' },
  { code: 'sl', name: 'Slovenščina', native: 'Slovenščina' },
  { code: 'et', name: 'Eesti', native: 'Eesti' },
  { code: 'lv', name: 'Latviešu', native: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių', native: 'Lietuvių' },
  { code: 'el', name: 'Ελληνικά', native: 'Ελληνικά' },
  { code: 'he', name: 'עברית', native: 'עברית' },
  { code: 'th', name: 'ไทย', native: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt', native: 'Tiếng Việt' },
  { code: 'id', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Bahasa Melayu', native: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'bn', name: 'বাংলা', native: 'বাংলা' },
  { code: 'ur', name: 'اردو', native: 'اردو' },
  { code: 'fa', name: 'فارسی', native: 'فارسی' },
  { code: 'ku', name: 'Kurdî', native: 'Kurdî' },
  { code: 'am', name: 'አማርኛ', native: 'አማርኛ' },
  { code: 'sw', name: 'Kiswahili', native: 'Kiswahili' },
  { code: 'zu', name: 'isiZulu', native: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
  { code: 'is', name: 'Íslenska', native: 'Íslenska' },
  { code: 'mt', name: 'Malti', native: 'Malti' },
  { code: 'ga', name: 'Gaeilge', native: 'Gaeilge' },
  { code: 'cy', name: 'Cymraeg', native: 'Cymraeg' },
  { code: 'eu', name: 'Euskara', native: 'Euskara' },
  { code: 'ca', name: 'Català', native: 'Català' },
  { code: 'gl', name: 'Galego', native: 'Galego' },
  { code: 'sq', name: 'Shqip', native: 'Shqip' },
  { code: 'mk', name: 'Македонски', native: 'Македонски' },
  { code: 'bs', name: 'Bosanski', native: 'Bosanski' },
  { code: 'me', name: 'Crnogorski', native: 'Crnogorski' },
  { code: 'ka', name: 'ქართული', native: 'ქართული' },
  { code: 'hy', name: 'Հայերեն', native: 'Հայերեն' },
  { code: 'az', name: 'Azərbaycan', native: 'Azərbaycan' },
  { code: 'kk', name: 'Қазақ', native: 'Қазақ' },
  { code: 'ky', name: 'Кыргызча', native: 'Кыргызча' },
  { code: 'uz', name: 'O\'zbek', native: 'O\'zbek' },
  { code: 'mn', name: 'Монгол', native: 'Монгол' },
  { code: 'ne', name: 'नेपाली', native: 'नेपाली' },
  { code: 'si', name: 'සිංහල', native: 'සිංහල' },
  { code: 'my', name: 'မြန်မာ', native: 'မြန်မာ' },
  { code: 'km', name: 'ខ្មែរ', native: 'ខ្មែរ' },
  { code: 'lo', name: 'ລາວ', native: 'ລາວ' },
  { code: 'jw', name: 'Jawa', native: 'Jawa' },
  { code: 'su', name: 'Sunda', native: 'Sunda' },
  { code: 'ceb', name: 'Cebuano', native: 'Cebuano' },
  { code: 'haw', name: 'ʻŌlelo Hawaiʻi', native: 'ʻŌlelo Hawaiʻi' },
  { code: 'mi', name: 'Māori', native: 'Māori' },
  { code: 'sm', name: 'Gagana Samoa', native: 'Gagana Samoa' },
  { code: 'fj', name: 'Vosa Vakaviti', native: 'Vosa Vakaviti' },
  { code: 'to', name: 'Lea faka-Tonga', native: 'Lea faka-Tonga' },
  { code: 'ty', name: 'Reo Tahiti', native: 'Reo Tahiti' },
  { code: 'mg', name: 'Malagasy', native: 'Malagasy' },
  { code: 'yo', name: 'Yorùbá', native: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'so', name: 'Soomaali', native: 'Soomaali' },
  { code: 'om', name: 'Afaan Oromoo', native: 'Afaan Oromoo' },
  { code: 'ti', name: 'ትግርኛ', native: 'ትግርኛ' },
  { code: 'sn', name: 'chiShona', native: 'chiShona' },
  { code: 'xh', name: 'isiXhosa', native: 'isiXhosa' },
  { code: 'st', name: 'Sesotho', native: 'Sesotho' },
  { code: 'tn', name: 'Setswana', native: 'Setswana' },
  { code: 'ts', name: 'Xitsonga', native: 'Xitsonga' },
  { code: 've', name: 'Tshivenda', native: 'Tshivenda' },
  { code: 'nr', name: 'isiNdebele', native: 'isiNdebele' },
  { code: 'ss', name: 'siSwati', native: 'siSwati' },
  { code: 'rw', name: 'Kinyarwanda', native: 'Kinyarwanda' },
  { code: 'lg', name: 'Luganda', native: 'Luganda' },
  { code: 'ak', name: 'Akan', native: 'Akan' },
  { code: 'tw', name: 'Twi', native: 'Twi' },
  { code: 'ee', name: 'Eʋegbe', native: 'Eʋegbe' },
  { code: 'fon', name: 'Fɔngbè', native: 'Fɔngbè' },
  { code: 'dyo', name: 'Joola', native: 'Joola' },
  { code: 'wo', name: 'Wolof', native: 'Wolof' },
  { code: 'ff', name: 'Fulfulde', native: 'Fulfulde' },
  { code: 'bm', name: 'Bamanankan', native: 'Bamanankan' },
  { code: 'sg', name: 'Sängö', native: 'Sängö' },
  { code: 'dz', name: 'རྫོང་ཁ', native: 'རྫོང་ཁ' },
  { code: 'bo', name: 'བོད་ཡིག', native: 'བོད་ཡིག' },
  { code: 'ug', name: 'ئۇيغۇرچە', native: 'ئۇيغۇرچە' },
  { code: 'ii', name: 'ꆈꌠꉙ', native: 'ꆈꌠꉙ' },
  { code: 'za', name: 'Vahcuengh', native: 'Vahcuengh' },
  { code: 'br', name: 'Brezhoneg', native: 'Brezhoneg' },
  { code: 'co', name: 'Corsu', native: 'Corsu' },
  { code: 'fur', name: 'Furlan', native: 'Furlan' },
  { code: 'rm', name: 'Rumantsch', native: 'Rumantsch' },
  { code: 'lb', name: 'Lëtzebuergesch', native: 'Lëtzebuergesch' },
  { code: 'fy', name: 'Frysk', native: 'Frysk' },
  { code: 'gv', name: 'Gaelg', native: 'Gaelg' },
  { code: 'kw', name: 'Kernewek', native: 'Kernewek' },
  { code: 'fo', name: 'Føroyskt', native: 'Føroyskt' },
  { code: 'kl', name: 'Kalaallisut', native: 'Kalaallisut' },
  { code: 'se', name: 'Davvisámegiella', native: 'Davvisámegiella' },
  { code: 'smn', name: 'Anarâškielâ', native: 'Anarâškielâ' },
  { code: 'sms', name: 'Nuõrttsääʹmǩiõll', native: 'Nuõrttsääʹmǩiõll' },
  { code: 'sma', name: 'Åarjelsaemien gïele', native: 'Åarjelsaemien gïele' },
  { code: 'smj', name: 'Julevsámegiella', native: 'Julevsámegiella' },
  { code: 'sme', name: 'Davvisámegiella', native: 'Davvisámegiella' },
  { code: 'smn', name: 'Anarâškielâ', native: 'Anarâškielâ' },
  { code: 'sms', name: 'Nuõrttsääʹmǩiõll', native: 'Nuõrttsääʹmǩiõll' },
  { code: 'sma', name: 'Åarjelsaemien gïele', native: 'Åarjelsaemien gïele' },
  { code: 'smj', name: 'Julevsámegiella', native: 'Julevsámegiella' },
  { code: 'sme', name: 'Davvisámegiella', native: 'Davvisámegiella' }
];

function LanguageSelectionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);
  const navigate = useNavigate();
  const { changeLanguage, t } = useLanguage();
  const { theme } = useTheme();

  // Direct state update for immediate response
  const updateLanguageIndex = (newIndex) => {
    if (!selectedLanguage) {
      setCurrentIndex(newIndex);
    }
  };

  // Welcome text translations for each language
  const welcomeTexts = {
    en: 'Welcome',
    es: 'Bienvenido',
    fr: 'Bienvenue',
    de: 'Willkommen',
    it: 'Benvenuto',
    pt: 'Bem-vindo',
    ru: 'Добро пожаловать',
    ja: 'ようこそ',
    ko: '환영합니다',
    zh: '欢迎',
    ar: 'مرحباً',
    tr: 'Hoş geldiniz',
    hi: 'स्वागत है',
    nl: 'Welkom',
    sv: 'Välkommen',
    no: 'Velkommen',
    da: 'Velkommen',
    fi: 'Tervetuloa',
    pl: 'Witamy',
    cs: 'Vítejte',
    sk: 'Vitajte',
    hu: 'Üdvözöljük',
    ro: 'Bun venit',
    bg: 'Добре дошли',
    hr: 'Dobrodošli',
    sr: 'Добро пожаловали',
    sl: 'Dobrodošli',
    et: 'Tere tulemast',
    lv: 'Laipni lūdzam',
    lt: 'Sveiki atvykę',
    el: 'Καλώς ήρθατε',
    he: 'ברוכים הבאים',
    th: 'ยินดีต้อนรับ',
    vi: 'Chào mừng',
    id: 'Selamat datang',
    ms: 'Selamat datang',
    tl: 'Maligayang pagdating',
    bn: 'স্বাগতম',
    ur: 'خوش آمدید',
    fa: 'خوش آمدید',
    ku: 'Xêr hatî',
    am: 'እንኳን ደስ አለዎት',
    sw: 'Karibu',
    zu: 'Siyakwamukela',
    af: 'Welkom',
    is: 'Velkomin',
    mt: 'Merħba',
    ga: 'Fáilte',
    cy: 'Croeso',
    eu: 'Ongi etorri',
    ca: 'Benvingut',
    gl: 'Benvido',
    sq: 'Mirë se vini',
    mk: 'Добредојдовте',
    bs: 'Dobrodošli',
    me: 'Dobrodošli',
    ka: 'კეთილი იყოს თქვენი მობრძანება',
    hy: 'Բարի գալուստ',
    az: 'Xoş gəlmisiniz',
    kk: 'Қош келдіңіз',
    ky: 'Кош келдиңиз',
    uz: 'Xush kelibsiz',
    mn: 'Тавтай морил',
    ne: 'स्वागत छ',
    si: 'සාදරයෙන් පිළිගනිමු',
    my: 'ကြိုဆိုပါတယ်',
    km: 'សូមស្វាគមន៍',
    lo: 'ຍິນດີຕ້ອນຮັບ',
    jw: 'Sugeng rawuh',
    su: 'Wilujeng sumping',
    ceb: 'Maayong pag-abot',
    haw: 'Aloha mai',
    mi: 'Nau mai',
    sm: 'Afio mai',
    fj: 'Bula vinaka',
    to: 'Mālō e lelei',
    ty: 'Maeva',
    mg: 'Tongasoa',
    yo: 'Káàbọ̀',
    ig: 'Nnọọ',
    ha: 'Barka da zuwa',
    so: 'Ku soo dhowow',
    om: 'Baga nagaan dhuftan',
    ti: 'እንኳን ደስ አለዎት',
    sn: 'Tinokudzai',
    xh: 'Wamkelekile',
    st: 'Rea u amohela',
    tn: 'Re a u amogela',
    ts: 'Ri ni amukela',
    ve: 'Ndi khou ni amukela',
    nr: 'Siyakwamukela',
    ss: 'Sikwemukela',
    rw: 'Murakaza neza',
    lg: 'Tukusanyukidde',
    ak: 'Akwaaba',
    tw: 'Akwaaba',
    ee: 'Woezɔ',
    fon: 'Kpodo',
    dyo: 'Salamalekum',
    wo: 'Dal ak jàmm',
    ff: 'Miɗoɗo',
    bm: 'I ni ce',
    sg: 'Balaô',
    dz: 'ཕྱག་མཆོད་ཆོག',
    bo: 'བོད་ཡིག',
    ug: 'ئۇيغۇرچە',
    ii: 'ꆈꌠꉙ',
    za: 'Gyoengq',
    br: 'Degemer mat',
    co: 'Benvenutu',
    fur: 'Benvignût',
    rm: 'Bainvegni',
    lb: 'Wëllkomm',
    fy: 'Wolkom',
    gv: 'Failt ort',
    kw: 'Dynnargh',
    fo: 'Vælkomin',
    kl: 'Tikilluarit',
    se: 'Bures boahtin',
    smn: 'Pyeri tullâ',
    sms: 'Pyeri tullâ',
    sma: 'Bures boahtin',
    smj: 'Bures boahtin',
    sme: 'Bures boahtin'
  };

  const getWelcomeText = () => {
    const currentLanguage = languages[currentIndex];
    return welcomeTexts[currentLanguage.code] || currentLanguage.native;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedLanguage && !isScrolling) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % languages.length);
          setIsTransitioning(false);
        }, 800);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [selectedLanguage, isScrolling, languages.length]);

  // Professional scroll functionality
  useEffect(() => {
    let isProcessing = false;
    let lastScrollTime = 0;
    
    // Professional configuration
    const config = {
      scrollThreshold: 10,        // Low threshold for immediate response
      scrollCooldown: 100,        // Reasonable cooldown to prevent spam
      transitionDuration: 300,    // Fast, smooth transitions
      autoResumeDelay: 2000       // Delay before auto-animation resumes
    };

    // Clean scroll handler
    const handleScroll = (event) => {
      // Early returns for better performance
      if (selectedLanguage || isProcessing) return;
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < config.scrollCooldown) return;

      const deltaY = event.deltaY;
      
      // Immediate response for significant scroll
      if (Math.abs(deltaY) >= config.scrollThreshold) {
        isProcessing = true;
        lastScrollTime = currentTime;
        
        // Set scroll state
        setIsScrolling(true);
        setIsTransitioning(true);
        setScrollDirection(deltaY > 0 ? 'down' : 'up');

        // Update language index
        if (deltaY > 0) {
          setCurrentIndex((prev) => (prev + 1) % languages.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + languages.length) % languages.length);
        }

        // Clear transition state
        setTimeout(() => {
          setIsTransitioning(false);
          setScrollDirection(null);
          isProcessing = false;
        }, config.transitionDuration);

        // Resume auto-animation
        setTimeout(() => {
          setIsScrolling(false);
        }, config.autoResumeDelay);
      }
    };

    // Professional touch handler
    let touchStartY = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (event) => {
      if (selectedLanguage || isProcessing) return;
      event.preventDefault(); // Prevent page scrolling
      touchStartY = event.touches[0].clientY;
      touchStartTime = Date.now();
    };
    
    const handleTouchMove = (event) => {
      if (selectedLanguage || isProcessing) return;
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < config.scrollCooldown) return;
      
      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const deltaTime = currentTime - touchStartTime;
      
      // Clear swipe detection
      if (Math.abs(deltaY) > 40 && deltaTime < 400) {
        event.preventDefault(); // Prevent page scrolling
        isProcessing = true;
        lastScrollTime = currentTime;
        
        setIsScrolling(true);
        setIsTransitioning(true);
        setScrollDirection(deltaY > 0 ? 'down' : 'up');

        if (deltaY > 0) {
          setCurrentIndex((prev) => (prev + 1) % languages.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + languages.length) % languages.length);
        }

        setTimeout(() => {
          setIsTransitioning(false);
          setScrollDirection(null);
          isProcessing = false;
        }, config.transitionDuration);

        setTimeout(() => {
          setIsScrolling(false);
        }, config.autoResumeDelay);
      }
    };

    // Professional keyboard handler
    const handleKeyDown = (event) => {
      if (selectedLanguage || isProcessing) return;
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < config.scrollCooldown) return;
      
      let direction = 0;
      let shouldChange = false;
      
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          direction = 1;
          shouldChange = true;
          break;
        case 'ArrowUp':
        case 'PageUp':
          direction = -1;
          shouldChange = true;
          break;
        case 'Home':
          setCurrentIndex(0);
          shouldChange = true;
          break;
        case 'End':
          setCurrentIndex(languages.length - 1);
          shouldChange = true;
          break;
      }
      
      if (shouldChange) {
        event.preventDefault();
        isProcessing = true;
        lastScrollTime = currentTime;
        
        setIsScrolling(true);
        setIsTransitioning(true);
        setScrollDirection(direction > 0 ? 'down' : 'up');

        if (direction !== 0) {
          setCurrentIndex((prev) => (prev + direction + languages.length) % languages.length);
        }

        setTimeout(() => {
          setIsTransitioning(false);
          setScrollDirection(null);
          isProcessing = false;
        }, config.transitionDuration);

        setTimeout(() => {
          setIsScrolling(false);
        }, config.autoResumeDelay);
      }
    };

    // Professional wheel handler
    const handleWheel = (event) => {
      if (!selectedLanguage) {
        event.preventDefault(); // Prevent page scrolling
        handleScroll(event);
      }
    };

    // Add event listeners with proper options
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedLanguage, languages.length]);

  const handleLanguageClick = (language, event) => {
    console.log('Language clicked:', language); // Debug log
    // Add visual feedback
    const element = event.target.closest('.language-item');
    if (element) {
      element.style.transform = 'scale(0.95)';
      setTimeout(() => {
        element.style.transform = '';
      }, 150);
    }
    setSelectedLanguage(language);
    changeLanguage(language.code);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  const getVisibleLanguages = () => {
    const result = [];
    const totalVisible = 7; // Show 7 languages at a time
    const halfVisible = Math.floor(totalVisible / 2);
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      const index = (currentIndex + i + languages.length) % languages.length;
      result.push({
        ...languages[index],
        position: i,
        isActive: i === 0
      });
    }
    return result;
  };

  // Inline styles
  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    position: 'relative',
    overflow: 'hidden'
  };

  const containerStyle = {
    textAlign: 'center',
    width: '100%',
    maxWidth: '480px',
    padding: '3rem 2rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  const logoSectionStyle = {
    marginBottom: '2rem',
    animation: 'logoEntrance 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)'
  };

  const logoTextStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
    marginBottom: '0.5rem',
    lineHeight: '1.2'
  };

  const welcomeTextStyle = {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '3.5rem',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)',
    willChange: 'transform, opacity',
    lineHeight: '1.2',
    letterSpacing: '-0.01em'
  };

  const languageListStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative',
    height: '360px',
    overflow: 'visible',
    pointerEvents: 'auto',
    marginBottom: '3rem',
    width: '100%',
    justifyContent: 'center',
    minHeight: '360px',
    maxHeight: '360px',
    zIndex: '10'
  };

  const getLanguageItemStyle = (language) => {
    const baseStyle = {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      padding: '1rem 2.5rem',
      borderRadius: '16px',
      fontWeight: '500',
      letterSpacing: '0.01em',
      opacity: '0.8',
      whiteSpace: 'nowrap',
      filter: 'none',
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      pointerEvents: 'auto',
      zIndex: '10',
      userSelect: 'none',
      animationDelay: `${Math.abs(language.position) * 0.1}s`,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '56px',
      maxHeight: '56px',
      willChange: 'transform, opacity',
      backdropFilter: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
    };

    // Position-based styling with animations
    switch (language.position) {
      case -3:
        baseStyle.transform = 'scale(0.6) translateY(15px)';
        baseStyle.opacity = '0.3';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatDistant 4s ease-in-out infinite';
        break;
      case -2:
        baseStyle.transform = 'scale(0.75) translateY(8px)';
        baseStyle.opacity = '0.5';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatDistant 4s ease-in-out infinite 0.5s';
        break;
      case -1:
        baseStyle.transform = 'scale(0.85) translateY(4px)';
        baseStyle.opacity = '0.7';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatNear 3s ease-in-out infinite';
        break;
      case 0:
        baseStyle.transform = 'scale(1.1) translateY(0)';
        baseStyle.opacity = '1';
        baseStyle.filter = 'none';
        baseStyle.fontWeight = '600';
        baseStyle.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        baseStyle.color = '#ffffff';
        baseStyle.backdropFilter = 'none';
        baseStyle.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1)';
        baseStyle.border = '1px solid #3b82f6';
        baseStyle.zIndex = '20';
        baseStyle.animation = 'floatCenter 2s ease-in-out infinite';
        break;
      case 1:
        baseStyle.transform = 'scale(0.85) translateY(-4px)';
        baseStyle.opacity = '0.7';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatNear 3s ease-in-out infinite 0.5s';
        break;
      case 2:
        baseStyle.transform = 'scale(0.75) translateY(-8px)';
        baseStyle.opacity = '0.5';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatDistant 4s ease-in-out infinite 1s';
        break;
      case 3:
        baseStyle.transform = 'scale(0.6) translateY(-15px)';
        baseStyle.opacity = '0.3';
        baseStyle.filter = 'none';
        baseStyle.animation = 'floatDistant 4s ease-in-out infinite 1.5s';
        break;
      default:
        baseStyle.transform = 'scale(0.85) translateY(0)';
        baseStyle.opacity = '0.7';
        baseStyle.filter = 'none';
        break;
    }

    // Hover effects
    if (hoveredLanguage && hoveredLanguage.code === language.code) {
      baseStyle.opacity = '1';
      baseStyle.filter = 'none';
      baseStyle.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      baseStyle.border = '1px solid #cbd5e1';
      baseStyle.background = '#f8fafc';
      baseStyle.transform = baseStyle.transform.replace('scale(', 'scale(').replace(')', ')') + ' translateY(-2px)';
    }

    return baseStyle;
  };

  const languageTextStyle = {
    fontSize: '1rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)',
    lineHeight: '1.4'
  };

  const activeLanguageTextStyle = {
    fontSize: '1.25rem',
    fontWeight: '600'
  };

  const selectionOverlayStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: theme.modalOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'none',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const selectedContentStyle = {
    textAlign: 'center',
    color: theme.primaryText,
    animation: 'scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateZ(0)'
  };

  const checkIconStyle = {
    fontSize: '4rem',
    color: '#22c55e',
    marginBottom: '1rem',
    animation: 'bounceIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    transform: 'translateZ(0)'
  };

  const selectedTitleStyle = {
    fontSize: '2rem',
    fontWeight: '500',
    marginBottom: '0.5rem'
  };

  const selectedSubtitleStyle = {
    fontSize: '1rem',
    opacity: '0.8'
  };

  const scrollIndicatorStyle = {
    position: 'relative',
    marginTop: '1rem',
    color: '#64748b',
    fontSize: '0.875rem',
    textAlign: 'center',
    pointerEvents: 'auto',
    userSelect: 'none',
    background: '#ffffff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    maxWidth: '280px',
    width: '280px',
    margin: '0 auto',
    boxSizing: 'border-box',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: '5'
  };

  const scrollDirectionIndicatorStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '4rem',
    color: theme.mutedText,
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: scrollDirection ? '1' : '0',
    zIndex: '100',
    textShadow: `0 0 20px ${theme.primaryShadow}`,
    animation: scrollDirection ? 'scrollDirectionPulse 0.8s ease-in-out' : 'none'
  };

  return (
    <div className="apple-language-page theme-white" style={{
      ...pageStyle,
      animation: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
              <div style={containerStyle}>
          <div style={logoSectionStyle}>
            <div style={logoTextStyle}>Oakland AI</div>
          </div>
          
          <div style={{
            ...welcomeTextStyle,
            opacity: isTransitioning ? '0.7' : '1',
            transform: isTransitioning ? 'scale(0.99) translateY(3px)' : 'scale(1) translateY(0)',
            transition: isScrolling ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {selectedLanguage ? selectedLanguage.native : getWelcomeText()}
          </div>
          
          <div style={languageListStyle}>
            {getVisibleLanguages().map((language, index) => (
              <div
                key={`${language.code}-${language.position}-${currentIndex}`}
                style={getLanguageItemStyle(language)}
                onClick={(event) => handleLanguageClick(language, event)}
                onMouseEnter={() => setHoveredLanguage(language)}
                onMouseLeave={() => setHoveredLanguage(null)}
              >
                <span style={language.isActive ? { ...languageTextStyle, ...activeLanguageTextStyle } : languageTextStyle}>
                  {language.native}
                </span>
              </div>
            ))}
          </div>

          {!selectedLanguage && (
            <div style={scrollIndicatorStyle} className="scroll-indicator">
              <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500', marginBottom: '0.5rem' }}>
                Scroll or use arrow keys ↑ ↓
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Space: Next • Home/End: Jump
              </div>
            </div>
          )}

          {scrollDirection && (
            <div style={scrollDirectionIndicatorStyle}>
              {scrollDirection === 'down' ? '↓' : '↑'}
            </div>
          )}

          {selectedLanguage && (
            <div style={selectionOverlayStyle}>
              <div style={selectedContentStyle}>
                <div style={checkIconStyle}>✓</div>
                <h2 style={{ ...selectedTitleStyle, color: theme.primaryText }}>{selectedLanguage.native}</h2>
                <p style={{ ...selectedSubtitleStyle, color: theme.secondaryText }}>{t('selected')}</p>
              </div>
            </div>
          )}
        </div>

      <style>{`
        /* Prevent layout shifts during scrolling */
        * {
          box-sizing: border-box;
        }
        
        /* Optimize animations */
        .language-item {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
          contain: layout style paint;
        }
        
        /* Prevent layout shifts during transitions */
        .language-list {
          contain: layout style;
          transform: translateZ(0);
        }
        
        /* Ensure smooth transitions for all language items */
        .language-item {
          transform-origin: center center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Prevent any potential flickering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Ensure language list is above any potential overlays */
        .language-list {
          position: relative;
          z-index: 10;
        }
        
        /* Ensure scroll indicator is properly positioned */
        .scroll-indicator {
          position: relative;
          z-index: 5;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin: 0 auto !important;
        }
        
        @keyframes logoEntrance {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes floatCenter {
          0%, 100% {
            transform: scale(1.1) translateY(0);
          }
          50% {
            transform: scale(1.12) translateY(-1px);
          }
        }

        @keyframes floatNear {
          0%, 100% {
            transform: scale(0.85) translateY(4px);
          }
          50% {
            transform: scale(0.87) translateY(2px);
          }
        }

        @keyframes floatDistant {
          0%, 100% {
            transform: scale(0.6) translateY(15px);
          }
          50% {
            transform: scale(0.62) translateY(13px);
          }
        }



        @keyframes scrollDirectionPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @media (max-width: 768px) {
          .welcome-text {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }
          
          .language-list {
            height: 300px;
            min-height: 300px;
            max-height: 300px;
            margin-bottom: 1.5rem;
          }
          
          .language-item {
            padding: 0.6rem 1.5rem;
            height: 50px;
            min-height: 50px;
            max-height: 50px;
          }
          
          .language-text {
            font-size: 1rem;
          }
          
          .language-item.active .language-text {
            font-size: 1.4rem;
          }
          
          .selected-content {
            padding: 2rem;
          }
          
          .selected-content h2 {
            font-size: 1.5rem;
          }
          
          .scroll-indicator {
            max-width: 90%;
            width: 90%;
            margin: 1rem auto 0 auto;
          }
        }

        @media (max-width: 480px) {
          .language-container {
            padding: 1rem;
            max-width: 100%;
          }
          
          .welcome-text {
            font-size: 2rem;
            margin-bottom: 1.5rem;
          }
          
          .language-list {
            height: 250px;
            min-height: 250px;
            max-height: 250px;
            margin-bottom: 1rem;
          }
          
          .language-item {
            padding: 0.5rem 1rem;
            height: 45px;
            min-height: 45px;
            max-height: 45px;
          }
          
          .language-text {
            font-size: 0.9rem;
          }
          
          .language-item.active .language-text {
            font-size: 1.2rem;
          }
          
          .scroll-indicator {
            max-width: 95%;
            width: 95%;
            margin: 1rem auto 0 auto;
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default LanguageSelectionPage; 