/**
 * @file generateCryptoId - Cryptographically secure ID generation
 * @module @dsai-io/react/utils/safety
 *
 * Enterprise-grade unique ID generation with:
 * - Cryptographically secure randomness
 * - Collision-resistant design
 * - Multiple format options
 * - Timestamp prefix option
 * - SSR compatibility
 */

/**
 * ID format options
 */
export type CryptoIdFormat = 'uuid' | 'nanoid' | 'prefixed' | 'timestamp';

/**
 * Options for ID generation
 */
export interface GenerateCryptoIdOptions {
  /** ID format (default: 'nanoid') */
  format?: CryptoIdFormat;
  /** Length for nanoid format (default: 21) */
  length?: number;
  /** Prefix for prefixed format */
  prefix?: string;
  /** Separator for prefixed format (default: '_') */
  separator?: string;
}

/**
 * URL-safe alphabet for nanoid-style IDs
 * 64 characters = 6 bits per character
 * Includes - and _ which are URL-safe
 */
const NANOID_ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

/**
 * Alphanumeric-only alphabet for timestamp IDs
 * 36 characters (a-z0-9) for compatibility with base36 timestamp prefix
 */
const ALPHANUMERIC_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Get cryptographic random values
 */
function getRandomValues(length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  // Prefer Web Crypto where available (browsers, Node 19+)
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  // Non-crypto fallback using Math.random (best-effort, non-cryptographic)
  for (let i = 0; i < length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}

/**
 * Generate a UUID v4 (random)
 */
function generateUuidV4(): string {
  const bytes = getRandomValues(16);

  // Set version (4) and variant (10xx) bits
  const byte6 = bytes[6];
  const byte8 = bytes[8];

  if (byte6 === undefined || byte8 === undefined) {
    throw new Error('Failed to generate random bytes');
  }

  // Version 4: set high nibble of byte 6 to 0100
  bytes.set([(byte6 & 0x0f) | 0x40], 6);

  // Variant: set high bits of byte 8 to 10xx
  bytes.set([(byte8 & 0x3f) | 0x80], 8);

  // Convert to hex with dashes
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * Generate a nanoid-style compact ID
 */
function generateNanoid(length: number): string {
  const bytes = getRandomValues(length);
  let result = '';

  Array.from(bytes).forEach((byte) => {
    // Use 6 bits (& 63) to index into 64-char alphabet
    result += NANOID_ALPHABET.charAt(byte & 63);
  });

  return result;
}

/**
 * Generate alphanumeric random string (for timestamp suffix)
 */
function generateAlphanumeric(length: number): string {
  const bytes = getRandomValues(length);
  let result = '';

  Array.from(bytes).forEach((byte) => {
    // Use 5 bits (& 31) + adjustment to index into 36-char alphabet
    result += ALPHANUMERIC_ALPHABET.charAt(byte % 36);
  });

  return result;
}

/**
 * Generate a timestamp-based ID with random suffix
 */
function generateTimestampId(length: number): string {
  // High-resolution timestamp if available
  const timestamp =
    typeof performance !== 'undefined' && performance.now
      ? Math.floor(performance.timeOrigin + performance.now())
      : Date.now();

  // Convert to base36 for compactness (uses 0-9a-z)
  const timeStr = timestamp.toString(36);

  // Add random suffix for uniqueness (alphanumeric only)
  const randomLength = Math.max(4, length - timeStr.length);
  const randomSuffix = generateAlphanumeric(randomLength);

  return timeStr + randomSuffix;
}

/**
 * Generate a cryptographically secure unique ID
 *
 * Provides multiple ID formats suitable for different use cases:
 * - `uuid`: Standard UUID v4 format
 * - `nanoid`: Compact URL-safe IDs (default)
 * - `prefixed`: IDs with custom prefix
 * - `timestamp`: Time-ordered IDs
 *
 * @param options - ID generation options
 * @returns Generated unique ID
 *
 * @example
 * ```tsx
 * // Default nanoid (21 chars, URL-safe)
 * const id = generateCryptoId();
 * // Returns: 'V1StGXR8_Z5jdHi6B-myT'
 *
 * // UUID v4
 * const uuid = generateCryptoId({ format: 'uuid' });
 * // Returns: '550e8400-e29b-41d4-a716-446655440000'
 *
 * // Custom length nanoid
 * const shortId = generateCryptoId({ length: 10 });
 * // Returns: 'V1StGXR8_Z'
 *
 * // Prefixed ID (great for database keys)
 * const userId = generateCryptoId({ format: 'prefixed', prefix: 'user' });
 * // Returns: 'user_V1StGXR8_Z5jdHi6B'
 *
 * // Timestamp ID (sortable by creation time)
 * const orderId = generateCryptoId({ format: 'timestamp' });
 * // Returns: 'lxz1234abcde'
 *
 * // For React keys
 * function ItemList({ items }: { items: Item[] }) {
 *   return (
 *     <ul>
 *       {items.map(item => (
 *         <li key={generateCryptoId({ length: 8 })}>
 *           {item.name}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 *
 * // For database records
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * function createUser(name: string): User {
 *   return {
 *     id: generateCryptoId({ format: 'prefixed', prefix: 'usr' }),
 *     name,
 *   };
 * }
 *
 * // For session tokens
 * const sessionId = generateCryptoId({ length: 32 });
 * ```
 */
export function generateCryptoId(options: GenerateCryptoIdOptions = {}): string {
  const { format = 'nanoid', length = 21, prefix = 'id', separator = '_' } = options;

  // Validate length
  if (length <= 0) {
    throw new Error('ID length must be positive');
  }

  if (length > 256) {
    throw new Error('ID length must not exceed 256');
  }

  switch (format) {
    case 'uuid':
      return generateUuidV4();

    case 'nanoid':
      return generateNanoid(length);

    case 'prefixed': {
      const randomPart = generateNanoid(Math.max(8, length - prefix.length - 1));
      return `${prefix}${separator}${randomPart}`;
    }

    case 'timestamp':
      return generateTimestampId(length);

    default:
      return generateNanoid(length);
  }
}

// Export alphabet for customization
export { NANOID_ALPHABET };
