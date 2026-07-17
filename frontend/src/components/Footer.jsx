import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import logoImg from '../assets/logo.png';

function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-12 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logoImg} alt="CS Properties Goa" className="h-12 w-auto object-contain rounded bg-white p-0.5 border border-white/20" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Transforming your real estate aspirations in Goa into reality. We offer transparent, professional property advisory and listing brokerage services for buyers and sellers.
            </p>
          </div>

          {/* Column 1: Buy Properties */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">Buy Properties</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Browse Listings</Link>
              </li>
              <li>
                <Link to="/properties?type=Villa" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Luxury Villas</Link>
              </li>
              <li>
                <Link to="/properties?type=Apartment" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Modern Apartments</Link>
              </li>
              <li>
                <Link to="/properties?type=Plot" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Residential Plots</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Sell & Inquire */}
          <div>
            <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider mb-4">Sellers & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sell" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">List Your Property</Link>
              </li>
              <li>
                <Link to="/sell" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Owner Listing Form</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Document Verification</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-300 hover:text-brand-gold transition-colors">Get Property Valuation</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
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
        <hr className="my-8 border-white/10" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} CS Properties Goa. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="text-brand-gold font-medium">Verified Properties & Financial Advisory</span>
            <span>|</span>
            <span>Regulated by Professional Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
