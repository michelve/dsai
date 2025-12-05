/**
 * trapFocus - Creates a focus trap within a container element.
 *
 * Returns a cleanup function to remove listeners.
 * NOTE: Should be used sparingly; ensure escape/close affordance is present.
 */
export interface TrapFocusOptions {
  /**
   * CSS selectors to identify focusable elements inside the container.
   */
  focusableSelectors?: string[];
  /**
   * Optional handler when focus wraps (e.g., for analytics).
   */
  onWrap?: () => void;
}

const DEFAULT_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

export function trapFocus(container: HTMLElement, options: TrapFocusOptions = {}): () => void {
  const selectors = options.focusableSelectors ?? DEFAULT_SELECTORS;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    (el) => el.offsetParent !== null
  );

  if (focusable.length === 0) {
    return () => {};
  }

  // Safe to access since we checked length > 0
  const firstEl = focusable[0];
  if (!firstEl) {
    return () => {};
  }

  const lastEl = focusable[focusable.length - 1];
  if (!lastEl) {
    return () => {};
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    if (focusable.length === 1) {
      event.preventDefault();
      firstEl.focus();
      options.onWrap?.();
      return;
    }

    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
      options.onWrap?.();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
      options.onWrap?.();
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

export default trapFocus;
