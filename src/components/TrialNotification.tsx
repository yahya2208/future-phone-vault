
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Crown } from 'lucide-react';

interface TrialNotificationProps {
  transactionsUsed: number;
  maxTransactions: number;
}

const TrialNotification: React.FC<TrialNotificationProps> = ({ 
  transactionsUsed, 
  maxTransactions 
}) => {
  const { language } = useLanguage();

  const isLimitReached = transactionsUsed >= maxTransactions;
  const remaining = Math.max(0, maxTransactions - transactionsUsed);

  const messages = {
    ar: {
      trialPeriod: 'الفترة التجريبية',
      remaining: `متبقي ${remaining} معاملة من أصل ${maxTransactions}`,
      limitReached: 'انتهت فترتك التجريبية',
      upgradeMessage: `انتهت فترتك التجريبية. إذا كنت تجد هذا التطبيق يستحق الشراء، فالسعر رمزي ومعقول بـ 2000 دج أو 8 دولار أمريكي.

طرق الدفع:
- تحويل إلكتروني: manouniyahya@gmail.com أو yahyamanouni@gmail.com
- فليكسي (جيزي أو أوريدو): اتصل بالمشرف للحصول على الرقم
- باي بال: متوفر
- طرق أخرى: اتصل بنا للبدائل

اتصل بالمشرف لتفعيل حسابك بعد الدفع.`,
      contactAdmin: 'اتصل بالمشرف'
    },
    en: {
      trialPeriod: 'Trial Period',
      remaining: `${remaining} transactions remaining out of ${maxTransactions}`,
      limitReached: 'Your trial period has ended',
      upgradeMessage: `Your trial period has ended. If you find this application worth purchasing, the price is symbolic and affordable at 2000 DZD or 8 USD.

Payment methods:
- Email transfer: manouniyahya@gmail.com or yahyamanouni@gmail.com
- Flexi (Djezzy or Ooredoo): Contact admin for number
- PayPal: Available
- Other methods: Contact us for alternatives

Contact admin to activate your account after payment.`,
      contactAdmin: 'Contact Admin'
    }
  };

  const msg = messages[language];

  if (isLimitReached) {
    return (
      <Card className="border-red-500 bg-red-50 dark:bg-red-900/20 mb-6">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Crown className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                {msg.limitReached}
              </h3>
              <div className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                {msg.upgradeMessage}
              </div>
              <div className="pt-2">
                <a
                  href="mailto:manouniyahya@gmail.com"
                  className="inline-flex items-center gap-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                >
                  {msg.contactAdmin}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-500 bg-orange-50 dark:bg-orange-900/20 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">
              {msg.trialPeriod}
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              {msg.remaining}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrialNotification;
