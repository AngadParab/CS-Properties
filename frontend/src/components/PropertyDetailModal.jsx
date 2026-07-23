import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, MapPin, DollarSign, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../context/PropertyContext';
import { Helmet } from 'react-helmet-async';

function PropertyDetailModal() {
  const { activeModalProperty, setActiveModalProperty } = useProperties();

  if (!activeModalProperty) return null;

  const prop = activeModalProperty;

  const formatPrice = (val) => {
    if (!val || isNaN(val)) return 'Price on Request';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  // Defensive split description text by period to form bullet items
  const descBullets = prop?.desc
    ? prop.desc.split('.').map(s => s.trim()).filter(Boolean)
    : ['Verified Goa asset', 'End-to-end legal title documentation'];

  const gradientClass = prop?.gradient || 'from-slate-800 to-slate-900';
  const propertyTitle = prop?.title || prop?.name || 'Goa Real Estate Space';
  const locationFull = prop?.locationFull || prop?.location || 'Goa, India';
  const propertyType = prop?.type || 'Property';
  const propertySize = prop?.size || 'N/A';
  const propertyPrice = prop?.price || 0;
  const propertyPriceStr = prop?.priceStr || formatPrice(propertyPrice);

  return (
    <Dialog.Root open={!!activeModalProperty} onOpenChange={(open) => !open && setActiveModalProperty(null)}>
      <Helmet>
        <title>{propertyTitle} | CS Properties Goa</title>
        <meta name="description" content={prop.desc} />
        <meta property="og:title" content={`${propertyTitle} - Premium Real Estate in Goa`} />
        <meta property="og:description" content={prop.desc} />
        <meta property="og:image" content={prop.images && prop.images.length > 0 ? prop.images[0] : '/images/logo.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={propertyTitle} />
        <meta name="twitter:description" content={prop.desc} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": propertyTitle,
            "description": prop.desc,
            "url": window.location.href,
            "image": prop.images && prop.images.length > 0 ? prop.images[0] : '',
            "offers": {
              "@type": "Offer",
              "price": propertyPrice,
              "priceCurrency": "INR"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": prop.city || 'Goa',
              "addressRegion": "Goa",
              "addressCountry": "IN"
            }
          })}
        </script>
      </Helmet>
      <Dialog.Portal>
        {/* Backdrop overlay */}
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        {/* Modal Window Wrapper to center Content */}
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Dialog.Content asChild>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full relative border border-brand-sandDark flex flex-col max-h-[90vh]"
            >
              {/* Header Visual Image Container with aspect ratio to eliminate layout shifts */}
              <div className="w-full aspect-[21/9] relative p-8 flex flex-col justify-between text-white overflow-hidden bg-brand-navy shrink-0">
                {prop?.images && prop.images.length > 0 ? (
                  <>
                    <img
                      src={prop.images[0]}
                      alt={propertyTitle}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-0" />
                  </>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} z-0`} />
                )}
                
                <Dialog.Close asChild>
                  <button
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 z-10"
                    aria-label="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>

                <span className="bg-brand-navy/80 text-brand-gold text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full self-start z-10">
                  {propertyType}
                </span>

                <div className="space-y-1 z-10">
                  <Dialog.Title className="text-2xl font-bold tracking-tight text-white drop-shadow">
                    {propertyTitle}
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <p className="text-white/80 text-xs flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{locationFull}</span>
                    </p>
                  </Dialog.Description>
                </div>
              </div>

              {/* Details Content Body */}
              <div className="p-8 space-y-6 flex-grow overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-3 gap-4 border-b border-brand-sandDark pb-6">
                  <div className="text-center space-y-1 border-r border-brand-sandDark">
                    <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Asking Price</span>
                    <div className="text-base font-extrabold text-brand-navy flex items-center justify-center text-brand-goldDark">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatPrice(propertyPrice)}</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1 border-r border-brand-sandDark">
                    <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Total Area</span>
                    <div className="text-base font-extrabold text-brand-navy flex items-center justify-center">
                      <Layers className="w-4 h-4 mr-1 text-brand-navy/70" />
                      <span>{propertySize}</span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[10px] text-brand-text-muted uppercase tracking-wider font-bold">Specifications</span>
                    <p className="text-sm font-bold text-brand-navy leading-normal">
                      {prop?.details ? prop.details.split('|')[0] : propertyType}
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
                          <td className="px-4 py-3 font-mono">CS-00{prop?.id || '0'}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Name</td>
                          <td className="px-4 py-3">{prop?.name || propertyTitle}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">District Location</td>
                          <td className="px-4 py-3">{locationFull}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Asset Type</td>
                          <td className="px-4 py-3">{propertyType}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Planimetric Area</td>
                          <td className="px-4 py-3">{propertySize}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-brand-bg text-brand-text-muted font-extrabold uppercase">Asking Budget</td>
                          <td className="px-4 py-3 text-brand-goldDark font-extrabold">{formatPrice(propertyPrice)} ({propertyPriceStr})</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bulleted Highlights */}
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-brand-navy uppercase tracking-widest">Key Highlights</h3>
                  <ul className="space-y-1.5 text-sm text-brand-text-muted font-medium animate-fadeIn">
                    {descBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-goldDark font-bold mt-0.5">•</span>
                        <span>{bullet}.</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Verification highlights */}
                <div className="bg-brand-bg rounded-2xl p-5 border border-brand-sandDark space-y-3 animate-fadeIn">
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
              <div className="bg-brand-bg p-6 border-t border-brand-sandDark flex flex-col sm:flex-row gap-3 justify-end items-center shrink-0">
                <Dialog.Close asChild>
                  <button
                    className="text-xs font-bold text-brand-navy hover:text-brand-goldDark w-full sm:w-auto px-5 py-3 transition-colors text-center border border-brand-sandDark rounded-xl bg-white hover:bg-brand-bg"
                  >
                    Close Details
                  </button>
                </Dialog.Close>
                <Link
                  to={`/apply?propertyName=${encodeURIComponent(propertyTitle)}&propertyLocation=${encodeURIComponent(prop?.location || 'Goa')}&propertyPrice=${propertyPrice}&loan=property`}
                  onClick={() => setActiveModalProperty(null)}
                  className="bg-brand-navy text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-1 w-full sm:w-auto shadow-sm"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default PropertyDetailModal;
