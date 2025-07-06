
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, Key, Copy, Check } from 'lucide-react';

const SimpleCodeGenerator = () => {
  const [codes, setCodes] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const generateCodes = () => {
    setIsGenerating(true);
    const newCodes: string[] = [];
    
    // توليد 200 كود فريد
    for (let i = 0; i < 200; i++) {
      const code = `PV-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      newCodes.push(code);
    }
    
    setCodes(newCodes);
    setIsGenerating(false);
    
    toast({
      title: language === 'ar' ? "تم توليد الأكواد" : "Codes Generated",
      description: language === 'ar' ? "تم توليد 200 كود تفعيل بنجاح" : "Successfully generated 200 activation codes"
    });
  };

  const copyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      toast({
        title: language === 'ar' ? "تم النسخ" : "Copied",
        description: language === 'ar' ? "تم نسخ الكود بنجاح" : "Code copied successfully"
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "فشل في نسخ الكود" : "Failed to copy code",
        variant: "destructive"
      });
    }
  };

  const downloadCodes = () => {
    const codesText = codes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activation_codes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAllCodes = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      toast({
        title: language === 'ar' ? "تم النسخ" : "Copied",
        description: language === 'ar' ? "تم نسخ جميع الأكواد بنجاح" : "All codes copied successfully"
      });
    } catch (error) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "فشل في نسخ الأكواد" : "Failed to copy codes",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Key size={20} />
          {language === 'ar' ? 'توليد أكواد التفعيل' : 'Generate Activation Codes'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Button 
            onClick={generateCodes}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            <Key className="mr-2 h-4 w-4" />
            {isGenerating 
              ? (language === 'ar' ? 'جاري توليد الأكواد...' : 'Generating Codes...') 
              : (language === 'ar' ? 'توليد 200 كود تفعيل' : 'Generate 200 Activation Codes')
            }
          </Button>

          {codes.length > 0 && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  {language === 'ar' ? `تم توليد ${codes.length} كود تفعيل بنجاح!` : `Successfully generated ${codes.length} activation codes!`}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                  {language === 'ar' 
                    ? 'يمكنك الآن تحميل الأكواد أو نسخها وتقديمها للعملاء بعد الدفع' 
                    : 'You can now download or copy the codes and provide them to customers after payment'
                  }
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={downloadCodes}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'تحميل الأكواد' : 'Download Codes'}
                </Button>
                
                <Button 
                  onClick={copyAllCodes}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'نسخ جميع الأكواد' : 'Copy All Codes'}
                </Button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-60 overflow-y-auto">
                <h3 className="font-semibold mb-2">
                  {language === 'ar' ? 'معاينة الأكواد (أول 20 كود):' : 'Code Preview (First 20 codes):'}
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  {codes.slice(0, 20).map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border">
                      <span className="text-gray-900 dark:text-gray-100 font-bold text-base select-all">
                        {code}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCode(code, index)}
                        className="ml-2"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                  {codes.length > 20 && (
                    <div className="text-muted-foreground text-center py-2">
                      {language === 'ar' ? `... و ${codes.length - 20} كود آخر` : `... and ${codes.length - 20} more codes`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleCodeGenerator;
