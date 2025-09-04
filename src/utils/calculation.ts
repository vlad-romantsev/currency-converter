export const calculateConversion = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  baseCurrency: string
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === baseCurrency) {
    return amount * (rates[toCurrency] || 1);
  }
  
  if (toCurrency === baseCurrency) {
    return amount / (rates[fromCurrency] || 1);
  }
  
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  return (amount / fromRate) * toRate;
};