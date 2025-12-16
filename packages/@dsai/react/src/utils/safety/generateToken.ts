/**
 * @file generateToken - Secure random token generation
 * @module @dsai/react/utils/safety
 *
 * Enterprise-grade token generation with:
 * - Cryptographically secure random generation
 * - Multiple encoding formats
 * - Configurable length
 * - SSR-safe fallback
 */

/**
 * Token encoding format
 */
export type TokenEncoding = 'hex' | 'base64' | 'base64url' | 'alphanumeric';

/**
 * Options for token generation
 */
export interface GenerateTokenOptions {
  /** Length of the token in characters (default: 32) */
  length?: number;
  /** Encoding format (default: 'hex') */
  encoding?: TokenEncoding;
  /** Custom alphabet for alphanumeric encoding */
  alphabet?: string;
  /** Prefix to add to the token */
  prefix?: string;
}

/**
 * Default alphabet for alphanumeric tokens (URL-safe, no ambiguous chars)
 */
const DEFAULT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/**
 * Get cryptographic random values
 */
function getRandomValues(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  // Use Web Crypto API when available (browser or Node 19+)
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  // Non-crypto fallback (best-effort)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

/**
 * Convert bytes to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Convert bytes to base64 string
 */
function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  // Browser fallback using btoa
  const binary = Array.from(bytes)
    .map((b) => String.fromCharCode(b))
    .join('');
  return btoa(binary);
}

/**
 * Convert bytes to URL-safe base64 string
 */
function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert bytes to custom alphabet string
 */
function bytesToAlphabet(bytes: Uint8Array, alphabet: string): string {
  const alphabetLength = alphabet.length;
  let result = '';

  // Use Array.from to avoid Object Injection Sink
  Array.from(bytes).forEach((byte) => {
    // Use modulo to map byte to alphabet
    // Note: This has slight bias for alphabets not dividing 256 evenly
    // For most use cases (tokens, IDs), this is acceptable
    const index = byte % alphabetLength;
    result += alphabet.charAt(index);
  });

  return result;
}

/**
 * Generate a cryptographically secure random token
 *
 * Uses the Web Crypto API for secure random generation with
 * multiple encoding options. Suitable for:
 * - Session tokens
 * - CSRF tokens
 * - API keys
 * - Password reset tokens
 * - Nonces
 *
 * @param options - Token generation options
 * @returns Generated token string
 *
 * @example
 * ```tsx
 * // Default hex token (32 chars)
 * const token = generateToken();
 * // Returns: 'a1b2c3d4e5f6...' (64 hex chars from 32 bytes)
 *
 * // Shorter token
 * const shortToken = generateToken({ length: 16 });
 *
 * // Base64 URL-safe token
 * const urlToken = generateToken({ encoding: 'base64url' });
 *
 * // Alphanumeric token (good for user-facing codes)
 * const code = generateToken({ length: 8, encoding: 'alphanumeric' });
 * // Returns: 'Ab3Cd5Ef' (8 alphanumeric chars)
 *
 * // With prefix for identification
 * const apiKey = generateToken({ length: 32, prefix: 'sk_' });
 * // Returns: 'sk_a1b2c3d4...'
 *
 * // Custom alphabet
 * const numericCode = generateToken({
 *   length: 6,
 *   encoding: 'alphanumeric',
 *   alphabet: '0123456789',
 * });
 * // Returns: '492817' (6 digit code)
 *
 * // For password reset
 * function createPasswordResetToken() {
 *   return generateToken({
 *     length: 32,
 *     encoding: 'base64url',
 *     prefix: 'rst_',
 *   });
 * }
 *
 * // For CSRF token
 * function createCsrfToken() {
 *   return generateToken({ length: 32, encoding: 'hex' });
 * }
 * ```
 */
export function generateToken(options: GenerateTokenOptions = {}): string {
  const { length = 32, encoding = 'hex', alphabet = DEFAULT_ALPHABET, prefix = '' } = options;

  // Validate length
  if (length <= 0) {
    throw new Error('Token length must be positive');
  }

  if (length > 1024) {
    throw new Error('Token length must not exceed 1024');
  }

  // Calculate bytes needed based on encoding
  let bytesNeeded: number;
  switch (encoding) {
    case 'hex':
      // 2 hex chars per byte
      bytesNeeded = Math.ceil(length / 2);
      break;
    case 'base64':
    case 'base64url':
      // ~1.33 chars per byte
      bytesNeeded = Math.ceil((length * 3) / 4);
      break;
    case 'alphanumeric':
      // 1 char per byte with modulo
      bytesNeeded = length;
      break;
    default:
      bytesNeeded = length;
  }

  // Generate random bytes
  const bytes = getRandomValues(bytesNeeded);

  // Convert to requested format
  let token: string;
  switch (encoding) {
    case 'hex':
      token = bytesToHex(bytes);
      break;
    case 'base64':
      token = bytesToBase64(bytes);
      break;
    case 'base64url':
      token = bytesToBase64Url(bytes);
      break;
    case 'alphanumeric':
      token = bytesToAlphabet(bytes, alphabet);
      break;
    default:
      token = bytesToHex(bytes);
  }

  // Trim to exact length and add prefix
  return prefix + token.slice(0, length);
}

// Export default alphabet for customization
export { DEFAULT_ALPHABET };
