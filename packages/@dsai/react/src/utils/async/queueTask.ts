/**
 * @file queueTask - Simple task scheduler using microtasks/macrotasks
 * @module @dsai/react/utils/async
 *
 * Enterprise-grade task scheduling with:
 * - Microtask (Promise-based) scheduling
 * - Macrotask (setTimeout-based) scheduling
 * - RequestAnimationFrame scheduling
 * - Idle callback scheduling
 */

/**
 * Task scheduling strategy
 */
export type TaskSchedule = 'microtask' | 'macrotask' | 'animationFrame' | 'idle';

/**
 * Options for queueTask
 */
export interface QueueTaskOptions {
  /** Scheduling strategy (default: 'microtask') */
  schedule?: TaskSchedule;
  /** Timeout for idle callback in ms (default: 1000) */
  idleTimeout?: number;
}

/**
 * Queued task handle for cancellation
 */
export interface QueuedTaskHandle {
  /** Cancel the queued task */
  cancel: () => void;
}

/**
 * Queue a task for later execution
 *
 * Provides different scheduling strategies for various use cases:
 * - microtask: Highest priority, runs after current script
 * - macrotask: Runs after microtasks and rendering
 * - animationFrame: Runs before next paint (for visual updates)
 * - idle: Runs when browser is idle (for non-critical work)
 *
 * @param fn - Function to execute
 * @param options - Scheduling options
 * @returns Handle with cancel method
 *
 * @example
 * ```tsx
 * // Microtask (default) - runs after current synchronous code
 * queueTask(() => {
 *   console.log('Runs in microtask');
 * });
 *
 * // Macrotask - runs after microtasks and rendering
 * queueTask(() => {
 *   console.log('Runs in macrotask');
 * }, { schedule: 'macrotask' });
 *
 * // Animation frame - for visual updates
 * queueTask(() => {
 *   element.style.transform = 'translateX(100px)';
 * }, { schedule: 'animationFrame' });
 *
 * // Idle callback - for non-critical work
 * queueTask(() => {
 *   performAnalytics();
 * }, { schedule: 'idle', idleTimeout: 2000 });
 *
 * // With cancellation
 * const handle = queueTask(() => {
 *   console.log('This might not run');
 * }, { schedule: 'macrotask' });
 *
 * handle.cancel(); // Cancels the task
 *
 * // In React component
 * useEffect(() => {
 *   const handle = queueTask(() => {
 *     // Update after paint
 *     measureElement();
 *   }, { schedule: 'animationFrame' });
 *
 *   return () => handle.cancel();
 * }, []);
 *
 * // Batch DOM updates
 * function batchUpdate(updates: (() => void)[]) {
 *   queueTask(() => {
 *     updates.forEach(update => update());
 *   }, { schedule: 'animationFrame' });
 * }
 * ```
 */
export function queueTask(fn: () => void, options: QueueTaskOptions = {}): QueuedTaskHandle {
  const { schedule = 'microtask', idleTimeout = 1000 } = options;

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let rafId: number | undefined;
  let idleId: number | undefined;

  const wrappedFn = (): void => {
    if (!cancelled) {
      fn();
    }
  };

  switch (schedule) {
    case 'microtask':
      // Use queueMicrotask for highest priority async
      queueMicrotask(wrappedFn);
      break;

    case 'macrotask':
      // Use setTimeout(0) for macrotask
      timeoutId = setTimeout(wrappedFn, 0);
      break;

    case 'animationFrame':
      // Use requestAnimationFrame for visual updates
      if (typeof requestAnimationFrame !== 'undefined') {
        rafId = requestAnimationFrame(wrappedFn);
      } else {
        // Fallback for SSR
        timeoutId = setTimeout(wrappedFn, 16);
      }
      break;

    case 'idle':
      // Use requestIdleCallback for non-critical work
      if (typeof requestIdleCallback !== 'undefined') {
        idleId = requestIdleCallback(wrappedFn, { timeout: idleTimeout });
      } else {
        // Fallback for browsers without requestIdleCallback
        timeoutId = setTimeout(wrappedFn, 1);
      }
      break;

    default:
      console.warn(`[queueTask] Unknown schedule: ${schedule}, using microtask`);
      queueMicrotask(wrappedFn);
  }

  return {
    cancel(): void {
      cancelled = true;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      if (rafId !== undefined && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(rafId);
      }

      if (idleId !== undefined && typeof cancelIdleCallback !== 'undefined') {
        cancelIdleCallback(idleId);
      }
    },
  };
}
