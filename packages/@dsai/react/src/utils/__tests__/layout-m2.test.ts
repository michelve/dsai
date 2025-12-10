/**
 * @file Layout utilities tests (M2.6)
 * @module @dsai/react/utils/__tests__/layout-m2.test
 *
 * Comprehensive tests for M2.6 layout utilities:
 * - getElementBounds, boundsIntersect, isInViewport
 * - getViewportSize, getDocumentSize, getScrollProgress
 * - observeResize, observeResizeMany
 * - scheduleFrame, scheduleFrameAfter, startLoop
 * - throttleFrame, rafThrottle
 */

// Mock isBrowser to return true for tests - mock all locations where it might be imported
jest.mock('../browser/isBrowser', () => ({
  isBrowser: jest.fn(() => true),
  default: jest.fn(() => true),
}));

import {
  boundsIntersect,
  getDocumentSize,
  getElementBounds,
  getScrollProgress,
  getViewportSize,
  isInViewport,
  observeResize,
  observeResizeMany,
  rafThrottle,
  scheduleFrame,
  scheduleFrameAfter,
  startLoop,
  throttleFrame,
} from '../layout';

import type { ElementBounds, FrameInfo } from '../layout';

// Mock requestAnimationFrame for tests
const originalRAF = global.requestAnimationFrame;
const originalCAF = global.cancelAnimationFrame;

let rafCallbacks: Array<{ id: number; callback: FrameCallback }> = [];
let rafId = 0;

type FrameCallback = (timestamp: number) => void;

function mockRAF(callback: FrameCallback): number {
  rafId++;
  rafCallbacks.push({ id: rafId, callback });
  return rafId;
}

function mockCAF(id: number): void {
  rafCallbacks = rafCallbacks.filter((item) => item.id !== id);
}

function flushRAF(timestamp = 16.67): void {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  for (const { callback } of callbacks) {
    callback(timestamp);
  }
}

// Mock ResizeObserver
class MockResizeObserver {
  private static instances: MockResizeObserver[] = [];
  private callback: ResizeObserverCallback;
  private elements: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe(element: Element): void {
    this.elements.push(element);
  }

  unobserve(element: Element): void {
    this.elements = this.elements.filter((el) => el !== element);
  }

  disconnect(): void {
    this.elements = [];
  }

  static triggerResize(element: Element, width: number, height: number): void {
    for (const instance of MockResizeObserver.instances) {
      if (instance.elements.includes(element)) {
        const entry: ResizeObserverEntry = {
          target: element,
          contentRect: {
            width,
            height,
            top: 0,
            left: 0,
            bottom: height,
            right: width,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          },
          borderBoxSize: [{ inlineSize: width, blockSize: height }],
          contentBoxSize: [{ inlineSize: width, blockSize: height }],
          devicePixelContentBoxSize: [],
        };
        instance.callback([entry], instance as unknown as ResizeObserver);
      }
    }
  }

  static clearInstances(): void {
    MockResizeObserver.instances = [];
  }
}

beforeEach(() => {
  rafCallbacks = [];
  rafId = 0;
  global.requestAnimationFrame = mockRAF;
  global.cancelAnimationFrame = mockCAF;
  // Also mock on window for browser-like environments
  window.requestAnimationFrame = mockRAF;
  window.cancelAnimationFrame = mockCAF;
  // Mock ResizeObserver for testing
  (global as Record<string, unknown>).ResizeObserver = MockResizeObserver;
  MockResizeObserver.clearInstances();
});

afterEach(() => {
  global.requestAnimationFrame = originalRAF;
  global.cancelAnimationFrame = originalCAF;
  window.requestAnimationFrame = originalRAF;
  window.cancelAnimationFrame = originalCAF;
});

