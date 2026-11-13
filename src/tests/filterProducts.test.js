import { describe, it, expect } from 'vitest';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';
import { products } from '../data/products';

const mockProducts = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 2499, rating: 4.5 },
  { id: 2, name: 'Cotton T-Shirt', category: 'Apparel', price: 799, rating: 4.2 },
  { id: 3, name: 'Running Shoes', category: 'Footwear', price: 4299, rating: 4.7 },
  { id: 4, name: 'Espresso Maker', category: 'Home & Kitchen', price: 2899, rating: 3.8 },
  { id: 5, name: 'Leather Wallet', category: 'Accessories', price: 1199, rating: 4.0 },
  { id: 6, name: 'Budget Earbuds', category: 'Electronics', price: 699, rating: 3.2 },
];

describe('filterProducts core logic', () => {
  it('Scenario 1: On initial load, all products appear', () => {
    const result = filterProducts(mockProducts);
    expect(result).toHaveLength(mockProducts.length);
    expect(result.map(p => p.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('Scenario 2: Selecting Electronics shows only electronics products', () => {
    const result = filterProducts(mockProducts, { selectedCategories: ['Electronics'] });
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'Electronics')).toBe(true);
  });

  it('Scenario 3: Selecting Electronics and Apparel shows products from either selected category', () => {
    const result = filterProducts(mockProducts, { selectedCategories: ['Electronics', 'Apparel'] });
    expect(result).toHaveLength(3);
    expect(result.every(p => p.category === 'Electronics' || p.category === 'Apparel')).toBe(true);
  });

  it('Scenario 4 & 5: Changing minimum or maximum price updates the grid', () => {
    const result = filterProducts(mockProducts, { minPrice: 1000, maxPrice: 3000 });
    expect(result.map(p => p.id)).toEqual([1, 4, 5]);
    expect(result.every(p => p.price >= 1000 && p.price <= 3000)).toBe(true);
  });

  it('Scenario 6: Selecting a 4-star minimum excludes products below 4 stars', () => {
    const result = filterProducts(mockProducts, { minRating: 4.0 });
    expect(result.map(p => p.id)).toEqual([1, 2, 3, 5]);
    expect(result.every(p => p.rating >= 4.0)).toBe(true);
  });

  it('Scenario 7: Combining category, price, and rating applies all conditions together (AND logic)', () => {
    const result = filterProducts(mockProducts, {
      selectedCategories: ['Electronics'],
      minPrice: 1000,
      maxPrice: 3000,
      minRating: 4.0,
      searchQuery: 'wireless'
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('Wireless Headphones');
  });

  it('Scenario 8: Clearing category selection restores all categories while preserving other active filters', () => {
    // Initial state with Category = Electronics, minPrice = 1000, minRating = 4.0
    const filteredWithCategory = filterProducts(mockProducts, {
      selectedCategories: ['Electronics'],
      minPrice: 1000,
      minRating: 4.0,
    });
    expect(filteredWithCategory.map(p => p.id)).toEqual([1]);

    // Clearing category selection: selectedCategories: []
    const restoredCategory = filterProducts(mockProducts, {
      selectedCategories: [],
      minPrice: 1000,
      minRating: 4.0,
    });
    // Should now include items from other categories matching price >= 1000 & rating >= 4.0
    expect(restoredCategory.map(p => p.id)).toEqual([1, 3, 5]);
  });

  it('Scenario 11: Changing sorting does not change which products satisfy the filters', () => {
    const filtered = filterProducts(mockProducts, { minPrice: 1000 });
    const sortedAsc = sortProducts(filtered, 'price-asc');
    const sortedDesc = sortProducts(filtered, 'price-desc');
    const sortedRating = sortProducts(filtered, 'rating-desc');

    const getSortedIds = (arr) => [...arr.map(p => p.id)].sort((a, b) => a - b);
    expect(getSortedIds(sortedAsc)).toEqual(getSortedIds(filtered));
    expect(getSortedIds(sortedDesc)).toEqual(getSortedIds(filtered));
    expect(getSortedIds(sortedRating)).toEqual(getSortedIds(filtered));
  });

  it('Scenario 12: Search works together with category, price, and rating filters', () => {
    const result = filterProducts(mockProducts, {
      selectedCategories: ['Electronics', 'Accessories'],
      minPrice: 500,
      maxPrice: 2000,
      minRating: 4,
      searchQuery: 'wallet'
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leather Wallet');
  });

  it('Scenario 13: No matching products returns empty array', () => {
    const result = filterProducts(mockProducts, {
      selectedCategories: ['Electronics'],
      minPrice: 99999,
    });
    expect(result).toHaveLength(0);
  });

  it('Scenario 15: The original inventory remains completely unchanged after filtering and sorting', () => {
    const deepClone = JSON.parse(JSON.stringify(mockProducts));
    const filtered = filterProducts(mockProducts, { selectedCategories: ['Electronics'], minRating: 4.0 });
    sortProducts(filtered, 'price-asc');
    expect(mockProducts).toEqual(deepClone);
  });

  it('Scenario 17: User selects 4-star rating with a given price range, only matching products are displayed', () => {
    const minPrice = 1500;
    const maxPrice = 3000;
    const minRating = 4;

    const results = filterProducts(products, { minPrice, maxPrice, minRating });

    // 1. Every returned item strictly satisfies BOTH rating in [4.0, 4.9] AND minPrice <= price <= maxPrice
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(p => p.rating >= 4.0 && p.rating < 5.0 && p.price >= minPrice && p.price <= maxPrice)).toBe(true);

    // 2. Strict completeness: exactly the items matching both conditions are returned, nothing else
    const expected = products.filter(p => p.rating >= 4.0 && p.rating < 5.0 && p.price >= minPrice && p.price <= maxPrice);
    expect(results.map(p => p.id)).toEqual(expected.map(p => p.id));
  });

  it('Scenario 18: Selecting 3-star rating displays products specifically with ratings from 3.0 to 3.9', () => {
    const results = filterProducts(products, { minRating: 3 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(p => p.rating >= 3.0 && p.rating < 4.0)).toBe(true);

    const expected = products.filter(p => p.rating >= 3.0 && p.rating < 4.0);
    expect(results.map(p => p.id)).toEqual(expected.map(p => p.id));
  });

  it('Verifies real dataset meets prompt requirements (>= 20 items, valid prices & ratings)', () => {
    expect(products.length).toBeGreaterThanOrEqual(20);
    expect(products.every(p => typeof p.id === 'number')).toBe(true);
    expect(products.every(p => typeof p.name === 'string' && p.name.length > 0)).toBe(true);
    expect(products.every(p => typeof p.price === 'number' && p.price >= 0)).toBe(true);
    expect(products.every(p => typeof p.rating === 'number' && p.rating >= 1 && p.rating <= 5)).toBe(true);
    expect(products.every(p => typeof p.image === 'string' && p.image.length > 0)).toBe(true);
  });
});
