
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
import CameraCapture from './CameraCapture';
import SignaturePad from './SignaturePad';

interface TransactionData {
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  buyerIdPhoto?: string;
  signature?: string;
}

const TransactionForm = ({ onTransactionSave }: { onTransactionSave: (data: TransactionData) => void }) => {
  const [formData, setFormData] = useState<TransactionData>({
    sellerName: '',
    buyerName: '',
    phoneModel: '',
    brand: '',
    imei: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const phonebrands = [
    'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 
    'Sony', 'Nokia', 'Motorola', 'Oppo', 'Vivo', 'Realme'
  ];

  const handleInputChange = (field: keyof TransactionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateIMEI = (imei: string): boolean => {
    return /^\d{15}$/.test(imei);
  };

  const handleConfirmedSubmit = () => {
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

    onTransactionSave(formData);
    
    toast({
      title: "تم حفظ المعاملة",
      description: "تم تسجيل معاملة الهاتف بنجاح",
    });

    // Reset form
    setFormData({
      sellerName: '',
      buyerName: '',
      phoneModel: '',
      brand: '',
      imei: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleIdPhotoCapture = async (photo: string) => {
    handleInputChange('buyerIdPhoto', photo);
    
    // إجراء OCR على الصورة
    try {
      const response = await fetch('/api/ocr-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData: photo }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.name && result.name.trim()) {
          handleInputChange('buyerName', result.name.trim());
          toast({
            title: "تم استخراج المعلومات",
            description: "تم ملء اسم المشتري تلقائياً من بطاقة الهوية",
          });
        }
      }
    } catch (error) {
      console.error('خطأ في معالجة OCR:', error);
    }
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
                  {t('sellerName')}
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
                  {t('buyerName')}
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
                  {t('phoneBrand')}
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
                  {t('phoneModel')}
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
                  {t('imei')}
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
                  {t('purchaseDate')}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CameraCapture
                title={t('buyerIdPhoto')}
                onPhotoCapture={handleIdPhotoCapture}
              />
              
              <SignaturePad
                onSignatureCapture={(signature) => handleInputChange('signature', signature)}
              />
            </div>

            <div className="flex justify-center pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="neural-btn w-full md:w-auto">
                    <span className="font-['Orbitron'] font-bold">{t('processTransaction')}</span>
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
                    <AlertDialogAction onClick={handleConfirmedSubmit}>
                      تأكيد المعاملة
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
