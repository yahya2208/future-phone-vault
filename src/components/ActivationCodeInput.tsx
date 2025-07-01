
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const ActivationCodeInput = () => {
  const [activationCode, setActivationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  const handleActivateCode = async () => {
    if (!user) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يجب تسجيل الدخول أولاً" : "You must log in first",
        variant: "destructive"
      });
      return;
    }

    if (!activationCode.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال كود التفعيل" : "Please enter activation code",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // البحث عن الكود في قاعدة البيانات
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code', activationCode.trim())
        .eq('is_used', false)
        .single();

      if (codeError || !codeData) {
        toast({
          title: language === 'ar' ? "فشل التفعيل" : "Activation Failed",
          description: language === 'ar' ? "كود غير صحيح أو منتهي الصلاحية" : "Invalid or expired code",
          variant: "destructive"
        });
        return;
      }

      // تحديث الكود كمستخدم
      const { error: updateError } = await supabase
        .from('activation_codes')
        .update({
          is_used: true,
          used_by_email: user.email,
          used_at: new Date().toISOString()
        })
        .eq('id', codeData.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "حدث خطأ أثناء التفعيل" : "An error occurred during activation",
          variant: "destructive"
        });
        return;
      }

      // تحديث ملف المستخدم
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + (codeData.subscription_duration_months || 12));

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          subscription_status: 'active',
          subscription_expires_at: expiresAt.toISOString(),
          max_trial_transactions: 999999,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      toast({
        title: language === 'ar' ? "نجح التفعيل!" : "Activation Successful!",
        description: language === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Your account has been activated successfully!"
      });
      
      setActivationCode('');
      // إعادة تحميل الصفحة لتحديث حالة الاشتراك
      window.location.reload();

    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary">
          {language === 'ar' ? 'تفعيل الحساب' : 'Account Activation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="activation-code">
            {language === 'ar' ? 'كود التفعيل' : 'Activation Code'}
          </Label>
          <Input
            id="activation-code"
            placeholder={language === 'ar' ? "PV-XXXX-XXXX-XXXX" : "PV-XXXX-XXXX-XXXX"}
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
            className="text-center font-mono"
          />
        </div>
        <Button 
          onClick={handleActivateCode}
          disabled={isSubmitting || !activationCode.trim()}
          className="w-full"
        >
          {isSubmitting ? (language === 'ar' ? 'جاري التفعيل...' : 'Activating...') : (language === 'ar' ? 'تفعيل' : 'Activate')}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          <p>{language === 'ar' ? 'اشتر كود التفعيل للحصول على معاملات غير محدودة' : 'Purchase activation code for unlimited transactions'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivationCodeInput;
