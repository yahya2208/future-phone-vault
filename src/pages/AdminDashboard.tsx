
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart, FileText, UserCog, Activity, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserList from '@/components/admin/UserList';
import Reports from '@/components/admin/Reports';

const StatsCard = ({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: React.ElementType; description?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const QuickAction = ({ title, icon: Icon, onClick, className = '' }: { title: string; icon: React.ElementType; onClick: () => void; className?: string }) => (
  <Button variant="outline" className={`flex flex-col items-center justify-center h-32 ${className}`} onClick={onClick}>
    <Icon className="h-8 w-8 mb-2" />
    <span>{title}</span>
  </Button>
);

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    transactions: 0,
    revenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Array<{id: string; action: string; timestamp: string}>>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!loading && !user) {
        navigate('/auth');
        return;
      }
      
      if (user) {
        // التحقق من صلاحيات الإدارة
        const adminEmails = ['yahyamanouni2@gmail.com', 'y220890@gmail.com'];
        if (!adminEmails.includes(user.email || '')) {
          navigate('/');
          return;
        }
        
        // تحميل الإحصائيات
        await loadStats();
        await loadRecentActivity();
      }
    };

    checkAdmin();
  }, [user, loading, navigate]);

  const loadStats = async () => {
    try {
      // جلب إجمالي المستخدمين
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // جلب المستخدمين النشطين
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .neq('plan_type', 'trial');

      // جلب إجمالي المعاملات
      const { count: transactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        transactions: transactions || 0,
        revenue: 0, // يمكن حسابه لاحقاً
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // جلب آخر المستخدمين المسجلين
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('id, username, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const activity = newUsers?.map(user => ({
        id: user.id,
        action: `${user.username || user.email} ${language === 'ar' ? 'انضم للتطبيق' : 'joined the app'}`,
        timestamp: new Date(user.created_at).toLocaleString(),
      })) || [];

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            title={language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to home'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={language === 'ar' ? 'rotate-180' : ''}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <h1 className="text-3xl font-bold">
            {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
          </TabsTrigger>
          <TabsTrigger value="users">
            {language === 'ar' ? 'المستخدمين' : 'Users'}
          </TabsTrigger>
          <TabsTrigger value="reports">
            {language === 'ar' ? 'التقارير' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              title={language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'} 
              value={stats.totalUsers} 
              icon={Users} 
            />
            <StatsCard 
              title={language === 'ar' ? 'نشطون' : 'Active Users'} 
              value={stats.activeUsers} 
              icon={Activity} 
            />
            <StatsCard 
              title={language === 'ar' ? 'المعاملات' : 'Transactions'} 
              value={stats.transactions} 
              icon={FileText} 
            />
            <StatsCard 
              title={language === 'ar' ? 'الإيرادات' : 'Revenue'} 
              value={`$${stats.revenue}`} 
              icon={BarChart} 
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'نظرة عامة' : 'Overview'}</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {language === 'ar' ? 'رسم بياني للإحصائيات سيظهر هنا' : 'Chart will be displayed here'}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-2 hover:bg-muted/50 rounded-md">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                              {activity.action}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      {language === 'ar' ? 'لا يوجد نشاط مؤخراً' : 'No recent activity'}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <h2 className="col-span-full text-xl font-semibold">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h2>
            <QuickAction
              title={language === 'ar' ? 'إدارة المستخدمين' : 'Manage Users'}
              icon={Users}
              onClick={() => navigate('/admin/users')}
            />
            <QuickAction
              title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
              icon={Bell}
              onClick={() => navigate('/admin/notifications')}
            />
            <QuickAction
              title={language === 'ar' ? 'الأدوار والصلاحيات' : 'Roles & Permissions'}
              icon={Shield}
              onClick={() => navigate('/admin/roles')}
            />
            <QuickAction
              title={language === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
              icon={UserCog}
              onClick={() => navigate('/admin/settings')}
              className="bg-primary/10 text-primary hover:bg-primary/20"
            />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <UserList />
        </TabsContent>

        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
