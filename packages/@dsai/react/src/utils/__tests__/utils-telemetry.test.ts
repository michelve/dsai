/**
 * @jest-environment jsdom
 *
 * Tests for telemetry utilities
 *
 * @group unit
 * @group telemetry
 */

// 1) Mock the isBrowser module first (Jest hoists this)
jest.mock('../browser/isBrowser', () => ({
  isBrowser: jest.fn(() => true),
}));

// 2) Now import the mocked isBrowser and telemetry API
import { isBrowser } from '../browser/isBrowser';
import {
  catchErrors,
  catchErrorsAsync,
  endTiming,
  measurePerformance,
  measurePerformanceAsync,
  startTiming,
  wrapWithTelemetry,
  wrapWithTelemetryAsync,
} from '../telemetry';

// 3) Make a typed reference to the mocked function
const mockedIsBrowser = isBrowser as jest.MockedFunction<typeof isBrowser>;

// 4) Performance API spies
let originalPerformance: Performance;
let nowSpy: jest.SpyInstance<number, []>;
let markSpy: jest.SpyInstance<void, [string]>;
let measureSpy: jest.SpyInstance<void, [string, string?, string?]>;
let clearMarksSpy: jest.SpyInstance<void, [string]>;
let clearMeasuresSpy: jest.SpyInstance<void, [string]>;

beforeAll(() => {
  originalPerformance = (globalThis as any).performance as Performance;
});

beforeEach(() => {
  // Ensure performance exists and has the methods we need for spying
  const perf = ((globalThis as any).performance ||
    ((globalThis as any).performance = {})) as Performance & {
    mark?: Performance['mark'];
    measure?: Performance['measure'];
    clearMarks?: Performance['clearMarks'];
    clearMeasures?: Performance['clearMeasures'];
    now?: Performance['now'];
  };

  if (typeof perf.now !== 'function') perf.now = Date.now;
  if (typeof perf.mark !== 'function') perf.mark = () => undefined;
  if (typeof perf.measure !== 'function') perf.measure = () => undefined;
  if (typeof perf.clearMarks !== 'function') perf.clearMarks = () => undefined;
  if (typeof perf.clearMeasures !== 'function') perf.clearMeasures = () => undefined;

  nowSpy = jest.spyOn(perf, 'now').mockReturnValue(1000);
  markSpy = jest.spyOn(perf, 'mark').mockImplementation(() => undefined);
  measureSpy = jest.spyOn(perf, 'measure').mockImplementation(() => undefined);
  clearMarksSpy = jest.spyOn(perf, 'clearMarks').mockImplementation(() => undefined);
  clearMeasuresSpy = jest.spyOn(perf, 'clearMeasures').mockImplementation(() => undefined);

  // Keep window.performance in sync
  if (typeof window !== 'undefined') {
    (window as any).performance = perf;
  }

  // Default to "browser" mode for all tests unless a test overrides it
  mockedIsBrowser.mockReturnValue(true);
});

afterEach(() => {
  jest.clearAllMocks();
  nowSpy.mockRestore();
  markSpy.mockRestore();
  measureSpy.mockRestore();
  clearMarksSpy.mockRestore();
  clearMeasuresSpy.mockRestore();
});

afterAll(() => {
  (globalThis as any).performance = originalPerformance;
});

