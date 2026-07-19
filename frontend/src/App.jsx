import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import Sell from './pages/Sell';
import ApplyNow from './pages/ApplyNow';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text-primary font-sans">

        {/* Responsive, Sticky Navbar */}
        <header>
          <Navbar />
        </header>

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
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
          </Routes>
        </main>

        {/* Brand Information Footer */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
