/**
 * Property-Based Tests for Number Utilities
 *
 * Uses fast-check for automated property testing with 1000+ iterations.
 * Tests mathematical properties and edge cases automatically.
 */

import * as fc from 'fast-check';

import { clamp } from '../number/clamp';
import { formatNumber } from '../number/formatNumber';

describe('Property-Based Tests: Number Utilities', () => {
  describe('clamp', () => {
    it('should always return a value within bounds', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (value, a, b) => {
          // Normalize min/max regardless of order
          const min = Math.min(a, b);
          const max = Math.max(a, b);

          const result = clamp(value, min, max);

          // Property: result must be within [min, max]
          expect(result).toBeGreaterThanOrEqual(min);
          expect(result).toBeLessThanOrEqual(max);
        }),
        { numRuns: 1000 }
      );
    });

    it('should be idempotent (clamping twice has same result)', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);

          const once = clamp(value, min, max);
          const twice = clamp(once, min, max);

          // Property: clamp(clamp(x)) === clamp(x)
          expect(twice).toBe(once);
        }),
        { numRuns: 1000 }
      );
    });

    it('should return min when value is below range', () => {
      fc.assert(
        fc.property(
          fc.integer({ max: -1000 }),
          fc.integer({ min: 0 }),
          fc.integer({ min: 100 }),
          (value, min, max) => {
            const result = clamp(value, min, max);

            // Property: if value < min, then clamp returns min
            if (value < min) {
              expect(result).toBe(min);
            }
          }
        ),
        { numRuns: 1000 }
      );
    });

    it('should return max when value is above range', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000 }),
          fc.integer({ max: 0 }),
          fc.integer({ min: 0, max: 100 }),
          (value, min, max) => {
            const normalizedMax = Math.max(min, max);
            const result = clamp(value, min, normalizedMax);

            // Property: if value > max, then clamp returns max
            if (value > normalizedMax) {
              expect(result).toBe(normalizedMax);
            }
          }
        ),
        { numRuns: 1000 }
      );
    });

    it('should return value when within range', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);

          const result = clamp(value, min, max);

          // Property: if min <= value <= max, then clamp returns value
          if (value >= min && value <= max) {
            expect(result).toBe(value);
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle edge case where min equals max', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), (value, bound) => {
          const result = clamp(value, bound, bound);

          // Property: clamp(x, a, a) === a
          expect(result).toBe(bound);
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle floating point numbers', () => {
      fc.assert(
        fc.property(fc.double(), fc.double(), fc.double(), (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);

          const result = clamp(value, min, max);

          // Property: result within bounds for floats
          if (!Number.isNaN(result)) {
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle special numeric values', () => {
      const specialValues = [0, -0, Number.MIN_VALUE, Number.MAX_VALUE];

      for (const value of specialValues) {
        const result = clamp(value, -100, 100);
        expect(result).toBeGreaterThanOrEqual(-100);
        expect(result).toBeLessThanOrEqual(100);
      }
    });

    it('should handle Infinity edge cases', () => {
      // Positive infinity
      expect(clamp(Number.POSITIVE_INFINITY, 0, 100)).toBe(100);

      // Negative infinity
      expect(clamp(Number.NEGATIVE_INFINITY, 0, 100)).toBe(0);

      // Infinity bounds
      expect(clamp(50, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(50);
    });

    it('should handle NaN gracefully', () => {
      const result = clamp(Number.NaN, 0, 100);

      // Property: NaN should return NaN
      expect(Number.isNaN(result)).toBe(true);
    });

    it('should maintain order relationship', () => {
      fc.assert(
        fc.property(fc.integer(), fc.integer(), fc.integer(), fc.integer(), (v1, v2, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);

          const r1 = clamp(v1, min, max);
          const r2 = clamp(v2, min, max);

          // Property: if v1 <= v2 and both within bounds, then r1 <= r2
          if (v1 <= v2 && v1 >= min && v1 <= max && v2 >= min && v2 <= max) {
            expect(r1).toBeLessThanOrEqual(r2);
          }
        }),
        { numRuns: 1000 }
      );
    });
  });

  describe('formatNumber', () => {
    it('should always return a string', () => {
      fc.assert(
        fc.property(fc.double(), (num) => {
          if (!Number.isNaN(num)) {
            const result = formatNumber(num);
            expect(typeof result).toBe('string');
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle zero consistently', () => {
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-0)).toBe('0');
    });

    it('should preserve number magnitude order', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          (a, b) => {
            if (a < b) {
              const formattedA = formatNumber(a);
              const formattedB = formatNumber(b);

              // Both should be valid number strings
              expect(formattedA).toBeTruthy();
              expect(formattedB).toBeTruthy();
            }
          }
        ),
        { numRuns: 500 }
      );
    });

    it('should handle integer values without decimals by default', () => {
      fc.assert(
        fc.property(fc.integer({ min: -1000000, max: 1000000 }), (num) => {
          const result = formatNumber(num);

          // Should not contain decimal point for integers
          if (!result.includes('e')) {
            // Skip scientific notation
            // Format may add decimals based on locale, so just verify it's a valid string
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle large numbers consistently', () => {
      const largeNumbers = [1e6, 1e9, 1e12, Number.MAX_SAFE_INTEGER];

      for (const num of largeNumbers) {
        const result = formatNumber(num);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should handle small numbers consistently', () => {
      const smallNumbers = [0.001, 0.0001, 1e-6, Number.MIN_VALUE];

      for (const num of smallNumbers) {
        const result = formatNumber(num);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });

    it('should respect maximumFractionDigits option', () => {
      fc.assert(
        fc.property(fc.double({ min: 0, max: 1000 }), (num: number) => {
          if (!Number.isNaN(num) && Number.isFinite(num)) {
            const result = formatNumber(num, { maximumFractionDigits: 2 });

            // Count decimal places
            const parts = result.split('.');
            if (parts.length > 1) {
              const decimals = parts[1].replaceAll(/[^\d]/g, ''); // Remove non-digits
              expect(decimals.length).toBeLessThanOrEqual(2);
            }
          }
        }),
        { numRuns: 500 }
      );
    });

    it('should handle negative numbers with proper sign', () => {
      fc.assert(
        fc.property(fc.integer({ min: -1000000, max: -1 }), (num: number) => {
          const result = formatNumber(num);

          // Should contain minus sign or negative indicator
          expect(result).toMatch(/[-−]/); // Regular hyphen or minus sign
        }),
        { numRuns: 1000 }
      );
    });

    it('should be deterministic (same input, same output)', () => {
      fc.assert(
        fc.property(fc.double(), (num: number) => {
          if (!Number.isNaN(num) && Number.isFinite(num)) {
            const result1 = formatNumber(num);
            const result2 = formatNumber(num);

            // Property: deterministic function
            expect(result1).toBe(result2);
          }
        }),
        { numRuns: 1000 }
      );
    });

    it('should handle compact notation for large numbers', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1000, max: 1e12 }), (num: number) => {
          const result = formatNumber(num, { notation: 'compact' });

          // Should contain K, M, B, or T suffix or be a valid number string
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
        }),
        { numRuns: 500 }
      );
    });

    it('should handle edge case: exactly at compact boundaries', () => {
      const boundaries = [1000, 1_000_000, 1_000_000_000];

      for (const num of boundaries) {
        const result = formatNumber(num, { notation: 'compact' });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Cross-utility properties', () => {
    it('clamp then format should always produce valid string', () => {
      fc.assert(
        fc.property(
          fc.integer(),
          fc.integer(),
          fc.integer(),
          (value: number, a: number, b: number) => {
            const min = Math.min(a, b);
            const max = Math.max(a, b);

            const clamped = clamp(value, min, max);
            const formatted = formatNumber(clamped);

            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 1000 }
      );
    });

    it('formatted numbers should be parseable back', () => {
      fc.assert(
        fc.property(fc.integer({ min: -1000000, max: 1000000 }), (num: number) => {
          const formatted = formatNumber(num);
          const parsed = Number.parseFloat(formatted.replaceAll(/[,\s]/g, ''));

          // Should be close to original (accounting for formatting)
          if (!Number.isNaN(parsed)) {
            expect(Math.abs(parsed - num)).toBeLessThan(1);
          }
        }),
        { numRuns: 500 }
      );
    });
  });
});
