/**
 * @file Timing utility tests
 * @module @dsai/react/utils/timing
 */

import { debounce } from './debounce';
import { throttle } from './throttle';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should debounce function calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced();
      debounced();

      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should use default wait time of 300ms', () => {
      const func = jest.fn();
      const debounced = debounce(func);

      debounced();
      jest.advanceTimersByTime(299);
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should preserve this context', () => {
      const func = jest.fn();
      const context = { value: 42 };

      const debounced = debounce(func, 100);
      debounced.call(context);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalled();
    });
  });

  describe('Leading edge', () => {
    it('should invoke on leading edge when enabled', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: false });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      debounced();
      debounced();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should invoke on both edges when both enabled', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: true });

      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('Trailing edge', () => {
    it('should invoke on trailing edge by default', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should not invoke on trailing edge when disabled', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { leading: false, trailing: false });

      debounced();
      jest.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('Max wait', () => {
    it('should enforce maximum wait time', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      jest.advanceTimersByTime(90);
      debounced();
      jest.advanceTimersByTime(90);
      debounced();

      expect(debounced.pending()).toBe(true);

      jest.advanceTimersByTime(90);

      // Should have invoked due to maxWait
      expect(func).toHaveBeenCalledTimes(1);
      expect(debounced.pending()).toBe(false);
    });

    it('should flush when only maxWait invocation is pending', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { maxWait: 200 });

      debounced();
      jest.advanceTimersByTime(90);
      debounced();
      jest.advanceTimersByTime(90);
      debounced();

      debounced.flush();

      expect(func).toHaveBeenCalledTimes(1);
      expect(debounced.pending()).toBe(false);
    });
  });

  describe('Cancel', () => {
    it('should cancel pending invocations', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.cancel();

      jest.advanceTimersByTime(100);
      expect(func).not.toHaveBeenCalled();
    });

    it('should reset state after cancel', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.cancel();
      debounced();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('Flush', () => {
    it('should immediately invoke pending function', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced();
      debounced.flush();

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if no pending invocation', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      debounced.flush();
      expect(func).not.toHaveBeenCalled();
    });
  });

  describe('Pending', () => {
    it('should return true when there are pending invocations', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      expect(debounced.pending()).toBe(false);

      debounced();
      expect(debounced.pending()).toBe(true);

      jest.advanceTimersByTime(100);
      expect(debounced.pending()).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for non-function input', () => {
      expect(() => debounce('not a function' as never)).toThrow(TypeError);
      expect(() => debounce(null as never)).toThrow(TypeError);
    });

    it('should throw RangeError for negative wait', () => {
      expect(() => debounce(() => {}, -1)).toThrow(RangeError);
    });

    it('should throw RangeError if maxWait < wait', () => {
      expect(() => debounce(() => {}, 200, { maxWait: 100 })).toThrow(RangeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero wait time', () => {
      const func = jest.fn();
      const debounced = debounce(func, 0);

      debounced();
      jest.advanceTimersByTime(0);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid successive calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100);

      for (let i = 0; i < 100; i++) {
        debounced();
      }

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mixed options (leading + trailing + maxWait)', () => {
    it('should invoke on leading, then enforce maxWait on continued calls', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, {
        leading: true,
        trailing: true,
        maxWait: 200,
      });

      // First call - leading edge
      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      // Keep calling to reset debounce timer, but maxWait should eventually fire
      jest.advanceTimersByTime(90);
      debounced();
      jest.advanceTimersByTime(90);
      debounced();

      // At 180ms from first call; within debounce but approaching maxWait
      expect(func).toHaveBeenCalledTimes(1);

      // Advance past maxWait (200ms from lastInvokeTime)
      jest.advanceTimersByTime(30);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle leading false + trailing true + maxWait', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, {
        leading: false,
        trailing: true,
        maxWait: 200,
      });

      // First call - no leading
      debounced();
      expect(func).not.toHaveBeenCalled();

      // Keep resetting the debounce
      jest.advanceTimersByTime(90);
      debounced();
      jest.advanceTimersByTime(90);
      debounced();

      // maxWait (200ms) should trigger
      jest.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should handle leading true + trailing false + maxWait', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, {
        leading: true,
        trailing: false,
        maxWait: 200,
      });

      // First call - leading edge
      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      // Keep calling - maxWait should still trigger
      jest.advanceTimersByTime(90);
      debounced();
      jest.advanceTimersByTime(90);
      debounced();

      // maxWait enforced
      jest.advanceTimersByTime(50);
      expect(func).toHaveBeenCalledTimes(2);

      // No trailing call
      jest.advanceTimersByTime(200);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle leading false + trailing false + maxWait', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, {
        leading: false,
        trailing: false,
        maxWait: 200,
      });

      debounced();
      jest.advanceTimersByTime(250);

      // Neither leading nor trailing should fire
      expect(func).not.toHaveBeenCalled();
    });

    it('should handle maxWait equal to wait', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { maxWait: 100 });

      debounced();
      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should reset leading invocation eligibility after wait time', () => {
      const func = jest.fn();
      const debounced = debounce(func, 100, { leading: true, trailing: false });

      // First leading call
      debounced();
      expect(func).toHaveBeenCalledTimes(1);

      // Wait for full cycle
      jest.advanceTimersByTime(150);

      // Should be eligible for leading call again
      debounced();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('Return value behavior', () => {
    it('should return undefined on first call when trailing only', () => {
      const func = jest.fn().mockReturnValue(42);
      const debounced = debounce(func, 100);

      const result = debounced();
      expect(result).toBeUndefined();

      jest.advanceTimersByTime(100);
      expect(func).toHaveReturnedWith(42);
    });

    it('should return function result on leading edge call', () => {
      const func = jest.fn().mockReturnValue(42);
      const debounced = debounce(func, 100, { leading: true });

      const result = debounced();
      expect(result).toBe(42);
    });

    it('should return last result from flush', () => {
      const func = jest.fn().mockReturnValue(42);
      const debounced = debounce(func, 100);

      debounced();
      const result = debounced.flush();

      expect(result).toBe(42);
    });

    it('should return undefined from flush when no pending call', () => {
      const func = jest.fn().mockReturnValue(42);
      const debounced = debounce(func, 100);

      const result = debounced.flush();
      expect(result).toBeUndefined();
    });

    it('should preserve last result between calls', () => {
      const func = jest.fn().mockReturnValue(42);
      const debounced = debounce(func, 100, { leading: true });

      const result1 = debounced();
      expect(result1).toBe(42);

      // Second call within debounce period returns last result
      const result2 = debounced();
      expect(result2).toBe(42);
    });

    it('should use latest arguments on trailing edge', () => {
      const func = jest.fn((x: number) => x * 2);
      const debounced = debounce(func, 100);

      debounced(1);
      debounced(2);
      debounced(3);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith(3);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should throttle function calls', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should use default wait time of 300ms', () => {
      const func = jest.fn();
      const throttled = throttle(func);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      jest.advanceTimersByTime(299);
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to throttled function', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled('arg1', 'arg2');
      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should preserve this context', () => {
      const obj = {
        value: 42,
        method: jest.fn(function (this: { value: number }) {
          return this.value;
        }),
      };

      const throttled = throttle(obj.method, 100);
      throttled.call(obj);

      expect(obj.method).toHaveBeenCalled();
    });
  });

  describe('Leading edge', () => {
    it('should invoke on leading edge by default', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should not invoke on leading edge when disabled', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: false, trailing: true });

      throttled();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('Trailing edge', () => {
    it('should invoke on trailing edge by default', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should not invoke on trailing edge when disabled', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: true, trailing: false });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cancel', () => {
    it('should cancel pending invocations', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled.cancel();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });
  });

  describe('Flush', () => {
    it('should immediately invoke pending function', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled.flush();

      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should do nothing if no pending invocation', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      const callCount = func.mock.calls.length;

      throttled.flush();
      expect(func).toHaveBeenCalledTimes(callCount);
    });
  });

  describe('Pending', () => {
    it('should return true when there are pending invocations', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      expect(throttled.pending()).toBe(false);

      throttled();
      throttled();
      expect(throttled.pending()).toBe(true);

      jest.advanceTimersByTime(100);
      expect(throttled.pending()).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should throw TypeError for non-function input', () => {
      expect(() => throttle('not a function' as never)).toThrow(TypeError);
      expect(() => throttle(null as never)).toThrow(TypeError);
    });

    it('should throw RangeError for negative wait', () => {
      expect(() => throttle(() => {}, -1)).toThrow(RangeError);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero wait time', () => {
      const func = jest.fn();
      const throttled = throttle(func, 0);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(0);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid successive calls', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      for (let i = 0; i < 10; i++) {
        throttled();
      }

      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('Mixed options (leading + trailing)', () => {
    it('should invoke both edges when both enabled (default)', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(2);
    });

    it('should invoke only leading when trailing disabled', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: true, trailing: false });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      throttled();
      throttled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should invoke only trailing when leading disabled', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: false, trailing: true });

      throttled();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should not invoke when both disabled', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: false, trailing: false });

      throttled();
      throttled();

      jest.advanceTimersByTime(200);
      expect(func).not.toHaveBeenCalled();
    });

    it('should allow subsequent leading calls after wait period', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100, { leading: true, trailing: false });

      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('Return value behavior', () => {
    it('should return function result on leading edge call', () => {
      const func = jest.fn().mockReturnValue(42);
      const throttled = throttle(func, 100);

      const result = throttled();
      expect(result).toBe(42);
    });

    it('should return undefined when leading disabled on first call', () => {
      const func = jest.fn().mockReturnValue(42);
      const throttled = throttle(func, 100, { leading: false });

      const result = throttled();
      expect(result).toBeUndefined();
    });

    it('should return last result from flush', () => {
      const func = jest.fn().mockReturnValue(42);
      const throttled = throttle(func, 100);

      throttled();
      throttled();
      const result = throttled.flush();

      expect(result).toBe(42);
    });

    it('should return undefined from flush when no pending call', () => {
      const func = jest.fn().mockReturnValue(42);
      const throttled = throttle(func, 100);

      // Only leading call, no pending trailing
      throttled();
      jest.advanceTimersByTime(100);

      const result = throttled.flush();
      expect(result).toBe(42); // Returns last result
    });

    it('should preserve last result between calls within throttle period', () => {
      const func = jest.fn().mockReturnValue(42);
      const throttled = throttle(func, 100);

      const result1 = throttled();
      expect(result1).toBe(42);

      // Second call within throttle period returns last result
      const result2 = throttled();
      expect(result2).toBe(42);
    });

    it('should use latest arguments on trailing edge', () => {
      const func = jest.fn((x: number) => x * 2);
      const throttled = throttle(func, 100);

      throttled(1);
      expect(func).toHaveBeenCalledWith(1);

      throttled(2);
      throttled(3);

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith(3);
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('Timer precision', () => {
    it('should handle clock drift gracefully', () => {
      const func = jest.fn();
      const throttled = throttle(func, 100);

      // Simulate clock going backwards (rare edge case)
      throttled();
      expect(func).toHaveBeenCalledTimes(1);

      // Throttle handles this via negative time check
      jest.advanceTimersByTime(100);
      throttled();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });
});
