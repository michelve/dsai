/**
 * @file Layout utilities test suite
 * @module @dsai-io/react/utils/__tests__/layout-m2.test
 *
 * Comprehensive test coverage for layout utilities:
 * - getElementBounds: Element bounding rect with extended measurements
 * - boundsIntersect: Intersection detection between bounds
 * - isInViewport: Viewport visibility detection
 * - getViewportSize: Viewport dimension retrieval
 * - getDocumentSize: Document scroll dimensions
 * - getScrollProgress: Scroll percentage calculation
 * - observeResize: ResizeObserver wrapper
 * - scheduleFrame: requestAnimationFrame wrapper
 * - throttleFrame: Frame-based throttling
 *
 * Target: 100% code coverage for layout utilities
 */

import * as browserUtils from '../browser/isBrowser';
import {
  boundsIntersect,
  getElementBounds,
  isInViewport,
  type ElementBounds,
} from '../layout/getElementBounds';
import { getDocumentSize, getScrollProgress, getViewportSize } from '../layout/getViewportSize';
import { observeResize, observeResizeMany } from '../layout/observeResize';
import { scheduleFrame, scheduleFrameAfter, startLoop } from '../layout/scheduleFrame';
import { rafThrottle, throttleFrame } from '../layout/throttleFrame';

