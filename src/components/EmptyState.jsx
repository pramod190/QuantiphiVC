import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';

/**
 * EmptyState Component
 * Displayed when no catalog items match the active combination of filters.
 */
export default function EmptyState({ onResetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs my-6">
      <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5 shadow-xs animate-pulse">
        <PackageSearch className="w-10 h-10 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        No items match your criteria.
      </h3>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
        We couldn’t find any products matching your current combination of categories, price boundaries, rating, or search keywords.
      </p>

      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}

