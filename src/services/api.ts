import axios from 'axios';
import type { RatesResponse } from '../types';
import { useRetry } from '../hooks/useRetry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    if (!config || !response) {
      return Promise.reject(error);
    }
    
    if (response.status >= 500 || !response.status) {
      const { retry } = useRetry();
      
      try {
        return await retry(() => apiClient(config));
      } catch (retryError) {
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const fetchRates = async (): Promise<RatesResponse> => {
  try {
    const response = await apiClient.get<RatesResponse>(`${API_BASE_URL}/rates`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch exchange rates');
  }
};

export const fetchCurrencies = async (): Promise<Record<string, { name: string; symbol: string }>> => {
  try {
    const response = await apiClient.get<Record<string, { name: string; symbol: string }>>(
      `${API_BASE_URL}/currencies`
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch currencies');
  }
};