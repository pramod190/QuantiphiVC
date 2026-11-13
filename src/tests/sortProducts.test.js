import { describe, it, expect } from 'vitest';
import { sortProducts } from '../utils/sortProducts';

const sampleProducts = [
  { id: 1, name: 'B - Running Shoes', price: 4200, rating: 4.7 },
  { id: 2, name: 'A - Wireless Headphones', price: 2500, rating: 4.5 },
  { id: 3, name: 'C - Cotton Tee', price: 800, rating: 4.9 },
  { id: 4, name: 'D - Premium Watch', price: 6500, rating: 4.1 },
];

describe('sortProducts pipeline', () => {
  it('preserves featured / default order without reordering', () => {
    const sorted = sortProducts(sampleProducts, 'featured');
    expect(sorted.map(p => p.id)).toEqual([1, 2, 3, 4]);
  });

  it('sorts by price: Low to High', () => {
    const sorted = sortProducts(sampleProducts, 'price-asc');
    expect(sorted.map(p => p.id)).toEqual([3, 2, 1, 4]);
    expect(sorted.map(p => p.price)).toEqual([800, 2500, 4200, 6500]);
  });

  it('sorts by price: High to Low', () => {
    const sorted = sortProducts(sampleProducts, 'price-desc');
    expect(sorted.map(p => p.id)).toEqual([4, 1, 2, 3]);
    expect(sorted.map(p => p.price)).toEqual([6500, 4200, 2500, 800]);
  });

  it('sorts by top rated first (highest rating descending)', () => {
    const sorted = sortProducts(sampleProducts, 'rating-desc');
    expect(sorted.map(p => p.id)).toEqual([3, 1, 2, 4]);
    expect(sorted.map(p => p.rating)).toEqual([4.9, 4.7, 4.5, 4.1]);
  });

  it('sorts by name alphabetically: A to Z', () => {
    const sorted = sortProducts(sampleProducts, 'name-asc');
    expect(sorted.map(p => p.id)).toEqual([2, 1, 3, 4]);
  });

  it('does NOT mutate the input array', () => {
    const originalOrder = sampleProducts.map(p => p.id);
    sortProducts(sampleProducts, 'price-desc');
    expect(sampleProducts.map(p => p.id)).toEqual(originalOrder);
  });

  it('handles invalid or empty inputs gracefully', () => {
    expect(sortProducts(null)).toEqual([]);
    expect(sortProducts(undefined)).toEqual([]);
    expect(sortProducts([])).toEqual([]);
  });
});

