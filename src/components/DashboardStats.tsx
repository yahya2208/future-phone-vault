
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStatsProps {
  totalTransactions: number;
  topBrand: string;
  recentTransactions: number;
  averageRating: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTransactions,
  topBrand,
  recentTransactions,
  averageRating
}) => {
  const { t, language } = useLanguage();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm font-semibold">
            {t('totalTransactions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{totalTransactions}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('devicesProcessed')}</div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm font-semibold">
            {t('topBrand')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{topBrand || t('notAvailable')}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('mostPopular')}</div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm font-semibold">
            {t('today')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{recentTransactions}</div>
          <div className="text-xs text-muted-foreground mt-1">{t('newTransactions')}</div>
        </CardContent>
      </Card>

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-sm font-semibold">
            {t('averageRating')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{averageRating.toFixed(1)}/5</div>
          <div className="flex mt-1">
            {renderStars(averageRating)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
