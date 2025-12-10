/**
 * announceToScreenReader - Send a message to a live region for screen readers.
 *
 * Uses an offscreen aria-live container. Supports polite (default) and assertive.
 * Returns a cleanup function to remove the announcement.
 */
export interface AnnounceOptions {
  readonly politeness?: 'polite' | 'assertive';
  readonly id?: string;
  readonly timeoutMs?: number;
}

export function announceToScreenReader(message: string, options: AnnounceOptions = {}): () => void {
  // SSR safety: early return if no document
  if (typeof document === 'undefined') {
    return () => {};
  }

  const { politeness = 'polite', id = 'dsai-live-region', timeoutMs = 2000 } = options;

  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.setAttribute('aria-live', politeness);
    container.setAttribute('aria-atomic', 'true');
    container.style.position = 'absolute';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.margin = '-1px';
    container.style.border = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.clip = 'rect(0 0 0 0)';
    document.body.appendChild(container);
  }

  container.textContent = message;

  const timeoutId = window.setTimeout(() => {
    if (container?.parentNode) {
      container.textContent = '';
    }
  }, timeoutMs);

  // Return cleanup function
  return () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    if (container?.parentNode) {
      container.textContent = '';
    }
  };
}

export default announceToScreenReader;
