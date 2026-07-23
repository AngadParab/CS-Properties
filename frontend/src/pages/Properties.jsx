import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Filter } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useFilters } from '../context/FilterContext';

// Import newly decomposed components
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import { PropertiesGridSkeleton } from '../components/PropertySkeleton';
import EmptyState from '../components/EmptyState';

function Properties() {
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter properties client-side matching the URL/context search filter states
  const filteredProperties = useMemo(() => {
    return (properties || []).filter((prop) => {
      const title = prop?.title || prop?.name || '';
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

  // Framer Motion Animation Presets
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12" id="properties-catalog-root">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Mobile Filter Toggle Bar */}
        <div className="lg:hidden col-span-12 flex justify-between items-center bg-white border border-brand-sandDark p-4 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            {loading ? 'Loading...' : `${filteredProperties.length} Matches Found`}
          </span>
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center space-x-2 bg-brand-navy text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all duration-200 min-h-[44px] min-w-[100px] justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-goldDark outline-none"
            aria-label="Open filter settings panel"
          >
            <Filter className="w-4 h-4 text-brand-gold" />
            <span>Filters</span>
          </button>
        </div>

        {/* Left Side: Filter Sidebar (Desktop and Mobile drawer overlay) */}
        <FilterSidebar
          searchFilters={searchFilters}
          updateFilters={updateFilters}
          resetFilters={resetFilters}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {/* Right Side: SearchBar & Grid Showcase */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          {/* Keyword Searchbar Component */}
          <SearchBar 
            value={searchFilters?.query || ''} 
            onChange={updateFilters} 
          />

          <div className="flex justify-between items-center text-xs text-brand-text-muted font-bold tracking-wide uppercase">
            <span>Showing {loading ? '...' : filteredProperties.length} Properties</span>
          </div>

          {loading ? (
            <PropertiesGridSkeleton count={4} />
          ) : error ? (
            <div className="p-8 bg-white border border-brand-sandDark rounded-3xl text-center space-y-4 shadow-sm">
              <p className="text-sm font-bold text-brand-navy">Failed to load property listings</p>
              <p className="text-xs text-brand-text-muted">{error}</p>
              <button
                onClick={refetchProperties}
                className="bg-brand-navy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-colors cursor-pointer min-h-[44px]"
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
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop?.id || Math.random().toString()}
                  prop={prop}
                  isFav={favorites.includes(prop?.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelectProperty={setActiveModalProperty}
                  fadeInUp={fadeInUp}
                />
              ))}
            </motion.div>
          )}
        </section>

      </div>

    </main>
  );
}

export default Properties;
