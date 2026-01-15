/**
 * SSR Mock Utilities
 *
 * Utilities for testing hooks in SSR (Server-Side Rendering) scenarios
 * where window and document are undefined.
 *
 * @example
 * ```ts
 * import { describeSSR, withSSR } from '../__tests__/mocks';
 *
 * describeSSR('useMediaQuery SSR', () => {
 *   it('returns default value during SSR', () => {
 *     const { result } = renderHook(() =>
 *       useMediaQuery('(min-width: 768px)', { defaultValue: true })
 *     );
 *     expect(result.current).toBe(true);
 *   });
 * });
 * ```
 */

/**
 * Store original globals
 */
const originalWindow = global.window;
const originalDocument = global.document;

/**
 * Simulates SSR environment by removing window and document.
 *
 * Use this to test that hooks don't crash when window/document are undefined.
 * Always call `exitSSRMode()` after testing to restore the environment.
 *
 * @example
 * ```ts
 * it('handles SSR gracefully', () => {
 *   enterSSRMode();
 *
 *   const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
 *
 *   expect(result.current).toBe(false);
 *
 *   exitSSRMode();
 * });
 * ```
 */
export function enterSSRMode(): void {
  // @ts-expect-error - Intentionally removing window for SSR simulation
  delete global.window;
  // @ts-expect-error - Intentionally removing document for SSR simulation
  delete global.document;
}

/**
 * Restores browser environment after SSR simulation.
 *
 * Call this to restore window and document after calling `enterSSRMode()`.
 *
 * @example
 * ```ts
 * afterEach(() => {
 *   exitSSRMode();
 * });
 * ```
 */
export function exitSSRMode(): void {
  global.window = originalWindow;
  global.document = originalDocument;
}

/**
 * Runs a test function in SSR mode.
 *
 * Automatically handles entering and exiting SSR mode, even if the function throws.
 *
 * @param fn - The test function to run in SSR mode
 * @returns The return value of the test function
 *
 * @example
 * ```ts
 * it('returns default value in SSR', () => {
 *   const result = withSSR(() => {
 *     const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
 *     return result.current;
 *   });
 *
 *   expect(result).toBe(false);
 * });
 * ```
 */
export function withSSR<T>(fn: () => T): T {
  enterSSRMode();
  try {
    return fn();
  } finally {
    exitSSRMode();
  }
}

/**
 * Jest helper to run a describe block in SSR mode.
 *
 * All tests within this block will run with window and document undefined,
 * simulating a server-side rendering environment.
 *
 * @param name - The name of the test suite
 * @param fn - The test suite function
 *
 * @example
 * ```ts
 * describeSSR('useMediaQuery in SSR', () => {
 *   it('returns default value', () => {
 *     const { result } = renderHook(() =>
 *       useMediaQuery('(min-width: 768px)', { defaultValue: true })
 *     );
 *     expect(result.current).toBe(true);
 *   });
 *
 *   it('does not crash', () => {
 *     expect(() => {
 *       renderHook(() => useMediaQuery('(min-width: 768px)'));
 *     }).not.toThrow();
 *   });
 * });
 * ```
 */
export function describeSSR(name: string, fn: () => void): void {
  describe(name, () => {
    beforeEach(enterSSRMode);
    afterEach(exitSSRMode);
    fn();
  });
}

/**
 * Checks if we're currently in a browser environment.
 *
 * This is the same check that hooks should use internally to determine
 * if they're running on the server or client.
 *
 * @returns `true` if window is defined, `false` otherwise
 *
 * @example
 * ```ts
 * it('correctly detects SSR mode', () => {
 *   expect(isBrowser()).toBe(true);
 *
 *   enterSSRMode();
 *   expect(isBrowser()).toBe(false);
 *
 *   exitSSRMode();
 *   expect(isBrowser()).toBe(true);
 * });
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
