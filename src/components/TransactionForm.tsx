
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
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
import SimpleDrawingPad from './SimpleDrawingPad';

interface TransactionData {
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  simpleDrawing?: string;
  rating?: number;
  transactionId?: string;
}

const TransactionForm = ({ onTransactionSave }: { onTransactionSave: (data: TransactionData) => void }) => {
  const [formData, setFormData] = useState<TransactionData>({
    sellerName: '',
    buyerName: '',
    phoneModel: '',
    brand: '',
    imei: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    rating: 0
  });

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

    setIsSubmitting(true);

    try {
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('Saving transaction with ID:', transactionId);
      
      await onTransactionSave({
        ...formData,
        transactionId
      });
      
      toast({
        title: "تم حفظ المعاملة",
        description: "تم تسجيل معاملة الهاتف بنجاح - للتوثيق الشخصي فقط",
      });

      // Reset form
      setFormData({
        sellerName: '',
        buyerName: '',
        phoneModel: '',
        brand: '',
        imei: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        rating: 0
      });
      
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
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>تنبيه:</strong> هذا التطبيق للتوثيق الشخصي فقط وليس للاستخدام القانوني الرسمي. 
                لا يُعتبر التوثيق هنا بديلاً عن التوثيق القانوني الرسمي.
              </p>
            </div>

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

            <SimpleDrawingPad
              onDrawingCapture={(drawing) => handleInputChange('simpleDrawing', drawing)}
            />

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
                      <br /><br />
                      <strong>تنبيه:</strong> هذا التوثيق للاستخدام الشخصي فقط وليس وثيقة قانونية رسمية.
                      <br />
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
