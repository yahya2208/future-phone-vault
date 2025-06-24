
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Disclaimer = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          إخلاء المسؤولية
        </h1>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          العودة للرئيسية
        </Button>
      </div>

      <Card className="holo-card">
        <CardHeader>
          <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
            إخلاء مسؤولية غزة سايفر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">طبيعة الخدمة</h3>
            <p className="text-muted-foreground">
              غزة سايفر هو تطبيق لتوثيق معاملات الهواتف المحمولة ولا يُعتبر وسيطاً في عمليات البيع والشراء.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">عدم ضمان المعلومات</h3>
            <p className="text-muted-foreground">
              لا نضمن دقة أو اكتمال المعلومات المُدخلة من قبل المستخدمين، وننصح بالتحقق من جميع البيانات.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">القيود القانونية</h3>
            <p className="text-muted-foreground">
              التطبيق لا يوفر استشارة قانونية ولا يُعتبر دليلاً قانونياً في المحاكم إلا بموافقة الجهات المختصة.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">اتصل بنا</h3>
            <p className="text-muted-foreground">
              للاستفسارات أو المساعدة، يرجى التواصل معنا على: +213551148943
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Disclaimer;
