/**
 * isExternalUrl - Checks if a URL is an external link
 *
 * Determines if a URL points to an external domain by checking
 * for absolute URL protocols (http://, https://, ftp://, etc.).
 *
 * @module utils/types/isExternalUrl
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/Breadcrumb/Breadcrumb.tsx
 * - packages/@dsai/react/src/components/Card/Card.tsx
 * - packages/@dsai/react/src/components/ListGroup/ListGroup.tsx
 */

/**
 * Common external URL protocols that indicate an absolute URL
 */
const EXTERNAL_PROTOCOLS = ['http://', 'https://', 'ftp://', 'ftps://', 'mailto:', 'tel:'];

/**
 * Checks if a URL is an external link (starts with absolute protocol).
 *
 * @param href - The URL to check
 * @returns true if the URL is external, false otherwise
 *
 * @example
 * isExternalUrl('https://google.com');     // true
 * isExternalUrl('http://example.com');     // true
 * isExternalUrl('ftp://server.com');       // true
 * isExternalUrl('mailto:test@example.com'); // true
 * isExternalUrl('/about');                 // false
 * isExternalUrl('#section');               // false
 * isExternalUrl(undefined);                // false
 * isExternalUrl(null);                     // false
 */
export function isExternalUrl(href?: string | null): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }
  const normalized = href.trim().toLowerCase();
  return EXTERNAL_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
}

export default isExternalUrl;
