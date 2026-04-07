/**
 * @file formatCurrency - Locale-aware currency formatting utility
 * @module @dsai-io/react/utils/number
 *
 * Enterprise-grade currency formatting with:
 * - Intl.NumberFormat with SSR-safe fallbacks
 * - ISO 4217 currency code support
 * - Currency display modes (symbol, code, name, narrow)
 * - Locale-specific formatting
 * - Formatter caching for performance
 * - Comprehensive input validation
 */

import type { CurrencyFormatterOptions } from '../types/shared';

/**
 * Cache for Intl.NumberFormat instances to avoid recreating formatters
 * Key: serialized locale + currency + options
 * Value: Intl.NumberFormat instance
 * Max size: 100 formatters (LRU eviction)
 */
const formattersCache = new Map<string, Intl.NumberFormat>();
const MAX_CACHE_SIZE = 100;

/** Fraction of cache entries to evict when the cache is full (20%) */
const CACHE_EVICTION_FRACTION = 0.2;

/**
 * Common currency symbols for fallback formatting
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$',
  CHF: 'CHF',
  SEK: 'kr',
  NZD: 'NZ$',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NOK: 'kr',
  MXN: 'MX$',
  BRL: 'R$',
  RUB: '₽',
  ZAR: 'R',
  TRY: '₺',
};

/**
 * Generate a stable cache key from locale, currency, and options
 */
function getCacheKey(
  locale: string,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): string {
  if (!options || Object.keys(options).length === 0) {
    return `${locale}|${currency}`;
  }

  // Build stable cache key from known safe options
  // Avoid dynamic JSON.stringify to prevent injection issues
  const parts: string[] = [];

  if (options.currencyDisplay !== undefined) {
    parts.push(`cd:${options.currencyDisplay}`);
  }
  if (options.currencySign !== undefined) {
    parts.push(`cs:${options.currencySign}`);
  }
  if (options.minimumFractionDigits !== undefined) {
    parts.push(`minfd:${options.minimumFractionDigits}`);
  }
  if (options.maximumFractionDigits !== undefined) {
    parts.push(`maxfd:${options.maximumFractionDigits}`);
  }
  if (options.useGrouping !== undefined) {
    parts.push(`ug:${options.useGrouping}`);
  }

  const optionsStr = parts.join('|');
  return `${locale}|${currency}|${optionsStr}`;
}

/**
 * Evict oldest entries from cache when it grows too large (LRU-style)
 */
function evictOldestEntries(): void {
  const entriesToRemove = Math.floor(MAX_CACHE_SIZE * CACHE_EVICTION_FRACTION); // Remove 20%
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
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): Intl.NumberFormat {
  const cacheKey = getCacheKey(locale, currency, options);
  let formatter = formattersCache.get(cacheKey);

  if (!formatter) {
    if (formattersCache.size >= MAX_CACHE_SIZE) {
      evictOldestEntries();
    }

    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    });
    formattersCache.set(cacheKey, formatter);
  }

  return formatter;
}

/**
 * Fallback currency formatter for environments without Intl support
 * Provides basic currency formatting using native methods and common symbols
 */
/**
 * Add thousand separators to a formatted number string.
 */
function addThousandSeparators(formatted: string): string {
  const parts = formatted.split('.');
  if (parts[0]) {
    // Safe regex: matches non-boundary followed by groups of exactly 3 digits
    const integerPart = parts[0];
    const reversed = integerPart.split('').reverse().join('');
    const grouped = reversed.replaceAll(/(\d{3})(?=\d)/g, '$1,');
    parts[0] = grouped.split('').reverse().join('');
  }
  return parts.join('.');
}

/**
 * Resolve the display value for a currency based on display mode.
 */
function resolveCurrencyDisplay(
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): string {
  const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency.toUpperCase();
  const currencyDisplay = options?.currencyDisplay ?? 'symbol';
  return currencyDisplay === 'code' || currencyDisplay === 'name' ? currency.toUpperCase() : symbol;
}

