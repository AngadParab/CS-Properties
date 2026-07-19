import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Home as HomeIcon, Filter, Layers, ArrowUpRight } from 'lucide-react';
import propertiesList from '../data/properties.json';

function Properties() {
  const queryParams = new URLSearchParams(useLocation().search);
  const typeQuery = queryParams.get('type');
  const locQuery = queryParams.get('location');
  const budgetQuery = queryParams.get('budget');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxBudget, setMaxBudget] = useState(50000000); // 5.0 Crores default max

  // Run initial sync from home query params if they exist
  useEffect(() => {
    if (typeQuery) setSelectedType(typeQuery);
    if (locQuery) setSelectedLocation(locQuery);
    if (budgetQuery) setMaxBudget(Number(budgetQuery) * 10000000);
  }, [typeQuery, locQuery, budgetQuery]);

  const locations = ['All', 'Margao', 'Panaji', 'Calangute', 'Vasco', 'Mapusa'];
  const types = ['All', 'Apartment', 'Villa', 'Commercial', 'Plot'];



  const filteredProperties = useMemo(() => {
    return propertiesList.filter((prop) => {
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prop.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === 'All' || prop.location === selectedLocation;
      const matchesType = selectedType === 'All' || prop.type === selectedType;
      const matchesBudget = prop.price <= maxBudget;
      return matchesSearch && matchesLocation && matchesType && matchesBudget;
    });
  }, [searchQuery, selectedLocation, selectedType, maxBudget]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      {/* Title Header */}
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

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <motion.aside 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="lg:col-span-3 bg-white border border-brand-sandDark p-6 rounded-2xl shadow-sm h-fit space-y-6"
        >
          <div className="flex items-center space-x-2 pb-3 border-b border-brand-sandDark text-brand-navy font-bold text-xs uppercase tracking-wider">
            <Filter className="w-5 h-5 text-brand-goldDark" />
            <span>Search Filters</span>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none"
              />
            </div>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
              <span className="text-xs font-bold text-brand-navy">{formatPrice(maxBudget)}</span>
            </div>
            <input
              type="range"
              min={2500000} // 25 Lakhs
              max={50000000} // 5 Crores
              step={1000000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-brand-navy cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-bold text-brand-text-muted">
              <span>₹25 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>
        </motion.aside>

        {/* Right Side: Grid Showcase */}
        <main className="lg:col-span-9 space-y-6">
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
            {filteredProperties.map((prop) => (
              <motion.article
                key={prop.id}
                variants={fadeInUp}
                className={`bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${prop.roundedClass}`}
              >
                <div>
                  {/* Decorative visual gradient mockup */}
                  <div className={`h-40 bg-gradient-to-br ${prop.gradient} relative p-5 flex flex-col justify-between text-white`}>
                    <span className="bg-brand-navy/80 text-brand-gold text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full self-start">
                      {prop.type}
                    </span>
                    <div className="flex items-center space-x-1 font-extrabold text-base drop-shadow-sm text-brand-gold">
                      <DollarSign className="w-4 h-4 shrink-0" />
                      <span>{prop.priceStr}</span>
                    </div>
                  </div>

                  {/* Core details */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-bold text-brand-navy leading-tight">{prop.title}</h3>
                    
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
                  <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md w-full sm:w-auto text-center">
                    Clear Title
                  </span>
                  <Link
                    to={`/apply?propertyName=${encodeURIComponent(prop.title)}&propertyLocation=${encodeURIComponent(prop.location)}&propertyPrice=${prop.price}&loan=property`}
                    className="bg-brand-navy text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-colors flex items-center justify-center space-x-1 w-full sm:w-auto text-center"
                  >
                    <span>Inquire Deal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </motion.article>
            ))}
          </motion.div>
        </main>

      </div>

    </div>
  );
}

export default Properties;
