
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

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
}

interface SearchTransactionsProps {
  transactions: Transaction[];
  onSearch: (searchTerm: string, brandFilter: string, dateFilter: string) => void;
}

const SearchTransactions: React.FC<SearchTransactionsProps> = ({ transactions, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Get unique brands and dates from transactions
  const uniqueBrands = [...new Set(transactions.map(t => t.brand))];
  const uniqueDates = [...new Set(transactions.map(t => t.purchaseDate))];

  useEffect(() => {
    onSearch(searchTerm, brandFilter, dateFilter);
  }, [searchTerm, brandFilter, dateFilter, onSearch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Search size={20} />
          البحث والتصفية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="ابحث بالاسم أو IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالعلامة التجارية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع العلامات التجارية</SelectItem>
                {uniqueBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالتاريخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع التواريخ</SelectItem>
                {uniqueDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchTransactions;
