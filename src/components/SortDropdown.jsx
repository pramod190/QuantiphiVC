import React from 'react';
import { ArrowUpDown } from 'lucide-react';

/**
 * SortDropdown Component
 * Dropdown selector for instant catalog sorting.
 */
export default function SortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1 whitespace-nowrap">
        <ArrowUpDown className="w-3 h-3 text-slate-400" />
        <span className="hidden xs:inline sm:inline">Sort:</span>
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-2xs transition-colors"
        >
          <option value="featured">Featured (Default)</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated First</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
