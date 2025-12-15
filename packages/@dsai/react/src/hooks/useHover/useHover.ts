import { useCallback, useEffect, useRef, useState } from 'react';

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
  const internalRef = useRef<T | null>(null);
  const attachedElementRef = useRef<T | null>(null);
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isMounted = useRef(true);
  const optionsRef = useRef({
    enterDelay,
    leaveDelay,
    onHoverChange,
  });

  useEffect(() => {
    optionsRef.current = { enterDelay, leaveDelay, onHoverChange };
  }, [enterDelay, leaveDelay, onHoverChange]);

  const clearEnterTimeout = useCallback(() => {
    if (enterTimeoutRef.current) {
      const clearFn =
        typeof globalThis.clearTimeout === 'function' ? globalThis.clearTimeout : clearTimeout;
      clearFn(enterTimeoutRef.current);
      enterTimeoutRef.current = undefined;
    }
  }, []);

  const clearLeaveTimeout = useCallback(() => {
    if (leaveTimeoutRef.current) {
      const clearFn =
        typeof globalThis.clearTimeout === 'function' ? globalThis.clearTimeout : clearTimeout;
      clearFn(leaveTimeoutRef.current);
      leaveTimeoutRef.current = undefined;
    }
  }, []);

  const handleMouseEnter = useCallback((): void => {
    clearLeaveTimeout();
    const { enterDelay: currentEnterDelay, onHoverChange: currentOnHoverChange } =
      optionsRef.current;

    if (currentEnterDelay > 0) {
      const setFn =
        typeof globalThis.setTimeout === 'function' ? globalThis.setTimeout : setTimeout;
      enterTimeoutRef.current = setFn(() => {
        if (!isMounted.current) {
          return;
        }
        setIsHovered(true);
        currentOnHoverChange?.(true);
      }, currentEnterDelay);
      return;
    }

    setIsHovered(true);
    currentOnHoverChange?.(true);
  }, [clearLeaveTimeout]);

  const handleMouseLeave = useCallback((): void => {
    clearEnterTimeout();
    const { leaveDelay: currentLeaveDelay, onHoverChange: currentOnHoverChange } =
      optionsRef.current;

    if (currentLeaveDelay > 0) {
      const setFn =
        typeof globalThis.setTimeout === 'function' ? globalThis.setTimeout : setTimeout;
      leaveTimeoutRef.current = setFn(() => {
        if (!isMounted.current) {
          return;
        }
        setIsHovered(false);
        currentOnHoverChange?.(false);
      }, currentLeaveDelay);
      return;
    }

    setIsHovered(false);
    currentOnHoverChange?.(false);
  }, [clearEnterTimeout]);

  const detachListeners = useCallback(() => {
    const node = attachedElementRef.current;
    if (!node) {
      return;
    }

    node.removeEventListener('mouseenter', handleMouseEnter);
    node.removeEventListener('mouseleave', handleMouseLeave);
    attachedElementRef.current = null;
    clearEnterTimeout();
    clearLeaveTimeout();
  }, [handleMouseEnter, handleMouseLeave, clearEnterTimeout, clearLeaveTimeout]);

  const attachListeners = useCallback(
    (node: T | null) => {
      if (!isBrowser() || !node) {
        return;
      }

      attachedElementRef.current = node;
      node.addEventListener('mouseenter', handleMouseEnter);
      node.addEventListener('mouseleave', handleMouseLeave);
    },
    [handleMouseEnter, handleMouseLeave]
  );

  useEffect(
    () => () => {
      isMounted.current = false;
      detachListeners();
    },
    [detachListeners]
  );

  useEffect(() => {
    internalRef.current = ref.current;
    attachListeners(ref.current);

    Object.defineProperty(ref, 'current', {
      get: () => internalRef.current,
      set: (value: T | null) => {
        if (internalRef.current === value) {
          return;
        }
        detachListeners();
        internalRef.current = value;
        attachListeners(value);
      },
      configurable: true,
    });

    return () => {
      detachListeners();
      Object.defineProperty(ref, 'current', {
        value: internalRef.current,
        writable: true,
        configurable: true,
      });
    };
  }, [attachListeners, detachListeners]);

  return [ref, isHovered];
}
