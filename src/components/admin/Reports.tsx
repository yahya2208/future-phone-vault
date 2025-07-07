import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Activity, FileText } from 'lucide-react';

const Reports = () => {
  const { language } = useLanguage();

  // Placeholder data - replace with actual data from your API
  const stats = [
    {
      title: language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
      value: '1,234',
      icon: Users,
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: language === 'ar' ? 'نشطون هذا الشهر' : 'Active This Month',
      value: '876',
      icon: Activity,
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: language === 'ar' ? 'إجمالي المعاملات' : 'Total Transactions',
      value: '5,678',
      icon: FileText,
      change: '+23%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} {language === 'ar' ? 'من الشهر الماضي' : 'from last month'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'ar' ? 'النشاط' : 'Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
            <div className="text-center space-y-2">
              <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'سيتم عرض الرسوم البيانية هنا قريباً' 
                  : 'Charts will be displayed here soon'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'أحدث المستخدمين' : 'Recent Users'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'سيتم عرض قائمة المستخدمين هنا' 
                  : 'User list will be displayed here'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'النشاطات الأخيرة' : 'Recent Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">
                {language === 'ar' 
                  ? 'سيتم عرض سجل النشاطات هنا' 
                  : 'Activity log will be displayed here'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
