
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import FuturisticHeader from '@/components/FuturisticHeader';
import FooterLinks from '@/components/FooterLinks';
import PasswordResetForm from '@/components/PasswordResetForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال البريد الإلكتروني" : "Please enter email address",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال كلمة المرور" : "Please enter password",
        variant: "destructive"
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (!isLogin) {
      if (!username.trim()) {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "يرجى إدخال اسم المستخدم" : "Please enter username",
          variant: "destructive"
        });
        return false;
      }

      if (username.length < 3) {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" : "Username must be at least 3 characters long",
          variant: "destructive"
        });
        return false;
      }

      // Check for valid username format
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        toast({
          title: language === 'ar' ? "خطأ" : "Error",
          description: language === 'ar' ? "اسم المستخدم يجب أن يحتوي على أحرف وأرقام و _ فقط" : "Username can only contain letters, numbers, and underscores",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login for:', email);
        const { error } = await signIn(email.trim(), password);
        
        if (error) {
          console.error('Login error:', error);
          
          let errorMessage = language === 'ar' ? "حدث خطأ أثناء تسجيل الدخول" : "Login failed";
          
          if (error.message?.includes('Invalid login credentials')) {
            errorMessage = language === 'ar' ? "بيانات الدخول غير صحيحة" : "Invalid email or password";
          } else if (error.message?.includes('Email not confirmed')) {
            errorMessage = language === 'ar' ? "يرجى تأكيد البريد الإلكتروني أولاً" : "Please confirm your email first";
          } else if (error.message?.includes('Too many requests')) {
            errorMessage = language === 'ar' ? "محاولات كثيرة، يرجى المحاولة لاحقاً" : "Too many attempts, please try again later";
          }
          
          toast({
            title: language === 'ar' ? "فشل تسجيل الدخول" : "Login Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          console.log('Login successful');
          toast({
            title: language === 'ar' ? "نجح تسجيل الدخول" : "Login Successful",
            description: language === 'ar' ? "مرحباً بك مرة أخرى!" : "Welcome back!"
          });
        }
      } else {
        console.log('Attempting registration for:', email, 'with username:', username);
        const { error } = await signUp(email.trim(), password, username.trim());
        
        if (error) {
          console.error('Registration error:', error);
          
          let errorMessage = language === 'ar' ? "حدث خطأ أثناء التسجيل" : "Registration failed";
          
          if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
            errorMessage = language === 'ar' ? 
              "هذا البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول أو استخدام بريد آخر" : 
              "This email is already registered. Please login or use a different email";
          } else if (error.message?.includes('اسم المستخدم موجود بالفعل')) {
            errorMessage = language === 'ar' ? "اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر" : "Username already exists, please choose another one";
          } else if (error.message?.includes('Password should be at least')) {
            errorMessage = language === 'ar' ? "كلمة المرور ضعيفة جداً" : "Password is too weak";
          } else if (error.message?.includes('Unable to validate email')) {
            errorMessage = language === 'ar' ? "البريد الإلكتروني غير صالح" : "Invalid email address";
          }
          
          toast({
            title: language === 'ar' ? "فشل التسجيل" : "Registration Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } else {
          console.log('Registration successful');
          toast({
            title: language === 'ar' ? "نجح التسجيل" : "Registration Successful",
            description: language === 'ar' ? 
              "تم إنشاء حسابك بنجاح! يرجى تفقد بريدك الإلكتروني لتأكيد الحساب" : 
              "Account created successfully! Please check your email to confirm your account"
          });
          
          // Clear form and switch to login
          setEmail('');
          setPassword('');
          setUsername('');
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <FuturisticHeader />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md">
              <PasswordResetForm onBack={() => setShowResetForm(false)} />
            </div>
          </div>
          <FooterLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <FuturisticHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin 
                  ? (language === 'ar' ? 'تسجيل الدخول' : 'Login')
                  : (language === 'ar' ? 'إنشاء حساب' : 'Sign Up')
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User size={16} />
                      {language === 'ar' ? 'اسم المستخدم' : 'Username'}
                    </label>
                    <Input
                      type="text"
                      placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter username'}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="text-center"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail size={16} />
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <Input
                    type="email"
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="text-center"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Lock size={16} />
                    {language === 'ar' ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="text-center pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    language === 'ar' ? 'جاري المعالجة...' : 'Processing...'
                  ) : isLogin ? (
                    language === 'ar' ? 'دخول' : 'Login'
                  ) : (
                    language === 'ar' ? 'تسجيل' : 'Sign Up'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setUsername('');
                  }}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  {isLogin 
                    ? (language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : "Don't have an account? Sign up")
                    : (language === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already have an account? Login')
                  }
                </button>
                
                {isLogin && (
                  <div>
                    <button
                      onClick={() => setShowResetForm(true)}
                      className="text-muted-foreground hover:text-primary text-sm hover:underline"
                      disabled={isLoading}
                    >
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <FooterLinks />
      </div>
    </div>
  );
};

export default Auth;
