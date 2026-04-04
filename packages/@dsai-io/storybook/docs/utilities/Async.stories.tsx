import {
  Alert,
  BoxIcon,
  Button,
  CheckCircleFillIcon,
  CircleFillIcon,
  ClockIcon,
  createAbortable,
  createTaskQueue,
  ExclamationTriangleFillIcon,
  exponentialBackoff,
  Heading,
  LightbulbFillIcon,
  PauseFillIcon,
  PlayFillIcon,
  queueTask,
  retryWithBackoff,
  TimeoutError,
  withTimeout,
} from '@dsai-io/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { JSX } from 'react';

/**
 * Async & Control Flow Utilities
 *
 * Production-ready async utilities for building resilient, performant applications.
 * These utilities provide essential functionality for handling async operations,
 * retries, timeouts, task scheduling, and cancellation patterns.
 *
 * ## Available Utilities
 *
 * - **createAbortable** - Make promises cancellable with AbortController
 * - **withTimeout** - Add timeout limits to any promise
 * - **retryWithBackoff** - Retry failed operations with exponential backoff
 * - **exponentialBackoff** - Calculate backoff delays with jitter
 * - **createTaskQueue** - Sequential or concurrent task queue with priority
 * - **queueTask** - Schedule tasks via microtask, macrotask, RAF, or idle callback
 *
 * ## Design Principles
 *
 * 1. **Resilient** - Handle failures gracefully with retries and timeouts
 * 2. **Cancellable** - All operations support proper cleanup and cancellation
 * 3. **React-Friendly** - Works seamlessly with useEffect cleanup patterns
 * 4. **SSR-Safe** - Graceful fallbacks for server-side rendering
 * 5. **Type-Safe** - Full TypeScript support with proper generics
 */

const meta: Meta = {
  title: 'Utilities/Async',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Enterprise-grade async utilities for resilient applications. ' +
          'Provides retry logic, timeouts, cancellation, task queuing, and scheduling strategies.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ============================================================================
// Helper: Simulated API calls for demos
// ============================================================================

const simulateFetch = (
  delay: number,
  shouldFail = false,
  signal?: AbortSignal
): Promise<{ data: string; timestamp: number }> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      if (shouldFail) {
        reject(new Error('Network error'));
      } else {
        resolve({ data: 'Success!', timestamp: Date.now() });
      }
    }, delay);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};

// ============================================================================
// Story: createAbortable
// ============================================================================

/**
 * ## createAbortable
 *
 * Create cancellable promise wrappers using AbortController. Perfect for
 * React useEffect cleanup patterns, user-initiated cancellations, and
 * preventing memory leaks from unmounted components.
 *
 * ### Use Cases
 * - Cancelling fetch requests on component unmount
 * - User-initiated request cancellation
 * - Race conditions prevention
 * - Cleanup of long-running operations
 *
 * ### API
 * ```typescript
 * function createAbortable<T>(
 *   fn: (signal: AbortSignal) => Promise<T>
 * ): AbortablePromise<T>
 *
 * interface AbortablePromise<T> {
 *   promise: Promise<T>;
 *   abort: () => void;
 *   controller: AbortController;
 *   readonly aborted: boolean;
 * }
 * ```
 */
