
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.sellerName || !formData.buyerName || !formData.phoneModel || 
        !formData.brand || !formData.imei || !formData.purchaseDate) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    if (!validateIMEI(formData.imei)) {
      toast({
        title: "Invalid IMEI",
        description: "IMEI must be exactly 15 digits",
        variant: "destructive"
      });
      return;
    }

    onTransactionSave(formData);
    
    toast({
      title: "Transaction Saved",
      description: "Phone transaction recorded successfully",
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

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="holo-card">
        <CardHeader>
          <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
            {t('newTransactionPortal')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-center pt-6">
              <Button type="submit" className="neural-btn w-full md:w-auto">
                <span className="font-['Orbitron'] font-bold">{t('processTransaction')}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Camera and Signature Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CameraCapture
          title={t('buyerIdPhoto')}
          onPhotoCapture={(photo) => handleInputChange('buyerIdPhoto', photo)}
        />
        
        <SignaturePad
          onSignatureCapture={(signature) => handleInputChange('signature', signature)}
        />
      </div>
    </div>
  );
};

export default TransactionForm;
