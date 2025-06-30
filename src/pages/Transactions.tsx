
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import TransactionDetails from '@/components/TransactionDetails';
import ExportTransactions from '@/components/ExportTransactions';
import SearchTransactions from '@/components/SearchTransactions';

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
  sellerPhone?: string;
  sellerEmail?: string;
  buyerEmail?: string;
  simpleDrawing?: string;
}

const Transactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      setIsLoading(false);
      return;
    }

    if (data) {
      const mappedTransactions = data.map(t => ({
        id: t.id,
        sellerName: t.seller_name,
        buyerName: t.buyer_name,
        phoneModel: t.phone_model,
        brand: t.brand,
        imei: t.imei,
        purchaseDate: t.purchase_date,
        timestamp: new Date(t.created_at),
        rating: t.rating,
        sellerPhone: t.seller_phone,
        sellerEmail: t.seller_email,
        buyerEmail: t.buyer_email,
        simpleDrawing: t.simple_drawing
      }));
      setTransactions(mappedTransactions);
      setFilteredTransactions(mappedTransactions);
    }
    setIsLoading(false);
  };

  const handleSearch = (searchTerm: string, brandFilter: string, dateFilter: string) => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.imei.includes(searchTerm)
      );
    }

    if (brandFilter) {
      filtered = filtered.filter(t => t.brand === brandFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(t => t.purchaseDate === dateFilter);
    }

    setFilteredTransactions(filtered);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary glow-text font-['Orbitron']">
          سجل المعاملات
        </h1>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          العودة للرئيسية
        </Button>
      </div>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          <strong>ملاحظة:</strong> جميع المعاملات المسجلة هنا للتوثيق الشخصي فقط وليست وثائق قانونية رسمية
        </p>
      </div>

      <div className="space-y-6">
        <SearchTransactions 
          transactions={transactions}
          onSearch={handleSearch}
        />
        
        <div className="flex justify-between items-center">
          <div className="text-muted-foreground">
            إجمالي المعاملات: {filteredTransactions.length}
          </div>
          <ExportTransactions transactions={filteredTransactions} />
        </div>

        <Card className="holo-card">
          <CardHeader>
            <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
              المعاملات المسجلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-lg">لا توجد معاملات مطابقة للبحث</div>
                <div className="text-accent text-sm mt-2">جرب تعديل معايير البحث أو إضافة معاملة جديدة</div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 bg-card/30 border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="text-primary text-sm font-semibold">المشتري</div>
                        <div className="text-foreground">{transaction.buyerName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          من {transaction.sellerName}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-primary text-sm font-semibold">الجهاز</div>
                        <div className="text-foreground">{transaction.brand} {transaction.phoneModel}</div>
                        <div className="text-xs text-accent mt-1">
                          IMEI: {transaction.imei.slice(0, 8)}...
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-primary text-sm font-semibold">التاريخ</div>
                        <div className="text-foreground">{transaction.purchaseDate}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(transaction.timestamp).toLocaleTimeString('ar-SA')}
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="flex items-center gap-2"
                        >
                          <Eye size={16} />
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default Transactions;
