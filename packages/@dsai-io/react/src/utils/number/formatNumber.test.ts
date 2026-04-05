/**
 * @file formatNumber and formatCurrency tests
 * @module @dsai-io/react/utils/number
 */

import { formatCurrency } from './formatCurrency';
import { formatNumber } from './formatNumber';

// ── Test constants (S109) ──
const TEST_NUMBER = 1234.56;
const TEST_INTEGER = 1234;
const TEST_NUMBER_3_DECIMALS = 1234.567;
const TEST_NUMBER_HALF = 1234.5;
const TEST_NUMBER_NO_GROUP = 1234567;
const TEST_COMPACT_THOUSAND = 1500;
const TEST_COMPACT_MILLION = 2500000;
const TEST_COMPACT_BILLION = 3000000000;
const TEST_CACHED_NUMBER = 9999.99;
const TEST_NEGATIVE_NUMBER = -1234.56;
const TEST_VERY_SMALL = 0.000001;
const TEST_VERY_LARGE = 999999999999.99;
const TEST_PERCENT = 0.1234;
const TEST_UNIT_VALUE = 100;
const TEST_CURRENCY_4_DECIMALS = 1234.5678;
const TEST_CURRENCY_NO_GROUP = 1234567.89;

describe('formatNumber', () => {
  // Clear cache before each test for isolation
  beforeEach(() => {
    formatNumber.clearCache();
  });

  describe('Basic functionality', () => {
    it('should format basic numbers with default locale', () => {
      const result = formatNumber(TEST_NUMBER);
      expect(result).toMatch(/1[,\s]234\.56/);
    });

    it('should format integers without decimals', () => {
      const result = formatNumber(TEST_INTEGER);
      expect(result).toMatch(/1[,\s]234/);
    });

    it('should format with maximum fraction digits', () => {
      const result = formatNumber(TEST_NUMBER_3_DECIMALS, {
        maximumFractionDigits: 2,
      });
      expect(result).toMatch(/1[,\s]234\.57/);
    });

    it('should format with minimum fraction digits', () => {
      const result = formatNumber(TEST_NUMBER_HALF, {
        minimumFractionDigits: 2,
      });
      expect(result).toMatch(/1[,\s]234\.50/);
    });

    it('should format without grouping', () => {
      const result = formatNumber(TEST_NUMBER_NO_GROUP, {
        useGrouping: false,
      });
      expect(result).toBe('1234567');
    });
  });

  describe('Compact notation', () => {
    it('should format thousands with compact notation', () => {
      const result = formatNumber(TEST_COMPACT_THOUSAND, {
        notation: 'compact',
      });
      // Can be "1.5K" or "1500" depending on locale implementation
      expect(result).toMatch(/1[.,]5\s*K|1[,\s]?500/);
    });

    it('should format millions with compact notation', () => {
      const result = formatNumber(TEST_COMPACT_MILLION, {
        notation: 'compact',
      });
      expect(result).toMatch(/2[.,]5\s*M/);
    });

    it('should format billions with compact notation', () => {
      const result = formatNumber(TEST_COMPACT_BILLION, {
        notation: 'compact',
      });
      expect(result).toMatch(/3\s*B/);
    });

    it('should format compact with compactDisplay long', () => {
      const result = formatNumber(TEST_COMPACT_THOUSAND, {
        notation: 'compact',
        compactDisplay: 'long',
      });
      // Different locales: "1.5 thousand", "1500", etc.
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Scientific notation', () => {
    it('should format with scientific notation', () => {
      const result = formatNumber(1234.56, {
        notation: 'scientific',
      });
      expect(result).toMatch(/1[.,]2[0-9]*[eE][+]?3/);
    });

    it('should format with engineering notation', () => {
      const result = formatNumber(1234.56, {
        notation: 'engineering',
      });
      // Engineering notation uses exponents that are multiples of 3
      expect(result).toMatch(/[0-9][.,]?[0-9]*[eE][+]?[0-9]+/);
    });
  });

  describe('Locale variations', () => {
    it('should format with German locale', () => {
      const result = formatNumber(1234.56, {
        locale: 'de-DE',
      });
      // German uses period for thousands, comma for decimals
      expect(result).toMatch(/1\.234,56|1\s234,56/);
    });

    it('should format with Japanese locale', () => {
      const result = formatNumber(1234.56, {
        locale: 'ja-JP',
      });
      expect(typeof result).toBe('string');
      expect(result).toContain('1');
    });

    it('should format with French locale', () => {
      const result = formatNumber(1234.56, {
        locale: 'fr-FR',
      });
      // French uses space or narrow space for thousands
      expect(result).toMatch(/1\s234,56/);
    });
  });

  describe('Style variations', () => {
    it('should format as percentage', () => {
      const result = formatNumber(TEST_PERCENT, {
        style: 'percent',
      });
      expect(result).toMatch(/12[.,]?3?4?%/);
    });

    it('should format with unit', () => {
      const result = formatNumber(TEST_UNIT_VALUE, {
        style: 'unit',
        unit: 'megabyte',
      });
      expect(result).toMatch(/100\s*M?B/);
    });
  });

  describe('Caching', () => {
    it('should cache formatters', () => {
      formatNumber(TEST_NUMBER);
      expect(formatNumber.getCacheSize()).toBe(1);

      formatNumber(TEST_CACHED_NUMBER); // Same options, should reuse
      expect(formatNumber.getCacheSize()).toBe(1);
    });

    it('should create new formatters for different options', () => {
      formatNumber(TEST_NUMBER);
      formatNumber(1234.56, { maximumFractionDigits: 3 });
      expect(formatNumber.getCacheSize()).toBe(2);
    });

    it('should clear cache', () => {
      formatNumber(TEST_NUMBER);
      expect(formatNumber.getCacheSize()).toBeGreaterThan(0);

      formatNumber.clearCache();
      expect(formatNumber.getCacheSize()).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for invalid input type', () => {
      expect(() => formatNumber('invalid' as unknown as number)).toThrow(TypeError);
    });

    it('should handle NaN gracefully', () => {
      const result = formatNumber(Number.NaN);
      expect(result).toMatch(/NaN/i);
    });

    it('should handle Infinity', () => {
      const result = formatNumber(Number.POSITIVE_INFINITY);
      expect(result).toMatch(/∞|Infinity/i);
    });

    it('should handle negative Infinity', () => {
      const result = formatNumber(Number.NEGATIVE_INFINITY);
      expect(result).toMatch(/-∞|-Infinity/i);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero', () => {
      const result = formatNumber(0);
      expect(result).toMatch(/^0$/);
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(TEST_NEGATIVE_NUMBER);
      expect(result).toMatch(/-1[,\s]234\.56/);
    });

    it('should handle very small numbers', () => {
      const result = formatNumber(TEST_VERY_SMALL, {
        maximumFractionDigits: 6,
      });
      expect(result).toMatch(/0[.,]000001/);
    });

    it('should handle very large numbers', () => {
      const result = formatNumber(TEST_VERY_LARGE);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});

describe('formatCurrency', () => {
  // Clear cache before each test for isolation
  beforeEach(() => {
    formatCurrency.clearCache();
  });

  describe('Basic functionality', () => {
    it('should format with default USD currency', () => {
      const result = formatCurrency(TEST_NUMBER);
      expect(result).toMatch(/\$1[,\s]234\.56|USD/);
    });

    it('should format with EUR currency', () => {
      const result = formatCurrency(TEST_NUMBER, { currency: 'EUR' });
      expect(result).toMatch(/€1[,\s]234[.,]56|EUR/);
    });

    it('should format with GBP currency', () => {
      const result = formatCurrency(TEST_NUMBER, { currency: 'GBP' });
      expect(result).toMatch(/£1[,\s]234[.,]56|GBP/);
    });

    it('should format with JPY currency (no decimals)', () => {
      const result = formatCurrency(TEST_INTEGER, { currency: 'JPY' });
      // JPY typically doesn't show decimal places
      expect(result).toMatch(/¥1[,\s]234|JPY.*1[,\s]234/);
    });

    it('should format with KRW currency (no decimals)', () => {
      const result = formatCurrency(TEST_INTEGER, { currency: 'KRW' });
      // KRW typically doesn't show decimal places
      expect(result).toMatch(/₩1[,\s]234|KRW.*1[,\s]234/);
    });
  });

  describe('Currency display modes', () => {
    it('should format with symbol display (default)', () => {
      const result = formatCurrency(TEST_NUMBER, {
        currency: 'USD',
        currencyDisplay: 'symbol',
      });
      expect(result).toMatch(/\$/);
    });

    it('should format with code display', () => {
      const result = formatCurrency(TEST_NUMBER, {
        currency: 'USD',
        currencyDisplay: 'code',
      });
      expect(result).toMatch(/USD/);
    });

    it('should format with name display', () => {
      const result = formatCurrency(TEST_NUMBER, {
        currency: 'USD',
        currencyDisplay: 'name',
      });
      // Should contain "dollar" or "dollars"
      expect(result.toLowerCase()).toMatch(/dollar/);
    });

    it('should format with narrowSymbol display', () => {
      const result = formatCurrency(TEST_NUMBER, {
        currency: 'USD',
        currencyDisplay: 'narrowSymbol',
      });
      expect(result).toMatch(/\$/);
    });
  });

  describe('Locale variations', () => {
    it('should format with German locale and EUR', () => {
      const result = formatCurrency(TEST_NUMBER, {
        locale: 'de-DE',
        currency: 'EUR',
      });
      // German format: "1.234,56 €" or similar
      expect(result).toMatch(/1[\s.]234,56.*€|€.*1[\s.]234,56/);
    });

    it('should format with Japanese locale and JPY', () => {
      const result = formatCurrency(TEST_INTEGER, {
        locale: 'ja-JP',
        currency: 'JPY',
      });
      // Japanese yen can be either ¥ (U+00A5) or ￥ (U+FFE5)
      expect(result).toMatch(/[¥￥]|JPY/);
    });
    it('should format with French locale and EUR', () => {
      const result = formatCurrency(TEST_NUMBER, {
        locale: 'fr-FR',
        currency: 'EUR',
      });
      // French format typically puts symbol after: "1 234,56 €"
      expect(result).toMatch(/1[\s ]234,56.*€/);
    });

    it('should format with Arabic locale', () => {
      const result = formatCurrency(TEST_NUMBER, {
        locale: 'ar-SA',
        currency: 'SAR',
      });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Fraction digits control', () => {
    it('should respect minimumFractionDigits', () => {
      const result = formatCurrency(TEST_NUMBER_HALF, {
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      expect(result).toMatch(/1[,\s]234\.50/);
    });

    it('should respect maximumFractionDigits', () => {
      const result = formatCurrency(TEST_NUMBER_3_DECIMALS, {
        currency: 'USD',
        maximumFractionDigits: 2,
      });
      expect(result).toMatch(/1[,\s]234\.57/);
    });

    it('should allow more than 2 fraction digits', () => {
      const result = formatCurrency(TEST_CURRENCY_4_DECIMALS, {
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
      expect(result).toMatch(/1[,\s]234\.5678/);
    });
  });

  describe('Grouping options', () => {
    it('should format without grouping', () => {
      const result = formatCurrency(TEST_CURRENCY_NO_GROUP, {
        currency: 'USD',
        useGrouping: false,
      });
      expect(result).toMatch(/\$1234567\.89/);
    });

    it('should format with grouping (default)', () => {
      const result = formatCurrency(TEST_CURRENCY_NO_GROUP, {
        currency: 'USD',
      });
      expect(result).toMatch(/1[,\s]234[,\s]567/);
    });
  });

  describe('Caching', () => {
    it('should cache formatters', () => {
      formatCurrency(TEST_NUMBER);
      expect(formatCurrency.getCacheSize()).toBe(1);

      formatCurrency(TEST_CACHED_NUMBER); // Same options, should reuse
      expect(formatCurrency.getCacheSize()).toBe(1);
    });

    it('should create new formatters for different currencies', () => {
      formatCurrency(TEST_NUMBER, { currency: 'USD' });
      formatCurrency(TEST_NUMBER, { currency: 'EUR' });
      expect(formatCurrency.getCacheSize()).toBe(2);
    });

    it('should create new formatters for different locales', () => {
      formatCurrency(TEST_NUMBER, { locale: 'en-US', currency: 'USD' });
      formatCurrency(TEST_NUMBER, { locale: 'de-DE', currency: 'USD' });
      expect(formatCurrency.getCacheSize()).toBe(2);
    });

    it('should clear cache', () => {
      formatCurrency(TEST_NUMBER);
      expect(formatCurrency.getCacheSize()).toBeGreaterThan(0);

      formatCurrency.clearCache();
      expect(formatCurrency.getCacheSize()).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for invalid input type', () => {
      expect(() => formatCurrency('invalid' as unknown as number)).toThrow(TypeError);
    });

    it('should handle NaN gracefully', () => {
      const result = formatCurrency(Number.NaN);
      expect(result).toMatch(/NaN/i);
    });

    it('should handle Infinity', () => {
      const result = formatCurrency(Number.POSITIVE_INFINITY);
      // Currency formatters may include currency symbol with infinity
      expect(result).toMatch(/∞|Infinity/i);
    });

    it('should handle negative Infinity', () => {
      const result = formatCurrency(Number.NEGATIVE_INFINITY);
      // Currency formatters may include currency symbol with infinity
      expect(result).toMatch(/-.*∞|-.*Infinity/i);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/\$0\.00/);
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(TEST_NEGATIVE_NUMBER);
      expect(result).toMatch(/-.*1[,\s]234\.56/);
    });

    it('should handle very small amounts', () => {
      const result = formatCurrency(0.01, { currency: 'USD' });
      expect(result).toMatch(/\$0\.01/);
    });

    it('should handle very large amounts', () => {
      const result = formatCurrency(TEST_VERY_LARGE, { currency: 'USD' });
      expect(typeof result).toBe('string');
      expect(result).toMatch(/\$/);
    });

    it('should handle different currency codes', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'CAD', 'AUD'];
      currencies.forEach((currency) => {
        const result = formatCurrency(TEST_NUMBER, { currency });
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
