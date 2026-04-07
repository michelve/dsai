/**
 * isBrowser - Guards code paths that require DOM APIs.
 *
 * Checks for both window and document objects to ensure full DOM availability.
 * More strict than window-only check for SSR safety.
 *
 * @returns true if running in a browser, false otherwise (e.g., Node.js, SSR)
 *
 * @example
 * ```tsx
 * if (isBrowser()) {
 *   document.addEventListener('click', handler);
 * }
 * ```
 */
export function isBrowser(): boolean {
  return globalThis.window !== undefined && globalThis.document !== undefined;
}

export default isBrowser;
