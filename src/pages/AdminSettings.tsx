
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Shield, Database, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [systemSettings, setSystemSettings] = useState({
    maxTrialTransactions: 10,
    premiumPrice: '2000 DZD / 8 USD',
    adminEmails: 'manouniyahya@gmail.com, yahyamanouni@gmail.com',
    maintenanceMode: false,
    allowRegistrations: true
  });

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    
    // Check admin access
    const adminEmails = ['yahyamanouni2@gmail.com', 'y220890@gmail.com'];
    if (user && !adminEmails.includes(user.email || '')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSystemSettingsUpdate = async () => {
    try {
      // In a real implementation, these would be stored in a settings table
      toast.success(language === 'ar' ? 'تم تحديث الإعدادات بنجاح' : 'Settings updated successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في تحديث الإعدادات' : 'Error updating settings');
    }
  };

  const messages = {
    ar: {
      title: 'إعدادات الإدارة',
      back: 'العودة',
      systemSettings: 'إعدادات النظام',
      userManagement: 'إدارة المستخدمين',
      paymentSettings: 'إعدادات الدفع',
      maxTrialTransactions: 'الحد الأقصى للمعاملات التجريبية',
      premiumPrice: 'سعر النسخة المدفوعة',
      adminEmails: 'بريد المشرفين الإلكتروني',
      maintenanceMode: 'وضع الصيانة',
      allowRegistrations: 'السماح بالتسجيل',
      save: 'حفظ',
      activateUser: 'تفعيل مستخدم',
      deactivateUser: 'إلغاء تفعيل مستخدم',
      resetTransactions: 'إعادة تعيين المعاملات',
      userEmail: 'بريد المستخدم الإلكتروني',
      paymentMethods: 'طرق الدفع',
      paymentInfo: 'معلومات الدفع'
    },
    en: {
      title: 'Admin Settings',
      back: 'Back',
      systemSettings: 'System Settings',
      userManagement: 'User Management',
      paymentSettings: 'Payment Settings',
      maxTrialTransactions: 'Max Trial Transactions',
      premiumPrice: 'Premium Price',
      adminEmails: 'Admin Emails',
      maintenanceMode: 'Maintenance Mode',
      allowRegistrations: 'Allow Registrations',
      save: 'Save',
      activateUser: 'Activate User',
      deactivateUser: 'Deactivate User',
      resetTransactions: 'Reset Transactions',
      userEmail: 'User Email',
      paymentMethods: 'Payment Methods',
      paymentInfo: 'Payment Information'
    }
  };

  const msg = messages[language];

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
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          {msg.title}
        </h1>
        <Button 
          onClick={() => navigate('/admin-dashboard')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          {msg.back}
        </Button>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings size={16} />
            {msg.systemSettings}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            {msg.userManagement}
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Shield size={16} />
            {msg.paymentSettings}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>{msg.systemSettings}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="maxTrialTransactions">{msg.maxTrialTransactions}</Label>
                  <Input
                    id="maxTrialTransactions"
                    type="number"
                    value={systemSettings.maxTrialTransactions}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      maxTrialTransactions: parseInt(e.target.value)
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="premiumPrice">{msg.premiumPrice}</Label>
                  <Input
                    id="premiumPrice"
                    value={systemSettings.premiumPrice}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      premiumPrice: e.target.value
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="adminEmails">{msg.adminEmails}</Label>
                  <Input
                    id="adminEmails"
                    value={systemSettings.adminEmails}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      adminEmails: e.target.value
                    }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({
                      ...prev,
                      maintenanceMode: checked
                    }))}
                  />
                  <Label htmlFor="maintenanceMode">{msg.maintenanceMode}</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allowRegistrations"
                    checked={systemSettings.allowRegistrations}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({
                      ...prev,
                      allowRegistrations: checked
                    }))}
                  />
                  <Label htmlFor="allowRegistrations">{msg.allowRegistrations}</Label>
                </div>
              </div>
              
              <Button onClick={handleSystemSettingsUpdate} className="w-full">
                {msg.save}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{msg.userManagement}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userEmail">{msg.userEmail}</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    {msg.activateUser}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    {msg.deactivateUser}
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    {msg.resetTransactions}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>{msg.paymentSettings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{msg.paymentInfo}</h3>
                  <div className="text-sm space-y-1">
                    <p>Email: manouniyahya@gmail.com, yahyamanouni@gmail.com</p>
                    <p>Flexi (Djezzy/Ooredoo): Contact admin</p>
                    <p>PayPal: Available</p>
                    <p>Price: 2000 DZD / 8 USD</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