describe('getElementBounds', () => {
  // Mock element for testing
  function createMockElement(rect: Partial<DOMRect> = {}): Element {
    const defaultRect: DOMRect = {
      top: 100,
      left: 50,
      right: 250,
      bottom: 200,
      width: 200,
      height: 100,
      x: 50,
      y: 100,
      toJSON: () => ({}),
    };

    return {
      getBoundingClientRect: () => ({ ...defaultRect, ...rect }),
    } as Element;
  }

  it('returns correct bounds for an element', () => {
    const element = createMockElement();
    const bounds = getElementBounds(element);

    expect(bounds).not.toBeNull();
    expect(bounds?.top).toBe(100);
    expect(bounds?.left).toBe(50);
    expect(bounds?.width).toBe(200);
    expect(bounds?.height).toBe(100);
  });

  it('calculates center point correctly', () => {
    const element = createMockElement({
      left: 0,
      top: 0,
      width: 100,
      height: 50,
      right: 100,
      bottom: 50,
    });
    const bounds = getElementBounds(element);

    expect(bounds?.centerX).toBe(50);
    expect(bounds?.centerY).toBe(25);
  });

  it('includes scroll offset in absolute positions', () => {
    // Mock window.scrollX and scrollY
    Object.defineProperty(window, 'scrollX', { value: 100, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });

    const element = createMockElement({ top: 50, left: 30 });
    const bounds = getElementBounds(element);

    expect(bounds?.absoluteTop).toBe(250); // 50 + 200
    expect(bounds?.absoluteLeft).toBe(130); // 30 + 100

    // Reset
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('excludes scroll offset when option is false', () => {
    Object.defineProperty(window, 'scrollX', { value: 100, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });

    const element = createMockElement({ top: 50, left: 30 });
    const bounds = getElementBounds(element, { includeScrollOffset: false });

    expect(bounds?.absoluteTop).toBe(50);
    expect(bounds?.absoluteLeft).toBe(30);

    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('returns null for null element', () => {
    const bounds = getElementBounds(null);
    expect(bounds).toBeNull();
  });

  it('returns null for undefined element', () => {
    const bounds = getElementBounds(undefined);
    expect(bounds).toBeNull();
  });

  it('returns null for element without getBoundingClientRect', () => {
    const element = {} as Element;
    const bounds = getElementBounds(element);
    expect(bounds).toBeNull();
  });
});

describe('boundsIntersect', () => {
  const boundsA: ElementBounds = {
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    centerX: 50,
    centerY: 50,
    absoluteTop: 0,
    absoluteLeft: 0,
  };

  it('returns true for overlapping bounds', () => {
    const boundsB: ElementBounds = {
      top: 50,
      left: 50,
      right: 150,
      bottom: 150,
      width: 100,
      height: 100,
      centerX: 100,
      centerY: 100,
      absoluteTop: 50,
      absoluteLeft: 50,
    };

    expect(boundsIntersect(boundsA, boundsB)).toBe(true);
  });

  it('returns true for fully contained bounds', () => {
    const boundsB: ElementBounds = {
      top: 25,
      left: 25,
      right: 75,
      bottom: 75,
      width: 50,
      height: 50,
      centerX: 50,
      centerY: 50,
      absoluteTop: 25,
      absoluteLeft: 25,
    };

    expect(boundsIntersect(boundsA, boundsB)).toBe(true);
  });

  it('returns false for non-overlapping bounds (right)', () => {
    const boundsB: ElementBounds = {
      top: 0,
      left: 101,
      right: 200,
      bottom: 100,
      width: 99,
      height: 100,
      centerX: 150.5,
      centerY: 50,
      absoluteTop: 0,
      absoluteLeft: 101,
    };

    expect(boundsIntersect(boundsA, boundsB)).toBe(false);
  });

  it('returns false for non-overlapping bounds (bottom)', () => {
    const boundsB: ElementBounds = {
      top: 101,
      left: 0,
      right: 100,
      bottom: 200,
      width: 100,
      height: 99,
      centerX: 50,
      centerY: 150.5,
      absoluteTop: 101,
      absoluteLeft: 0,
    };

    expect(boundsIntersect(boundsA, boundsB)).toBe(false);
  });

  it('returns false for touching edges (not intersecting)', () => {
    const boundsB: ElementBounds = {
      top: 0,
      left: 100,
      right: 200,
      bottom: 100,
      width: 100,
      height: 100,
      centerX: 150,
      centerY: 50,
      absoluteTop: 0,
      absoluteLeft: 100,
    };

    // Edges touching - not intersecting
    expect(boundsIntersect(boundsA, boundsB)).toBe(false);
  });
});

describe('isInViewport', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
  });

  it('returns true for fully visible element', () => {
    const bounds: ElementBounds = {
      top: 100,
      left: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200,
      centerX: 200,
      centerY: 200,
      absoluteTop: 100,
      absoluteLeft: 100,
    };

    expect(isInViewport(bounds)).toBe(true);
    expect(isInViewport(bounds, 1)).toBe(true);
  });

  it('returns true for partially visible element above threshold', () => {
    const bounds: ElementBounds = {
      top: -50,
      left: 100,
      right: 300,
      bottom: 150,
      width: 200,
      height: 200,
      centerX: 200,
      centerY: 50,
      absoluteTop: -50,
      absoluteLeft: 100,
    };

    // 75% visible
    expect(isInViewport(bounds, 0.5)).toBe(true);
    expect(isInViewport(bounds, 0.75)).toBe(true);
  });

  it('returns false for element below threshold', () => {
    const bounds: ElementBounds = {
      top: -150,
      left: 100,
      right: 300,
      bottom: 50,
      width: 200,
      height: 200,
      centerX: 200,
      centerY: -50,
      absoluteTop: -150,
      absoluteLeft: 100,
    };

    // 25% visible
    expect(isInViewport(bounds, 0.5)).toBe(false);
  });

  it('returns false for element completely outside viewport', () => {
    const bounds: ElementBounds = {
      top: -300,
      left: 100,
      right: 300,
      bottom: -100,
      width: 200,
      height: 200,
      centerX: 200,
      centerY: -200,
      absoluteTop: -300,
      absoluteLeft: 100,
    };

    expect(isInViewport(bounds)).toBe(false);
  });

  it('returns false for zero-area element', () => {
    const bounds: ElementBounds = {
      top: 100,
      left: 100,
      right: 100,
      bottom: 100,
      width: 0,
      height: 0,
      centerX: 100,
      centerY: 100,
      absoluteTop: 100,
      absoluteLeft: 100,
    };

    expect(isInViewport(bounds)).toBe(false);
  });
});

describe('getViewportSize', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 1905,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 1080,
      writable: true,
    });
  });

  it('returns viewport dimensions', () => {
    const viewport = getViewportSize();

    expect(viewport.width).toBe(1920);
    expect(viewport.height).toBe(1080);
  });

  it('returns client dimensions (excluding scrollbar)', () => {
    const viewport = getViewportSize();

    expect(viewport.clientWidth).toBe(1905);
    expect(viewport.clientHeight).toBe(1080);
  });

  it('calculates aspect ratio', () => {
    const viewport = getViewportSize();

    expect(viewport.aspectRatio).toBeCloseTo(1920 / 1080, 2);
  });

  it('detects landscape orientation', () => {
    const viewport = getViewportSize();

    expect(viewport.isLandscape).toBe(true);
    expect(viewport.isPortrait).toBe(false);
  });

  it('detects portrait orientation', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1024, writable: true });

    const viewport = getViewportSize();

    expect(viewport.isPortrait).toBe(true);
    expect(viewport.isLandscape).toBe(false);
  });
});

