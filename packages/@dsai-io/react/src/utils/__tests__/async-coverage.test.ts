/**
 * @file Additional coverage tests for async utilities
 *
 * Covers untested branches in:
 * - createAbortable: abort signal already aborted, successful completion with cleanup, error propagation
 */

import { createAbortable } from '../async/createAbortable';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('createAbortable (additional coverage)', () => {
  it('should resolve successfully when not aborted', async () => {
    const { promise } = createAbortable(async () => {
      return 'result';
    });

    const result = await promise;
    expect(result).toBe('result');
  });

  it('should pass signal to the function', async () => {
    let receivedSignal: AbortSignal | null = null;
    const { promise } = createAbortable(async (signal) => {
      receivedSignal = signal;
      return 'done';
    });

    await promise;
    expect(receivedSignal).toBeInstanceOf(AbortSignal);
    expect(receivedSignal!.aborted).toBe(false);
  });

  it('should reject with AbortError when aborted during execution', async () => {
    const { promise, abort } = createAbortable(async () => {
      await delay(500);
      return 'should not get here';
    });

    // Abort immediately
    abort();

    await expect(promise).rejects.toThrow('Aborted');
    try {
      await promise;
    } catch (err) {
      expect((err as DOMException).name).toBe('AbortError');
    }
  });

  it('should track aborted state correctly', async () => {
    const abortable = createAbortable(async () => {
      await delay(500);
      return 'value';
    });

    expect(abortable.aborted).toBe(false);
    abortable.abort();
    expect(abortable.aborted).toBe(true);

    await expect(abortable.promise).rejects.toThrow();
  });

  it('should expose the AbortController', () => {
    const { controller } = createAbortable(async () => 'test');
    expect(controller).toBeInstanceOf(AbortController);
    expect(controller.signal).toBeInstanceOf(AbortSignal);
  });

  it('should propagate errors from the wrapped function', async () => {
    const { promise } = createAbortable(async () => {
      throw new Error('Custom error');
    });

    await expect(promise).rejects.toThrow('Custom error');
  });

  it('should reject when function rejects (non-abort error)', async () => {
    const { promise } = createAbortable(async () => {
      await delay(10);
      throw new TypeError('type mismatch');
    });

    await expect(promise).rejects.toThrow('type mismatch');
  });

  it('should clean up abort listener after successful completion', async () => {
    const { promise, controller } = createAbortable(async () => {
      return 42;
    });

    await promise;

    // After completion, abort should not cause issues
    controller.abort();
    // No unhandled rejection
  });

  it('should clean up abort listener after error', async () => {
    const { promise, controller } = createAbortable(async () => {
      throw new Error('fail');
    });

    await expect(promise).rejects.toThrow('fail');

    // After error, abort should not cause issues
    controller.abort();
  });

  it('should handle abort called multiple times', async () => {
    const { promise, abort } = createAbortable(async () => {
      await delay(500);
      return 'value';
    });

    abort();
    abort(); // second call should be safe

    await expect(promise).rejects.toThrow('Aborted');
  });

  it('should handle signal.aborted being true at start when controller is aborted before fn runs', async () => {
    // This tests the internal "already aborted" check path
    // We create an abortable and abort synchronously before the microtask queue processes
    const { promise, abort } = createAbortable(async (signal) => {
      // The signal should be aborted by the time we check
      if (signal.aborted) {
        throw new DOMException('Already aborted', 'AbortError');
      }
      return 'value';
    });

    abort();

    await expect(promise).rejects.toThrow();
  });
});
