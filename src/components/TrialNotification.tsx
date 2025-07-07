
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert } from '@/components/ui/alert';

// Default messages in case translations are missing
const defaultMessages = {
  en: {
    title: 'Welcome!',
    description: 'You have full access to all features.'
  },
  ar: {
    title: 'مرحباً بك!',
    description: 'لديك وصول كامل لجميع الميزات.'
  }
};

interface TrialNotificationProps {
  transactionsUsed?: number;
  maxTransactions?: number;
}

const TrialNotification: React.FC<TrialNotificationProps> = ({ 
  transactionsUsed,
  maxTransactions 
}) => {
  const { language } = useLanguage();
  
  return (
    <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
          <strong className="text-green-800 dark:text-green-200">
            {(defaultMessages[language] || defaultMessages.en).title}
          </strong>
          <p className="text-sm text-green-700 dark:text-green-300">
            {(defaultMessages[language] || defaultMessages.en).description}
          </p>
        </div>
      </div>
    </Alert>
  );
};

export default TrialNotification;
