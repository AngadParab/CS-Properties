import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchProperties } from '../services/propertyService';
import { useFilters } from './FilterContext';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalProperty, setActiveModalProperty] = useState(null);

  // Consume search and filter state from FilterContext
  const { searchFilters, updateFilters, resetFilters } = useFilters();

  // Favorites state initialized from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading favorites from localStorage:', e);
      return [];
    }
  });

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error writing favorites to localStorage:', e);
    }
  }, [favorites]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      setProperties(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch properties records.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load properties list asynchronously on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
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
    refetchProperties: loadData,
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
    loadData
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
