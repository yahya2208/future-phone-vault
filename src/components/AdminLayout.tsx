import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!user || user.email !== 'yahyamanouni2@gmail.com')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will be redirected)
  if (!user || user.email !== 'yahyamanouni2@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            {language === 'ar' ? (
              <>
                <span>العودة للصفحة الرئيسية</span>
                <ArrowLeft className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Home</span>
              </>
            )}
          </Button>
        </div>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
