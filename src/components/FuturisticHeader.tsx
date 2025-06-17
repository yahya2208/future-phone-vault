
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const FuturisticHeader = () => {
  const { signOut, user } = useAuth();
  
  const currentTime = new Date().toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="relative p-6 mb-8" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-background rounded-full pulse-glow"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
              غزة سايفر
            </h1>
            <p className="text-sm text-muted-foreground">نظام إدارة الهواتف الذكية</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="text-center">
            <div className="text-primary text-sm font-mono">الوقت الحالي</div>
            <div className="text-xs text-accent font-mono">{currentTime}</div>
          </div>
          
          {user && (
            <Button 
              onClick={handleLogout}
              className="neural-btn text-sm"
              variant="outline"
            >
              تسجيل الخروج
            </Button>
          )}
          
          <div className="text-center">
            <div className="text-primary text-sm font-mono">حالة النظام</div>
            <div className="text-xs text-accent">متصل</div>
          </div>
          <div className="w-2 h-12 bg-gradient-to-t from-primary to-accent rounded-full pulse-glow"></div>
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