describe('getDocumentSize', () => {
  it('returns document dimensions', () => {
    Object.defineProperty(document.documentElement, 'scrollWidth', {
      value: 1920,
      writable: true,
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      writable: true,
    });
    Object.defineProperty(document.body, 'scrollWidth', { value: 1920, writable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 5000, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 1000, writable: true });

    const docSize = getDocumentSize();

    expect(docSize).not.toBeNull();
    expect(docSize?.scrollTop).toBe(1000);
    expect(docSize?.maxScrollY).toBeGreaterThan(0);
  });
});

describe('getScrollProgress', () => {
  it('returns 0 when at top', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

    const progress = getScrollProgress();
    expect(progress).toBe(0);
  });
});

describe('observeResize', () => {
  it('calls callback when element resizes', () => {
    const element = document.createElement('div');
    const callback = jest.fn();

    observeResize(element, callback);

    MockResizeObserver.triggerResize(element, 200, 100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        target: element,
        width: 200,
        height: 100,
      })
    );
  });

  it('returns cleanup function that stops observation', () => {
    const element = document.createElement('div');
    const callback = jest.fn();

    const cleanup = observeResize(element, callback);
    cleanup();

    // Trigger should not call callback after cleanup
    MockResizeObserver.triggerResize(element, 300, 200);

    // The disconnect was called, so the instance won't find the element
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('debounces callback when debounce option is set', () => {
    const element = document.createElement('div');
    const callback = jest.fn();

    // Use fake timers for this specific test
    jest.useFakeTimers();

    observeResize(element, callback, { debounce: 100 });

    // Trigger multiple resizes
    MockResizeObserver.triggerResize(element, 200, 100);
    MockResizeObserver.triggerResize(element, 250, 150);
    MockResizeObserver.triggerResize(element, 300, 200);

    // Should not be called yet
    expect(callback).toHaveBeenCalledTimes(0);

    // Fast forward time
    jest.advanceTimersByTime(100);

    // Should be called once with last values
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 300,
        height: 200,
      })
    );

    // Restore real timers
    jest.useRealTimers();
  });

  it('returns no-op cleanup for null element', () => {
    const callback = jest.fn();
    const cleanup = observeResize(null, callback);

    expect(typeof cleanup).toBe('function');
    expect(() => cleanup()).not.toThrow();
  });
});

