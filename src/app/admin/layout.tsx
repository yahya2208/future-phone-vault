'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!loading && (!user || user.email !== 'yahyamanouni2@gmail.com')) {
      router.push('/');
    }
  }, [user, loading, router]);

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
            onClick={() => router.push('/admin')}
            className="mb-4"
          >
            {language === 'ar' ? (
              <>
                <span>العودة للوحة التحكم</span>
                <ArrowLeft className="h-4 w-4 mr-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Dashboard</span>
              </>
            )}
          </Button>
        </div>
        
        <main>{children}</main>
      </div>
    </div>
  );
}
