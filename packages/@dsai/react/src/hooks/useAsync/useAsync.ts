import { useCallback, useEffect, useRef, useState } from 'react';

import type { AsyncState, AsyncStatus, UseAsyncReturn } from './useAsync.types';

/**
 * Manages async operations with loading, success, and error states.
 *
 * This hook provides a state machine for async operations, handling all
 * the common states (idle, loading, success, error) and preventing race
 * conditions and memory leaks.
 *
 * **Key Features**:
 * - Automatic loading/success/error state management
 * - Race condition prevention
 * - Memory leak prevention (cancels on unmount)
 * - Manual execution control
 * - Reset functionality
 * - Type-safe error handling
 *
 * **Use Cases**:
 * - API calls
 * - Data fetching
 * - Form submissions
 * - Any async operation
 *
 * @template T - The type of data returned by the async function
 * @template E - The type of error (defaults to Error)
 * @param asyncFunction - The async function to execute
 * @param immediate - Whether to execute immediately on mount (default: false)
 * @returns Async state and control functions
 *
 * @example
 * ```tsx
 * // Basic API call
 * function UserProfile({ userId }: { userId: string }) {
 *   const fetchUser = useCallback(
 *     () => fetch(`/api/users/${userId}`).then(res => res.json()),
 *     [userId]
 *   );
 *
 *   const { data, isLoading, isError, error, execute } = useAsync(fetchUser, true);
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (isError) {
 *     return <div>Error: {error?.message}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>{data?.name}</h1>
 *       <button onClick={execute}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Form submission with manual execution
 * function CreateUserForm() {
 *   const [name, setName] = useState('');
 *
 *   const createUser = useCallback(
 *     () => fetch('/api/users', {
 *       method: 'POST',
 *       body: JSON.stringify({ name }),
 *     }).then(res => res.json()),
 *     [name]
 *   );
 *
 *   const { execute, isLoading, isSuccess, error, reset } = useAsync(createUser);
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     await execute();
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={name} onChange={e => setName(e.target.value)} />
 *       <button disabled={isLoading}>
 *         {isLoading ? 'Creating...' : 'Create User'}
 *       </button>
 *       {isSuccess && <div>User created!</div>}
 *       {error && <div>Error: {error.message}</div>}
 *       {isSuccess && <button onClick={reset}>Create Another</button>}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom error type
 * interface ApiError {
 *   code: string;
 *   message: string;
 *   details?: Record<string, string[]>;
 * }
 *
 * function DataFetcher() {
 *   const fetchData = useCallback(
 *     () => fetch('/api/data')
 *       .then(res => res.ok ? res.json() : Promise.reject(res))
 *       .catch(async (res) => {
 *         const error: ApiError = await res.json();
 *         throw error;
 *       }),
 *     []
 *   );
 *
 *   const { data, error, isError } = useAsync<DataType, ApiError>(fetchData, true);
 *
 *   if (isError && error) {
 *     return (
 *       <div>
 *         <p>Error {error.code}: {error.message}</p>
 *         {error.details && (
 *           <ul>
 *             {Object.entries(error.details).map(([field, errors]) => (
 *               <li key={field}>{field}: {errors.join(', ')}</li>
 *             ))}
 *           </ul>
 *         )}
 *       </div>
 *     );
 *   }
 *
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 * ```
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = false
): UseAsyncReturn<T, E> {
  const [state, setState] = useState<AsyncState<T, E>>({
    status: 'idle',
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isIdle: true,
  });

  // Track if component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  // Track current execution to handle race conditions
  const executionIdRef = useRef(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setStatus = useCallback((status: AsyncStatus) => {
    if (!mountedRef.current) {
      return;
    }

    setState((prev) => ({
      ...prev,
      status,
      isLoading: status === 'loading',
      isSuccess: status === 'success',
      isError: status === 'error',
      isIdle: status === 'idle',
    }));
  }, []);

  const setData = useCallback((data: T | null) => {
    if (!mountedRef.current) {
      return;
    }

    setState((prev) => ({
      ...prev,
      data,
      status: data !== null ? 'success' : 'idle',
      isLoading: false,
      isSuccess: data !== null,
      isError: false,
      isIdle: data === null,
    }));
  }, []);

  const setError = useCallback((error: E | null) => {
    if (!mountedRef.current) {
      return;
    }

    setState((prev) => ({
      ...prev,
      error,
      status: error !== null ? 'error' : 'idle',
      isLoading: false,
      isSuccess: false,
      isError: error !== null,
      isIdle: error === null,
    }));
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    // Increment execution ID to track this specific execution
    executionIdRef.current += 1;
    const currentExecutionId = executionIdRef.current;

    setStatus('loading');

    try {
      const data = await asyncFunction();

      // Only update state if this is still the latest execution and component is mounted
      if (currentExecutionId === executionIdRef.current && mountedRef.current) {
        setState({
          status: 'success',
          data,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
          isIdle: false,
        });
        return data;
      }

      return null;
    } catch (error) {
      // Only update state if this is still the latest execution and component is mounted
      if (currentExecutionId === executionIdRef.current && mountedRef.current) {
        setState({
          status: 'error',
          data: null,
          error: error as E,
          isLoading: false,
          isSuccess: false,
          isError: true,
          isIdle: false,
        });
      }

      return null;
    }
  }, [asyncFunction, setStatus]);

  const reset = useCallback(() => {
    // Increment execution ID to cancel any pending operations
    executionIdRef.current += 1;

    if (!mountedRef.current) {
      return;
    }

    setState({
      status: 'idle',
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
      isIdle: true,
    });
  }, []);

  // Execute immediately on mount if requested
  useEffect(() => {
    if (immediate) {
      void execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}
