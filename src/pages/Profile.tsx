
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FuturisticHeader from '@/components/FuturisticHeader';
import UserProfile from '@/components/UserProfile';
import FooterLinks from '@/components/FooterLinks';

const Profile = () => {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FuturisticHeader />
        
        <div className="space-y-8">
          <UserProfile />
          
          <div className="border-t pt-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
                {language === 'ar' ? 'للحصول على النسخة المميزة' : 'To Get Premium Version'}
              </h2>
              <p className="text-blue-700 dark:text-blue-400 mb-4">
                {language === 'ar' 
                  ? 'للحصول على معاملات غير محدودة وميزات إضافية، تواصل معنا لشراء كود التفعيل'
                  : 'For unlimited transactions and additional features, contact us to purchase activation code'
                }
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                <p className="font-mono text-lg text-gray-800 dark:text-gray-200">
                  {language === 'ar' ? 'واتساب: +213 xxx xxx xxx' : 'WhatsApp: +213 xxx xxx xxx'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {language === 'ar' 
                    ? 'ستحصل على كود التفعيل بعد تأكيد الدفع'
                    : 'You will receive activation code after payment confirmation'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Profile;
