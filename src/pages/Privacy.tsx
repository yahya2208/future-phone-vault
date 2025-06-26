
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          سياسة الخصوصية
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
            حماية بياناتك أولويتنا
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">جمع المعلومات</h3>
            <p className="text-muted-foreground">
              نقوم بجمع المعلومات التي تقدمها عند تسجيل معاملات الهواتف، بما في ذلك:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>أسماء البائع والمشتري</li>
              <li>معلومات الجهاز (النوع، الطراز، رقم IMEI)</li>
              <li>تاريخ الشراء</li>
              <li>صور بطاقة الهوية (اختياري)</li>
              <li>التوقيع الإلكتروني</li>
              <li>أرقام الهواتف (اختياري)</li>
              <li>عناوين البريد الإلكتروني (اختياري)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">استخدام المعلومات</h3>
            <p className="text-muted-foreground">
              نستخدم المعلومات المجمعة لتوفير خدمة توثيق المعاملات وإنشاء السجلات اللازمة للمراجعة المستقبلية.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حماية البيانات</h3>
            <p className="text-muted-foreground">
              نستخدم تقنيات التشفير المتقدمة لحماية بياناتك ولا نشاركها مع أطراف ثالثة دون موافقتك الصريحة.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حقوقك</h3>
            <p className="text-muted-foreground">
              لديك الحق في طلب الوصول إلى بياناتك ورؤيتها. <strong>تنبيه مهم:</strong> بعد تأكيد المعاملة، لا يمكن تعديل أو حذف البيانات المسجلة لأغراض الأمان ومنع التلاعب. هذا يحمي جميع الأطراف من الاحتيال ويضمن سلامة سجل المعاملات.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">الاتصال</h3>
            <p className="text-muted-foreground">
              للاستفسارات حول الخصوصية، يرجى التواصل معنا على: yahyamanouni@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