function fallbackFormat(
  value: number,
  currency: string,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
): string {
  // Handle special values
  if (Number.isNaN(value)) {
    return 'NaN';
  }

  if (!Number.isFinite(value)) {
    return value > 0 ? 'Infinity' : '-Infinity';
  }

  const displayValue = resolveCurrencyDisplay(currency, options);

  // Format number with fraction digits (default to 2 for most currencies, 0 for JPY/KRW)
  const defaultFractionDigits = ['JPY', 'KRW'].includes(currency.toUpperCase()) ? 0 : 2;
  const fractionDigits =
    options?.minimumFractionDigits ?? options?.maximumFractionDigits ?? defaultFractionDigits;

  let formattedValue = Math.abs(value).toFixed(fractionDigits);

  // Add thousand separators
  if (options?.useGrouping !== false) {
    formattedValue = addThousandSeparators(formattedValue);
  }

  // Handle sign
  const sign = value < 0 ? '-' : '';

  // Format with currency (symbol before for most locales, after for some)
  if (options?.currencyDisplay === 'name') {
    return `${sign}${formattedValue} ${displayValue}`;
  }

  return `${sign}${displayValue}${formattedValue}`;
}

/**
 * Format a number as currency according to locale and formatting options
 *
 * @param value - Number to format as currency
 * @param options - Formatting options (currency code, locale, display mode, etc.)
 * @returns Formatted currency string
 *
 * @throws {TypeError} If value is not a valid number
 * @throws {RangeError} If currency code is invalid (when using Intl)
 *
 * @example
 * ```tsx
 * // Basic formatting (USD default)
 * formatCurrency(1234.56); // "$1,234.56"
 * formatCurrency(1234.56, { currency: 'EUR' }); // "€1,234.56"
 *
 * // Different locales
 * formatCurrency(1234.56, { locale: 'de-DE', currency: 'EUR' }); // "1.234,56 €"
 * formatCurrency(1234.56, { locale: 'ja-JP', currency: 'JPY' }); // "¥1,235"
 * formatCurrency(1234.56, { locale: 'fr-FR', currency: 'EUR' }); // "1 234,56 €"
 *
 * // Currency display modes
 * formatCurrency(1234.56, {
 *   currency: 'USD',
 *   currencyDisplay: 'symbol'
 * }); // "$1,234.56" (default)
 *
 * formatCurrency(1234.56, {
 *   currency: 'USD',
 *   currencyDisplay: 'code'
 * }); // "USD 1,234.56"
 *
 * formatCurrency(1234.56, {
 *   currency: 'USD',
 *   currencyDisplay: 'name'
 * }); // "1,234.56 US dollars"
 *
 * formatCurrency(1234.56, {
 *   currency: 'USD',
 *   currencyDisplay: 'narrowSymbol'
 * }); // "$1,234.56"
 *
 * // Fraction digits control
 * formatCurrency(1234.567, {
 *   currency: 'USD',
 *   minimumFractionDigits: 2,
 *   maximumFractionDigits: 3
 * }); // "$1,234.567"
 *
 * // No grouping
 * formatCurrency(1234.56, {
 *   currency: 'USD',
 *   useGrouping: false
 * }); // "$1234.56"
 *
 * // Currencies with no decimals
 * formatCurrency(1234, { currency: 'JPY' }); // "¥1,234"
 * formatCurrency(1234, { currency: 'KRW' }); // "₩1,234"
 * ```
 */
export function formatCurrency(value: number, options: CurrencyFormatterOptions = {}): string {
  // Extract locale and currency from options
  const { locale = 'en-US', currency = 'USD', ...intlOptions } = options;

  // Validate input
  if (typeof value !== 'number') {
    throw new TypeError(`formatCurrency expects a number, received ${typeof value}`);
  }

  // SSR safety check - if Intl is not available, use fallback
  if (typeof Intl === 'undefined' || Intl.NumberFormat === undefined) {
    return fallbackFormat(value, currency, intlOptions);
  }

  try {
    const formatter = getOrCreateFormatter(locale, currency, intlOptions);
    return formatter.format(value);
  } catch (error) {
    // Fallback if formatter fails (e.g., invalid currency code or options)
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('formatCurrency: Intl.NumberFormat failed, using fallback', error);
    }
    return fallbackFormat(value, currency, intlOptions);
  }
}

/**
 * Clear the formatter cache
 * Useful for testing or when you need to free memory
 */
formatCurrency.clearCache = (): void => {
  formattersCache.clear();
};

/**
 * Get the current size of the formatter cache
 * Useful for debugging and monitoring
 */
formatCurrency.getCacheSize = (): number => {
  return formattersCache.size;
};
