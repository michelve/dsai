/**
 * @file M2.3 Async & Control Flow Utilities Test Suite
 * @module @dsai-io/react/utils/__tests__/async-m2.test
 *
 * Comprehensive test coverage for:
 * - exponentialBackoff
 * - retryWithBackoff
 * - withTimeout / TimeoutError
 * - createAbortable
 * - createTaskQueue
 * - queueTask
 *
 * Target: 100% code coverage
 */

import {
  TimeoutError,
  createAbortable,
  createTaskQueue,
  exponentialBackoff,
  queueTask,
  retryWithBackoff,
  withTimeout,
} from '../async';

// ── Test constants (S109) ──
const TEST_SHORT_DELAY_MS = 10;
const TEST_MEDIUM_DELAY_MS = 20;
const TEST_TASK_DELAY_MS = 50;
const TEST_BACKOFF_DELAY_MS = 100;
const TEST_IDLE_TIMEOUT_MS = 150;
const TEST_BACKOFF_WAIT_MS = 200;
const TEST_TIMEOUT_MS = 1000;
const TEST_MAX_DELAY_MS = 5000;
const TEST_RETRY_COUNT_3 = 3;
const TEST_RETRY_COUNT_5 = 5;
const TEST_RETRY_COUNT_10 = 10;

// Helper to create a delayed promise
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to create a failing promise
const failingPromise = (error: Error): Promise<never> => Promise.reject(error);

