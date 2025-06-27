
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useActivation } from '@/hooks/useActivation';
import { Plus, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransactionFormProps {
  onTransactionSave: (formData: any) => Promise<void>;
  disabled?: boolean;
}

const TransactionForm = ({ onTransactionSave, disabled = false }: TransactionFormProps) => {
  const { language, t } = useLanguage();
  const { userActivation } = useActivation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    buyerName: '',
    buyerEmail: '',
    phoneModel: '',
    brand: '',
    imei: '',
    purchaseDate: '',
    rating: 5
  });

  const phoneModels = [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max',
    'Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24+', 'Samsung Galaxy S24',
    'Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'OnePlus 12', 'Google Pixel 8 Pro'
  ];

  const brands = ['Apple', 'Samsung', 'Xiaomi', 'OnePlus', 'Google', 'Huawei', 'Oppo', 'Vivo'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) {
      toast({
        title: "يجب تفعيل النسخة الكاملة",
        description: "انتهت فترة التجربة المجانية. يرجى تفعيل النسخة الكاملة للمتابعة",
        variant: "destructive"
      });
      return;
    }

    if (!formData.sellerName || !formData.buyerName || !formData.phoneModel || !formData.brand || !formData.imei) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransactionSave(formData);
      
      // Reset form
      setFormData({
        sellerName: '',
        sellerEmail: '',
        sellerPhone: '',
        buyerName: '',
        buyerEmail: '',
        phoneModel: '',
        brand: '',
        imei: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        rating: 5
      });

      toast({
        title: "تم حفظ المعاملة بنجاح! ✅",
        description: "تم توثيق المعاملة وحفظها في النظام الآمن",
      });

    } catch (error) {
      console.error('Error saving transaction:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المعاملة. يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="holo-card">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] flex items-center gap-3">
          {disabled ? (
            <>
              <Lock className="text-amber-500" size={24} />
              <span className="text-amber-600">معاملة جديدة (يتطلب تفعيل)</span>
            </>
          ) : (
            <>
              <Plus size={24} />
              معاملة جديدة
            </>
          )}
        </CardTitle>
        
        {!userActivation?.isActivated && (
          <div className="text-sm text-muted-foreground">
            المعاملات المتاحة: {userActivation ? userActivation.maxTrialTransactions - userActivation.trialTransactionsUsed : 0} من أصل {userActivation?.maxTrialTransactions || 3}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seller Information */}
            <div className="space-y-4">
              <h3 className="text-primary font-semibold border-b border-primary/20 pb-2">
                بيانات البائع
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  اسم البائع *
                </label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                  className="quantum-input w-full"
                  placeholder="أدخل اسم البائع"
                  required
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                  className="quantum-input w-full"
                  placeholder="seller@example.com"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.sellerPhone}
                  onChange={(e) => handleInputChange('sellerPhone', e.target.value)}
                  className="quantum-input w-full"
                  placeholder="+213xxxxxxxxx"
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Buyer Information */}
            <div className="space-y-4">
              <h3 className="text-primary font-semibold border-b border-primary/20 pb-2">
                بيانات المشتري
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  اسم المشتري *
                </label>
                <input
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange('buyerName', e.target.value)}
                  className="quantum-input w-full"
                  placeholder="أدخل اسم المشتري"
                  required
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                  className="quantum-input w-full"
                  placeholder="buyer@example.com"
                  disabled={disabled}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  تاريخ الشراء
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="quantum-input w-full"
                  disabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold border-b border-primary/20 pb-2">
              بيانات الجهاز
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  العلامة التجارية *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="quantum-input w-full"
                  required
                  disabled={disabled}
                >
                  <option value="">اختر العلامة التجارية</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  طراز الجهاز *
                </label>
                <select
                  value={formData.phoneModel}
                  onChange={(e) => handleInputChange('phoneModel', e.target.value)}
                  className="quantum-input w-full"
                  required
                  disabled={disabled}
                >
                  <option value="">اختر طراز الجهاز</option>
                  {phoneModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                رقم IMEI *
              </label>
              <input
                type="text"
                value={formData.imei}
                onChange={(e) => handleInputChange('imei', e.target.value)}
                className="quantum-input w-full"
                placeholder="أدخل رقم IMEI (15 رقم)"
                maxLength={15}
                required
                disabled={disabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                تقييم المعاملة
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange('rating', star)}
                    className={`text-2xl transition-colors ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    disabled={disabled}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || disabled}
            className={`neural-btn w-full ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {disabled ? (
              <>
                <Lock size={16} className="mr-2" />
                يتطلب تفعيل النسخة الكاملة
              </>
            ) : isSubmitting ? (
              'جاري الحفظ...'
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                حفظ المعاملة
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
