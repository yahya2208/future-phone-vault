import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import CameraCapture from './CameraCapture';
import SignaturePad from './SignaturePad';

interface TransactionData {
  sellerName: string;
  sellerEmail?: string;
  buyerName: string;
  buyerEmail?: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  buyerIdPhoto?: string;
  signature?: string;
  rating?: number;
  transactionId?: string;
}

const TransactionForm = ({ onTransactionSave }: { onTransactionSave: (data: TransactionData) => void }) => {
  const [formData, setFormData] = useState<TransactionData>({
    sellerName: '',
    sellerEmail: '',
    buyerName: '',
    buyerEmail: '',
    phoneModel: '',
    brand: '',
    imei: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    rating: 0
  });

  const [sendEmails, setSendEmails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const phonebrands = [
    'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 
    'Sony', 'Nokia', 'Motorola', 'Oppo', 'Vivo', 'Realme'
  ];

  const handleInputChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateIMEI = (imei: string): boolean => {
    return /^\d{15}$/.test(imei);
  };

  const sendTransactionEmail = async (transactionId: string) => {
    console.log('Attempting to send transaction email...');
    
    // التحقق من وجود إيميل واحد على الأقل
    if (!formData.sellerEmail && !formData.buyerEmail) {
      console.log('No email addresses provided');
      return;
    }

    try {
      console.log('Calling email function with data:', {
        ...formData,
        transactionId
      });

      const { data, error } = await supabase.functions.invoke('send-transaction-email', {
        body: {
          ...formData,
          transactionId,
          sellerEmail: formData.sellerEmail || undefined,
          buyerEmail: formData.buyerEmail || undefined,
          rating: formData.rating || 0
        }
      });

      console.log('Email function response:', { data, error });

      if (error) {
        console.error('Error sending email:', error);
        toast({
          title: "تحذير",
          description: `تم حفظ المعاملة لكن حدث خطأ في إرسال الإيميلات: ${error.message}`,
          variant: "destructive"
        });
      } else if (data) {
        console.log('Email sent successfully:', data);
        if (data.success) {
          toast({
            title: "تم إرسال الإيميلات",
            description: `تم إرسال ${data.emailsSent} إيميل بنجاح`,
          });
        } else {
          toast({
            title: "خطأ في الإرسال",
            description: `فشل في إرسال ${data.emailsFailed} إيميل`,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      toast({
        title: "خطأ في الإرسال",
        description: "حدث خطأ أثناء إرسال الإيميلات",
        variant: "destructive"
      });
    }
  };

  const handleConfirmedSubmit = async () => {
    // Validation
    if (!formData.sellerName || !formData.buyerName || !formData.phoneModel || 
        !formData.brand || !formData.imei || !formData.purchaseDate) {
      toast({
        title: "خطأ في التحقق",
        description: "جميع الحقول مطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!validateIMEI(formData.imei)) {
      toast({
        title: "رقم IMEI غير صحيح",
        description: "يجب أن يكون رقم IMEI مكوناً من 15 رقماً بالضبط",
        variant: "destructive"
      });
      return;
    }

    if (!formData.signature) {
      toast({
        title: "التوقيع مطلوب",
        description: "يرجى إضافة توقيعك لإتمام المعاملة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // حفظ المعاملة أولاً
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('Saving transaction with ID:', transactionId);
      
      await onTransactionSave({
        ...formData,
        transactionId
      });
      
      // إرسال الإيميلات إذا كان مطلوباً
      if (sendEmails && (formData.sellerEmail || formData.buyerEmail)) {
        console.log('Sending emails...');
        await sendTransactionEmail(transactionId);
      } else {
        console.log('Email sending skipped - not requested or no emails provided');
      }

      toast({
        title: "تم حفظ المعاملة",
        description: sendEmails && (formData.sellerEmail || formData.buyerEmail) 
          ? "تم تسجيل المعاملة وسيتم إرسال الإيميلات" 
          : "تم تسجيل معاملة الهاتف بنجاح",
      });

      // Reset form
      setFormData({
        sellerName: '',
        sellerEmail: '',
        buyerName: '',
        buyerEmail: '',
        phoneModel: '',
        brand: '',
        imei: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        rating: 0
      });
      setSendEmails(false);
      
    } catch (error) {
      console.error('Transaction submission error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المعاملة",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdPhotoCapture = async (photo: string) => {
    handleInputChange('buyerIdPhoto', photo);
    
    try {
      const response = await supabase.functions.invoke('ocr-process', {
        body: { imageData: photo }
      });

      if (response.data && response.data.name && response.data.name.trim()) {
        handleInputChange('buyerName', response.data.name.trim());
        toast({
          title: "تم استخراج المعلومات",
          description: "تم ملء اسم المشتري تلقائياً من بطاقة الهوية",
        });
      }
    } catch (error) {
      console.error('خطأ في معالجة OCR:', error);
    }
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <div className="flex items-center space-x-1 space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="holo-card">
        <CardHeader>
          <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl flex justify-between items-center">
            <span>{t('newTransactionPortal')}</span>
            <Button 
              onClick={() => navigate('/transactions')}
              variant="outline"
              className="text-sm"
            >
              عرض المعاملات
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="seller" className="text-primary text-sm font-semibold">
                  {t('sellerName')} *
                </Label>
                <Input
                  id="seller"
                  className="quantum-input"
                  placeholder={`Enter ${t('sellerName').toLowerCase()}`}
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerEmail" className="text-primary text-sm font-semibold">
                  إيميل البائع (اختياري)
                </Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  className="quantum-input"
                  placeholder="seller@example.com"
                  value={formData.sellerEmail}
                  onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer" className="text-primary text-sm font-semibold">
                  {t('buyerName')} *
                </Label>
                <Input
                  id="buyer"
                  className="quantum-input"
                  placeholder={`Enter ${t('buyerName').toLowerCase()}`}
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange('buyerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerEmail" className="text-primary text-sm font-semibold">
                  إيميل المشتري (اختياري)
                </Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  className="quantum-input"
                  placeholder="buyer@example.com"
                  value={formData.buyerEmail}
                  onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-primary text-sm font-semibold">
                  {t('phoneBrand')} *
                </Label>
                <Select onValueChange={(value) => handleInputChange('brand', value)}>
                  <SelectTrigger className="quantum-input">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-primary/30">
                    {phonebrands.map((brand) => (
                      <SelectItem key={brand} value={brand} className="text-foreground hover:bg-primary/20">
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-primary text-sm font-semibold">
                  {t('phoneModel')} *
                </Label>
                <Input
                  id="model"
                  className="quantum-input"
                  placeholder="e.g., iPhone 15 Pro"
                  value={formData.phoneModel}
                  onChange={(e) => handleInputChange('phoneModel', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imei" className="text-primary text-sm font-semibold">
                  {t('imei')} *
                </Label>
                <Input
                  id="imei"
                  className="quantum-input"
                  placeholder="Enter 15-digit IMEI"
                  value={formData.imei}
                  onChange={(e) => handleInputChange('imei', e.target.value.replace(/\D/g, '').slice(0, 15))}
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-primary text-sm font-semibold">
                  {t('purchaseDate')} *
                </Label>
                <Input
                  id="date"
                  type="date"
                  className="quantum-input"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-primary text-sm font-semibold">
                  قيم تجربة المعاملة
                </Label>
                <StarRating 
                  rating={formData.rating || 0} 
                  onRatingChange={(rating) => handleInputChange('rating', rating)} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CameraCapture
                title={t('buyerIdPhoto')}
                onPhotoCapture={handleIdPhotoCapture}
              />
              
              <SignaturePad
                onSignatureCapture={(signature) => handleInputChange('signature', signature)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="sendEmails"
                  checked={sendEmails}
                  onCheckedChange={(checked) => setSendEmails(checked === true)}
                />
                <Label htmlFor="sendEmails" className="text-sm">
                  إرسال إيصال المعاملة عبر الإيميل (اختياري)
                </Label>
              </div>
              
              {sendEmails && !formData.sellerEmail && !formData.buyerEmail && (
                <p className="text-yellow-600 text-sm">
                  يرجى إدخال إيميل البائع أو المشتري لإرسال الإيصال
                </p>
              )}
            </div>

            <div className="flex justify-center pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="neural-btn w-full md:w-auto" 
                    disabled={isSubmitting}
                  >
                    <span className="font-['Orbitron'] font-bold">
                      {isSubmitting ? 'جاري المعالجة...' : t('processTransaction')}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary">تأكيد المعاملة</AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground">
                      تأكد من صحة جميع المعلومات المدخلة. لن تتمكن من تعديل هذه المعاملة بعد حفظها.
                      هل أنت متأكد من المتابعة؟
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmedSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'جاري المعالجة...' : 'تأكيد المعاملة'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
