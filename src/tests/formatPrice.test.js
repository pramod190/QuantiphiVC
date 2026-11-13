import { describe, it, expect } from 'vitest';
import { formatPrice } from '../utils/formatPrice';

describe('formatPrice utility', () => {
  it('formats positive integers as Indian Rupees with commas', () => {
    // en-IN currency formats 2499 as ₹2,499 (or containing ₹ and 2,499)
    const formatted = formatPrice(2499);
    expect(formatted).toMatch(/₹\s?2,499/);
  });

  it('formats zero correctly', () => {
    const formatted = formatPrice(0);
    expect(formatted).toMatch(/₹\s?0/);
  });

  it('handles invalid inputs gracefully by returning ₹0', () => {
    expect(formatPrice(null)).toBe('₹0');
    expect(formatPrice(undefined)).toBe('₹0');
    expect(formatPrice('invalid')).toBe('₹0');
    expect(formatPrice(NaN)).toBe('₹0');
  });

  it('formats large numbers correctly (e.g. 100000 -> ₹1,00,000)', () => {
    const formatted = formatPrice(100000);
    expect(formatted).toMatch(/₹\s?1,00,000/);
  });
});

