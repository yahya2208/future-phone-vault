
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import InviteFriendsButton from './InviteFriendsButton';

const FuturisticHeader = () => {
  const { signOut, user } = useAuth();
  const { language, t } = useLanguage();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="mb-8">
      <Card className="holo-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-6xl font-bold text-primary glow-text font-['Orbitron'] mb-2">
                {t('appTitle')}
              </h1>
              <p className="text-accent text-lg md:text-xl mb-4">
                {t('appDescription')}
              </p>
              <div className="text-xs text-muted-foreground">
                {user?.email && (
                  <span className="block mb-2">
                    {language === 'ar' ? 'مرحباً' : 'Welcome'}: {user.email}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <LanguageSwitcher />
              <InviteFriendsButton />
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2 w-full md:w-auto"
              >
                <LogOut size={16} />
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuturisticHeader;