describe('Telemetry Utilities', () => {
  describe('measurePerformance', () => {
    it('measures function execution time', () => {
      const fn = jest.fn(() => 'result');
      const result = measurePerformance(fn);

      expect(result.result).toBe('result');
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.name).toBe('anonymous');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('includes custom name in measurement', () => {
      const result = measurePerformance(() => 42, { name: 'test-operation' });

      expect(result.name).toBe('test-operation');
      expect(result.result).toBe(42);
    });

    it('invokes onMeasure callback', () => {
      const onMeasure = jest.fn();
      measurePerformance(() => 'value', { onMeasure });

      expect(onMeasure).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'value',
          duration: expect.any(Number),
          name: 'anonymous',
        })
      );
    });

    it('creates performance marks when available', () => {
      measurePerformance(() => 'test', { name: 'op', useMarks: true });

      expect(markSpy).toHaveBeenCalledWith('op-start');
      expect(markSpy).toHaveBeenCalledWith('op-end');
      expect(measureSpy).toHaveBeenCalledWith('op', 'op-start', 'op-end');
    });

    it('cleans up performance marks', () => {
      measurePerformance(() => 'test', { name: 'op' });

      expect(clearMarksSpy).toHaveBeenCalledWith('op-start');
      expect(clearMarksSpy).toHaveBeenCalledWith('op-end');
      expect(clearMeasuresSpy).toHaveBeenCalledWith('op');
    });

    it('skips marks when useMarks is false', () => {
      measurePerformance(() => 'test', { name: 'op', useMarks: false });

      expect(markSpy).not.toHaveBeenCalled();
      expect(measureSpy).not.toHaveBeenCalled();
    });

    it('handles mark errors gracefully', () => {
      markSpy.mockImplementation(() => {
        throw new Error('Quota exceeded');
      });

      expect(() => measurePerformance(() => 'test')).not.toThrow();
    });

    it('never throws from onMeasure callback', () => {
      const onMeasure = jest.fn(() => {
        throw new Error('Callback error');
      });

      expect(() => measurePerformance(() => 'test', { onMeasure })).not.toThrow();
    });

    it('works in SSR environment (no performance API)', () => {
      // Simulate SSR environment
      mockedIsBrowser.mockReturnValue(false);

      const savedPerformance = (globalThis as any).performance;
      delete (globalThis as any).performance;

      const result = measurePerformance(() => 'test', { name: 'op' });

      expect(result.result).toBe('test');
      expect(result.duration).toBeGreaterThanOrEqual(0);

      // No marks or measures should be used in SSR
      expect(markSpy).not.toHaveBeenCalled();
      expect(measureSpy).not.toHaveBeenCalled();

      // Restore environment
      (globalThis as any).performance = savedPerformance;
      mockedIsBrowser.mockReturnValue(true);
    });
  });

  describe('measurePerformanceAsync', () => {
    it('measures async function execution time', async () => {
      const fn = jest.fn(async () => 'async-result');
      const result = await measurePerformanceAsync(fn);

      expect(result.result).toBe('async-result');
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('handles async errors correctly', async () => {
      const error = new Error('Async error');
      const fn = jest.fn(async () => {
        throw error;
      });

      await expect(measurePerformanceAsync(fn)).rejects.toThrow(error);
    });

    it('invokes onMeasure for async operations', async () => {
      const onMeasure = jest.fn();
      await measurePerformanceAsync(async () => 'value', { onMeasure });

      expect(onMeasure).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'value',
          duration: expect.any(Number),
        })
      );
    });

    it('creates performance marks for async operations', async () => {
      await measurePerformanceAsync(async () => 'test', { name: 'async-op', useMarks: true });

      expect(markSpy).toHaveBeenCalledWith('async-op-start');
      expect(markSpy).toHaveBeenCalledWith('async-op-end');
      expect(measureSpy).toHaveBeenCalledWith('async-op', 'async-op-start', 'async-op-end');
    });
  });

  describe('startTiming / endTiming', () => {
    it('creates timing session with elapsed time', () => {
      const session = startTiming('test-session');

      expect(session.elapsed()).toBeGreaterThanOrEqual(0);
    });

    it('ends timing session and returns duration', () => {
      const session = startTiming('session');
      const duration = session.end();

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('endTiming returns same value as session.end()', () => {
      const session = startTiming('session');
      const duration1 = session.end();
      const duration2 = endTiming(session);

      expect(duration2).toBeGreaterThanOrEqual(duration1);
    });

    it('allows multiple elapsed calls', () => {
      const session = startTiming('session');

      const elapsed1 = session.elapsed();
      const elapsed2 = session.elapsed();

      expect(elapsed2).toBeGreaterThanOrEqual(elapsed1);
    });

    it('returns cached duration after first end() call', () => {
      const session = startTiming('session');

      const duration1 = session.end();
      const duration2 = session.end();

      expect(duration2).toBeGreaterThanOrEqual(duration1);
    });

    it('creates performance marks', () => {
      const session = startTiming('marked-session');

      expect(markSpy).toHaveBeenCalledWith('marked-session-start');

      session.end();

      expect(markSpy).toHaveBeenCalledWith('marked-session-end');
      expect(measureSpy).toHaveBeenCalledWith(
        'marked-session',
        'marked-session-start',
        'marked-session-end'
      );
    });

    it('cleans up performance marks after end()', () => {
      // Clear mocks to ensure clean test state
      jest.clearAllMocks();

      const session = startTiming('cleanup');

      // Verify start mark was created
      expect(markSpy).toHaveBeenCalledWith('cleanup-start');

      session.end();

      // Verify end mark and cleanup
      expect(markSpy).toHaveBeenCalledWith('cleanup-end');
      expect(measureSpy).toHaveBeenCalledWith('cleanup', 'cleanup-start', 'cleanup-end');
      expect(clearMarksSpy).toHaveBeenCalledWith('cleanup-start');
      expect(clearMarksSpy).toHaveBeenCalledWith('cleanup-end');
      expect(clearMeasuresSpy).toHaveBeenCalledWith('cleanup');
    });
  });

  describe('wrapWithTelemetry', () => {
    it('wraps function with telemetry', () => {
      const fn = jest.fn((x: number) => x * 2);
      const wrapped = wrapWithTelemetry(fn, { name: 'multiply' });

      const result = wrapped(5);

      expect(result).toBe(10);
      expect(fn).toHaveBeenCalledWith(5);
    });

    it('invokes onStart hook', () => {
      const onStart = jest.fn();
      const wrapped = wrapWithTelemetry((x: number) => x, {
        name: 'test',
        onStart,
      });

      wrapped(42);

      expect(onStart).toHaveBeenCalledWith('test', [42]);
    });

    it('invokes onSuccess hook', () => {
      const onSuccess = jest.fn();
      const wrapped = wrapWithTelemetry(() => 'result', { onSuccess });

      wrapped();

      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'result',
          duration: expect.any(Number),
        })
      );
    });

    it('invokes onError hook when function throws', () => {
      const error = new Error('Test error');
      const onError = jest.fn();
      const wrapped = wrapWithTelemetry(
        () => {
          throw error;
        },
        { onError, rethrow: false }
      );

      wrapped();

      expect(onError).toHaveBeenCalledWith(error, expect.any(Number));
    });

    it('invokes onComplete hook on success', () => {
      const onComplete = jest.fn();
      const wrapped = wrapWithTelemetry(() => 'ok', { onComplete });

      wrapped();

      expect(onComplete).toHaveBeenCalledWith(expect.any(Number));
    });

    it('invokes onComplete hook on error', () => {
      const onComplete = jest.fn();
      const wrapped = wrapWithTelemetry(
        () => {
          throw new Error('fail');
        },
        { onComplete, rethrow: false }
      );

      wrapped();

      expect(onComplete).toHaveBeenCalledWith(expect.any(Number));
    });

    it('re-throws errors by default', () => {
      const error = new Error('Test error');
      const wrapped = wrapWithTelemetry(() => {
        throw error;
      });

      expect(() => wrapped()).toThrow(error);
    });

    it('swallows errors when rethrow is false', () => {
      const wrapped = wrapWithTelemetry(
        () => {
          throw new Error('fail');
        },
        { rethrow: false }
      );

      expect(() => wrapped()).not.toThrow();
    });

    it('never throws from telemetry hooks', () => {
      const wrapped = wrapWithTelemetry(() => 'ok', {
        onStart: () => {
          throw new Error('Hook error');
        },
        onSuccess: () => {
          throw new Error('Hook error');
        },
        onComplete: () => {
          throw new Error('Hook error');
        },
      });

      expect(() => wrapped()).not.toThrow();
    });
  });

  describe('wrapWithTelemetryAsync', () => {
    it('wraps async function with telemetry', async () => {
      const fn = jest.fn(async (x: number) => x * 2);
      const wrapped = wrapWithTelemetryAsync(fn);

      const result = await wrapped(5);

      expect(result).toBe(10);
      expect(fn).toHaveBeenCalledWith(5);
    });

    it('invokes onSuccess for async operations', async () => {
      const onSuccess = jest.fn();
      const wrapped = wrapWithTelemetryAsync(async () => 'result', { onSuccess });

      await wrapped();

      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'result',
        })
      );
    });

    it('invokes onError for async errors', async () => {
      const error = new Error('Async error');
      const onError = jest.fn();
      const wrapped = wrapWithTelemetryAsync(
        async () => {
          throw error;
        },
        { onError, rethrow: false }
      );

      await wrapped();

      expect(onError).toHaveBeenCalledWith(error, expect.any(Number));
    });

    it('re-throws async errors by default', async () => {
      const error = new Error('Async error');
      const wrapped = wrapWithTelemetryAsync(async () => {
        throw error;
      });

      await expect(wrapped()).rejects.toThrow(error);
    });
  });

  describe('catchErrors', () => {
    it('catches errors and returns fallback', () => {
      const fn = () => {
        throw new Error('Error');
      };
      const wrapped = catchErrors(fn, { fallback: 'fallback' });

      const result = wrapped();

      expect(result).toBe('fallback');
    });

    it('returns function result when no error', () => {
      const wrapped = catchErrors(() => 'success', { fallback: 'fallback' });

      const result = wrapped();

      expect(result).toBe('success');
    });

    it('invokes onError handler', () => {
      const error = new Error('Test error');
      const onError = jest.fn();
      const wrapped = catchErrors(
        () => {
          throw error;
        },
        { onError }
      );

      wrapped();

      expect(onError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          function: 'anonymous',
        })
      );
    });

    it('redacts sensitive keys from context', () => {
      const onError = jest.fn();
      const wrapped = catchErrors(
        () => {
          throw new Error('fail');
        },
        {
          onError,
          context: { password: 'secret123', email: 'user@example.com' },
          redactKeys: ['password'],
        }
      );

      wrapped();

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          password: '[REDACTED]',
          email: 'user@example.com',
        })
      );
    });

    it('redacts default sensitive keys', () => {
      const onError = jest.fn();
      const wrapped = catchErrors(
        () => {
          throw new Error('fail');
        },
        {
          onError,
          context: { apiKey: 'abc123', username: 'john' },
        }
      );

      wrapped();

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          apiKey: '[REDACTED]',
          username: 'john',
        })
      );
    });

    it('re-throws when rethrow is true', () => {
      const error = new Error('Test');
      const wrapped = catchErrors(
        () => {
          throw error;
        },
        { rethrow: true }
      );

      expect(() => wrapped()).toThrow(error);
    });

    it('never throws from error handler', () => {
      const wrapped = catchErrors(
        () => {
          throw new Error('fail');
        },
        {
          onError: () => {
            throw new Error('Handler error');
          },
        }
      );

      expect(() => wrapped()).not.toThrow();
    });

    it('converts non-Error values to Error', () => {
      const onError = jest.fn();
      const wrapped = catchErrors(
        () => {
          throw 'string error';
        },
        { onError }
      );

      wrapped();

      expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
    });
  });

  describe('catchErrorsAsync', () => {
    it('catches async errors and returns fallback', async () => {
      const fn = async () => {
        throw new Error('Async error');
      };
      const wrapped = catchErrorsAsync(fn, { fallback: 'async-fallback' });

      const result = await wrapped();

      expect(result).toBe('async-fallback');
    });

    it('returns async result when no error', async () => {
      const wrapped = catchErrorsAsync(async () => 'async-success');

      const result = await wrapped();

      expect(result).toBe('async-success');
    });

    it('invokes onError for async errors', async () => {
      const error = new Error('Async error');
      const onError = jest.fn();
      const wrapped = catchErrorsAsync(
        async () => {
          throw error;
        },
        { onError }
      );

      await wrapped();

      expect(onError).toHaveBeenCalledWith(error, expect.any(Object));
    });

    it('redacts sensitive context in async errors', async () => {
      const onError = jest.fn();
      const wrapped = catchErrorsAsync(
        async () => {
          throw new Error('fail');
        },
        {
          onError,
          context: { token: 'secret', user: 'john' },
        }
      );

      await wrapped();

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          token: '[REDACTED]',
          user: 'john',
        })
      );
    });

    it('re-throws async errors when configured', async () => {
      const error = new Error('Async error');
      const wrapped = catchErrorsAsync(
        async () => {
          throw error;
        },
        { rethrow: true }
      );

      await expect(wrapped()).rejects.toThrow(error);
    });
  });
});
