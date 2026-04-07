/**
 * announceToScreenReader - Send a message to a live region for screen readers.
 *
 * Uses an offscreen aria-live container. Supports polite (default) and assertive.
 * Returns a cleanup function to remove the announcement.
 *
 * @remarks
 * The utility creates a shared live region element keyed by `id`. When reusing an
 * existing container, it updates the `role`, `aria-live`, and `aria-atomic` attributes
 * to match the current call's options, ensuring assertive announcements remain assertive.
 *
 * @example
 * ```ts
 * // Polite announcement (default)
 * const cleanup = announceToScreenReader('Item saved successfully');
 *
 * // Assertive announcement using the boolean alias
 * const cleanup = announceToScreenReader('Critical error occurred', { assertive: true });
 *
 * // Assertive announcement using politeness option
 * const cleanup = announceToScreenReader('Critical error occurred', { politeness: 'assertive' });
 * ```
 *
 * @param message - The message to announce to screen readers
 * @param options - Configuration options for the announcement
 * @returns A cleanup function that clears the announcement and cancels any pending timeout
 */
export interface AnnounceOptions {
  /**
   * The politeness level of the announcement.
   * - 'polite': Waits for a pause in screen reader speech (default)
   * - 'assertive': Interrupts current speech immediately
   */
  readonly politeness?: 'polite' | 'assertive';
  /**
   * Convenience alias for `politeness: 'assertive'`.
   * When true, sets politeness to 'assertive'. If both `assertive` and `politeness`
   * are provided, `politeness` takes precedence.
   */
  readonly assertive?: boolean;
  /**
   * Unique ID for the live region element. Defaults to 'dsai-live-region'.
   * Use different IDs to create separate live regions for different announcement types.
   */
  readonly id?: string;
  /**
   * Duration in milliseconds before the announcement text is cleared.
   * Defaults to 2000ms.
   */
  readonly timeoutMs?: number;
}

export function announceToScreenReader(message: string, options: AnnounceOptions = {}): () => void {
  // SSR safety: early return if no document
  if (typeof document === 'undefined') {
    return () => {};
  }

  const {
    politeness: explicitPoliteness,
    assertive = false,
    id = 'dsai-live-region',
    timeoutMs = 2000,
  } = options;

  // Resolve politeness: explicit politeness takes precedence, then assertive boolean, then default
  const politeness: 'polite' | 'assertive' =
    explicitPoliteness ?? (assertive ? 'assertive' : 'polite');

  // Determine the appropriate role based on politeness
  const role = politeness === 'assertive' ? 'alert' : 'status';

  // Guard against document.body not being available (e.g., called before DOM is ready)
  const parentElement = document.body ?? document.documentElement;

  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    // Apply visually hidden styles
    container.style.position = 'absolute';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.margin = '-1px';
    container.style.border = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.clipPath = 'inset(50%)';
    parentElement.appendChild(container);
  }

  // Always update ARIA attributes to ensure correct behavior on reuse
  container.setAttribute('role', role);
  container.setAttribute('aria-live', politeness);
  container.setAttribute('aria-atomic', 'true');

  container.textContent = message;

  const timeoutId = globalThis.setTimeout(() => {
    if (container?.parentNode) {
      container.textContent = '';
    }
  }, timeoutMs);

  // Return cleanup function
  return () => {
    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
    }
    if (container?.parentNode) {
      container.textContent = '';
    }
  };
}

export default announceToScreenReader;
