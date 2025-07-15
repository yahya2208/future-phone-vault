
export const validateTransactionDate = (date: Date): { isValid: boolean; error?: string } => {
  const today = new Date();
  const selectedDate = new Date(date);
  
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return {
      isValid: false,
      error: 'لا يمكن اختيار تاريخ سابق لليوم الحالي'
    };
  }
  
  // Also prevent dates too far in the future (optional, but good practice)
  const maxFutureDate = new Date(today);
  maxFutureDate.setDate(maxFutureDate.getDate() + 30); // 30 days max
  
  if (selectedDate > maxFutureDate) {
    return {
      isValid: false,
      error: 'لا يمكن اختيار تاريخ أكثر من 30 يوم في المستقبل'
    };
  }
  
  return { isValid: true };
};

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getMaxFutureDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 30);
  return today.toISOString().split('T')[0];
};
