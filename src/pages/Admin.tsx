
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FuturisticHeader from '@/components/FuturisticHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Key, UserCheck } from 'lucide-react';
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

  const isAdmin = user.email === 'yahyamanouni2@gmail.com';

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <FuturisticHeader />
        
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-primary glow-text">
            {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </h1>

          {isAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    {language === 'ar' ? 'إدارة أكواد التفعيل' : 'Activation Code Management'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar' 
                      ? 'توليد أكواد التفعيل وإدارة عملية التفعيل اليدوي'
                      : 'Generate activation codes and manage manual activation process'
                    }
                  </p>
                  <Button 
                    onClick={() => navigate('/admin-dashboard')}
                    className="w-full"
                  >
                    {language === 'ar' ? 'فتح لوحة التحكم' : 'Open Dashboard'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {language === 'ar' ? 'إحصائيات التفعيل' : 'Activation Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {language === 'ar' 
                      ? 'عرض إحصائيات المستخدمين المفعلين والمعاملات'
                      : 'View statistics of activated users and transactions'
                    }
                  </p>
                  <Button 
                    variant="outline"
                    className="w-full"
                    disabled
                  >
                    {language === 'ar' ? 'قريباً...' : 'Coming Soon...'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <h2 className="text-xl font-semibold text-muted-foreground mb-4">
                  {language === 'ar' ? 'غير مصرح بالوصول' : 'Access Denied'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'ليس لديك صلاحيات للوصول إلى لوحة الإدارة'
                    : 'You do not have permission to access the admin panel'
                  }
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="mt-4"
                  variant="outline"
                >
                  {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default Admin;
