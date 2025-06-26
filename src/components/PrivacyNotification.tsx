
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const PrivacyNotification = () => {
  const { language } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const hasSeenNotification = localStorage.getItem('privacyNotificationSeen');
    if (!hasSeenNotification) {
      setShowNotification(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyNotificationSeen', 'true');
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-primary text-lg">
            {language === 'ar' ? 'إشعار هام حول الخصوصية' : 'Important Privacy Notice'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAccept}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === 'ar' 
              ? 'يجب عليك إبلاغ البائع بسياسة الخصوصية الخاصة بالتطبيق وكيفية حماية بياناته وفيما تُستخدم هذه البيانات قبل بدء المعاملة.'
              : 'You must inform the seller about the app\'s privacy policy and how their data is protected and used before starting the transaction.'
            }
          </p>
          <p className="text-xs text-muted-foreground">
            {language === 'ar'
              ? 'هذا الإشعار مطلوب قانونياً لضمان الشفافية وحماية البيانات الشخصية.'
              : 'This notification is legally required to ensure transparency and personal data protection.'
            }
          </p>
          <Button onClick={handleAccept} className="w-full">
            {language === 'ar' ? 'فهمت وأوافق' : 'I Understand and Agree'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyNotification;
