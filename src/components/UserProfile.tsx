
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';

interface UserProfileData {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone: string;
  location: string;
  subscription_status: string;
  subscription_expires_at: string | null;
  trial_transactions_used: number;
  max_trial_transactions: number;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData>({
    display_name: '',
    bio: '',
    avatar_url: '',
    phone: '',
    location: '',
    subscription_status: 'trial',
    subscription_expires_at: null,
    trial_transactions_used: 0,
    max_trial_transactions: 3
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // استخدام raw SQL للاستعلام المباشر
      const { data, error } = await supabase
        .rpc('execute_sql', {
          query: `SELECT * FROM user_profiles WHERE user_id = '${user?.id}' LIMIT 1`
        })
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // استخدام raw SQL للتحديث
      const { error } = await supabase.rpc('execute_sql', {
        query: `
          INSERT INTO user_profiles (
            user_id, display_name, bio, avatar_url, phone, location, updated_at
          ) VALUES (
            '${user.id}', 
            '${profile.display_name}', 
            '${profile.bio}', 
            '${profile.avatar_url}', 
            '${profile.phone}', 
            '${profile.location}', 
            '${new Date().toISOString()}'
          )
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            display_name = EXCLUDED.display_name,
            bio = EXCLUDED.bio,
            avatar_url = EXCLUDED.avatar_url,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            updated_at = EXCLUDED.updated_at
        `
      });

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "حدث خطأ أثناء حفظ الملف الشخصي" : "Error saving profile",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: language === 'ar' ? "تم الحفظ" : "Saved",
        description: language === 'ar' ? "تم حفظ الملف الشخصي بنجاح" : "Profile saved successfully"
      });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-primary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <User size={20} />
            {language === 'ar' ? 'الملف الشخصي' : 'User Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                <User size={32} />
              </AvatarFallback>
            </Avatar>
            
            <div className="grid grid-cols-3 gap-2">
              {avatarOptions.map((avatarUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarChange(avatarUrl)}
                  className={`w-12 h-12 rounded-full border-2 ${
                    profile.avatar_url === avatarUrl ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Avatar className="w-full h-full">
                    <AvatarImage src={avatarUrl} />
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">
                {language === 'ar' ? 'الاسم المعروض' : 'Display Name'}
              </Label>
              <Input
                id="display_name"
                value={profile.display_name}
                onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder={language === 'ar' ? 'اسمك المعروض' : 'Your display name'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {language === 'ar' ? 'نبذة شخصية' : 'Bio'}
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={language === 'ar' ? 'نبذة مختصرة عنك' : 'A short bio about yourself'}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={language === 'ar' ? '+970xxxxxxxx' : '+970xxxxxxxx'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={language === 'ar' ? 'مدينتك' : 'Your city'}
                />
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {language === 'ar' ? 'حالة الاشتراك' : 'Subscription Status'}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>{language === 'ar' ? 'الحالة:' : 'Status:'}</strong>{' '}
                <span className={profile.subscription_status === 'active' ? 'text-green-600' : 'text-orange-600'}>
                  {profile.subscription_status === 'active' 
                    ? (language === 'ar' ? 'نشط' : 'Active')
                    : (language === 'ar' ? 'تجريبي' : 'Trial')
                  }
                </span>
              </p>
              <p>
                <strong>{language === 'ar' ? 'المعاملات المستخدمة:' : 'Transactions Used:'}</strong>{' '}
                {profile.trial_transactions_used} / {profile.max_trial_transactions}
              </p>
              {profile.subscription_expires_at && (
                <p>
                  <strong>{language === 'ar' ? 'ينتهي في:' : 'Expires:'}</strong>{' '}
                  {new Date(profile.subscription_expires_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              )}
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
            {isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
