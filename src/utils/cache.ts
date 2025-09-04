import type { RatesResponse } from "../types";

const CACHE_KEY = 'currency_rates_cache';
const CACHE_EXPIRE_MINUTES = parseInt(import.meta.env.VITE_CACHE_EXPIRE_MINUTES || '5');

export const cacheRates = (data: RatesResponse): void => {
  const timestamp = Date.now();
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, timestamp })
  );
};

export const getCachedRates = (): RatesResponse | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as { data: RatesResponse; timestamp: number };
    return parsed.data;
  } catch {
    return null;
  }
};

export const shouldRefreshCache = (): boolean => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return true;

  try {
    const { timestamp } = JSON.parse(cached);
    const now = new Date().getTime();
    const cacheAgeMinutes = (now - timestamp) / (1000 * 60);
    
    return cacheAgeMinutes > CACHE_EXPIRE_MINUTES;
  } catch {
    return true;
  }
};

export const getCacheTimestamp = (): Date | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const { timestamp } = JSON.parse(cached);
    return new Date(timestamp);
  } catch {
    return null;
  }
};

export const formatCacheDateCustom = (date: Date | null): string => {
  if (!date) return '';
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours.toString().padStart(2, '0');
  
  return `${month}/${day}/${year}, ${formattedHours}:${minutes} ${ampm}`;
};