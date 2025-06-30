
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
            تطبيق توثيق المعاملات - متوافق مع القانون الجزائري والدولي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">طبيعة الخدمة</h3>
            <p className="text-muted-foreground">
              هذا التطبيق عبارة عن أداة توثيق شخصية للمعاملات التجارية بين الأفراد. 
              لا يقوم التطبيق بأي نشاط تجاري مالي أو وساطة، وإنما يوفر خدمة توثيق فقط.
              هذه الخدمة لا تتطلب تراخيص مالية أو تجارية وفقاً للقانون الجزائري والدولي.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">البيانات المجمعة</h3>
            <p className="text-muted-foreground mb-2">
              يجمع التطبيق البيانات التالية لأغراض التوثيق الشخصي فقط:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>أسماء البائع والمشتري (كما يدخلها المستخدم)</li>
              <li>معلومات الجهاز (النوع، الطراز، رقم IMEI)</li>
              <li>تاريخ المعاملة</li>
              <li>صور بطاقة الهوية (اختياري - للتوثيق الشخصي)</li>
              <li>التوقيع الإلكتروني (للتوثيق)</li>
              <li>بيانات الاتصال (اختياري)</li>
              <li>تقييم المعاملة</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">الغرض من جمع البيانات</h3>
            <p className="text-muted-foreground">
              <strong>الغرض الوحيد</strong> من جمع هذه البيانات هو توفير خدمة توثيق شخصية للمستخدم 
              لمساعدته في تتبع معاملاته الشخصية وحفظ سجلاته الخاصة. 
              لا يتم استخدام هذه البيانات لأي غرض تجاري أو تسويقي.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حقوق المستخدم في الوصول للبيانات</h3>
            <p className="text-muted-foreground mb-2">
              <strong>نضمن للمستخدم الحقوق التالية:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>الوصول الكامل:</strong> يمكن للمستخدم الوصول لجميع بياناته ومعاملاته في أي وقت</li>
              <li><strong>المراجعة:</strong> يمكن مراجعة تفاصيل أي معاملة سابقة بالكامل</li>
              <li><strong>التصدير:</strong> يمكن تصدير جميع البيانات بصيغة CSV أو JSON</li>
              <li><strong>الطباعة:</strong> يمكن طباعة تفاصيل أي معاملة</li>
              <li><strong>البحث:</strong> يمكن البحث في المعاملات حسب التاريخ أو الاسم أو نوع الجهاز</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">أمان البيانات</h3>
            <p className="text-muted-foreground">
              <strong>الحماية الفنية:</strong> نستخدم تشفير SSL/TLS لحماية البيانات أثناء النقل، 
              وتشفير قاعدة البيانات لحماية البيانات المخزنة.
              <br/><br/>
              <strong>الحماية القانونية:</strong> البيانات مخزنة بشكل آمن ولا يتم مشاركتها مع أطراف ثالثة.
              المستخدم هو المالك الوحيد لبياناته.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">عدم المشاركة مع الغير</h3>
            <p className="text-muted-foreground">
              <strong>نتعهد بعدم مشاركة أي بيانات مع:</strong>
              <br/>• الشركات التجارية أو الإعلانية
              <br/>• الوسطاء أو المنصات الأخرى  
              <br/>• أي طرف ثالث بدون موافقة صريحة من المستخدم
              <br/>• السلطات إلا بأمر قضائي وفقاً للقانون
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">الامتثال القانوني</h3>
            <p className="text-muted-foreground">
              هذا التطبيق متوافق مع:
              <br/>• القانون الجزائري لحماية البيانات الشخصية
              <br/>• اللائحة الأوروبية العامة لحماية البيانات (GDPR)
              <br/>• القوانين الدولية لحماية الخصوصية
              <br/>• لا يحتاج لتراخيص مالية لأنه لا يقوم بأنشطة مالية
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">حفظ السجلات</h3>
            <p className="text-muted-foreground">
              <strong>مهم:</strong> بعد تأكيد المعاملة، يتم حفظ السجل بشكل دائم لضمان:
              <br/>• سلامة التوثيق
              <br/>• منع التلاعب في السجلات
              <br/>• حماية حقوق جميع الأطراف
              <br/>• توفير مرجع قانوني في حالة النزاعات
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">التواصل</h3>
            <p className="text-muted-foreground">
              للاستفسارات أو طلب الوصول لبياناتك:
              <br/>البريد الإلكتروني: yahyamanouni@gmail.com
              <br/>الهاتف: +213551148943
              <br/>سنرد خلال 48 ساعة كحد أقصى
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
