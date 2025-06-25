
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const FooterLinks = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-12 pt-8 border-t border-primary/20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-primary font-semibold mb-4 font-['Orbitron']">غزة سايفر</h3>
          <p className="text-muted-foreground text-sm">
            نظام توثيق معاملات الهواتف المحمولة الأكثر أماناً وموثوقية
          </p>
          <div className="mt-4 text-xs text-muted-foreground">
            عدد المستخدمين: <span className="text-primary font-semibold">1,247+</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-primary font-semibold mb-4">الصفحات</h4>
          <div className="space-y-2">
            <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              شروط الاستخدام
            </Link>
            <Link to="/disclaimer" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              إخلاء المسؤولية
            </Link>
          </div>
        </div>
        
        <div>
          <h4 className="text-primary font-semibold mb-4">الدعم</h4>
          <div className="space-y-2">
            <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              المساعدة والدعم
            </Link>
            <a href="tel:+213551148943" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              +213551148943
            </a>
            <a href="mailto:yahyamanouni@gmail.com" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
              yahyamanouni@gmail.com
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-primary/10 text-center">
        <p className="text-muted-foreground text-xs">
          © 2024 غزة سايفر. جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
};

export default FooterLinks;
