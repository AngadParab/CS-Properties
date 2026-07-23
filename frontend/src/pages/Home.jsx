import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
const geminiBg = '/images/gemini.webp';
const logoImg = '/images/logo.png';
const gemini320w = '/images/gemini-320w.webp';
const gemini768w = '/images/gemini-768w.webp';
const gemini1200w = '/images/gemini-1200w.webp';
import { useProperties } from '../context/PropertyContext';
import { SUBTYPES_MAP } from '../context/FilterContext';
import { PropertiesGridSkeleton } from '../components/SkeletonLoader';
import { 
  Building2, 
  Home as HomeIcon, 
  FileText, 
  User, 
  ArrowRight, 
  Sparkles, 
  Search, 
  MapPin, 
  Quote, 
  ArrowUpRight,
  Award,
  Shield,
  ClipboardCheck,
  Compass,
  Heart
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  // Properties Search State
  const [searchLocation, setSearchLocation] = useState('South Goa District');
  const [searchPropertyType, setSearchPropertyType] = useState('Residential Real Estate (Living spaces)');
  const [searchSubtype, setSearchSubtype] = useState('All');
  const [searchBudget, setSearchBudget] = useState('1.5'); // in Crores

  const availableSubtypes = SUBTYPES_MAP[searchPropertyType] || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParamsObj = {
      type: searchPropertyType,
      location: searchLocation,
      budget: searchBudget,
    };
    if (searchSubtype && searchSubtype !== 'All') {
      queryParamsObj.subtype = searchSubtype;
    }
    const query = new URLSearchParams(queryParamsObj).toString();
    navigate(`/properties?${query}`);
  };

  const { properties, loading, favorites, toggleFavorite, setActiveModalProperty } = useProperties();
  const featuredProperties = (properties || []).filter(prop => prop?.featured);

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Framer Motion Animation Variants
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
    <div className="space-y-0 selection:bg-brand-gold/30">
      <Helmet>
        <title>CS Properties Goa | Luxury Real Estate & Capital Advisors</title>
        <meta name="description" content="Find premium residential villas, coastal plots, and offices in Goa. Handpicked, verified listings with professional real estate guidance and documentation support." />
        <meta property="og:title" content="CS Properties Goa | Luxury Real Estate & Capital Advisors" />
        <meta property="og:description" content="Connecting you to the home you love in Goa. Verified villas, apartments, plots, and commercial properties." />
        <meta property="og:image" content={logoImg} />
        <meta property="og:type" content="website" />
      </Helmet>

      <main>
        {/* ========================================================================= */}
        {/* ZONE 1: PROPERTIES SECTION (Hero Search & Featured Listings)             */}
        {/* ========================================================================= */}
        
        {/* Slanted Slash Hero Section */}
        <section className="relative bg-brand-navy min-h-[70vh] lg:min-h-[75vh] w-full lg:grid lg:grid-cols-12 overflow-hidden border-b border-brand-charcoal flex items-center">
          
          {/* Mobile-only background image (hidden on desktop) */}
          <div className="absolute inset-0 z-0 opacity-100 pointer-events-none select-none lg:hidden">
            <picture>
              <source srcSet={`${gemini320w} 320w, ${gemini768w} 768w`} sizes="(max-width: 640px) 320px, 768px" type="image/webp" />
              <img src={geminiBg} alt="Background" className="w-full h-full object-cover" />
            </picture>
            {/* Dark overlay wash for mobile readability */}
            <div className="absolute inset-0 bg-black/65"></div>
          </div>

          {/* Background overlay soft glow gradients (desktop only) */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl -ml-40 -mt-20 pointer-events-none hidden lg:block"></div>
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-brand-gold/5 rounded-full blur-3xl -mr-32 -mb-32 pointer-events-none hidden lg:block"></div>

          {/* Left Block: Logo, Info & Typography content */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center px-4 py-24 sm:p-12 lg:p-20 z-10 text-center lg:text-left bg-transparent lg:bg-brand-navy relative w-full">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-6 max-w-2xl mx-auto lg:mx-0 lg:-mt-16"
            >
              {/* Premium transparent logo container (mobile only, centered) */}
              <div className="flex items-center justify-center max-w-[160px] lg:hidden mx-auto">
                <img src={logoImg} alt="CS Properties Logo" className="h-16 w-auto object-contain select-none" />
              </div>

              <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 shadow-sm text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>Goa Properties & Capital Advisors</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
                Connecting you <br className="hidden sm:inline" />
                <span className="font-light italic font-syne text-brand-gold tracking-normal">to the home</span> you love
              </h1>
              
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                Find premium residential villas, coastal plots, and offices in Goa. Discover handpicked, verified listings with professional real estate guidance and end-to-end documentation support.
              </p>
            </motion.div>
          </div>

          {/* Right Block: Diagonally sliced visual cover image (hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-5 relative overflow-hidden h-full min-h-[320px] lg:min-h-0 bg-brand-navy">
            <div className="absolute inset-0 w-full h-full hero-slice-clip z-0">
              <picture>
                <source srcSet={`${gemini320w} 320w, ${gemini768w} 768w, ${gemini1200w} 1200w`} sizes="(max-width: 640px) 320px, (max-width: 1024px) 768px, 1200px" type="image/webp" />
                <img src={geminiBg} alt="CS Properties Premium Assets" className="w-full h-full object-cover" />
              </picture>
              {/* Overlay shading to blend content borders */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-navy via-brand-navy/10 to-transparent"></div>
            </div>
          </div>

          {/* Centered border overlay logo (desktop only) */}
          <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex items-center justify-center">
            <img src={logoImg} alt="CS Properties Symbol" className="h-72 w-auto object-contain transform hover:scale-105 transition-transform duration-300 select-none" />
          </div>
        </section>

        {/* Floating Search Filter Catalog Section (Moved down) */}
        <section className="relative -mt-10 lg:-mt-14 z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="p-1.5 bg-white/20 border border-white/40 shadow-xl rounded-[28px] backdrop-blur-md"
          >
            <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                
                {/* Location */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-brand-gold absolute left-3.5 top-3.5" />
                    <select 
                      value={searchLocation} 
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-3 py-3.5 border border-brand-sandDark rounded-xl outline-none bg-brand-bg text-xs font-bold text-brand-navy appearance-none"
                    >
                      <option value="South Goa District">South Goa District</option>
                      <option value="North Goa District">North Goa District</option>
                      <option value="Kushawati District">Kushawati District</option>
                    </select>
                  </div>
                </div>

                {/* Property Type / Asset Class */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Asset Class</label>
                  <select 
                    value={searchPropertyType} 
                    onChange={(e) => {
                      setSearchPropertyType(e.target.value);
                      setSearchSubtype('All');
                    }}
                    className="w-full px-4 py-3.5 border border-brand-sandDark rounded-xl outline-none bg-brand-bg text-xs font-bold text-brand-navy truncate"
                  >
                    <option value="Residential Real Estate (Living spaces)">Residential Real Estate (Living spaces)</option>
                    <option value="Commercial Real Estate (Business & income generation)">Commercial Real Estate (Business & income generation)</option>
                    <option value="Industrial Real Estate (Production, storage, logistics)">Industrial Real Estate (Production, storage, logistics)</option>
                    <option value="Land / Plots (Raw, subdivided, or agricultural)">Land / Plots (Raw, subdivided, or agricultural)</option>
                    <option value="Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)">Special Purpose / Mixed-Use (Multi-use developments, hospitality, public infrastructure)</option>
                  </select>
                </div>

                {/* Property Subtype (Dynamic) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Subtype</label>
                  <select 
                    value={searchSubtype} 
                    onChange={(e) => setSearchSubtype(e.target.value)}
                    className="w-full px-4 py-3.5 border border-brand-sandDark rounded-xl outline-none bg-brand-bg text-xs font-bold text-brand-navy truncate"
                  >
                    <option value="All">All Subtypes</option>
                    {availableSubtypes.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Max Budget</label>
                  <select 
                    value={searchBudget} 
                    onChange={(e) => setSearchBudget(e.target.value)}
                    className="w-full px-4 py-3.5 border border-brand-sandDark rounded-xl outline-none bg-brand-bg text-xs font-bold text-brand-navy"
                  >
                    <option value="0.75">₹75 Lakhs</option>
                    <option value="1.5">₹1.50 Crore</option>
                    <option value="3.0">₹3.00 Crore</option>
                    <option value="5.0">₹5.00 Crore</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="bg-brand-navy text-white hover:bg-brand-navy/95 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all outline-none shadow-md text-xs h-[50px] w-full"
                >
                  <Search className="w-4 h-4 text-brand-gold" />
                  <span>Search Catalog</span>
                </button>

              </form>
            </div>
          </motion.div>
        </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-brand-sandDark pb-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Featured Goa Listings</h2>
            <p className="text-xs text-brand-text-muted">Explore premium apartments, villas, and commercial shops.</p>
          </div>
          <Link to="/properties" className="text-xs font-extrabold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
            <span>View All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {loading ? (
          <PropertiesGridSkeleton count={3} />
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProperties.map((prop, idx) => {
              const isFav = favorites.includes(prop?.id);
              const propertyName = prop?.name || prop?.title || 'Goa Property';
              const propertyLocation = prop?.location || 'Goa';
              const propertyPrice = prop?.price || 0;
              const propertyType = prop?.type || 'Property';

              return (
                <motion.article 
                  key={idx} 
                  variants={fadeInUp}
                  className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out group flex flex-col justify-between rounded-xl relative"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-brand-goldDark uppercase tracking-wider bg-brand-bg px-2.5 py-0.5 rounded">
                            {propertyType}
                          </span>
                          {/* Heart Favorite Button */}
                          <button
                            type="button"
                            onClick={() => toggleFavorite(prop?.id)}
                            className="p-1.5 rounded-full hover:bg-brand-bg text-slate-400 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-goldDark"
                            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                          </button>
                        </div>
                        <h3 
                          onClick={() => setActiveModalProperty(prop)}
                          className="font-bold text-brand-navy text-base mt-2 group-hover:text-brand-goldDark transition-colors cursor-pointer"
                        >
                          {propertyName}
                        </h3>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-brand-sandDark pt-3">
                      <div>
                        <span className="text-[10px] text-brand-text-muted block font-semibold">Direct Price</span>
                        <span className="font-extrabold text-brand-navy text-sm">{formatCurrency(propertyPrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-text-muted block font-semibold">Location</span>
                        <span className="text-xs text-brand-text-muted font-bold flex items-center justify-end gap-0.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-goldDark" />
                          <span>{propertyLocation}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center text-xs">
                    <button
                      onClick={() => setActiveModalProperty(prop)}
                      className="font-bold text-brand-navy hover:text-brand-goldDark flex items-center justify-center space-x-1 outline-none w-full sm:w-auto text-center py-2 sm:py-0 border border-brand-sandDark sm:border-transparent rounded-lg sm:rounded-none"
                    >
                      <span>Quick View</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <Link
                      to={`/apply?property=${encodeURIComponent(propertyName)}&loan=property`}
                      className="bg-brand-navy text-white text-[10px] font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-colors w-full sm:w-auto text-center"
                    >
                      Inquire Deal
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* ZONE 2: OUR EXPERTISE SECTION (Warm Minimalist Services)                  */}
      {/* ========================================================================= */}
      <section className="bg-brand-sandDark py-24 border-y border-brand-sandDark overflow-hidden rounded-tl-[80px] rounded-br-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center space-y-3"
          >
            <span className="text-xs font-bold text-brand-goldDark tracking-widest uppercase">Expert Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">Real Estate Services & Advisory</h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-text-muted">
              We connect property buyers, investors, and land owners to verified residential, commercial, and land assets across Goa.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Service 1: Commercial */}
            <motion.div 
              variants={fadeInUp} 
              className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tl-[50px] rounded-br-[50px]"
            >
              <div className="p-8 space-y-4">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-brand-bg px-2.5 py-1 rounded-md inline-block">
                  Commercial Real Estate
                </span>
                <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">Commercial Assets</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  Corporate office spaces, retail showrooms, IT parks, and high-yield commercial real estate investments in Goa.
                </p>
              </div>
              <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
                <Link to="/properties?type=Commercial" className="font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
                  <span>Browse Commercial</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Service 2: Residential */}
            <motion.div 
              variants={fadeInUp} 
              className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tr-[50px] rounded-bl-[50px]"
            >
              <div className="p-8 space-y-4">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-brand-bg px-2.5 py-1 rounded-md inline-block">
                  Luxury Residential
                </span>
                <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">Luxury Residential</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  Handpicked sea-facing villas, modern sea breeze apartments, penthouses, and private gated community living.
                </p>
              </div>
              <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
                <Link to="/properties?type=Residential" className="font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
                  <span>View Residential</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Service 3: Legal & Title Audit */}
            <motion.div 
              variants={fadeInUp} 
              className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tl-[50px] rounded-br-[50px]"
            >
              <div className="p-8 space-y-4">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-brand-bg px-2.5 py-1 rounded-md inline-block">
                  Documentation & Verification
                </span>
                <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">Title & Legal Audit</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  Complete Form I&XIV title verification, encumbrance search certificates, and end-to-end legal documentation.
                </p>
              </div>
              <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
                <Link to="/contact" className="font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
                  <span>Legal Guidance</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Service 4: Land & Plots */}
            <motion.div 
              variants={fadeInUp} 
              className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tr-[50px] rounded-bl-[50px]"
            >
              <div className="p-8 space-y-4">
                <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-brand-bg px-2.5 py-1 rounded-md inline-block">
                  Land Acquisition
                </span>
                <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-gold transition-colors">Land & Plot Advisory</h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  Settlement land parcels, coastal plots, agricultural farmlands, and strategic joint-venture development advisory.
                </p>
              </div>
              <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
                <Link to="/properties?type=Land" className="font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
                  <span>Explore Land Plots</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 3: WHY CHOOSE US (Trust Signals & Local Presence)                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs font-bold text-brand-goldDark tracking-widest uppercase">Unmatched Excellence</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Why Investors Trust <br className="hidden sm:inline" />
              <span className="font-light italic font-syne text-brand-goldDark">CS Properties Goa</span>
            </h2>
            <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
              Navigating real estate and financial markets in Goa requires local domain knowledge, bank partnerships, and absolute legal clarity. We bridge the gap between clients, property developers, and institutional lenders.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">100% Clear Titles</h4>
                  <p className="text-[11px] text-brand-text-muted">Rigorous legal verification on all listed plots & villas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">Transparent Valuation</h4>
                  <p className="text-[11px] text-brand-text-muted">Professional market valuation audits & zero hidden fees.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClipboardCheck className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">End-to-End Paperwork</h4>
                  <p className="text-[11px] text-brand-text-muted">We handle sale deeds, NOCs, and mutation documentation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Compass className="w-5 h-5 text-brand-goldDark shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-navy text-sm">Local Goa Presence</h4>
                  <p className="text-[11px] text-brand-text-muted">Offices & field agents in Panaji, Margao, and Calangute.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold px-6 py-3 rounded-xl transition-all shadow-sm text-xs"
              >
                <span>Visit Our Goa Office</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-6 bg-brand-navy text-white p-8 sm:p-12 rounded-3xl space-y-8 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-2xl pointer-events-none"></div>
            <Quote className="w-12 h-12 text-brand-gold/40" />
            <blockquote className="text-base sm:text-lg font-medium leading-relaxed italic text-white/90">
              "Acquiring clear settlement land in South Goa was effortless with CS Properties. Their legal due diligence, NOC clearance, and transparent advisory gave us complete peace of mind."
            </blockquote>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-white text-sm">Rajesh S. Varma</h5>
                <span className="text-xs text-brand-gold">Managing Director, Coastal Logistics</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Sparkles key={s} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      </main>
    </div>
  );
}

export default Home;
