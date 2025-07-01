
export const phoneData = {
  'Apple': [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
    'iPhone SE (3rd generation)', 'iPhone SE (2nd generation)',
    'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
    'iPhone XS Max', 'iPhone XS', 'iPhone XR',
    'iPhone X', 'iPhone 8 Plus', 'iPhone 8'
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21',
    'Galaxy Note 20 Ultra', 'Galaxy Note 20',
    'Galaxy A54', 'Galaxy A34', 'Galaxy A24', 'Galaxy A14',
    'Galaxy A53', 'Galaxy A33', 'Galaxy A23', 'Galaxy A13',
    'Galaxy A52', 'Galaxy A32', 'Galaxy A22', 'Galaxy A12',
    'Galaxy Z Fold 5', 'Galaxy Z Flip 5',
    'Galaxy Z Fold 4', 'Galaxy Z Flip 4',
    'Galaxy Z Fold 3', 'Galaxy Z Flip 3'
  ],
  'Google': [
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 7a',
    'Pixel 7 Pro', 'Pixel 7',
    'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a',
    'Pixel 5a', 'Pixel 5',
    'Pixel 4a 5G', 'Pixel 4a', 'Pixel 4 XL', 'Pixel 4'
  ],
  'OnePlus': [
    'OnePlus 12', 'OnePlus 11', 'OnePlus 10 Pro', 'OnePlus 10T',
    'OnePlus 9 Pro', 'OnePlus 9', 'OnePlus 9R',
    'OnePlus 8 Pro', 'OnePlus 8', 'OnePlus 8T',
    'OnePlus Nord 3', 'OnePlus Nord 2T', 'OnePlus Nord CE 3',
    'OnePlus Nord N30', 'OnePlus Nord N20'
  ],
  'Xiaomi': [
    'Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13 Ultra', 'Xiaomi 13',
    'Xiaomi 12 Pro', 'Xiaomi 12', 'Xiaomi 11T Pro', 'Xiaomi 11T',
    'Redmi Note 13 Pro', 'Redmi Note 13', 'Redmi Note 12 Pro', 'Redmi Note 12',
    'Redmi Note 11 Pro', 'Redmi Note 11', 'Redmi Note 10 Pro', 'Redmi Note 10',
    'Redmi 12', 'Redmi 11', 'Redmi 10', 'Redmi 9',
    'POCO X6 Pro', 'POCO X6', 'POCO X5 Pro', 'POCO X5',
    'POCO F5 Pro', 'POCO F5', 'POCO F4'
  ],
  'Huawei': [
    'P60 Pro', 'P60', 'P50 Pro', 'P50',
    'Mate 60 Pro', 'Mate 50 Pro', 'Mate 40 Pro',
    'Nova 11', 'Nova 10', 'Nova 9',
    'Y90', 'Y70', 'Y60'
  ],
  'Oppo': [
    'Find X7 Ultra', 'Find X7', 'Find X6 Pro', 'Find X6',
    'Find X5 Pro', 'Find X5', 'Find N3', 'Find N2',
    'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro', 'Reno 10',
    'Reno 9 Pro', 'Reno 9', 'Reno 8 Pro', 'Reno 8',
    'A98', 'A78', 'A58', 'A38', 'A18'
  ],
  'Vivo': [
    'X100 Pro', 'X100', 'X90 Pro', 'X90',
    'X80 Pro', 'X80', 'X70 Pro', 'X70',
    'V29 Pro', 'V29', 'V27 Pro', 'V27',
    'V25 Pro', 'V25', 'V23 Pro', 'V23',
    'Y36', 'Y27', 'Y17', 'Y16'
  ],
  'Realme': [
    'GT 5 Pro', 'GT 5', 'GT Neo 6', 'GT Neo 5',
    'GT 3', 'GT 2 Pro', 'GT 2',
    '11 Pro+', '11 Pro', '11',
    '10 Pro+', '10 Pro', '10',
    'C67', 'C55', 'C53', 'C35', 'C33', 'C30'
  ],
  'Sony': [
    'Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V',
    'Xperia 1 IV', 'Xperia 5 IV', 'Xperia 10 IV',
    'Xperia 1 III', 'Xperia 5 III', 'Xperia 10 III'
  ],
  'Nokia': [
    'G60 5G', 'G50', 'G21', 'G11',
    'X30 5G', 'X20', 'X10',
    'C31', 'C21 Plus', 'C21', 'C12 Pro', 'C12'
  ],
  'Motorola': [
    'Edge 50 Ultra', 'Edge 50 Pro', 'Edge 50',
    'Edge 40 Pro', 'Edge 40', 'Edge 30 Ultra',
    'Moto G84', 'Moto G73', 'Moto G53', 'Moto G23',
    'Moto G Power', 'Moto G Stylus', 'Moto G Play'
  ],
  'Honor': [
    'Magic 6 Pro', 'Magic 6', 'Magic 5 Pro', 'Magic 5',
    '90 Pro', '90', '70 Pro', '70',
    'X9b', 'X9a', 'X8b', 'X8a'
  ],
  'Nothing': [
    'Phone (2a)', 'Phone (2)', 'Phone (1)'
  ],
  'Asus': [
    'ROG Phone 8 Pro', 'ROG Phone 8', 'ROG Phone 7',
    'Zenfone 11 Ultra', 'Zenfone 10', 'Zenfone 9'
  ]
};

export const getAllBrands = (): string[] => {
  return Object.keys(phoneData);
};

export const getModelsForBrand = (brand: string): string[] => {
  return phoneData[brand as keyof typeof phoneData] || [];
};
