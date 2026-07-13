import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Home as HomeIcon, Filter, Layers } from 'lucide-react';

function Properties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxBudget, setMaxBudget] = useState(50000000); // 5.0 Crores default max

  const locations = ['All', 'Margao', 'Panaji', 'Calangute', 'Vasco', 'Mapusa'];
  const types = ['All', 'Apartment', 'Villa', 'Commercial', 'Plot'];

  const propertiesList = [
    {
      id: 1,
      title: 'Ocean View 3 BHK Apartment',
      location: 'Panaji',
      type: 'Apartment',
      price: 8500000, // 85 Lakhs
      priceStr: '₹85 Lakhs',
      details: '3 BHK | 3 Baths | 1650 sq.ft.',
      desc: 'Luxurious ocean-facing apartment in Miramar, Panaji. Complete with premium fittings, gated security, and swimming pool access.',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      id: 2,
      title: 'Modern 4 BHK Villa with Pool',
      location: 'Calangute',
      type: 'Villa',
      price: 14500000, // 1.45 Crores
      priceStr: '₹1.45 Crores',
      details: '4 BHK | 4 Baths | 3200 sq.ft.',
      desc: 'Stunning contemporary villa in North Goa, featuring a private swimming pool, landscaped gardens, and premium modular kitchen.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 3,
      title: 'Prime Commercial Office Space',
      location: 'Margao',
      type: 'Commercial',
      price: 6000000, // 60 Lakhs
      priceStr: '₹60 Lakhs',
      details: 'G-Floor | 850 sq.ft. | Parking',
      desc: 'Highly visible retail/office space in the heart of Margao market. Excellent footfall and modern infrastructure provisions.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      id: 4,
      title: 'Residential Plot near Highway',
      location: 'Mapusa',
      type: 'Plot',
      price: 3500000, // 35 Lakhs
      priceStr: '₹35 Lakhs',
      details: '350 sq.meters | Clear Title',
      desc: 'Clear settlement land plot located just 5 minutes from Mapusa town. Fully gated community block with water & electricity connectivity.',
      gradient: 'from-violet-500 to-fuchsia-600',
    },
    {
      id: 5,
      title: 'Cozy 2 BHK Flat near Airport',
      location: 'Vasco',
      type: 'Apartment',
      price: 4800000, // 48 Lakhs
      priceStr: '₹48 Lakhs',
      details: '2 BHK | 2 Baths | 1100 sq.ft.',
      desc: 'Strategically located flat close to Dabolim Airport. Ideal for rental income yields or small families with airport commutes.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      id: 6,
      title: 'Heritage Style 3 BHK Villa',
      location: 'Margao',
      type: 'Villa',
      price: 12000000, // 1.20 Crores
      priceStr: '₹1.20 Crores',
      details: '3 BHK | 3 Baths | 2400 sq.ft.',
      desc: 'Beautifully designed Goan-Portuguese style villa in South Goa, blending traditional architecture with modern interior fixtures.',
      gradient: 'from-amber-600 to-yellow-600',
    },
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Properties in Goa</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Browse our premier residential, commercial, and land plot portfolios. We represent you directly to get the best deal with 0% brokerage fees.
        </p>
      </div>

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-brand-navy font-bold">
            <Filter className="w-5 h-5" />
            <span>Search Filters</span>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-text-muted uppercase">Keyword</label>
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-text-muted uppercase">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-text-muted uppercase">Property Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Budget filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-brand-text-muted uppercase">Max Budget</label>
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
            <div className="flex justify-between text-[10px] text-brand-text-muted">
              <span>₹25 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Grid Showcase */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center text-sm text-brand-text-muted font-medium">
            <span>Showing {filteredProperties.length} Properties</span>
            {filteredProperties.length === 0 && (
              <span className="text-brand-error">No matches found. Try resetting filters.</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Decorative visual gradient mockup */}
                  <div className={`h-40 bg-gradient-to-br ${prop.gradient} relative p-4 flex flex-col justify-between text-white`}>
                    <span className="bg-brand-navy/80 text-brand-gold text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full self-start">
                      {prop.type}
                    </span>
                    <div className="flex items-center space-x-1 font-bold text-lg drop-shadow-sm">
                      <DollarSign className="w-4 h-4 shrink-0 text-brand-gold" />
                      <span>{prop.priceStr}</span>
                    </div>
                  </div>

                  {/* Core details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-brand-navy leading-tight">{prop.title}</h3>
                    
                    <div className="flex items-center space-x-4 text-xs font-semibold text-brand-text-muted">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{prop.location}, Goa</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{prop.details}</span>
                      </span>
                    </div>
                    
                    <p className="text-xs text-brand-text-muted leading-relaxed pt-1">
                      {prop.desc}
                    </p>
                  </div>
                </div>

                {/* Card footer/CTA */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                    Clear Title Documented
                  </span>
                  <Link
                    to={`/apply?propertyName=${encodeURIComponent(prop.title)}&propertyLocation=${encodeURIComponent(prop.location)}&propertyPrice=${prop.price}`}
                    className="bg-brand-navy hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-md transition-colors text-xs"
                  >
                    Inquire Deal
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </main>

      </div>

    </div>
  );
}

export default Properties;
