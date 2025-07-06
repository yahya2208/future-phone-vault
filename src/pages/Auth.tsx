import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordResetForm from '@/components/PasswordResetForm';
import PasswordVisibilityToggle from '@/components/PasswordVisibilityToggle';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check if this is a password reset redirect
    const isReset = searchParams.get('reset');
    if (isReset) {
      setIsResettingPassword(true);
    }
  }, [searchParams]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    return null;
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "تم بنجاح",
          description: "تم تغيير كلمة المرور بنجاح"
        });
        setIsResettingPassword(false);
        navigate('/');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع');
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      } else {
        if (!username.trim()) {
          setError('يرجى إدخال اسم المستخدم');
          setLoading(false);
          return;
        }
        
        // Add basic username validation
        if (username.length < 3) {
          setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
          setLoading(false);
          return;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }

        // Password confirmation
        if (password !== confirmPassword) {
          setError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
          setLoading(false);
          return;
        }
        
        // Check if user already exists first
        const { data: existingUser } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummy'  // We just want to check if email exists
        });

        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
            setError('هذا البريد الإلكتروني مُسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك');
          } else if (error.message.includes('already exists') || error.message.includes('موجود بالفعل')) {
            setError('اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر');
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "تم إنشاء الحساب",
            description: "تم إرسال رابط التفعيل إلى بريدك الإلكتروني"
          });
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes('User already registered')) {
        setError('هذا البريد الإلكتروني مُسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    }
    
    setLoading(false);
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="container mx-auto px-4 max-w-md">
          <PasswordResetForm onBack={() => setShowResetForm(false)} />
        </div>
      </div>
    );
  }

  if (isResettingPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="holo-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary glow-text font-['Orbitron']">
                تعيين كلمة مرور جديدة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="relative">
                  <Label className="block text-sm font-medium text-primary mb-2">
                    كلمة المرور الجديدة
                  </Label>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="quantum-input w-full pr-10"
                    placeholder="أدخل كلمة المرور الجديدة"
                    required
                    minLength={6}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                {error && (
                  <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="neural-btn w-full"
                >
                  {loading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="holo-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary glow-text font-['Orbitron']">
              غزة سايفر
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label className="block text-sm font-medium text-primary mb-2">
                    اسم المستخدم
                  </Label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="quantum-input w-full"
                    placeholder="أدخل اسم المستخدم"
                    required={!isLogin}
                    minLength={3}
                  />
                </div>
              )}
              
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
              
              <div className="relative">
                <Label className="block text-sm font-medium text-primary mb-2">
                  كلمة المرور
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="quantum-input w-full pr-10"
                  placeholder="أدخل كلمة المرور"
                  required
                  minLength={6}
                />
                <PasswordVisibilityToggle
                  isVisible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Label className="block text-sm font-medium text-primary mb-2">
                    تأكيد كلمة المرور
                  </Label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="quantum-input w-full pr-10"
                    placeholder="أعد إدخال كلمة المرور"
                    required={!isLogin}
                    minLength={6}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  {!isLogin && confirmPassword && password !== confirmPassword && (
                    <p className="text-destructive text-xs mt-1">
                      كلمة المرور غير متطابقة
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="neural-btn w-full"
              >
                {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-accent hover:text-accent/80 text-sm block w-full"
              >
                {isLogin ? 'ليس لديك حساب؟ أنشئ حساباً جديداً' : 'لديك حساب؟ سجل الدخول'}
              </button>
              
              {isLogin && (
                <button
                  onClick={() => setShowResetForm(true)}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  نسيت كلمة المرور؟
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
