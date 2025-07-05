
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

    // Check if user is admin
    if (user.email === 'yahyamanouni2@gmail.com') {
      setIsSubmitting(true);
      try {
        console.log('Starting admin activation for user:', user.id);
        
        // Update profile to set admin status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_admin: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating admin profile:', profileError);
          throw profileError;
        }

        console.log('Admin profile updated successfully');
        
        // Show success message
        toast({
          title: language === 'ar' ? "تم تفعيل الأدمن!" : "Admin Activated!",
          description: language === 'ar' 
            ? "تم تفعيل حساب الأدمن بصلاحيات كاملة" 
            : "Admin account activated with full privileges"
        });
        
        // Reload after a short delay to show the toast
        console.log('Reloading page to apply changes...');
        setTimeout(() => window.location.reload(), 1500);
        return;
      } catch (error) {
        console.error('Admin activation error:', error);
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "حدث خطأ أثناء تفعيل حساب الأدمن" : "An error occurred while activating admin account",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
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
      console.log('Validating activation code:', activationCode.trim());
      
      // Check if code exists in activation_codes table directly
      const { data: codeData, error: codeError } = await supabase
        .from('activation_codes')
        .select('*')
        .eq('code_hash', activationCode.trim())
        .eq('is_used', false)
        .single();

      console.log('Code validation result:', codeData, 'Error:', codeError);

      if (codeError || !codeData) {
        // Try using the database function as fallback
        const { data, error } = await supabase.rpc('validate_activation_code', {
          input_code: activationCode.trim(),
          user_email: user.email || ''
        });

        console.log('Database function result:', data, 'Error:', error);

        if (error || !data || (typeof data === 'object' && !data.success)) {
          toast({
            title: language === 'ar' ? "فشل التفعيل" : "Activation Failed",
            description: language === 'ar' ? "كود غير صحيح أو منتهي الصلاحية" : "Invalid or expired activation code",
            variant: "destructive"
          });
          return;
        }

        // Handle successful activation from database function
        if (typeof data === 'object' && data.success) {
          const subscriptionDuration = typeof data.subscription_duration === 'number' ? data.subscription_duration : 12;
          
          const { error: activationError } = await supabase
            .from('user_activations')
            .upsert({
              user_id: user.id,
              user_email: user.email || '',
              is_activated: true,
              activation_type: data.code_type || 'subscription',
              activated_at: new Date().toISOString(),
              trial_ends_at: data.code_type === 'lifetime' 
                ? new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + (subscriptionDuration * 30 * 24 * 60 * 60 * 1000)).toISOString(),
              is_admin: data.is_admin || false,
              max_trial_transactions: data.code_type === 'gift' ? 10 : 999999,
              used_trial_transactions: 0
            });

          if (activationError) {
            console.error('Activation record error:', activationError);
          }

          toast({
            title: language === 'ar' ? "نجح التفعيل!" : "Activation Successful!",
            description: typeof data.message === 'string' ? data.message : (language === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Your account has been activated successfully!")
          });
          
          setActivationCode('');
          setTimeout(() => window.location.reload(), 1500);
          return;
        }
      } else {
        // Code found directly, mark as used and activate
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
        const { error: activationError } = await supabase
          .from('user_activations')
          .upsert({
            user_id: user.id,
            user_email: user.email || '',
            is_activated: true,
            activation_type: codeData.code_type || 'subscription',
            activated_at: new Date().toISOString(),
            trial_ends_at: new Date(Date.now() + (codeData.subscription_duration_months || 12) * 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_admin: codeData.is_admin_code || false,
            max_trial_transactions: 999999,
            used_trial_transactions: 0
          });

        if (activationError) {
          console.error('Activation record error:', activationError);
        }

        toast({
          title: language === 'ar' ? "نجح التفعيل!" : "Activation Successful!",
          description: language === 'ar' ? "تم تفعيل حسابك بنجاح!" : "Your account has been activated successfully!"
        });
        
        setActivationCode('');
        setTimeout(() => window.location.reload(), 1500);
        return;
      }

    } catch (error) {
      console.error('Activation error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ أثناء التفعيل" : "An error occurred during activation",
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
          {user?.email === 'yahyamanouni2@gmail.com' && (
            <div className="text-sm text-red-600 mt-2">
              {language === 'ar' ? 'حساب الأدمن - تفعيل تلقائي' : 'Admin Account - Auto Activation'}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user?.email === 'yahyamanouni2@gmail.com' ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-300">
                {language === 'ar' ? 'أنت مسؤول النظام. اضغط التفعيل للحصول على صلاحيات كاملة.' : 'You are system administrator. Click activate for full privileges.'}
              </p>
            </div>
            <Button 
              onClick={handleActivateCode}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (language === 'ar' ? 'جاري التفعيل...' : 'Activating...') : (language === 'ar' ? 'تفعيل الأدمن' : 'Activate Admin')}
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
          </>
        )}
        <div className="text-center text-sm text-muted-foreground">
          <p>{language === 'ar' ? 'اشتر كود التفعيل للحصول على معاملات غير محدودة' : 'Purchase activation code for unlimited transactions'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivationCodeInput;
