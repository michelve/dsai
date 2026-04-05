/**
 * @file Additional coverage tests for layout utilities
 *
 * Covers untested branches in:
 * - throttleFrame: cancel during pending RAF, double-call within single frame, leading+trailing combos
 * - scheduleFrame: cancel, double-schedule, callback invocation
 * - observeResize: disconnect, error paths (observe fails), callback invocation, null element
 */

import * as browserUtils from '../browser/isBrowser';
import { observeResize, observeResizeMany } from '../layout/observeResize';
import { scheduleFrame, scheduleFrameAfter } from '../layout/scheduleFrame';
import { throttleFrame } from '../layout/throttleFrame';

// -- Named constants for magic numbers (SonarQube S109) --
const SCHEDULE_FRAME_COUNT = 5;
const RESIZE_WIDTH = 200;
const RESIZE_HEIGHT = 100;
const RESIZE_WIDTH_SMALL = 100;
const RESIZE_HEIGHT_SMALL = 50;
const RESIZE_WIDTH_LARGE = 300;
const RESIZE_HEIGHT_LARGE = 150;
const DEBOUNCE_MS = 50;
const DEBOUNCE_ADVANCE_MS = 60;
const DEBOUNCE_LONG_MS = 100;
const DEBOUNCE_CLEANUP_ADVANCE_MS = 200;

describe('throttleFrame (additional coverage)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should cancel pending RAF and prevent execution', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false, trailing: true });

    throttled('first');
    expect(fn).not.toHaveBeenCalled();
    expect(throttled.pending).toBe(true);

    throttled.cancel();
    expect(throttled.pending).toBe(false);

    jest.advanceTimersByTime(32);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should handle multiple calls within a single frame (only leading + trailing)', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: true, trailing: true });

    throttled('a');
    throttled('b');
    throttled('c');

    // Leading fires immediately with 'a'
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    // After frame: trailing fires with latest args 'c'
    jest.advanceTimersByTime(16);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('c');
  });

  it('should not fire trailing when leading: true, trailing: false', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: true, trailing: false });

    throttled('a');
    throttled('b');

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    jest.advanceTimersByTime(32);
    // Should NOT fire trailing
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should fire only trailing when leading: false, trailing: true', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false, trailing: true });

    throttled('first');
    throttled('second');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(16);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('should handle flush when pending with args', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: false, trailing: true });

    throttled('flush-me');
    expect(fn).not.toHaveBeenCalled();

    throttled.flush();
    expect(fn).toHaveBeenCalledWith('flush-me');
    expect(throttled.pending).toBe(false);
  });

  it('should handle flush when not pending (no-op)', () => {
    const fn = jest.fn();
    const throttled = throttleFrame(fn);

    throttled.flush();
    expect(fn).not.toHaveBeenCalled();
  });

  it('should reset after frame completes, allowing new leading call', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const throttled = throttleFrame(fn, { leading: true, trailing: false });

    throttled('first');
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(16); // frame resets

    throttled('second');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });
});

describe('scheduleFrame (additional coverage)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should call callback with frame info', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    scheduleFrame(cb);
    jest.advanceTimersByTime(16);

    expect(cb).toHaveBeenCalledTimes(1);
    const info = cb.mock.calls[0][0];
    expect(info).toHaveProperty('timestamp');
    expect(info).toHaveProperty('deltaTime', 0);
    expect(info).toHaveProperty('elapsedTime');
    expect(info).toHaveProperty('frameCount', 1);
  });

  it('should not call callback after cancel', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    const cancel = scheduleFrame(cb);

    cancel();
    jest.advanceTimersByTime(32);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should handle double cancel gracefully', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    const cancel = scheduleFrame(cb);

    cancel();
    cancel(); // second cancel should not throw
    jest.advanceTimersByTime(32);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should handle scheduleFrameAfter cancel before any frames', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    const cancel = scheduleFrameAfter(cb, SCHEDULE_FRAME_COUNT);

    cancel();
    jest.advanceTimersByTime(RESIZE_WIDTH);
    expect(cb).not.toHaveBeenCalled();
  });

  it('should not execute callback when cancelled flag is set', () => {
    jest.useFakeTimers();
    const cb = jest.fn();
    const cancel = scheduleFrame(cb);

    // Cancel before the frame fires
    cancel();
    jest.advanceTimersByTime(16);
    expect(cb).not.toHaveBeenCalled();
  });
});

