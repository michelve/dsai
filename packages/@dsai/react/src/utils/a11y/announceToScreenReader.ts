/**
 * announceToScreenReader - Send a message to a live region for screen readers.
 *
 * Uses an offscreen aria-live container. Supports polite (default) and assertive.
 * Cleans up the node automatically after the message is announced.
 */
export interface AnnounceOptions {
  politeness?: 'polite' | 'assertive';
  id?: string;
  timeoutMs?: number;
}

export function announceToScreenReader(message: string, options: AnnounceOptions = {}): void {
  if (typeof document === 'undefined') {
    return;
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

  window.setTimeout(() => {
    if (container?.parentNode) {
      container.textContent = '';
    }
  }, timeoutMs);
}

export default announceToScreenReader;
