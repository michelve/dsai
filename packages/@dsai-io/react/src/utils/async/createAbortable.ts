/**
 * @file createAbortable - Make promise cancellable with AbortController
 * @module @dsai-io/react/utils/async
 *
 * Enterprise-grade abortable promise wrapper with:
 * - AbortController integration
 * - Automatic cleanup
 * - Type-safe cancellation
 * - React-friendly API
 */

/**
 * Result of createAbortable
 */
export interface AbortablePromise<T> {
  /** The wrapped promise */
  promise: Promise<T>;
  /** Function to abort the operation */
  abort: () => void;
  /** The underlying AbortController */
  controller: AbortController;
  /** Whether the operation has been aborted */
  readonly aborted: boolean;
}

/**
 * Create a cancellable promise wrapper
 *
 * Wraps an async operation to make it cancellable via AbortController.
 * When aborted, the promise rejects with an AbortError.
 *
 * @param fn - Async function that receives an AbortSignal
 * @returns Object with promise, abort function, and controller
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { promise, abort } = createAbortable(async (signal) => {
 *   const response = await fetch('/api/data', { signal });
 *   return response.json();
 * });
 *
 * // Abort after 5 seconds
 * setTimeout(abort, 5000);
 *
 * try {
 *   const data = await promise;
 *   console.log('Data:', data);
 * } catch (error) {
 *   if (error.name === 'AbortError') {
 *     console.log('Request was cancelled');
 *   }
 * }
 *
 * // In React useEffect
 * useEffect(() => {
 *   const { promise, abort } = createAbortable(async (signal) => {
 *     const data = await fetchData({ signal });
 *     setData(data);
 *   });
 *
 *   promise.catch(error => {
 *     if (error.name !== 'AbortError') {
 *       setError(error);
 *     }
 *   });
 *
 *   return abort; // Cleanup on unmount
 * }, []);
 *
 * // With multiple fetch calls
 * const { promise, abort } = createAbortable(async (signal) => {
 *   const [users, posts] = await Promise.all([
 *     fetch('/api/users', { signal }).then(r => r.json()),
 *     fetch('/api/posts', { signal }).then(r => r.json())
 *   ]);
 *   return { users, posts };
 * });
 *
 * // Custom abort reason
 * const { promise, controller } = createAbortable(async (signal) => {
 *   // Long running operation
 * });
 *
 * controller.abort('User cancelled');
 * ```
 */
export function createAbortable<T>(fn: (signal: AbortSignal) => Promise<T>): AbortablePromise<T> {
  const controller = new AbortController();

  const promise = new Promise<T>((resolve, reject) => {
    // Check if already aborted
    if (controller.signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    // Listen for abort
    const abortHandler = (): void => {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    controller.signal.addEventListener('abort', abortHandler, { once: true });

    // Execute the function
    fn(controller.signal)
      .then((result) => {
        controller.signal.removeEventListener('abort', abortHandler);
        resolve(result);
      })
      .catch((error) => {
        controller.signal.removeEventListener('abort', abortHandler);
        reject(error);
      });
  });

  return {
    promise,
    abort: () => controller.abort(),
    controller,
    get aborted() {
      return controller.signal.aborted;
    },
  };
}
