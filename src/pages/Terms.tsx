
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
            شروط استخدام تطبيق توثيق المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">طبيعة الخدمة</h3>
            <p className="text-muted-foreground">
              هذا التطبيق هو أداة توثيق شخصية للمعاملات التجارية بين الأفراد. 
              لا نقوم بأي نشاط تجاري أو وساطة مالية، وإنما نوفر خدمة توثيق فقط.
              الخدمة مجانية في النسخة التجريبية ومدفوعة للاستخدام الكامل.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">قبول الشروط</h3>
            <p className="text-muted-foreground">
              باستخدام هذا التطبيق، فإنك توافق على:
              <br/>• استخدام التطبيق لأغراض التوثيق الشخصي فقط
              <br/>• عدم استخدامه لأنشطة غير قانونية
              <br/>• تقديم معلومات صحيحة ودقيقة
              <br/>• احترام حقوق الآخرين
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">استخدام التطبيق</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>التطبيق مخصص لتوثيق معاملات بيع وشراء الهواتف المحمولة</li>
              <li>يمكن استخدامه لتوثيق أي معاملة تجارية أخرى بين الأفراد</li>
              <li>يجب تقديم معلومات صحيحة وكاملة</li>
              <li>المستخدم مسؤول عن دقة المعلومات المدخلة</li>
              <li>لا يُسمح باستخدام التطبيق لأغراض احتيالية أو غير قانونية</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حقوق المستخدم</h3>
            <p className="text-muted-foreground">
              <strong>نضمن لك الحقوق التالية:</strong>
              <br/>• الوصول الكامل لجميع بياناتك في أي وقت
              <br/>• تصدير جميع معاملاتك بصيغة CSV أو JSON
              <br/>• طباعة تفاصيل أي معاملة
              <br/>• البحث في سجلاتك بأي معيار
              <br/>• مشاهدة جميع التفاصيل بما في ذلك الصور والتوقيع
              <br/>• إيقاف الخدمة في أي وقت
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">مسؤولية المستخدم</h3>
            <p className="text-muted-foreground">
              المستخدم مسؤول عن:
              <br/>• التأكد من دقة المعلومات المدخلة
              <br/>• الحصول على موافقة الأطراف الأخرى قبل تسجيل معلوماتهم
              <br/>• التحقق من صحة هوية الأطراف الأخرى
              <br/>• استخدام المعلومات المسجلة بشكل قانوني ومسؤول
              <br/>• عدم مشاركة معلومات الآخرين بدون إذن
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حدود المسؤولية</h3>
            <p className="text-muted-foreground">
              <strong>نحن لا نتحمل المسؤولية عن:</strong>
              <br/>• النزاعات التجارية بين الأطراف
              <br/>• صحة المعلومات المدخلة من قبل المستخدمين
              <br/>• استخدام المعلومات بشكل غير قانوني
              <br/>• الأضرار الناتجة عن سوء استخدام التطبيق
              <br/>• فقدان البيانات بسبب أخطاء المستخدم
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">الامتثال القانوني</h3>
            <p className="text-muted-foreground">
              هذا التطبيق:
              <br/>• متوافق مع القانون الجزائري
              <br/>• يلتزم بالمعايير الدولية لحماية البيانات
              <br/>• لا يحتاج لتراخيص مالية (لا يقوم بأنشطة مالية)
              <br/>• يحترم حقوق الملكية الفكرية
              <br/>• يلتزم بقوانين حماية الخصوصية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">سياسة الأسعار</h3>
            <p className="text-muted-foreground">
              • النسخة التجريبية: مجانية لعدد محدود من المعاملات
              <br/>• النسخة المدفوعة: اشتراك يُحدد سعره حسب السوق المحلي
              <br/>• الأسعار قابلة للتغيير مع إشعار مسبق
              <br/>• لا توجد رسوم خفية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">التحديثات والتعديلات</h3>
            <p className="text-muted-foreground">
              • يحق لنا تحديث الشروط مع إشعار مسبق
              <br/>• التحديثات تهدف لتحسين الخدمة
              <br/>• المستخدم مسؤول عن مراجعة الشروط المحدثة
              <br/>• الاستمرار في الاستخدام يعني قبول الشروط الجديدة
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">القانون المطبق</h3>
            <p className="text-muted-foreground">
              • تخضع هذه الشروط للقانون الجزائري
              <br/>• المحاكم الجزائرية مختصة بالنظر في النزاعات
              <br/>• يتم حل النزاعات بالطرق الودية أولاً
              <br/>• اللغة العربية هي لغة التفسير الرسمية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">التواصل</h3>
            <p className="text-muted-foreground">
              للاستفسارات أو الشكاوى:
              <br/>البريد الإلكتروني: yahyamanouni@gmail.com
              <br/>الهاتف: +213551148943
              <br/>سنرد خلال 48 ساعة عمل كحد أقصى
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
