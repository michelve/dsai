/**
 * State of an async operation.
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * State interface for async operations.
 */
export interface AsyncState<T, E = Error> {
  /** Current status of the async operation */
  status: AsyncStatus;
  /** Result data when status is 'success' */
  data: T | null;
  /** Error when status is 'error' */
  error: E | null;
  /** Whether the operation is currently loading */
  isLoading: boolean;
  /** Whether the operation succeeded */
  isSuccess: boolean;
  /** Whether the operation failed */
  isError: boolean;
  /** Whether the operation is idle (not started) */
  isIdle: boolean;
}

/**
 * Return value of useAsync hook.
 */
export interface UseAsyncReturn<T, E = Error> extends AsyncState<T, E> {
  /** Execute the async function */
  execute: () => Promise<T | null>;
  /** Reset to idle state */
  reset: () => void;
  /** Set data directly */
  setData: (data: T | null) => void;
  /** Set error directly */
  setError: (error: E | null) => void;
}
