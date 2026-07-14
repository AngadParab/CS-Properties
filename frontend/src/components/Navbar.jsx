import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Properties', path: '/properties' },
    { name: 'Wheels', path: '/wheels' },
    { name: 'EMI Calculator', path: '/calculator' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-2 focus:outline-none">
            <Shield className="w-8 h-8 text-brand-gold" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight">Credit Solutions</span>
              <span className="text-xs font-semibold text-brand-gold self-start tracking-wider uppercase">Goa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-brand-gold ${isActive(item.path) ? 'text-brand-gold border-b-2 border-brand-gold pb-1' : 'text-gray-300'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/apply"
              className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-semibold px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-[1.02] shadow-sm text-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-800 focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-navy border-t border-blue-800 transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path)
                    ? 'text-brand-gold bg-blue-900'
                    : 'text-gray-300 hover:text-brand-gold hover:bg-blue-900'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 px-3">
              <Link
                to="/apply"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-brand-gold text-brand-navy font-semibold px-4 py-2.5 rounded-md hover:bg-yellow-500 transition-colors shadow"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