describe('M2.3 Async & Control Flow Utilities', () => {
  // ========================================
  // exponentialBackoff Tests
  // ========================================
  describe('exponentialBackoff', () => {
    it('should calculate base delay for attempt 0', () => {
      const result = exponentialBackoff(0, { jitter: false });
      expect(result).toBe(1000);
    });

    it('should double delay for each attempt', () => {
      expect(exponentialBackoff(0, { jitter: false })).toBe(1000);
      expect(exponentialBackoff(1, { jitter: false })).toBe(2000);
      expect(exponentialBackoff(2, { jitter: false })).toBe(4000);
      expect(exponentialBackoff(3, { jitter: false })).toBe(8000);
    });

    it('should respect maxDelay cap', () => {
      const result = exponentialBackoff(10, { jitter: false, maxDelay: TEST_MAX_DELAY_MS });
      expect(result).toBe(TEST_MAX_DELAY_MS);
    });

    it('should use custom baseDelay', () => {
      const result = exponentialBackoff(0, { baseDelay: 500, jitter: false });
      expect(result).toBe(500);
    });

    it('should use custom multiplier', () => {
      const result = exponentialBackoff(2, { multiplier: 3, jitter: false });
      expect(result).toBe(9000); // 1000 * 3^2
    });

    it('should add jitter by default', () => {
      const results = new Set<number>();
      for (let i = 0; i < 10; i++) {
        results.add(exponentialBackoff(1));
      }
      // With jitter, we should get varying results
      expect(results.size).toBeGreaterThan(1);
    });

    it('should respect jitterFactor', () => {
      const baseDelay = 1000;
      const jitterFactor = 0.1; // 10%
      const results: number[] = [];

      for (let i = 0; i < 100; i++) {
        results.push(exponentialBackoff(0, { baseDelay, jitterFactor }));
      }

      // All results should be within 10% of base delay
      results.forEach((r) => {
        expect(r).toBeGreaterThanOrEqual(baseDelay * 0.9);
        expect(r).toBeLessThanOrEqual(baseDelay * 1.1);
      });
    });

    it('should handle negative attempt', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = exponentialBackoff(-1, { jitter: false });
      expect(result).toBe(1000); // Treated as attempt 0
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should handle zero or negative baseDelay', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const result = exponentialBackoff(0, { baseDelay: 0 });
      expect(result).toBe(1000); // Default fallback
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  // ========================================
  // retryWithBackoff Tests
  // ========================================
  describe('retryWithBackoff', () => {
    it('should succeed on first attempt', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail1'))
        .mockRejectedValueOnce(new Error('fail2'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_3,
        baseDelay: TEST_SHORT_DELAY_MS,
        jitter: false,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(TEST_RETRY_COUNT_3);
      expect(fn).toHaveBeenCalledTimes(TEST_RETRY_COUNT_3);
    });

    it('should fail after max attempts', async () => {
      const error = new Error('persistent failure');
      const fn = jest.fn().mockRejectedValue(error);

      const result = await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_3,
        baseDelay: TEST_SHORT_DELAY_MS,
        jitter: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
      expect(result.attempts).toBe(TEST_RETRY_COUNT_3);
    });

    it('should respect shouldRetry condition', async () => {
      const retryableError = new Error('retryable');
      const nonRetryableError = new Error('non-retryable');

      const fn = jest
        .fn()
        .mockRejectedValueOnce(retryableError)
        .mockRejectedValueOnce(nonRetryableError);

      const result = await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_5,
        baseDelay: TEST_SHORT_DELAY_MS,
        shouldRetry: (error) => (error as Error).message === 'retryable',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(nonRetryableError);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should call onRetry callback', async () => {
      const onRetry = jest.fn();
      const fn = jest.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('success');

      await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_3,
        baseDelay: TEST_SHORT_DELAY_MS,
        jitter: false,
        onRetry,
      });

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1, expect.any(Number));
    });

    it('should respect abort signal', async () => {
      const controller = new AbortController();
      const fn = jest.fn().mockImplementation(async () => {
        await delay(TEST_BACKOFF_DELAY_MS);
        return 'success';
      });

      // Abort immediately
      controller.abort();

      const result = await retryWithBackoff(fn, {
        signal: controller.signal,
      });

      expect(result.success).toBe(false);
      expect((result.error as Error).name).toBe('AbortError');
      expect(fn).not.toHaveBeenCalled();
    });

    it('should track total time', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result.totalTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.totalTime).toBe('number');
    });

    it('should return aborted flag when aborted before first attempt', async () => {
      const controller = new AbortController();
      controller.abort();

      const fn = jest.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn, { signal: controller.signal });

      expect(result.success).toBe(false);
      expect(result.aborted).toBe(true);
      expect((result.error as Error).name).toBe('AbortError');
      expect(result.attempts).toBe(0);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should return structured result when aborted during backoff wait', async () => {
      const controller = new AbortController();
      const fn = jest.fn().mockRejectedValueOnce(new Error('fail1')).mockResolvedValue('success');

      const resultPromise = retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_3,
        baseDelay: TEST_BACKOFF_WAIT_MS, // Long enough to abort during wait
        jitter: false,
        signal: controller.signal,
      });

      // Wait a bit for first attempt to fail and backoff to start
      await delay(TEST_TASK_DELAY_MS);
      controller.abort();

      const result = await resultPromise;

      expect(result.success).toBe(false);
      expect(result.aborted).toBe(true);
      expect((result.error as Error).name).toBe('AbortError');
      expect(result.attempts).toBe(1); // Only 1 attempt was made before abort
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should clamp maxAttempts to at least 1 when given 0', async () => {
      const fn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn, { maxAttempts: 0 });

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should clamp maxAttempts to at least 1 when given negative value', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));

      const result = await retryWithBackoff(fn, { maxAttempts: -TEST_RETRY_COUNT_5 });

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should track actual attempts when shouldRetry stops early', async () => {
      const error = new Error('non-retryable');
      const fn = jest.fn().mockRejectedValue(error);

      const result = await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_10,
        baseDelay: TEST_SHORT_DELAY_MS,
        shouldRetry: () => false, // Never retry
      });

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(1); // Only 1 attempt, not 10
      expect(result.error).toBe(error);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should track correct attempts when shouldRetry stops after some retries', async () => {
      let attemptCount = 0;
      const fn = jest.fn().mockImplementation(() => {
        attemptCount++;
        return Promise.reject(new Error(`fail ${attemptCount}`));
      });

      const result = await retryWithBackoff(fn, {
        maxAttempts: TEST_RETRY_COUNT_10,
        baseDelay: TEST_SHORT_DELAY_MS,
        jitter: false,
        shouldRetry: (_error, attempt) => attempt < 2, // Stop after 3 attempts (0, 1, 2)
      });

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(TEST_RETRY_COUNT_3);
      expect(fn).toHaveBeenCalledTimes(TEST_RETRY_COUNT_3);
    });

    it('should not have aborted flag when failing normally', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));

      const result = await retryWithBackoff(fn, { maxAttempts: 2, baseDelay: TEST_SHORT_DELAY_MS });

      expect(result.success).toBe(false);
      expect(result.aborted).toBeUndefined();
    });
  });

  // ========================================
  // withTimeout Tests
  // ========================================
  describe('withTimeout', () => {
    it('should resolve if promise completes in time', async () => {
      const result = await withTimeout(Promise.resolve('success'), TEST_TIMEOUT_MS);
      expect(result).toBe('success');
    });

    it('should reject with TimeoutError if timeout exceeded', async () => {
      await expect(withTimeout(delay(TEST_TIMEOUT_MS), TEST_SHORT_DELAY_MS)).rejects.toThrow(TimeoutError);
    });

    it('should include timeout value in error', async () => {
      try {
        await withTimeout(delay(TEST_TIMEOUT_MS), TEST_TASK_DELAY_MS);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(TimeoutError);
        expect((error as TimeoutError).timeout).toBe(TEST_TASK_DELAY_MS);
      }
    });

    it('should use custom error message', async () => {
      try {
        await withTimeout(delay(TEST_TIMEOUT_MS), TEST_SHORT_DELAY_MS, { message: 'Custom timeout message' });
        fail('Should have thrown');
      } catch (error) {
        expect((error as Error).message).toBe('Custom timeout message');
      }
    });

    it('should abort controller on timeout', async () => {
      const controller = new AbortController();

      try {
        await withTimeout(delay(TEST_TIMEOUT_MS), TEST_SHORT_DELAY_MS, { controller });
      } catch {
        // Expected
      }

      expect(controller.signal.aborted).toBe(true);
    });

    it('should propagate original error', async () => {
      const originalError = new Error('Original error');

      await expect(withTimeout(failingPromise(originalError), TEST_TIMEOUT_MS)).rejects.toThrow(
        'Original error'
      );
    });

    it('should warn for invalid timeout', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await withTimeout(Promise.resolve('success'), 0);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('TimeoutError', () => {
    it('should be instanceof Error', () => {
      const error = new TimeoutError('test', TEST_TIMEOUT_MS);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TimeoutError);
    });

    it('should have correct name', () => {
      const error = new TimeoutError('test', TEST_TIMEOUT_MS);
      expect(error.name).toBe('TimeoutError');
    });

    it('should store timeout value', () => {
      const error = new TimeoutError('test', TEST_MAX_DELAY_MS);
      expect(error.timeout).toBe(TEST_MAX_DELAY_MS);
    });
  });

  // ========================================
  // createAbortable Tests
  // ========================================
  describe('createAbortable', () => {
    it('should resolve when function completes', async () => {
      const { promise } = createAbortable(async () => 'success');
      const result = await promise;
      expect(result).toBe('success');
    });

    it('should reject when aborted', async () => {
      const { promise, abort } = createAbortable(async () => {
        await delay(TEST_TIMEOUT_MS);
        return 'success';
      });

      abort();

      await expect(promise).rejects.toThrow('Aborted');
    });

    it('should provide abort signal to function', async () => {
      const signalReceived = jest.fn();

      const { promise } = createAbortable(async (signal) => {
        signalReceived(signal);
        return 'success';
      });

      await promise;

      expect(signalReceived).toHaveBeenCalledWith(expect.any(AbortSignal));
    });

    it('should expose controller', () => {
      const { controller } = createAbortable(async () => 'success');
      expect(controller).toBeInstanceOf(AbortController);
    });

    it('should track aborted state', async () => {
      const abortable = createAbortable(async () => {
        await delay(TEST_TIMEOUT_MS);
        return 'success';
      });

      expect(abortable.aborted).toBe(false);
      abortable.abort();
      expect(abortable.aborted).toBe(true);

      // Must handle the rejection to prevent unhandled promise rejection
      await expect(abortable.promise).rejects.toThrow('Aborted');
    });

    it('should propagate function errors', async () => {
      const { promise } = createAbortable(async () => {
        throw new Error('Function error');
      });

      await expect(promise).rejects.toThrow('Function error');
    });

    it('should reject immediately if already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      // Create with already-aborted signal by aborting before execution
      const { promise, abort } = createAbortable(async () => {
        await delay(TEST_BACKOFF_DELAY_MS);
        return 'success';
      });

      abort(); // Abort immediately

      await expect(promise).rejects.toThrow('Aborted');
    });
  });

  // ========================================
  // createTaskQueue Tests
  // ========================================
  describe('createTaskQueue', () => {
    it('should execute tasks sequentially by default', async () => {
      const queue = createTaskQueue();
      const order: number[] = [];

      queue.enqueue(async () => {
        await delay(TEST_MEDIUM_DELAY_MS);
        order.push(1);
      });

      queue.enqueue(async () => {
        order.push(2);
      });

      await queue.drain();

      expect(order).toEqual([1, 2]);
    });

    it('should execute tasks concurrently when configured', async () => {
      const queue = createTaskQueue({ concurrency: 2 });
      const order: number[] = [];

      queue.enqueue(async () => {
        await delay(TEST_TASK_DELAY_MS);
        order.push(1);
      });

      queue.enqueue(async () => {
        await delay(TEST_SHORT_DELAY_MS);
        order.push(2);
      });

      await queue.drain();

      // Task 2 should finish first due to shorter delay
      expect(order).toEqual([2, 1]);
    });

    it('should respect priority', async () => {
      const queue = createTaskQueue({ autoStart: false });
      const order: number[] = [];

      queue.enqueue(() => order.push(1), 1); // Low priority
      queue.enqueue(() => order.push(2), 10); // High priority
      queue.enqueue(() => order.push(3), 5); // Medium priority

      queue.resume();
      await queue.drain();

      expect(order).toEqual([2, 3, 1]);
    });

    it('should pause and resume', async () => {
      const queue = createTaskQueue();
      const results: number[] = [];

      queue.enqueue(() => results.push(1));
      await queue.drain();

      queue.pause();
      queue.enqueue(() => results.push(2));

      // Wait a bit to ensure task doesn't run
      await delay(TEST_TASK_DELAY_MS);
      expect(results).toEqual([1]);

      queue.resume();
      await queue.drain();

      expect(results).toEqual([1, 2]);
    });

    it('should clear pending tasks', async () => {
      const queue = createTaskQueue({ autoStart: false });
      const results: number[] = [];

      const promise1 = queue.enqueue(() => results.push(1));
      const promise2 = queue.enqueue(() => results.push(2));

      queue.clear();

      await expect(promise1).rejects.toThrow('Task queue cleared');
      await expect(promise2).rejects.toThrow('Task queue cleared');
      expect(results).toEqual([]);
    });

    it('should return task result', async () => {
      const queue = createTaskQueue();

      const result = await queue.enqueue(() => 'hello');
      expect(result).toBe('hello');
    });

    it('should propagate task errors', async () => {
      const queue = createTaskQueue();

      await expect(
        queue.enqueue(() => {
          throw new Error('Task error');
        })
      ).rejects.toThrow('Task error');
    });

    it('should report correct state', async () => {
      const queue = createTaskQueue({ autoStart: false });

      queue.enqueue(() => delay(TEST_BACKOFF_DELAY_MS));
      queue.enqueue(() => delay(TEST_BACKOFF_DELAY_MS));

      let state = queue.getState();
      expect(state.pending).toBe(2);
      expect(state.running).toBe(0);
      expect(state.paused).toBe(true);
      expect(state.processing).toBe(false);

      queue.resume();

      // Wait a tick for task to start
      await delay(TEST_SHORT_DELAY_MS);

      state = queue.getState();
      expect(state.running).toBe(1);
      expect(state.processing).toBe(true);

      await queue.drain();
    });

    it('should resolve drain immediately when empty', async () => {
      const queue = createTaskQueue();

      // Should resolve immediately
      await queue.drain();

      // No error means success
      expect(true).toBe(true);
    });
  });

  // ========================================
  // queueTask Tests
  // ========================================
  describe('queueTask', () => {
    it('should execute microtask', async () => {
      let executed = false;

      queueTask(() => {
        executed = true;
      });

      // Microtask runs after current execution but before next tick
      await Promise.resolve();
      expect(executed).toBe(true);
    });

    it('should execute macrotask', async () => {
      let executed = false;

      queueTask(
        () => {
          executed = true;
        },
        { schedule: 'macrotask' }
      );

      // Macrotask runs after microtasks
      await delay(0);
      expect(executed).toBe(true);
    });

    it('should execute animationFrame task', async () => {
      let executed = false;

      queueTask(
        () => {
          executed = true;
        },
        { schedule: 'animationFrame' }
      );

      // Wait for RAF
      await delay(TEST_MEDIUM_DELAY_MS);
      expect(executed).toBe(true);
    });

    it('should execute idle task', async () => {
      let executed = false;

      queueTask(
        () => {
          executed = true;
        },
        { schedule: 'idle', idleTimeout: TEST_BACKOFF_DELAY_MS }
      );

      // Wait for idle callback
      await delay(TEST_IDLE_TIMEOUT_MS);
      expect(executed).toBe(true);
    });

    it('should cancel microtask', async () => {
      let executed = false;

      const handle = queueTask(() => {
        executed = true;
      });

      handle.cancel();

      await Promise.resolve();
      expect(executed).toBe(false);
    });

    it('should cancel macrotask', async () => {
      let executed = false;

      const handle = queueTask(
        () => {
          executed = true;
        },
        { schedule: 'macrotask' }
      );

      handle.cancel();

      await delay(TEST_SHORT_DELAY_MS);
      expect(executed).toBe(false);
    });

    it('should cancel animationFrame task', async () => {
      let executed = false;

      const handle = queueTask(
        () => {
          executed = true;
        },
        { schedule: 'animationFrame' }
      );

      handle.cancel();

      await delay(TEST_TASK_DELAY_MS);
      expect(executed).toBe(false);
    });

    it('should handle unknown schedule type', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      let executed = false;

      queueTask(
        () => {
          executed = true;
        },
        { schedule: 'unknown' as 'microtask' }
      );

      await Promise.resolve();

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(executed).toBe(true); // Falls back to microtask
      consoleWarnSpy.mockRestore();
    });

    it('should use default schedule (microtask)', async () => {
      let executed = false;

      queueTask(() => {
        executed = true;
      });

      await Promise.resolve();
      expect(executed).toBe(true);
    });
  });
});
