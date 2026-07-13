import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  TrendingUp,
  Award
} from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  // Bento Search Form States (Exclusive to Properties)
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

  const featureCards = [
    {
      title: 'Zero Brokerage Commission',
      desc: 'Buy directly from certified owners and save the typical 2% agent commission. Complete transparency.',
      icon: <BadgePercent className="w-6 h-6 text-brand-gold" />,
      span: 'md:col-span-2',
      bgGradient: 'from-blue-950/85 to-slate-900/85',
    },
    {
      title: 'Verified Title Documents',
      desc: 'Every listed property undergoes rigorous legal search and registry document audits.',
      icon: <FileText className="w-6 h-6 text-brand-gold" />,
      span: 'md:col-span-1',
      bgGradient: 'from-slate-900/90 to-blue-950/75',
    },
    {
      title: 'Premium Goa Locations',
      desc: 'Exclusive access to beachfront villas, townhouses, and prime commercial retail spaces.',
      icon: <MapPin className="w-6 h-6 text-brand-gold" />,
      span: 'md:col-span-1',
      bgGradient: 'from-slate-900/90 to-blue-950/75',
    },
    {
      title: 'End-to-End Registration Support',
      desc: 'Our legal advisors handle draft deeds, stamp duty calculations, and represent you at the Sub-Registrar office.',
      icon: <Award className="w-6 h-6 text-brand-gold" />,
      span: 'md:col-span-2',
      bgGradient: 'from-blue-950/85 to-slate-900/85',
    },
  ];

  const featuredProperties = [
    {
      name: 'Sea Breeze Apartments',
      location: 'Panaji, Goa',
      price: 14500000, // 1.45 Cr
      type: '3 BHK Premium',
      size: '1,850 Sq.Ft',
    },
    {
      name: 'Margao Plaza Retail',
      location: 'Margao, Goa',
      price: 22000000, // 2.20 Cr
      type: 'Commercial Shop',
      size: '950 Sq.Ft',
    },
    {
      name: 'Calangute Sands Villa',
      location: 'Calangute, Goa',
      price: 48000000, // 4.80 Cr
      type: '4 BHK Luxury Villa',
      size: '3,200 Sq.Ft',
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-slate-50 min-h-screen space-y-0">
      
      {/* 1. TOP SECTION: Cool Pale Blue-White Hero with Glass Bento Search */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-blue-100/30 rounded-full blur-3xl -mr-64 -mt-64 select-none"></div>
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-yellow-50/20 rounded-full blur-3xl -ml-40 select-none"></div>

        <div className="relative max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-slate-100 shadow-sm text-brand-navy text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <span>Direct Property Deals in Goa</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-brand-navy tracking-tight leading-none">
              Premium Goa Properties.<br />
              <span className="bg-gradient-to-r from-brand-navy to-blue-900 bg-clip-text text-transparent">Zero Brokerage Fees.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed font-medium">
              We connect buyers directly with property owners in Goa. Secure apartments, villas, and plots with complete document verification and sub-registrar support.
            </p>
          </div>

          {/* Bento Glassmorphic Search Form Overlay */}
          <div className="max-w-4xl mx-auto p-1.5 bg-white/30 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg">
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
              
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-brand-gold absolute left-3 top-3.5" />
                  <select 
                    value={searchLocation} 
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 border border-slate-100 rounded-lg outline-none bg-slate-50 text-xs font-semibold text-brand-navy appearance-none"
                  >
                    <option value="Panaji">Panaji (Capital)</option>
                    <option value="Margao">Margao (South)</option>
                    <option value="Calangute">Calangute (North)</option>
                    <option value="Candolim">Candolim</option>
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">Property Type</label>
                <select 
                  value={searchPropertyType} 
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-100 rounded-lg outline-none bg-slate-50 text-xs font-semibold text-brand-navy"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Plot">Residential Plot</option>
                  <option value="Commercial">Commercial Shop/Office</option>
                </select>
              </div>

              {/* Budget Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">Max Budget</label>
                <select 
                  value={searchBudget} 
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-100 rounded-lg outline-none bg-slate-50 text-xs font-semibold text-brand-navy"
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
                className="bg-brand-navy text-white hover:bg-blue-900 font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors outline-none shadow-md text-xs h-[46px]"
              >
                <Search className="w-4 h-4 text-brand-gold" />
                <span>Search Catalog</span>
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* 2. Featured Goa Properties Section (₹ and Localized) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Featured Goa Listings</h2>
            <p className="text-xs sm:text-sm text-brand-text-muted max-w-lg">
              Popular residential and commercial property listings currently available for direct purchase in Goa.
            </p>
          </div>
          <Link to="/properties" className="text-xs font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
            <span>Explore Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-yellow-50 px-2 py-0.5 rounded">
                      {prop.type}
                    </span>
                    <h3 className="font-bold text-brand-navy text-base mt-1 group-hover:text-blue-900 transition-colors">
                      {prop.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-brand-text-muted block">Direct Price</span>
                    <span className="font-extrabold text-brand-navy text-sm">{formatCurrency(prop.price)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted border-t border-slate-50 pt-3">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{prop.location}</span>
                  </span>
                  <span>{prop.size}</span>
                </div>
              </div>

              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
                <Link
                  to={`/apply?propertyName=${prop.name}&propertyLocation=${prop.location.split(',')[0]}&propertyPrice=${prop.price}`}
                  className="text-xs font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  to={`/apply?propertyName=${prop.name}&propertyLocation=${prop.location.split(',')[0]}&propertyPrice=${prop.price}`}
                  className="bg-brand-navy text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-blue-950 transition-colors"
                >
                  Inquire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MIDDLE SECTION: Asymmetric Bento Grid (Real Estate Services & Highlights) */}
      <section className="bg-brand-navy text-white py-24 border-y border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">Core Strengths</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Direct Real Estate Representation</h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-gray-400">
              Why buyers and property investors choose Credit Solutions Goa for commission-free consulting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => (
              <div 
                key={idx}
                className={`${card.span} bg-gradient-to-br ${card.bgGradient} border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 hover:scale-[1.01] transition-all duration-300 group shadow-md backdrop-blur-sm`}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 group-hover:bg-brand-gold group-hover:text-brand-navy group-hover:border-transparent transition-all">
                    {card.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BOTTOM SECTION: Pure Black Testimonials & Call To Action */}
      <section className="bg-[#050505] text-white py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-blue-900/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 select-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Testimonial Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-4 lg:pr-8">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Client Testimonials</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Trusted by Home Owners & Investors</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Read how Goa buyers and sellers secured their properties directly without paying traditional agent commissions.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-md">
                <Quote className="w-8 h-8 text-brand-gold opacity-30" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Bought a penthouse in Panaji through Credit Solutions. Dealing directly with the owner meant we saved over 3.5 Lakhs in agent fees. Extremely smooth paperwork support!"
                </p>
                <div className="border-t border-white/5 pt-3">
                  <span className="font-bold text-brand-gold block text-xs">Rajesh Fernandes</span>
                  <span className="text-[10px] text-gray-500">Penthouse Owner, Panaji</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-md">
                <Quote className="w-8 h-8 text-brand-gold opacity-30" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Zero brokerage was exactly what was promised. Highly professional title checks and registration assistance. Highly recommended."
                </p>
                <div className="border-t border-white/5 pt-3">
                  <span className="font-bold text-brand-gold block text-xs">Simran D'Souza</span>
                  <span className="text-[10px] text-gray-500">Beach House Buyer, Candolim</span>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Call To Action Banner */}
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/40 border border-white/5 rounded-2xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-lg backdrop-blur-sm">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Find Your Property in Goa?</h3>
            <p className="max-w-md mx-auto text-xs sm:text-sm text-gray-400">
              Get direct buyer-seller representation, transparent documentation audits, and zero broker commissions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/apply" 
                className="bg-brand-gold text-brand-navy font-bold text-xs px-8 py-3 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
              >
                Book Office Consultation
              </Link>
              <Link 
                to="/properties" 
                className="border border-white/20 text-white font-semibold text-xs px-8 py-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                Browse Listings Catalog
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
