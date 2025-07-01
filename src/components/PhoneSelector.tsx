
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getAllBrands, getModelsForBrand } from '@/data/phoneData';

interface PhoneSelectorProps {
  selectedBrand: string;
  selectedModel: string;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
}

const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  selectedBrand,
  selectedModel,
  onBrandChange,
  onModelChange
}) => {
  const brands = getAllBrands();
  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  const handleBrandChange = (brand: string) => {
    onBrandChange(brand);
    onModelChange(''); // Reset model when brand changes
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="brand" className="text-primary text-sm font-semibold">
          العلامة التجارية *
        </Label>
        <Select value={selectedBrand} onValueChange={handleBrandChange}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder="اختر العلامة التجارية" />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary/30 max-h-60 overflow-y-auto">
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand} className="text-foreground hover:bg-primary/20">
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model" className="text-primary text-sm font-semibold">
          طراز الهاتف *
        </Label>
        <Select value={selectedModel} onValueChange={onModelChange} disabled={!selectedBrand}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder={selectedBrand ? "اختر الطراز" : "اختر العلامة التجارية أولاً"} />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary/30 max-h-60 overflow-y-auto">
            {models.map((model) => (
              <SelectItem key={model} value={model} className="text-foreground hover:bg-primary/20">
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PhoneSelector;
