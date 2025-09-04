export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface RatesResponse {
  base: string;
  date: string;
  rates: ExchangeRates;
}

export interface ConversionState {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  result: number | null;
  lastUpdated: Date | null;
}