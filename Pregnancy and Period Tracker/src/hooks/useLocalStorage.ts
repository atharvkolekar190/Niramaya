import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Handle date strings for period and pregnancy data
        if (key === 'periods' && Array.isArray(parsed)) {
          return parsed.map(period => ({
            ...period,
            startDate: new Date(period.startDate),
            endDate: period.endDate ? new Date(period.endDate) : undefined
          })) as T;
        }
        if (key === 'pregnancy' && parsed) {
          return {
            ...parsed,
            lastPeriodDate: new Date(parsed.lastPeriodDate),
            dueDate: new Date(parsed.dueDate),
            conceptionDate: parsed.conceptionDate ? new Date(parsed.conceptionDate) : undefined
          } as T;
        }
        if (key === 'cycleData' && parsed) {
          return {
            ...parsed,
            lastCalculated: new Date(parsed.lastCalculated)
          } as T;
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}