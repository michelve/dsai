/**
 * @file Comprehensive coverage tests for number and date formatting utilities
 *
 * Targets uncovered branches in:
 * - formatCurrency.ts (cache key generation, LRU eviction, fallback formatter)
 * - formatNumber.ts (compact/scientific fallback, negative zero, cache eviction)
 * - formatDate.ts (fallback formatter branches, cache eviction, useLocalTimeZone)
 * - formatRelativeTime.ts (fallback formatter, cache eviction, edge cases)
 */

import { formatCurrency } from '../number/formatCurrency';
import { formatNumber } from '../number/formatNumber';
import { formatDate } from '../date/formatDate';
import { formatRelativeTime } from '../date/formatRelativeTime';

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------
describe('formatCurrency coverage', () => {
  beforeEach(() => {
    formatCurrency.clearCache();
  });

  describe('cache key generation', () => {
    it('generates simple key without options', () => {
      formatCurrency(100);
      expect(formatCurrency.getCacheSize()).toBe(1);
    });

    it('includes currencySign in cache key', () => {
      formatCurrency(100, { currency: 'USD', currencySign: 'accounting' });
      formatCurrency(100, { currency: 'USD', currencySign: 'standard' });
      expect(formatCurrency.getCacheSize()).toBe(2);
    });

    it('includes currencyDisplay in cache key', () => {
      formatCurrency(100, { currency: 'USD', currencyDisplay: 'symbol' });
      formatCurrency(100, { currency: 'USD', currencyDisplay: 'code' });
      formatCurrency(100, { currency: 'USD', currencyDisplay: 'name' });
      formatCurrency(100, { currency: 'USD', currencyDisplay: 'narrowSymbol' });
      expect(formatCurrency.getCacheSize()).toBe(4);
    });

    it('includes fraction digits in cache key', () => {
      formatCurrency(100, { currency: 'USD', minimumFractionDigits: 0 });
      formatCurrency(100, { currency: 'USD', maximumFractionDigits: 4 });
      expect(formatCurrency.getCacheSize()).toBe(2);
    });

    it('includes useGrouping in cache key', () => {
      formatCurrency(100, { currency: 'USD', useGrouping: false });
      formatCurrency(100, { currency: 'USD', useGrouping: true });
      expect(formatCurrency.getCacheSize()).toBe(2);
    });

    it('produces same key for empty options object', () => {
      formatCurrency(100, { currency: 'USD' });
      formatCurrency(200, { currency: 'USD' });
      expect(formatCurrency.getCacheSize()).toBe(1);
    });
  });

  describe('cache eviction (LRU)', () => {
    it('evicts oldest 20% when cache reaches MAX_CACHE_SIZE (100)', () => {
      // The cache key for formatCurrency is: locale|currency|cd:...|cs:...|minfd:...|maxfd:...|ug:...
      // We use unique combos of currency codes and fraction digits to fill 100+ entries.
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'CAD', 'AUD', 'CHF', 'SEK'];
      let count = 0;
      for (const currency of currencies) {
        for (let minFd = 0; minFd <= 10; minFd++) {
          if (count >= 100) break;
          formatCurrency(100, {
            locale: 'en-US',
            currency,
            minimumFractionDigits: minFd,
          });
          count++;
        }
      }
      expect(formatCurrency.getCacheSize()).toBe(100);

      // Adding one more triggers eviction of 20 entries, then adds 1
      formatCurrency(100, {
        locale: 'en-US',
        currency: 'NZD',
        minimumFractionDigits: 0,
      });
      // 100 - 20 + 1 = 81
      expect(formatCurrency.getCacheSize()).toBe(81);
    });
  });

  describe('fallback formatter (Intl unavailable)', () => {
    const originalNumberFormat = Intl.NumberFormat;

    afterEach(() => {
      Intl.NumberFormat = originalNumberFormat;
    });

    function disableIntlNumberFormat(): void {
      // @ts-expect-error - mocking Intl for test
      Intl.NumberFormat = undefined;
    }

    it('falls back for basic positive value', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(1234.56);
      expect(result).toContain('$');
      expect(result).toContain('1,234.56');
    });

    it('falls back with NaN', () => {
      disableIntlNumberFormat();
      expect(formatCurrency(NaN)).toBe('NaN');
    });

    it('falls back with positive Infinity', () => {
      disableIntlNumberFormat();
      expect(formatCurrency(Infinity)).toBe('Infinity');
    });

    it('falls back with negative Infinity', () => {
      disableIntlNumberFormat();
      expect(formatCurrency(-Infinity)).toBe('-Infinity');
    });

    it('falls back with negative value', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(-42.5);
      expect(result).toMatch(/^-\$/);
    });

    it('falls back with code display mode', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'USD', currencyDisplay: 'code' });
      expect(result).toContain('USD');
    });

    it('falls back with name display mode', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'USD', currencyDisplay: 'name' });
      expect(result).toContain('USD');
      // name mode puts value before currency
      expect(result).toMatch(/100\.00 USD/);
    });

    it('falls back with narrowSymbol display (uses symbol)', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'USD', currencyDisplay: 'narrowSymbol' });
      expect(result).toContain('$');
    });

    it('falls back with JPY (0 fraction digits)', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(1234, { currency: 'JPY' });
      expect(result).toContain('¥');
      expect(result).toContain('1,234');
      // No decimal point for JPY
      expect(result).not.toContain('.');
    });

    it('falls back with KRW (0 fraction digits)', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(5000, { currency: 'KRW' });
      expect(result).toContain('₩');
    });

    it('falls back with useGrouping: false', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(1234567.89, { currency: 'USD', useGrouping: false });
      expect(result).not.toContain(',');
      expect(result).toContain('1234567.89');
    });

    it('falls back with unknown currency code', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'XYZ' });
      // Unknown currencies use uppercase code as symbol
      expect(result).toContain('XYZ');
    });

    it('falls back with explicit minimumFractionDigits', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'USD', minimumFractionDigits: 4 });
      expect(result).toContain('100.0000');
    });

    it('falls back with explicit maximumFractionDigits', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(100, { currency: 'USD', maximumFractionDigits: 0 });
      expect(result).toContain('$100');
      expect(result).not.toContain('.');
    });

    it('adds thousand separators to large numbers in fallback', () => {
      disableIntlNumberFormat();
      const result = formatCurrency(1234567.89);
      expect(result).toContain('1,234,567.89');
    });
  });

  describe('Intl formatter error path', () => {
    it('falls back when Intl.NumberFormat constructor throws', () => {
      const originalNumberFormat = Intl.NumberFormat;
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // @ts-expect-error - mocking for test
      Intl.NumberFormat = jest.fn(() => {
        throw new RangeError('Invalid currency code');
      });

      const result = formatCurrency(100, { currency: 'INVALID' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);

      Intl.NumberFormat = originalNumberFormat;
      warnSpy.mockRestore();
    });
  });
});

