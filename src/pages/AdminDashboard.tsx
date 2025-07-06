
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FuturisticHeader from '@/components/FuturisticHeader';
import AdminCodeGeneration from '@/components/AdminCodeGeneration';
import AdminUserActivation from '@/components/AdminUserActivation';
import FooterLinks from '@/components/FooterLinks';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    if (!loading && user && user.email !== 'yahyamanouni2@gmail.com') {
      navigate('/');
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

  if (!user || user.email !== 'yahyamanouni2@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-primary glow-text">
              {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Dashboard'}
            </h1>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              {language === 'ar' ? (
                <>
                  <ArrowRight size={16} />
                  العودة للرئيسية
                </>
              ) : (
                <>
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminCodeGeneration />
            <AdminUserActivation />
          </div>
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default AdminDashboard;
