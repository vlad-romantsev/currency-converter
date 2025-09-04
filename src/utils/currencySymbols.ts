import currenciesData from '../data/currencies.json';
import type { Currency } from '../types';


export const getCurrencySymbol = (code: string): string => {
  const currency = (currenciesData as Currency[]).find(c => c.code === code);
  return currency?.symbol || code;
};
