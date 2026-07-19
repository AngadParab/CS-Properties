import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import geminiBg from '../assets/gemini.webp';
import propertiesData from '../data/properties.json';
import { 
  Building2, 
  Home as HomeIcon, 
  FileText, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  BadgePercent, 
  Search, 
  MapPin, 
  Quote, 
  ArrowUpRight,
  Award,
  Shield,
  ClipboardCheck,
  Compass
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  // Properties Search State
  const [searchLocation, setSearchLocation] = useState('Panaji');
  const [searchPropertyType, setSearchPropertyType] = useState('Villa');
  const [searchBudget, setSearchBudget] = useState('1.5'); // in Crores

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      type: searchPropertyType,
      location: searchLocation,
      budget: searchBudget,
    }).toString();
    navigate(`/properties?${query}`);
  };



  const featuredProperties = propertiesData.filter(prop => prop.featured);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Framer Motion Animation Presets
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans selection:bg-brand-gold/30">
      
      {/* ========================================================================= */}
      {/* ZONE 1: PROPERTIES SECTION (Hero Search & Featured Listings)             */}
      {/* ========================================================================= */}
      
      <section className="relative bg-gradient-to-b from-brand-bg via-brand-sandDark to-white pt-24 pb-28 px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none select-none">
          <img src={geminiBg} alt="Background" className="w-full h-full object-cover" />
          {/* Subtle dark overlay wash to guarantee high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/35"></div>
        </div>
        {/* Soft abstract graphic elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-gold/5 rounded-full blur-3xl -mr-48 -mt-48 select-none pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl -ml-40 select-none pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center space-y-6 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 shadow-sm text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Goa Properties & Capital Advisors</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05] drop-shadow-sm">
              Connecting you <span className="font-light italic font-syne text-brand-gold tracking-normal">to the home</span> you love
            </h1>
            
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-medium max-w-2xl mx-auto">
              Find premium residential villas, coastal plots, and offices in Goa. Discover handpicked, verified listings with professional real estate guidance and end-to-end documentation support.
            </p>
          </motion.div>

          {/* Bento Glassmorphic Search Form Overlay */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto p-1.5 bg-white/40 border border-white/60 shadow-lg rounded-[24px]"
          >
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-[20px] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-5 items-end shadow-sm">
              
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
                    <option value="Panaji">Panaji (Capital)</option>
                    <option value="Margao">Margao (South)</option>
                    <option value="Calangute">Calangute (North)</option>
                    <option value="Candolim">Candolim</option>
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-brand-navy">Property Type</label>
                <select 
                  value={searchPropertyType} 
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full px-4 py-3.5 border border-brand-sandDark rounded-xl outline-none bg-brand-bg text-xs font-bold text-brand-navy"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Plot">Residential Plot</option>
                  <option value="Commercial">Commercial Office/Shop</option>
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
                className="bg-brand-navy text-white hover:bg-brand-navy/95 font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all outline-none shadow-md text-xs h-[50px]"
              >
                <Search className="w-4 h-4 text-brand-gold" />
                <span>Search Catalog</span>
              </button>

            </form>
          </motion.div>

        </div>
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

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {featuredProperties.map((prop, idx) => (
            <motion.article 
              key={idx} 
              variants={fadeInUp}
              className={`bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between ${prop.roundedClass}`}
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-brand-goldDark uppercase tracking-wider bg-brand-bg px-2.5 py-0.5 rounded">
                      {prop.type}
                    </span>
                    <h3 className="font-bold text-brand-navy text-base mt-2 group-hover:text-brand-goldDark transition-colors">
                      {prop.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-text-muted block font-semibold">Direct Price</span>
                    <span className="font-extrabold text-brand-navy text-sm">{formatCurrency(prop.price)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted border-t border-brand-sandDark pt-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-goldDark" />
                    <span>{prop.location}</span>
                  </span>
                  <span className="font-semibold">{prop.size}</span>
                </div>
              </div>

              <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center text-xs">
                <Link
                  to={`/apply?property=${encodeURIComponent(prop.name)}&loan=property`}
                  className="font-bold text-brand-navy hover:text-brand-goldDark flex items-center justify-center space-x-1 outline-none w-full sm:w-auto text-center py-2 sm:py-0 border border-brand-sandDark sm:border-transparent rounded-lg sm:rounded-none"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  to={`/apply?property=${encodeURIComponent(prop.name)}&loan=property`}
                  className="bg-brand-navy text-white text-[10px] font-bold px-4 py-2.5 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-colors w-full sm:w-auto text-center"
                >
                  Inquire Deal
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
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
            <span className="text-[10px] font-extrabold text-brand-goldDark uppercase tracking-widest block">Core Advisory</span>
            <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight">Unrivaled Expertise in Goan Real Estate</h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-text-muted">
              We provide professional document auditing, clear title checking, and buyer brokerage services to secure sound investments in Goa.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Service 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white border border-brand-sandDark rounded-2xl p-8 flex flex-col justify-between hover:border-brand-goldDark hover:scale-[1.01] transition-all duration-300 group shadow-sm"
            >
              <div className="space-y-4">
                <div className="p-3 bg-brand-bg w-fit rounded-xl border border-brand-sandDark group-hover:bg-brand-goldDark group-hover:text-brand-navy group-hover:border-transparent transition-all">
                  <Shield className="w-6 h-6 text-brand-goldDark" />
                </div>
                <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-brand-goldDark transition-colors">
                  Title & Document Auditing
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  We audit title deeds, mutation records, and land tax history to guarantee the property is free of encumbrances and disputes.
                </p>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white border border-brand-sandDark rounded-2xl p-8 flex flex-col justify-between hover:border-brand-goldDark hover:scale-[1.01] transition-all duration-300 group shadow-sm"
            >
              <div className="space-y-4">
                <div className="p-3 bg-brand-bg w-fit rounded-xl border border-brand-sandDark group-hover:bg-brand-goldDark group-hover:text-brand-navy group-hover:border-transparent transition-all">
                  <ClipboardCheck className="w-6 h-6 text-brand-goldDark" />
                </div>
                <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-brand-goldDark transition-colors">
                  Market Property Valuation
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  Our local valuations provide accurate pricing assessments based on zone regulations, coastal proximity, and commercial demand.
                </p>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white border border-brand-sandDark rounded-2xl p-8 flex flex-col justify-between hover:border-brand-goldDark hover:scale-[1.01] transition-all duration-300 group shadow-sm"
            >
              <div className="space-y-4">
                <div className="p-3 bg-brand-bg w-fit rounded-xl border border-brand-sandDark group-hover:bg-brand-goldDark group-hover:text-brand-navy group-hover:border-transparent transition-all">
                  <Compass className="w-6 h-6 text-brand-goldDark" />
                </div>
                <h3 className="text-lg font-extrabold text-brand-navy group-hover:text-brand-goldDark transition-colors">
                  Off-Market Deal Sourcing
                </h3>
                <p className="text-xs sm:text-sm text-brand-text-muted leading-relaxed">
                  Leverage our deep relations across North and South Goa to unlock exclusive residential plots, villas, and beach properties before they list.
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 3: GOA NEIGHBORHOOD GUIDE SECTION                                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center space-y-3"
        >
          <span className="text-[10px] font-extrabold text-brand-goldDark uppercase tracking-widest block">Local Geography</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">Explore Goa's Finest Neighborhoods</h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-brand-text-muted">
            Find the perfect location for your lifestyle or investment portfolio, from bustling commercial cities to serene beach strips.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1: Panaji */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tl-[50px] rounded-br-[50px]"
          >
            <div className="p-8 space-y-4">
              <span className="text-[9px] font-bold text-brand-goldDark uppercase tracking-wider bg-brand-bg px-2.5 py-0.5 rounded">
                Capital District
              </span>
              <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-goldDark transition-colors">Panaji</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Known for Portuguese heritage homes, riverside promenades, and clean residential streets. Ideal for premium city living and boutique commercial shops.
              </p>
            </div>
            <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
              <Link to="/properties?location=Panaji" className="font-bold text-brand-navy hover:text-brand-goldDark flex items-center space-x-1 outline-none">
                <span>View Listings</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Calangute & Candolim */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tr-[50px] rounded-bl-[50px]"
          >
            <div className="p-8 space-y-4">
              <span className="text-[9px] font-bold text-brand-goldDark uppercase tracking-wider bg-brand-bg px-2.5 py-0.5 rounded">
                Coastal North
              </span>
              <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-goldDark transition-colors">Calangute & Candolim</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                The thriving seaside heart of Goa. Features sandy beaches, fine dining, and luxury vacation villas that command high rental yields.
              </p>
            </div>
            <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
              <Link to="/properties?location=Calangute" className="font-bold text-brand-navy hover:text-brand-goldDark flex items-center space-x-1 outline-none">
                <span>View Listings</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Margao */}
          <motion.div 
            variants={fadeInUp}
            className="bg-white border border-brand-sandDark overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between rounded-tl-[50px] rounded-br-[50px]"
          >
            <div className="p-8 space-y-4">
              <span className="text-[9px] font-bold text-brand-goldDark uppercase tracking-wider bg-brand-bg px-2.5 py-0.5 rounded">
                Cultural South
              </span>
              <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-goldDark transition-colors">Margao</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                Goa's cultural and commercial capital in the South. Surrounded by green fields and traditional heritage estates, perfect for peaceful residential setups.
              </p>
            </div>
            <div className="bg-brand-bg p-5 border-t border-brand-sandDark flex justify-between items-center text-xs">
              <Link to="/properties?location=Margao" className="font-bold text-brand-navy hover:text-brand-goldDark flex items-center space-x-1 outline-none">
                <span>View Listings</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 4: TESTIMONIALS & BANK PARTNERS (Deep Contrast Charcoal Bottom)      */}
      {/* ========================================================================= */}
      
      <section className="bg-brand-charcoal text-white py-24 relative overflow-hidden rounded-tl-[80px]">
        <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-brand-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Testimonial Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-4 lg:pr-8"
            >
              <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-widest">Client Testimonials</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-none">Real People. Real Results.</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Read how Goa residents save broker fees and secure pre-approved credit lines from leading Indian banks.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <motion.div 
                variants={fadeInUp}
                className="bg-white/5 border border-white/5 rounded-2xl p-8 space-y-4 backdrop-blur-sm shadow-md"
              >
                <Quote className="w-8 h-8 text-brand-gold opacity-20" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "Bought a beachfront villa in Calangute. Their professional agency support guided us through title verification, and Credit Solutions arranged a home mortgage with SBI at 8.4%!"
                </p>
                <div className="border-t border-white/5 pt-4">
                  <span className="font-extrabold text-brand-gold block text-xs tracking-wider">Rajesh Fernandes</span>
                  <span className="text-[10px] text-slate-500">Villa Owner, Calangute</span>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="bg-white/5 border border-white/5 rounded-2xl p-8 space-y-4 backdrop-blur-sm shadow-md"
              >
                <Quote className="w-8 h-8 text-brand-gold opacity-20" />
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "Applied for Business Loan and Vehicle Loan at the same time. The step onboarding tool is fast, and they negotiated directly with HDFC Bank to waive the processing fees."
                </p>
                <div className="border-t border-white/5 pt-4">
                  <span className="font-extrabold text-brand-gold block text-xs tracking-wider">Simran D'Souza</span>
                  <span className="text-[10px] text-slate-500">Merchant Retailer, Margao</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Partner Bank Logos Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6 pt-10 border-t border-white/5"
          >
            <p className="text-center text-[10px] font-extrabold text-brand-gold uppercase tracking-widest">
              Direct Loan Connections from 30+ Leading Partners
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 opacity-60 text-xs font-extrabold text-slate-400 select-none">
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 w-28 sm:w-32 text-center">SBI</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 w-28 sm:w-32 text-center">HDFC BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 w-28 sm:w-32 text-center">ICICI BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 w-28 sm:w-32 text-center">AXIS BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2.5 rounded-lg border border-white/5 w-28 sm:w-32 text-center">BANK OF BARODA</span>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}

export default Home;