describe('observeResizeMany', () => {
  it('observes multiple elements', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const callback = jest.fn();

    observeResizeMany([element1, element2], callback);

    MockResizeObserver.triggerResize(element1, 100, 50);
    MockResizeObserver.triggerResize(element2, 200, 100);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('cleanup stops all observations', () => {
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const callback = jest.fn();

    const cleanup = observeResizeMany([element1, element2], callback);
    cleanup();

    MockResizeObserver.triggerResize(element1, 100, 50);
    MockResizeObserver.triggerResize(element2, 200, 100);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('handles null elements in array', () => {
    const element = document.createElement('div');
    const callback = jest.fn();

    const cleanup = observeResizeMany([element, null, undefined], callback);

    expect(typeof cleanup).toBe('function');
  });
});

describe('scheduleFrame', () => {
  it('schedules callback on next animation frame', () => {
    const callback = jest.fn();

    scheduleFrame(callback);

    expect(callback).not.toHaveBeenCalled();

    flushRAF(16.67);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        timestamp: expect.any(Number),
        elapsedTime: expect.any(Number),
        frameCount: 1,
      })
    );
  });

  it('can be cancelled', () => {
    const callback = jest.fn();

    const cancel = scheduleFrame(callback);
    cancel();

    flushRAF(16.67);

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('scheduleFrameAfter', () => {
  it('waits specified number of frames', () => {
    const callback = jest.fn();

    scheduleFrameAfter(callback, 3);

    // Frame 1
    flushRAF(16.67);
    expect(callback).not.toHaveBeenCalled();

    // Frame 2
    flushRAF(33.34);
    expect(callback).not.toHaveBeenCalled();

    // Frame 3
    flushRAF(50.01);
    expect(callback).not.toHaveBeenCalled();

    // Frame 4 - callback should execute
    flushRAF(66.68);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('executes immediately if delay is 0', () => {
    const callback = jest.fn();

    scheduleFrameAfter(callback, 0);
    flushRAF(16.67);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('startLoop', () => {
  it('runs continuously until stopped', () => {
    const callback = jest.fn().mockReturnValue(true);

    const stop = startLoop(callback);

    flushRAF(16.67);
    flushRAF(33.34);
    flushRAF(50.01);

    expect(callback).toHaveBeenCalledTimes(3);

    stop();
    flushRAF(66.68);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('stops when callback returns false', () => {
    let frameCount = 0;
    const callback = jest.fn(() => {
      frameCount++;
      return frameCount < 3;
    });

    startLoop(callback);

    flushRAF(16.67);
    flushRAF(33.34);
    flushRAF(50.01);
    flushRAF(66.68);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('provides delta time between frames', () => {
    const frames: FrameInfo[] = [];
    const callback = jest.fn((info: FrameInfo) => {
      frames.push(info);
      return frames.length < 3;
    });

    startLoop(callback);

    flushRAF(0);
    flushRAF(16.67);
    flushRAF(33.34);

    expect(frames.length).toBe(3);
    expect(frames[0]?.frameCount).toBe(1);
    expect(frames[1]?.frameCount).toBe(2);
    expect(frames[2]?.frameCount).toBe(3);
  });
});

describe('throttleFrame', () => {
  it('throttles function to one call per frame', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn);

    throttled(1);
    throttled(2);
    throttled(3);

    // Leading call should execute
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    flushRAF(16.67);

    // Trailing call should execute with last args
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it('can be cancelled', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false });

    throttled(1);
    throttled.cancel();

    flushRAF(16.67);

    expect(fn).not.toHaveBeenCalled();
  });

  it('can be flushed', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false });

    throttled(1);
    throttled(2);
    throttled.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it('reports pending state', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false });

    expect(throttled.pending).toBe(false);

    throttled(1);
    expect(throttled.pending).toBe(true);

    flushRAF(16.67);
    expect(throttled.pending).toBe(false);
  });

  it('respects leading: false option', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false });

    throttled(1);
    expect(fn).not.toHaveBeenCalled();

    flushRAF(16.67);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it('respects trailing: false option', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { trailing: false });

    throttled(1);
    throttled(2);
    throttled(3);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    flushRAF(16.67);

    // No trailing call
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('rafThrottle', () => {
  it('throttles to animation frame', () => {
    const fn = jest.fn();
    const throttled = rafThrottle(fn);

    throttled(1);
    throttled(2);
    throttled(3);

    expect(fn).not.toHaveBeenCalled();

    flushRAF(16.67);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
  });

  it('allows next call after frame', () => {
    const fn = jest.fn();
    const throttled = rafThrottle(fn);

    throttled(1);
    flushRAF(16.67);

    throttled(2);
    flushRAF(33.34);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
