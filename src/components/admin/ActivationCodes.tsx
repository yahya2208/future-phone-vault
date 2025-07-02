import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Copy, Plus, Trash2 } from 'lucide-react';

export interface ActivationCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
  expires_at: string | null;
  max_uses: number;
  current_uses: number;
  plan_type: string;
  is_active: boolean;
}

const ActivationCodes = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCode, setNewCode] = useState({
    code: '',
    plan_type: 'monthly',
    max_uses: 1,
    expires_in_days: 30
  });

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('activation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast({
        title: t('error'),
        description: t('errorFetchingCodes'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email === 'yahyamanouni2@gmail.com') {
      fetchCodes();
    }
  }, [user]);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateCode = () => {
    const code = generateCode();
    setNewCode({ ...newCode, code });
  };

  const handleCreateCode = async () => {
    if (!newCode.code) {
      toast({
        title: t('error'),
        description: t('codeRequired'),
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newCode.expires_in_days);

      const { error } = await supabase.from('activation_codes').insert([
        {
          code: newCode.code,
          plan_type: newCode.plan_type,
          max_uses: newCode.max_uses,
          expires_at: expiresAt.toISOString(),
          created_by: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('codeGeneratedSuccessfully'),
      });

      setNewCode({
        code: '',
        plan_type: 'monthly',
        max_uses: 1,
        expires_in_days: 30,
      });

      await fetchCodes();
    } catch (error) {
      console.error('Error creating code:', error);
      toast({
        title: t('error'),
        description: t('errorGeneratingCode'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm(t('confirmDeleteCode'))) return;

    try {
      const { error } = await supabase
        .from('activation_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('codeDeletedSuccessfully'),
      });

      await fetchCodes();
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: t('error'),
        description: t('errorDeletingCode'),
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('copied'),
      description: t('codeCopiedToClipboard'),
    });
  };

  if (user?.email !== 'yahyamanouni2@gmail.com') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">
          {t('adminAccessRequired')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('generateNewCode')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t('activationCode')}</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                  placeholder="XXXX-XXXX-XXXX"
                />
                <Button type="button" onClick={handleGenerateCode} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('generate')}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan_type">{t('planType')}</Label>
              <Select
                value={newCode.plan_type}
                onValueChange={(value) => setNewCode({ ...newCode, plan_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectPlan')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t('monthly')}</SelectItem>
                  <SelectItem value="yearly">{t('yearly')}</SelectItem>
                  <SelectItem value="lifetime">{t('lifetime')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_uses">{t('maxUses')}</Label>
              <Input
                id="max_uses"
                type="number"
                min="1"
                value={newCode.max_uses}
                onChange={(e) => setNewCode({ ...newCode, max_uses: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_in_days">
                {t('expiresInDays')}
              </Label>
              <Input
                id="expires_in_days"
                type="number"
                min="1"
                value={newCode.expires_in_days}
                onChange={(e) => setNewCode({ ...newCode, expires_in_days: parseInt(e.target.value) || 30 })}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button 
              onClick={handleCreateCode}
              disabled={isGenerating || !newCode.code}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('createCode')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('activationCodes')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('code')}</TableHead>
                    <TableHead>{t('planType')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('uses')}</TableHead>
                    <TableHead>{t('expires')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {t('noCodesFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    codes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono">
                          <div className="flex items-center space-x-2">
                            <span>{code.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(code.code)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="sr-only">{t('copy')}</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {code.plan_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          {code.is_used ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {t('used')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {t('active')}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {code.current_uses} / {code.max_uses}
                        </TableCell>
                        <TableCell>
                          {code.expires_at ? new Date(code.expires_at).toLocaleDateString() : t('never')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('delete')}</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivationCodes;
