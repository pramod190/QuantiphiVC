import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Tag, Truck } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const FREE_SHIPPING_THRESHOLD = 999;

/**
 * CartDrawer Component
 * A functional sliding drawer showing added products, free shipping progress bar, promo code, quantity controls, subtotal, and checkout preview.
 */
export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const freeShippingMet = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SAVE10') {
      setAppliedDiscount(Math.round(subtotal * 0.1));
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try SAVE10');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {totalItemsCount}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-blue-50/70 border-b border-blue-100 px-5 py-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  {freeShippingMet ? (
                    <span className="text-emerald-700 font-bold">You qualify for FREE Express Delivery!</span>
                  ) : (
                    <span>Add {formatPrice(remainingForFreeShipping)} more for FREE Delivery</span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-blue-600">{shippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-slate-800 mb-1">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs mb-5">
                  Discover top tech, apparel, and lifestyle items to fill it up.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate mb-0.5">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-blue-600 mb-1.5">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 rounded-l text-slate-600 focus:outline-none"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 rounded-r text-slate-600 focus:outline-none"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-600 focus:outline-none ml-auto"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer / Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter coupon (e.g. SAVE10)"
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-600 font-medium">{promoError}</p>
              )}
              {appliedDiscount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                  <span>Coupon SAVE10 applied</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-semibold">
                    {freeShippingMet ? 'FREE' : formatPrice(99)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-extrabold text-blue-600 text-base">
                    {formatPrice(finalTotal + (freeShippingMet ? 0 : 99))}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Order simulated for ${formatPrice(finalTotal)}! Thank you for testing.`);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
