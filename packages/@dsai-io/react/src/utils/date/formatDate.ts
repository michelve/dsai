/**
 * Locale-aware date formatting utility using Intl.DateTimeFormat
 *
 * Provides a wrapper around Intl.DateTimeFormat with:
 * - SSR-safe implementation with fallbacks
 * - Formatter caching for performance
 * - Support for date/time styles and custom options
 * - Time zone handling
 * - Graceful degradation when Intl is unavailable
 *
 * @module utils/date/formatDate
 * @since 1.0.0
 * @stable
 */

import type { DateFormatterOptions } from '../types/shared';

/**
 * Cache for Intl.DateTimeFormat instances
 * Key format: `${locale}-${dateStyle}-${timeStyle}-${timeZone}`
 */
const formattersCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Maximum cache size to prevent memory leaks
 */
const MAX_CACHE_SIZE = 100;

/** Fraction of cache entries to evict when the cache is full (20%) */
const CACHE_EVICTION_FRACTION = 0.2;

/** Number of hours used to determine AM/PM boundary */
const HOURS_IN_HALF_DAY = 12;

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
 * @param options - Formatter options
 * @returns Cache key string
 */
function getCacheKey(locale: string, options: Intl.DateTimeFormatOptions): string {
  // Sort keys for consistent cache keys
  const sortedOptions = Object.keys(options)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => `${key}:${JSON.stringify(options[key as keyof Intl.DateTimeFormatOptions])}`)
    .join('|');

  return `${locale}|${sortedOptions}`;
}

/**
 * Clear oldest entries from cache when size limit is reached
 */
function evictOldestCacheEntries(): void {
  if (formattersCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest 20% of entries
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * CACHE_EVICTION_FRACTION);
    const keys = Array.from(formattersCache.keys());

    for (let i = 0; i < entriesToRemove; i++) {
      const keyToDelete = Reflect.get(keys, i) as string | undefined;
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
 * @param options - Intl.DateTimeFormatOptions
 * @returns Cached or new DateTimeFormat instance, or null if creation fails
 */
function getOrCreateFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat | null {
  const cacheKey = getCacheKey(locale, options);
  let formatter = formattersCache.get(cacheKey);

  if (!formatter) {
    try {
      // Check if Intl is available
      if (globalThis.Intl === undefined || globalThis.Intl.DateTimeFormat === undefined) {
        return null;
      }

      formatter = new Intl.DateTimeFormat(locale, options);

      // Evict old entries if cache is full
      evictOldestCacheEntries();

      formattersCache.set(cacheKey, formatter);
    } catch (error) {
      // Invalid locale or options, return null to trigger fallback
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`[formatDate] Failed to create formatter: ${error}`);
      }
      return null;
    }
  }

  return formatter;
}

/**
 * Format date part for fallback rendering
 */
