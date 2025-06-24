
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  timestamp: Date;
  rating?: number;
}

interface ExportTransactionsProps {
  transactions: Transaction[];
}

const ExportTransactions = ({ transactions }: ExportTransactionsProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "لا توجد معاملات للتصدير",
        variant: "destructive"
      });
      return;
    }

    const headers = ['ID', 'البائع', 'المشتري', 'الماركة', 'الطراز', 'IMEI', 'تاريخ الشراء', 'التقييم', 'تاريخ التسجيل'];
    const csvData = [
      headers.join(','),
      ...transactions.map(t => [
        t.id,
        t.sellerName,
        t.buyerName,
        t.brand,
        t.phoneModel,
        t.imei,
        t.purchaseDate,
        t.rating || 0,
        new Date(t.timestamp).toLocaleDateString('ar-SA')
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gaza-saver-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم التصدير",
      description: `تم تصدير ${transactions.length} معاملة بنجاح`,
    });
  };

  const exportToJSON = () => {
    if (transactions.length === 0) {
      toast({
        title: "لا توجد بيانات",
        description: "لا توجد معاملات للتصدير",
        variant: "destructive"
      });
      return;
    }

    const jsonData = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gaza-saver-transactions-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم التصدير",
      description: `تم تصدير ${transactions.length} معاملة بصيغة JSON`,
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={exportToCSV}
        variant="outline"
        className="flex items-center gap-2"
        disabled={transactions.length === 0}
      >
        <FileSpreadsheet size={16} />
        تصدير CSV
      </Button>
      
      <Button
        onClick={exportToJSON}
        variant="outline"
        className="flex items-center gap-2"
        disabled={transactions.length === 0}
      >
        <FileText size={16} />
        تصدير JSON
      </Button>
    </div>
  );
};

export default ExportTransactions;