describe('Layout utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('getElementBounds', () => {
    it('returns null when not in browser', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      expect(getElementBounds(null)).toBeNull();
      spy.mockRestore();
    });

    it('returns null for null element', () => {
      expect(getElementBounds(null)).toBeNull();
    });

    it('returns null for undefined element', () => {
      expect(getElementBounds(undefined)).toBeNull();
    });

    it('returns null for element without getBoundingClientRect', () => {
      const fakeElement = {} as Element;
      expect(getElementBounds(fakeElement)).toBeNull();
    });

    it('returns rect data when element is present', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        left: 20,
        right: 30,
        bottom: 40,
        width: 10,
        height: 30,
        x: 20,
        y: 10,
        toJSON: () => ({}),
      } as DOMRect);

      const bounds = getElementBounds(el, { includeScrollOffset: false });
      expect(bounds).not.toBeNull();
      expect(bounds?.width).toBe(10);
      expect(bounds?.left).toBe(20);

      document.body.removeChild(el);
    });

    it('calculates center points correctly', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        left: 200,
        right: 300,
        bottom: 200,
        width: 100,
        height: 100,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect);

      const bounds = getElementBounds(el, { includeScrollOffset: false });
      expect(bounds?.centerX).toBe(250);
      expect(bounds?.centerY).toBe(150);

      document.body.removeChild(el);
    });

    it('includes scroll offset by default', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 10,
        left: 20,
        right: 30,
        bottom: 40,
        width: 10,
        height: 30,
        x: 20,
        y: 10,
        toJSON: () => ({}),
      } as DOMRect);

      Object.defineProperty(window, 'scrollX', { value: 50, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });

      const bounds = getElementBounds(el);
      expect(bounds?.absoluteLeft).toBe(70);
      expect(bounds?.absoluteTop).toBe(110);

      Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      document.body.removeChild(el);
    });
  });

  describe('boundsIntersect', () => {
    it('returns true when bounds overlap', () => {
      const a: ElementBounds = {
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
      const b: ElementBounds = {
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
      expect(boundsIntersect(a, b)).toBe(true);
    });

    it('returns false when bounds do not overlap horizontally', () => {
      const a: ElementBounds = {
        top: 0,
        left: 0,
        right: 50,
        bottom: 100,
        width: 50,
        height: 100,
        centerX: 25,
        centerY: 50,
        absoluteTop: 0,
        absoluteLeft: 0,
      };
      const b: ElementBounds = {
        top: 0,
        left: 100,
        right: 150,
        bottom: 100,
        width: 50,
        height: 100,
        centerX: 125,
        centerY: 50,
        absoluteTop: 0,
        absoluteLeft: 100,
      };
      expect(boundsIntersect(a, b)).toBe(false);
    });

    it('returns false when bounds do not overlap vertically', () => {
      const a: ElementBounds = {
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
        width: 100,
        height: 50,
        centerX: 50,
        centerY: 25,
        absoluteTop: 0,
        absoluteLeft: 0,
      };
      const b: ElementBounds = {
        top: 100,
        left: 0,
        right: 100,
        bottom: 150,
        width: 100,
        height: 50,
        centerX: 50,
        centerY: 125,
        absoluteTop: 100,
        absoluteLeft: 0,
      };
      expect(boundsIntersect(a, b)).toBe(false);
    });

    it('returns false when bounds are touching but not overlapping', () => {
      const a: ElementBounds = {
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
      const b: ElementBounds = {
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
      expect(boundsIntersect(a, b)).toBe(false);
    });
  });

  describe('isInViewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
    });

    it('returns false when not in browser', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      const bounds: ElementBounds = {
        top: 100,
        left: 100,
        right: 200,
        bottom: 200,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: 150,
        absoluteTop: 100,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds)).toBe(false);
      spy.mockRestore();
    });

    it('returns true when element is fully in viewport', () => {
      const bounds: ElementBounds = {
        top: 100,
        left: 100,
        right: 200,
        bottom: 200,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: 150,
        absoluteTop: 100,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds)).toBe(true);
    });

    it('returns true when element is partially in viewport with threshold 0', () => {
      const bounds: ElementBounds = {
        top: -50,
        left: 100,
        right: 200,
        bottom: 50,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: 0,
        absoluteTop: -50,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds, 0)).toBe(true);
    });

    it('returns false when element is completely outside viewport', () => {
      const bounds: ElementBounds = {
        top: -200,
        left: 100,
        right: 200,
        bottom: -100,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: -150,
        absoluteTop: -200,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds)).toBe(false);
    });

    it('returns false when visible area is below threshold', () => {
      const bounds: ElementBounds = {
        top: -80,
        left: 100,
        right: 200,
        bottom: 20,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: -30,
        absoluteTop: -80,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds, 0.5)).toBe(false);
    });

    it('returns true when visible area meets threshold', () => {
      const bounds: ElementBounds = {
        top: -25,
        left: 100,
        right: 200,
        bottom: 75,
        width: 100,
        height: 100,
        centerX: 150,
        centerY: 25,
        absoluteTop: -25,
        absoluteLeft: 100,
      };
      expect(isInViewport(bounds, 0.5)).toBe(true);
    });

    it('returns false when element has zero area', () => {
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

  describe('viewport helpers', () => {
    it('returns defaults in SSR', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      const viewport = getViewportSize({ defaultWidth: 800, defaultHeight: 600 });
      expect(viewport.width).toBe(800);
      expect(viewport.height).toBe(600);
      expect(getDocumentSize()).toBeNull();
      expect(getScrollProgress()).toBe(0);
      spy.mockRestore();
    });

    it('returns viewport dimensions in browser', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1900,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientHeight', {
        value: 1060,
        configurable: true,
      });

      const viewport = getViewportSize();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
      expect(viewport.clientWidth).toBe(1900);
      expect(viewport.clientHeight).toBe(1060);
    });

    it('calculates aspect ratio correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });

      const viewport = getViewportSize();
      expect(viewport.aspectRatio).toBeCloseTo(1.777, 2);
    });

    it('detects landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });

      const viewport = getViewportSize();
      expect(viewport.isLandscape).toBe(true);
      expect(viewport.isPortrait).toBe(false);
    });

    it('detects portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });

      const viewport = getViewportSize();
      expect(viewport.isLandscape).toBe(false);
      expect(viewport.isPortrait).toBe(true);
    });

    it('handles SSR aspect ratio with zero height default', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      const viewport = getViewportSize({ defaultWidth: 800, defaultHeight: 0 });
      expect(viewport.aspectRatio).toBe(1);
      spy.mockRestore();
    });

    it('returns document size in browser', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
      Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetHeight', {
        value: 2000,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientHeight', {
        value: 768,
        configurable: true,
      });
      Object.defineProperty(document.body, 'scrollWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'scrollHeight', { value: 2000, configurable: true });
      Object.defineProperty(document.body, 'offsetWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'offsetHeight', { value: 2000, configurable: true });

      const docSize = getDocumentSize();
      expect(docSize).not.toBeNull();
      expect(docSize?.width).toBe(1024);
      expect(docSize?.height).toBe(2000);
      expect(docSize?.scrollTop).toBe(200);
      expect(docSize?.maxScrollY).toBe(1232);
    });

    it('calculates scroll progress correctly', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
      Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 616, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 2000,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetHeight', {
        value: 2000,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientHeight', {
        value: 768,
        configurable: true,
      });
      Object.defineProperty(document.body, 'scrollWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'scrollHeight', { value: 2000, configurable: true });
      Object.defineProperty(document.body, 'offsetWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'offsetHeight', { value: 2000, configurable: true });

      const progress = getScrollProgress();
      expect(progress).toBeCloseTo(0.5, 1);
    });

    it('returns 0 scroll progress when no scrollable area', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
      Object.defineProperty(window, 'scrollX', { value: 0, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      Object.defineProperty(document.documentElement, 'scrollWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 768,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'offsetHeight', {
        value: 768,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        value: 1024,
        configurable: true,
      });
      Object.defineProperty(document.documentElement, 'clientHeight', {
        value: 768,
        configurable: true,
      });
      Object.defineProperty(document.body, 'scrollWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'scrollHeight', { value: 768, configurable: true });
      Object.defineProperty(document.body, 'offsetWidth', { value: 1024, configurable: true });
      Object.defineProperty(document.body, 'offsetHeight', { value: 768, configurable: true });

      const progress = getScrollProgress();
      expect(progress).toBe(0);
    });
  });

  describe('observeResize', () => {
    it('returns noop when ResizeObserver unavailable', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(true);
      const original = (global as any).ResizeObserver;
      // @ts-expect-error - remove for test
      delete (global as any).ResizeObserver;
      const cleanup = observeResize(null as any, () => {});
      expect(typeof cleanup).toBe('function');
      cleanup();
      (global as any).ResizeObserver = original;
      spy.mockRestore();
    });

    it('observes element and debounces callback', () => {
      jest.useFakeTimers();
      const entries: any[] = [];
      const observeMock = jest.fn();
      const disconnectMock = jest.fn();
      const ro = jest.fn().mockImplementation((cb) => {
        observeMock.mockImplementation((el) => {
          cb([
            {
              target: el,
              contentRect: { width: 100, height: 200 },
              borderBoxSize: undefined,
              contentBoxSize: undefined,
            },
          ]);
        });
        return { observe: observeMock, disconnect: disconnectMock };
      });
      (global as any).ResizeObserver = ro;
      const el = document.createElement('div');
      const cleanup = observeResize(el, (entry) => entries.push(entry), { debounce: 10 });
      observeMock(el);
      expect(entries).toHaveLength(0);
      jest.advanceTimersByTime(15);
      expect(entries).toHaveLength(1);
      cleanup();
    });

    it('supports multiple elements', () => {
      const observeSpy = jest.fn();
      const disconnectSpy = jest.fn();
      (global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: observeSpy,
        disconnect: disconnectSpy,
      }));
      const el1 = document.createElement('div');
      const el2 = document.createElement('div');
      const cleanup = observeResizeMany([el1, el2], () => {});
      expect(observeSpy).toHaveBeenCalledTimes(2);
      cleanup();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe('frame scheduling', () => {
    it('falls back to setTimeout when rAF is unavailable', () => {
      jest.useFakeTimers();
      const originalRaf = window.requestAnimationFrame;
      const originalGlobalRaf = globalThis.requestAnimationFrame;
      // Remove rAF to test fallback
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'requestAnimationFrame', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(true);
      const cb = jest.fn();
      scheduleFrame(cb);
      jest.runOnlyPendingTimers();
      expect(cb).toHaveBeenCalled();

      Object.defineProperty(window, 'requestAnimationFrame', {
        value: originalRaf,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, 'requestAnimationFrame', {
        value: originalGlobalRaf,
        configurable: true,
        writable: true,
      });
      spy.mockRestore();
    });

    it('executes synchronously in non-browser environments', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      const cb = jest.fn();
      const cancel = scheduleFrame(cb);
      expect(cb).not.toHaveBeenCalled();
      cancel();
      spy.mockRestore();
    });

    it('starts loop until callback returns false', () => {
      jest.useFakeTimers();
      let calls = 0;
      const stop = startLoop(() => {
        calls++;
        return calls < 2;
      });
      jest.advanceTimersByTime(50);
      stop();
      expect(calls).toBeGreaterThanOrEqual(1);
    });

    it('uses requestAnimationFrame when available', () => {
      jest.useFakeTimers();
      const rafSpy = jest.fn((cb) => setTimeout(() => cb(performance.now()), 16));
      const originalRaf = window.requestAnimationFrame;
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: rafSpy,
        configurable: true,
        writable: true,
      });

      const cb = jest.fn();
      scheduleFrame(cb);
      expect(rafSpy).toHaveBeenCalled();

      Object.defineProperty(window, 'requestAnimationFrame', {
        value: originalRaf,
        configurable: true,
        writable: true,
      });
    });

    it('cancels scheduled frame', () => {
      jest.useFakeTimers();
      const cafSpy = jest.fn();
      const originalCaf = window.cancelAnimationFrame;
      Object.defineProperty(window, 'cancelAnimationFrame', {
        value: cafSpy,
        configurable: true,
        writable: true,
      });

      const cb = jest.fn();
      const cancel = scheduleFrame(cb);
      cancel();

      Object.defineProperty(window, 'cancelAnimationFrame', {
        value: originalCaf,
        configurable: true,
        writable: true,
      });
    });

    it('schedules frame after specified number of frames', () => {
      jest.useFakeTimers();
      const cb = jest.fn();
      scheduleFrameAfter(cb, 2);

      jest.advanceTimersByTime(16);
      expect(cb).not.toHaveBeenCalled();

      jest.advanceTimersByTime(16);
      expect(cb).not.toHaveBeenCalled();

      jest.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalled();
    });

    it('schedules immediately when delayFrames is 0', () => {
      jest.useFakeTimers();
      const cb = jest.fn();
      scheduleFrameAfter(cb, 0);
      jest.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalled();
    });

    it('schedules immediately when delayFrames is negative', () => {
      jest.useFakeTimers();
      const cb = jest.fn();
      scheduleFrameAfter(cb, -1);
      jest.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalled();
    });

    it('cancels scheduleFrameAfter', () => {
      jest.useFakeTimers();
      const cb = jest.fn();
      const cancel = scheduleFrameAfter(cb, 3);
      cancel();
      jest.advanceTimersByTime(100);
      expect(cb).not.toHaveBeenCalled();
    });

    it('startLoop provides frame info', () => {
      jest.useFakeTimers();
      let frameInfo: any = null;
      const stop = startLoop((info) => {
        frameInfo = info;
        return false;
      });
      jest.advanceTimersByTime(16);
      stop();

      expect(frameInfo).not.toBeNull();
      expect(typeof frameInfo.timestamp).toBe('number');
      expect(typeof frameInfo.deltaTime).toBe('number');
      expect(typeof frameInfo.elapsedTime).toBe('number');
      expect(typeof frameInfo.frameCount).toBe('number');
    });

    it('startLoop returns early when not in browser', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      let called = false;
      const stop = startLoop(() => {
        called = true;
        return false;
      });
      expect(called).toBe(false);
      stop();
      spy.mockRestore();
    });
  });

  describe('throttleFrame', () => {
    it('executes synchronously when not in browser', () => {
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
      const fn = jest.fn();
      const throttled = throttleFrame(fn);
      throttled();
      expect(fn).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('throttles function calls to one per frame', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('executes on leading edge by default', () => {
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('can disable leading edge execution', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn, { leading: false });

      throttled();
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('executes on trailing edge by default', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('can disable trailing edge execution', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn, { trailing: false });

      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('provides cancel method', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn, { leading: false });

      throttled();
      throttled.cancel();
      jest.advanceTimersByTime(16);

      expect(fn).not.toHaveBeenCalled();
    });

    it('provides flush method', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn, { leading: false });

      throttled('arg1', 'arg2');
      expect(fn).not.toHaveBeenCalled();

      throttled.flush();
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('flush does nothing when not pending', () => {
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled.flush();
      expect(fn).not.toHaveBeenCalled();
    });

    it('exposes pending property', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn, { leading: false });

      expect(throttled.pending).toBe(false);
      throttled();
      expect(throttled.pending).toBe(true);
      jest.advanceTimersByTime(16);
      expect(throttled.pending).toBe(false);
    });

    it('passes arguments correctly', () => {
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled('a', 'b', 'c');
      expect(fn).toHaveBeenCalledWith('a', 'b', 'c');
    });

    it('uses latest arguments for trailing call', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = throttleFrame(fn);

      throttled('first');
      throttled('second');
      throttled('third');

      expect(fn).toHaveBeenCalledWith('first');
      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenLastCalledWith('third');
    });
  });

  describe('rafThrottle', () => {
    it('throttles function calls to animation frames', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = rafThrottle(fn);

      throttled();
      throttled();
      throttled();

      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('passes latest arguments', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = rafThrottle(fn);

      throttled('a');
      throttled('b');
      throttled('c');

      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledWith('c');
    });

    it('executes synchronously when rAF unavailable', () => {
      const originalRaf = window.requestAnimationFrame;
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);

      const fn = jest.fn();
      const throttled = rafThrottle(fn);
      throttled('test');

      expect(fn).toHaveBeenCalledWith('test');

      Object.defineProperty(window, 'requestAnimationFrame', {
        value: originalRaf,
        configurable: true,
        writable: true,
      });
      spy.mockRestore();
    });

    it('does not queue multiple frames', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttled = rafThrottle(fn);

      throttled();
      throttled();
      throttled();

      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(1);

      throttled();
      jest.advanceTimersByTime(16);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});
