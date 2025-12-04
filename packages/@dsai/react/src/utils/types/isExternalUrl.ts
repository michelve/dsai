/**
 * isExternalUrl - Checks if a URL is an external link
 *
 * Determines if a URL points to an external domain by checking
 * for http:// or https:// protocol prefixes.
 *
 * @module utils/types/isExternalUrl
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/Breadcrumb/Breadcrumb.tsx
 * - packages/@dsai/react/src/components/Card/Card.tsx
 * - packages/@dsai/react/src/components/ListGroup/ListGroup.tsx
 */

/**
 * Checks if a URL is an external link (starts with http:// or https://).
 *
 * @param href - The URL to check
 * @returns true if the URL is external, false otherwise
 *
 * @example
 * isExternalUrl('https://google.com');     // true
 * isExternalUrl('http://example.com');     // true
 * isExternalUrl('/about');                 // false
 * isExternalUrl('#section');               // false
 * isExternalUrl(undefined);                // false
 */
export function isExternalUrl(href?: string): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }
  return href.startsWith('http://') || href.startsWith('https://');
}

export default isExternalUrl;
