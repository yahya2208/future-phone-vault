
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const FooterLinks = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 pt-8 border-t border-primary/20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-primary font-semibold mb-4 font-['Orbitron']">{t('appTitle')}</h3>
          <p className="text-muted-foreground text-sm">
            {t('appDescription')}
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            {t('numberOfUsers')}: <span className="text-primary font-semibold">1,247+</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-primary font-semibold mb-4">{t('pages')}</h4>
          <div className="space-y-2">
            <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              {t('privacy')}
            </Link>
            <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
            </Link>
            <Link to="/disclaimer" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              {language === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-primary font-semibold mb-4">{t('support')}</h4>
          <div className="space-y-2">
            <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              {t('helpAndSupport')}
            </Link>
            <a href="tel:+213551148943" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              +213551148943
            </a>
            <a href="mailto:yahyamanouni@gmail.com" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              yahyamanouni@gmail.com
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-primary/10 text-center">
        <p className="text-muted-foreground text-xs">
          © {currentYear} {t('appTitle')}. {t('allRightsReserved')}
        </p>
      </div>
    </footer>
  );
};

export default FooterLinks;
