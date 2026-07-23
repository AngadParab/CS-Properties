import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useProperties as usePropertiesHook } from '../hooks/useProperties';
import { useFilters } from './FilterContext';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const { properties, loading, error, refetchProperties } = usePropertiesHook();
  const [activeModalProperty, setActiveModalProperty] = useState(null);

  // Consume search filters from FilterContext
  const { searchFilters, updateFilters, resetFilters } = useFilters();

  // Favorites state initialization from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading favorites from localStorage:', e);
      return [];
    }
  });

  // Sync favorites state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error writing favorites to localStorage:', e);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  const value = useMemo(() => ({
    properties,
    loading,
    error,
    searchFilters,
    favorites,
    activeModalProperty,
    setActiveModalProperty,
    toggleFavorite,
    updateFilters,
    resetFilters,
    refetchProperties,
  }), [
    properties,
    loading,
    error,
    searchFilters,
    favorites,
    activeModalProperty,
    toggleFavorite,
    updateFilters,
    resetFilters,
    refetchProperties,
  ]);

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used inside a PropertyProvider');
  }
  return context;
};
