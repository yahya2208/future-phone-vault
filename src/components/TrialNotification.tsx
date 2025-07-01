
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TrialNotificationProps {
  transactionsUsed: number;
  maxTransactions: number;
}

const TrialNotification: React.FC<TrialNotificationProps> = ({ 
  transactionsUsed, 
  maxTransactions 
}) => {
  const { language } = useLanguage();
  
  const remaining = maxTransactions - transactionsUsed;
  const isNearLimit = remaining <= 1;
  
  const messages = {
    ar: {
      title: 'فترة تجريبية',
      description: `لديك ${remaining} معاملة متبقية من أصل ${maxTransactions}. اشترك للحصول على معاملات غير محدودة.`,
      limitReached: 'تم انتهاء الفترة التجريبية. اشترك للمتابعة.'
    },
    en: {
      title: 'Trial Period',
      description: `You have ${remaining} transactions remaining out of ${maxTransactions}. Subscribe for unlimited transactions.`,
      limitReached: 'Trial period ended. Subscribe to continue.'
    }
  };

  if (remaining <= 0) {
    return (
      <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-6">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700 dark:text-red-300">
          <strong>{messages[language].title}:</strong> {messages[language].limitReached}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`mb-6 ${isNearLimit ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
      <AlertTriangle className={`h-4 w-4 ${isNearLimit ? 'text-orange-600' : 'text-blue-600'}`} />
      <AlertDescription className={`${isNearLimit ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'}`}>
        <strong>{messages[language].title}:</strong> {messages[language].description}
      </AlertDescription>
    </Alert>
  );
};

export default TrialNotification;
