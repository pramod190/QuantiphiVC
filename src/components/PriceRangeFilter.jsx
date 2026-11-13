import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatPrice';

/**
 * PriceRangeFilter Component
 * A genuine dual-thumb slider with direct numeric input boxes and quick presets.
 * Guarantees that any given price range is strictly and accurately applied.
 */
export default function PriceRangeFilter({
  minBoundary,
  maxBoundary,
  minPrice,
  maxPrice,
  onChange,
  step = 100,
  minGap = 100,
}) {
  const range = maxBoundary - minBoundary;

  // Local state for direct text inputs so user can type freely
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  // Calculate percentage positions for active highlighted bar
  const minPercent = useMemo(() => {
    return Math.max(0, Math.min(100, Math.round(((minPrice - minBoundary) / range) * 100)));
  }, [minPrice, minBoundary, range]);

  const maxPercent = useMemo(() => {
    return Math.max(0, Math.min(100, Math.round(((maxPrice - minBoundary) / range) * 100)));
  }, [maxPrice, minBoundary, range]);

  // Handle minimum thumb slider movement
  const handleMinSliderChange = useCallback(
    (e) => {
      const val = Number(e.target.value);
      const clamped = Math.min(val, maxPrice - minGap);
      onChange([clamped, maxPrice]);
    },
    [maxPrice, minGap, onChange]
  );

  // Handle maximum thumb slider movement
  const handleMaxSliderChange = useCallback(
    (e) => {
      const val = Number(e.target.value);
      const clamped = Math.max(val, minPrice + minGap);
      onChange([minPrice, clamped]);
    },
    [minPrice, minGap, onChange]
  );

  // Commit direct input on blur or Enter
  const handleMinInputCommit = () => {
    let num = Number(localMin);
    if (isNaN(num)) num = minBoundary;
    num = Math.max(minBoundary, Math.min(num, maxPrice - minGap));
    setLocalMin(num);
    onChange([num, maxPrice]);
  };

  const handleMaxInputCommit = () => {
    let num = Number(localMax);
    if (isNaN(num)) num = maxBoundary;
    num = Math.min(maxBoundary, Math.max(num, minPrice + minGap));
    setLocalMax(num);
    onChange([minPrice, num]);
  };

  const handleKeyDown = (e, commitFn) => {
    if (e.key === 'Enter') {
      commitFn();
      e.target.blur();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
          Price Range (₹)
        </h3>
        {(minPrice > minBoundary || maxPrice < maxBoundary) && (
          <button
            type="button"
            onClick={() => onChange([minBoundary, maxBoundary])}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
          >
            Reset
          </button>
        )}
      </div>

      {/* Dual thumb track container */}
      <div className="relative pt-2 pb-1 px-1">
        {/* Base Background Track */}
        <div className="relative h-2 w-full rounded-full bg-slate-200">
          {/* Active Highlight Bar */}
          <div
            className="absolute top-0 bottom-0 rounded-full bg-blue-600 transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        {/* Min Thumb Input */}
        <input
          type="range"
          min={minBoundary}
          max={maxBoundary}
          step={step}
          value={minPrice}
          onChange={handleMinSliderChange}
          aria-label="Minimum price filter"
          className="range-slider-thumb pointer-events-none absolute inset-x-0 -top-1 w-full appearance-none bg-transparent focus:outline-none z-10"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={minBoundary}
          max={maxBoundary}
          step={step}
          value={maxPrice}
          onChange={handleMaxSliderChange}
          aria-label="Maximum price filter"
          className="range-slider-thumb pointer-events-none absolute inset-x-0 -top-1 w-full appearance-none bg-transparent focus:outline-none z-20"
        />
      </div>

      {/* Editable Min and Max Price Inputs (Allows typing exact price range) */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <label htmlFor="min-price-input" className="block text-[10px] text-slate-400 font-semibold mb-0.5">
            Min Price
          </label>
          <div className="flex items-center text-slate-800 font-bold">
            <span className="text-slate-400 text-xs mr-0.5">₹</span>
            <input
              id="min-price-input"
              type="number"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              onBlur={handleMinInputCommit}
              onKeyDown={(e) => handleKeyDown(e, handleMinInputCommit)}
              min={minBoundary}
              max={maxPrice - minGap}
              step={step}
              className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <span className="text-slate-400 font-bold text-xs">-</span>

        <div className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <label htmlFor="max-price-input" className="block text-[10px] text-slate-400 font-semibold mb-0.5">
            Max Price
          </label>
          <div className="flex items-center text-slate-800 font-bold">
            <span className="text-slate-400 text-xs mr-0.5">₹</span>
            <input
              id="max-price-input"
              type="number"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              onBlur={handleMaxInputCommit}
              onKeyDown={(e) => handleKeyDown(e, handleMaxInputCommit)}
              min={minPrice + minGap}
              max={maxBoundary}
              step={step}
              className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Quick Price Range Presets */}
      <div className="grid grid-cols-3 gap-1 pt-0.5">
        <button
          type="button"
          onClick={() => onChange([minBoundary, 1500])}
          className={`py-1 text-[10px] font-semibold rounded-md transition-colors ${
            minPrice === minBoundary && maxPrice === 1500
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
          }`}
        >
          Under ₹1.5k
        </button>
        <button
          type="button"
          onClick={() => onChange([1500, 3500])}
          className={`py-1 text-[10px] font-semibold rounded-md transition-colors ${
            minPrice === 1500 && maxPrice === 3500
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
          }`}
        >
          ₹1.5k - 3.5k
        </button>
        <button
          type="button"
          onClick={() => onChange([3500, maxBoundary])}
          className={`py-1 text-[10px] font-semibold rounded-md transition-colors ${
            minPrice === 3500 && maxPrice === maxBoundary
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
          }`}
        >
          Above ₹3.5k
        </button>
      </div>
    </div>
  );
}
