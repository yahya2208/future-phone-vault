
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Download, Key } from 'lucide-react';

const AdminPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activationCodes, setActivationCodes] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user } = useAuth();

  React.useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = () => {
    if (user?.email === 'yahyamanouni2@gmail.com') {
      setIsAdmin(true);
    }
  };

  const generateActivationCodes = async () => {
    setIsGenerating(true);
    try {
      const codes: string[] = [];
      
      // توليد 200 كود
      for (let i = 0; i < 200; i++) {
        const code = `PV-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        // إدراج الكود في قاعدة البيانات
        const { error } = await supabase
          .from('activation_codes')
          .insert({
            code_hash: code,
            user_email: 'yahyamanouni2@gmail.com',
            subscription_duration_months: 12,
            code_type: 'subscription',
            created_by_admin: true
          });

        if (!error) {
          codes.push(code);
        }
      }

      setActivationCodes(codes);
      
      toast({
        title: language === 'ar' ? "تم توليد الأكواد" : "Codes Generated",
        description: language === 'ar' ? `تم توليد ${codes.length} كود تفعيل` : `Generated ${codes.length} activation codes`
      });

    } catch (error) {
      console.error('Generate codes error:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCodes = () => {
    const codesText = activationCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activation_codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          {language === 'ar' ? 'غير مصرح لك بالوصول لهذه الصفحة' : 'You are not authorized to access this page'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Key size={20} />
            {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Panel'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300">
              {language === 'ar' ? 'مرحباً بك في لوحة تحكم الأدمن. يمكنك هنا إدارة أكواد التفعيل.' : 'Welcome to the Admin Panel. Here you can manage activation codes.'}
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={generateActivationCodes}
              disabled={isGenerating}
              className="w-full"
            >
              <Key className="mr-2 h-4 w-4" />
              {isGenerating 
                ? (language === 'ar' ? 'جاري توليد الأكواد...' : 'Generating Codes...') 
                : (language === 'ar' ? 'توليد 200 كود تفعيل' : 'Generate 200 Activation Codes')
              }
            </Button>

            {activationCodes.length > 0 && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    {language === 'ar' ? `تم توليد ${activationCodes.length} كود تفعيل بنجاح!` : `Successfully generated ${activationCodes.length} activation codes!`}
                  </p>
                </div>

                <Button 
                  onClick={downloadCodes}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'تحميل الأكواد' : 'Download Codes'}
                </Button>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <h3 className="font-semibold mb-2">
                    {language === 'ar' ? 'معاينة الأكواد:' : 'Code Preview:'}
                  </h3>
                  <div className="space-y-1 text-sm font-mono">
                    {activationCodes.slice(0, 10).map((code, index) => (
                      <div key={index} className="p-1 bg-white dark:bg-gray-800 rounded border">
                        {code}
                      </div>
                    ))}
                    {activationCodes.length > 10 && (
                      <div className="text-muted-foreground text-center py-2">
                        {language === 'ar' ? `... و ${activationCodes.length - 10} كود آخر` : `... and ${activationCodes.length - 10} more codes`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
