import React from 'react';
import { Check } from 'lucide-react';

/**
 * CategoryFilter Component
 * Renders checkboxes for each category with item counts and multi-select support.
 */
export default function CategoryFilter({
  categories = [],
  selectedCategories = [],
  onCategoryChange,
  categoryCounts = {},
}) {
  const handleToggle = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
          Category
        </h3>
        {selectedCategories.length > 0 && (
          <button
            type="button"
            onClick={() => onCategoryChange([])}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
          >
            Clear ({selectedCategories.length})
          </button>
        )}
      </div>

      <div className="space-y-1">
        {categories.map((category) => {
          const isChecked = selectedCategories.includes(category);
          const count = categoryCounts[category] || 0;
          const inputId = `category-${category.toLowerCase().replace(/\s+/g, '-')}`;

          return (
            <label
              key={category}
              htmlFor={inputId}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors select-none text-xs sm:text-sm ${
                isChecked
                  ? 'bg-blue-50/80 text-blue-900 font-semibold'
                  : 'hover:bg-slate-100/80 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(category)}
                    className="peer sr-only"
                  />
                  <div
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                        : 'border-slate-300 bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500'
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <span>{category}</span>
              </div>

              {/* Item count tag */}
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                  isChecked
                    ? 'bg-blue-100 text-blue-700 font-bold'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {count}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
