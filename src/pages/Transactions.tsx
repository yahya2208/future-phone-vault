
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Eye } from 'lucide-react';
import SearchTransactions, { SearchFilters } from '@/components/SearchTransactions';
import ExportTransactions from '@/components/ExportTransactions';
import TransactionDetails from '@/components/TransactionDetails';

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
  buyerIdPhoto?: string;
  signature?: string;
}

const Transactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
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
        buyerIdPhoto: t.buyer_id_photo,
        signature: t.signature
      }));
      setTransactions(mappedTransactions);
      setFilteredTransactions(mappedTransactions);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...transactions];

    if (filters.searchTerm) {
      filtered = filtered.filter(t => 
        t.sellerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.buyerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        t.imei.includes(filters.searchTerm)
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(t => t.brand === filters.brand);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(t => t.purchaseDate >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(t => t.purchaseDate <= filters.dateTo);
    }

    setFilteredTransactions(filtered);
  };

  const handleClearSearch = () => {
    setFilteredTransactions(transactions);
  };

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (loading) {
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

      <div className="space-y-6">
        <SearchTransactions onSearch={handleSearch} onClear={handleClearSearch} />
        
        <div className="flex justify-between items-center">
          <div className="text-muted-foreground">
            عرض {filteredTransactions.length} من أصل {transactions.length} معاملة
          </div>
          <ExportTransactions transactions={filteredTransactions} />
        </div>

        <Card className="holo-card">
          <CardHeader>
            <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
              المعاملات ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-lg">
                  {transactions.length === 0 ? 'لا توجد معاملات مسجلة' : 'لا توجد نتائج تطابق البحث'}
                </div>
                <div className="text-accent text-sm mt-2">
                  {transactions.length === 0 ? 'ابدأ بإضافة معاملتك الأولى' : 'جرب تعديل معايير البحث'}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 bg-card/30 border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

                      <div>
                        <div className="text-primary text-sm font-semibold">التقييم</div>
                        <div className="flex gap-1 mt-1">
                          {renderStars(transaction.rating)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {transaction.rating || 0}/5
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <Button
                          onClick={() => setSelectedTransaction(transaction)}
                          variant="outline"
                          size="sm"
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
