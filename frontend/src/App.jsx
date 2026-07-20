import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PropertyDetailModal from './components/PropertyDetailModal';
import ErrorBoundary from './components/ErrorBoundary';

// Lazily load routes to split production bundles
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const Contact = lazy(() => import('./pages/Contact'));
const Sell = lazy(() => import('./pages/Sell'));
const ApplyNow = lazy(() => import('./pages/ApplyNow'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Custom page loading skeleton
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-10 h-10 border-4 border-brand-sandDark border-t-brand-goldDark rounded-full animate-spin"></div>
    <span className="text-[10px] font-bold text-brand-text-muted tracking-widest uppercase animate-pulse">Loading CS Properties...</span>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text-primary font-sans">

        {/* Responsive, Sticky Navbar */}
        <header>
          <Navbar />
        </header>

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/apply" element={<ApplyNow />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Brand Information Footer */}
        <Footer />

        {/* Quick View Modal Overlay */}
        <PropertyDetailModal />

      </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