function formatFallbackDate(date: Date, dateStyle?: string): string {
  if (dateStyle === 'full' || dateStyle === 'long') {
    return date.toDateString();
  }
  if (dateStyle === 'medium') {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
  // short or default
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear() % 100}`;
}

/**
 * Format time part for fallback rendering
 */
function formatFallbackTime(date: Date, timeStyle?: string): string {
  if (timeStyle === 'full' || timeStyle === 'long') {
    return date.toTimeString();
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= HOURS_IN_HALF_DAY ? 'PM' : 'AM';
  const displayHours = hours % HOURS_IN_HALF_DAY || HOURS_IN_HALF_DAY;
  const minuteStr = minutes.toString().padStart(2, '0');

  if (timeStyle === 'medium') {
    const seconds = date.getSeconds();
    const secondStr = seconds.toString().padStart(2, '0');
    return `${displayHours}:${minuteStr}:${secondStr} ${ampm}`;
  }

  // short or default
  return `${displayHours}:${minuteStr} ${ampm}`;
}

/**
 * Fallback formatter for when Intl is unavailable
 *
 * Provides basic date formatting using native Date methods
 */
function fallbackFormat(date: Date, options: Intl.DateTimeFormatOptions): string {
  const { dateStyle, timeStyle } = options;
  const parts: string[] = [];

  if (!timeStyle || dateStyle) {
    parts.push(formatFallbackDate(date, dateStyle));
  }

  if (!dateStyle || timeStyle) {
    parts.push(formatFallbackTime(date, timeStyle));
  }

  return parts.join(' ');
}

/**
 * Format a date using locale-aware formatting
 *
 * Uses Intl.DateTimeFormat with caching for performance. Falls back to
 * basic Date methods if Intl is unavailable or locale is invalid.
 *
 * SSR-safe: Works in Node.js and browser environments.
 *
 * @param date - Date to format (Date object, timestamp, or ISO string)
 * @param options - Formatting options
 * @returns Formatted date string
 * @throws {TypeError} If date is invalid
 *
 * @example
 * ```tsx
 * // Basic usage with date style
 * formatDate(new Date(), { dateStyle: 'medium' });
 * // => "Dec 8, 2025" (en-US)
 *
 * // With time style
 * formatDate(new Date(), { dateStyle: 'short', timeStyle: 'short' });
 * // => "12/8/25, 3:45 PM" (en-US)
 *
 * // Custom locale
 * formatDate(new Date(), { locale: 'es-ES', dateStyle: 'long' });
 * // => "8 de diciembre de 2025"
 *
 * // With time zone
 * formatDate(new Date(), {
 *   timeZone: 'America/New_York',
 *   dateStyle: 'short',
 *   timeStyle: 'short'
 * });
 * // => "12/8/25, 3:45 PM" (Eastern Time)
 *
 * // Custom options
 * formatDate(new Date(), {
 *   options: {
 *     weekday: 'long',
 *     year: 'numeric',
 *     month: 'long',
 *     day: 'numeric'
 *   }
 * });
 * // => "Sunday, December 8, 2025"
 * ```
 *
 * @stable
 */
/**
 * Parse date input into a Date object
 */
function parseDateInput(date: Date | number | string): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'number' || typeof date === 'string') {
    return new Date(date);
  }
  throw new TypeError(
    `formatDate: Invalid date argument. Expected Date, number, or string, got ${typeof date}`
  );
}

/**
 * Build Intl.DateTimeFormatOptions from DateFormatterOptions
 */
function buildIntlOptions(options: DateFormatterOptions): Intl.DateTimeFormatOptions {
  if (options.options) {
    return { ...options.options };
  }

  const intlOptions: Intl.DateTimeFormatOptions = {};

  if (options.dateStyle) {
    intlOptions.dateStyle = options.dateStyle;
  }

  if (options.timeStyle) {
    intlOptions.timeStyle = options.timeStyle;
  }

  // Default to medium date style if no options provided
  if (!options.dateStyle && !options.timeStyle) {
    intlOptions.dateStyle = 'medium';
  }

  return intlOptions;
}

export function formatDate(
  date: Date | number | string,
  options: DateFormatterOptions = {}
): string {
  const dateObj = parseDateInput(date);

  if (Number.isNaN(dateObj.getTime())) {
    throw new TypeError(`formatDate: Invalid date value: ${date}`);
  }

  const locale = options.locale || getDefaultLocale();
  const intlOptions = buildIntlOptions(options);

  // Add time zone:
  // - honor explicit timeZone
  // - default to UTC for deterministic output unless useLocalTimeZone is true
  const resolvedTimeZone = options.timeZone ?? (options.useLocalTimeZone ? undefined : 'UTC');
  if (resolvedTimeZone) {
    intlOptions.timeZone = resolvedTimeZone;
  }

  const formatter = getOrCreateFormatter(locale, intlOptions);

  if (formatter) {
    try {
      return formatter.format(dateObj);
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn(`[formatDate] Formatter failed, using fallback: ${error}`);
      }
    }
  }

  return fallbackFormat(dateObj, intlOptions);
}

/**
 * Clear the formatter cache
 *
 * Useful for testing or when you need to free memory
 *
 * @example
 * ```tsx
 * formatDate.clearCache();
 * ```
 */
formatDate.clearCache = (): void => {
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
 * const size = formatDate.getCacheSize();
 * console.log(`Cache has ${size} formatters`);
 * ```
 */
formatDate.getCacheSize = (): number => {
  return formattersCache.size;
};
