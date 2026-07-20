import { useState, useEffect } from 'react';

/**
 * A custom React hook to format inputs to Indian style currency commas in real-time.
 * It stores the raw numeric value while returning a formatted string representation.
 * Handles edge cases like pasting formatted strings, negative signs, decimals, and special characters.
 */
export function useCurrencyInput(initialValue = '', onValueChange = null) {
  const sanitizeDigits = (val) => {
    if (val === undefined || val === null || val === '') return '';
    return String(val).replace(/\D/g, '');
  };

  const formatValue = (val) => {
    const numericStr = sanitizeDigits(val);
    if (!numericStr) return '';
    const num = Number(numericStr);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const [displayValue, setDisplayValue] = useState(() => formatValue(initialValue));

  // Sync display value if the parent state changes (e.g. from pre-fill query params)
  useEffect(() => {
    setDisplayValue(formatValue(initialValue));
  }, [initialValue]);

  const handleChange = (e) => {
    const inputValue = (e && e.target) ? e.target.value : e;
    const numericValue = sanitizeDigits(inputValue);
    
    // Set formatted visual representation using Intl.NumberFormat('en-IN')
    setDisplayValue(formatValue(numericValue));
    
    // Propagate the raw numeric value back safely
    if (onValueChange) {
      onValueChange(numericValue);
    }
  };

  return {
    value: displayValue,
    onChange: handleChange,
    setValue: (val) => {
      const numericStr = sanitizeDigits(val);
      setDisplayValue(formatValue(numericStr));
    }
  };
}
