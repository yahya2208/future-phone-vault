
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Header
    appTitle: 'غزة سايفر',
    appSubtitle: 'نظام إدارة الهواتف الذكية',
    currentTime: 'الوقت الحالي',
    systemStatus: 'حالة النظام',
    connected: 'متصل',
    logout: 'تسجيل الخروج',
    
    // Dashboard Stats
    totalTransactions: 'إجمالي المعاملات',
    devicesProcessed: 'الأجهزة المعالجة',
    topBrand: 'العلامة التجارية الأكثر شيوعاً',
    mostPopular: 'الأكثر شعبية',
    today: 'اليوم',
    newTransactions: 'معاملات جديدة',
    notAvailable: 'غير متوفر',
    averageRating: 'معدل التقييم',
    
    // Transaction Form
    newTransactionPortal: 'بوابة المعاملات الجديدة',
    sellerName: 'اسم البائع',
    buyerName: 'اسم المشتري',
    phoneBrand: 'العلامة التجارية',
    phoneModel: 'طراز الهاتف',
    imei: 'رقم الهوية (15 رقم)',
    purchaseDate: 'تاريخ الشراء',
    processTransaction: 'معالجة المعاملة',
    sellerPhone: 'رقم هاتف البائع (اختياري)',
    sellerEmailOptional: 'إيميل البائع (اختياري)',
    buyerEmailOptional: 'إيميل المشتري (اختياري)',
    rateExperience: 'قيم تجربة المعاملة',
    chooseFromGallery: 'اختيار من المعرض',
    signatureAdded: 'تم إضافة التوقيع',
    sendEmailReceipt: 'إرسال إيصال المعاملة عبر الإيميل (اختياري)',
    
    // Camera and Signature
    buyerIdPhoto: 'صورة هوية المشتري',
    takePhoto: 'التقاط صورة',
    signature: 'التوقيع',
    signHere: 'وقع هنا',
    clearSignature: 'مسح التوقيع',
    
    // Footer Links
    complaints: 'الشكاوى',
    privacy: 'الخصوصية',
    howToUse: 'كيفية الاستخدام',
    contactUs: 'اتصل بنا',
    viewTransactions: 'عرض المعاملات',
    pages: 'الصفحات',
    support: 'الدعم',
    helpAndSupport: 'المساعدة والدعم',
    allRightsReserved: 'جميع الحقوق محفوظة',
    numberOfUsers: 'عدد المستخدمين',
    appDescription: 'نظام توثيق معاملات الهواتف المحمولة الأكثر أماناً وموثوقية',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    username: 'اسم المستخدم'
  },
  en: {
    // Header
    appTitle: 'Ghaza Saver',
    appSubtitle: 'Smart Phone Management System',
    currentTime: 'Current Time',
    systemStatus: 'System Status',
    connected: 'Connected',
    logout: 'Logout',
    
    // Dashboard Stats
    totalTransactions: 'Total Transactions',
    devicesProcessed: 'Devices Processed',
    topBrand: 'Top Brand',
    mostPopular: 'Most Popular',
    today: 'Today',
    newTransactions: 'New Transactions',
    notAvailable: 'Not Available',
    averageRating: 'Average Rating',
    
    // Transaction Form
    newTransactionPortal: 'New Transaction Portal',
    sellerName: 'Seller Name',
    buyerName: 'Buyer Name',
    phoneBrand: 'Phone Brand',
    phoneModel: 'Phone Model',
    imei: 'IMEI (15 digits)',
    purchaseDate: 'Purchase Date',
    processTransaction: 'PROCESS TRANSACTION',
    sellerPhone: 'Seller Phone (Optional)',
    sellerEmailOptional: 'Seller Email (Optional)',
    buyerEmailOptional: 'Buyer Email (Optional)',
    rateExperience: 'Rate Transaction Experience',
    chooseFromGallery: 'Choose from Gallery',
    signatureAdded: 'Signature Added',
    sendEmailReceipt: 'Send Email Receipt (Optional)',
    
    // Camera and Signature
    buyerIdPhoto: 'Buyer ID Photo',
    takePhoto: 'Take Photo',
    signature: 'Signature',
    signHere: 'Sign Here',
    clearSignature: 'Clear Signature',
    
    // Footer Links
    complaints: 'Complaints',
    privacy: 'Privacy',
    howToUse: 'How to Use',
    contactUs: 'Contact Us',
    viewTransactions: 'View Transactions',
    pages: 'Pages',
    support: 'Support',
    helpAndSupport: 'Help & Support',
    allRightsReserved: 'All Rights Reserved',
    numberOfUsers: 'Number of Users',
    appDescription: 'The most secure and reliable mobile phone transaction documentation system',
    
    // Auth
    login: 'Login',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    username: 'Username'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'ar' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    try {
      // Safely get the translation, return the key if not found
      return translations[language]?.[key] || translations['en'][key] || key;
    } catch (error) {
      console.warn(`Translation error for key "${key}" in language "${language}"`);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
