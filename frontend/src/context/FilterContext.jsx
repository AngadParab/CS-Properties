import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const SUBTYPES_MAP = {
  'Residential Real Estate (Living spaces)': [
    'Apartments / Flats',
    'Villas / Independent Houses',
    'Penthouses (Luxury top-floor units)',
    'Townhouses / Row Houses',
    'Builder Floors',
    'Duplex / Triplex / Quadplex',
    'Condominiums (Condos) & Co-ops',
    'Studio Apartments',
  ],
  'Commercial Real Estate (Business & income generation)': [
    'Office Spaces (Corporate towers, IT parks, co-working spaces)',
    'Retail Shops & Showrooms',
    'Shopping Malls & Power Centers',
    'Hotels & Hospitality (Resorts, serviced apartments, boutique hotels)',
    'Healthcare / Medical Facilities (Hospitals, clinics)',
  ],
  'Industrial Real Estate (Production, storage, logistics)': [
    'Warehouses & Logistics Hubs',
    'Manufacturing Plants / Factories',
    'Flex Industrial (Combined office + warehouse)',
    'Cold Storage Facilities',
    'Data Centers',
  ],
  'Land / Plots (Raw, subdivided, or agricultural)': [
    'Residential Plots (Gated community plots or standalone land)',
    'Commercial Plots (Zoned for retail or corporate construction)',
    'Industrial Plots',
    'Agricultural Land / Farmland / Ranches',
  ],
  'Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)': [
    'Mixed-Use Developments (Ground floor retail + upper residential/office)',
    'Special Purpose (Schools, sports arenas, theme parks, places of worship)',
  ],
};

const DEFAULT_FILTERS = {
  query: '',
  location: 'All',
  type: 'All',
  subtype: 'All',
  maxBudget: 50000000,
};

export const FilterProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState(DEFAULT_FILTERS);

  const updateFilters = (newFilters) => {
    setSearchFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setSearchFilters(DEFAULT_FILTERS);
  };

  const value = {
    searchFilters,
    updateFilters,
    resetFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used inside a FilterProvider');
  }
  return context;
};
