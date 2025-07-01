
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

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
      description: 'هذا التطبيق مخصص للتوثيق الشخصي فقط وليس للاستخدام القانوني الرسمي. نحن نحترم خصوصيتك ولا نشارك بياناتك مع أي طرف ثالث.',
      button: 'فهمت'
    },
    en: {
      title: 'Privacy Notice',
      description: 'This application is for personal documentation only and not for official legal use. We respect your privacy and do not share your data with any third parties.',
      button: 'Got it'
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Alert className="max-w-4xl mx-auto bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 pr-8">
          <div className="flex justify-between items-start">
            <div>
              <strong>{messages[language].title}:</strong> {messages[language].description}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleClose}
            size="sm"
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {messages[language].button}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PrivacyNotification;
