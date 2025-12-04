/**
 * isBrowser - Guards code paths that require DOM APIs.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export default isBrowser;