export const CreateAbortable: Story = {
  render: function Render(): JSX.Element {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'aborted' | 'error'>(
      'idle'
    );
    const [result, setResult] = useState<string | null>(null);
    const abortableRef = useRef<ReturnType<typeof createAbortable<unknown>> | null>(null);

    const handleStart = (): void => {
      // Abort any existing request
      abortableRef.current?.abort();

      setStatus('loading');
      setResult(null);

      const abortable = createAbortable(async (signal) => {
        return simulateFetch(3000, false, signal);
      });

      abortableRef.current = abortable;

      abortable.promise
        .then((data) => {
          setStatus('success');
          setResult(JSON.stringify(data, null, 2));
        })
        .catch((error: Error) => {
          if (error.name === 'AbortError') {
            setStatus('aborted');
            setResult('Request was cancelled');
          } else {
            setStatus('error');
            setResult(error.message);
          }
        });
    };

    const handleAbort = (): void => {
      abortableRef.current?.abort();
    };

    useEffect(() => {
      return () => {
        abortableRef.current?.abort();
      };
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Abortable Promises</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Create cancellable promises with AbortController integration.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginBottom: '1rem' }}>
            Start a 3-second request, then try cancelling it before it completes.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <Button variant="primary" onClick={handleStart} disabled={status === 'loading'}>
              {status === 'loading' ? 'Loading...' : 'Start Request'}
            </Button>
            <Button variant="secondary" onClick={handleAbort} disabled={status !== 'loading'}>
              Cancel Request
            </Button>
          </div>

          {status !== 'idle' && (
            <Alert
              variant={
                status === 'success'
                  ? 'success'
                  : status === 'aborted'
                    ? 'warning'
                    : status === 'error'
                      ? 'danger'
                      : 'info'
              }
            >
              <strong>Status:</strong> {status}
              {result && (
                <pre
                  style={{
                    marginTop: '0.5rem',
                    marginBottom: 0,
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {result}
                </pre>
              )}
            </Alert>
          )}
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bs-info-bg-subtle)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-info-border-subtle)',
          }}
        >
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LightbulbFillIcon size="sm" aria-hidden /> React Pattern
          </strong>
          <pre
            style={{
              marginTop: '0.5rem',
              marginBottom: 0,
              fontSize: '0.75rem',
              overflow: 'auto',
            }}
          >
            {`useEffect(() => {
  const { promise, abort } = createAbortable(async (signal) => {
    const data = await fetch('/api/data', { signal });
    return data.json();
  });

  promise
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });

  return abort; // Cleanup on unmount
}, []);`}
          </pre>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: withTimeout
// ============================================================================

/**
 * ## withTimeout
 *
 * Add timeout limits to any promise. If the operation doesn't complete
 * within the specified time, the promise rejects with a TimeoutError.
 *
 * ### Use Cases
 * - API call timeouts
 * - User experience (show loading states, then error)
 * - Preventing hung operations
 * - Resource cleanup after timeout
 *
 * ### API
 * ```typescript
 * function withTimeout<T>(
 *   promise: Promise<T>,
 *   timeoutMs: number,
 *   options?: WithTimeoutOptions
 * ): Promise<T>
 *
 * interface WithTimeoutOptions {
 *   message?: string;
 *   controller?: AbortController;
 * }
 *
 * class TimeoutError extends Error {
 *   readonly timeout: number;
 * }
 * ```
 */
