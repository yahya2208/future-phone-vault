
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Default warning messages in case translations are missing
const defaultWarningMessages = {
  en: {
    title: 'Important Notice',
    message: 'Please fill in all required fields marked with *'
  },
  ar: {
    title: 'تنبيه هام',
    message: 'يرجى ملء جميع الحقول المطلوبة والمشار إليها بعلامة *'
  }
};
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
import PhoneSelector from './PhoneSelector';

interface TransactionData {
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  rating?: number;
  transactionId?: string;
  customPhoneModel?: string;
}

interface TransactionFormProps {
  onTransactionSave: (data: TransactionData) => void;
  transactionsUsed?: number;
  maxTransactions?: number;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onTransactionSave 
}) => {
  const [formData, setFormData] = useState<TransactionData>({
    sellerName: '',
    buyerName: '',
    phoneModel: '',
    brand: '',
    imei: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    rating: 0,
    customPhoneModel: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateIMEI = (imei: string): boolean => {
    return /^\d{15}$/.test(imei);
  };

  const handleConfirmedSubmit = async () => {

    // Use custom model if provided, otherwise use selected model
    const finalPhoneModel = formData.customPhoneModel || formData.phoneModel;

    // Validation
    if (!formData.sellerName || !formData.buyerName || !finalPhoneModel || 
        !formData.brand || !formData.imei || !formData.purchaseDate) {
      toast({
        title: language === 'ar' ? "خطأ في التحقق" : "Validation Error",
        description: language === 'ar' ? "جميع الحقول مطلوبة" : "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (!validateIMEI(formData.imei)) {
      toast({
        title: language === 'ar' ? "رقم IMEI غير صحيح" : "Invalid IMEI",
        description: language === 'ar' ? "يجب أن يكون رقم IMEI مكوناً من 15 رقماً بالضبط" : "IMEI must be exactly 15 digits",
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
        phoneModel: finalPhoneModel,
        transactionId
      });
      
      toast({
        title: language === 'ar' ? "تم حفظ المعاملة" : "Transaction Saved",
        description: language === 'ar' ? "تم تسجيل معاملة الهاتف بنجاح - للتوثيق الشخصي فقط" : "Phone transaction recorded successfully - for personal documentation only",
      });

      // Reset form
      setFormData({
        sellerName: '',
        buyerName: '',
        phoneModel: '',
        brand: '',
        imei: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        rating: 0,
        customPhoneModel: ''
      });
      
    } catch (error) {
      console.error('Transaction submission error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ أثناء حفظ المعاملة" : "An error occurred while saving the transaction",
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

  const warningMessages = {
    ar: {
      title: "تنبيه",
      message: "هذا التطبيق للتوثيق الشخصي فقط وليس للاستخدام القانوني الرسمي. لا يُعتبر التوثيق هنا بديلاً عن التوثيق القانوني الرسمي."
    },
    en: {
      title: "Warning",
      message: "This application is for personal documentation only and not for official legal use. The documentation here is not a substitute for official legal documentation."
    }
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="holo-card">
        <CardHeader>
          <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl flex justify-between items-center">
            <span>{language === 'ar' ? 'بوابة المعاملات الجديدة' : 'New Transaction Portal'}</span>
            <Button 
              onClick={() => navigate('/transactions')}
              variant="outline"
              className="text-sm"
            >
              {language === 'ar' ? 'عرض المعاملات' : 'View Transactions'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>{
                  (warningMessages?.[language]?.title || 
                   defaultWarningMessages[language]?.title || 
                   defaultWarningMessages.en.title)
                  }:
                </strong>{
                  ' ' + (warningMessages?.[language]?.message || 
                        defaultWarningMessages[language]?.message || 
                        defaultWarningMessages.en.message)
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="seller" className="text-primary text-sm font-semibold">
                  {language === 'ar' ? 'اسم البائع' : 'Seller Name'} *
                </Label>
                <Input
                  id="seller"
                  className="quantum-input"
                  placeholder={language === 'ar' ? 'أدخل اسم البائع' : 'Enter seller name'}
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer" className="text-primary text-sm font-semibold">
                  {language === 'ar' ? 'اسم المشتري' : 'Buyer Name'} *
                </Label>
                <Input
                  id="buyer"
                  className="quantum-input"
                  placeholder={language === 'ar' ? 'أدخل اسم المشتري' : 'Enter buyer name'}
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange('buyerName', e.target.value)}
                />
              </div>
            </div>

            <PhoneSelector
              selectedBrand={formData.brand}
              selectedModel={formData.phoneModel}
              customModel={formData.customPhoneModel || ''}
              onBrandChange={(brand) => handleInputChange('brand', brand)}
              onModelChange={(model) => handleInputChange('phoneModel', model)}
              onCustomModelChange={(customModel) => handleInputChange('customPhoneModel', customModel)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="imei" className="text-primary text-sm font-semibold">
                  {language === 'ar' ? 'رقم IMEI' : 'IMEI Number'} *
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
                  {language === 'ar' ? 'تاريخ الشراء' : 'Purchase Date'} *
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
                  {language === 'ar' ? 'قيم تجربة المعاملة' : 'Rate Transaction Experience'}
                </Label>
                <StarRating 
                  rating={formData.rating || 0} 
                  onRatingChange={(rating) => handleInputChange('rating', rating)} 
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    className="neural-btn w-full md:w-auto" 
                    disabled={isSubmitting}
                  >
                    <span className="font-['Orbitron'] font-bold">
                      {isSubmitting ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') : (language === 'ar' ? 'معالجة المعاملة' : 'Process Transaction')}
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-primary">
                      {language === 'ar' ? 'تأكيد المعاملة' : 'Confirm Transaction'}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-foreground">
                      {language === 'ar' ? (
                        <>
                          تأكد من صحة جميع المعلومات المدخلة. لن تتمكن من تعديل هذه المعاملة بعد حفظها.
                          <br /><br />
                          <strong>تنبيه:</strong> هذا التوثيق للاستخدام الشخصي فقط وليس وثيقة قانونية رسمية.
                          <br />
                          هل أنت متأكد من المتابعة؟
                        </>
                      ) : (
                        <>
                          Confirm all entered information is correct. You won't be able to edit this transaction after saving.
                          <br /><br />
                          <strong>Warning:</strong> This documentation is for personal use only and not an official legal document.
                          <br />
                          Are you sure you want to continue?
                        </>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{language === 'ar' ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmedSubmit} disabled={isSubmitting}>
                      {isSubmitting ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') : (language === 'ar' ? 'تأكيد المعاملة' : 'Confirm Transaction')}
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
