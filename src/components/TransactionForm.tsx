
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { validateTransactionDate, getTodayDate, getMaxFutureDate } from '@/utils/dateValidation';
import { Calendar, AlertCircle } from 'lucide-react';

interface TransactionFormData {
  seller_name: string;
  seller_phone: string;
  seller_email: string;
  buyer_name: string;
  buyer_email: string;
  brand: string;
  phone_model: string;
  imei: string;
  purchase_date: string;
  rating: number;
}

interface TransactionFormProps {
  onTransactionSave: (formData: TransactionFormData) => Promise<void>;
  isLimitReached: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionSave, isLimitReached }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState<string>('');
  
  const [formData, setFormData] = useState<TransactionFormData>({
    seller_name: '',
    seller_phone: '',
    seller_email: '',
    buyer_name: '',
    buyer_email: '',
    brand: '',
    phone_model: '',
    imei: '',
    purchase_date: getTodayDate(),
    rating: 0
  });

  const handleDateChange = (date: string) => {
    const dateValidation = validateTransactionDate(new Date(date));
    
    if (!dateValidation.isValid) {
      setDateError(dateValidation.error || 'تاريخ غير صحيح');
      return;
    }
    
    setDateError('');
    setFormData(prev => ({ ...prev, purchase_date: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
      return;
    }

    if (isLimitReached) {
      toast.error(language === 'ar' ? 'تم الوصول إلى الحد الأقصى للمعاملات' : 'Transaction limit reached');
      return;
    }

    // Final date validation before submission
    const dateValidation = validateTransactionDate(new Date(formData.purchase_date));
    if (!dateValidation.isValid) {
      toast.error(dateValidation.error || 'تاريخ غير صحيح');
      return;
    }

    setLoading(true);
    
    try {
      await onTransactionSave(formData);
      
      toast.success(language === 'ar' ? 'تم إنشاء المعاملة بنجاح' : 'Transaction created successfully');
      
      // Reset form
      setFormData({
        seller_name: '',
        seller_phone: '',
        seller_email: '',
        buyer_name: '',
        buyer_email: '',
        brand: '',
        phone_model: '',
        imei: '',
        purchase_date: getTodayDate(),
        rating: 0
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(language === 'ar' ? 'خطأ في إنشاء المعاملة' : 'Error creating transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {language === 'ar' ? 'إنشاء معاملة جديدة' : 'Create New Transaction'}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'أدخل تفاصيل المعاملة بدقة' 
            : 'Enter transaction details accurately'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLimitReached && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'ar' 
                  ? 'تم الوصول إلى الحد الأقصى للمعاملات' 
                  : 'Transaction limit reached'}
              </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seller Information */}
          <div className="space-y-2">
            <Label htmlFor="seller_name">
              {language === 'ar' ? 'اسم البائع' : 'Seller Name'}
            </Label>
            <Input
              id="seller_name"
              value={formData.seller_name}
              onChange={(e) => handleInputChange('seller_name', e.target.value)}
              required
              disabled={isLimitReached}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_phone">
              {language === 'ar' ? 'رقم هاتف البائع' : 'Seller Phone'}
            </Label>
            <Input
              id="seller_phone"
              type="tel"
              value={formData.seller_phone}
              onChange={(e) => handleInputChange('seller_phone', e.target.value)}
              disabled={isLimitReached}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seller_email">
              {language === 'ar' ? 'بريد البائع الإلكتروني' : 'Seller Email'}
            </Label>
            <Input
              id="seller_email"
              type="email"
              value={formData.seller_email}
              onChange={(e) => handleInputChange('seller_email', e.target.value)}
              disabled={isLimitReached}
            />
          </div>

          {/* Buyer Information */}
          <div className="space-y-2">
            <Label htmlFor="buyer_name">
              {language === 'ar' ? 'اسم المشتري' : 'Buyer Name'}
            </Label>
            <Input
              id="buyer_name"
              value={formData.buyer_name}
              onChange={(e) => handleInputChange('buyer_name', e.target.value)}
              required
              disabled={isLimitReached}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyer_email">
              {language === 'ar' ? 'بريد المشتري الإلكتروني' : 'Buyer Email'}
            </Label>
            <Input
              id="buyer_email"
              type="email"
              value={formData.buyer_email}
              onChange={(e) => handleInputChange('buyer_email', e.target.value)}
              disabled={isLimitReached}
            />
          </div>

          {/* Phone Information */}
          <div className="space-y-2">
            <Label htmlFor="brand">
              {language === 'ar' ? 'الماركة' : 'Brand'}
            </Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              required
              disabled={isLimitReached}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_model">
              {language === 'ar' ? 'موديل الهاتف' : 'Phone Model'}
            </Label>
            <Input
              id="phone_model"
              value={formData.phone_model}
              onChange={(e) => handleInputChange('phone_model', e.target.value)}
              required
              disabled={isLimitReached}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imei">
              {language === 'ar' ? 'رقم IMEI' : 'IMEI Number'}
            </Label>
            <Input
              id="imei"
              value={formData.imei}
              onChange={(e) => handleInputChange('imei', e.target.value)}
              required
              disabled={isLimitReached}
            />
          </div>

          {/* Purchase Date with Validation */}
          <div className="space-y-2">
            <Label htmlFor="purchase_date">
              {language === 'ar' ? 'تاريخ الشراء' : 'Purchase Date'}
            </Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={getTodayDate()}
              max={getMaxFutureDate()}
              required
              className={dateError ? 'border-red-500' : ''}
              disabled={isLimitReached}
            />
            {dateError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {dateError}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'يمكن اختيار التاريخ الحالي أو المستقبلي فقط' 
                : 'Only current or future dates are allowed'}
            </p>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">
              {language === 'ar' ? 'التقييم (1-5)' : 'Rating (1-5)'}
            </Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
              disabled={isLimitReached}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || !!dateError || isLimitReached}
            className="w-full"
          >
            {loading 
              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
              : (language === 'ar' ? 'إنشاء المعاملة' : 'Create Transaction')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
