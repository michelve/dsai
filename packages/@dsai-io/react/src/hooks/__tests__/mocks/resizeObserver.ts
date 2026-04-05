/**
 * ResizeObserver Mock Utility
 *
 * Provides a mock implementation of the ResizeObserver API for testing
 * hooks that observe element size changes.
 *
 * @example
 * ```ts
 * import { createResizeObserverMock, triggerResize } from '../__tests__/mocks';
 *
 * it('responds to element resize', () => {
 *   const element = document.createElement('div');
 *   const { result } = renderHook(() => useElementSize(element));
 *
 *   act(() => {
 *     triggerResize(element, { width: 500, height: 300 });
 *   });
 *
 *   expect(result.current.width).toBe(500);
 *   expect(result.current.height).toBe(300);
 * });
 * ```
 */

/**
 * Observed elements and their callbacks
 */
const observedElements = new Map<Element, ResizeObserverCallback>();

/**
 * Mock implementation of ResizeObserver
 */
export class MockResizeObserver implements ResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  /**
   * Start observing an element
   */
  observe(target: Element): void {
    observedElements.set(target, this.callback);
  }

  /**
   * Stop observing an element
   */
  unobserve(target: Element): void {
    observedElements.delete(target);
  }

  /**
   * Stop observing all elements
   */
  disconnect(): void {
    observedElements.clear();
  }
}

/**
 * Creates a ResizeObserver mock.
 *
 * @returns Mock ResizeObserver class
 */
export function createResizeObserverMock(): typeof ResizeObserver {
  return MockResizeObserver as unknown as typeof ResizeObserver;
}

/**
 * Triggers a resize event for an element.
 *
 * @param target - The element to trigger resize for
 * @param size - The new size of the element
 * @param size.width - New width in pixels
 * @param size.height - New height in pixels
 *
 * @example
 * ```ts
 * const element = document.createElement('div');
 *
 * act(() => {
 *   triggerResize(element, { width: 1024, height: 768 });
 * });
 * ```
 */
export function triggerResize(target: Element, size: { width: number; height: number }): void {
  const callback = observedElements.get(target);
  if (!callback) {
    console.warn('Element is not being observed by ResizeObserver');
    return;
  }

  const entry: ResizeObserverEntry = {
    target,
    contentRect: {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      top: 0,
      right: size.width,
      bottom: size.height,
      left: 0,
      toJSON: () => ({}),
    },
    borderBoxSize: [
      {
        blockSize: size.height,
        inlineSize: size.width,
      },
    ],
    contentBoxSize: [
      {
        blockSize: size.height,
        inlineSize: size.width,
      },
    ],
    devicePixelContentBoxSize: [
      {
        blockSize: size.height,
        inlineSize: size.width,
      },
    ],
  };

  callback([entry], MockResizeObserver.prototype as unknown as ResizeObserver);
}

/**
 * Resets the ResizeObserver mock state.
 *
 * Call this in `beforeEach` or `afterEach` to prevent test pollution.
 *
 * @example
 * ```ts
 * beforeEach(() => {
 *   resetResizeObserverMock();
 * });
 * ```
 */
export function resetResizeObserverMock(): void {
  observedElements.clear();
}

/**
 * Installs the ResizeObserver mock on the global object.
 *
 * Call this once in a `beforeAll` hook to set up the mock for all tests.
 * The mock is already installed in the global test setup, so you typically
 * don't need to call this manually unless you're writing isolated tests.
 *
 * @example
 * ```ts
 * beforeAll(() => {
 *   installResizeObserverMock();
 * });
 * ```
 */
export function installResizeObserverMock(): void {
  (global as typeof globalThis & { ResizeObserver: unknown }).ResizeObserver =
    createResizeObserverMock();
}
