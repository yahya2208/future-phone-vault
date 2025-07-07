import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ProfileSettings() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      // Update email in auth
      const { error: updateError } = await supabase.auth.updateUser(
        { email }
      );
      
      if (updateError) throw updateError;
      
      // Update email in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Email updated successfully
      
      toast.success(language === 'ar' ? 'تم تحديث البريد الإلكتروني بنجاح' : 'Email updated successfully');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء تحديث البريد الإلكتروني' : 'Error updating email');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{language === 'ar' ? 'الإعدادات الشخصية' : 'Profile Settings'}</CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'إدارة معلومات حسابك الشخصي' 
            : 'Manage your account information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateEmail} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating 
                  ? language === 'ar' ? 'جاري الحفظ...' : 'Saving...'
                  : language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
