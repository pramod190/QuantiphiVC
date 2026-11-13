/**
 * Sorting pipeline utility
 * Sorts an array of products based on the selected criteria without mutating the original array.
 *
 * @param {Array<Object>} products - Filtered products array.
 * @param {string} sortBy - Sort key identifier ('featured', 'price-asc', 'price-desc', 'rating-desc', 'name-asc').
 * @returns {Array<Object>} A new sorted array of products.
 */
export function sortProducts(products = [], sortBy = 'featured') {
  if (!Array.isArray(products)) {
    return [];
  }

  // Create a shallow copy to prevent in-place mutation of the input array
  const list = [...products];

  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));

    case 'price-desc':
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));

    case 'rating-desc':
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    case 'name-asc':
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    case 'featured':
    default:
      // Preserves the filtered order derived from the original inventory
      return list;
  }
}

