import { useState, useEffect, useCallback } from 'react';
import { fetchRates } from '../services/api';
import { cacheRates, getCachedRates, getCacheTimestamp, shouldRefreshCache} from "../utils/cache"
import type { RatesResponse } from '../types';

export const useExchangeRates = () => {
  const [rates, setRates] = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const loadRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cachedData = getCachedRates();
      const shouldRefresh = shouldRefreshCache();

      if (cachedData && !shouldRefresh) {
        setRates(cachedData);
        setLastUpdated(getCacheTimestamp());
        setLoading(false);
        return;
      }

      const freshRates = await fetchRates();
      setRates(freshRates);
      cacheRates(freshRates);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadRates]);

  return { rates, loading, error, isOnline, refreshRates: loadRates, lastUpdated };
};