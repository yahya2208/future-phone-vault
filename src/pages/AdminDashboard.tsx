
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import FuturisticHeader from '@/components/FuturisticHeader';
import SimpleCodeGenerator from '@/components/SimpleCodeGenerator';
import ManualUserActivation from '@/components/ManualUserActivation';
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

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
            <h2 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
              {language === 'ar' ? 'النظام الجديد للتفعيل:' : 'New Activation System:'}
            </h2>
            <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
              <li>• {language === 'ar' ? 'توليد 200 كود تفعيل جاهز للاستخدام' : 'Generate 200 activation codes ready to use'}</li>
              <li>• {language === 'ar' ? 'تقديم الأكواد للعملاء بعد الدفع' : 'Provide codes to customers after payment'}</li>
              <li>• {language === 'ar' ? 'تفعيل الحسابات يدوياً بالاسم المستعار' : 'Manually activate accounts by username'}</li>
              <li>• {language === 'ar' ? 'نظام بسيط وموثوق بدون أخطاء' : 'Simple and reliable system without errors'}</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SimpleCodeGenerator />
            <ManualUserActivation />
          </div>
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default AdminDashboard;
