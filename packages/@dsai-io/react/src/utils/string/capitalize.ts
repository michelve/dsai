/**
 * @file capitalize - Text capitalization utility
 * @module @dsai-io/react/utils/string
 *
 * Enterprise-grade text capitalization with:
 * - First character capitalization
 * - All words capitalization (title case)
 * - Locale-aware (proper handling of Turkish 'i', etc.)
 * - XSS-safe (no HTML parsing)
 * - Multi-byte character support
 * - Comprehensive input validation
 */

/**
 * Capitalization mode
 */
export type CapitalizeMode = 'first' | 'words' | 'sentences';

/**
 * Options for capitalize utility
 */
export interface CapitalizeOptions {
  /**
   * Capitalization mode
   * - 'first': Capitalize only the first character
   * - 'words': Capitalize the first character of each word (title case)
   * - 'sentences': Capitalize the first character of each sentence
   * @default 'first'
   */
  readonly mode?: CapitalizeMode;

  /**
   * Locale for locale-aware capitalization (e.g., 'tr' for Turkish)
   * @default undefined (uses default locale)
   */
  readonly locale?: string;
}

/**
 * Capitalize a string according to the specified mode
 *
 * @param text - String to capitalize
 * @param options - Capitalization options (mode, locale)
 * @returns Capitalized string
 *
 * @throws {TypeError} If text is not a string
 *
 * @example
 * ```tsx
 * // First character only (default)
 * capitalize('hello world'); // "Hello world"
 *
 * // Title case (all words)
 * capitalize('hello world', { mode: 'words' }); // "Hello World"
 *
 * // Sentences
 * capitalize('hello. world. foo.', {
 *   mode: 'sentences'
 * }); // "Hello. World. Foo."
 *
 * // Locale-aware (Turkish)
 * capitalize('istanbul', {
 *   locale: 'tr'
 * }); // "İstanbul" (with dotted capital I)
 *
 * // Empty string
 * capitalize(''); // ""
 *
 * // Single character
 * capitalize('a'); // "A"
 * ```
 */
export function capitalize(text: string, options: CapitalizeOptions = {}): string {
  // Validate input
  if (typeof text !== 'string') {
    throw new TypeError(`capitalize expects a string, received ${typeof text}`);
  }

  // Empty string or single character
  if (text.length === 0) {
    return text;
  }

  // Extract options with defaults
  const { mode = 'first', locale } = options;

  switch (mode) {
    case 'first':
      return capitalizeFirst(text, locale);

    case 'words':
      return capitalizeWords(text, locale);

    case 'sentences':
      return capitalizeSentences(text, locale);

    default:
      // TypeScript should prevent this, but just in case
      throw new TypeError(`Invalid capitalization mode: ${mode}`);
  }
}

/**
 * Capitalize the first character of a string
 */
function capitalizeFirst(text: string, locale?: string): string {
  if (text.length === 0) {
    return text;
  }

  const firstChar = text.charAt(0);
  const rest = text.slice(1);

  // Use locale-aware toUpperCase if locale is provided
  const capitalizedFirst = locale ? firstChar.toLocaleUpperCase(locale) : firstChar.toUpperCase();

  return capitalizedFirst + rest;
}

/**
 * Capitalize the first character of each word (title case)
 */
function capitalizeWords(text: string, locale?: string): string {
  // Split on whitespace and capitalize each word
  return text
    .split(/(\s+)/)
    .map((part) => {
      // Keep whitespace as-is
      if (/^\s+$/.test(part)) {
        return part;
      }

      // Capitalize the word
      return capitalizeFirst(part, locale);
    })
    .join('');
}

/**
 * Capitalize the first character of each sentence
 */
function capitalizeSentences(text: string, locale?: string): string {
  // Split on sentence boundaries (., !, ?)
  // Keep the delimiter in the result
  const parts = text.split(/([.!?]+\s*)/);
  let result = '';
  let shouldCapitalize = true;

  for (const part of parts) {
    // Type guard: ensure part is defined
    if (part === undefined) {
      continue;
    }

    // Check if this is a delimiter
    if (/^[.!?]+\s*$/.test(part)) {
      result += part;
      shouldCapitalize = true;
      continue;
    }

    // Capitalize if needed
    if (shouldCapitalize && part.length > 0) {
      result += capitalizeFirst(part, locale);
      shouldCapitalize = false;
    } else {
      result += part;
    }
  }

  return result;
}
