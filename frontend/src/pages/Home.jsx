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
  Briefcase,
  Coins,
  Car,
  ChevronRight,
  ShieldCheck
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

  const loanProducts = [
    {
      title: 'Business Loans',
      desc: 'Access working capital, equipment financing, or expansion credit lines directly from 30+ leading Indian banks.',
      icon: <Briefcase className="w-6 h-6 text-brand-gold" />,
      link: '/services',
      loanCode: 'business',
      span: 'md:col-span-2',
      bgGradient: 'from-blue-950/85 to-slate-900/85',
    },
    {
      title: 'Home Mortgages',
      desc: 'Finance your villa purchase, flat booking, or construction project with direct direct bank rates.',
      icon: <Building2 className="w-6 h-6 text-brand-gold" />,
      link: '/services',
      loanCode: 'mortgage',
      span: 'md:col-span-1',
      bgGradient: 'from-slate-900/90 to-blue-950/75',
    },
    {
      title: 'Loan Against Property (LAP)',
      desc: 'Unlock equity value from your existing commercial or residential real estate holdings in Goa.',
      icon: <Coins className="w-6 h-6 text-brand-gold" />,
      link: '/services',
      loanCode: 'lap',
      span: 'md:col-span-1',
      bgGradient: 'from-slate-900/90 to-blue-950/75',
    },
    {
      title: 'Personal Credit Lines',
      desc: 'Quick unsecured loans for personal requirements with direct approvals and flexible tenure options.',
      icon: <User className="w-6 h-6 text-brand-gold" />,
      link: '/services',
      loanCode: 'personal',
      span: 'md:col-span-2',
      bgGradient: 'from-blue-950/85 to-slate-900/85',
    },
  ];

  const featuredProperties = [
    {
      name: 'Sea Breeze Apartments',
      location: 'Panaji, Goa',
      price: 8500000,
      type: 'Apartment',
      size: '1,650 Sq.Ft',
    },
    {
      name: 'Calangute Sands Villa',
      location: 'Calangute, Goa',
      price: 14500000,
      type: 'Luxury Villa',
      size: '3,200 Sq.Ft',
    },
    {
      name: 'Margao Plaza Retail',
      location: 'Margao, Goa',
      price: 6000000,
      type: 'Commercial Shop',
      size: '850 Sq.Ft',
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
      
      {/* ========================================================================= */}
      {/* ZONE 1: PROPERTIES SECTION (Hero Search, Listings Portfolio)              */}
      {/* ========================================================================= */}
      
      <section className="relative bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-blue-100/30 rounded-full blur-3xl -mr-64 -mt-64 select-none"></div>
        
        <div className="relative max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-slate-100 shadow-sm text-brand-navy text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <span>Goa Properties & Structured Finance</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-brand-navy tracking-tight leading-none">
              Premium Goa Properties.<br />
              <span className="bg-gradient-to-r from-brand-navy to-blue-900 bg-clip-text text-transparent">Direct Deals. Zero Brokerage.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-brand-text-muted leading-relaxed font-medium">
              Find premium residential villas, coastal plots, and offices in Goa. Secure your property directly from owners with professional document support and 0% brokerage fees.
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
                  <option value="Commercial">Commercial Office/Shop</option>
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

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">Featured Goa Listings</h2>
            <p className="text-xs text-brand-text-muted mt-0.5">Explore premium apartments, villas, and commercial shops.</p>
          </div>
          <Link to="/properties" className="text-xs font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none">
            <span>View All Listings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map((prop, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider bg-yellow-50 px-2.5 py-0.5 rounded">
                      {prop.type}
                    </span>
                    <h3 className="font-bold text-brand-navy text-sm mt-1.5 group-hover:text-blue-900 transition-colors">
                      {prop.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-text-muted block font-semibold">Direct Price</span>
                    <span className="font-extrabold text-brand-navy text-sm">{formatCurrency(prop.price)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-brand-text-muted border-t border-slate-50 pt-2.5">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{prop.location}</span>
                  </span>
                  <span className="font-semibold">{prop.size}</span>
                </div>
              </div>

              <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <Link
                  to={`/apply?property=${encodeURIComponent(prop.name)}&loan=property`}
                  className="font-bold text-brand-navy hover:text-brand-gold flex items-center space-x-1 outline-none"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
                <Link
                  to={`/apply?property=${encodeURIComponent(prop.name)}&loan=property`}
                  className="bg-brand-navy text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-blue-950 transition-colors"
                >
                  Inquire Deal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 2: STRUCTURED LOANS SECTION (Middle Bento Grid)                      */}
      {/* ========================================================================= */}
      
      <section className="bg-brand-navy text-white py-20 border-y border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">Fintech Solutions</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Structured Banking & Loan Advisory</h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-gray-400">
              Get corporate funds, home mortgages, and equity release loans direct from 30+ leading banks with 0% advisory commission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loanProducts.map((prod, idx) => (
              <div 
                key={idx}
                className={`${prod.span} bg-gradient-to-br ${prod.bgGradient} border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 hover:scale-[1.01] transition-all duration-300 group shadow-md`}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 group-hover:bg-brand-gold group-hover:text-brand-navy group-hover:border-transparent transition-all">
                    {prod.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-gold transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {prod.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/5">
                  <Link 
                    to={`/apply?loan=${prod.loanCode}`} 
                    className="text-xs font-bold text-brand-gold hover:text-white flex items-center space-x-1 outline-none"
                  >
                    <span>Apply for Loan</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to={prod.link} 
                    className="text-[10px] text-gray-500 font-semibold hover:text-white"
                  >
                    View Criteria
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 3: WHEELS FINANCING SECTION (Lower Showcase Card)                    */}
      {/* ========================================================================= */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">Auto Loans</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">Premium Wheels Financing</h2>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-brand-text-muted">
            Secure fast approvals for premium passenger cars, utility vehicles, or luxury super-bikes with direct bank processing.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 gap-0 max-w-5xl mx-auto">
          {/* Visual Side */}
          <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 p-8 sm:p-10 flex flex-col justify-between text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <div className="space-y-4">
              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                Auto Finance
              </span>
              <h3 className="text-xl sm:text-2xl font-black leading-tight">
                Unlock Your Next Vehicle Drive.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Advising on premium car financing direct from top auto lending channels.
              </p>
            </div>
            
            <div className="pt-8 flex items-center space-x-3 text-xs text-brand-gold">
              <Car className="w-8 h-8 animate-pulse shrink-0" />
              <div>
                <span className="block font-bold text-white">48-Hr Approvals</span>
                <span className="text-[10px] text-slate-500">Direct Registry Processing</span>
              </div>
            </div>
          </div>

          {/* Details & CTA List Side */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">New Car Finance</span>
                  <span className="text-brand-text-muted text-[10px]">Processing packages from 8.5% interest.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Used Car Approvals</span>
                  <span className="text-brand-text-muted text-[10px]">Quick valuation checks & title checks.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Premium Superbikes</span>
                  <span className="text-brand-text-muted text-[10px]">Funding allocations for models above 250cc.</span>
                </div>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">0% Processing Fee Advisory</span>
                  <span className="text-brand-text-muted text-[10px]">Verify and audit lender commissions.</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-50 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-brand-text-muted">
                Pre-approved auto lending solutions.
              </span>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Link
                  to="/wheels"
                  className="text-xs font-bold text-brand-navy hover:text-brand-gold px-4 py-2 border border-slate-200 rounded-lg text-center w-full sm:w-auto"
                >
                  Explore Catalog
                </Link>
                <Link
                  to="/apply?loan=vehicle"
                  className="bg-brand-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-center w-full sm:w-auto"
                >
                  Apply Auto Loan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ZONE 4: TESTIMONIALS & BANK PARTNERS (Pure Black contrast bottom)         */}
      {/* ========================================================================= */}
      
      <section className="bg-[#050505] text-white py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-blue-900/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 select-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Testimonial Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="space-y-4 lg:pr-8">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Client Testimonials</span>
              <h2 className="text-3xl font-extrabold tracking-tight">Real People. Real Results.</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Read how Goa residents save broker fees and secure pre-approved credit lines from leading Indian banks.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-md">
                <Quote className="w-8 h-8 text-brand-gold opacity-30" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Bought a beachfront villa in Calangute. Direct buyer representation saved us 4 Lakhs in commission, and Credit Solutions arranged a home mortgage with SBI at 8.4%!"
                </p>
                <div className="border-t border-white/5 pt-3">
                  <span className="font-bold text-brand-gold block text-xs">Rajesh Fernandes</span>
                  <span className="text-[10px] text-gray-500">Villa Owner, Calangute</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4 backdrop-blur-sm shadow-md">
                <Quote className="w-8 h-8 text-brand-gold opacity-30" />
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "Applied for Business Loan and Vehicle Loan at the same time. The step onboarding tool is fast, and they negotiated directly with HDFC Bank to waive the processing fees."
                </p>
                <div className="border-t border-white/5 pt-3">
                  <span className="font-bold text-brand-gold block text-xs">Simran D'Souza</span>
                  <span className="text-[10px] text-gray-500">Merchant Retailer, Margao</span>
                </div>
              </div>

            </div>
          </div>

          {/* Partner Bank Logos Grid */}
          <div className="space-y-6 pt-10 border-t border-white/5">
            <p className="text-center text-[10px] font-bold text-brand-gold uppercase tracking-wider">
              Direct Loan Connections from 30+ Leading Partners
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center justify-items-center opacity-60 text-xs font-bold text-slate-400 select-none">
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-32 text-center">SBI</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-32 text-center">HDFC BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-32 text-center">ICICI BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-32 text-center">AXIS BANK</span>
              <span className="hover:text-white transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5 w-32 text-center">BANK OF BARODA</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;
