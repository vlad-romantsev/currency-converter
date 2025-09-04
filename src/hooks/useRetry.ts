import { useState, useCallback } from 'react';

export const useRetry = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async (
    operation: () => Promise<any>,
    maxRetries = 3,
    delay = 1000
  ): Promise<any> => {
    setIsRetrying(true);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setRetryCount(attempt);
      
      try {
        const result = await operation();
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        if (attempt === maxRetries) {
          setIsRetrying(false);
          throw error;
        }
        
        const exponentialDelay = delay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 200;
        await new Promise(resolve => setTimeout(resolve, exponentialDelay + jitter));
      }
    }
    
    setIsRetrying(false);
  }, []);

  return { retry, retryCount, isRetrying };
};