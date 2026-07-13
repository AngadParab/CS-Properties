import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show a premium loading indicator while fetching auth credentials from localStorage
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg text-brand-navy">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-navy rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-semibold uppercase tracking-widest">Checking Session...</span>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
