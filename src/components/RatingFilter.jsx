import React from 'react';
import { Star } from 'lucide-react';

/**
 * RatingFilter Component
 * Radio group filter allowing selection of specific star rating tiers (e.g. 3 Stars = 3.0 to 3.9).
 */
export default function RatingFilter({ minRating, onRatingChange, ratingCounts = {} }) {
  const ratingOptions = [
    { value: 0, label: 'All ratings', sublabel: '', stars: 0 },
    { value: 5, label: '5 Stars', sublabel: '5.0', stars: 5 },
    { value: 4, label: '4 Stars', sublabel: '4.0 - 4.9', stars: 4 },
    { value: 3, label: '3 Stars', sublabel: '3.0 - 3.9', stars: 3 },
    { value: 2, label: '2 Stars', sublabel: '2.0 - 2.9', stars: 2 },
    { value: 1, label: '1 Star', sublabel: '1.0 - 1.9', stars: 1 },
  ];

  return (
    <div className="space-y-2.5" role="radiogroup" aria-labelledby="rating-filter-heading">
      <div className="flex items-center justify-between">
        <h3 id="rating-filter-heading" className="text-xs font-bold text-slate-900 tracking-wider uppercase">
          Customer Rating
        </h3>
        {minRating > 0 && (
          <button
            type="button"
            onClick={() => onRatingChange(0)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-1">
        {ratingOptions.map((option) => {
          const isSelected = minRating === option.value;
          const inputId = `rating-${option.value}`;
          const count = ratingCounts[option.value] ?? null;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-xs sm:text-sm ${
                isSelected
                  ? 'bg-blue-50/80 text-blue-900 font-semibold'
                  : 'hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  id={inputId}
                  type="radio"
                  name="rating-filter"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onRatingChange(option.value)}
                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />

                <div className="flex items-center gap-1.5">
                  {option.stars > 0 ? (
                    <>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-3.5 h-3.5 ${
                              starIndex <= option.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({option.sublabel})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-slate-700">All ratings</span>
                  )}
                </div>
              </div>

              {count !== null && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                    isSelected ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
