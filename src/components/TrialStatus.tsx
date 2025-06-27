
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Star, Clock } from 'lucide-react';
import { useActivation } from '@/hooks/useActivation';
import { useLanguage } from '@/contexts/LanguageContext';

const TrialStatus = () => {
  const { userActivation } = useActivation();
  const { language } = useLanguage();

  if (!userActivation) return null;

  if (userActivation.isActivated) {
    return (
      <Card className="holo-card border-green-500/30 bg-green-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-full">
              <Star className="text-white" size={18} />
            </div>
            <div>
              <h3 className="font-bold text-green-800">النسخة الكاملة مفعلة ✨</h3>
              <p className="text-sm text-green-600">استمتع بجميع المواصفات مدى الحياة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
