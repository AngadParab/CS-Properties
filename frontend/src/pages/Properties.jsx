import React, { useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, DollarSign, Home as HomeIcon, Filter, Layers, ArrowUpRight, Heart } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

function Properties() {
  const queryParams = new URLSearchParams(useLocation().search);
  const typeQuery = queryParams.get('type');
  const locQuery = queryParams.get('location');
  const budgetQuery = queryParams.get('budget');

  const { 
    properties, 
    loading, 
    error,
    searchFilters, 
    updateFilters, 
    resetFilters,
    favorites, 
    toggleFavorite, 
    setActiveModalProperty,
    refetchProperties
  } = useProperties();

  // Run initial sync from home query params if they exist
  useEffect(() => {
    const initialFilters = {};
    if (typeQuery) initialFilters.type = typeQuery;
    if (locQuery) initialFilters.location = locQuery;
    if (budgetQuery) initialFilters.maxBudget = Number(budgetQuery) * 10000000;
    
    if (Object.keys(initialFilters).length > 0) {
      updateFilters(initialFilters);
    }
  }, [typeQuery, locQuery, budgetQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-brand-sandDark border-t-brand-goldDark rounded-full animate-spin"></div>
        <span className="text-[10px] font-bold text-brand-text-muted tracking-widest uppercase animate-pulse">Loading Exclusive Spaces...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-brand-sandDark rounded-3xl shadow-xl text-center space-y-6">
        <div className="inline-flex p-3.5 bg-red-50 text-red-600 rounded-full">
          <Filter className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-brand-navy">Failed to load properties</h2>
          <p className="text-xs text-brand-text-muted leading-relaxed font-semibold">
            {error}
          </p>
        </div>
        <button
          onClick={refetchProperties}
          className="w-full bg-brand-navy text-white text-xs font-bold py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  const locations = ['All', 'Margao', 'Panaji', 'Calangute', 'Vasco', 'Mapusa'];
  const types = ['All', 'Apartment', 'Villa', 'Commercial', 'Plot'];

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const matchesSearch = prop.title.toLowerCase().includes(searchFilters.query.toLowerCase()) || 
                            prop.desc.toLowerCase().includes(searchFilters.query.toLowerCase());
      const matchesLocation = searchFilters.location === 'All' || prop.location === searchFilters.location;
      const matchesType = searchFilters.type === 'All' || prop.type === searchFilters.type;
      const matchesBudget = prop.price <= searchFilters.maxBudget;
      return matchesSearch && matchesLocation && matchesType && matchesBudget;
    });
  }, [properties, searchFilters]);

  const formatPrice = (val) => {
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
                value={searchFilters.query}
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
              value={searchFilters.location}
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
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Property Type</label>
            <select
              value={searchFilters.type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="w-full px-3 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Budget filter */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Max Budget</label>
              <span className="text-xs font-bold text-brand-navy">{formatPrice(searchFilters.maxBudget)}</span>
            </div>
            <input
              type="range"
              min={2500000} // 25 Lakhs
              max={50000000} // 5 Crores
              step={1000000}
              value={searchFilters.maxBudget}
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
            <span>Showing {filteredProperties.length} Properties</span>
            {filteredProperties.length === 0 && (
              <span className="text-brand-error normal-case">No matches found. Try resetting filters.</span>
            )}
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredProperties.map((prop) => {
              const isFav = favorites.includes(prop.id);
              return (
                <motion.article
                  key={prop.id}
                  variants={fadeInUp}
                  className={`bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col justify-between ${prop.roundedClass}`}
                >
                  <div>
                    {/* Decorative visual gradient mockup */}
                    <div className={`h-40 bg-gradient-to-br ${prop.gradient} relative p-5 flex flex-col justify-between text-white`}>
                      <div className="flex justify-between items-center w-full">
                        <span className="bg-brand-navy/80 text-brand-gold text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full self-start">
                          {prop.type}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(prop.id);
                          }}
                          className="bg-black/35 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-goldDark"
                          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 font-extrabold text-base drop-shadow-sm text-brand-gold">
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span>{prop.priceStr}</span>
                      </div>
                    </div>

                    {/* Core details */}
                    <div className="p-6 space-y-3">
                      <h3 
                        onClick={() => setActiveModalProperty(prop)}
                        className="text-base font-bold text-brand-navy leading-tight cursor-pointer hover:text-brand-goldDark transition-colors"
                      >
                        {prop.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-xs font-semibold text-brand-text-muted">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-goldDark" />
                          <span>{prop.location}, Goa</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Layers className="w-3.5 h-3.5 text-brand-goldDark" />
                          <span>{prop.details}</span>
                        </span>
                      </div>
                      
                      <p className="text-xs text-brand-text-muted leading-relaxed pt-1">
                        {prop.desc}
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
                      to={`/apply?propertyName=${encodeURIComponent(prop.title)}&propertyLocation=${encodeURIComponent(prop.location)}&propertyPrice=${prop.price}&loan=property`}
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
        </section>

      </div>

    </main>
  );
}

export default Properties;
