
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface SearchTransactionsProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  searchTerm: string;
  brand: string;
  dateFrom: string;
  dateTo: string;
}

const SearchTransactions = ({ onSearch, onClear }: SearchTransactionsProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    brand: '',
    dateFrom: '',
    dateTo: ''
  });

  const phonebrands = [
    'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 
    'Sony', 'Nokia', 'Motorola', 'Oppo', 'Vivo', 'Realme'
  ];

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      searchTerm: '',
      brand: '',
      dateFrom: '',
      dateTo: ''
    });
    onClear();
  };

  return (
    <div className="space-y-4 p-4 bg-card/30 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-primary" size={20} />
        <span className="font-semibold text-primary">البحث والتصفية</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="ابحث بالاسم أو رقم IMEI"
          value={filters.searchTerm}
          onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
          className="quantum-input"
        />
        
        <Select onValueChange={(value) => setFilters(prev => ({ ...prev, brand: value }))}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder="اختر الماركة" />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary/30">
            {phonebrands.map((brand) => (
              <SelectItem key={brand} value={brand} className="text-foreground hover:bg-primary/20">
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          type="date"
          placeholder="من تاريخ"
          value={filters.dateFrom}
          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          className="quantum-input"
        />
        
        <Input
          type="date"
          placeholder="إلى تاريخ"
          value={filters.dateTo}
          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          className="quantum-input"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button onClick={handleClear} variant="outline" className="flex items-center gap-2">
          <X size={16} />
          مسح
        </Button>
        <Button onClick={handleSearch} className="neural-btn flex items-center gap-2">
          <Search size={16} />
          بحث
        </Button>
      </div>
    </div>
  );
};

export default SearchTransactions;
