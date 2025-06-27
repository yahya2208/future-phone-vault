
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface UserActivation {
  id: string;
  isActivated: boolean;
  trialTransactionsUsed: number;
  maxTrialTransactions: number;
  deviceFingerprint?: string;
  activationType?: string;
  subscriptionExpiresAt?: string;
  isAdmin?: boolean;
}

interface ActivationContextType {
  userActivation: UserActivation | null;
  canCreateTransaction: boolean;
  activateUser: (code: string) => Promise<boolean>;
  checkActivationStatus: () => Promise<void>;
  logSecurityEvent: (eventType: string, details: any) => Promise<void>;
  incrementTrialUsage: () => Promise<void>;
  generateOwnerCode: () => Promise<string | null>;
  generateGiftCodes: () => Promise<any[]>;
  generateLifetimeCodes: () => Promise<any[]>;
  loading: boolean;
}

const ActivationContext = createContext<ActivationContextType | undefined>(undefined);

export const ActivationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userActivation, setUserActivation] = useState<UserActivation | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate device fingerprint for security
  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 0, 0);
    const canvasData = canvas.toDataURL();
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
      canvas: canvasData.slice(-50),
      timestamp: Date.now()
    };
    
    return btoa(JSON.stringify(fingerprint)).slice(0, 64);
  };

  const logSecurityEvent = async (eventType: string, details: any) => {
    if (!user) return;
    
    try {
      const deviceFingerprint = generateDeviceFingerprint();
      await supabase.from('security_logs').insert({
        user_id: user.id,
        event_type: eventType,
        event_details: details,
        device_fingerprint: deviceFingerprint,
        risk_score: eventType.includes('suspicious') ? 5 : 1
      });
    } catch (error) {
      console.error('خطأ في تسجيل الحدث الأمني:', error);
    }
  };

  const checkActivationStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if user activation record exists
      let { data: activation, error } = await supabase
        .from('user_activations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('خطأ في جلب بيانات التفعيل:', error);
        return;
      }

      // If no activation record exists, create one
      if (!activation) {
        const deviceFingerprint = generateDeviceFingerprint();
        
        const { data: newActivation, error: insertError } = await supabase
          .from('user_activations')
          .insert({
            user_id: user.id,
            user_email: user.email || '',
            device_fingerprint: deviceFingerprint
          })
          .select()
          .single();

        if (insertError) {
          console.error('خطأ في إنشاء سجل التفعيل:', insertError);
          return;
        }

        activation = newActivation;
        
        await logSecurityEvent('user_registered', {
          email: user.email,
          deviceFingerprint
        });
      }

      setUserActivation({
        id: activation.id,
        isActivated: activation.is_activated || false,
        trialTransactionsUsed: activation.trial_transactions_used || 0,
        maxTrialTransactions: activation.max_trial_transactions || 3,
        deviceFingerprint: activation.device_fingerprint,
        activationType: activation.activation_type,
        subscriptionExpiresAt: activation.subscription_expires_at,
        isAdmin: activation.is_admin || false
      });

    } catch (error) {
      console.error('خطأ في فحص حالة التفعيل:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (code: string): Promise<boolean> => {
    if (!user || !userActivation) return false;

    try {
      // Validate activation code using the secure function
      const { data, error } = await supabase.rpc('validate_activation_code', {
        input_code: code,
        user_email: user.email
      });

      if (error) {
        console.error('خطأ في التحقق من الكود:', error);
        await logSecurityEvent('activation_code_validation_error', {
          code: code.slice(0, 4) + '****',
          error: error.message
        });
        return false;
      }

      if (data && data.success) {
        // Update user activation status based on code type
        const updateData: any = {
          is_activated: true,
          activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          activation_type: data.code_type
        };

        // Set admin status for owner codes
        if (data.code_type === 'owner') {
          updateData.is_admin = true;
        }

        // Set subscription expiration for subscription codes
        if (data.code_type === 'subscription' && data.subscription_duration) {
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + data.subscription_duration);
          updateData.subscription_expires_at = expirationDate.toISOString();
        }

        const { error: updateError } = await supabase
          .from('user_activations')
          .update(updateData)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('خطأ في تحديث حالة التفعيل:', updateError);
          return false;
        }

        setUserActivation(prev => prev ? { 
          ...prev, 
          isActivated: true,
          activationType: data.code_type,
          isAdmin: data.code_type === 'owner' || data.is_admin
        } : null);
        
        await logSecurityEvent('user_activated', {
          email: user.email,
          activationTime: new Date().toISOString(),
          codeType: data.code_type
        });

        toast({
          title: data.message || "تم التفعيل بنجاح! 🎉",
          description: "تم تفعيل حسابك. يمكنك الآن استخدام جميع مواصفات التطبيق",
        });

        return true;
      } else {
        await logSecurityEvent('invalid_activation_code', {
          code: code.slice(0, 4) + '****',
          email: user.email
        });
        
        toast({
          title: "كود غير صحيح",
          description: data?.message || "الكود المدخل غير صحيح أو منتهي الصلاحية",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error('خطأ في عملية التفعيل:', error);
      return false;
    }
  };

  const generateOwnerCode = async (): Promise<string | null> => {
    if (!user || !userActivation?.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "يجب أن تكون مدير للقيام بهذا الإجراء",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase.rpc('generate_owner_code');
      
      if (error) {
        console.error('خطأ في إنشاء كود المالك:', error);
        return null;
      }

      await logSecurityEvent('owner_code_generated', {
        generatedBy: user.email,
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error) {
      console.error('خطأ في إنشاء كود المالك:', error);
      return null;
    }
  };

  const generateGiftCodes = async (): Promise<any[]> => {
    if (!user || !userActivation?.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "يجب أن تكون مدير للقيام بهذا الإجراء",
        variant: "destructive"
      });
      return [];
    }

    try {
      const { data, error } = await supabase.rpc('generate_gift_codes');
      
      if (error) {
        console.error('خطأ في إنشاء أكواد الهدايا:', error);
        return [];
      }

      await logSecurityEvent('gift_codes_generated', {
        generatedBy: user.email,
        count: data?.length || 0,
        timestamp: new Date().toISOString()
      });

      return data || [];
    } catch (error) {
      console.error('خطأ في إنشاء أكواد الهدايا:', error);
      return [];
    }
  };

  const generateLifetimeCodes = async (): Promise<any[]> => {
    if (!user || !userActivation?.isAdmin) {
      toast({
        title: "غير مصرح",
        description: "يجب أن تكون مدير للقيام بهذا الإجراء",
        variant: "destructive"
      });
      return [];
    }

    try {
      const { data, error } = await supabase.rpc('generate_lifetime_codes');
      
      if (error) {
        console.error('خطأ في إنشاء الأكواد الأبدية:', error);
        return [];
      }

      await logSecurityEvent('lifetime_codes_generated', {
        generatedBy: user.email,
        count: data?.length || 0,
        timestamp: new Date().toISOString()
      });

      return data || [];
    } catch (error) {
      console.error('خطأ في إنشاء الأكواد الأبدية:', error);
      return [];
    }
  };

  const incrementTrialUsage = async () => {
    if (!user || !userActivation || userActivation.isActivated) return;

    try {
      const newUsageCount = userActivation.trialTransactionsUsed + 1;
      
      const { error } = await supabase
        .from('user_activations')
        .update({
          trial_transactions_used: newUsageCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('خطأ في تحديث استخدام التجربة:', error);
        return;
      }

      setUserActivation(prev => prev ? { 
        ...prev, 
        trialTransactionsUsed: newUsageCount 
      } : null);

      await logSecurityEvent('trial_transaction_used', {
        usageCount: newUsageCount,
        maxAllowed: userActivation.maxTrialTransactions
      });

    } catch (error) {
      console.error('خطأ في زيادة عداد التجربة:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkActivationStatus();
    } else {
      setUserActivation(null);
      setLoading(false);
    }
  }, [user]);

  const canCreateTransaction = userActivation
    ? userActivation.isActivated || 
      userActivation.trialTransactionsUsed < userActivation.maxTrialTransactions
    : false;

  const value = {
    userActivation,
    canCreateTransaction,
    activateUser,
    checkActivationStatus,
    logSecurityEvent,
    incrementTrialUsage,
    generateOwnerCode,
    generateGiftCodes,
    generateLifetimeCodes,
    loading,
  };

  return (
    <ActivationContext.Provider value={value}>
      {children}
    </ActivationContext.Provider>
  );
};

export const useActivation = () => {
  const context = useContext(ActivationContext);
  if (context === undefined) {
    throw new Error('useActivation must be used within an ActivationProvider');
  }
  return context;
};
