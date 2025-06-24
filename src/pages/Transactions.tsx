
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

interface Transaction {
  id: string;
  sellerName: string;
  buyerName: string;
  phoneModel: string;
  brand: string;
  imei: string;
  purchaseDate: string;
  timestamp: Date;
}

const Transactions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
        timestamp: new Date(t.created_at)
      }));
      setTransactions(mappedTransactions);
    }
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

      <Card className="holo-card">
        <CardHeader>
          <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
            جميع المعاملات ({transactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-lg">لا توجد معاملات مسجلة</div>
              <div className="text-accent text-sm mt-2">ابدأ بإضافة معاملتك الأولى</div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 bg-card/30 border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
