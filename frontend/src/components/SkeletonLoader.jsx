import React from 'react';

export const PropertyCardSkeleton = () => (
  <div className="bg-white border border-brand-sandDark rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between animate-pulse">
    <div>
      {/* Aspect Ratio Header Visual */}
      <div className="w-full aspect-[4/3] bg-slate-200"></div>
      
      {/* Body details */}
      <div className="p-6 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
      </div>
    </div>

    {/* Footer CTA */}
    <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
    </div>
  </div>
);

export const PropertiesGridSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <PropertyCardSkeleton key={idx} />
    ))}
  </div>
);
