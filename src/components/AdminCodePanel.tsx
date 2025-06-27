
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Crown, Gift, Clock, Shield } from 'lucide-react';
import { useActivation } from '@/hooks/useActivation';
import { useToast } from '@/hooks/use-toast';

const AdminCodePanel = () => {
  const { userActivation, generateOwnerCode, generateGiftCodes, generateLifetimeCodes } = useActivation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);
  const [showCodesModal, setShowCodesModal] = useState(false);
  const [codeType, setCodeType] = useState<string>('');

  if (!userActivation?.isAdmin) {
    return (
      <Card className="border-red-500/30 bg-red-50/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="text-red-500" size={20} />
            <span className="text-red-700 font-semibold">
              غير مصرح - يجب أن تكون مدير للوصول لهذه اللوحة
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الكود إلى الحافظة",
    });
  };

  const handleGenerateOwnerCode = async () => {
    setIsGenerating(true);
    const code = await generateOwnerCode();
    if (code) {
      setGeneratedCodes([{ code, type: 'owner' }]);
      setCodeType('كود المالك');
      setShowCodesModal(true);
    }
    setIsGenerating(false);
  };

  const handleGenerateGiftCodes = async () => {
    setIsGenerating(true);
    const codes = await generateGiftCodes();
    if (codes.length > 0) {
      setGeneratedCodes(codes.map(c => ({ code: c.gift_code, number: c.code_number, type: 'gift' })));
      setCodeType('أكواد الهدايا (10 أكواد)');
      setShowCodesModal(true);
    }
    setIsGenerating(false);
  };

  const handleGenerateLifetimeCodes = async () => {
    setIsGenerating(true);
    const codes = await generateLifetimeCodes();
    if (codes.length > 0) {
      setGeneratedCodes(codes.map(c => ({ code: c.lifetime_code, number: c.code_number, type: 'lifetime' })));
      setCodeType('الأكواد الأبدية (100 كود)');
      setShowCodesModal(true);
    }
    setIsGenerating(false);
  };

  const exportCodes = () => {
    const codesText = generatedCodes.map(c => 
      c.number ? `${c.number}. ${c.code}` : c.code
    ).join('\n');
    
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${codeType.replace(/[^a-zA-Z0-9]/g, '_')}_codes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="holo-card border-purple-500/30 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-purple-800">
            <Crown className="text-purple-600" size={24} />
            لوحة تحكم المدير
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
              مدير
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleGenerateOwnerCode}
              disabled={isGenerating}
              className="neural-btn bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            >
              <Crown size={18} className="mr-2" />
              إنشاء كود المالك
            </Button>

            <Button
              onClick={handleGenerateGiftCodes}
              disabled={isGenerating}
              className="neural-btn bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
            >
              <Gift size={18} className="mr-2" />
              إنشاء 10 أكواد هدايا
            </Button>

            <Button
              onClick={handleGenerateLifetimeCodes}
              disabled={isGenerating}
              className="neural-btn bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              <Clock size={18} className="mr-2" />
              إنشاء 100 كود أبدي
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-2">ملاحظات مهمة:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• كود المالك: صلاحيات إدارية كاملة (10 سنوات)</li>
              <li>• أكواد الهدايا: تفعيل مجاني للعملاء (سنة واحدة)</li>
              <li>• الأكواد الأبدية: تفعيل مدى الحياة للبيع (50 سنة)</li>
              <li>• جميع الأكواد آمنة ومشفرة</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCodesModal} onOpenChange={setShowCodesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Shield className="text-primary" size={24} />
              {codeType}
              <Button onClick={exportCodes} variant="outline" size="sm">
                تصدير الأكواد
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2">
            {generatedCodes.map((codeData, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {codeData.number && (
                    <Badge variant="secondary">#{codeData.number}</Badge>
                  )}
                  <code className="font-mono text-sm bg-white px-2 py-1 rounded border">
                    {codeData.code}
                  </code>
                  {codeData.type === 'owner' && <Crown size={16} className="text-purple-600" />}
                  {codeData.type === 'gift' && <Gift size={16} className="text-green-600" />}
                  {codeData.type === 'lifetime' && <Clock size={16} className="text-blue-600" />}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(codeData.code)}
                >
                  <Copy size={16} />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>تحذير أمني:</strong> احفظ هذه الأكواد في مكان آمن. لن تظهر مرة أخرى لأسباب أمنية.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCodePanel;
