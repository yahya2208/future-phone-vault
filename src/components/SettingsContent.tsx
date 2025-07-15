
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Lock, Bell, Download, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SettingsContent = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    full_name: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          username: data.username || '',
          email: data.email || user.email || '',
          full_name: data.full_name || ''
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'ar' ? 'خطأ في تحديث الملف الشخصي' : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error(language === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) {
        throw error;
      }

      toast.success(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
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
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      const dataStr = JSON.stringify(transactions, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ar' ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error(language === 'ar' ? 'خطأ في تصدير البيانات' : 'Error exporting data');
    }
  };

  const messages = {
    ar: {
      profile: 'الملف الشخصي',
      security: 'الأمان',
      notifications: 'الإشعارات',
      data: 'البيانات',
      language: 'اللغة',
      username: 'اسم المستخدم',
      email: 'البريد الإلكتروني',
      fullName: 'الاسم الكامل',
      save: 'حفظ',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      changePassword: 'تغيير كلمة المرور',
      emailNotifications: 'إشعارات البريد الإلكتروني',
      pushNotifications: 'الإشعارات المباشرة',
      exportData: 'تصدير البيانات',
      selectLanguage: 'اختر اللغة',
      arabic: 'العربية',
      english: 'English'
    },
    en: {
      profile: 'Profile',
      security: 'Security',
      notifications: 'Notifications', 
      data: 'Data',
      language: 'Language',
      username: 'Username',
      email: 'Email',
      fullName: 'Full Name',
      save: 'Save',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      changePassword: 'Change Password',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      exportData: 'Export Data',
      selectLanguage: 'Select Language',
      arabic: 'العربية',
      english: 'English'
    }
  };

  const msg = messages[language];

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            {msg.profile}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            {msg.security}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            {msg.notifications}
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Download size={16} />
            {msg.data}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe size={16} />
            {msg.language}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{msg.profile}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{msg.username}</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{msg.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">{msg.fullName}</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : msg.save}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{msg.security}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{msg.currentPassword}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">{msg.newPassword}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{msg.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              
              <Button onClick={handlePasswordChange} disabled={loading}>
                {loading ? (language === 'ar' ? 'جاري التغيير...' : 'Changing...') : msg.changePassword}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{msg.notifications}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ 
                    ...prev, 
                    emailNotifications: checked 
                  }))}
                />
                <Label htmlFor="emailNotifications">{msg.emailNotifications}</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="pushNotifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ 
                    ...prev, 
                    pushNotifications: checked 
                  }))}
                />
                <Label htmlFor="pushNotifications">{msg.pushNotifications}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>{msg.data}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExportData} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {msg.exportData}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{msg.language}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>{msg.selectLanguage}</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="arabic"
                    name="language"
                    checked={language === 'ar'}
                    onChange={() => setLanguage('ar')}
                  />
                  <Label htmlFor="arabic">{msg.arabic}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="english"
                    name="language"
                    checked={language === 'en'}
                    onChange={() => setLanguage('en')}
                  />
                  <Label htmlFor="english">{msg.english}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
