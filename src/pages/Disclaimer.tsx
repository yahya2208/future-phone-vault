
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
            إخلاء المسؤولية القانونية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">طبيعة الخدمة</h3>
            <p className="text-muted-foreground">
              هذا التطبيق هو أداة توثيق شخصية فقط. نحن لا نقوم بأي من الأنشطة التالية:
              <br/>• الوساطة المالية أو التجارية
              <br/>• تقديم الاستشارات القانونية
              <br/>• ضمان صحة المعاملات التجارية
              <br/>• التدخل في النزاعات بين الأطراف
              <br/>• تقديم خدمات مصرفية أو مالية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">إخلاء المسؤولية عن المحتوى</h3>
            <p className="text-muted-foreground">
              نحن لا نتحمل أي مسؤولية عن:
              <br/>• دقة المعلومات المدخلة من قبل المستخدمين
              <br/>• صحة الهويات أو الوثائق المرفوعة
              <br/>• صحة أرقام IMEI أو معلومات الأجهزة
              <br/>• التوقيعات الإلكترونية المرفقة
              <br/>• أي معلومات خاطئة أو مضللة يدخلها المستخدمون
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">إخلاء المسؤولية عن المعاملات</h3>
            <p className="text-muted-foreground">
              <strong>تنبيه مهم:</strong> هذا التطبيق لا يضمن:
              <br/>• صحة المعاملات التجارية
              <br/>• جودة السلع المباعة أو المشتراة
              <br/>• الوضع القانوني للأجهزة (مسروقة أم لا)
              <br/>• هوية الأطراف المتعاملة
              <br/>• الالتزام بالدفع أو التسليم
              <br/>• حل النزاعات التجارية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">إخلاء المسؤولية التقنية</h3>
            <p className="text-muted-foreground">
              نحن لا نضمن:
              <br/>• عمل التطبيق بدون انقطاع
              <br/>• خلوه من الأخطاء التقنية
              <br/>• الحفاظ على البيانات من التلف (رغم جهودنا)
              <br/>• توافق التطبيق مع جميع الأجهزة
              <br/>• استمرار الخدمة إلى أجل غير مسمى
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حدود المسؤولية المالية</h3>
            <p className="text-muted-foreground">
              في جميع الأحوال، تقتصر مسؤوليتنا على:
              <br/>• استرداد رسوم الاشتراك المدفوعة (إن وجدت)
              <br/>• لا نتحمل أي أضرار غير مباشرة
              <br/>• لا نتحمل أضرار فقدان الأرباح
              <br/>• الحد الأقصى للمسؤولية هو قيمة الاشتراك السنوي
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">مسؤولية المستخدم</h3>
            <p className="text-muted-foreground">
              المستخدم مسؤول بالكامل عن:
              <br/>• التحقق من صحة المعلومات قبل إدخالها
              <br/>• الحصول على موافقة الأطراف الأخرى
              <br/>• التأكد من قانونية المعاملة
              <br/>• حماية معلوماته الشخصية
              <br/>• استخدام التطبيق بشكل قانوني
              <br/>• التعامل مع النزاعات بشكل مستقل
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">القيود الجغرافية</h3>
            <p className="text-muted-foreground">
              • التطبيق مصمم للاستخدام في الجزائر بالدرجة الأولى
              <br/>• قد لا يتوافق مع قوانين بلدان أخرى
              <br/>• المستخدم مسؤول عن الامتثال للقوانين المحلية
              <br/>• نحن لا نقدم ضمانات للاستخدام خارج الجزائر
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">التنصل من الضمانات</h3>
            <p className="text-muted-foreground">
              نقدم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية بشأن:
              <br/>• دقة المعلومات
              <br/>• استمرارية الخدمة
              <br/>• الخلو من الأخطاء
              <br/>• الملاءمة لغرض معين
              <br/>• عدم انتهاك حقوق الغير
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">تحديث إخلاء المسؤولية</h3>
            <p className="text-muted-foreground">
              • يحق لنا تحديث هذا الإخلاء في أي وقت
              <br/>• التحديثات تُنشر على الموقع فور إقرارها
              <br/>• المستخدم مسؤول عن مراجعة التحديثات
              <br/>• الاستمرار في الاستخدام يعني قبول التحديثات
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">القانون المطبق</h3>
            <p className="text-muted-foreground">
              • يخضع هذا الإخلاء للقانون الجزائري
              <br/>• المحاكم الجزائرية مختصة بالنظر في أي نزاع
              <br/>• اللغة العربية هي لغة التفسير الرسمية
              <br/>• يُفسر الإخلاء لصالح المستخدم في حالة الغموض
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              تنبيه هام
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              باستخدام هذا التطبيق، فإنك تقر بأنك قد قرأت وفهمت وقبلت جميع بنود إخلاء المسؤولية هذا. 
              إذا كنت لا توافق على أي من هذه البنود، فلا تستخدم التطبيق.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Disclaimer;
