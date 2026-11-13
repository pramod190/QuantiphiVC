import React from 'react';
import ProductCard from './ProductCard';
import SortDropdown from './SortDropdown';
import EmptyState from './EmptyState';
import { X, SlidersHorizontal, Star } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

/**
 * ProductGrid Component
 * Displays toolbar, quick filter pills, active chips, and a uniform fixed-ratio product grid.
 */
export default function ProductGrid({
  products = [],
  totalInventoryCount = 0,
  sortBy,
  onSortChange,
  cartItemIds = new Set(),
  onAddToCart,
  onResetFilters,
  categories = [],
  selectedCategories = [],
  onCategorySelect,
  minPrice,
  maxPrice,
  minBoundary,
  maxBoundary,
  minRating,
  searchQuery,
  onRemoveCategory,
  onResetPrice,
  onResetRating,
  onClearSearch,
  onOpenMobileFilters,
  activeFilterCount,
}) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    minPrice > minBoundary ||
    maxPrice < maxBoundary ||
    minRating > 0 ||
    searchQuery.trim().length > 0;

  return (
    <section className="flex-1 flex flex-col min-w-0" aria-label="Product Catalog">
      
      {/* 1. Quick Category Pills Bar for instant friendly browsing */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-0.5 no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => onCategorySelect([])}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCategories.length === 0
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          All Items ({totalInventoryCount})
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onRemoveCategory(cat);
                } else {
                  onCategorySelect([...selectedCategories, cat]);
                }
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2. Top Catalog Toolbar: Result Counter, Mobile Filters & Sort Dropdown */}
      <div className="flex items-center justify-between py-3 border-y border-slate-200/90 gap-3 bg-white/60 rounded-xl px-3 sm:px-4 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            aria-label="Open filter sidebar"
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-slate-900">
              Showing {products.length}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              of {totalInventoryCount} products
            </span>
          </div>
        </div>

        {/* Sort Dropdown */}
        <SortDropdown sortBy={sortBy} onSortChange={onSortChange} />
      </div>

      {/* 3. Active Filter Chips / Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3">
          <span className="text-xs font-medium text-slate-400">
            Active:
          </span>

          {/* Search Query Chip */}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              <span>&ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={onClearSearch}
                className="hover:text-blue-900 focus:outline-none"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Category Chips */}
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"
            >
              <span>{cat}</span>
              <button
                type="button"
                onClick={() => onRemoveCategory(cat)}
                className="hover:text-blue-900 focus:outline-none"
                aria-label={`Remove category filter: ${cat}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Price Range Chip */}
          {(minPrice > minBoundary || maxPrice < maxBoundary) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              <span>{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
              <button
                type="button"
                onClick={onResetPrice}
                className="hover:text-blue-900 focus:outline-none"
                aria-label="Reset price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Rating Chip */}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>
                {minRating === 5 ? '5 Stars (5.0)' : `${minRating} Stars (${minRating}.0 - ${minRating}.9)`}
              </span>
              <button
                type="button"
                onClick={onResetRating}
                className="hover:text-amber-950 focus:outline-none ml-0.5"
                aria-label="Reset rating filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Reset All Button */}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 ml-1 hover:underline focus:outline-none cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 4. Fixed-Ratio Responsive Product Grid */}
      {products.length === 0 ? (
        <EmptyState onResetFilters={onResetFilters} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-fr">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInCart={cartItemIds.has(product.id)}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

    </section>
  );
}
