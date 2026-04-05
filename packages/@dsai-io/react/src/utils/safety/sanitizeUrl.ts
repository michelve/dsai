/**
 * @file sanitizeUrl - URL sanitization with XSS protection
 * @module @dsai-io/react/utils/safety
 *
 * Enterprise-grade URL sanitizer with:
 * - Protocol allowlist validation
 * - JavaScript/VBScript blocking
 * - Data URI control
 * - Encoded character decoding
 * - Null byte removal
 */

/**
 * Options for URL sanitization
 */
export interface SanitizeUrlOptions {
  /** Allowed protocols (default: http, https, mailto, tel) */
  allowedProtocols?: readonly string[];
  /** Allow data: URIs (default: false for security) */
  allowDataUrls?: boolean;
  /** Allowed data: MIME types when allowDataUrls is true */
  allowedDataMimeTypes?: readonly string[];
  /** Fallback URL when input is unsafe (default: '#') */
  fallbackUrl?: string;
  /** Allow relative URLs (default: true) */
  allowRelative?: boolean;
}

/**
 * Default allowed protocols
 */
const DEFAULT_ALLOWED_PROTOCOLS = Object.freeze([
  'http:',
  'https:',
  'mailto:',
  'tel:',
  'sms:',
] as const);

/**
 * Default allowed data MIME types (safe image types only)
 */
const DEFAULT_ALLOWED_DATA_MIME_TYPES = Object.freeze([
  'image/gif',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
] as const);

/**
 * Dangerous protocol patterns to always block
 */
const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|file|about|blob):/i;

/**
 * Decode URL-encoded characters recursively to prevent bypass
 */
function decodeRecursively(url: string, maxIterations = 10): string {
  let decoded = url;
  let prev = '';
  let iterations = 0;

  while (decoded !== prev && iterations < maxIterations) {
    prev = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      // Invalid encoding, return current state
      break;
    }
    iterations++;
  }

  return decoded;
}

/**
 * Remove null bytes and other dangerous invisible characters
 */
function removeInvisibleChars(url: string): string {
  // Filter out ASCII control characters (0x00-0x1f) and DEL (0x7f) without regex
  let cleaned = '';
  for (let i = 0; i < url.length; i++) {
    const code = url.codePointAt(i) ?? 0;
    if (code >= 0x20 && code !== 0x7f) {
      cleaned += url.charAt(i);
    }
  }
  return cleaned;
}

/**
 * Check if URL is a relative path
 */
function isRelativeUrl(url: string): boolean {
  const trimmed = url.trim();
  return (
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('?') ||
    // Path-only URLs without protocol
    (!trimmed.includes(':') && !trimmed.startsWith('//'))
  );
}

/**
 * Check if URL has a data: scheme and validate it
 */
function isValidDataUrl(url: string, allowedMimeTypes: readonly string[]): boolean {
  const dataMatch = url.match(/^data:([^;,]+)/i);
  if (!dataMatch) {
    return false;
  }

  const mimeType = dataMatch[1]?.toLowerCase();
  if (!mimeType) {
    return false;
  }

  return allowedMimeTypes.some((allowed) => mimeType === allowed.toLowerCase());
}

/**
 * Sanitize a URL to prevent XSS and other attacks
 *
 * Validates URLs against a protocol allowlist and blocks:
 * - javascript: URLs
 * - vbscript: URLs
 * - data: URLs (unless explicitly allowed)
 * - file:, about:, blob: URLs
 * - Encoded variants of dangerous protocols
 * - Null bytes and control characters
 *
 * @param url - URL string to sanitize
 * @param options - Sanitization options
 * @returns Sanitized URL or fallback
 *
 * @example
 * ```tsx
 * // Block javascript: URLs
 * sanitizeUrl('javascript:alert(1)');
 * // Returns: '#'
 *
 * // Block encoded attacks
 * sanitizeUrl('java%73cript:alert(1)');
 * // Returns: '#'
 *
 * // Allow safe protocols
 * sanitizeUrl('https://example.com');
 * // Returns: 'https://example.com'
 *
 * // Allow relative URLs
 * sanitizeUrl('/path/to/page');
 * // Returns: '/path/to/page'
 *
 * // Custom fallback
 * sanitizeUrl('javascript:alert(1)', { fallbackUrl: 'about:blank' });
 * // Returns: 'about:blank'
 *
 * // Allow data URLs for images
 * sanitizeUrl('data:image/png;base64,...', { allowDataUrls: true });
 * // Returns: 'data:image/png;base64,...'
 *
 * // In React component
 * function SafeLink({ href, children }: { href: string; children: React.ReactNode }) {
 *   return <a href={sanitizeUrl(href)}>{children}</a>;
 * }
 *
 * // In img src
 * function SafeImage({ src, alt }: { src: string; alt: string }) {
 *   return <img src={sanitizeUrl(src, { allowDataUrls: true })} alt={alt} />;
 * }
 * ```
 */
/**
 * Check if a protocol is in the allowed list.
 */
function isProtocolAllowed(protocol: string, allowedProtocols: readonly string[]): boolean {
  return allowedProtocols.some((p) => protocol === p.toLowerCase());
}

/**
 * Handle protocol-relative URLs (starting with //).
 */
function handleProtocolRelative(
  cleaned: string,
  allowedProtocols: readonly string[],
  fallbackUrl: string
): string {
  if (!cleaned.startsWith('//')) {
    return fallbackUrl;
  }
  const hasHttp = allowedProtocols.some(
    (p) => p.toLowerCase() === 'http:' || p.toLowerCase() === 'https:'
  );
  return hasHttp ? cleaned : fallbackUrl;
}

export function sanitizeUrl(url: string, options: SanitizeUrlOptions = {}): string {
  // Handle null/undefined
  if (url === null || url === undefined) {
    return options.fallbackUrl ?? '#';
  }

  const {
    allowedProtocols = DEFAULT_ALLOWED_PROTOCOLS,
    allowDataUrls = false,
    allowedDataMimeTypes = DEFAULT_ALLOWED_DATA_MIME_TYPES,
    fallbackUrl = '#',
    allowRelative = true,
  } = options;

  const input = String(url).trim();
  if (!input) {
    return fallbackUrl;
  }

  const cleaned = removeInvisibleChars(input);
  const decoded = decodeRecursively(cleaned);
  const noWhitespace = decoded.replaceAll(/\s/g, '').toLowerCase();

  if (DANGEROUS_PROTOCOLS.test(noWhitespace)) {
    return fallbackUrl;
  }

  if (isRelativeUrl(decoded)) {
    return allowRelative ? cleaned : fallbackUrl;
  }

  if (noWhitespace.startsWith('data:')) {
    return allowDataUrls && isValidDataUrl(decoded, allowedDataMimeTypes) ? cleaned : fallbackUrl;
  }

  try {
    const parsed = new URL(decoded);
    return isProtocolAllowed(parsed.protocol.toLowerCase(), allowedProtocols)
      ? cleaned
      : fallbackUrl;
  } catch {
    return handleProtocolRelative(cleaned, allowedProtocols, fallbackUrl);
  }
}

// Export defaults for customization
export { DEFAULT_ALLOWED_DATA_MIME_TYPES, DEFAULT_ALLOWED_PROTOCOLS };
