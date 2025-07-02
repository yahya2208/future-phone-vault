
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
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileData {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone: string;
  location: string;
  subscription_status: string;
  trial_transactions_used: number;
  max_trial_transactions: number;
  is_admin?: boolean;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfileData>({
    display_name: '',
    bio: '',
    avatar_url: '',
    phone: '',
    location: '',
    subscription_status: 'trial',
    trial_transactions_used: 0,
    max_trial_transactions: 3
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkActivationStatus();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      // التحقق من وجود ملف شخصي
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // إنشاء ملف شخصي جديد إذا لم يكن موجوداً
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user?.id,
            username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'مستخدم جديد',
            email: user?.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        // إعادة جلب الملف الشخصي بعد الإنشاء
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single();

        if (newProfile) {
          setProfile(prev => ({
            ...prev,
            display_name: newProfile.username || '',
            is_admin: user?.email === 'yahyamanouni2@gmail.com'
          }));
        }
      } else if (existingProfile) {
        setProfile(prev => ({
          ...prev,
          display_name: existingProfile.username || '',
          is_admin: user?.email === 'yahyamanouni2@gmail.com'
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkActivationStatus = async () => {
    if (!user) return;
    
    try {
      // Check if user is admin
      if (user.email === 'yahyamanouni2@gmail.com') {
        try {
          console.log('Checking admin activation status for user:', user.id);
          
          // First, update the profile to set admin status
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              is_admin: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

          if (profileError) {
            // If the error is about subscription_status column, try without it
            if (profileError.message.includes('subscription_status')) {
              console.log('subscription_status column not found, updating without it');
            } else {
              console.error('Error updating admin profile:', profileError);
              throw profileError;
            }
          }

          console.log('Admin profile updated successfully');
          
          // Update local state to reflect admin status and active subscription
          setProfile(prev => ({
            ...prev,
            is_admin: true,
            subscription_status: 'active',
            trial_transactions_used: 0,
            max_trial_transactions: 999999  // Set a high limit for admin
          }));
          
          console.log('Admin activation completed successfully');
        } catch (error) {
          console.error('Error in admin activation:', error);
          toast({
            title: language === 'ar' ? "خطأ" : "Error",
            description: language === 'ar' 
              ? "حدث خطأ أثناء تفعيل صلاحيات الأدمن" 
              : "An error occurred while activating admin privileges",
            variant: "destructive"
          });
          return;
        }

        // تحديث حالة الملف الشخصي
        setProfile(prev => ({
          ...prev,
          subscription_status: 'active',
          is_admin: true,
          trial_transactions_used: 0,
          max_trial_transactions: 999999
        }));
        return;
      }

      // التحقق من حالة التفعيل للمستخدمين العاديين
      const { data: activationData } = await supabase
        .from('user_activations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (activationData && activationData.is_activated) {
        setProfile(prev => ({
          ...prev,
          subscription_status: 'active',
          trial_transactions_used: activationData.trial_transactions_used || 0,
          max_trial_transactions: activationData.max_trial_transactions || 3
        }));
      } else {
        // حساب المعاملات المستخدمة من جدول المعاملات
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', user.id);

        const transactionCount = transactionsData?.length || 0;
        
        setProfile(prev => ({
          ...prev,
          subscription_status: 'trial',
          trial_transactions_used: transactionCount,
          max_trial_transactions: 3
        }));
      }
    } catch (error) {
      console.error('Error checking activation status:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.display_name,
          email: user.email || '',
          updated_at: new Date().toISOString()
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
    'https://api.dicebear.com/7.x/avataaars/svg?seed=business&backgroundColor=b6e3f4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=casual&backgroundColor=c0aede',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=formal&backgroundColor=d1d4f9',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=creative&backgroundColor=fecaca',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=friendly&backgroundColor=fed7aa',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=professional&backgroundColor=bbf7d0',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=smart&backgroundColor=fef3c7',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=elegant&backgroundColor=e0e7ff',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=modern&backgroundColor=f3e8ff',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=classic&backgroundColor=fce7f3'
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-primary">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        {language === 'ar' ? (
          <>
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة
          </>
        ) : (
          <>
            <ArrowRight className="mr-2 h-4 w-4" />
            Back
          </>
        )}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <User size={20} />
            {language === 'ar' ? 'الملف الشخصي' : 'User Profile'}
            {profile.is_admin && (
              <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">
                {language === 'ar' ? 'أدمن' : 'Admin'}
              </span>
            )}
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
            
            <div className="grid grid-cols-5 gap-3">
              {avatarOptions.map((avatarUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarChange(avatarUrl)}
                  className={`w-14 h-14 rounded-full border-2 transition-all duration-200 hover:scale-105 ${
                    profile.avatar_url === avatarUrl 
                      ? 'border-primary border-4 shadow-lg' 
                      : 'border-muted-foreground/20 hover:border-primary/50'
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
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="font-semibold text-foreground mb-2">
              {language === 'ar' ? 'حالة الاشتراك' : 'Subscription Status'}
            </h3>
            <div className="space-y-1 text-sm text-foreground">
              <p>
                <strong>{language === 'ar' ? 'الحالة:' : 'Status:'}</strong>{' '}
                <span className={profile.subscription_status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                  {profile.subscription_status === 'active' 
                    ? (language === 'ar' ? 'نشط' : 'Active')
                    : (language === 'ar' ? 'تجريبي' : 'Trial')
                  }
                </span>
              </p>
              <p>
                <strong>{language === 'ar' ? 'المعاملات المستخدمة:' : 'Transactions Used:'}</strong>{' '}
                <span className="text-foreground">{profile.trial_transactions_used} / {profile.max_trial_transactions}</span>
              </p>
              {profile.is_admin && (
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {language === 'ar' ? 'أنت مسؤول النظام - صلاحيات كاملة' : 'You are system administrator - Full privileges'}
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
