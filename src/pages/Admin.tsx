
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FuturisticHeader from '@/components/FuturisticHeader';
import AdminPanel from '@/components/AdminPanel';
import FooterLinks from '@/components/FooterLinks';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <div className="space-y-8">
          <AdminPanel />
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Admin;
