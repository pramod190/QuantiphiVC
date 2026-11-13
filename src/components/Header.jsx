import React from 'react';
import { ShoppingBag, Search, X, SlidersHorizontal, ShoppingCart, Zap, ShieldCheck } from 'lucide-react';

/**
 * Header Component
 * Contains top announcement bar, store branding, live search bar, and cart trigger with badges.
 */
export default function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenMobileFilters,
  activeFilterCount,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all">
      {/* Top Value Banner */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 font-medium hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3 h-3 fill-current" /> Express 24h Dispatch
            </span>
            <span className="text-slate-600">•</span>
            <span>Free Shipping on orders above ₹999</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Genuine Guaranteed</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5"
              aria-label="ShopSphere Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Shop<span className="text-blue-600">Sphere</span>
                </span>
                <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-400">
                  Store
                </span>
              </div>
            </a>
          </div>

          {/* Search Input Bar (Instant live filter) */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <label htmlFor="product-search" className="sr-only">
                Search products by name
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products, shoes, headphones..."
                className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: Mobile Filter Toggle & Shopping Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={onOpenMobileFilters}
              aria-label="Open filter sidebar"
              className="lg:hidden p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Shopping cart with ${cartCount} items`}
              className="relative p-2 sm:px-3 sm:py-2 text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-xl border border-transparent hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-bold bg-blue-600 text-white rounded-full min-w-[18px] text-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
