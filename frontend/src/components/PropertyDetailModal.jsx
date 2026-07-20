import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

function PropertyDetailModal() {
  const { activeModalProperty, setActiveModalProperty } = useProperties();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!activeModalProperty) return;

    // Save previous active element to restore focus when modal closes
    const previousActiveElement = document.activeElement;

    // Query selector for focusable elements
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Small timeout to allow modal mounting animation to start
    const timer = setTimeout(() => {
      if (!modalRef.current) return;
      
      const focusableElements = Array.from(modalRef.current.querySelectorAll(focusableSelector));
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (firstFocusable) {
        firstFocusable.focus();
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (focusableElements.length === 0) {
            e.preventDefault();
            return;
          }
          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        } else if (e.key === 'Escape') {
          setActiveModalProperty(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Save handler reference to clean up properly
      if (modalRef.current) {
        modalRef.current._handleKeyDown = handleKeyDown;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (modalRef.current?._handleKeyDown) {
        window.removeEventListener('keydown', modalRef.current._handleKeyDown);
      }
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [activeModalProperty]);

  if (!activeModalProperty) return null;

  const prop = activeModalProperty;

  const formatPrice = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  // Split description text by period to form bullet items
  const descBullets = prop.desc
    ? prop.desc.split('.').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveModalProperty(null)}
          className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full relative z-10 border border-brand-sandDark flex flex-col"
        >
          {/* Header Visual Image Mockup */}
          <div className={`h-56 bg-gradient-to-br ${prop.gradient} relative p-8 flex flex-col justify-between text-white`}>
            <button
              onClick={() => setActiveModalProperty(null)}
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="bg-brand-navy/80 text-brand-gold text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full self-start">
              {prop.type}
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow">{prop.title}</h2>
              <p className="text-white/80 text-xs flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                <span>{prop.locationFull}</span>
              </p>
            </div>
          </div>

          {/* Details Content Body */}
          <div className="p-8 space-y-6 flex-grow overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-3 gap-4 border-b border-brand-sandDark pb-6">
              <div className="text-center space-y-1 border-r border-brand-sandDark">
                <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Asking Price</span>
                <p className="text-base font-extrabold text-brand-navy flex items-center justify-center text-brand-goldDark">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatPrice(prop.price)}</span>
                </p>
              </div>
              <div className="text-center space-y-1 border-r border-brand-sandDark">
                <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Total Area</span>
                <p className="text-base font-extrabold text-brand-navy flex items-center justify-center">
                  <Layers className="w-4 h-4 mr-1 text-brand-navy/70" />
                  <span>{prop.size}</span>
                </p>
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Specifications</span>
                <p className="text-sm font-bold text-brand-navy leading-normal">
                  {prop.details.split('|')[0] || prop.type}
                </p>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-widest">Property Metadata</h3>
              <div className="border border-brand-sandDark rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-brand-sandDark text-xs font-semibold text-brand-navy">
                  <tbody className="divide-y divide-brand-sandDark bg-white">
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase w-1/3">Property ID</td>
                      <td className="px-4 py-3 font-mono">CS-00{prop.id}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Name</td>
                      <td className="px-4 py-3">{prop.name}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">District Location</td>
                      <td className="px-4 py-3">{prop.locationFull}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Asset Type</td>
                      <td className="px-4 py-3">{prop.type}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Planimetric Area</td>
                      <td className="px-4 py-3">{prop.size}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Asking Budget</td>
                      <td className="px-4 py-3 text-brand-goldDark font-extrabold">{formatPrice(prop.price)} ({prop.priceStr})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bulleted Highlights */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-widest">Key Highlights</h3>
              <ul className="space-y-1.5 text-sm text-brand-text-muted font-medium">
                {descBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-goldDark font-bold mt-0.5">•</span>
                    <span>{bullet}.</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification highlights */}
            <div className="bg-brand-bg rounded-2xl p-5 border border-brand-sandDark space-y-3">
              <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>CS Property Guarantee & Verifications</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-text-muted font-semibold">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-goldDark rounded-full" />
                  <span>Clear title certified</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-goldDark rounded-full" />
                  <span>Verified construction limits</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-goldDark rounded-full" />
                  <span>No active property disputes</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-goldDark rounded-full" />
                  <span>Brokerage & document support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="bg-brand-bg p-6 border-t border-brand-sandDark flex flex-col sm:flex-row gap-3 justify-end items-center">
            <button
              onClick={() => setActiveModalProperty(null)}
              className="text-xs font-bold text-brand-navy hover:text-brand-goldDark w-full sm:w-auto px-5 py-3 transition-colors text-center border border-brand-sandDark rounded-xl bg-white hover:bg-brand-bg"
            >
              Close Details
            </button>
            <Link
              to={`/apply?propertyName=${encodeURIComponent(prop.title)}&propertyLocation=${encodeURIComponent(prop.location)}&propertyPrice=${prop.price}&loan=property`}
              onClick={() => setActiveModalProperty(null)}
              className="bg-brand-navy text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1 w-full sm:w-auto shadow-sm"
            >
              <span>Book Consultation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default PropertyDetailModal;
