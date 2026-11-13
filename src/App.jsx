import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import { products, CATEGORIES } from './data/products';
import { filterProducts } from './utils/filterProducts';
import { sortProducts } from './utils/sortProducts';

// Compute price bounds from initial product dataset
const MIN_BOUNDARY = Math.floor(Math.min(...products.map((p) => p.price)) / 100) * 100;
const MAX_BOUNDARY = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100;

export default function App() {
  // 1. Independent Filter & Sort States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([MIN_BOUNDARY, MAX_BOUNDARY]);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // UI state for Mobile Drawer & Shopping Cart
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [minPrice, maxPrice] = priceRange;

  // 2. Precalculated Counts for Filter Badges
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  const ratingCounts = useMemo(() => {
    return {
      0: products.length,
      5: products.filter((p) => p.rating >= 5.0).length,
      4: products.filter((p) => p.rating >= 4.0 && p.rating < 5.0).length,
      3: products.filter((p) => p.rating >= 3.0 && p.rating < 4.0).length,
      2: products.filter((p) => p.rating >= 2.0 && p.rating < 3.0).length,
      1: products.filter((p) => p.rating >= 1.0 && p.rating < 2.0).length,
    };
  }, []);

  // 3. Core Combinatorial Filtering Step
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      selectedCategories,
      minPrice,
      maxPrice,
      minRating,
      searchQuery,
    });
  }, [selectedCategories, minPrice, maxPrice, minRating, searchQuery]);

  // 4. Sorting Pipeline Step
  const displayedProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy);
  }, [filteredProducts, sortBy]);

  // Count active non-default filter rules
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (minPrice > MIN_BOUNDARY || maxPrice < MAX_BOUNDARY) count += 1;
    if (minRating > 0) count += 1;
    if (searchQuery.trim().length > 0) count += 1;
    return count;
  }, [selectedCategories, minPrice, maxPrice, minRating, searchQuery]);

  // 5. Reset All Filters
  const handleResetFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([MIN_BOUNDARY, MAX_BOUNDARY]);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('featured');
  }, []);

  // Individual filter reset handlers
  const handleRemoveCategory = useCallback((categoryToRemove) => {
    setSelectedCategories((prev) => prev.filter((cat) => cat !== categoryToRemove));
  }, []);

  const handleResetPrice = useCallback(() => {
    setPriceRange([MIN_BOUNDARY, MAX_BOUNDARY]);
  }, []);

  const handleResetRating = useCallback(() => {
    setMinRating(0);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // 6. Cart Management Actions
  const cartItemIds = useMemo(() => {
    return new Set(cartItems.map((item) => item.id));
  }, [cartItems]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    }
  }, []);

  const handleRemoveFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
          
          {/* Left Sticky Sidebar & Mobile Drawer */}
          <FilterSidebar
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            categoryCounts={categoryCounts}
            minBoundary={MIN_BOUNDARY}
            maxBoundary={MAX_BOUNDARY}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            ratingCounts={ratingCounts}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
            isMobileOpen={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Right Column: Catalog Grid & Sorting */}
          <ProductGrid
            products={displayedProducts}
            totalInventoryCount={products.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            cartItemIds={cartItemIds}
            onAddToCart={handleAddToCart}
            onResetFilters={handleResetFilters}
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            onCategorySelect={setSelectedCategories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minBoundary={MIN_BOUNDARY}
            maxBoundary={MAX_BOUNDARY}
            minRating={minRating}
            searchQuery={searchQuery}
            onRemoveCategory={handleRemoveCategory}
            onResetPrice={handleResetPrice}
            onResetRating={handleResetRating}
            onClearSearch={handleClearSearch}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
          />

        </div>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 sm:py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with React, Tailwind CSS, &amp; Vite
          </p>
        </div>
      </footer>

    </div>
  );
}
