
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Smartphone, TrendingUp, Users } from 'lucide-react';

interface DashboardStatsProps {
  totalTransactions: number;
  topBrand: string;
  recentTransactions: number;
  averageRating?: number;
}

const DashboardStats = ({ totalTransactions, topBrand, recentTransactions, averageRating = 0 }: DashboardStatsProps) => {
  const stats = [
    {
      title: 'إجمالي المعاملات',
      value: totalTransactions.toString(),
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'الماركة الأكثر شيوعاً',
      value: topBrand || 'لا توجد',
      icon: Smartphone,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'معاملات اليوم',
      value: recentTransactions.toString(),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      title: 'معدل التقييم',
      value: averageRating.toFixed(1) + '/5',
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="holo-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary glow-text font-['Orbitron']">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
