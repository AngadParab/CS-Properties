import React, { useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { SUBTYPES_MAP } from '../context/FilterContext';

function FilterSidebar({ 
  searchFilters, 
  updateFilters, 
  resetFilters, 
  isOpen, 
  onClose 
}) {
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

  const formatPrice = (val) => {
    if (!val || isNaN(val)) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    return `₹${(val / 100000).toFixed(0)} Lakhs`;
  };

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-sandDark">
        <div className="flex items-center space-x-2 text-brand-navy font-bold text-xs uppercase tracking-wider">
          <Filter className="w-5 h-5 text-brand-goldDark" />
          <span>Search Filters</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-[10px] font-bold text-brand-goldDark hover:text-brand-navy transition-colors focus-visible:ring-2 focus-visible:ring-brand-goldDark outline-none min-h-[36px] px-2"
        >
          Reset
        </button>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">Location</label>
        <select
          value={searchFilters?.location || 'All'}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="w-full px-3 py-2.5 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none min-h-[44px]"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Asset Class Filter */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">Asset Class</label>
        <select
          value={searchFilters?.type || 'All'}
          onChange={(e) => updateFilters({ type: e.target.value, subtype: 'All' })}
          className="w-full px-3 py-2.5 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none min-h-[44px] truncate"
        >
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Subtype Filter */}
      {availableSubtypes.length > 0 && (
        <div className="space-y-2 animate-fadeIn">
          <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">Property Subtype</label>
          <select
            value={searchFilters?.subtype || 'All'}
            onChange={(e) => updateFilters({ subtype: e.target.value })}
            className="w-full px-3 py-2.5 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none min-h-[44px] truncate"
          >
            <option value="All">All Subtypes</option>
            {availableSubtypes.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      )}

      {/* Budget Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">Max Budget</label>
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
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <aside 
        className="hidden lg:block lg:col-span-3 bg-white border border-brand-sandDark p-6 rounded-2xl shadow-sm h-fit space-y-6"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/55 backdrop-blur-xs z-50 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-over Drawer Panel */}
      <div 
        className={`lg:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-6 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 flex-grow overflow-y-auto">
          <div className="flex justify-end border-b border-brand-sandDark pb-3">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-brand-navy transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-brand-sandDark rounded-full bg-slate-50"
              aria-label="Close filters menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>
    </>
  );
}

export default FilterSidebar;
