import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { loginAdmin, logoutAdmin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          setUser({
            id: firebaseUser.uid,
            username: firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
          });
          setToken(idToken);
        } catch (error) {
          console.error('Error fetching user ID token:', error);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    // Clean up subscriber on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Firebase login handler
   */
  const login = useCallback(async (email, password) => {
    try {
      await loginAdmin(email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Authentication failed' };
    }
  }, []);

  /**
   * Firebase logout handler
   */
  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }), [user, token, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