export const WithTimeoutDemo: Story = {
  name: 'withTimeout',
  render: function Render(): JSX.Element {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'timeout' | 'error'>(
      'idle'
    );
    const [result, setResult] = useState<string | null>(null);
    const [timeoutMs, setTimeoutMs] = useState(2000);
    const [requestDuration, setRequestDuration] = useState(3000);

    const handleRun = async (): Promise<void> => {
      setStatus('loading');
      setResult(null);

      try {
        const data = await withTimeout(simulateFetch(requestDuration), timeoutMs, {
          message: `Request did not complete within ${timeoutMs}ms`,
        });
        setStatus('success');
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        if (error instanceof TimeoutError) {
          setStatus('timeout');
          setResult(`Timed out after ${error.timeout}ms`);
        } else {
          setStatus('error');
          setResult((error as Error).message);
        }
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Promise Timeouts</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Wrap any promise with a timeout to prevent indefinite waiting.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                htmlFor="timeout-slider"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}
              >
                Timeout: {timeoutMs}ms
              </label>
              <input
                id="timeout-slider"
                type="range"
                min={500}
                max={5000}
                step={500}
                value={timeoutMs}
                onChange={(e) => setTimeoutMs(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label
                htmlFor="duration-slider"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}
              >
                Request Duration: {requestDuration}ms
              </label>
              <input
                id="duration-slider"
                type="range"
                min={500}
                max={5000}
                step={500}
                value={requestDuration}
                onChange={(e) => setRequestDuration(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <p
            style={{
              color: 'var(--bs-secondary)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {requestDuration > timeoutMs ? (
              <>
                <ExclamationTriangleFillIcon size="sm" color="var(--bs-danger)" aria-hidden />{' '}
                Request will timeout (duration {'>'} timeout)
              </>
            ) : (
              <>
                <CheckCircleFillIcon size="sm" color="var(--bs-success)" aria-hidden /> Request will
                succeed (duration ≤ timeout)
              </>
            )}
          </p>

          <Button variant="primary" onClick={handleRun} disabled={status === 'loading'}>
            {status === 'loading' ? 'Running...' : 'Run Request'}
          </Button>

          {status !== 'idle' && status !== 'loading' && (
            <Alert
              variant={
                status === 'success' ? 'success' : status === 'timeout' ? 'warning' : 'danger'
              }
              style={{ marginTop: '1rem' }}
            >
              <strong>Result:</strong> {result}
            </Alert>
          )}
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--bs-warning-bg-subtle)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-warning-border-subtle)',
          }}
        >
          <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClockIcon size="sm" aria-hidden /> TimeoutError
          </strong>
          <pre
            style={{
              marginTop: '0.5rem',
              marginBottom: 0,
              fontSize: '0.75rem',
              overflow: 'auto',
            }}
          >
            {`try {
  const data = await withTimeout(fetch('/api/slow'), 5000);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Timed out after', error.timeout, 'ms');
  }
}`}
          </pre>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: retryWithBackoff
// ============================================================================

/**
 * ## retryWithBackoff
 *
 * Retry failed async operations with exponential backoff. Automatically
 * handles transient failures and provides detailed result information.
 *
 * ### Use Cases
 * - Flaky network requests
 * - Rate-limited APIs
 * - Database connection retries
 * - Service availability checks
 *
 * ### API
 * ```typescript
 * function retryWithBackoff<T>(
 *   fn: () => Promise<T>,
 *   options?: RetryWithBackoffOptions
 * ): Promise<RetryResult<T>>
 *
 * interface RetryWithBackoffOptions {
 *   maxAttempts?: number;      // Default: 3
 *   baseDelay?: number;        // Default: 1000ms
 *   multiplier?: number;       // Default: 2
 *   maxDelay?: number;         // Default: 30000ms
 *   jitter?: boolean;          // Default: true
 *   shouldRetry?: (error, attempt) => boolean;
 *   onRetry?: (error, attempt, delay) => void;
 *   signal?: AbortSignal;
 * }
 *
 * interface RetryResult<T> {
 *   success: boolean;
 *   data?: T;
 *   error?: unknown;
 *   attempts: number;
 *   totalTime: number;
 * }
 * ```
 */
export const RetryWithBackoffDemo: Story = {
  name: 'retryWithBackoff',
  render: function Render(): JSX.Element {
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [result, setResult] = useState<{
      success: boolean;
      attempts: number;
      totalTime: number;
    } | null>(null);
    const [failCount, setFailCount] = useState(2);
    const [maxAttempts, setMaxAttempts] = useState(3);
    const controllerRef = useRef<AbortController | null>(null);

    const addLog = (message: string): void => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleRun = async (): Promise<void> => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      setStatus('running');
      setLogs([]);
      setResult(null);

      let attempts = 0;
      const failUntil = failCount;

      addLog(`Starting with ${maxAttempts} max attempts, failing first ${failUntil} attempts`);

      const retryResult = await retryWithBackoff(
        async () => {
          attempts++;
          addLog(`Attempt ${attempts}...`);

          // Simulate delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (attempts <= failUntil) {
            throw new Error(`Simulated failure on attempt ${attempts}`);
          }

          return { message: 'Success!', attempt: attempts };
        },
        {
          maxAttempts,
          baseDelay: 500,
          maxDelay: 2000,
          jitter: true,
          signal: controllerRef.current.signal,
          onRetry: (error, _attempt, delay) => {
            addLog(`Failed: ${(error as Error).message}. Retrying in ${delay}ms...`);
          },
        }
      );

      if (retryResult.success) {
        setStatus('success');
        addLog(
          `[SUCCESS] Success after ${retryResult.attempts} attempts (${retryResult.totalTime}ms)`
        );
      } else {
        setStatus('failed');
        addLog(
          `[FAILED] Failed after ${retryResult.attempts} attempts: ${(retryResult.error as Error).message}`
        );
      }

      setResult(retryResult);
    };

    const handleCancel = (): void => {
      controllerRef.current?.abort();
      addLog('Cancelled by user');
      setStatus('idle');
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Retry with Exponential Backoff</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Automatically retry failed operations with increasing delays between attempts.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Interactive Demo</Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                htmlFor="fail-count"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}
              >
                Failures before success: {failCount}
              </label>
              <input
                id="fail-count"
                type="range"
                min={0}
                max={5}
                value={failCount}
                onChange={(e) => setFailCount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label
                htmlFor="max-attempts"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}
              >
                Max attempts: {maxAttempts}
              </label>
              <input
                id="max-attempts"
                type="range"
                min={1}
                max={5}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <p
            style={{
              color: 'var(--bs-secondary)',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {failCount >= maxAttempts ? (
              <>
                <ExclamationTriangleFillIcon size="sm" color="var(--bs-danger)" aria-hidden /> Will
                exhaust all attempts (failures ≥ max attempts)
              </>
            ) : (
              <>
                <CheckCircleFillIcon size="sm" color="var(--bs-success)" aria-hidden /> Will succeed
                on attempt {failCount + 1}
              </>
            )}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <Button variant="primary" onClick={handleRun} disabled={status === 'running'}>
              {status === 'running' ? 'Running...' : 'Start Retry Demo'}
            </Button>
            <Button variant="secondary" onClick={handleCancel} disabled={status !== 'running'}>
              Cancel
            </Button>
          </div>

          {logs.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--bs-dark)',
                color: 'var(--bs-gray-400)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {logs.map((log) => (
                <div key={log}>{log}</div>
              ))}
            </div>
          )}

          {result && (
            <Alert variant={result.success ? 'success' : 'danger'} style={{ marginTop: '1rem' }}>
              <strong>{result.success ? 'Success!' : 'Failed!'}</strong>
              <br />
              Attempts: {result.attempts} | Total time: {result.totalTime}ms
            </Alert>
          )}
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: exponentialBackoff
// ============================================================================

