import React, { useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, DollarSign, Filter, Layers, ArrowUpRight, Heart } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFilters, SUBTYPES_MAP } from '../context/FilterContext';
import { PropertiesGridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

function Properties() {
  const queryParams = new URLSearchParams(useLocation().search);
  const typeQuery = queryParams.get('type');
  const subtypeQuery = queryParams.get('subtype');
  const locQuery = queryParams.get('location');
  const budgetQuery = queryParams.get('budget');

  const { 
    properties, 
    loading, 
    error,
    favorites, 
    toggleFavorite, 
    setActiveModalProperty,
    refetchProperties
  } = useProperties();

  const { searchFilters, updateFilters, resetFilters } = useFilters();

  // Run initial sync from home query params if they exist
  useEffect(() => {
    const initialFilters = {};
    if (typeQuery) initialFilters.type = typeQuery;
    if (subtypeQuery) initialFilters.subtype = subtypeQuery;
    if (locQuery) initialFilters.location = locQuery;
    if (budgetQuery) initialFilters.maxBudget = Number(budgetQuery) * 10000000;
    
    if (Object.keys(initialFilters).length > 0) {
      updateFilters(initialFilters);
    }
  }, [typeQuery, subtypeQuery, locQuery, budgetQuery, updateFilters]);

  const locations = ['All', 'South Goa District', 'North Goa District', 'Kushawati District'];
  const types = [
    'All',
    'Residential Real Estate (Living spaces)',
    'Commercial Real Estate (Business & income generation)',
    'Industrial Real Estate (Production, storage, logistics)',
    'Land / Plots (Raw, subdivided, or agricultural)',
    'Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)'
  ];

  const availableSubtypes = useMemo(() => {
    if (!searchFilters?.type || searchFilters.type === 'All') return [];
    return SUBTYPES_MAP[searchFilters.type] || [];
  }, [searchFilters?.type]);

  const filteredProperties = useMemo(() => {
    return (properties || []).filter((prop) => {
      const title = prop?.title || '';
      const desc = prop?.desc || '';
      const matchesSearch = title.toLowerCase().includes((searchFilters?.query || '').toLowerCase()) || 
                            desc.toLowerCase().includes((searchFilters?.query || '').toLowerCase());
      
      const filterLoc = searchFilters?.location || 'All';
      const matchesLocation = filterLoc === 'All' || prop?.location === filterLoc || (prop?.locationFull || '').includes(filterLoc);
      
      const filterType = searchFilters?.type || 'All';
      const matchesType = filterType === 'All' || prop?.type === filterType || (filterType && prop?.type && prop.type.toLowerCase().includes(filterType.toLowerCase()));

      const filterSubtype = searchFilters?.subtype || 'All';
      const matchesSubtype = filterSubtype === 'All' || prop?.subtype === filterSubtype || (filterSubtype && prop?.subtype && prop.subtype.toLowerCase().includes(filterSubtype.toLowerCase()));

      const matchesBudget = (prop?.price || 0) <= (searchFilters?.maxBudget || 50000000);
      return matchesSearch && matchesLocation && matchesType && matchesSubtype && matchesBudget;
    });
  }, [properties, searchFilters]);

  const formatPrice = (val) => {
    if (!val || isNaN(val)) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  // Framer Motion presets
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <Helmet>
        <title>Exclusive Goa Real Estate Listings | CS Properties</title>
        <meta name="description" content="Browse verified villas, apartments, plots, and offices for sale in Goa. Filter by location and budget, with professional documentation support." />
        <meta property="og:title" content="Exclusive Goa Real Estate Listings | CS Properties" />
        <meta property="og:description" content="Browse verified luxury villas, coastal plots, and commercial spaces in Goa." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": filteredProperties.map((prop, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `${window.location.origin}/properties?id=${prop.id}`,
              "name": prop.title || prop.name
            }))
          })}
        </script>
      </Helmet>
      
      {/* Title Header */}
      <header>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-extrabold text-brand-navy tracking-tight">
            Discover <span className="font-light italic font-syne text-brand-goldDark">exclusive spaces</span> in Goa
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-brand-text-muted leading-relaxed">
            Browse our premier residential, commercial, and land plot portfolios. We provide end-to-end professional agency guidance to secure your ideal property with clear titles.
          </p>
        </motion.div>
      </header>

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <motion.aside 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="lg:col-span-3 bg-white border border-brand-sandDark p-6 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-brand-sandDark">
            <div className="flex items-center space-x-2 text-brand-navy font-bold text-xs uppercase tracking-wider">
              <Filter className="w-5 h-5 text-brand-goldDark" />
              <span>Search Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-brand-goldDark hover:text-brand-navy transition-colors focus-visible:outline-none"
            >
              Reset
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchFilters?.query || ''}
                onChange={(e) => updateFilters({ query: e.target.value })}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none"
              />
            </div>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Location</label>
            <select
              value={searchFilters?.location || 'All'}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="w-full px-3 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Asset Class</label>
            <select
              value={searchFilters?.type || 'All'}
              onChange={(e) => updateFilters({ type: e.target.value, subtype: 'All' })}
              className="w-full px-3 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none truncate"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Subtype filter (Dynamically populates based on selected Asset Class) */}
          {availableSubtypes.length > 0 && (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Property Subtype</label>
              <select
                value={searchFilters?.subtype || 'All'}
                onChange={(e) => updateFilters({ subtype: e.target.value })}
                className="w-full px-3 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none truncate"
              >
                <option value="All">All Subtypes</option>
                {availableSubtypes.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          )}

          {/* Budget filter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Max Budget</label>
              <span className="text-xs font-bold text-brand-navy">{formatPrice(searchFilters?.maxBudget)}</span>
            </div>
            <input
              type="range"
              min={2500000} // 25 Lakhs
              max={50000000} // 5 Crores
              step={1000000}
              value={searchFilters?.maxBudget || 50000000}
              onChange={(e) => updateFilters({ maxBudget: Number(e.target.value) })}
              className="w-full accent-brand-navy cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-brand-text-muted">
              <span>₹25 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>
        </motion.aside>

        {/* Right Side: Grid Showcase */}
        <section className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center text-xs text-brand-text-muted font-bold tracking-wide uppercase">
            <span>Showing {loading ? '...' : filteredProperties.length} Properties</span>
          </div>

          {loading ? (
            <PropertiesGridSkeleton count={4} />
          ) : error ? (
            <div className="p-8 bg-white border border-brand-sandDark rounded-3xl text-center space-y-4">
              <p className="text-sm font-bold text-brand-navy">Failed to load property listings</p>
              <p className="text-xs text-brand-text-muted">{error}</p>
              <button
                onClick={refetchProperties}
                className="bg-brand-navy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredProperties.map((prop) => {
                const isFav = favorites.includes(prop?.id);
                const gradientClass = prop?.gradient || 'from-slate-800 to-slate-900';
                const propertyTitle = prop?.title || prop?.name || 'Goa Real Estate Space';
                const propertyLocation = prop?.location || 'Goa';
                const propertyPrice = prop?.price || 0;
                const propertyType = prop?.type || 'Property';

                return (
                  <motion.article
                    key={prop?.id || Math.random()}
                    variants={fadeInUp}
                    className={`bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between ${prop?.roundedClass || 'rounded-2xl'}`}
                  >
                    <div>
                      {/* Fixed aspect ratio visual container to eliminate Cumulative Layout Shift (CLS) */}
                      <div className="w-full aspect-[4/3] relative p-5 flex flex-col justify-between text-white overflow-hidden bg-brand-navy">
                        {prop?.images && prop.images.length > 0 ? (
                          <>
                            <img
                              src={prop.images[0]}
                              alt={propertyTitle}
                              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-0" />
                          </>
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} z-0`} />
                        )}
                        <div className="flex justify-between items-center w-full z-10">
                          <span className="bg-brand-navy/80 text-brand-gold text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full self-start">
                            {propertyType}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(prop?.id);
                            }}
                            className="bg-black/35 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-goldDark z-10"
                            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                          </button>
                        </div>
                        <div className="flex items-center space-x-1 font-extrabold text-base drop-shadow-sm text-brand-gold z-10">
                          <DollarSign className="w-4 h-4 shrink-0" />
                          <span>{prop?.priceStr || formatPrice(propertyPrice)}</span>
                        </div>
                      </div>

                      {/* Core details */}
                      <div className="p-6 space-y-3">
                        <h3 
                          onClick={() => setActiveModalProperty(prop)}
                          className="text-base font-bold text-brand-navy leading-tight cursor-pointer hover:text-brand-goldDark transition-colors"
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
                            <span>{prop?.details || propertyType}</span>
                          </span>
                        </div>
                        
                        <p className="text-xs text-brand-text-muted leading-relaxed pt-1 line-clamp-3">
                          {prop?.desc || ''}
                        </p>
                      </div>
                    </div>

                    {/* Card footer/CTA */}
                    <div className="px-6 pb-5 pt-3 border-t border-brand-sandDark flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between w-full">
                      <button
                        onClick={() => setActiveModalProperty(prop)}
                        className="text-xs font-bold text-brand-navy hover:text-brand-goldDark transition-colors w-full sm:w-auto text-left"
                      >
                        Quick View
                      </button>
                      <Link
                        to={`/apply?propertyName=${encodeURIComponent(propertyTitle)}&propertyLocation=${encodeURIComponent(propertyLocation)}&propertyPrice=${propertyPrice}&loan=property`}
                        className="bg-brand-navy text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto text-center"
                      >
                        <span>Inquire Deal</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>

      </div>

    </main>
  );
}

export default Properties;
