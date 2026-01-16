import { isBrowser } from '../browser';

import { isRTL } from './isRTL';

import type { TextDirection } from './platform.types';

/**
 * Gets the text direction (ltr or rtl) of the document.
 *
 * Uses isRTL() to determine direction. Returns 'ltr' by default.
 *
 * **Key Features**:
 * - Returns TextDirection type
 * - SSR-safe
 * - Cached via isRTL
 *
 * @returns Text direction ('ltr' or 'rtl', null in SSR)
 *
 * @example
 * ```tsx
 * function Breadcrumb() {
 *   const direction = getTextDirection();
 *   const separator = direction === 'rtl' ? '←' : '→';
 *
 *   return (
 *     <nav>
 *       Home {separator} Products {separator} Item
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Apply direction to component
 * function Container() {
 *   const direction = getTextDirection();
 *
 *   return (
 *     <div dir={direction || undefined}>
 *       <Content />
 *     </div>
 *   );
 * }
 * ```
 */
export function getTextDirection(): TextDirection | null {
  if (!isBrowser()) {
    return null;
  }

  return isRTL() ? 'rtl' : 'ltr';
}
