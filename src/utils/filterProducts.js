/**
 * Core Combinatorial Filtering Algorithm
 * Filters a product dataset based on category, price range, minimum rating, and search query.
 *
 * @param {Array<Object>} products - The original inventory array (never mutated).
 * @param {Object} filterOptions - Filtering criteria.
 * @param {Array<string>} [filterOptions.selectedCategories=[]] - Selected category names.
 * @param {number|null|undefined} [filterOptions.minPrice] - Minimum allowable price.
 * @param {number|null|undefined} [filterOptions.maxPrice] - Maximum allowable price.
 * @param {number|null|undefined} [filterOptions.minRating=0] - Minimum allowable star rating.
 * @param {string} [filterOptions.searchQuery=''] - Optional search query to match product name.
 * @returns {Array<Object>} A new filtered array of matching products.
 */
export function filterProducts(
  products = [],
  {
    selectedCategories = [],
    minPrice = null,
    maxPrice = null,
    minRating = 0,
    searchQuery = ''
  } = {}
) {
  if (!Array.isArray(products)) {
    return [];
  }

  const normalizedQuery = typeof searchQuery === 'string' ? searchQuery.trim().toLowerCase() : '';
  const parsedMinRating = typeof minRating === 'number' && !isNaN(minRating) ? minRating : 0;
  const hasCategories = Array.isArray(selectedCategories) && selectedCategories.length > 0;
  const hasMinPrice = typeof minPrice === 'number' && !isNaN(minPrice);
  const hasMaxPrice = typeof maxPrice === 'number' && !isNaN(maxPrice);

  return products.filter((product) => {
    if (
      !product ||
      typeof product !== 'object' ||
      product.id == null ||
      typeof product.category !== 'string' ||
      typeof product.name !== 'string'
    ) {
      return false;
    }

    // 1. Category Condition
    // If no category is selected, allow every category; otherwise, product category must be in selected list.
    const categoryMatch = !hasCategories || selectedCategories.includes(product.category);

    // 2. Price Condition
    // Product price must fall within [minPrice, maxPrice] boundaries when provided.
    const productPrice = typeof product.price === 'number' ? product.price : 0;
    const minPriceMatch = !hasMinPrice || productPrice >= minPrice;
    const maxPriceMatch = !hasMaxPrice || productPrice <= maxPrice;
    const priceMatch = minPriceMatch && maxPriceMatch;

    // 3. Rating Condition
    // If rating filter is 0 or disabled, allow all ratings.
    // Otherwise, match the selected star bracket (e.g. 3 stars -> 3.0 to 3.9, 4 stars -> 4.0 to 4.9, 5 stars -> 5.0).
    const productRating = typeof product.rating === 'number' ? product.rating : 0;
    let ratingMatch = true;
    if (parsedMinRating > 0) {
      if (parsedMinRating >= 5) {
        ratingMatch = productRating >= 5.0;
      } else {
        ratingMatch = productRating >= parsedMinRating && productRating < parsedMinRating + 1;
      }
    }

    // 4. Search Condition
    // If search query is empty, allow every product; otherwise, case-insensitive match against name.
    const productName = typeof product.name === 'string' ? product.name.toLowerCase() : '';
    const searchMatch = normalizedQuery === '' || productName.includes(normalizedQuery);

    // All active criteria must be simultaneously satisfied (AND operation)
    return categoryMatch && priceMatch && ratingMatch && searchMatch;
  });
}
