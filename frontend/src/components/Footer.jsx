import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Phone, Mail, Clock } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-12 pb-8 border-t border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6.5 h-6.5 text-brand-gold" />
              <span className="text-lg font-bold tracking-tight">Credit Solutions Goa</span>
            </div>
            <p className="text-sm text-gray-300">
              Transforming your financial aspirations into reality. We offer transparent, professional loan advisory services with 0% commission, direct from 30+ leading banks.
            </p>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Business Loans</Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Mortgage Loans</Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Loan Against Property</Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Personal Loans</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Pages */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/wheels" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Wheels Financing</Link>
              </li>
              <li>
                <Link to="/calculator" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">EMI Calculator</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">Margao Office</h3>
            <div className="flex items-start space-x-2 text-sm text-gray-300">
              <MapPin className="w-5 h-5 text-brand-gold mt-0.5 shrink-0" />
              <span>Shop No. 12, Grace Towers, Near Jose Building, Margao, Goa - 403601</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Phone className="w-4 h-4 text-brand-gold shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <span>info@creditsolutionsgoa.com</span>
            </div>
            <div className="flex items-start space-x-2 text-sm text-gray-300">
              <Clock className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
              <span>Mon - Sat: 9:30 AM - 6:30 PM</span>
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-8 border-blue-800" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Credit Solutions Goa. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="text-brand-gold font-medium">0% Commission Loan Advisory</span>
            <span>|</span>
            <span>Regulated by Professional Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
