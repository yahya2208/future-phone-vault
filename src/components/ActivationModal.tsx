
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Phone, MessageCircle, Key, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useActivation } from '@/hooks/useActivation';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  remainingTransactions: number;
}

const ActivationModal = ({ isOpen, onClose, remainingTransactions }: ActivationModalProps) => {
  const { language } = useLanguage();
  const { activateUser } = useActivation();
  const [activationCode, setActivationCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleActivation = async () => {
    if (!activationCode.trim()) return;
    
    setIsValidating(true);
    const success = await activateUser(activationCode.trim().toUpperCase());
    setIsValidating(false);
    
    if (success) {
      setActivationCode('');
      onClose();
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Format as XXXX-XXXX-XXXX-XXXX
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join('-') || value;
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    setActivationCode(value);
  };

  const supportNumber = "+213551148943";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md mx-auto"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-primary text-xl font-bold">
            <Shield className="text-amber-500" size={24} />
            تفعيل النسخة الكاملة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Message */}
          <Card className="border-amber-500/30 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 mt-1" size={20} />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-2">
                    انتهت فترة التجربة المجانية!
                  </p>
                  <p className="text-amber-700">
                    لقد استخدمت {3 - remainingTransactions} من أصل 3 معاملات مجانية.
                    للمتابعة، يجب تفعيل النسخة الكاملة.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activation Code Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Key size={18} />
              كود التفعيل (مدى الحياة)
            </div>
            <Input
              type="text"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              value={activationCode}
              onChange={handleCodeChange}
              className="quantum-input text-center text-lg tracking-wider font-mono"
              maxLength={19}
            />
            <Button
              onClick={handleActivation}
              disabled={activationCode.length < 19 || isValidating}
              className="neural-btn w-full"
            >
              {isValidating ? 'جاري التحقق...' : 'تفعيل النسخة الكاملة'}
            </Button>
          </div>

          {/* Support Section */}
          <Card className="holo-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-primary mb-3 text-center">
                أحصل على كود التفعيل
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="text-green-600" size={20} />
                    <span className="font-medium">اتصال مباشر</span>
                  </div>
                  <a 
                    href={`tel:${supportNumber}`}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    {supportNumber}
                  </a>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="text-green-600" size={20} />
                    <span className="font-medium">واتساب</span>
                  </div>
                  <a 
                    href={`https://wa.me/${supportNumber.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    إرسال رسالة
                  </a>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <div className="font-semibold mb-1">💎 مواصفات النسخة الكاملة:</div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>معاملات لا محدودة مدى الحياة</li>
                  <li>تأمين متقدم للبيانات</li>
                  <li>تصدير التقارير</li>
                  <li>دعم فني مجاني</li>
                  <li>تحديثات مستمرة</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivationModal;
