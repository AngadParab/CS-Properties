import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Buy Properties', path: '/properties' },
    { name: 'Sell Property', path: '/sell' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-navy text-white shadow-md">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center focus:outline-none">
            <span className="brand-title text-xs sm:text-sm md:text-base text-brand-gold hover:text-white uppercase">
              CS Properties Goa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors hover:text-brand-gold pb-1 ${
                    isActive ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-gray-300'
                  }`
                }
              >
                {item.name}
              </NavLink>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-brand-charcoal focus:outline-none min-h-[44px] min-w-[44px] cursor-pointer"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
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
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-gold bg-brand-charcoal'
                      : 'text-gray-300 hover:text-brand-gold hover:bg-brand-charcoal'
                  }`
                }
              >
                {item.name}
              </NavLink>
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
