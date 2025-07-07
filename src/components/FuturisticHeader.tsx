
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FuturisticHeader = () => {
  const { signOut, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
  };

  const isAdmin = user?.email === 'yahyamanouni2@gmail.com';

  // Get user avatar from localStorage or use default
  const getUserAvatar = () => {
    if (user) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      return savedAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=business&backgroundColor=b6e3f4';
    }
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=business&backgroundColor=b6e3f4';
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
          
          {user && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse text-sm">
                <span className="text-foreground">
                  {user.user_metadata?.username || user.email?.split('@')[0] || 'مستخدم'}
                </span>
                {isAdmin && (
                  <div className="relative">
                    <Shield 
                      className="h-5 w-5 text-yellow-500 animate-pulse drop-shadow-lg" 
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6)) drop-shadow(0 0 12px rgba(234, 179, 8, 0.4))'
                      }}
                    />
                    <div className="absolute inset-0 animate-ping">
                      <Shield className="h-5 w-5 text-yellow-400 opacity-30" />
                    </div>
                  </div>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar()} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-primary/20" align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4 text-yellow-500" />
                        {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Dashboard'}
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          {/* Green connection status button */}
          <div className="w-4 h-4 bg-green-500 rounded-full pulse-glow animate-pulse shadow-lg" 
               style={{
                 filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)) drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))'
               }}
               title={language === 'ar' ? 'متصل' : 'Connected'}>
          </div>
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
