import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Home } from 'lucide-react';

function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
      <Helmet>
        <title>404 - Page Not Found | CS Properties Goa</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="max-w-md w-full bg-white border border-brand-sandDark p-8 sm:p-10 rounded-3xl shadow-sm space-y-6">
        {/* Visual Badge Icon */}
        <div className="w-16 h-16 bg-brand-bg text-brand-goldDark rounded-2xl flex items-center justify-center mx-auto border border-brand-sandDark">
          <Compass className="w-8 h-8 animate-spin-slow text-brand-goldDark" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-brand-navy font-syne tracking-tight">404</span>
          <h1 className="text-xl font-bold text-brand-navy">Page Not Found</h1>
          <p className="text-xs text-brand-text-muted leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable in our Goa catalog.
          </p>
        </div>

        {/* Action Button CTA */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            to="/"
            className="w-full sm:w-auto bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-6 py-3 rounded-xl transition-all text-xs flex items-center justify-center space-x-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
