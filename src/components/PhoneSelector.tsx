
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getAllBrands, getModelsForBrand } from '@/data/phoneData';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhoneSelectorProps {
  selectedBrand: string;
  selectedModel: string;
  customModel: string;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onCustomModelChange: (customModel: string) => void;
}

const PhoneSelector: React.FC<PhoneSelectorProps> = ({
  selectedBrand,
  selectedModel,
  customModel,
  onBrandChange,
  onModelChange,
  onCustomModelChange
}) => {
  const { language } = useLanguage();
  const [useCustomModel, setUseCustomModel] = useState(false);
  const brands = getAllBrands();
  const models = selectedBrand ? getModelsForBrand(selectedBrand) : [];

  const handleBrandChange = (brand: string) => {
    onBrandChange(brand);
    onModelChange('');
    onCustomModelChange('');
    setUseCustomModel(false);
  };

  const handleModelChange = (model: string) => {
    if (model === 'custom') {
      setUseCustomModel(true);
      onModelChange('');
    } else {
      setUseCustomModel(false);
      onModelChange(model);
      onCustomModelChange('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="brand" className="text-primary text-sm font-semibold">
          {language === 'ar' ? 'العلامة التجارية *' : 'Brand *'}
        </Label>
        <Select value={selectedBrand} onValueChange={handleBrandChange}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder={language === 'ar' ? "اختر العلامة التجارية" : "Select Brand"} />
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
          {language === 'ar' ? 'طراز الهاتف *' : 'Phone Model *'}
        </Label>
        {!useCustomModel ? (
          <Select value={selectedModel} onValueChange={handleModelChange} disabled={!selectedBrand}>
            <SelectTrigger className="quantum-input">
              <SelectValue placeholder={selectedBrand ? (language === 'ar' ? "اختر الطراز" : "Select Model") : (language === 'ar' ? "اختر العلامة التجارية أولاً" : "Select Brand First")} />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/30 max-h-60 overflow-y-auto">
              {models.map((model) => (
                <SelectItem key={model} value={model} className="text-foreground hover:bg-primary/20">
                  {model}
                </SelectItem>
              ))}
              <SelectItem value="custom" className="text-orange-600 hover:bg-orange-100 font-medium">
                {language === 'ar' ? '+ إدخال موديل مخصص' : '+ Enter Custom Model'}
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder={language === 'ar' ? "أدخل موديل الهاتف" : "Enter phone model"}
              value={customModel}
              onChange={(e) => onCustomModelChange(e.target.value)}
              className="quantum-input"
            />
            <button
              type="button"
              onClick={() => {
                setUseCustomModel(false);
                onCustomModelChange('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {language === 'ar' ? '← العودة للقائمة' : '← Back to List'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneSelector;
