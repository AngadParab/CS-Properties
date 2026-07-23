import React from 'react';
import { Search } from 'lucide-react';

function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white border border-brand-sandDark rounded-3xl text-center shadow-sm max-w-xl mx-auto space-y-5 animate-fadeIn">
      <div className="p-4 bg-brand-bg rounded-full text-brand-goldDark">
        <Search className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-brand-navy">
          No Matching Properties
        </h3>
        <p className="text-sm text-brand-text-muted max-w-sm mx-auto leading-relaxed">
          We couldn't find any listings matching your search filters. Try adjusting your location, budget, or property type, or reset all filters to browse the entire catalog.
        </p>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="bg-brand-navy text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-colors shadow-md outline-none focus-visible:ring-2 focus-visible:ring-brand-goldDark"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;
