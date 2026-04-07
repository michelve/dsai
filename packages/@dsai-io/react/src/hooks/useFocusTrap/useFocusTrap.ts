/**
 * useFocusTrap Hook
 *
 * A React hook for trapping focus within a container element.
 * Essential for accessible modals, dialogs, and overlay components.
 *
 * Features:
 * - Tab and Shift+Tab cycle within container
 * - Auto-focus first focusable element on mount
 * - Restore focus to previously focused element on unmount
 * - Escape key callback support
 * - SSR-safe with isBrowser checks
 * - Manual activate/deactivate control
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const { containerRef, isActive } = useFocusTrap({
 *     enabled: isOpen,
 *     onEscape: onClose,
 *   });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { focusableSelectorString } from '../../utils/a11y/focusableSelectors';
import { trapFocus } from '../../utils/a11y/trapFocus';
import { isBrowser } from '../../utils/browser/isBrowser';
import { isEscapeKey } from '../../utils/keyboard';

import type { UseFocusTrapOptions, UseFocusTrapReturn } from './useFocusTrap.types';

/**
 * Check if an element is visible (handles JSDOM where offsetParent is always null)
 * @internal
 */
function isElementVisible(el: HTMLElement): boolean {
  // Check computed visibility first (works in both JSDOM and real browsers)
  const style = getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }

  // Check if the element is in the DOM
  if (!el.isConnected) {
    return false;
  }

  // In real browsers, offsetParent is null for hidden elements or elements with position: fixed
  // In JSDOM, offsetParent is always null, so we only use it as a hint
  // If offsetParent is not null, the element is definitely visible
  // If offsetParent is null, we can't be sure (could be JSDOM or fixed position)
  if (el.offsetParent !== null) {
    return true;
  }

  // For elements where offsetParent is null (JSDOM, fixed, sticky, or body):
  // Just trust the visibility check above
  return true;
}

/**
 * Get all focusable elements within a container
 * @internal
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(focusableSelectorString);
  return Array.from(elements).filter(isElementVisible);
}

/**
 * Store the previously active element when activating the trap.
 * @internal
 */
function storePreviousFocus(
  restoreFocus: boolean,
  previousActiveElement: { current: HTMLElement | null }
): void {
  if (restoreFocus && isBrowser() && !previousActiveElement.current) {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }
}

/**
 * Cleanup existing trap and restore focus to the appropriate element.
 * @internal
 */
function cleanupAndRestoreFocus(
  cleanupRef: { current: (() => void) | null },
  finalFocusRef: { current: HTMLElement | null } | undefined,
  previousActiveElement: { current: HTMLElement | null }
): void {
  if (cleanupRef.current) {
    cleanupRef.current();
    cleanupRef.current = null;
  }
  if (isBrowser()) {
    const elementToFocus = finalFocusRef?.current || previousActiveElement.current;
    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      elementToFocus.focus();
    }
    previousActiveElement.current = null;
  }
}

