
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  return (
    <Card className="holo-card" dir="rtl">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
          سجل المعاملات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-lg">لا توجد معاملات مسجلة</div>
            <div className="text-accent text-sm mt-2">ابدأ بإضافة معاملتك الأولى أعلاه</div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
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
  );
};

export default TransactionHistory;
