
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, ArrowLeft } from 'lucide-react';

interface PasswordResetFormProps {
  onBack: () => void;
}

const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`
      });

      if (error) {
        toast({
          title: "خطأ",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "تم الإرسال",
          description: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
        });
        onBack();
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="holo-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary glow-text font-['Orbitron']">
          استعادة كلمة المرور
        </CardTitle>
        <p className="text-muted-foreground">
          أدخل بريدك الإلكتروني لاستعادة كلمة المرور
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-primary mb-2">
              البريد الإلكتروني
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="quantum-input w-full"
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="neural-btn w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            العودة لتسجيل الدخول
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
