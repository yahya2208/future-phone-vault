
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Eye, 
  EyeOff,
  Save,
  Download,
  Mail,
  Phone,
  Lock
} from 'lucide-react';

const SettingsContent = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    username: user?.user_metadata?.username || '',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    autoBackup: true,
  });

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update auth user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          username: profileData.username,
          full_name: profileData.full_name,
        }
      });

      if (userError) throw userError;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'ar' ? 'خطأ في تحديث الملف الشخصي' : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error(language === 'ar' ? 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' : 'Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(language === 'ar' ? 'خطأ في تغيير كلمة المرور' : 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `transactions_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(language === 'ar' ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(language === 'ar' ? 'خطأ في تصدير البيانات' : 'Error exporting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-primary glow-text">
          {language === 'ar' ? 'الإعدادات' : 'Settings'}
        </h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الأمان' : 'Security'}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'التفضيلات' : 'Preferences'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'معلومات الملف الشخصي' : 'Profile Information'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'قم بتحديث معلومات حسابك الشخصي' : 'Update your account profile information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                </Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name">
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' 
                    ? 'لا يمكن تغيير البريد الإلكتروني حالياً' 
                    : 'Email cannot be changed currently'}
                </p>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading 
                  ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
                  : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إعدادات الأمان' : 'Security Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'قم بتغيير كلمة المرور وإعدادات الأمان' : 'Change your password and security settings'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">
                  {language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">
                  {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">
                  {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>

              <Button onClick={handlePasswordChange} disabled={loading}>
                <Lock className="h-4 w-4 mr-2" />
                {loading 
                  ? (language === 'ar' ? 'جاري التغيير...' : 'Changing...') 
                  : (language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'تحكم في أنواع الإشعارات التي تتلقاها' : 'Control what notifications you receive'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === 'ar' ? 'الإشعارات العامة' : 'General Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تلقي إشعارات حول أنشطة التطبيق' : 'Receive notifications about app activities'}
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === 'ar' ? 'الإشعارات بالبريد الإلكتروني' : 'Email Notifications'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'تلقي إشعارات عبر البريد الإلكتروني' : 'Receive notifications via email'}
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'التفضيلات العامة' : 'General Preferences'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'قم بتخصيص تجربتك في التطبيق' : 'Customize your app experience'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'اللغة' : 'Language'}</Label>
                <div className="flex gap-2">
                  <Button
                    variant={language === 'ar' ? 'default' : 'outline'}
                    onClick={() => setLanguage('ar')}
                  >
                    العربية
                  </Button>
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{language === 'ar' ? 'النسخ الاحتياطي التلقائي' : 'Auto Backup'}</Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'إنشاء نسخة احتياطية تلقائية من البيانات' : 'Automatically backup your data'}
                  </p>
                </div>
                <Switch
                  checked={preferences.autoBackup}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoBackup: checked }))}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{language === 'ar' ? 'تصدير البيانات' : 'Data Export'}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'تصدير جميع معاملاتك إلى ملف JSON' : 'Export all your transactions to a JSON file'}
                </p>
                <Button onClick={handleExportData} disabled={loading} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {loading 
                    ? (language === 'ar' ? 'جاري التصدير...' : 'Exporting...') 
                    : (language === 'ar' ? 'تصدير البيانات' : 'Export Data')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
