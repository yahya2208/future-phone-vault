'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Search, Copy, Trash2, RefreshCw } from 'lucide-react';

interface License {
  id: string;
  license_key: string;
  user_id: string | null;
  is_active: boolean;
  max_devices: number;
  expires_at: string | null;
  created_at: string;
  notes: string | null;
  user_email?: string;
  devices_count?: number;
}

export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [newLicense, setNewLicense] = useState({
    max_devices: 1,
    days_valid: 30,
    notes: '',
  });
  
  const { toast } = useToast();
  const supabase = createClient();

  // Fetch all licenses
  const fetchLicenses = async () => {
    try {
      setIsLoading(true);
      
      // First, get all licenses with user emails
      const { data: licensesData, error: licensesError } = await supabase
        .from('license_keys')
        .select(`
          *,
          user:profiles(email)
        `);
      
      if (licensesError) throw licensesError;
      
      // Then get device counts for each license
      const licensesWithCounts = await Promise.all(
        licensesData.map(async (license) => {
          const { count, error: countError } = await supabase
            .from('activated_devices')
            .select('*', { count: 'exact', head: true })
            .eq('license_key_id', license.id)
            .eq('is_active', true);
          
          if (countError) {
            console.error('Error fetching device count:', countError);
            return { ...license, devices_count: 0 };
          }
          
          return {
            ...license,
            user_email: license.user?.email || 'غير مرتبط بمستخدم',
            devices_count: count || 0,
          };
        })
      );
      
      setLicenses(licensesWithCounts);
    } catch (error) {
      console.error('Error fetching licenses:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء جلب بيانات التراخيص',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new license key
  const generateLicenseKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    
    for (let i = 0; i < 4; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    
    return segments.join('-');
  };

  // Create a new license
  const handleCreateLicense = async () => {
    if (!newLicense.max_devices || !newLicense.days_valid) {
      toast({
        title: 'خطأ',
        description: 'الرجاء تعبئة جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsCreating(true);
      
      const licenseKey = `LIC-${generateLicenseKey()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newLicense.days_valid);
      
      const { data, error } = await supabase
        .from('license_keys')
        .insert([
          {
            license_key: licenseKey,
            max_devices: newLicense.max_devices,
            expires_at: expiresAt.toISOString(),
            notes: newLicense.notes || null,
            is_active: true,
          },
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'تم بنجاح',
        description: 'تم إنشاء الترخيص بنجاح',
      });
      
      // Reset form
      setNewLicense({
        max_devices: 1,
        days_valid: 30,
        notes: '',
      });
      
      // Refresh licenses list
      await fetchLicenses();
    } catch (error) {
      console.error('Error creating license:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء الترخيص',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle license status
  const toggleLicenseStatus = async (licenseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('license_keys')
        .update({ is_active: !currentStatus })
        .eq('id', licenseId);
      
      if (error) throw error;
      
      toast({
        title: 'تم بنجاح',
        description: `تم ${currentStatus ? 'تعطيل' : 'تفعيل'} الترخيص بنجاح`,
      });
      
      // Refresh licenses list
      await fetchLicenses();
    } catch (error) {
      console.error('Error toggling license status:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث حالة الترخيص',
        variant: 'destructive',
      });
    }
  };

  // Copy license key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ مفتاح الترخيص',
    });
  };

  // Delete a license
  const handleDeleteLicense = async (licenseId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الترخيص؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('license_keys')
        .delete()
        .eq('id', licenseId);
      
      if (error) throw error;
      
      toast({
        title: 'تم بنجاح',
        description: 'تم حذف الترخيص بنجاح',
      });
      
      // Refresh licenses list
      await fetchLicenses();
    } catch (error) {
      console.error('Error deleting license:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف الترخيص',
        variant: 'destructive',
      });
    }
  };

  // Filter licenses based on search and filter
  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = 
      license.license_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (license.user_email && license.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (license.notes && license.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && license.is_active) ||
      (filterStatus === 'inactive' && !license.is_active);
    
    return matchesSearch && matchesStatus;
  });

  // Fetch licenses on component mount
  useEffect(() => {
    fetchLicenses();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">إدارة التراخيص</h1>
          <p className="text-muted-foreground">إدارة وعرض جميع مفاتيح الترخيص</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLicenses}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>إنشاء ترخيص جديد</CardTitle>
            <CardDescription>قم بإنشاء مفتاح ترخيص جديد للعملاء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_devices">الحد الأقصى للأجهزة</Label>
                <Input
                  id="max_devices"
                  type="number"
                  min="1"
                  value={newLicense.max_devices}
                  onChange={(e) => setNewLicense({...newLicense, max_devices: parseInt(e.target.value) || 1})}
                  placeholder="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="days_valid">مدة الصلاحية (أيام)</Label>
                <Input
                  id="days_valid"
                  type="number"
                  min="1"
                  value={newLicense.days_valid}
                  onChange={(e) => setNewLicense({...newLicense, days_valid: parseInt(e.target.value) || 30})}
                  placeholder="30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Input
                  id="notes"
                  value={newLicense.notes}
                  onChange={(e) => setNewLicense({...newLicense, notes: e.target.value})}
                  placeholder="مثال: حزمة الذهبية"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCreateLicense}
              disabled={isCreating}
              className="w-full md:w-auto"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  إنشاء ترخيص جديد
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات التراخيص</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">إجمالي التراخيص</span>
              <span className="font-medium">{licenses.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">التراخيص النشطة</span>
              <span className="font-medium text-green-500">
                {licenses.filter(l => l.is_active).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">التراخيص المنتهية</span>
              <span className="font-medium text-red-500">
                {licenses.filter(l => l.expires_at && new Date(l.expires_at) < new Date()).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">إجمالي الأجهزة المفعلة</span>
              <span className="font-medium">
                {licenses.reduce((sum, license) => sum + (license.devices_count || 0), 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>قائمة التراخيص</CardTitle>
            <CardDescription>عرض وإدارة جميع مفاتيح الترخيص</CardDescription>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={filterStatus}
              onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLicenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              لا توجد تراخيص متطابقة مع معايير البحث
            </div>
          ) : (
            <div className="rounded-md border
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>مفتاح الترخيص</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>الأجهزة</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        {license.license_key}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(license.license_key)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">نسخ</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={license.is_active ? 'default' : 'secondary'}>
                        {license.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {license.user_email || 'غير مرتبط'}
                    </TableCell>
                    <TableCell>
                      {license.devices_count || 0} / {license.max_devices}
                    </TableCell>
                    <TableCell>
                      {license.expires_at 
                        ? new Date(license.expires_at).toLocaleDateString('ar-SA')
                        : 'غير محدد'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleLicenseStatus(license.id, license.is_active)}
                        >
                          {license.is_active ? 'تعطيل' : 'تفعيل'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteLicense(license.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">حذف</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
