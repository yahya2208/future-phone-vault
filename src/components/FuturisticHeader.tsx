
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import NavigationMenu from './NavigationMenu';
import { Button } from './ui/button';

const FuturisticHeader = () => {
  const { language } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="relative">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-primary glow-text">
            {language === 'ar' ? 'إدارة المعاملات' : 'Transaction Management'}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <NavigationMenu />
          ) : (
            <Button asChild variant="outline">
              <Link to="/auth">
                {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default FuturisticHeader;
