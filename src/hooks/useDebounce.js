import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timer if the value changes before the delay finishes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};