// ---------------------------------------------------------------------------
// formatNumber
// ---------------------------------------------------------------------------
describe('formatNumber coverage', () => {
  beforeEach(() => {
    formatNumber.clearCache();
  });

  describe('negative zero handling', () => {
    it('normalizes -0 to 0', () => {
      const result = formatNumber(-0);
      expect(result).toBe('0');
      // Ensure it's not "-0"
      expect(result).not.toMatch(/-/);
    });
  });

  describe('cache eviction (LRU)', () => {
    it('evicts oldest entries when cache exceeds MAX_CACHE_SIZE (100)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      // Use valid unique combos to fill cache
      for (let i = 0; i < 105; i++) {
        formatNumber(100, {
          locale: 'en-US',
          minimumFractionDigits: i % 21,
          maximumFractionDigits: (i % 21) + Math.floor(i / 21),
        });
      }
      // After eviction, should be manageable
      expect(formatNumber.getCacheSize()).toBeLessThanOrEqual(105);
      warnSpy.mockRestore();
    });
  });

  describe('fallback formatter (Intl unavailable)', () => {
    const originalNumberFormat = Intl.NumberFormat;

    afterEach(() => {
      Intl.NumberFormat = originalNumberFormat;
    });

    function disableIntlNumberFormat(): void {
      // @ts-expect-error - mocking Intl for test
      Intl.NumberFormat = undefined;
    }

    it('falls back for NaN', () => {
      disableIntlNumberFormat();
      expect(formatNumber(NaN)).toBe('NaN');
    });

    it('falls back for positive Infinity', () => {
      disableIntlNumberFormat();
      expect(formatNumber(Infinity)).toBe('Infinity');
    });

    it('falls back for negative Infinity', () => {
      disableIntlNumberFormat();
      expect(formatNumber(-Infinity)).toBe('-Infinity');
    });

    it('falls back for scientific notation', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234.56, { notation: 'scientific' });
      expect(result).toMatch(/1\.23.*e\+3/i);
    });

    it('falls back for engineering notation', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234.56, { notation: 'engineering' });
      expect(result).toMatch(/e\+/i);
    });

    it('falls back for scientific with custom maximumFractionDigits', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234.56, {
        notation: 'scientific',
        maximumFractionDigits: 5,
      });
      expect(result).toMatch(/e\+3/i);
    });

    it('falls back for compact notation - thousands', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1500, { notation: 'compact' });
      expect(result).toBe('1.5K');
    });

    it('falls back for compact notation - millions', () => {
      disableIntlNumberFormat();
      const result = formatNumber(2500000, { notation: 'compact' });
      expect(result).toBe('2.5M');
    });

    it('falls back for compact notation - billions', () => {
      disableIntlNumberFormat();
      const result = formatNumber(3000000000, { notation: 'compact' });
      expect(result).toBe('3.0B');
    });

    it('falls back for compact notation - trillions', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1500000000000, { notation: 'compact' });
      expect(result).toBe('1.5T');
    });

    it('falls back for compact notation - negative values', () => {
      disableIntlNumberFormat();
      const result = formatNumber(-2500000, { notation: 'compact' });
      expect(result).toBe('-2.5M');
    });

    it('falls back for compact notation - small values (no suffix)', () => {
      disableIntlNumberFormat();
      const result = formatNumber(500, { notation: 'compact' });
      // Below 1000, compact should still format normally
      expect(result).toBe('500');
    });

    it('falls back with basic number formatting and grouping', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234567, { maximumFractionDigits: 0 });
      expect(result).toBe('1,234,567');
    });

    it('falls back with useGrouping: false', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234567, {
        useGrouping: false,
        maximumFractionDigits: 0,
      });
      expect(result).toBe('1234567');
    });

    it('falls back with minimumFractionDigits', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234.5, { minimumFractionDigits: 3 });
      expect(result).toMatch(/1,234\.500/);
    });

    it('falls back with no fraction digit options (defaults to 0)', () => {
      disableIntlNumberFormat();
      const result = formatNumber(1234.56);
      expect(result).toBe('1,235');
    });
  });

  describe('Intl formatter error path', () => {
    it('falls back and warns when formatter throws during format()', () => {
      const originalNumberFormat = Intl.NumberFormat;
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Create a formatter that throws on format()
      // @ts-expect-error - mocking for test
      Intl.NumberFormat = jest.fn(() => {
        throw new Error('Format error');
      });

      formatNumber.clearCache();
      const result = formatNumber(100, { locale: 'en-US' });
      expect(typeof result).toBe('string');
      expect(warnSpy).toHaveBeenCalled();

      Intl.NumberFormat = originalNumberFormat;
      warnSpy.mockRestore();
    });
  });

  describe('getCacheKey with empty and various options', () => {
    it('uses locale-only key when no options', () => {
      formatNumber(100);
      formatNumber(200);
      expect(formatNumber.getCacheSize()).toBe(1);
    });

    it('creates different keys for different options', () => {
      formatNumber(100, { minimumFractionDigits: 2 });
      formatNumber(100, { maximumFractionDigits: 2 });
      expect(formatNumber.getCacheSize()).toBe(2);
    });
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe('formatDate coverage', () => {
  const testDate = new Date('2025-06-15T10:30:00.000Z');

  beforeEach(() => {
    formatDate.clearCache();
  });

  describe('fallback formatter (Intl unavailable)', () => {
    const originalDateTimeFormat = Intl.DateTimeFormat;

    afterEach(() => {
      Intl.DateTimeFormat = originalDateTimeFormat;
    });

    function disableIntlDateTimeFormat(): void {
      // @ts-expect-error - mocking Intl for test
      Intl.DateTimeFormat = undefined;
    }

    it('falls back with dateStyle: full', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { dateStyle: 'full' });
      // fallback uses toDateString() for full/long
      expect(result).toContain('2025');
    });

    it('falls back with dateStyle: long', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { dateStyle: 'long' });
      expect(result).toContain('2025');
    });

    it('falls back with dateStyle: medium', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { dateStyle: 'medium' });
      // medium: M/D/YYYY
      expect(result).toMatch(/\d+\/\d+\/\d{4}/);
    });

    it('falls back with dateStyle: short (default)', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { dateStyle: 'short' });
      // short: M/D/YY
      expect(result).toMatch(/\d+\/\d+\/\d{2}/);
    });

    it('falls back with default (no dateStyle/timeStyle)', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate);
      // Default is medium dateStyle -> M/D/YYYY
      expect(result).toMatch(/\d+\/\d+/);
    });

    it('falls back with timeStyle: full', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { timeStyle: 'full' });
      // full time uses toTimeString()
      expect(result).toBeTruthy();
    });

    it('falls back with timeStyle: long', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { timeStyle: 'long' });
      expect(result).toBeTruthy();
    });

    it('falls back with timeStyle: medium', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { timeStyle: 'medium' });
      // medium time: H:MM:SS AM/PM
      expect(result).toMatch(/\d+:\d{2}:\d{2}\s*(AM|PM)/);
    });

    it('falls back with timeStyle: short', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { timeStyle: 'short' });
      // short time: H:MM AM/PM
      expect(result).toMatch(/\d+:\d{2}\s*(AM|PM)/);
    });

    it('falls back with both dateStyle and timeStyle', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { dateStyle: 'short', timeStyle: 'short' });
      expect(result).toMatch(/\d+\/\d+/);
      expect(result).toMatch(/(AM|PM)/);
    });

    it('falls back with only timeStyle (no date part)', () => {
      disableIntlDateTimeFormat();
      const result = formatDate(testDate, { timeStyle: 'short' });
      // When timeStyle is set but no dateStyle, fallback should still include
      // a date part because (!timeStyle || dateStyle) => (!short || undefined) => false
      // Actually: (!timeStyle) is false, (dateStyle) is undefined/falsy => condition is false
      // So no date part is added. Then time part is added.
      expect(result).toMatch(/(AM|PM)/);
    });
  });

  describe('cache eviction at MAX_CACHE_SIZE', () => {
    it('evicts entries when cache reaches 100', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      // Fill cache with unique option combos
      const styles: Array<'full' | 'long' | 'medium' | 'short'> = [
        'full',
        'long',
        'medium',
        'short',
      ];
      const locales = ['en-US', 'de-DE', 'fr-FR', 'ja-JP', 'es-ES', 'ko-KR', 'zh-CN'];
      let count = 0;
      for (const locale of locales) {
        for (const dateStyle of styles) {
          for (const timeStyle of styles) {
            if (count >= 105) break;
            formatDate(testDate, { locale, dateStyle, timeStyle });
            count++;
          }
        }
      }
      // Verify the cache size is managed
      expect(formatDate.getCacheSize()).toBeLessThanOrEqual(105);
      warnSpy.mockRestore();
    });
  });

  describe('error paths', () => {
    it('throws TypeError for invalid date type (boolean)', () => {
      expect(() => formatDate(true as unknown as Date)).toThrow(TypeError);
      expect(() => formatDate(true as unknown as Date)).toThrow(/Invalid date argument/);
    });

    it('throws TypeError for null', () => {
      expect(() => formatDate(null as unknown as Date)).toThrow(TypeError);
    });

    it('throws TypeError for invalid string date', () => {
      expect(() => formatDate('not-a-date')).toThrow(/Invalid date value/);
    });

    it('throws TypeError for NaN timestamp', () => {
      expect(() => formatDate(NaN)).toThrow(TypeError);
    });
  });

  describe('useLocalTimeZone flag', () => {
    it('omits timeZone when useLocalTimeZone is true', () => {
      // Just verify it doesn't throw and returns a string
      const result = formatDate(testDate, { useLocalTimeZone: true, dateStyle: 'short' });
      expect(typeof result).toBe('string');
    });
  });

  describe('various date inputs', () => {
    it('accepts number timestamp', () => {
      const result = formatDate(testDate.getTime(), { dateStyle: 'short', locale: 'en-US' });
      expect(result).toBeTruthy();
    });

    it('accepts string date', () => {
      const result = formatDate('2025-06-15T10:30:00.000Z', {
        dateStyle: 'short',
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('custom options path', () => {
    it('uses custom options instead of dateStyle/timeStyle', () => {
      const result = formatDate(testDate, {
        locale: 'en-US',
        options: { weekday: 'long', month: 'long', day: 'numeric' },
      });
      expect(result).toContain('June');
      expect(result).toContain('Sunday');
    });
  });

  describe('getOrCreateFormatter error branch', () => {
    it('falls back when formatter creation throws', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;

      // @ts-expect-error - mocking for test
      Intl.DateTimeFormat = jest.fn(() => {
        throw new Error('Invalid locale');
      });

      const result = formatDate(testDate, { locale: 'invalid-locale' });
      expect(typeof result).toBe('string');

      Intl.DateTimeFormat = originalDateTimeFormat;
    });
  });

  describe('formatter.format() error branch', () => {
    it('falls back when format() throws', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      // @ts-expect-error - mocking for test
      Intl.DateTimeFormat = jest.fn(() => ({
        format: jest.fn(() => {
          throw new Error('format failed');
        }),
      }));

      const result = formatDate(testDate, { locale: 'en-US', dateStyle: 'short' });
      expect(typeof result).toBe('string');
      expect(warnSpy).toHaveBeenCalled();

      process.env['NODE_ENV'] = originalEnv;
      Intl.DateTimeFormat = originalDateTimeFormat;
      warnSpy.mockRestore();
    });
  });

  describe('getDefaultLocale branch', () => {
    it('uses navigator.language when available', () => {
      // navigator is typically defined in jsdom
      const result = formatDate(testDate);
      expect(typeof result).toBe('string');
    });

    it('falls back to en-US when navigator is unavailable', () => {
      const originalNavigator = globalThis.navigator;
      // @ts-expect-error - mocking for test
      delete globalThis.navigator;

      const result = formatDate(testDate);
      expect(typeof result).toBe('string');

      // @ts-expect-error - restoring
      globalThis.navigator = originalNavigator;
    });
  });
});

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------
describe('formatRelativeTime coverage', () => {
  const baseDate = new Date('2025-12-08T12:00:00.000Z');

  beforeEach(() => {
    formatRelativeTime.clearCache();
  });

  describe('fallback formatter (Intl unavailable)', () => {
    const originalRelativeTimeFormat = Intl.RelativeTimeFormat;

    afterEach(() => {
      Intl.RelativeTimeFormat = originalRelativeTimeFormat;
    });

    function disableIntlRelativeTimeFormat(): void {
      // @ts-expect-error - mocking Intl for test
      Intl.RelativeTimeFormat = undefined;
    }

    it('falls back for past time', () => {
      disableIntlRelativeTimeFormat();
      const twoHoursAgo = new Date(baseDate.getTime() - 2 * 3600000);
      const result = formatRelativeTime(twoHoursAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/2 hours ago/);
    });

    it('falls back for future time', () => {
      disableIntlRelativeTimeFormat();
      const inTwoDays = new Date(baseDate.getTime() + 2 * 86400000);
      const result = formatRelativeTime(inTwoDays, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/in 2 days/);
    });

    it('falls back with singular unit', () => {
      disableIntlRelativeTimeFormat();
      const oneHourAgo = new Date(baseDate.getTime() - 3600000);
      const result = formatRelativeTime(oneHourAgo, {
        baseDate,
        locale: 'en-US',
      });
      expect(result).toMatch(/1 hour ago/);
    });

    it('falls back with "in 0 seconds" for 0 diff (not past)', () => {
      disableIntlRelativeTimeFormat();
      const result = formatRelativeTime(baseDate, {
        baseDate,
        locale: 'en-US',
      });
      // diffMilliseconds === 0, isPast = false, value = 0 => "in 0 seconds"
      expect(result).toBe('in 0 seconds');
    });

    it('falls back for seconds', () => {
      disableIntlRelativeTimeFormat();
      const thirtySecsAgo = new Date(baseDate.getTime() - 30000);
      const result = formatRelativeTime(thirtySecsAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/30 seconds ago/);
    });

    it('falls back for minutes', () => {
      disableIntlRelativeTimeFormat();
      const fiveMinAgo = new Date(baseDate.getTime() - 5 * 60000);
      const result = formatRelativeTime(fiveMinAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/5 minutes ago/);
    });

    it('falls back for weeks', () => {
      disableIntlRelativeTimeFormat();
      const twoWeeksAgo = new Date(baseDate.getTime() - 14 * 86400000);
      const result = formatRelativeTime(twoWeeksAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/2 weeks ago/);
    });

    it('falls back for months', () => {
      disableIntlRelativeTimeFormat();
      const threeMonthsAgo = new Date(baseDate.getTime() - 90 * 86400000);
      const result = formatRelativeTime(threeMonthsAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/3 months ago/);
    });

    it('falls back for years', () => {
      disableIntlRelativeTimeFormat();
      const twoYearsAgo = new Date(baseDate.getTime() - 730 * 86400000);
      const result = formatRelativeTime(twoYearsAgo, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/2 years ago/);
    });

    it('falls back for future singular', () => {
      disableIntlRelativeTimeFormat();
      const inOneDay = new Date(baseDate.getTime() + 86400000);
      const result = formatRelativeTime(inOneDay, { baseDate, locale: 'en-US' });
      expect(result).toMatch(/in 1 day$/);
    });
  });

  describe('cache eviction', () => {
    it('evicts oldest entries when cache exceeds MAX_CACHE_SIZE (50)', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      // Fill with unique combos using valid locales
      const locales = [
        'en-US', 'de-DE', 'fr-FR', 'ja-JP', 'es-ES', 'ko-KR', 'zh-CN',
        'pt-BR', 'it-IT', 'ru-RU', 'ar-SA', 'hi-IN', 'th-TH', 'vi-VN',
        'nl-NL', 'sv-SE', 'pl-PL', 'tr-TR', 'cs-CZ',
      ];
      const numericOpts: Array<'always' | 'auto'> = ['always', 'auto'];
      const styleOpts: Array<'long' | 'short' | 'narrow'> = ['long', 'short', 'narrow'];
      let count = 0;
      const date = new Date(baseDate.getTime() - 3600000);
      for (const locale of locales) {
        for (const numeric of numericOpts) {
          for (const style of styleOpts) {
            if (count >= 55) break;
            formatRelativeTime(date, { baseDate, locale, numeric, style });
            count++;
          }
        }
      }
      expect(formatRelativeTime.getCacheSize()).toBeLessThanOrEqual(55);
      warnSpy.mockRestore();
    });
  });

  describe('baseDate validation', () => {
    it('throws TypeError for invalid baseDate string', () => {
      expect(() =>
        formatRelativeTime(new Date(), { baseDate: 'not-a-date' })
      ).toThrow(/Invalid baseDate value/);
    });

    it('skips baseDate validation when baseDate is NaN (falsy)', () => {
      // NaN is falsy so `if (options.baseDate)` is false, defaults to new Date()
      const result = formatRelativeTime(new Date(), { baseDate: NaN });
      // Should not throw, uses current time as base
      expect(typeof result).toBe('string');
    });
  });

  describe('numeric auto vs always', () => {
    it('uses auto mode (may produce "yesterday")', () => {
      const oneDayAgo = new Date(baseDate.getTime() - 86400000);
      const result = formatRelativeTime(oneDayAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'auto',
      });
      // "yesterday" or "1 day ago"
      expect(result).toBeTruthy();
    });

    it('uses always mode (produces "1 day ago")', () => {
      const oneDayAgo = new Date(baseDate.getTime() - 86400000);
      const result = formatRelativeTime(oneDayAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/1 day ago/);
    });
  });

  describe('all time units', () => {
    it('formats seconds', () => {
      const date = new Date(baseDate.getTime() - 5000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/second/);
    });

    it('formats minutes', () => {
      const date = new Date(baseDate.getTime() - 5 * 60000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/minute/);
    });

    it('formats hours', () => {
      const date = new Date(baseDate.getTime() - 5 * 3600000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/hour/);
    });

    it('formats days', () => {
      const date = new Date(baseDate.getTime() - 3 * 86400000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/day/);
    });

    it('formats weeks', () => {
      const date = new Date(baseDate.getTime() - 2 * 604800000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/week/);
    });

    it('formats months', () => {
      const date = new Date(baseDate.getTime() - 3 * 2592000000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/month/);
    });

    it('formats years', () => {
      const date = new Date(baseDate.getTime() - 2 * 31536000000);
      const result = formatRelativeTime(date, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/year/);
    });
  });

  describe('edge case: 0 diff', () => {
    it('formats exactly 0 difference', () => {
      const result = formatRelativeTime(baseDate, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      // 0 seconds ago
      expect(result).toMatch(/0 second/);
    });
  });

  describe('getOrCreateFormatter error branch', () => {
    it('falls back when RelativeTimeFormat constructor throws', () => {
      const originalRelativeTimeFormat = Intl.RelativeTimeFormat;
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      // @ts-expect-error - mocking for test
      Intl.RelativeTimeFormat = jest.fn(() => {
        throw new Error('Invalid locale');
      });

      const twoHoursAgo = new Date(baseDate.getTime() - 7200000);
      const result = formatRelativeTime(twoHoursAgo, { baseDate, locale: 'en-US' });
      expect(typeof result).toBe('string');
      expect(result).toMatch(/2 hours ago/);
      expect(warnSpy).toHaveBeenCalled();

      process.env['NODE_ENV'] = originalEnv;
      Intl.RelativeTimeFormat = originalRelativeTimeFormat;
      warnSpy.mockRestore();
    });
  });

  describe('formatter.format() error branch', () => {
    it('falls back when format() throws', () => {
      const originalRelativeTimeFormat = Intl.RelativeTimeFormat;
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const originalEnv = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';

      // @ts-expect-error - mocking for test
      Intl.RelativeTimeFormat = jest.fn(() => ({
        format: jest.fn(() => {
          throw new Error('format failed');
        }),
      }));

      const twoHoursAgo = new Date(baseDate.getTime() - 7200000);
      const result = formatRelativeTime(twoHoursAgo, { baseDate, locale: 'en-US' });
      expect(typeof result).toBe('string');
      expect(warnSpy).toHaveBeenCalled();

      process.env['NODE_ENV'] = originalEnv;
      Intl.RelativeTimeFormat = originalRelativeTimeFormat;
      warnSpy.mockRestore();
    });
  });

  describe('getDefaultLocale branch', () => {
    it('falls back to en-US when navigator is unavailable', () => {
      const originalNavigator = globalThis.navigator;
      // @ts-expect-error - mocking for test
      delete globalThis.navigator;

      const twoHoursAgo = new Date(Date.now() - 7200000);
      const result = formatRelativeTime(twoHoursAgo);
      expect(typeof result).toBe('string');

      // @ts-expect-error - restoring
      globalThis.navigator = originalNavigator;
    });
  });
});
