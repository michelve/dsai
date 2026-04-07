import { isBrowser } from '../browser';

import type { CachedFunction } from './cache';

/**
 * Detects if the device has hover capability (fine pointer).
 *
 * Uses pointer media queries to detect if the primary input mechanism
 * can hover over elements. Returns false for touch-only devices.
 *
 * **Key Features**:
 * - Media query detection
 * - Distinguishes fine vs coarse pointer
 * - SSR-safe
 * - Cached result
 *
 * @returns True if device has hover, false otherwise (null in SSR)
 *
 * @example
 * ```tsx
 * function InteractiveCard() {
 *   const canHover = hasHover();
 *
 *   return (
 *     <div
 *       className={canHover ? 'hoverable' : 'touch-friendly'}
 *       // Only add hover effects if device supports it
 *       onMouseEnter={canHover ? handleHover : undefined}
 *     >
 *       Card content
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional tooltip
 * function TooltipWrapper({ children, tooltip }: Props) {
 *   const canHover = hasHover();
 *
 *   // Show tooltip on hover for devices with hover capability
 *   // Show tooltip on click for touch devices
 *   return (
 *     <div>
 *       {children}
 *       {canHover ? (
 *         <HoverTooltip content={tooltip} />
 *       ) : (
 *         <ClickTooltip content={tooltip} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function hasHover(): boolean | null {
  if (!isBrowser()) {
    return null;
  }

  // Cache the result
  const cached = (hasHover as CachedFunction<boolean | null>)._cached;
  if (typeof cached === 'boolean') {
    return cached;
  }

  // Check for fine pointer (hover-capable devices)
  const hasFinePointer = globalThis.matchMedia?.('(pointer: fine)').matches;

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches;

  const result = hasFinePointer || canHover;

  // Cache the result
  (hasHover as CachedFunction<boolean | null>)._cached = result;

  return result;
}
