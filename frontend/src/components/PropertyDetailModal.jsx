import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, DollarSign, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';

function PropertyDetailModal() {
  const { activeModalProperty, setActiveModalProperty } = useProperties();

  if (!activeModalProperty) return null;

  const prop = activeModalProperty;

  const formatPrice = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

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

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-widest">Description</h3>
              <p className="text-sm text-brand-text-muted leading-relaxed font-medium">
                {prop.desc}
              </p>
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
