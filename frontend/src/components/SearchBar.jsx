import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-extrabold text-brand-navy uppercase tracking-widest block">
        Keyword Search
      </label>
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="Search villas, plots, offices..."
          className="w-full pl-9 pr-4 py-3 border border-brand-sandDark bg-brand-bg rounded-lg text-xs font-semibold focus:ring-2 focus:ring-brand-gold outline-none min-h-[44px]"
          aria-label="Search properties by keyword"
        />
      </div>
    </div>
  );
}

export default SearchBar;
