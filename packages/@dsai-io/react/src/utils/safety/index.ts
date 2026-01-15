/**
 * @file Safety utilities barrel export
 * @module @dsai/react/utils/safety
 *
 * Data safety utilities for secure input handling:
 * - HTML sanitization
 * - URL sanitization
 * - Clipboard operations
 * - Secure token/ID generation
 */

// HTML Sanitization
export {
  DEFAULT_ALLOWED_ATTRIBUTES,
  DEFAULT_ALLOWED_PROTOCOLS,
  DEFAULT_ALLOWED_TAGS,
  sanitizeHtml,
} from './sanitizeHtml';
export type { SanitizeHtmlOptions } from './sanitizeHtml';

// URL Sanitization
export {
  DEFAULT_ALLOWED_DATA_MIME_TYPES,
  DEFAULT_ALLOWED_PROTOCOLS as DEFAULT_URL_PROTOCOLS,
  sanitizeUrl,
} from './sanitizeUrl';
export type { SanitizeUrlOptions } from './sanitizeUrl';

// Clipboard Operations
export { copyToClipboard } from './copyToClipboard';
export type { ClipboardResult, CopyToClipboardOptions } from './copyToClipboard';

export { readFromClipboard } from './readFromClipboard';
export type { ClipboardReadResult, ReadFromClipboardOptions } from './readFromClipboard';

// Token Generation
export { DEFAULT_ALPHABET, generateToken } from './generateToken';
export type { GenerateTokenOptions, TokenEncoding } from './generateToken';

// Crypto ID Generation
export { NANOID_ALPHABET, generateCryptoId } from './generateCryptoId';
export type { CryptoIdFormat, GenerateCryptoIdOptions } from './generateCryptoId';
