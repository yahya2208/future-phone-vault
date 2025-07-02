
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const FuturisticHeader = () => {
  const { signOut, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const currentTime = new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="relative p-4 md:p-6 mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-background rounded-full pulse-glow"></div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary glow-text font-['Orbitron']">
              {t('appTitle')}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">{t('appSubtitle')}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 md:space-x-reverse">
          <LanguageSwitcher />
          
          <div className="text-center">
            <div className="text-primary text-xs md:text-sm font-mono">{t('currentTime')}</div>
            <div className="text-xs text-accent font-mono">{currentTime}</div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button 
                onClick={() => navigate('/profile')}
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-accent/20"
                title={language === 'ar' ? 'الملف الشخصي' : 'Profile'}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleLogout}
                className="neural-btn text-xs md:text-sm px-3 py-2 min-w-[100px]"
                variant="outline"
              >
                {t('logout')}
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-primary text-xs md:text-sm font-mono">{t('systemStatus')}</div>
            <div className="text-xs text-accent">{t('connected')}</div>
          </div>
          <div className="w-2 h-8 md:h-12 bg-gradient-to-t from-primary to-accent rounded-full pulse-glow"></div>
        </div>
      </div>
      
      {/* Neural scan line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent">
        <div className="h-full w-20 bg-primary animate-neural-scan"></div>
      </div>
    </header>
  );
};

export default FuturisticHeader;
