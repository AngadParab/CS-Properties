import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProperties } from '../services/propertyService';
import { useFilters } from './FilterContext';
import { db } from '../config/firebase';
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';

const PropertyContext = createContext(null);

const formatPrice = (val) => {
  if (!val || isNaN(val)) return 'Price on Request';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Crores`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
  return `₹${val.toLocaleString('en-IN')}`;
};

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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Query active and publicly visible listings from Firestore
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, where('status', '==', 'active'), where('webDisplay', '==', true));
      const querySnapshot = await getDocs(q);
      
      const firestoreListings = [];
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        let propertyData = {};
        
        if (data.propertyId) {
          try {
            const propDoc = await getDoc(doc(db, 'properties', data.propertyId));
            if (propDoc.exists()) {
              propertyData = propDoc.data();
            }
          } catch (propErr) {
            console.warn(`Failed to resolve property data for ${data.propertyId}:`, propErr.message);
          }
        }
        
        firestoreListings.push({
          id: docSnap.id,
          title: propertyData.address || data.propertyAddress || 'Goa Property Listing',
          name: propertyData.address || data.propertyAddress || 'Goa Property Listing',
          location: propertyData.city || data.propertyCity || 'Goa Region',
          locationFull: `${propertyData.address || data.propertyAddress}, ${propertyData.city || data.propertyCity}`,
          type: propertyData.assetClass || 'Residential Real Estate (Living spaces)',
          subtype: propertyData.subtype || 'Villas / Independent Houses',
          price: data.askingPrice || 0,
          priceStr: formatPrice(data.askingPrice),
          size: `${propertyData.squareFootage || 0} Sq.Ft`,
          details: `${propertyData.bedrooms || 0} BHK | ${propertyData.bathrooms || 0} Baths | ${propertyData.squareFootage || 0} sq.ft.`,
          desc: propertyData.description || data.notes || 'Premium property listed in Goa.',
          featured: true,
          roundedClass: 'rounded-tl-[50px] rounded-br-[50px]',
          gradient: 'from-blue-950/80 to-slate-900/80',
          images: data.images || []
        });
      }

      if (firestoreListings.length > 0) {
        setProperties(firestoreListings);
      } else {
        // Fallback to static JSON if firestore has no listings
        const data = await fetchProperties();
        setProperties(data || []);
      }
    } catch (err) {
      console.warn('Failed to load listings from Firestore, falling back to properties.json:', err.message);
      try {
        const data = await fetchProperties();
        setProperties(data || []);
      } catch (fallbackErr) {
        setError(err?.message || 'Failed to fetch properties records.');
      }
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
    refetchProperties: loadData,
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
