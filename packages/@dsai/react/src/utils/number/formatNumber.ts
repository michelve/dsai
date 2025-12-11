/**
 * @file formatNumber - Locale-aware number formatting utility
 * @module @dsai/react/utils/number
 *
 * Enterprise-grade number formatting with:
 * - Intl.NumberFormat with SSR-safe fallbacks
 * - Compact notation (1K, 1.2M, 1.5B)
 * - Scientific and engineering notation
 * - Locale-specific grouping and decimal separators
 * - Formatter caching for performance
 * - Comprehensive input validation
 */

import type { NumberFormatterOptions } from '../types/shared';

/**
 * Cache for Intl.NumberFormat instances to avoid recreating formatters
 * Key: serialized locale + options
 * Value: Intl.NumberFormat instance
 * Max size: 100 formatters (LRU eviction)
 */
const formattersCache = new Map<string, Intl.NumberFormat>();
const MAX_CACHE_SIZE = 100;

/**
 * Generate a stable cache key from locale and options
 */
function getCacheKey(locale: string, options?: Intl.NumberFormatOptions): string {
  if (!options) {
    return locale;
  }

  // Sort keys for consistent cache keys
  const sortedKeys = Object.keys(options).sort();
  const optionsStr = sortedKeys
    .map((key) => `${key}:${JSON.stringify(options[key as keyof Intl.NumberFormatOptions])}`)
    .join('|');

  return `${locale}|${optionsStr}`;
}

/**
 * Evict oldest entries from cache when it grows too large (LRU-style)
 */
function evictOldestEntries(): void {
  const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2); // Remove 20%
  const iterator = formattersCache.keys();

  for (let i = 0; i < entriesToRemove; i++) {
    const result = iterator.next();
    if (!result.done) {
      formattersCache.delete(result.value);
    }
  }
}

/**
 * Get or create a cached Intl.NumberFormat instance
 */
function getOrCreateFormatter(
  locale: string,
  options?: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const cacheKey = getCacheKey(locale, options);
  let formatter = formattersCache.get(cacheKey);

  if (!formatter) {
    if (formattersCache.size >= MAX_CACHE_SIZE) {
      evictOldestEntries();
    }

    formatter = new Intl.NumberFormat(locale, options);
    formattersCache.set(cacheKey, formatter);
  }

  return formatter;
}

/**
 * Fallback number formatter for environments without Intl support
 * Provides basic number formatting using native methods
 */
function fallbackFormat(value: number, options?: Intl.NumberFormatOptions): string {
  // Handle special values
  if (Number.isNaN(value)) {
    return 'NaN';
  }

  if (!Number.isFinite(value)) {
    return value > 0 ? 'Infinity' : '-Infinity';
  }

  // Handle scientific notation
  if (options?.notation === 'scientific' || options?.notation === 'engineering') {
    return value.toExponential(options?.maximumFractionDigits ?? 2);
  }

  // Handle compact notation (basic approximation)
  if (options?.notation === 'compact') {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1e12) {
      return `${sign}${(absValue / 1e12).toFixed(1)}T`;
    }
    if (absValue >= 1e9) {
      return `${sign}${(absValue / 1e9).toFixed(1)}B`;
    }
    if (absValue >= 1e6) {
      return `${sign}${(absValue / 1e6).toFixed(1)}M`;
    }
    if (absValue >= 1e3) {
      return `${sign}${(absValue / 1e3).toFixed(1)}K`;
    }
  }

  // Basic number formatting with fraction digits
  const fractionDigits = options?.maximumFractionDigits ?? options?.minimumFractionDigits ?? 0;
  let result = value.toFixed(fractionDigits);

  // Add thousand separators (basic, assumes comma separators)
  if (options?.useGrouping !== false) {
    const parts = result.split('.');
    if (parts[0]) {
      // Safe regex: matches non-boundary followed by groups of exactly 3 digits
      const integerPart = parts[0];
      const reversed = integerPart.split('').reverse().join('');
      const grouped = reversed.replace(/(\d{3})(?=\d)/g, '$1,');
      parts[0] = grouped.split('').reverse().join('');
    }
    result = parts.join('.');
  }

  return result;
}

/**
 * Format a number according to locale and formatting options
 *
 * @param value - Number to format
 * @param options - Formatting options (locale, notation, fraction digits, etc.)
 * @returns Formatted number string
 *
 * @throws {TypeError} If value is not a valid number
 *
 * @example
 * ```tsx
 * // Basic formatting
 * formatNumber(1234.56); // "1,234.56" (en-US)
 * formatNumber(1234.56, { locale: 'de-DE' }); // "1.234,56"
 *
 * // Compact notation
 * formatNumber(1500, { notation: 'compact' }); // "1.5K"
 * formatNumber(2500000, { notation: 'compact' }); // "2.5M"
 * formatNumber(3000000000, { notation: 'compact' }); // "3B"
 *
 * // Compact with locale
 * formatNumber(1500, {
 *   locale: 'de-DE',
 *   notation: 'compact',
 *   compactDisplay: 'long'
 * }); // "1,5 Tausend"
 *
 * // Scientific notation
 * formatNumber(1234.56, { notation: 'scientific' }); // "1.235E3"
 *
 * // Fraction digits control
 * formatNumber(1.2345, {
 *   minimumFractionDigits: 2,
 *   maximumFractionDigits: 4
 * }); // "1.2345"
 *
 * // No grouping
 * formatNumber(1234567, { useGrouping: false }); // "1234567"
 *
 * // Percentage
 * formatNumber(0.1234, { style: 'percent' }); // "12%"
 *
 * // Unit formatting
 * formatNumber(100, {
 *   style: 'unit',
 *   unit: 'megabyte'
 * }); // "100 MB"
 * ```
 */
export function formatNumber(value: number, options: NumberFormatterOptions = {}): string {
  // Extract locale from options (default to en-US)
  const { locale = 'en-US', ...intlOptions } = options;

  // Validate input
  if (typeof value !== 'number') {
    throw new TypeError(`formatNumber expects a number, received ${typeof value}`);
  }

  // SSR safety check - if Intl is not available, use fallback
  if (typeof Intl === 'undefined' || typeof Intl.NumberFormat === 'undefined') {
    return fallbackFormat(value, intlOptions);
  }

  try {
    const formatter = getOrCreateFormatter(locale, intlOptions);
    return formatter.format(value);
  } catch (error) {
    // Fallback if formatter fails (e.g., invalid options)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('formatNumber: Intl.NumberFormat failed, using fallback', error);
    }
    return fallbackFormat(value, intlOptions);
  }
}

/**
 * Clear the formatter cache
 * Useful for testing or when you need to free memory
 */
formatNumber.clearCache = (): void => {
  formattersCache.clear();
};

/**
 * Get the current size of the formatter cache
 * Useful for debugging and monitoring
 */
formatNumber.getCacheSize = (): number => {
  return formattersCache.size;
};
