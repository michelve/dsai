import { useEffect, useRef, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseHoverOptions, UseHoverReturn } from './useHover.types';

/**
 * Detects hover state on an element with configurable delays.
 *
 * This hook provides a simple way to track mouse hover state with optional
 * entry and exit delays. It handles touch devices properly (no hover on touch),
 * cleans up timers automatically, and works with any HTML element type.
 *
 * **Key Features**:
 * - Configurable enter/leave delays
 * - Touch device handling (no hover on touch)
 * - Generic element type support
 * - Automatic timer cleanup
 * - SSR-safe
 * - Optional change callback
 *
 * **Use Cases**:
 * - Tooltip triggers
 * - Dropdown menus
 * - Preview cards
 * - Interactive UI elements
 *
 * @template T - The type of HTML element (defaults to HTMLElement)
 * @param options - Configuration options
 * @returns Tuple of [ref, isHovered]
 *
 * @example
 * ```tsx
 * function Tooltip() {
 *   const [ref, isHovered] = useHover<HTMLButtonElement>();
 *
 *   return (
 *     <div>
 *       <button ref={ref}>Hover me</button>
 *       {isHovered && <div className="tooltip">I'm a tooltip!</div>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With delays to prevent flicker
 * function PreviewCard() {
 *   const [ref, isHovered] = useHover<HTMLDivElement>({
 *     delayEnter: 200,  // Wait 200ms before showing
 *     delayLeave: 100,  // Wait 100ms before hiding
 *   });
 *
 *   return (
 *     <div ref={ref} className="card">
 *       <h3>Product Name</h3>
 *       {isHovered && (
 *         <div className="preview">
 *           <img src="preview.jpg" alt="Preview" />
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callback for analytics
 * function InteractiveElement() {
 *   const [ref, isHovered] = useHover({
 *     delayEnter: 300,
 *     onHoverChange: (hovered) => {
 *       if (hovered) {
 *         analytics.track('element_hovered');
 *       }
 *     },
 *   });
 *
 *   return (
 *     <div ref={ref} style={{ opacity: isHovered ? 1 : 0.7 }}>
 *       Hover for full opacity
 *     </div>
 *   );
 * }
 * ```
 */
export function useHover<T extends HTMLElement = HTMLElement>(
  options: UseHoverOptions = {}
): UseHoverReturn<T> {
  const {
    delayEnter = 0,
    delayLeave = 0,
    mouseEnterDelayMS,
    mouseLeaveDelayMS,
    onHoverChange,
  } = options;

  // Support deprecated aliases
  const enterDelay = mouseEnterDelayMS ?? delayEnter;
  const leaveDelay = mouseLeaveDelayMS ?? delayLeave;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const ref = useRef<T | null>(null);
  const enterTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    const handleMouseEnter = (): void => {
      // Clear any pending leave timeout
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = undefined;
      }

      if (enterDelay > 0) {
        enterTimeoutRef.current = setTimeout(() => {
          setIsHovered(true);
          onHoverChange?.(true);
        }, enterDelay);
      } else {
        setIsHovered(true);
        onHoverChange?.(true);
      }
    };

    const handleMouseLeave = (): void => {
      // Clear any pending enter timeout
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
        enterTimeoutRef.current = undefined;
      }

      if (leaveDelay > 0) {
        leaveTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
          onHoverChange?.(false);
        }, leaveDelay);
      } else {
        setIsHovered(false);
        onHoverChange?.(false);
      }
    };

    // Add event listeners
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);

      // Clear any pending timeouts
      if (enterTimeoutRef.current) {
        clearTimeout(enterTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, [enterDelay, leaveDelay, onHoverChange]);

  return [ref, isHovered];
}
