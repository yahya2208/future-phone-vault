
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Key, Shield } from 'lucide-react';

const ActivationCodeInput = () => {
  const [activationCode, setActivationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  const validateCodeFormat = (code: string) => {
    // Basic validation for code format (PV-XXXX-XXXX-XXXX or similar patterns)
    const codePattern = /^[A-Z]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/;
    return codePattern.test(code.trim().toUpperCase());
  };

  const handleActivateCode = async () => {
    if (!user) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يجب تسجيل الدخول أولاً" : "You must log in first",
        variant: "destructive"
      });
      return;
    }

    // Special handling for admin users
    if (user.email === 'yahyamanouni2@gmail.com') {
      setIsSubmitting(true);
      try {
        console.log('Activating admin account for:', user.id);
        
        // Update profile to set admin status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_admin: true,
            plan_type: 'premium',
            max_transactions: 999999,
            subscription_expires_at: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating admin profile:', profileError);
          throw profileError;
        }

        // Create admin activation record
        const { error: activationError } = await supabase
          .from('user_activations')
          .upsert({
            user_id: user.id,
            user_email: user.email || '',
            is_activated: true,
            is_admin: true,
            activation_type: 'admin_auto',
            activated_at: new Date().toISOString(),
            trial_ends_at: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000).toISOString(),
            max_trial_transactions: 999999,
            used_trial_transactions: 0
          }, {
            onConflict: 'user_id'
          });

        if (activationError) {
          console.error('Error creating admin activation:', activationError);
          // Don't throw here as profile update was successful
        }

        console.log('Admin activation completed successfully');
        
        toast({
          title: language === 'ar' ? "تم تفعيل حساب الأدمن!" : "Admin Account Activated!",
          description: language === 'ar' 
            ? "تم تفعيل حساب الأدمن بصلاحيات كاملة وخطة مميزة مدى الحياة" 
            : "Admin account activated with full privileges and lifetime premium plan"
        });
        
        // Reload after a short delay to show the toast
        setTimeout(() => window.location.reload(), 2000);
        return;
      } catch (error) {
        console.error('Admin activation error:', error);
        toast({
          title: language === 'ar' ? "خطأ في التفعيل" : "Activation Error",
          description: language === 'ar' ? `فشل تفعيل حساب الأدمن: ${error.message || 'خطأ غير معروف'}` : `Failed to activate admin account: ${error.message || 'Unknown error'}`,
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Regular user activation with code
    if (!activationCode.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال كود التفعيل" : "Please enter activation code",
        variant: "destructive"
      });
      return;
    }

    const code = activationCode.trim().toUpperCase();
    
    if (!validateCodeFormat(code)) {
      toast({
        title: language === 'ar' ? "تنسيق كود خاطئ" : "Invalid Code Format",
        description: language === 'ar' ? "يجب أن يكون الكود بالتنسيق: PV-XXXX-XXXX-XXXX" : "Code must be in format: PV-XXXX-XXXX-XXXX",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Validating activation code:', code);
      
      // Check if user is already activated
      const { data: existingActivation } = await supabase
        .from('user_activations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingActivation && existingActivation.is_activated) {
        toast({
          title: language === 'ar' ? "الحساب مفعل مسبقاً" : "Account Already Activated",
          description: language === 'ar' ? "حسابك مفعل بالفعل" : "Your account is already activated",
          variant: "destructive"
        });
        return;
      }

      // Check if code exists and is valid
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code_hash', code)
        .eq('is_used', false)
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      console.log('Code validation result:', codeData, 'Error:', codeError);

      if (codeError) {
        console.error('Code validation error:', codeError);
        toast({
          title: language === 'ar' ? "خطأ في التحقق" : "Validation Error",
          description: language === 'ar' ? "حدث خطأ أثناء التحقق من الكود" : "Error occurred while validating code",
          variant: "destructive"
        });
        return;
      }

      if (!codeData) {
        toast({
          title: language === 'ar' ? "كود غير صحيح" : "Invalid Code",
          description: language === 'ar' ? "الكود غير صحيح أو منتهي الصلاحية أو مستخدم مسبقاً" : "Code is invalid, expired, or already used",
          variant: "destructive"
        });
        return;
      }

      // Mark code as used
      const { error: updateError } = await supabase
        .from('activation_codes')
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by: user.id
        })
        .eq('id', codeData.id);

      if (updateError) {
        console.error('Error updating code:', updateError);
        throw updateError;
      }

      // Create activation record
      const subscriptionDuration = codeData.subscription_duration_months || 12;
      const isLifetime = codeData.code_type === 'lifetime';
      const trialEndDate = isLifetime 
        ? new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000) 
        : new Date(Date.now() + subscriptionDuration * 30 * 24 * 60 * 60 * 1000);

      const { error: activationError } = await supabase
        .from('user_activations')
        .upsert({
          user_id: user.id,
          user_email: user.email || '',
          is_activated: true,
          activation_type: codeData.code_type || 'subscription',
          activated_at: new Date().toISOString(),
          trial_ends_at: trialEndDate.toISOString(),
          is_admin: codeData.is_admin_code || false,
          max_trial_transactions: codeData.code_type === 'gift' ? 50 : 999999,
          used_trial_transactions: 0
        }, {
          onConflict: 'user_id'
        });

      if (activationError) {
        console.error('Activation record error:', activationError);
        // Don't throw here as code was already marked as used
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan_type: isLifetime ? 'lifetime' : 'premium',
          max_transactions: codeData.code_type === 'gift' ? 50 : 999999,
          subscription_expires_at: trialEndDate.toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw here as activation was successful
      }

      // Success message based on code type
      let successMessage = language === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Your account has been activated successfully!";
      
      if (codeData.code_type === 'lifetime') {
        successMessage = language === 'ar' ? "تم تفعيل النسخة الأبدية بنجاح!" : "Lifetime version activated successfully!";
      } else if (codeData.code_type === 'gift') {
        successMessage = language === 'ar' ? "تم تفعيل الكود المجاني بنجاح!" : "Gift code activated successfully!";
      } else if (codeData.code_type === 'owner') {
        successMessage = language === 'ar' ? "تم تفعيل حساب المالك بنجاح!" : "Owner account activated successfully!";
      }

      toast({
        title: language === 'ar' ? "نجح التفعيل!" : "Activation Successful!",
        description: successMessage
      });
      
      setActivationCode('');
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: language === 'ar' ? "فشل التفعيل" : "Activation Failed",
        description: language === 'ar' ? `حدث خطأ أثناء التفعيل: ${error.message || 'خطأ غير معروف'}` : `An error occurred during activation: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
          {user?.email === 'yahyamanouni2@gmail.com' ? <Shield size={20} /> : <Key size={20} />}
          {language === 'ar' ? 'تفعيل الحساب' : 'Account Activation'}
          {user?.email === 'yahyamanouni2@gmail.com' && (
            <div className="text-sm text-amber-600 mt-2 bg-amber-50 p-2 rounded">
              {language === 'ar' ? 'حساب الأدمن - تفعيل تلقائي متاح' : 'Admin Account - Auto Activation Available'}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.email === 'yahyamanouni2@gmail.com' ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center border border-green-200">
              <p className="text-green-700 dark:text-green-300 font-medium">
                {language === 'ar' ? 'أنت مسؤول النظام. اضغط التفعيل للحصول على صلاحيات كاملة ونسخة مميزة مدى الحياة.' : 'You are system administrator. Click activate for full privileges and lifetime premium access.'}
              </p>
            </div>
            <Button 
              onClick={handleActivateCode}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              <Shield className="mr-2 h-4 w-4" />
              {isSubmitting ? (language === 'ar' ? 'جاري التفعيل...' : 'Activating...') : (language === 'ar' ? 'تفعيل حساب الأدمن' : 'Activate Admin Account')}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="activation-code">
                {language === 'ar' ? 'كود التفعيل' : 'Activation Code'}
              </Label>
              <Input
                id="activation-code"
                placeholder={language === 'ar' ? "PV-XXXX-XXXX-XXXX" : "PV-XXXX-XXXX-XXXX"}
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg"
                disabled={isSubmitting}
                onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleActivateCode()}
              />
              <p className="text-xs text-muted-foreground text-center">
                {language === 'ar' ? 'أدخل الكود بالتنسيق الصحيح (مثال: PV-AB12-CD34-EF56)' : 'Enter code in correct format (example: PV-AB12-CD34-EF56)'}
              </p>
            </div>
            <Button 
              onClick={handleActivateCode}
              disabled={isSubmitting || !activationCode.trim()}
              className="w-full"
              size="lg"
            >
              <Key className="mr-2 h-4 w-4" />
              {isSubmitting ? (language === 'ar' ? 'جاري التفعيل...' : 'Activating...') : (language === 'ar' ? 'تفعيل الحساب' : 'Activate Account')}
            </Button>
          </>
        )}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>{language === 'ar' ? 'اشتر كود التفعيل للحصول على معاملات غير محدودة وميزات إضافية' : 'Purchase activation code for unlimited transactions and additional features'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivationCodeInput;
