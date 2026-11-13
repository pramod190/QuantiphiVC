/**
 * Formats a numeric price into Indian Rupee (INR) currency representation.
 * Example: 2499 -> "₹2,499"
 *
 * @param {number} price - The numeric price value.
 * @returns {string} Formatted price string.
 */
export function formatPrice(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

