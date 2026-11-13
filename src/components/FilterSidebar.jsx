import React from 'react';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import RatingFilter from './RatingFilter';
import { RotateCcw, X, SlidersHorizontal } from 'lucide-react';

/**
 * FilterSidebar Component
 * Provides a sticky sidebar on desktop and a slide-over modal drawer on mobile devices.
 */
export default function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  categoryCounts,
  minBoundary,
  maxBoundary,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  ratingCounts,
  onResetFilters,
  activeFilterCount,
  isMobileOpen,
  onCloseMobile,
}) {
  const filterContent = (
    <div className="space-y-5">
      {/* Category Section */}
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={onCategoryChange}
        categoryCounts={categoryCounts}
      />

      <div className="border-t border-slate-200/80" />

      {/* Price Range Section (Dual-Thumb Slider) */}
      <PriceRangeFilter
        minBoundary={minBoundary}
        maxBoundary={maxBoundary}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onChange={onPriceChange}
      />

      <div className="border-t border-slate-200/80" />

      {/* Minimum Star Rating Section */}
      <RatingFilter
        minRating={minRating}
        onRatingChange={onRatingChange}
        ratingCounts={ratingCounts}
      />
    </div>
  );

  return (
    <>
      {/* ================= DESKTOP STICKY SIDEBAR ================= */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl border border-slate-200/90 p-4 xl:p-5 shadow-xs transition-all">
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-600 transition-colors focus:outline-none"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filter Groups */}
          {filterContent}

        </div>
      </aside>

      {/* ================= MOBILE COLLAPSIBLE DRAWER ================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 focus:outline-none"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    aria-label="Close filters"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {filterContent}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-colors"
                >
                  View Results
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
