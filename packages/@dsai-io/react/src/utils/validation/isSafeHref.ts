/**
 * isSafeHref - Validates that a URL href is safe to use
 *
 * Blocks dangerous protocols like javascript:, data:, vbscript:, and file:
 * to prevent XSS attacks through malicious URLs.
 *
 * @module utils/validation/isSafeHref
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/Alert/Alert.tsx
 * - packages/@dsai-io/react/src/components/Breadcrumb/Breadcrumb.tsx
 * - packages/@dsai-io/react/src/components/Card/Card.tsx
 * - packages/@dsai-io/react/src/components/ListGroup/ListGroup.tsx
 */

/** Dangerous URL protocols that should be blocked */
const BLOCKED_PROTOCOLS = [
  'javascript:',
  'data:',
  'vbscript:',
  'file:',
  'about:blank',
  'text/html',
];

/** Normalizes href for protocol checks and detects encoded payloads */
function normalizeHrefForCheck(href: string): string {
  const trimmed = href.trim().toLowerCase().replaceAll(/\s+/g, '');
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export interface IsSafeHrefOptions {
  /**
   * How to treat undefined/empty href values.
   * - 'safe': Returns true for undefined/empty (default for most components)
   * - 'unsafe': Returns false for undefined/empty (stricter validation)
   *
   * @default 'safe'
   */
  undefinedBehavior?: 'safe' | 'unsafe';
}

/**
 * Checks if a URL href is safe to use in href attributes.
 *
 * @param href - The URL to validate
 * @param options - Configuration options
 * @returns true if the URL is safe, false if it contains a blocked protocol
 *
 * @example
 * // Basic usage - undefined is safe by default
 * isSafeHref(undefined);                    // true
 * isSafeHref('https://example.com');        // true
 * isSafeHref('javascript:alert(1)');        // false
 *
 * @example
 * // Strict mode - undefined is unsafe
 * isSafeHref(undefined, { undefinedBehavior: 'unsafe' }); // false
 * isSafeHref('', { undefinedBehavior: 'unsafe' });        // false
 *
 * @example
 * // All blocked protocols
 * isSafeHref('javascript:void(0)');  // false
 * isSafeHref('data:text/html,...');  // false
 * isSafeHref('vbscript:msgbox(1)');  // false
 * isSafeHref('file:///etc/passwd');  // false
 */
export function isSafeHref(href: string | undefined, options: IsSafeHrefOptions = {}): boolean {
  const { undefinedBehavior = 'safe' } = options;

  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }

  const normalized = normalizeHrefForCheck(href);
  return !BLOCKED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}

export default isSafeHref;
