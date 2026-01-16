/**
 * Locale-aware relative time formatting utility using Intl.RelativeTimeFormat
 *
 * Provides human-readable relative time strings (e.g., "2 hours ago", "in 3 days")
 * with:
 * - SSR-safe implementation with fallbacks
 * - Formatter caching for performance
 * - Automatic unit selection (seconds, minutes, hours, days, etc.)
 * - Support for numeric and auto formatting styles
 * - Graceful degradation when Intl is unavailable
 *
 * @module utils/date/formatRelativeTime
 * @since 1.0.0
 * @stable
 */

import type { FormatterOptions } from '../types/shared';

/**
 * Time unit with threshold in milliseconds
 */
interface TimeUnit {
  readonly unit: Intl.RelativeTimeFormatUnit;
  readonly milliseconds: number;
}

/**
 * Time units ordered from largest to smallest
 */
const TIME_UNITS: readonly TimeUnit[] = [
  { unit: 'year', milliseconds: 31536000000 }, // 365 days
  { unit: 'month', milliseconds: 2592000000 }, // 30 days
  { unit: 'week', milliseconds: 604800000 }, // 7 days
  { unit: 'day', milliseconds: 86400000 }, // 24 hours
  { unit: 'hour', milliseconds: 3600000 }, // 60 minutes
  { unit: 'minute', milliseconds: 60000 }, // 60 seconds
  { unit: 'second', milliseconds: 1000 },
] as const;

/**
 * Cache for Intl.RelativeTimeFormat instances
 * Key format: `${locale}-${numeric}-${style}`
 */
const formattersCache = new Map<string, Intl.RelativeTimeFormat>();

/**
 * Maximum cache size to prevent memory leaks
 */
const MAX_CACHE_SIZE = 50;

/**
 * Get default locale from navigator or fallback
 *
 * @returns Locale string (e.g., 'en-US')
 */
function getDefaultLocale(): string {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

/**
 * Generate cache key for formatter options
 *
 * @param locale - BCP 47 language tag
 * @param numeric - Numeric formatting style
 * @param style - Formatting style (long, short, narrow)
 * @returns Cache key string
 */
function getCacheKey(
  locale: string,
  numeric: 'always' | 'auto',
  style: 'long' | 'short' | 'narrow'
): string {
  return `${locale}|${numeric}|${style}`;
}

/**
 * Clear oldest entries from cache when size limit is reached
 */
function evictOldestCacheEntries(): void {
  if (formattersCache.size >= MAX_CACHE_SIZE) {
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2);
    const keys = Array.from(formattersCache.keys());

    for (let i = 0; i < entriesToRemove; i++) {
      const keyToDelete = keys[i];
      if (keyToDelete !== undefined) {
        formattersCache.delete(keyToDelete);
      }
    }
  }
}

/**
 * Get or create a cached formatter
 *
 * @param locale - BCP 47 language tag
 * @param numeric - Numeric formatting style
 * @param style - Formatting style
 * @returns Cached or new RelativeTimeFormat instance, or null if creation fails
 */
function getOrCreateFormatter(
  locale: string,
  numeric: 'always' | 'auto',
  style: 'long' | 'short' | 'narrow'
): Intl.RelativeTimeFormat | null {
  const cacheKey = getCacheKey(locale, numeric, style);
  let formatter = formattersCache.get(cacheKey);

  if (!formatter) {
    try {
      // Check if Intl.RelativeTimeFormat is available
      if (typeof Intl === 'undefined' || typeof Intl.RelativeTimeFormat === 'undefined') {
        return null;
      }

      formatter = new Intl.RelativeTimeFormat(locale, { numeric, style });

      evictOldestCacheEntries();

      formattersCache.set(cacheKey, formatter);
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`[formatRelativeTime] Failed to create formatter: ${error}`);
      }
      return null;
    }
  }

  return formatter;
}

/**
 * Select appropriate time unit based on time difference
 *
 * @param milliseconds - Time difference in milliseconds
 * @returns Selected time unit
 */
function selectTimeUnit(milliseconds: number): TimeUnit {
  const absMilliseconds = Math.abs(milliseconds);

  for (const unit of TIME_UNITS) {
    if (absMilliseconds >= unit.milliseconds) {
      return unit;
    }
  }

  // Default to seconds for very small differences
  return TIME_UNITS[TIME_UNITS.length - 1] ?? { milliseconds: 1000, unit: 'second' };
}

/**
 * Fallback formatter for when Intl.RelativeTimeFormat is unavailable
 *
 * @param value - Numeric time value
 * @param unit - Time unit
 * @param isPast - Whether the time is in the past
 * @returns Formatted relative time string
 */
function fallbackFormat(value: number, unit: Intl.RelativeTimeFormatUnit, isPast: boolean): string {
  const absValue = Math.abs(value);
  const pluralSuffix = absValue === 1 ? '' : 's';

  if (isPast) {
    if (absValue === 0) {
      return 'just now';
    }
    return `${absValue} ${unit}${pluralSuffix} ago`;
  } else {
    return `in ${absValue} ${unit}${pluralSuffix}`;
  }
}

