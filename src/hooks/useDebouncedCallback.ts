import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
    return () => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        }
    };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
        callback(...args);
        }, delay);
    }, [callback, delay]);
}