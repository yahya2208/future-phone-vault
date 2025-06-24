
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface StatsProps {
  totalTransactions: number;
  topBrand: string;
  recentTransactions: number;
}

const DashboardStats: React.FC<StatsProps> = ({ totalTransactions, topBrand, recentTransactions }) => {
  const { t, language } = useLanguage();
  const [totalUsers, setTotalUsers] = useState(0);
  
  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching user count:', error);
        return;
      }

      setTotalUsers(count || 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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

      <Card className="holo-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-400">المستخدمون</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400 glow-text font-['Orbitron']">
            {totalUsers}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            إجمالي المستخدمين
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
