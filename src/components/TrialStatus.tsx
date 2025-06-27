
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Star, Clock, Crown, Gift } from 'lucide-react';
import { useActivation } from '@/hooks/useActivation';
import { useLanguage } from '@/contexts/LanguageContext';

const TrialStatus = () => {
  const { userActivation } = useActivation();
  const { language } = useLanguage();

  if (!userActivation) return null;

  // Show admin status
  if (userActivation.isAdmin) {
    return (
      <Card className="holo-card border-purple-500/30 bg-purple-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Crown className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-purple-800">حساب المدير مفعل 👑</h3>
              <p className="text-sm text-purple-600">صلاحيات إدارية كاملة - مدى الحياة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show activated status based on activation type
  if (userActivation.isActivated) {
    const getActivationIcon = () => {
      switch (userActivation.activationType) {
        case 'gift':
          return <Gift className="text-white" size={18} />;
        case 'lifetime':
          return <Star className="text-white" size={18} />;
        case 'subscription':
          return <Clock className="text-white" size={18} />;
        default:
          return <Star className="text-white" size={18} />;
      }
    };

    const getActivationText = () => {
      switch (userActivation.activationType) {
        case 'gift':
          return {
            title: 'تم التفعيل بكود الهدية ✨',
            subtitle: 'استمتع بجميع المواصفات مجاناً'
          };
        case 'lifetime':
          return {
            title: 'النسخة الأبدية مفعلة 🎉',
            subtitle: 'استمتع بجميع المواصفات مدى الحياة'
          };
        case 'subscription':
          return {
            title: 'الاشتراك مفعل 📅',
            subtitle: userActivation.subscriptionExpiresAt 
              ? `ينتهي في: ${new Date(userActivation.subscriptionExpiresAt).toLocaleDateString('ar-SA')}`
              : 'اشتراك نشط'
          };
        default:
          return {
            title: 'النسخة الكاملة مفعلة ✨',
            subtitle: 'استمتع بجميع المواصفات مدى الحياة'
          };
      }
    };

    const activationText = getActivationText();

    return (
      <Card className="holo-card border-green-500/30 bg-green-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              {getActivationIcon()}
            </div>
            <div>
              <h3 className="font-bold text-green-800">{activationText.title}</h3>
              <p className="text-sm text-green-600">{activationText.subtitle}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show trial status
  const remaining = userActivation.maxTrialTransactions - userActivation.trialTransactionsUsed;
  const percentage = (userActivation.trialTransactionsUsed / userActivation.maxTrialTransactions) * 100;

  return (
    <Card className={`holo-card ${remaining <= 1 ? 'border-amber-500/50 bg-amber-50/30' : 'border-blue-500/30 bg-blue-50/30'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${remaining <= 1 ? 'bg-amber-500' : 'bg-blue-500'}`}>
              <Clock className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-primary">فترة التجربة المجانية</h3>
              <p className="text-sm text-muted-foreground">
                {remaining > 0 
                  ? `متبقي ${remaining} معاملة من أصل ${userActivation.maxTrialTransactions}`
                  : 'انتهت فترة التجربة'
                }
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>المستخدم: {userActivation.trialTransactionsUsed}</span>
              <span>المجموع: {userActivation.maxTrialTransactions}</span>
            </div>
          </div>

          {remaining <= 1 && (
            <div className="mt-3 p-3 bg-amber-100 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 text-sm">
                <Shield size={16} />
                <span className="font-semibold">
                  {remaining === 0 
                    ? 'يجب تفعيل النسخة الكاملة للمتابعة' 
                    : 'معاملة واحدة متبقية قبل التفعيل'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrialStatus;
