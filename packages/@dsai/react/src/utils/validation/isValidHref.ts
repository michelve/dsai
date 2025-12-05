/**
 * isValidHref - Validates that a href is safe to use
 *
 * Blocks dangerous protocols to mitigate XSS vectors in href attributes while
 * allowing components to opt into strict undefined handling when required.
 *
 * @module utils/validation/isValidHref
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/Dropdown/Dropdown.tsx
 * - packages/@dsai/react/src/components/Navbar/Navbar.tsx
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
  const trimmed = href.trim().toLowerCase().replace(/\s+/g, '');
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

export interface IsValidHrefOptions {
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
 * Checks if an href is safe to use on anchor elements.
 *
 * @param href - The href value to validate
 * @param options - Configuration options
 * @returns true if href is safe, false otherwise
 *
 * @example
 * isValidHref('/about');                      // true
 * isValidHref('javascript:alert(1)');         // false
 * isValidHref(undefined);                     // true (default safe mode)
 * isValidHref(undefined, { undefinedBehavior: 'unsafe' }); // false
 */
export function isValidHref(href: string | undefined, options: IsValidHrefOptions = {}): boolean {
  const { undefinedBehavior = 'safe' } = options;

  if (!href || typeof href !== 'string') {
    return undefinedBehavior === 'safe';
  }

  const normalized = normalizeHrefForCheck(href);
  return !BLOCKED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}

export default isValidHref;
