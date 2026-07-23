import { useState, useEffect, useCallback } from 'react';
import { fetchProperties } from '../services/propertyService';

/**
 * Custom hook to manage asynchronous Firebase Firestore property listings queries.
 * Returns structured state: { properties, loading, error, refetchProperties }
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProperties();
      setProperties(data || []);
    } catch (err) {
      console.error('Error querying properties from Firestore:', err);
      setError(err?.message || 'Failed to retrieve Goa properties listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  return {
    properties,
    loading,
    error,
    refetchProperties: loadProperties,
  };
}
