import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Car, Search, Filter, DollarSign, Calendar, Compass, Zap } from 'lucide-react';

function Wheels() {
  const [vehicleType, setVehicleType] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Car', 'Bike', 'EV'];
  const fuels = ['All', 'Petrol', 'Diesel', 'Electric'];

  const vehicleList = [
    {
      id: 1,
      title: 'Premium Family SUV (7-Seater)',
      type: 'Car',
      fuel: 'Diesel',
      price: 1550000,
      priceStr: '₹15.50 Lakhs',
      emi: '₹22,400 /mo',
      specs: 'Manual | 2022 | 24,000 km',
      desc: 'Top-tier family SUV in mint condition. Perfect choice for highway road trips, featuring high ground clearance and dual-zone climate control.',
      gradient: 'from-slate-700 to-slate-900',
    },
    {
      id: 2,
      title: 'Electric Commuter Scooter',
      type: 'EV',
      fuel: 'Electric',
      price: 125000,
      priceStr: '₹1.25 Lakhs',
      emi: '₹2,100 /mo',
      specs: 'Automatic | 2023 | 5,500 km',
      desc: 'Eco-friendly smart electric scooter with a range of 120 km per charge. Low running maintenance cost and full digital dash telemetry.',
      gradient: 'from-emerald-600 to-cyan-700',
    },
    {
      id: 3,
      title: 'Performance Sport Bike (300cc)',
      type: 'Bike',
      fuel: 'Petrol',
      price: 280000,
      priceStr: '₹2.80 Lakhs',
      emi: '₹4,500 /mo',
      specs: '6-Speed | 2021 | 12,000 km',
      desc: 'Raw power and precision handling. Serviced regularly at authorized workshops in Margao. Dual channel ABS standard.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      id: 4,
      title: 'Eco Hatchback (Automatic)',
      type: 'Car',
      fuel: 'Petrol',
      price: 680000,
      priceStr: '₹6.80 Lakhs',
      emi: '₹10,500 /mo',
      specs: 'AMT | 2022 | 18,500 km',
      desc: 'Highly fuel-efficient city hatchback. Easy to park in congested Goan lanes, featuring touch-screen infotainment and reverse sensors.',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      id: 5,
      title: 'Luxurious Electric Sedan',
      type: 'EV',
      fuel: 'Electric',
      price: 2450000,
      priceStr: '₹24.50 Lakhs',
      emi: '₹34,800 /mo',
      specs: 'Automatic | 2023 | 9,800 km',
      desc: 'A premium smart EV sedan with autonomous parking, leather upholstery, panoramic sunroof, and fast DC charging support.',
      gradient: 'from-purple-700 to-indigo-900',
    },
  ];

  const filteredVehicles = useMemo(() => {
    return vehicleList.filter((veh) => {
      const matchesSearch = veh.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            veh.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = vehicleType === 'All' || veh.type === vehicleType;
      const matchesFuel = fuelType === 'All' || veh.fuel === fuelType;
      return matchesSearch && matchesType && matchesFuel;
    });
  }, [searchQuery, vehicleType, fuelType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-brand-navy">Wheels & Vehicle Finance</h1>
        <p className="max-w-2xl mx-auto text-brand-text-muted">
          Looking for a new or pre-owned car/bike? We secure instant auto financing solutions directly from top lenders with 0% brokerage.
        </p>
      </div>

      {/* Main Filter & Listing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Filter Sidebar */}
        <aside className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm h-fit space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 text-brand-navy font-bold">
            <Filter className="w-5 h-5" />
            <span>Vehicle Filters</span>
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
                placeholder="Search SUV, EV..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Vehicle Type filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-text-muted uppercase">Vehicle Class</label>
            <div className="flex flex-col gap-1.5 pt-1">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    vehicleType === type
                      ? 'bg-brand-navy text-white'
                      : 'bg-slate-50 text-brand-navy hover:bg-slate-100'
                  }`}
                >
                  {type === 'All' ? 'All Classes' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-brand-text-muted uppercase">Fuel / Power</label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {fuels.map((fuel) => (
                <option key={fuel} value={fuel}>{fuel === 'All' ? 'All Fuels' : fuel}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Side: Grid Showcase */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center text-sm text-brand-text-muted font-medium">
            <span>Showing {filteredVehicles.length} Vehicles</span>
            {filteredVehicles.length === 0 && (
              <span className="text-brand-error">No vehicle match. Try broadening filters.</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVehicles.map((veh) => (
              <div
                key={veh.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Decorative visual gradient mockup */}
                  <div className={`h-40 bg-gradient-to-br ${veh.gradient} relative p-4 flex flex-col justify-between text-white`}>
                    <div className="flex justify-between items-center">
                      <span className="bg-brand-navy/80 text-brand-gold text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full">
                        {veh.type}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {veh.fuel}
                      </span>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex items-center space-x-1 font-bold text-lg drop-shadow-sm">
                        <DollarSign className="w-4 h-4 text-brand-gold" />
                        <span>{veh.priceStr}</span>
                      </div>
                      <span className="text-[10px] text-brand-gold font-bold">
                        EMI: {veh.emi}
                      </span>
                    </div>
                  </div>

                  {/* Core details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-brand-navy leading-tight">{veh.title}</h3>
                    
                    <div className="flex items-center space-x-4 text-xs font-semibold text-brand-text-muted">
                      <span className="flex items-center space-x-1">
                        <Compass className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{veh.specs}</span>
                      </span>
                    </div>
                    
                    <p className="text-xs text-brand-text-muted leading-relaxed pt-1">
                      {veh.desc}
                    </p>
                  </div>
                </div>

                {/* Card footer/CTA */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-navy flex items-center space-x-1 uppercase">
                    <Zap className="w-3.5 h-3.5 text-brand-gold" />
                    <span>90% Funding Available</span>
                  </span>
                  <Link
                    to={`/apply?vehicle=${encodeURIComponent(veh.title)}&loan=personal`}
                    className="bg-brand-navy hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-md transition-colors text-xs"
                  >
                    Apply for Auto Loan
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

export default Wheels;
