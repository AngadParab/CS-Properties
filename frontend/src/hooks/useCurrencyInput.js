import React, { useState, useEffect } from 'react';

/**
 * A custom React hook to format inputs to Indian style currency commas in real-time.
 * It stores the raw numeric value while returning a formatted string representation.
 */
export function useCurrencyInput(initialValue = '', onValueChange = null) {
  const formatValue = (val) => {
    if (val === undefined || val === null || val === '') return '';
    const numericStr = String(val).replace(/[^0-9]/g, '');
    if (!numericStr) return '';
    return Number(numericStr).toLocaleString('en-IN');
  };

  const [displayValue, setDisplayValue] = useState(() => formatValue(initialValue));

  // Sync display value if the parent state changes (e.g. from pre-fill query params)
  useEffect(() => {
    setDisplayValue(formatValue(initialValue));
  }, [initialValue]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    
    // Set formatted visual representation
    setDisplayValue(formatValue(numericValue));
    
    // Propagate the raw numeric value back
    if (onValueChange) {
      onValueChange(numericValue);
    }
  };

  return {
    value: displayValue,
    onChange: handleChange,
    setValue: (val) => setDisplayValue(formatValue(val))
  };
}
