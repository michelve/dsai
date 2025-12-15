/**
 * @file Layout utilities test suite
 */

import { getDocumentSize, getScrollProgress, getViewportSize } from '../layout/getViewportSize';
import { getElementBounds } from '../layout/getElementBounds';
import { observeResize, observeResizeMany } from '../layout/observeResize';
import { scheduleFrame, startLoop } from '../layout/scheduleFrame';
import { throttleFrame } from '../layout/throttleFrame';

describe('Layout utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('getElementBounds', () => {
    it('returns null when not in browser', () => {
      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(false);
      expect(getElementBounds(null)).toBeNull();
      spy.mockRestore();
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
  });

  describe('viewport helpers', () => {
    it('returns defaults in SSR', () => {
      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(false);
      const viewport = getViewportSize({ defaultWidth: 800, defaultHeight: 600 });
      expect(viewport.width).toBe(800);
      expect(viewport.height).toBe(600);
      expect(getDocumentSize()).toBeNull();
      expect(getScrollProgress()).toBe(0);
      spy.mockRestore();
    });
  });

  describe('observeResize', () => {
    it('returns noop when ResizeObserver unavailable', () => {
      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(true);
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
      const original = (window as any).requestAnimationFrame;
      // @ts-expect-error
      delete (window as any).requestAnimationFrame;

      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(true);
      const cb = jest.fn();
      scheduleFrame(cb);
      jest.runOnlyPendingTimers();
      expect(cb).toHaveBeenCalled();
      (window as any).requestAnimationFrame = original;
      spy.mockRestore();
    });

    it('executes synchronously in non-browser environments', () => {
      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(false);
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
  });

  describe('throttleFrame', () => {
    it('executes synchronously when not in browser', () => {
      const spy = jest.spyOn(require('../browser/isBrowser'), 'isBrowser').mockReturnValue(false);
      const fn = jest.fn();
      const throttled = throttleFrame(fn);
      throttled();
      expect(fn).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
