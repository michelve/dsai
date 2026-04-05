/**
 * @file slugify - URL-safe string conversion utility
 * @module @dsai-io/react/utils/string
 *
 * Enterprise-grade slugification with:
 * - Unicode normalization (NFD/NFC)
 * - Diacritic removal (é → e, ñ → n)
 * - XSS-safe (strips dangerous characters)
 * - Customizable separators
 * - Lowercase enforcement
 * - Leading/trailing separator removal
 * - Comprehensive input validation
 */

import type { SlugifyOptions } from '../types/shared';

/**
 * Convert a string to a URL-safe slug
 *
 * @param text - String to slugify
 * @param options - Slugification options (separator, lowercase, strict)
 * @returns URL-safe slug
 *
 * @throws {TypeError} If text is not a string
 *
 * @example
 * ```tsx
 * // Basic slugification
 * slugify('Hello World'); // "hello-world"
 *
 * // Custom separator
 * slugify('Hello World', { separator: '_' }); // "hello_world"
 *
 * // Diacritic removal
 * slugify('Café Münchën'); // "cafe-munchen"
 *
 * // Special characters
 * slugify('Hello & World!'); // "hello-and-world"
 *
 * // Multiple spaces/separators
 * slugify('Hello    World'); // "hello-world"
 *
 * // Leading/trailing whitespace
 * slugify('  Hello World  '); // "hello-world"
 *
 * // Numbers preserved
 * slugify('ECMAScript 2024'); // "ecmascript-2024"
 *
 * // Strict mode (removes non-alphanumeric)
 * slugify('Hello (World) [2024]', {
 *   strict: true
 * }); // "hello-world-2024"
 *
 * // Keep uppercase
 * slugify('Hello World', {
 *   lowercase: false
 * }); // "Hello-World"
 * ```
 */
/**
 * Apply strict mode filtering: keep only alphanumeric chars and separator.
 */
function applyStrictMode(slug: string, separator: string): string {
  const chars = slug.split('');
  const filtered: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = Reflect.get(chars, i) as string | undefined;
    if (!char) {
      continue;
    }

    if (/[a-zA-Z0-9]/.test(char) || char === separator) {
      filtered.push(char);
    } else if (filtered.length > 0 && filtered[filtered.length - 1] !== separator) {
      filtered.push(separator);
    }
  }

  return filtered.join('');
}

/**
 * Remove duplicate, leading, and trailing separators from a slug.
 */
function trimSeparators(slug: string, separator: string): string {
  if (separator.length === 0) {
    return slug;
  }

  let result = slug;
  while (result.includes(separator + separator)) {
    result = result.split(separator + separator).join(separator);
  }

  while (result.startsWith(separator)) {
    result = result.slice(separator.length);
  }
  while (result.endsWith(separator)) {
    result = result.slice(0, -separator.length);
  }

  return result;
}

export function slugify(text: string, options: SlugifyOptions = {}): string {
  // Validate input
  if (typeof text !== 'string') {
    throw new TypeError(`slugify expects a string, received ${typeof text}`);
  }

  // Extract options with defaults
  const { separator = '-', lowercase = true, strict = false } = options;

  // Normalize Unicode and remove diacritical marks
  let slug = text
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '');

  // Convert special characters to their ASCII equivalents
  slug = slug
    .replaceAll(/æ/g, 'ae')
    .replaceAll(/Æ/g, 'AE')
    .replaceAll(/œ/g, 'oe')
    .replaceAll(/Œ/g, 'OE')
    .replaceAll(/ß/g, 'ss')
    .replaceAll(/ø/g, 'o')
    .replaceAll(/Ø/g, 'O')
    .replaceAll(/&/g, ' and ')
    .replaceAll(/@/g, ' at ');

  // Convert to lowercase if requested
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  if (strict) {
    slug = applyStrictMode(slug, separator);
  } else {
    // Normal mode: replace whitespace and common punctuation with separator
    slug = slug.replaceAll(/[\s_]+/g, separator);
    slug = slug.replaceAll(/[^\w-]+/g, separator);
  }

  return trimSeparators(slug, separator);
}
