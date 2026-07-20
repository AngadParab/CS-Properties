import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProperties } from '../services/propertyService';

const PropertyContext = createContext(null);

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModalProperty, setActiveModalProperty] = useState(null);
  
  // Search and filter state
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    location: 'All',
    type: 'All',
    maxBudget: 50000000
  });

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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      setProperties(data || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError(err.message || 'Failed to fetch properties records.');
    } finally {
      setLoading(false);
    }
  };

  // Load properties list asynchronously on mount
  useEffect(() => {
    loadData();
  }, []);

  // Actions
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const updateFilters = (newFilters) => {
    setSearchFilters((prev) => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setSearchFilters({
      query: '',
      location: 'All',
      type: 'All',
      maxBudget: 50000000
    });
  };

  const value = {
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
    refetchProperties: loadData
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used inside a PropertyProvider');
  }
  return context;
};