describe('observeResize (additional coverage)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should return noop for null element', () => {
    const cleanup = observeResize(null, jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw
  });

  it('should return noop for undefined element', () => {
    const cleanup = observeResize(undefined, jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('should return noop in SSR environment', () => {
    const spy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);
    const cleanup = observeResize(document.createElement('div'), jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup();
    spy.mockRestore();
  });

  it('should call callback immediately when debounce is 0', () => {
    const observeSpy = jest.fn();
    const disconnectSpy = jest.fn();
    let observerCallback: ((entries: ResizeObserverEntry[]) => void) | null = null;

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation((cb: (entries: ResizeObserverEntry[]) => void) => {
      observerCallback = cb;
      return { observe: observeSpy, disconnect: disconnectSpy };
    });

    const callback = jest.fn();
    const el = document.createElement('div');
    const cleanup = observeResize(el, callback, { debounce: 0 });

    // Simulate resize
    observerCallback!([
      {
        target: el,
        contentRect: { width: RESIZE_WIDTH, height: RESIZE_HEIGHT },
        borderBoxSize: undefined,
        contentBoxSize: undefined,
      },
    ]);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ width: RESIZE_WIDTH, height: RESIZE_HEIGHT, target: el })
    );

    cleanup();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should debounce callback when debounce > 0', () => {
    jest.useFakeTimers();
    let observerCallback: ((entries: ResizeObserverEntry[]) => void) | null = null;

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation((cb: (entries: ResizeObserverEntry[]) => void) => {
      observerCallback = cb;
      return { observe: jest.fn(), disconnect: jest.fn() };
    });

    const callback = jest.fn();
    const el = document.createElement('div');
    observeResize(el, callback, { debounce: DEBOUNCE_MS });

    // Multiple rapid resize events
    observerCallback!([
      { target: el, contentRect: { width: RESIZE_WIDTH_SMALL, height: RESIZE_HEIGHT_SMALL }, borderBoxSize: undefined, contentBoxSize: undefined },
    ]);
    observerCallback!([
      { target: el, contentRect: { width: RESIZE_WIDTH, height: RESIZE_HEIGHT }, borderBoxSize: undefined, contentBoxSize: undefined },
    ]);
    observerCallback!([
      { target: el, contentRect: { width: RESIZE_WIDTH_LARGE, height: RESIZE_HEIGHT_LARGE }, borderBoxSize: undefined, contentBoxSize: undefined },
    ]);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(DEBOUNCE_ADVANCE_MS);
    expect(callback).toHaveBeenCalledTimes(1);
    // Should use the last entry
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ width: RESIZE_WIDTH_LARGE, height: RESIZE_HEIGHT_LARGE }));
  });

  it('should handle observe with box option failure and retry without box', () => {
    const observeSpy = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('box not supported');
      })
      .mockImplementation(() => {}); // second call succeeds

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: observeSpy,
      disconnect: jest.fn(),
    }));

    const el = document.createElement('div');
    const cleanup = observeResize(el, jest.fn(), { box: 'border-box' });

    expect(observeSpy).toHaveBeenCalledTimes(2);
    expect(typeof cleanup).toBe('function');
  });

  it('should return noop when both observe attempts fail', () => {
    const observeSpy = jest.fn().mockImplementation(() => {
      throw new Error('observe failed');
    });

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: observeSpy,
      disconnect: jest.fn(),
    }));

    const el = document.createElement('div');
    const cleanup = observeResize(el, jest.fn());
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw
  });

  it('should clear debounce timeout on cleanup', () => {
    jest.useFakeTimers();
    let observerCallback: ((entries: ResizeObserverEntry[]) => void) | null = null;

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation((cb: (entries: ResizeObserverEntry[]) => void) => {
      observerCallback = cb;
      return { observe: jest.fn(), disconnect: jest.fn() };
    });

    const callback = jest.fn();
    const el = document.createElement('div');
    const cleanup = observeResize(el, callback, { debounce: DEBOUNCE_LONG_MS });

    // Trigger resize
    observerCallback!([
      { target: el, contentRect: { width: RESIZE_WIDTH_SMALL, height: RESIZE_HEIGHT_SMALL }, borderBoxSize: undefined, contentBoxSize: undefined },
    ]);

    // Cleanup before debounce fires
    cleanup();

    jest.advanceTimersByTime(DEBOUNCE_CLEANUP_ADVANCE_MS);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should observe multiple elements with observeResizeMany', () => {
    const observeSpy = jest.fn();
    const disconnectSpy = jest.fn();

    (global as unknown as Record<string, unknown>).ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: observeSpy,
      disconnect: disconnectSpy,
    }));

    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const cleanup = observeResizeMany([el1, el2, null, undefined], jest.fn());

    // Only non-null elements should be observed
    expect(observeSpy).toHaveBeenCalledTimes(2);

    cleanup();
    expect(disconnectSpy).toHaveBeenCalledTimes(2);
  });
});
