
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FooterLinks = () => {
  const { t } = useLanguage();
  
  const openLink = (type: string) => {
    // In a real app, these would navigate to actual pages
    console.log(`Opening ${type} page`);
  };

  return (
    <footer className="mt-16 space-y-4">
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <Button
          variant="link"
          onClick={() => openLink('complaints')}
          className="text-muted-foreground hover:text-primary p-0 h-auto"
        >
          {t('complaints')}
        </Button>
        
        <span className="text-muted-foreground">•</span>
        
        <Button
          variant="link"
          onClick={() => openLink('privacy')}
          className="text-muted-foreground hover:text-primary p-0 h-auto"
        >
          {t('privacy')}
        </Button>
        
        <span className="text-muted-foreground">•</span>
        
        <Button
          variant="link"
          onClick={() => openLink('howToUse')}
          className="text-muted-foreground hover:text-primary p-0 h-auto"
        >
          {t('howToUse')}
        </Button>
        
        <span className="text-muted-foreground">•</span>
        
        <a 
          href="tel:+213551148943"
          className="text-muted-foreground hover:text-primary"
        >
          {t('contactUs')}: +213551148943
        </a>
      </div>
      
      <p className="text-center text-muted-foreground text-sm">
        نظام إدارة غزة سايفر v2060.1 • الواجهة العصبية نشطة
      </p>
    </footer>
  );
};

export default FooterLinks;
