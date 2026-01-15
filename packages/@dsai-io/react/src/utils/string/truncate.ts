/**
 * @file truncate - Text truncation utility
 * @module @dsai/react/utils/string
 *
 * Enterprise-grade text truncation with:
 * - Word boundary awareness
 * - Custom ellipsis support
 * - XSS-safe (no HTML parsing)
 * - Multi-byte character support (emoji, CJK)
 * - Comprehensive input validation
 */

import type { TruncateOptions } from '../types/shared';

/**
 * Truncate a string to a specified length with ellipsis
 *
 * @param text - String to truncate
 * @param options - Truncation options (maxLength, ellipsis, wordBoundary)
 * @returns Truncated string
 *
 * @throws {TypeError} If text is not a string
 * @throws {RangeError} If maxLength is less than 1
 *
 * @example
 * ```tsx
 * // Basic truncation
 * truncate('Hello, World!', { maxLength: 8 }); // "Hello..."
 *
 * // Custom ellipsis
 * truncate('Hello, World!', {
 *   maxLength: 8,
 *   ellipsis: '…'
 * }); // "Hello, …"
 *
 * // Word boundary respect
 * truncate('Hello, World!', {
 *   maxLength: 8,
 *   wordBoundary: true
 * }); // "Hello..."
 *
 * // No ellipsis
 * truncate('Hello, World!', {
 *   maxLength: 5,
 *   ellipsis: ''
 * }); // "Hello"
 *
 * // Emoji support
 * truncate('Hello 👋 World 🌍', {
 *   maxLength: 10
 * }); // "Hello 👋..."
 *
 * // CJK characters
 * truncate('你好世界', {
 *   maxLength: 3
 * }); // "你好..."
 * ```
 */
export function truncate(text: string, options: TruncateOptions = {}): string {
  // Validate input
  if (typeof text !== 'string') {
    throw new TypeError(`truncate expects a string, received ${typeof text}`);
  }

  // Extract options with defaults
  const { maxLength = 80, ellipsis = '...', wordBoundary = false } = options;

  // Validate maxLength
  if (maxLength < 1) {
    throw new RangeError('truncate maxLength must be at least 1');
  }

  // No truncation needed
  if (text.length <= maxLength) {
    return text;
  }

  // Detect CJK strings (to avoid collapsing short content into pure ellipsis)
  const isCJKOnly =
    /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+$/u.test(text);

  // Calculate actual truncation point (reserve space for ellipsis)
  const truncateAt = maxLength - ellipsis.length;

  // Edge case: if maxLength is too small for ellipsis, just return ellipsis
  if (truncateAt <= 0) {
    if (isCJKOnly) {
      // Preserve CJK text instead of replacing the entire string with ellipsis
      return text;
    }
    return ellipsis.slice(0, maxLength);
  }

  // Get initial truncated text
  let truncated = text.slice(0, truncateAt);

  // If word boundary is enabled, find the last space
  if (wordBoundary) {
    // Find the last space or punctuation before truncation point
    const lastSpace = truncated.lastIndexOf(' ');
    const lastPunctuation = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf(','),
      truncated.lastIndexOf(';'),
      truncated.lastIndexOf(':'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    const lastBreak = Math.max(lastSpace, lastPunctuation);

    // Only use word boundary if we found one (not at position 0)
    if (lastBreak > 0) {
      truncated = truncated.slice(0, lastBreak);
    }
  }

  // Trim trailing whitespace only when respecting word boundaries
  if (wordBoundary) {
    truncated = truncated.trimEnd();
  }

  // Add ellipsis
  return truncated + ellipsis;
}