/**
 * useFocusTrap - Traps keyboard focus within a container element.
 *
 * This hook is essential for accessible modal dialogs, sheets, drawers,
 * and other overlay components that require focus to remain within them.
 *
 * @param options - Configuration options for the focus trap
 * @returns Object containing containerRef, activate/deactivate methods, and isActive state
 *
 * @example Basic usage with a modal
 * ```tsx
 * function Modal({ isOpen, onClose, children }) {
 *   const { containerRef } = useFocusTrap({
 *     enabled: isOpen,
 *     autoFocus: true,
 *     restoreFocus: true,
 *     onEscape: onClose,
 *   });
 *
 *   if (!isOpen) return null;
 *
 *   return (
 *     <div ref={containerRef} role="dialog" aria-modal="true">
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With custom initial focus
 * ```tsx
 * function Dialog({ isOpen }) {
 *   const confirmRef = useRef<HTMLButtonElement>(null);
 *   const { containerRef } = useFocusTrap({
 *     enabled: isOpen,
 *     initialFocusRef: confirmRef,
 *   });
 *
 *   return (
 *     <div ref={containerRef}>
 *       <button>Cancel</button>
 *       <button ref={confirmRef}>Confirm</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Manual control
 * ```tsx
 * function CustomOverlay() {
 *   const { containerRef, activate, deactivate, isActive } = useFocusTrap({
 *     enabled: false, // Start disabled
 *   });
 *
 *   return (
 *     <div>
 *       <button onClick={activate}>Open</button>
 *       <div ref={containerRef}>
 *         <p>Focus is {isActive ? 'trapped' : 'not trapped'}</p>
 *         <button onClick={deactivate}>Close</button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  options: UseFocusTrapOptions<T> = {}
): UseFocusTrapReturn<T> {
  const {
    enabled = true,
    autoFocus = true,
    restoreFocus = true,
    initialFocusRef,
    finalFocusRef,
    onEscape,
    initialFocusDelay = 0,
    containerRef: externalContainerRef,
  } = options;

  const internalContainerRef = useRef<T | null>(null);
  // Use external ref if provided, otherwise use internal ref
  const containerRef = externalContainerRef || internalContainerRef;
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(enabled);
  const cleanupRef = useRef<(() => void) | null>(null);
  const enabledRef = useRef(enabled);

  // Keep enabledRef in sync for use in callbacks
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  /**
   * Manually activate the focus trap
   */
  const activate = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    // Store the currently focused element for later restoration
    if (restoreFocus && !previousActiveElement.current) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    setIsActive(true);
  }, [restoreFocus]);

  /**
   * Manually deactivate the focus trap
   */
  const deactivate = useCallback(() => {
    if (!isBrowser()) {
      return;
    }

    // Cleanup any existing trap
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    setIsActive(false);

    // Restore focus to the appropriate element
    const elementToFocus = finalFocusRef?.current || previousActiveElement.current;
    if (elementToFocus && typeof elementToFocus.focus === 'function') {
      elementToFocus.focus();
    }

    // Clear the stored element
    previousActiveElement.current = null;
  }, [finalFocusRef]);

  // Sync isActive with enabled prop - using refs to avoid effect cascade
  useEffect(() => {
    setIsActive((current) => {
      if (enabled && !current) {
        storePreviousFocus(restoreFocus, previousActiveElement);
        return true;
      }
      if (!enabled && current) {
        cleanupAndRestoreFocus(cleanupRef, finalFocusRef, previousActiveElement);
        return false;
      }
      return current;
    });
  }, [enabled, restoreFocus, finalFocusRef]);

  // Set up focus trap when active
  useEffect(() => {
    if (!isActive || !isBrowser()) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Set up the focus trap (Tab key handling)
    cleanupRef.current = trapFocus(container);

    // Handle initial focus with optional delay
    const focusTimeoutId = globalThis.setTimeout(() => {
      // Use initialFocusRef if provided
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      // Otherwise, focus the first focusable element
      if (autoFocus) {
        const focusableElements = getFocusableElements(container);
        const firstFocusable = focusableElements[0];

        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          // If no focusable elements, make the container focusable and focus it
          if (!container.hasAttribute('tabindex')) {
            container.setAttribute('tabindex', '-1');
          }
          container.focus();
        }
      }
    }, initialFocusDelay);

    return () => {
      clearTimeout(focusTimeoutId);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isActive, autoFocus, initialFocusRef, initialFocusDelay, containerRef]);

  // Handle Escape key
  useEffect(() => {
    if (!isActive || !onEscape || !isBrowser()) {
      return;
    }

    const escapeCallback = onEscape;

    function handleKeyDown(event: KeyboardEvent): void {
      if (isEscapeKey(event)) {
        event.preventDefault();
        event.stopPropagation();
        escapeCallback();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onEscape]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return {
    containerRef,
    activate,
    deactivate,
    isActive,
  };
}

export default useFocusTrap;
