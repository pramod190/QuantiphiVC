import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Check, Heart, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

// Reliable SVG placeholder fallback in case network image fails
const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f8fafc"><rect width="400" height="400" fill="%23f8fafc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2394a3b8">Product Image</text></svg>';

/**
 * ProductCard Component
 * Displays fixed-ratio image (1:1 square), promotional badges, category, title, 5 visual stars, price with discount, and functional Add to Cart button.
 */
export default function ProductCard({ product, onAddToCart, isInCart = false }) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setImgSrc(product.image);
  }, [product.image]);

  // Derived promotional details for richer, realistic e-commerce presentation
  const originalPrice = Math.round(product.price * 1.35);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const reviewsCount = Math.floor((product.id * 43) % 280) + 35;

  const isBestSeller = product.rating >= 4.7;
  const isTopRated = product.rating >= 4.5 && !isBestSeller;

  const handleImageError = () => {
    setImgSrc(FALLBACK_IMAGE);
  };

  return (
    <article className="group h-full flex flex-col bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* 1. Strict Fixed-Ratio Image Container (1:1 Square) */}
      <div className="relative aspect-square w-full bg-slate-100/70 overflow-hidden flex items-center justify-center">
        <img
          src={imgSrc}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 fill-current" /> Best Seller
            </span>
          )}
          {isTopRated && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-xs uppercase tracking-wider">
              Top Rated
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-rose-500 hover:bg-white shadow-xs transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* 2. Product Details Section (Consistent height & flex layout) */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        
        {/* Category & Title */}
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              ({reviewsCount} reviews)
            </span>
          </div>

          <h3
            className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 h-8 sm:h-10 leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Full 5 Visual Star Rating with Numeric Value */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rating: ${product.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const fillAmount = Math.max(0, Math.min(1, product.rating - starIndex + 1));
                return (
                  <div key={starIndex} className="relative">
                    <Star className="w-3.5 h-3.5 text-slate-200 fill-slate-200" />
                    {fillAmount > 0 && (
                      <div
                        className="absolute inset-0 overflow-hidden text-amber-400 fill-amber-400"
                        style={{ width: `${fillAmount * 100}%` }}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Prices */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">
                Save {formatPrice(originalPrice - product.price)}
              </span>
            </div>
          </div>

          {/* Add To Cart Button */}
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            aria-label={isInCart ? `Item ${product.name} in cart` : `Add ${product.name} to cart`}
            className={`shrink-0 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isInCart
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-500'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-xs hover:shadow-md hover:shadow-blue-500/20 focus:ring-blue-500'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden xs:inline sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>
    </article>
  );
}
