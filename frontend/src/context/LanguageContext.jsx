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
        language: 'Language',
        username: 'Username',
        password: 'Password',
        usernamePlaceholder: 'Enter your username',
        passwordPlaceholder: 'Enter your password',
        signIn: 'Sign In',
        signingIn: 'Signing In...',
        signUp: 'Sign up',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        signInToAccess: 'Sign in to access your Oakland AI assistant',
        smartHelp: 'Smart help for',
        smallBusinesses: 'small businesses',
        inOakland: 'in Oakland.',
        speakYourLanguage: 'Speak your language.',
        getAnswers: 'Get answers. No paperwork.'
      },
      es: {
        welcome: 'Bienvenido',
        selectLanguage: 'Selecciona tu idioma',
        continue: 'Continuar',
        back: 'Atrás',
        language: 'Idioma',
        username: 'Nombre de usuario',
        password: 'Contraseña',
        usernamePlaceholder: 'Ingresa tu nombre de usuario',
        passwordPlaceholder: 'Ingresa tu contraseña',
        signIn: 'Iniciar sesión',
        signingIn: 'Iniciando sesión...',
        signUp: 'Registrarse',
        forgotPassword: '¿Olvidaste tu contraseña?',
        noAccount: '¿No tienes una cuenta?',
        signInToAccess: 'Inicia sesión para acceder a tu asistente Oakland AI',
        smartHelp: 'Ayuda inteligente para',
        smallBusinesses: 'pequeñas empresas',
        inOakland: 'en Oakland.',
        speakYourLanguage: 'Habla tu idioma.',
        getAnswers: 'Obtén respuestas. Sin papeleo.'
      },
      fr: {
        welcome: 'Bienvenue',
        selectLanguage: 'Sélectionnez votre langue',
        continue: 'Continuer',
        back: 'Retour',
        language: 'Langue',
        username: "Nom d'utilisateur",
        password: 'Mot de passe',
        usernamePlaceholder: "Entrez votre nom d'utilisateur",
        passwordPlaceholder: 'Entrez votre mot de passe',
        signIn: 'Se connecter',
        signingIn: 'Connexion en cours...',
        signUp: "S'inscrire",
        forgotPassword: 'Mot de passe oublié ?',
        noAccount: "Vous n'avez pas de compte ?",
        signInToAccess: 'Connectez-vous pour accéder à votre assistant Oakland AI',
        smartHelp: 'Aide intelligente pour',
        smallBusinesses: 'les petites entreprises',
        inOakland: 'à Oakland.',
        speakYourLanguage: 'Parlez votre langue.',
        getAnswers: 'Obtenez des réponses. Sans paperasse.'
      },
      de: {
        welcome: 'Willkommen',
        selectLanguage: 'Wählen Sie Ihre Sprache',
        continue: 'Weiter',
        back: 'Zurück',
        language: 'Sprache',
        username: 'Benutzername',
        password: 'Passwort',
        usernamePlaceholder: 'Geben Sie Ihren Benutzernamen ein',
        passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
        signIn: 'Anmelden',
        signingIn: 'Anmeldung läuft...',
        signUp: 'Registrieren',
        forgotPassword: 'Passwort vergessen?',
        noAccount: 'Haben Sie kein Konto?',
        signInToAccess: 'Melden Sie sich an, um auf Ihren Oakland AI-Assistenten zuzugreifen',
        smartHelp: 'Intelligente Hilfe für',
        smallBusinesses: 'kleine Unternehmen',
        inOakland: 'in Oakland.',
        speakYourLanguage: 'Sprechen Sie Ihre Sprache.',
        getAnswers: 'Erhalten Sie Antworten. Keine Papierkram.'
      },
      vi: {
        welcome: 'Chào mừng',
        selectLanguage: 'Chọn ngôn ngữ của bạn',
        continue: 'Tiếp tục',
        back: 'Quay lại',
        language: 'Ngôn ngữ',
        username: 'Tên đăng nhập',
        password: 'Mật khẩu',
        usernamePlaceholder: 'Nhập tên đăng nhập của bạn',
        passwordPlaceholder: 'Nhập mật khẩu của bạn',
        signIn: 'Đăng nhập',
        signingIn: 'Đang đăng nhập...',
        signUp: 'Đăng ký',
        forgotPassword: 'Quên mật khẩu?',
        noAccount: 'Chưa có tài khoản?',
        signInToAccess: 'Đăng nhập để truy cập trợ lý Oakland AI của bạn',
        smartHelp: 'Hỗ trợ thông minh cho',
        smallBusinesses: 'doanh nghiệp nhỏ',
        inOakland: 'tại Oakland.',
        speakYourLanguage: 'Nói ngôn ngữ của bạn.',
        getAnswers: 'Nhận câu trả lời. Không cần giấy tờ.'
      },
      ar: {
        welcome: 'مرحباً',
        selectLanguage: 'اختر لغتك',
        continue: 'متابعة',
        back: 'رجوع',
        language: 'لغة',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        usernamePlaceholder: 'أدخل اسم المستخدم الخاص بك',
        passwordPlaceholder: 'أدخل كلمة المرور الخاصة بك',
        signIn: 'تسجيل الدخول',
        signingIn: 'جاري تسجيل الدخول...',
        signUp: 'إنشاء حساب',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        signInToAccess: 'سجل الدخول للوصول إلى مساعد Oakland AI الخاص بك',
        smartHelp: 'مساعدة ذكية لـ',
        smallBusinesses: 'الشركات الصغيرة',
        inOakland: 'في أوكلاند.',
        speakYourLanguage: 'تحدث لغتك.',
        getAnswers: 'احصل على إجابات. بدون أوراق.'
      },
      zh: {
        welcome: '欢迎',
        selectLanguage: '选择您的语言',
        continue: '继续',
        back: '返回',
        language: '语言',
        username: '用户名',
        password: '密码',
        usernamePlaceholder: '请输入您的用户名',
        passwordPlaceholder: '请输入您的密码',
        signIn: '登录',
        signingIn: '正在登录...',
        signUp: '注册',
        forgotPassword: '忘记密码？',
        noAccount: '没有账户？',
        signInToAccess: '登录以访问您的Oakland AI助手',
        smartHelp: '为小企业提供',
        smallBusinesses: '智能帮助',
        inOakland: '在奥克兰。',
        speakYourLanguage: '说您的语言。',
        getAnswers: '获得答案。无需文书工作。'
      },
      tl: {
        welcome: 'Maligayang pagdating',
        selectLanguage: 'Piliin ang iyong wika',
        continue: 'Magpatuloy',
        back: 'Bumalik',
        language: 'Wika',
        username: 'Username',
        password: 'Password',
        usernamePlaceholder: 'Ilagay ang iyong username',
        passwordPlaceholder: 'Ilagay ang iyong password',
        signIn: 'Mag-sign In',
        signingIn: 'Nag-sign In...',
        signUp: 'Mag-sign up',
        forgotPassword: 'Nakalimutan ang password?',
        noAccount: 'Walang account?',
        signInToAccess: 'Mag-sign in para ma-access ang iyong Oakland AI assistant',
        smartHelp: 'Smart na tulong para sa',
        smallBusinesses: 'maliit na negosyo',
        inOakland: 'sa Oakland.',
        speakYourLanguage: 'Magsalita sa iyong wika.',
        getAnswers: 'Kumuha ng sagot. Walang papel.'
      },
      ko: {
        welcome: '환영합니다',
        selectLanguage: '언어를 선택하세요',
        continue: '계속',
        back: '뒤로',
        language: '언어',
        username: '사용자 이름',
        password: '비밀번호',
        usernamePlaceholder: '사용자 이름을 입력하세요',
        passwordPlaceholder: '비밀번호를 입력하세요',
        signIn: '로그인',
        signingIn: '로그인 중...',
        signUp: '가입하기',
        forgotPassword: '비밀번호를 잊으셨나요?',
        noAccount: '계정이 없으신가요?',
        signInToAccess: 'Oakland AI 어시스턴트에 액세스하려면 로그인하세요',
        smartHelp: '오클랜드의',
        smallBusinesses: '소규모 기업을 위한',
        inOakland: '스마트 도움.',
        speakYourLanguage: '당신의 언어로 말하세요.',
        getAnswers: '답변을 받으세요. 서류 작업 없이.'
      },
      hi: {
        welcome: 'स्वागत है',
        selectLanguage: 'अपनी भाषा चुनें',
        continue: 'जारी रखें',
        back: 'वापस',
        language: 'भाषा',
        username: 'उपयोगकर्ता नाम',
        password: 'पासवर्ड',
        usernamePlaceholder: 'अपना उपयोगकर्ता नाम दर्ज करें',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        signIn: 'साइन इन करें',
        signingIn: 'साइन इन हो रहा है...',
        signUp: 'साइन अप करें',
        forgotPassword: 'पासवर्ड भूल गए?',
        noAccount: 'खाता नहीं है?',
        signInToAccess: 'अपने Oakland AI सहायक तक पहुंचने के लिए साइन इन करें',
        smartHelp: 'ओकलैंड में',
        smallBusinesses: 'छोटे व्यवसायों के लिए',
        inOakland: 'स्मार्ट सहायता।',
        speakYourLanguage: 'अपनी भाषा बोलें।',
        getAnswers: 'जवाब पाएं। कोई कागजी कार्रवाई नहीं।'
      },
      th: {
        welcome: 'ยินดีต้อนรับ',
        selectLanguage: 'เลือกภาษาของคุณ',
        continue: 'ดำเนินการต่อ',
        back: 'กลับ',
        language: 'ภาษา',
        username: 'ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        usernamePlaceholder: 'ใส่ชื่อผู้ใช้ของคุณ',
        passwordPlaceholder: 'ใส่รหัสผ่านของคุณ',
        signIn: 'เข้าสู่ระบบ',
        signingIn: 'กำลังเข้าสู่ระบบ...',
        signUp: 'สมัครสมาชิก',
        forgotPassword: 'ลืมรหัสผ่าน?',
        noAccount: 'ไม่มีบัญชี?',
        signInToAccess: 'เข้าสู่ระบบเพื่อเข้าถึงผู้ช่วย Oakland AI ของคุณ',
        smartHelp: 'ความช่วยเหลืออัจฉริยะสำหรับ',
        smallBusinesses: 'ธุรกิจขนาดเล็ก',
        inOakland: 'ในโอ๊กแลนด์',
        speakYourLanguage: 'พูดภาษาของคุณ',
        getAnswers: 'รับคำตอบ ไม่มีเอกสาร'
      },
      ja: {
        welcome: 'ようこそ',
        selectLanguage: '言語を選択してください',
        continue: '続行',
        back: '戻る',
        language: '言語',
        username: 'ユーザー名',
        password: 'パスワード',
        usernamePlaceholder: 'ユーザー名を入力してください',
        passwordPlaceholder: 'パスワードを入力してください',
        signIn: 'サインイン',
        signingIn: 'サインイン中...',
        signUp: 'サインアップ',
        forgotPassword: 'パスワードを忘れた方',
        noAccount: 'アカウントをお持ちでない方',
        signInToAccess: 'Oakland AIアシスタントにアクセスするにはサインインしてください',
        smartHelp: 'オークランドの',
        smallBusinesses: '小企業向けの',
        inOakland: 'スマートヘルプ。',
        speakYourLanguage: 'あなたの言語で話してください。',
        getAnswers: '答えを得てください。書類作業なし。'
      }
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