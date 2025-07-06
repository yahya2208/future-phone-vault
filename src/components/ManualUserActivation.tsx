
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ManualUserActivation = () => {
  const [isActivating, setIsActivating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const searchUser = async () => {
    if (!username.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال الاسم المستعار" : "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setFoundUser(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${username.trim()},username.ilike.%${username.trim()}%`)
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: language === 'ar' ? "لم يتم العثور على المستخدم" : "User Not Found",
          description: language === 'ar' ? `لا يوجد مستخدم بالاسم "${username.trim()}"` : `No user found with username "${username.trim()}"`,
          variant: "destructive"
        });
        return;
      }

      setFoundUser(data);
      toast({
        title: language === 'ar' ? "تم العثور على المستخدم" : "User Found",
        description: language === 'ar' ? `العثور على: ${data.username}` : `Found: ${data.username}`
      });

    } catch (error) {
      console.error('Search user error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ أثناء البحث" : "Error occurred while searching",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const activateUser = async () => {
    if (!foundUser) return;

    setIsActivating(true);
    try {
      // تحديث بيانات المستخدم
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan_type: 'premium',
          max_transactions: 999999,
          subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', foundUser.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // إنشاء سجل تفعيل
      const { error: activationError } = await supabase
        .from('user_activations')
        .upsert({
          user_id: foundUser.id,
          user_email: foundUser.email,
          is_activated: true,
          activated_at: new Date().toISOString(),
          trial_ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          max_trial_transactions: 999999,
          used_trial_transactions: 0,
          activation_type: 'manual'
        }, {
          onConflict: 'user_id'
        });

      if (activationError) {
        console.error('Activation error:', activationError);
      }

      toast({
        title: language === 'ar' ? "تم التفعيل بنجاح" : "Activation Successful",
        description: language === 'ar' ? `تم تفعيل حساب ${foundUser.username} بنجاح` : `Successfully activated ${foundUser.username}'s account`
      });

      setFoundUser(null);
      setUsername('');

    } catch (error) {
      console.error('Activate user error:', error);
      toast({
        title: language === 'ar' ? "فشل التفعيل" : "Activation Failed",
        description: language === 'ar' ? "فشل في تفعيل الحساب" : "Failed to activate account",
        variant: "destructive"
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <UserCheck size={20} />
          {language === 'ar' ? 'التفعيل اليدوي للمستخدمين' : 'Manual User Activation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              {language === 'ar' ? 'الاسم المستعار' : 'Username'}
            </Label>
            <div className="flex gap-2">
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل الاسم المستعار' : 'Enter username'}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && !isSearching && searchUser()}
                disabled={isSearching}
              />
              <Button 
                onClick={searchUser} 
                variant="outline"
                disabled={isSearching || !username.trim()}
              >
                <Search className="h-4 w-4 mr-1" />
                {isSearching ? (language === 'ar' ? 'بحث...' : 'Searching...') : (language === 'ar' ? 'بحث' : 'Search')}
              </Button>
            </div>
          </div>

          {foundUser && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
                {language === 'ar' ? 'تم العثور على المستخدم:' : 'User Found:'}
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>{language === 'ar' ? 'الاسم:' : 'Username:'}</strong> {foundUser.username}</p>
                <p><strong>{language === 'ar' ? 'الإيميل:' : 'Email:'}</strong> {foundUser.email}</p>
                <p><strong>{language === 'ar' ? 'نوع الخطة:' : 'Plan Type:'}</strong> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    foundUser.plan_type === 'premium' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {foundUser.plan_type || 'trial'}
                  </span>
                </p>
              </div>
              
              <Button 
                onClick={activateUser}
                disabled={isActivating}
                className="w-full mt-4"
                size="lg"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {isActivating 
                  ? (language === 'ar' ? 'جاري التفعيل...' : 'Activating...') 
                  : (language === 'ar' ? 'تفعيل الحساب (الدفع مسبق)' : 'Activate Account (Pre-paid)')
                }
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualUserActivation;
