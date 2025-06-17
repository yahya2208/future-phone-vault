
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        onClick={() => setLanguage('ar')}
        className="text-xs px-3 py-1 h-8"
      >
        عربي
      </Button>
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
        className="text-xs px-3 py-1 h-8"
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