/**
 * ## exponentialBackoff
 *
 * Calculate exponential backoff delays with optional jitter. Used internally
 * by retryWithBackoff, but also useful for custom retry logic.
 *
 * ### Formula
 * `delay = min(maxDelay, baseDelay * (multiplier ^ attempt)) ± jitter`
 *
 * ### API
 * ```typescript
 * function exponentialBackoff(
 *   attempt: number,
 *   options?: ExponentialBackoffOptions
 * ): number
 *
 * interface ExponentialBackoffOptions {
 *   baseDelay?: number;    // Default: 1000ms
 *   multiplier?: number;   // Default: 2
 *   maxDelay?: number;     // Default: 30000ms
 *   jitter?: boolean;      // Default: true
 *   jitterFactor?: number; // Default: 0.25 (25%)
 * }
 * ```
 */
export const ExponentialBackoffDemo: Story = {
  name: 'exponentialBackoff',
  render: function Render(): JSX.Element {
    const [baseDelay, setBaseDelay] = useState(1000);
    const [multiplier, setMultiplier] = useState(2);
    const [maxDelay, setMaxDelay] = useState(30000);
    const [jitter, setJitter] = useState(true);
    const [delays, setDelays] = useState<number[]>([]);

    const calculateDelays = useCallback((): void => {
      const newDelays: number[] = [];
      for (let attempt = 0; attempt < 8; attempt++) {
        const delay = exponentialBackoff(attempt, {
          baseDelay,
          multiplier,
          maxDelay,
          jitter,
        });
        newDelays.push(delay);
      }
      setDelays(newDelays);
    }, [baseDelay, multiplier, maxDelay, jitter]);

    useEffect(() => {
      calculateDelays();
    }, [calculateDelays]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Exponential Backoff Calculator</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Visualize how backoff delays grow with each retry attempt.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Configuration</Heading>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Base Delay: {baseDelay}ms
                </span>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={baseDelay}
                  onChange={(e) => setBaseDelay(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Multiplier: {multiplier}x
                </span>
                <input
                  type="range"
                  min={1.5}
                  max={4}
                  step={0.5}
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>
                <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Max Delay: {maxDelay}ms
                </span>
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={5000}
                  value={maxDelay}
                  onChange={(e) => setMaxDelay(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={jitter}
                  onChange={(e) => setJitter(e.target.checked)}
                />
                <span style={{ fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>Enable Jitter (±25%)</span>
              </label>
              <p
                style={{ color: 'var(--bs-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}
              >
                Prevents thundering herd problem
              </p>
            </div>
          </div>

          <Button variant="secondary" onClick={calculateDelays}>
            Recalculate (with new jitter)
          </Button>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-white)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Delay Visualization</Heading>

          <div style={{ marginTop: '1rem' }}>
            {delays.map((delay, attempt) => {
              const theoretical = Math.min(maxDelay, baseDelay * multiplier ** attempt);
              const percentage = (delay / maxDelay) * 100;

              return (
                <div
                  key={`attempt-${attempt}-${delay}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ width: '80px', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>Attempt {attempt + 1}</span>
                  <div
                    style={{
                      flex: 1,
                      height: '24px',
                      backgroundColor: 'var(--bs-gray-200)',
                      borderRadius: 'var(--dsai-border-radius-sm)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, percentage)}%`,
                        height: '100%',
                        backgroundColor:
                          delay >= maxDelay ? 'var(--bs-danger)' : 'var(--bs-primary)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <span style={{ width: '120px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    {delay.toLocaleString()}ms
                    {jitter && theoretical !== delay && (
                      <span style={{ color: 'var(--bs-secondary)', fontSize: '0.7rem' }}>
                        {' '}
                        ({delay > theoretical ? '+' : ''}
                        {Math.round(((delay - theoretical) / theoretical) * 100)}%)
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <p
            style={{
              color: 'var(--bs-danger)',
              fontSize: '0.875rem',
              marginTop: '1rem',
              marginBottom: 0,
            }}
          >
            Red bars indicate delays capped at maxDelay ({maxDelay.toLocaleString()}ms)
          </p>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: createTaskQueue
// ============================================================================

/**
 * ## createTaskQueue
 *
 * Create a task queue for managing sequential or concurrent async operations.
 * Supports priority, pause/resume, and progress tracking.
 *
 * ### Use Cases
 * - Sequential animations
 * - Rate-limited API calls
 * - Download/upload queues
 * - Background processing
 *
 * ### API
 * ```typescript
 * function createTaskQueue(options?: TaskQueueOptions): TaskQueue
 *
 * interface TaskQueueOptions {
 *   concurrency?: number;  // Default: 1 (sequential)
 *   autoStart?: boolean;   // Default: true
 * }
 *
 * interface TaskQueue {
 *   enqueue: <T>(fn: () => Promise<T>, priority?: number) => Promise<T>;
 *   pause: () => void;
 *   resume: () => void;
 *   clear: () => void;
 *   getState: () => TaskQueueState;
 *   drain: () => Promise<void>;
 * }
 * ```
 */
export const CreateTaskQueueDemo: Story = {
  name: 'createTaskQueue',
  render: function Render(): JSX.Element {
    const [concurrency, setConcurrency] = useState(1);
    const [logs, setLogs] = useState<string[]>([]);
    const [state, setState] = useState({ pending: 0, running: 0, paused: false });
    const queueRef = useRef<ReturnType<typeof createTaskQueue> | null>(null);

    const addLog = useCallback((message: string): void => {
      setLogs((prev) => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${message}`]);
    }, []);

    const updateState = useCallback((): void => {
      if (queueRef.current) {
        setState(queueRef.current.getState());
      }
    }, []);

    const initQueue = useCallback((): void => {
      queueRef.current = createTaskQueue({ concurrency });
      setLogs([]);
      addLog(`Queue created with concurrency: ${concurrency}`);
      updateState();
    }, [concurrency, addLog, updateState]);

    useEffect(() => {
      initQueue();
    }, [initQueue]);

    const addTask = (priority = 0): void => {
      const taskId = Math.random().toString(36).slice(2, 6).toUpperCase();
      addLog(`Task ${taskId} queued (priority: ${priority})`);

      queueRef.current?.enqueue(async () => {
        addLog(`Task ${taskId} started`);
        updateState();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        addLog(`Task ${taskId} completed`);
        updateState();
      }, priority);

      updateState();
    };

    const handlePause = (): void => {
      queueRef.current?.pause();
      addLog('Queue paused');
      updateState();
    };

    const handleResume = (): void => {
      queueRef.current?.resume();
      addLog('Queue resumed');
      updateState();
    };

    const handleClear = (): void => {
      queueRef.current?.clear();
      addLog('Queue cleared');
      updateState();
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Task Queue</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Manage sequential or concurrent task execution with priority support.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Configuration</Heading>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'var(--dsai-typography-font-weight-medium)' }}>
              <span style={{ display: 'block', marginBottom: '0.5rem' }}>
                Concurrency: {concurrency} task{concurrency > 1 ? 's' : ''} at a time
              </span>
              <input
                type="range"
                min={1}
                max={5}
                value={concurrency}
                onChange={(e) => setConcurrency(Number(e.target.value))}
                style={{ width: '200px' }}
              />
            </label>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <Button variant="primary" onClick={() => addTask(0)}>
              Add Task (Normal)
            </Button>
            <Button variant="secondary" onClick={() => addTask(10)}>
              Add Task (High Priority)
            </Button>
            <Button variant="secondary" onClick={state.paused ? handleResume : handlePause}>
              {state.paused ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="danger" onClick={handleClear}>
              Clear Queue
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '2rem',
              padding: '1rem',
              backgroundColor: 'var(--bs-gray-200)',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <strong>Pending:</strong> {state.pending}
            </div>
            <div>
              <strong>Running:</strong> {state.running}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong>Status:</strong>
              {state.paused ? (
                <>
                  <PauseFillIcon size="sm" aria-hidden /> Paused
                </>
              ) : (
                <>
                  <PlayFillIcon size="sm" aria-hidden /> Active
                </>
              )}
            </div>
          </div>

          {logs.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--bs-dark)',
                color: 'var(--bs-gray-400)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {logs.map((log) => (
                <div key={log}>{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: queueTask
// ============================================================================

/**
 * ## queueTask
 *
 * Schedule tasks using different browser scheduling strategies. Choose the
 * right priority level for your use case.
 *
 * ### Scheduling Strategies
 * - **microtask** - Highest priority, runs after current script (Promise.resolve)
 * - **macrotask** - Runs after microtasks and rendering (setTimeout)
 * - **animationFrame** - Runs before next paint (requestAnimationFrame)
 * - **idle** - Runs when browser is idle (requestIdleCallback)
 *
 * ### API
 * ```typescript
 * function queueTask(
 *   fn: () => void,
 *   options?: QueueTaskOptions
 * ): QueuedTaskHandle
 *
 * interface QueueTaskOptions {
 *   schedule?: 'microtask' | 'macrotask' | 'animationFrame' | 'idle';
 *   idleTimeout?: number;  // Default: 1000ms
 * }
 *
 * interface QueuedTaskHandle {
 *   cancel: () => void;
 * }
 * ```
 */
export const QueueTaskDemo: Story = {
  name: 'queueTask',
  render: function Render(): JSX.Element {
    const [logs, setLogs] = useState<string[]>([]);
    const handlesRef = useRef<Array<{ cancel: () => void }>>([]);

    const addLog = (message: string, color?: string): void => {
      setLogs((prev) => [...prev, JSON.stringify({ time: Date.now(), message, color })]);
    };

    const runDemo = (): void => {
      // Cancel any pending tasks
      handlesRef.current.forEach((h) => {
        h.cancel();
      });
      handlesRef.current = [];
      setLogs([]);

      addLog('▶ Demo started', 'var(--bs-secondary)');
      addLog('1. Synchronous code runs first', 'var(--bs-dark)');

      // Queue tasks in different orders
      handlesRef.current.push(
        queueTask(() => addLog('4. Macrotask (setTimeout)', 'var(--bs-orange)'), {
          schedule: 'macrotask',
        })
      );

      handlesRef.current.push(
        queueTask(() => addLog('2. Microtask (Promise)', 'var(--bs-primary)'), {
          schedule: 'microtask',
        })
      );

      handlesRef.current.push(
        queueTask(() => addLog('3. Animation Frame (rAF)', 'var(--bs-success)'), {
          schedule: 'animationFrame',
        })
      );

      handlesRef.current.push(
        queueTask(() => addLog('5. Idle Callback (when browser is idle)', 'var(--bs-purple)'), {
          schedule: 'idle',
          idleTimeout: 2000,
        })
      );

      addLog('6. More synchronous code', 'var(--bs-dark)');
    };

    const cancelAll = (): void => {
      handlesRef.current.forEach((h) => {
        h.cancel();
      });
      handlesRef.current = [];
      addLog('[CANCELLED] All pending tasks cancelled', 'var(--bs-danger)');
    };

    useEffect(() => {
      return () => {
        handlesRef.current.forEach((h) => {
          h.cancel();
        });
      };
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div>
          <Heading level={3}>Task Scheduling</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
            Schedule tasks with different priorities using browser APIs.
          </p>
        </div>

        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>Execution Order Demo</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginBottom: '1rem' }}>
            See how different scheduling strategies affect execution order.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <Button variant="primary" onClick={runDemo}>
              Run Demo
            </Button>
            <Button variant="secondary" onClick={cancelAll}>
              Cancel All
            </Button>
          </div>

          {logs.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--bs-white)',
                border: '1px solid var(--bs-border-color)',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {logs.map((logJson) => {
                const log = JSON.parse(logJson);
                return (
                  <div
                    key={`${log.time}-${log.message}`}
                    style={{ color: log.color || 'var(--bs-dark)', marginBottom: '0.25rem' }}
                  >
                    {log.message}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bs-primary-bg-subtle)',
              borderRadius: '0.5rem',
              border: '1px solid var(--bs-primary-border-subtle)',
            }}
          >
            <strong
              style={{
                color: 'var(--bs-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CircleFillIcon size="sm" aria-hidden /> Microtask
            </strong>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
              Highest priority. Use for state updates that must happen before next render.
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bs-success-bg-subtle)',
              borderRadius: '0.5rem',
              border: '1px solid var(--bs-success-border-subtle)',
            }}
          >
            <strong
              style={{
                color: 'var(--bs-success)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CircleFillIcon size="sm" aria-hidden /> Animation Frame
            </strong>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
              Synced with display refresh. Use for visual updates and animations.
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bs-warning-bg-subtle)',
              borderRadius: '0.5rem',
              border: '1px solid var(--bs-warning-border-subtle)',
            }}
          >
            <strong
              style={{
                color: 'var(--bs-orange)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CircleFillIcon size="sm" aria-hidden /> Macrotask
            </strong>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
              After rendering. Use for non-urgent work that shouldn't block UI.
            </p>
          </div>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bs-secondary-bg-subtle)',
              borderRadius: '0.5rem',
              border: '1px solid var(--bs-secondary-border-subtle)',
            }}
          >
            <strong
              style={{
                color: 'var(--bs-purple)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CircleFillIcon size="sm" aria-hidden /> Idle
            </strong>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>
              Lowest priority. Use for analytics, prefetching, or background work.
            </p>
          </div>
        </div>
      </div>
    );
  },
};

// ============================================================================
// Story: API Reference
// ============================================================================

/**
 * ## API Reference
 *
 * Complete API documentation for all async utilities.
 */
export const APIReference: Story = {
  render: function Render(): JSX.Element {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
        <div>
          <Heading level={3}>Async Utilities API Reference</Heading>
          <p style={{ color: 'var(--bs-secondary)', marginTop: '0.5rem' }}>
            Complete type definitions and usage examples for all async utilities.
          </p>
        </div>

        {/* createAbortable */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>createAbortable</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { createAbortable } from '@dsai-io/react';

// Create an abortable fetch request
const { promise, abort, controller, aborted } = createAbortable(
  async (signal) => {
    const response = await fetch('/api/data', { signal });
    return response.json();
  }
);

// Abort after 5 seconds
setTimeout(abort, 5000);

// Or abort manually
abort();

// Check status
console.log(aborted); // true after abort() is called`}
          </pre>
        </div>

        {/* withTimeout */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>withTimeout</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { withTimeout, TimeoutError } from '@dsai-io/react';

try {
  // Timeout after 5 seconds
  const data = await withTimeout(
    fetch('/api/slow-endpoint'),
    5000,
    { message: 'API request timed out' }
  );
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log(\`Timed out after \${error.timeout}ms\`);
  }
}

// With AbortController for cleanup
const controller = new AbortController();
await withTimeout(
  fetch('/api/data', { signal: controller.signal }),
  5000,
  { controller } // Controller is aborted on timeout
);`}
          </pre>
        </div>

        {/* retryWithBackoff */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>retryWithBackoff</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { retryWithBackoff } from '@dsai-io/react';

const result = await retryWithBackoff(
  () => fetch('/api/flaky-endpoint').then(r => r.json()),
  {
    maxAttempts: 5,
    baseDelay: 1000,
    multiplier: 2,
    maxDelay: 10000,
    jitter: true,
    shouldRetry: (error) => error.status !== 404,
    onRetry: (error, attempt, delay) => {
      console.log(\`Retry \${attempt} in \${delay}ms\`);
    },
    signal: abortController.signal
  }
);

if (result.success) {
  console.log('Data:', result.data);
  console.log('Attempts:', result.attempts);
  console.log('Total time:', result.totalTime);
} else {
  console.error('Failed:', result.error);
}`}
          </pre>
        </div>

        {/* exponentialBackoff */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>exponentialBackoff</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { exponentialBackoff } from '@dsai-io/react';

// Default: 1000, 2000, 4000, 8000... (capped at 30000)
exponentialBackoff(0); // ~1000ms
exponentialBackoff(1); // ~2000ms
exponentialBackoff(2); // ~4000ms

// Custom configuration
exponentialBackoff(2, {
  baseDelay: 500,
  multiplier: 3,
  maxDelay: 10000,
  jitter: true,
  jitterFactor: 0.25
});

// Deterministic (no jitter)
exponentialBackoff(3, { jitter: false }); // Exactly 8000ms`}
          </pre>
        </div>

        {/* createTaskQueue */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>createTaskQueue</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { createTaskQueue } from '@dsai-io/react';

// Sequential queue (default)
const queue = createTaskQueue();

// Concurrent queue
const parallelQueue = createTaskQueue({ concurrency: 3 });

// Add tasks
queue.enqueue(() => fetch('/api/1').then(r => r.json()));
queue.enqueue(() => fetch('/api/2').then(r => r.json()));

// With priority (higher runs first)
queue.enqueue(() => urgentTask(), 10);
queue.enqueue(() => normalTask(), 0);

// Control flow
queue.pause();
queue.resume();
queue.clear();

// Monitor state
const state = queue.getState();
// { pending: 2, running: 1, paused: false, processing: true }

// Wait for completion
await queue.drain();`}
          </pre>
        </div>

        {/* queueTask */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-gray-100)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-border-color)',
          }}
        >
          <Heading level={4}>queueTask</Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import { queueTask } from '@dsai-io/react';

// Microtask (default) - highest priority
queueTask(() => console.log('After current script'));

// Macrotask - after microtasks and rendering
queueTask(() => console.log('After render'), { schedule: 'macrotask' });

// Animation Frame - before next paint
queueTask(() => updateVisuals(), { schedule: 'animationFrame' });

// Idle - when browser is idle
queueTask(() => sendAnalytics(), {
  schedule: 'idle',
  idleTimeout: 2000
});

// Cancellation
const handle = queueTask(() => maybeRun(), { schedule: 'macrotask' });
handle.cancel();`}
          </pre>
        </div>

        {/* Import summary */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bs-info-bg-subtle)',
            borderRadius: '0.5rem',
            border: '1px solid var(--bs-info-border-subtle)',
          }}
        >
          <Heading level={4}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BoxIcon aria-hidden /> Import Summary
            </span>
          </Heading>
          <pre
            style={{
              backgroundColor: 'var(--bs-dark)',
              color: 'var(--bs-gray-400)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {`import {
  // Abort utilities
  createAbortable,
  type AbortablePromise,

  // Timeout utilities
  withTimeout,
  TimeoutError,
  type WithTimeoutOptions,

  // Retry utilities
  retryWithBackoff,
  exponentialBackoff,
  type RetryResult,
  type RetryWithBackoffOptions,
  type ExponentialBackoffOptions,

  // Task queue utilities
  createTaskQueue,
  type TaskQueue,
  type TaskQueueOptions,
  type TaskQueueState,
  type QueuedTask,
  type TaskFunction,

  // Task scheduling utilities
  queueTask,
  type QueueTaskOptions,
  type QueuedTaskHandle,
  type TaskSchedule,
} from '@dsai-io/react';`}
          </pre>
        </div>
      </div>
    );
  },
};
