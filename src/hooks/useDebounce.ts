import { useState, useEffect } from 'react';

/**
 * Hook untuk menunda update value (debounce).
 * Berguna untuk search input agar tidak hit API setiap ketikan.
 * 
 * @param value Value yang ingin di-debounce
 * @param delay Delay dalam milidetik (ms)
 * @returns Value yang sudah di-debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
