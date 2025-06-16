
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
    <Card className="holo-card">
      <CardHeader>
        <CardTitle className="text-primary glow-text font-['Orbitron'] text-xl">
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-lg">No transactions recorded</div>
            <div className="text-accent text-sm mt-2">Start by adding your first transaction above</div>
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
                    <div className="text-primary text-sm font-semibold">Buyer</div>
                    <div className="text-foreground">{transaction.buyerName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      from {transaction.sellerName}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-primary text-sm font-semibold">Device</div>
                    <div className="text-foreground">{transaction.brand} {transaction.phoneModel}</div>
                    <div className="text-xs text-accent mt-1">
                      IMEI: {transaction.imei.slice(0, 8)}...
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-primary text-sm font-semibold">Date</div>
                    <div className="text-foreground">{transaction.purchaseDate}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.timestamp).toLocaleTimeString()}
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
