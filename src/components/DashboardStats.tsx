
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsProps {
  totalTransactions: number;
  topBrand: string;
  recentTransactions: number;
}

const DashboardStats: React.FC<StatsProps> = ({ totalTransactions, topBrand, recentTransactions }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary">{t('totalTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
            {totalTransactions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('devicesProcessed')}
          </div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-accent">{t('topBrand')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent glow-text font-['Orbitron']">
            {topBrand || t('notAvailable')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('mostPopular')}
          </div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary">{t('today')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-secondary glow-text font-['Orbitron']">
            {recentTransactions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {t('newTransactions')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
