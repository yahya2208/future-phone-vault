
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          شروط الاستخدام
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
            قواعد استخدام غزة سايفر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">قبول الشروط</h3>
            <p className="text-muted-foreground">
              باستخدام تطبيق غزة سايفر، فإنك توافق على الالتزام بهذه الشروط والأحكام.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">استخدام الخدمة</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>يُستخدم التطبيق لتوثيق معاملات بيع وشراء الهواتف المحمولة</li>
              <li>يجب تقديم معلومات صحيحة ودقيقة</li>
              <li>لا يُسمح باستخدام التطبيق لأغراض غير قانونية</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">مسؤولية المستخدم</h3>
            <p className="text-muted-foreground">
              المستخدم مسؤول عن دقة المعلومات المُدخلة والتأكد من صحة بيانات المعاملة قبل الحفظ.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حدود المسؤولية</h3>
            <p className="text-muted-foreground">
              التطبيق يوفر خدمة توثيق فقط ولا يتحمل مسؤولية النزاعات التجارية بين الأطراف.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
