
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Mail, MessageCircle } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          المساعدة والدعم
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="holo-card">
          <CardHeader>
            <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
              الأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-primary mb-2">كيف أضيف معاملة جديدة؟</h3>
              <p className="text-muted-foreground text-sm">
                املأ جميع الحقول المطلوبة في النموذج، أضف التوقيع وصورة بطاقة الهوية، ثم اضغط "معالجة المعاملة".
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">هل يمكنني تعديل المعاملة بعد حفظها؟</h3>
              <p className="text-muted-foreground text-sm">
                لا، لضمان الأمان لا يمكن تعديل المعاملات بعد حفظها. تأكد من دقة المعلومات قبل الحفظ.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">كيف تعمل خاصية OCR؟</h3>
              <p className="text-muted-foreground text-sm">
                التقط صورة واضحة لبطاقة الهوية وسيتم استخراج الاسم تلقائياً باستخدام الذكاء الاصطناعي.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-primary mb-2">هل البيانات آمنة؟</h3>
              <p className="text-muted-foreground text-sm">
                نعم، جميع البيانات محمية بتقنيات التشفير المتقدمة ولا نشاركها مع أطراف خارجية.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="holo-card">
          <CardHeader>
            <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
              تواصل معنا
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
              <Phone className="text-primary" size={20} />
              <div>
                <p className="font-semibold">هاتف</p>
                <p className="text-muted-foreground text-sm">+213551148943</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
              <Mail className="text-primary" size={20} />
              <div>
                <p className="font-semibold">البريد الإلكتروني</p>
                <p className="text-muted-foreground text-sm">yahyamanouni@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
              <MessageCircle className="text-primary" size={20} />
              <div>
                <p className="font-semibold">الدعم الفني</p>
                <p className="text-muted-foreground text-sm">متوفر 24/7</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">نصائح للاستخدام الأمثل</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• تأكد من وضوح صور بطاقات الهوية</li>
                <li>• احرص على دقة رقم IMEI</li>
                <li>• استخدم التوقيع بوضوح</li>
                <li>• احتفظ بنسخة من كل معاملة</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
