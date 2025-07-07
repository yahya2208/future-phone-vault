
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Users, BarChart, Shield } from 'lucide-react';
import UserList from './admin/UserList';
import Reports from './admin/Reports';

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = () => {
    if (user?.email === 'yahyamanouni2@gmail.com') {
      setIsAdmin(true);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {language === 'ar' ? 'غير مصرح لك بالوصول إلى لوحة التحكم' : 'You are not authorized to access the admin panel'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إدارة المستخدمين وعرض إحصائيات النظام' 
              : 'Manage users and view system statistics'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-flex">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'المستخدمين' : 'Users'}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            {language === 'ar' ? 'التقارير' : 'Reports'}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserList />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Reports />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'إعدادات النظام' : 'System Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'ar'
                  ? 'إعدادات متقدمة للنظام'
                  : 'Advanced system settings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <p className="text-muted-foreground">
                  {language === 'ar' 
                    ? 'إعدادات النظام ستظهر هنا' 
                    : 'System settings will appear here'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
