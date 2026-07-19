import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.webp';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Buy Properties', path: '/properties' },
    { name: 'Sell Property', path: '/sell' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center focus:outline-none">
            <img src={logoImg} width="128" height="40" alt="CS Properties Goa" className="h-10 w-32 object-contain rounded bg-white p-0.5 border border-white/20" />
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
              to="/sell"
              className="bg-brand-gold text-brand-navy hover:bg-yellow-500 font-semibold px-4 py-2 rounded-md transition-all duration-200 transform hover:scale-[1.02] shadow-sm text-sm"
            >
              List Property
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-brand-charcoal focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-navy border-t border-white/10 transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(item.path)
                    ? 'text-brand-gold bg-brand-charcoal'
                    : 'text-gray-300 hover:text-brand-gold hover:bg-brand-charcoal'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 px-3">
              <Link
                to="/sell"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-brand-gold text-brand-navy font-semibold px-4 py-2.5 rounded-md hover:bg-yellow-500 transition-colors shadow"
              >
                List Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
