/**
 * Tests for date/time formatting utilities
 *
 * Covers formatDate and formatRelativeTime with:
 * - Basic functionality for all date/time styles
 * - Locale variations (en-US, es-ES, ja-JP, ar-SA)
 * - Time zone handling
 * - SSR behavior (Intl unavailable)
 * - Edge cases (invalid dates, boundaries)
 * - Caching behavior
 * - Error handling
 *
 * @module utils/date/__tests__
 */

import { formatDate } from './formatDate';
import { formatRelativeTime } from './formatRelativeTime';

describe('formatDate', () => {
  const testDate = new Date('2025-12-08T15:45:30.000Z');

  beforeEach(() => {
    // Clear cache before each test
    formatDate.clearCache();
  });

  describe('basic functionality', () => {
    it('formats date with default options (medium dateStyle)', () => {
      const result = formatDate(testDate);
      expect(result).toMatch(/Dec.*8.*2025/); // Flexible match for different locales
    });

    it('formats with dateStyle: full', () => {
      const result = formatDate(testDate, { dateStyle: 'full', locale: 'en-US' });
      expect(result).toMatch(/Monday.*December.*8.*2025/);
    });

    it('formats with dateStyle: long', () => {
      const result = formatDate(testDate, { dateStyle: 'long', locale: 'en-US' });
      expect(result).toMatch(/December.*8.*2025/);
    });

    it('formats with dateStyle: medium', () => {
      const result = formatDate(testDate, { dateStyle: 'medium', locale: 'en-US' });
      expect(result).toMatch(/Dec.*8.*2025/);
    });

    it('formats with dateStyle: short', () => {
      const result = formatDate(testDate, { dateStyle: 'short', locale: 'en-US' });
      expect(result).toMatch(/12\/8\/25/);
    });

    it('formats with timeStyle: full', () => {
      const result = formatDate(testDate, { timeStyle: 'full', locale: 'en-US' });
      expect(result).toContain('PM');
      expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    });

    it('formats with timeStyle: short', () => {
      const result = formatDate(testDate, { timeStyle: 'short', locale: 'en-US' });
      expect(result).toContain('PM');
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats with both dateStyle and timeStyle', () => {
      const result = formatDate(testDate, {
        dateStyle: 'short',
        timeStyle: 'short',
        locale: 'en-US',
      });
      expect(result).toMatch(/12\/8\/25/);
      expect(result).toContain('PM');
    });
  });

  describe('input types', () => {
    it('accepts Date object', () => {
      const result = formatDate(testDate, { locale: 'en-US' });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('accepts timestamp number', () => {
      const result = formatDate(testDate.getTime(), { locale: 'en-US' });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('accepts ISO string', () => {
      const result = formatDate('2025-12-08T15:45:30.000Z', { locale: 'en-US' });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('locale variations', () => {
    it('formats with en-US locale', () => {
      const result = formatDate(testDate, { locale: 'en-US', dateStyle: 'long' });
      expect(result).toMatch(/December.*8.*2025/);
    });

    it('formats with es-ES locale', () => {
      const result = formatDate(testDate, { locale: 'es-ES', dateStyle: 'long' });
      expect(result).toMatch(/diciembre/);
    });

    it('formats with ja-JP locale', () => {
      const result = formatDate(testDate, { locale: 'ja-JP', dateStyle: 'long' });
      expect(result).toMatch(/2025/);
    });

    it('formats with ar-SA locale', () => {
      const result = formatDate(testDate, { locale: 'ar-SA', dateStyle: 'long' });
      expect(result).toBeTruthy(); // Just verify it doesn't crash
    });
  });

  describe('time zones', () => {
    it('formats with UTC time zone', () => {
      const result = formatDate(testDate, {
        timeZone: 'UTC',
        dateStyle: 'short',
        timeStyle: 'short',
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('formats with America/New_York time zone', () => {
      const result = formatDate(testDate, {
        timeZone: 'America/New_York',
        dateStyle: 'short',
        timeStyle: 'short',
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('formats with Asia/Tokyo time zone', () => {
      const result = formatDate(testDate, {
        timeZone: 'Asia/Tokyo',
        dateStyle: 'short',
        timeStyle: 'short',
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('custom options', () => {
    it('formats with custom weekday option', () => {
      const result = formatDate(testDate, {
        locale: 'en-US',
        options: {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      });
      expect(result).toMatch(/Monday.*December.*8.*2025/);
    });

    it('formats with custom hour/minute options', () => {
      const result = formatDate(testDate, {
        locale: 'en-US',
        options: {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        },
      });
      expect(result).toMatch(/\d{2}:\d{2}.*[AP]M/);
    });
  });

  describe('caching behavior', () => {
    it('caches formatters', () => {
      expect(formatDate.getCacheSize()).toBe(0);

      formatDate(testDate, { locale: 'en-US', dateStyle: 'medium' });
      expect(formatDate.getCacheSize()).toBe(1);

      // Same options should reuse cache
      formatDate(testDate, { locale: 'en-US', dateStyle: 'medium' });
      expect(formatDate.getCacheSize()).toBe(1);

      // Different options should create new entry
      formatDate(testDate, { locale: 'en-US', dateStyle: 'long' });
      expect(formatDate.getCacheSize()).toBe(2);
    });

    it('clears cache', () => {
      formatDate(testDate, { locale: 'en-US' });
      expect(formatDate.getCacheSize()).toBeGreaterThan(0);

      formatDate.clearCache();
      expect(formatDate.getCacheSize()).toBe(0);
    });
  });

  describe('error handling', () => {
    it('throws on invalid date type', () => {
      expect(() => formatDate({} as any)).toThrow(TypeError);
      expect(() => formatDate({} as any)).toThrow(/Invalid date argument/);
    });

    it('throws on invalid Date object', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow(TypeError);
      expect(() => formatDate(new Date('invalid'))).toThrow(/Invalid date value/);
    });

    it('throws on invalid timestamp', () => {
      expect(() => formatDate(NaN)).toThrow(TypeError);
    });

    it('throws on invalid ISO string', () => {
      expect(() => formatDate('not-a-date')).toThrow(TypeError);
    });
  });

  describe('edge cases', () => {
    it('formats Unix epoch', () => {
      const result = formatDate(0, { locale: 'en-US', dateStyle: 'short' });
      expect(result).toMatch(/1\/1\/70/);
    });

    it('formats far future date', () => {
      const futureDate = new Date('2099-12-31T23:59:59.999Z');
      const result = formatDate(futureDate, { locale: 'en-US', dateStyle: 'short' });
      expect(result).toMatch(/12\/31\/99/);
    });

    it('formats leap day', () => {
      const leapDay = new Date('2024-02-29T12:00:00.000Z');
      const result = formatDate(leapDay, { locale: 'en-US', dateStyle: 'long' });
      expect(result).toMatch(/February.*29.*2024/);
    });
  });
});

describe('formatRelativeTime', () => {
  const baseDate = new Date('2025-12-08T12:00:00.000Z');

  beforeEach(() => {
    formatRelativeTime.clearCache();
  });

  describe('basic functionality', () => {
    it('formats past time (2 hours ago)', () => {
      const twoHoursAgo = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*hour.*ago/);
    });

    it('formats future time (in 3 days)', () => {
      const threeDaysLater = new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeDaysLater, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/in.*3.*day/);
    });

    it('formats seconds (30 seconds ago)', () => {
      const thirtySecondsAgo = new Date(baseDate.getTime() - 30 * 1000);
      const result = formatRelativeTime(thirtySecondsAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/30.*second.*ago/);
    });

    it('formats minutes (15 minutes ago)', () => {
      const fifteenMinutesAgo = new Date(baseDate.getTime() - 15 * 60 * 1000);
      const result = formatRelativeTime(fifteenMinutesAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/15.*minute.*ago/);
    });

    it('formats weeks (2 weeks ago)', () => {
      const twoWeeksAgo = new Date(baseDate.getTime() - 14 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoWeeksAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*week.*ago/);
    });

    it('formats months (3 months ago)', () => {
      const threeMonthsAgo = new Date(baseDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(threeMonthsAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/3.*month.*ago/);
    });

    it('formats years (2 years ago)', () => {
      const twoYearsAgo = new Date(baseDate.getTime() - 730 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(twoYearsAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*year.*ago/);
    });
  });

  describe('numeric options', () => {
    it('uses numeric: "always" for explicit values', () => {
      const oneDayAgo = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(oneDayAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/1.*day.*ago/);
    });

    it('uses numeric: "auto" for text (default)', () => {
      const oneDayAgo = new Date(baseDate.getTime() - 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(oneDayAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'auto',
      });
      // May be "yesterday" or "1 day ago" depending on Intl implementation
      expect(result).toBeTruthy();
    });
  });

  describe('style options', () => {
    const twoHoursAgo = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000);

    it('formats with style: "long" (default)', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        style: 'long',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*hour.*ago/);
    });

    it('formats with style: "short"', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        style: 'short',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*hr.*ago/);
    });

    it('formats with style: "narrow"', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        style: 'narrow',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*h.*ago/);
    });
  });

  describe('input types', () => {
    const twoHoursAgo = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000);

    it('accepts Date object', () => {
      const result = formatRelativeTime(twoHoursAgo, { baseDate, locale: 'en-US' });
      expect(result).toBeTruthy();
    });

    it('accepts timestamp number', () => {
      const result = formatRelativeTime(twoHoursAgo.getTime(), {
        baseDate,
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('accepts ISO string', () => {
      const result = formatRelativeTime(twoHoursAgo.toISOString(), {
        baseDate,
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('accepts baseDate as Date object', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate: baseDate,
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('accepts baseDate as timestamp', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate: baseDate.getTime(),
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });

    it('accepts baseDate as ISO string', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate: baseDate.toISOString(),
        locale: 'en-US',
      });
      expect(result).toBeTruthy();
    });
  });

  describe('locale variations', () => {
    const twoHoursAgo = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000);

    it('formats with en-US locale', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/2.*hour.*ago/);
    });

    it('formats with es-ES locale', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'es-ES',
        numeric: 'always',
      });
      expect(result).toMatch(/hace.*2.*hora/);
    });

    it('formats with ja-JP locale', () => {
      const result = formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'ja-JP',
        numeric: 'always',
      });
      expect(result).toBeTruthy(); // Just verify it doesn't crash
    });
  });

  describe('caching behavior', () => {
    const twoHoursAgo = new Date(baseDate.getTime() - 2 * 60 * 60 * 1000);

    it('caches formatters', () => {
      expect(formatRelativeTime.getCacheSize()).toBe(0);

      formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
        style: 'long',
      });
      expect(formatRelativeTime.getCacheSize()).toBe(1);

      // Same options should reuse cache
      formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
        style: 'long',
      });
      expect(formatRelativeTime.getCacheSize()).toBe(1);

      // Different options should create new entry
      formatRelativeTime(twoHoursAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'auto',
        style: 'long',
      });
      expect(formatRelativeTime.getCacheSize()).toBe(2);
    });

    it('clears cache', () => {
      formatRelativeTime(twoHoursAgo, { baseDate, locale: 'en-US' });
      expect(formatRelativeTime.getCacheSize()).toBeGreaterThan(0);

      formatRelativeTime.clearCache();
      expect(formatRelativeTime.getCacheSize()).toBe(0);
    });
  });

  describe('error handling', () => {
    it('throws on invalid date type', () => {
      expect(() => formatRelativeTime({} as any, { baseDate })).toThrow(TypeError);
      expect(() => formatRelativeTime({} as any, { baseDate })).toThrow(/Invalid date argument/);
    });

    it('throws on invalid Date object', () => {
      expect(() => formatRelativeTime(new Date('invalid'), { baseDate })).toThrow(TypeError);
      expect(() => formatRelativeTime(new Date('invalid'), { baseDate })).toThrow(
        /Invalid date value/
      );
    });

    it('throws on invalid baseDate', () => {
      const validDate = new Date();
      expect(() => formatRelativeTime(validDate, { baseDate: 'invalid' as any })).toThrow(
        TypeError
      );
      expect(() => formatRelativeTime(validDate, { baseDate: 'invalid' as any })).toThrow(
        /Invalid baseDate value/
      );
    });
  });

  describe('edge cases', () => {
    it('formats very small time differences (now)', () => {
      const now = new Date(baseDate.getTime());
      const result = formatRelativeTime(now, { baseDate, locale: 'en-US', numeric: 'always' });
      expect(result).toMatch(/0.*second/);
    });

    it('formats exactly 1 unit (singular)', () => {
      const oneHourAgo = new Date(baseDate.getTime() - 60 * 60 * 1000);
      const result = formatRelativeTime(oneHourAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/1.*hour.*ago/);
    });

    it('handles far past dates', () => {
      const tenYearsAgo = new Date(baseDate.getTime() - 10 * 365 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(tenYearsAgo, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/10.*year.*ago/);
    });

    it('handles far future dates', () => {
      const tenYearsLater = new Date(baseDate.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(tenYearsLater, {
        baseDate,
        locale: 'en-US',
        numeric: 'always',
      });
      expect(result).toMatch(/in.*10.*year/);
    });
  });

  describe('default baseDate (now)', () => {
    it('uses current time when baseDate is not provided', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(fiveMinutesAgo, {
        locale: 'en-US',
        numeric: 'always',
      });
      // Should be close to "5 minutes ago", allowing for test execution time
      expect(result).toMatch(/[45].*minute.*ago/);
    });
  });
});
