import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Layers, ArrowUpRight, Heart } from 'lucide-react';

function PropertyCard({ 
  prop, 
  isFav, 
  onToggleFavorite, 
  onSelectProperty,
  fadeInUp 
}) {
  const gradientClass = prop?.gradient || 'from-slate-800 to-slate-900';
  const propertyTitle = prop?.title || prop?.name || 'Goa Real Estate Space';
  const propertyLocation = prop?.location || 'Goa';
  const propertyPrice = prop?.price || 0;
  const propertyType = prop?.type || 'Property';

  const formatPrice = (val) => {
    if (!val || isNaN(val)) return 'Price on Request';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  return (
    <motion.article
      variants={fadeInUp}
      className={`bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 ease-in-out flex flex-col justify-between cursor-pointer rounded-xl group focus-within:ring-2 focus-within:ring-blue-600 outline-none`}
    >
      <div>
        {/* Image Container with fixed aspect ratio to eliminate layout shift */}
        <div className="w-full aspect-[4/3] relative flex flex-col justify-between text-white overflow-hidden bg-brand-navy shrink-0">
          {prop?.images && prop.images.length > 0 ? (
            <>
              <img
                src={prop.images[0]}
                alt={`${prop.details || 'Property'} in ${propertyLocation}, Goa`}
                width={400}
                height={300}
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-0" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} z-0`} />
          )}

          {/* Badge & Favorites Trigger */}
          <div className="flex justify-between items-center w-full p-4 z-10">
            <span className="bg-brand-navy/80 text-brand-gold text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full self-start">
              {propertyType}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(prop?.id);
              }}
              className="bg-black/35 hover:bg-black/50 text-white p-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-brand-goldDark outline-none cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
          </div>

          <div className="flex items-center space-x-1 font-black text-lg p-4 drop-shadow-sm text-brand-gold z-10">
            <DollarSign className="w-4 h-4 shrink-0 text-brand-gold" />
            <span>{prop?.priceStr || formatPrice(propertyPrice)}</span>
          </div>
        </div>

        {/* Card details body */}
        <div className="p-6 space-y-3">
          <h3 
            onClick={() => onSelectProperty(prop)}
            className="text-lg font-bold text-slate-800 leading-tight cursor-pointer hover:text-brand-goldDark transition-colors line-clamp-1"
          >
            {propertyTitle}
          </h3>
          
          <div className="flex items-center space-x-4 text-xs font-semibold text-brand-text-muted">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-brand-goldDark" />
              <span>{propertyLocation}, Goa</span>
            </span>
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-brand-goldDark" />
              <span>{prop?.size || 'N/A'}</span>
            </span>
          </div>
          
          <p className="text-sm text-slate-500 font-medium leading-relaxed pt-1 line-clamp-2">
            {prop?.desc || 'Premium listings in Goa.'}
          </p>
        </div>
      </div>

      {/* Footer controls */}
      <div className="px-6 pb-5 pt-3 border-t border-brand-sandDark flex flex-row items-center justify-between gap-3 w-full shrink-0">
        <button
          onClick={() => onSelectProperty(prop)}
          className="text-xs font-extrabold text-brand-navy hover:text-brand-goldDark transition-colors text-left min-h-[44px] px-3 focus-visible:ring-2 focus-visible:ring-brand-goldDark outline-none rounded-lg"
        >
          Quick View
        </button>
        <Link
          to={`/apply?propertyName=${encodeURIComponent(propertyTitle)}&propertyLocation=${encodeURIComponent(propertyLocation)}&propertyPrice=${propertyPrice}&loan=property`}
          className="bg-brand-navy text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-1 min-h-[44px] text-center focus-visible:ring-2 focus-visible:ring-brand-goldDark outline-none"
        >
          <span>Inquire Deal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

export default PropertyCard;
