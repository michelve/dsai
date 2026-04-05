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
  readonly focusableSelectors?: readonly string[];
  /**
   * Optional handler when focus wraps (e.g., for analytics).
   */
  readonly onWrap?: () => void;
  /**
   * Optional handler when Escape key is pressed to close the trap.
   */
  readonly onEscape?: () => void;
  /**
   * Whether to focus the first focusable element on mount.
   * @default false
   */
  readonly initialFocus?: boolean;
}

const DEFAULT_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
];

/**
 * Check if an element is visible (handles JSDOM where offsetParent is always null)
 * @internal
 */
function isElementVisible(el: HTMLElement): boolean {
  // SSR safety: if we somehow get here without a window, assume visible
  if (typeof window === 'undefined') {
    return true;
  }
  const style = getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }
  if (!el.isConnected) {
    return false;
  }
  // In JSDOM, offsetParent is always null, so we only use it as a positive signal
  return true;
}

/** No-op cleanup function for early returns. */
const noopCleanup = (): void => {};

/**
 * Handle Tab key wrapping between first and last focusable elements.
 */
function handleTabWrap(
  event: KeyboardEvent,
  firstEl: HTMLElement,
  lastEl: HTMLElement,
  focusableCount: number,
  onWrap?: () => void
): void {
  if (focusableCount === 1) {
    event.preventDefault();
    firstEl.focus();
    onWrap?.();
    return;
  }

  if (event.shiftKey && document.activeElement === firstEl) {
    event.preventDefault();
    lastEl.focus();
    onWrap?.();
  } else if (!event.shiftKey && document.activeElement === lastEl) {
    event.preventDefault();
    firstEl.focus();
    onWrap?.();
  }
}

export function trapFocus(container: HTMLElement, options: TrapFocusOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return noopCleanup;
  }

  if (!container || !(container instanceof HTMLElement)) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[trapFocus] Invalid container element provided');
    }
    return noopCleanup;
  }

  const selectors = options.focusableSelectors ?? DEFAULT_SELECTORS;
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    isElementVisible
  );

  if (focusable.length === 0) {
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[trapFocus] No focusable elements found in container');
    }
    return noopCleanup;
  }

  const firstEl = focusable[0] as HTMLElement;
  const lastEl = focusable[focusable.length - 1] as HTMLElement;
  if (!firstEl || !lastEl) {
    return noopCleanup;
  }

  if (options.initialFocus) {
    firstEl.focus();
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && options.onEscape) {
      event.preventDefault();
      options.onEscape();
      return;
    }

    if (event.key === 'Tab') {
      handleTabWrap(event, firstEl, lastEl, focusable.length, options.onWrap);
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

export default trapFocus;
