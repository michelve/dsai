/**
 * useClickOutside Hook
 *
 * Detects clicks or touches outside of specified element(s) and triggers a callback.
 * Useful for dismissing dropdowns, popovers, modals, and other overlay components.
 */

import { useCallback, useEffect } from 'react';

import { isBrowser } from '../../utils';

import type {
  UseClickOutsideCallback,
  UseClickOutsideOptions,
  UseClickOutsideRefs,
} from './useClickOutside.types';

/**
 * Detects clicks outside of the specified element(s) and calls the provided callback.
 *
 * This hook listens for mouse and touch events on the document and triggers the callback
 * when a click/touch occurs outside all specified refs. It's commonly used to dismiss
 * dropdowns, popovers, tooltips, and other overlay components when the user clicks away.
 *
 * Features:
 * - Supports single ref or array of refs (useful for trigger + content pattern)
 * - Handles both mouse and touch events
 * - Runs in capture phase by default (before stopPropagation can prevent it)
 * - Can be conditionally enabled/disabled
 * - SSR-safe (no document access during server render)
 * - Properly cleans up event listeners on unmount
 *
 * @param refs - Element ref(s) to consider as "inside". Clicks on these elements won't trigger callback.
 * @param callback - Function to call when click is detected outside all refs
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * // Single ref
 * function Tooltip() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const tooltipRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(tooltipRef, () => setIsOpen(false), {
 *     enabled: isOpen
 *   });
 *
 *   return isOpen ? <div ref={tooltipRef}>Tooltip</div> : null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple refs (trigger + content)
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   const contentRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(
 *     [triggerRef, contentRef],
 *     () => setIsOpen(false),
 *     { enabled: isOpen }
 *   );
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
 *         Toggle
 *       </button>
 *       {isOpen && (
 *         <div ref={contentRef}>
 *           Dropdown content
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom event types
 * useClickOutside(
 *   contentRef,
 *   handleClose,
 *   {
 *     events: ['pointerdown'], // Use pointer events instead
 *     capture: false, // Use bubble phase
 *   }
 * );
 * ```
 */
export function useClickOutside(
  refs: UseClickOutsideRefs,
  callback: UseClickOutsideCallback,
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, capture = true, events = ['mousedown', 'touchstart'] } = options;

  /**
   * Handle click/touch outside logic
   */
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Normalize refs to array for consistent handling
      const refsArray = Array.isArray(refs) ? refs : [refs];

      // Check if click is outside ALL refs
      const isOutside = refsArray.every((ref) => {
        const element = ref.current;

        // If ref is null/undefined or doesn't contain the target, it's "outside"
        if (!element) {
          return true;
        }

        // Check if the event target is within this ref's element
        return !element.contains(event.target as Node);
      });

      // Only call callback if click is outside all refs
      if (isOutside) {
        callback(event);
      }
    },
    [refs, callback]
  );

  useEffect(() => {
    // Skip if not enabled or not in browser environment
    if (!enabled || !isBrowser()) {
      return;
    }

    // Add event listeners for each specified event type
    for (const eventType of events) {
      document.addEventListener(eventType, handleClickOutside, capture);
    }

    // Cleanup: remove all event listeners on unmount or when dependencies change
    return () => {
      for (const eventType of events) {
        document.removeEventListener(eventType, handleClickOutside, capture);
      }
    };
  }, [enabled, events, capture, handleClickOutside]);
}
