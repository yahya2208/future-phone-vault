import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Upload, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from './ProfileSettings';

// Interface that matches the database schema
type SubscriptionStatus = 'trial' | 'active';

interface UserProfileData {
  display_name: string;
  bio: string;
  avatar_url: string;
  phone: string;
  location: string;
  id?: string;
  email?: string;
  username?: string;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  subscription_status?: SubscriptionStatus;
  plan_type?: string;
  max_transactions?: number;
  trial_transactions_used?: number;
  subscription_expires_at?: string | null;
}

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileData>({
    display_name: '',
    bio: '',
    avatar_url: '',
    phone: '',
    location: '',
    subscription_status: 'trial',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(prev => ({
            ...prev,
            ...data,
            email: authUser.email || data.email,
          }));
          
          if (data.avatar_url) {
            setAvatarPreview(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: language === 'ar' ? 'خطأ' : 'Error',
          description: language === 'ar' 
            ? 'حدث خطأ أثناء تحميل الملف الشخصي' 
            : 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [authUser, language, toast]);

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar to storage
  const uploadAvatar = async () => {
    if (!avatarFile || !authUser) {
      console.error('No file or user found');
      return null;
    }
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو GIF' 
          : 'File type not supported. Please upload a JPG, PNG, or GIF image',
        variant: 'destructive',
      });
      return null;
    }

    // التحقق من حجم الملف (5 ميجابايت كحد أقصى)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' 
          : 'File is too large. Maximum size is 5MB',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // تمت إزالة 'avatars/' من المسار
      
      console.log('Uploading file:', { fileName, size: avatarFile.size, type: avatarFile.type });
      
      // رفع الملف مع خيارات إضافية
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', uploadData);
      
      // الحصول على رابط عام
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? `حدث خطأ أثناء رفع الصورة: ${error.message || 'يرجى المحاولة مرة أخرى'}` 
          : `Failed to upload avatar: ${error.message || 'Please try again'}`,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!authUser) return;
    
    try {
      setIsSaving(true);
      
      let avatarUrl = profile.avatar_url;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const newAvatarUrl = await uploadAvatar();
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }
      
      // Update profile
      const updates = {
        ...profile,
        id: authUser.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
        
      if (error) throw error;
      
      toast({
        title: language === 'ar' ? 'تم الحفظ' : 'Saved',
        description: language === 'ar' 
          ? 'تم تحديث الملف الشخصي بنجاح' 
          : 'Profile updated successfully',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' 
          ? 'حدث خطأ أثناء حفظ التغييرات' 
          : 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 ml-2" />
            {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Mail className="w-4 h-4 ml-2" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إدارة معلومات حسابك الشخصية' 
                  : 'Manage your account information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>
                      {profile.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>{language === 'ar' ? 'تغيير الصورة' : 'Change photo'}</span>
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={!isEditing}
                      />
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'ar' 
                        ? 'JPG, GIF أو PNG بحد أقصى 2 ميجابايت' 
                        : 'JPG, GIF or PNG. Max 2MB.'}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">
                      {language === 'ar' ? 'الاسم المعروض' : 'Display Name'}
                    </Label>
                    <Input
                      id="display_name"
                      value={profile.display_name || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder={language === 'ar' ? 'اسمك المعروض' : 'Your display name'}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || ''}
                      disabled
                      className="opacity-70"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder={language === 'ar' ? 'رقم هاتفك' : 'Your phone number'}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      {language === 'ar' ? 'الموقع' : 'Location'}
                    </Label>
                    <Input
                      id="location"
                      value={profile.location || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder={language === 'ar' ? 'موقعك' : 'Your location'}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">
                      {language === 'ar' ? 'نبذة عنك' : 'About'}
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder={language === 'ar' ? 'أخبرنا عن نفسك...' : 'Tell us about yourself...'}
                      className="min-h-[100px]"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form if needed
                        }}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 ml-2" />
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 ml-2" />
                            {language === 'ar' ? 'حفظ التغييرات' : 'Save changes'}
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <ProfileSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
