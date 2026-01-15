/**
 * matchMedia Mock Utility
 *
 * Provides a robust mock implementation of window.matchMedia for testing
 * media query hooks. Supports listener management, query matching simulation,
 * and change event triggering.
 *
 * @example
 * ```ts
 * import { installMatchMediaMock, setMediaQueryMatcher, triggerMediaQueryChange } from '../__tests__/mocks';
 *
 * beforeAll(() => {
 *   installMatchMediaMock();
 * });
 *
 * it('updates when media query changes', () => {
 *   const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
 *   expect(result.current).toBe(false);
 *
 *   act(() => {
 *     triggerMediaQueryChange('(min-width: 768px)', true);
 *   });
 *
 *   expect(result.current).toBe(true);
 * });
 * ```
 */

/**
 * Mock implementation of MediaQueryList
 */
interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((event: MediaQueryListEvent) => void) | null;
  addListener: (callback: (event: MediaQueryListEvent) => void) => void;
  removeListener: (callback: (event: MediaQueryListEvent) => void) => void;
  addEventListener: (type: string, callback: (event: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, callback: (event: MediaQueryListEvent) => void) => void;
  dispatchEvent: (event: Event) => boolean;
}

/**
 * Function that determines if a media query should match
 */
type MediaQueryMatcher = (query: string) => boolean;

/**
 * Global state for the mock
 */
let currentMatcher: MediaQueryMatcher = () => false;
const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>();

/**
 * Creates a mock matchMedia implementation.
 *
 * @returns Mock matchMedia function
 */
export function createMatchMediaMock() {
  const mockMatchMedia = jest.fn((query: string): MockMediaQueryList => {
    const matches = currentMatcher(query);

    if (!listeners.has(query)) {
      listeners.set(query, new Set());
    }

    return {
      matches,
      media: query,
      onchange: null,
      addListener: (callback) => listeners.get(query)?.add(callback),
      removeListener: (callback) => listeners.get(query)?.delete(callback),
      addEventListener: (type, callback) => {
        if (type === 'change') {
          listeners.get(query)?.add(callback);
        }
      },
      removeEventListener: (type, callback) => {
        if (type === 'change') {
          listeners.get(query)?.delete(callback);
        }
      },
      dispatchEvent: () => true,
    };
  });

  return mockMatchMedia;
}

/**
 * Sets which media queries should match.
 *
 * Use this to control which media queries return `matches: true`.
 *
 * @param matcher - Function that returns true if a query should match
 *
 * @example
 * ```ts
 * // Match queries for mobile viewports
 * setMediaQueryMatcher((query) => query.includes('max-width: 767'));
 *
 * // Match by breakpoint
 * setMediaQueryMatcher((query) => query === '(min-width: 768px)');
 *
 * // Match dark mode preference
 * setMediaQueryMatcher((query) => query.includes('prefers-color-scheme: dark'));
 * ```
 */
export function setMediaQueryMatcher(matcher: MediaQueryMatcher): void {
  currentMatcher = matcher;
}

/**
 * Simulates a media query change event.
 *
 * Triggers all registered listeners for a specific media query with a new match status.
 * Use this to simulate viewport changes, orientation changes, or preference changes.
 *
 * @param query - The media query string (e.g., "(min-width: 768px)")
 * @param matches - Whether the query should now match
 *
 * @example
 * ```ts
 * // Simulate viewport resize to desktop
 * act(() => {
 *   triggerMediaQueryChange('(min-width: 992px)', true);
 * });
 *
 * // Simulate switching to dark mode
 * act(() => {
 *   triggerMediaQueryChange('(prefers-color-scheme: dark)', true);
 * });
 * ```
 */
export function triggerMediaQueryChange(query: string, matches: boolean): void {
  const queryListeners = listeners.get(query);
  if (queryListeners) {
    const event = { matches, media: query } as MediaQueryListEvent;
    queryListeners.forEach((callback) => {
      callback(event);
    });
  }
}

/**
 * Clears all listeners and resets the matcher to default.
 *
 * Call this in `beforeEach` or `afterEach` to prevent test pollution.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   resetMatchMediaMock();
 * });
 * ```
 */
export function resetMatchMediaMock(): void {
  currentMatcher = () => false;
  listeners.clear();
}

/**
 * Installs the matchMedia mock on the global window object.
 *
 * Call this once in a `beforeAll` hook to set up the mock for all tests.
 * The mock is already installed in the global test setup, so you typically
 * don't need to call this manually unless you're writing isolated tests.
 *
 * @example
 * ```ts
 * beforeAll(() => {
 *   installMatchMediaMock();
 * });
 * ```
 */
export function installMatchMediaMock(): void {
  // Only install if not already installed to prevent redefinition errors
  if (!window.matchMedia || typeof window.matchMedia !== 'function') {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: createMatchMediaMock(),
    });
  }
}
