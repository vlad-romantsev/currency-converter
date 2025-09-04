import { useState, useEffect } from 'react';
import { fetchCurrencies } from '../services/api';
import type { Currency } from '../types';

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        const data = await fetchCurrencies();
        
        const currenciesArray: Currency[] = Object.entries(data).map(
          ([code, { name, symbol }]) => ({
            code,
            name,
            symbol
          })
        );
        
        setCurrencies(currenciesArray);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load currencies');
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  return { currencies, loading, error };
};