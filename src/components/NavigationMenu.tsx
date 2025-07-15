
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Shield,
  ChevronDown,
  Home,
  FileText
} from 'lucide-react';

const NavigationMenu = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    {
      icon: Home,
      label: language === 'ar' ? 'الرئيسية' : 'Home',
      onClick: () => navigate('/'),
    },
    {
      icon: FileText,
      label: language === 'ar' ? 'المعاملات' : 'Transactions',
      onClick: () => navigate('/transactions'),
    },
    {
      icon: User,
      label: language === 'ar' ? 'الملف الشخصي' : 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      icon: Settings,
      label: language === 'ar' ? 'الإعدادات' : 'Settings',
      onClick: () => navigate('/settings'),
    },
  ];

  // Add admin menu item if user is admin
  if (user?.email === 'yahyamanouni2@gmail.com' || user?.email === 'y220890@gmail.com') {
    menuItems.push({
      icon: Shield,
      label: language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel',
      onClick: () => navigate('/admin'),
    });
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-1">
            <Menu className="h-4 w-4" />
            <ChevronDown 
              className={`h-3 w-3 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-48 animate-in slide-in-from-top-2"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium">
            {user?.user_metadata?.username || user?.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="flex items-center gap-2 cursor-pointer hover:bg-primary/10"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavigationMenu;
