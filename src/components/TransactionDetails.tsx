
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

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

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const { language } = useLanguage();

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-primary text-lg">
            {language === 'ar' ? 'تفاصيل المعاملة' : 'Transaction Details'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-primary font-semibold mb-2">
                {language === 'ar' ? 'معلومات البائع' : 'Seller Information'}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                  <span className="ml-2">{transaction.sellerName}</span>
                </div>
                {transaction.sellerPhone && (
                  <div>
                    <span className="font-medium">{language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                    <span className="ml-2">{transaction.sellerPhone}</span>
                  </div>
                )}
                {transaction.sellerEmail && (
                  <div>
                    <span className="font-medium">{language === 'ar' ? 'الإيميل:' : 'Email:'}</span>
                    <span className="ml-2">{transaction.sellerEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-primary font-semibold mb-2">
                {language === 'ar' ? 'معلومات المشتري' : 'Buyer Information'}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                  <span className="ml-2">{transaction.buyerName}</span>
                </div>
                {transaction.buyerEmail && (
                  <div>
                    <span className="font-medium">{language === 'ar' ? 'الإيميل:' : 'Email:'}</span>
                    <span className="ml-2">{transaction.buyerEmail}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-2">
              {language === 'ar' ? 'معلومات الجهاز' : 'Device Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">{language === 'ar' ? 'العلامة التجارية:' : 'Brand:'}</span>
                <span className="ml-2">{transaction.brand}</span>
              </div>
              <div>
                <span className="font-medium">{language === 'ar' ? 'الطراز:' : 'Model:'}</span>
                <span className="ml-2">{transaction.phoneModel}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">IMEI:</span>
                <span className="ml-2 font-mono">{transaction.imei}</span>
              </div>
              <div>
                <span className="font-medium">{language === 'ar' ? 'تاريخ الشراء:' : 'Purchase Date:'}</span>
                <span className="ml-2">{transaction.purchaseDate}</span>
              </div>
              <div>
                <span className="font-medium">{language === 'ar' ? 'وقت التسجيل:' : 'Registration Time:'}</span>
                <span className="ml-2">{new Date(transaction.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-primary font-semibold mb-2">
              {language === 'ar' ? 'التقييم' : 'Rating'}
            </h3>
            <div className="flex items-center gap-2">
              {renderStars(transaction.rating)}
              <span className="text-sm text-muted-foreground">
                ({transaction.rating || 0}/5)
              </span>
            </div>
          </div>

          {transaction.buyerIdPhoto && (
            <div>
              <h3 className="text-primary font-semibold mb-2">
                {language === 'ar' ? 'صورة هوية المشتري' : 'Buyer ID Photo'}
              </h3>
              <div className="border border-primary/20 rounded-lg p-2">
                <img 
                  src={transaction.buyerIdPhoto} 
                  alt={language === 'ar' ? 'صورة هوية المشتري' : 'Buyer ID Photo'}
                  className="max-w-full h-auto rounded"
                />
              </div>
            </div>
          )}

          {transaction.signature && (
            <div>
              <h3 className="text-primary font-semibold mb-2">
                {language === 'ar' ? 'التوقيع' : 'Signature'}
              </h3>
              <div className="border border-primary/20 rounded-lg p-2">
                <img 
                  src={transaction.signature} 
                  alt={language === 'ar' ? 'التوقيع' : 'Signature'}
                  className="max-w-full h-auto rounded bg-white"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetails;