/**
 * Options for formatRelativeTime
 */
export interface RelativeTimeOptions extends FormatterOptions {
  /**
   * Base date to compare against
   * @default new Date()
   */
  readonly baseDate?: Date | number | string;

  /**
   * Numeric formatting style
   * - 'always': Always use numeric value (e.g., "1 day ago")
   * - 'auto': Use text when possible (e.g., "yesterday", "tomorrow")
   * @default 'auto'
   */
  readonly numeric?: 'always' | 'auto';

  /**
   * Formatting style
   * - 'long': Full words (e.g., "3 hours ago")
   * - 'short': Abbreviated (e.g., "3 hr. ago")
   * - 'narrow': Very short (e.g., "3h ago")
   * @default 'long'
   */
  readonly style?: 'long' | 'short' | 'narrow';
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 *
 * Uses Intl.RelativeTimeFormat with caching for performance. Automatically
 * selects the most appropriate time unit. Falls back to basic formatting
 * if Intl is unavailable.
 *
 * SSR-safe: Works in Node.js and browser environments.
 *
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param options - Formatting options
 * @returns Formatted relative time string
 * @throws {TypeError} If date is invalid
 *
 * @example
 * ```tsx
 * const now = new Date();
 * const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
 * const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
 *
 * // Basic usage
 * formatRelativeTime(twoHoursAgo);
 * // => "2 hours ago" (en-US, auto)
 *
 * // Future date
 * formatRelativeTime(tomorrow);
 * // => "tomorrow" (en-US, auto)
 * // or "in 1 day" (en-US, always)
 *
 * // With numeric: 'always'
 * formatRelativeTime(tomorrow, { numeric: 'always' });
 * // => "in 1 day"
 *
 * // With style: 'short'
 * formatRelativeTime(twoHoursAgo, { style: 'short' });
 * // => "2 hr. ago"
 *
 * // With style: 'narrow'
 * formatRelativeTime(twoHoursAgo, { style: 'narrow' });
 * // => "2h ago"
 *
 * // Custom locale
 * formatRelativeTime(twoHoursAgo, { locale: 'es-ES' });
 * // => "hace 2 horas"
 *
 * // Custom base date
 * formatRelativeTime(twoHoursAgo, {
 *   baseDate: new Date('2025-12-01')
 * });
 * // => Relative to December 1, 2025
 * ```
 *
 * @stable
 */
export function formatRelativeTime(
  date: Date | number | string,
  options: RelativeTimeOptions = {}
): string {
  // Parse date input
  let dateObj: Date;

  if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    throw new TypeError(
      `formatRelativeTime: Invalid date argument. Expected Date, number, or string, got ${typeof date}`
    );
  }

  // Validate date
  if (Number.isNaN(dateObj.getTime())) {
    throw new TypeError(`formatRelativeTime: Invalid date value: ${date}`);
  }

  // Parse base date
  let baseDateObj: Date;

  if (options.baseDate) {
    if (options.baseDate instanceof Date) {
      baseDateObj = options.baseDate;
    } else if (typeof options.baseDate === 'number') {
      baseDateObj = new Date(options.baseDate);
    } else {
      baseDateObj = new Date(options.baseDate);
    }

    if (Number.isNaN(baseDateObj.getTime())) {
      throw new TypeError(`formatRelativeTime: Invalid baseDate value: ${options.baseDate}`);
    }
  } else {
    baseDateObj = new Date();
  }

  const locale = options.locale || getDefaultLocale();
  const numeric = options.numeric || 'auto';
  const style = options.style || 'long';

  // Calculate time difference in milliseconds
  const diffMilliseconds = dateObj.getTime() - baseDateObj.getTime();
  const isPast = diffMilliseconds < 0;

  // Select appropriate time unit
  const timeUnit = selectTimeUnit(diffMilliseconds);

  // Calculate value in selected unit
  const value = Math.round(diffMilliseconds / timeUnit.milliseconds);

  // Try to get or create formatter
  const formatter = getOrCreateFormatter(locale, numeric, style);

  if (formatter) {
    try {
      return formatter.format(value, timeUnit.unit);
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`[formatRelativeTime] Formatter failed, using fallback: ${error}`);
      }
    }
  }

  // Fallback formatting
  return fallbackFormat(value, timeUnit.unit, isPast);
}

/**
 * Clear the formatter cache
 *
 * Useful for testing or when you need to free memory
 *
 * @example
 * ```tsx
 * formatRelativeTime.clearCache();
 * ```
 */
formatRelativeTime.clearCache = (): void => {
  formattersCache.clear();
};

/**
 * Get current cache size
 *
 * Useful for debugging or monitoring
 *
 * @returns Number of cached formatters
 *
 * @example
 * ```tsx
 * const size = formatRelativeTime.getCacheSize();
 * console.log(`Cache has ${size} formatters`);
 * ```
 */
formatRelativeTime.getCacheSize = (): number => {
  return formattersCache.size;
};
