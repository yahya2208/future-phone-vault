
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

const PrivacyNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem('privacyNotificationSeen');
    if (!hasSeenNotification) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('privacyNotificationSeen', 'true');
  };

  if (!isVisible) return null;

  const messages = {
    ar: {
      title: 'إشعار الخصوصية',
      content: 'نحن نحترم خصوصيتك. جميع البيانات المدخلة تُحفظ محلياً على جهازك ولا تُشارك مع أطراف ثالثة. هذا التطبيق مخصص للاستخدام الشخصي فقط.',
      understand: 'فهمت'
    },
    en: {
      title: 'Privacy Notice',
      content: 'We respect your privacy. All entered data is stored locally on your device and is not shared with third parties. This application is intended for personal use only.',
      understand: 'I Understand'
    }
  };

  const msg = messages[language];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{msg.title}</h4>
          <p className="text-sm opacity-90">{msg.content}</p>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <button
            onClick={handleClose}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {msg.understand}
          </button>
          <button
            onClick={handleClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotification;
