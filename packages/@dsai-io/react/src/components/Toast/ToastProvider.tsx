import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';

import type { ToastContextValue, ToastData, ToastOptions, ToastProviderProps } from './Toast.types';
import type { ReactNode } from 'react';

/**
 * Default maximum number of toasts
 */
const DEFAULT_MAX_TOASTS = 5;

/**
 * Default auto-dismiss duration in milliseconds
 */
const DEFAULT_DURATION_MS = 5000;

/**
 * Generate a unique ID for a toast
 * Prefers crypto-backed UUID; falls back to monotonic counter for deterministic uniqueness.
 */
let toastCounter = 0;
function generateToastId(): string {
  const cryptoUUID =
    typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : null;

  if (cryptoUUID) {
    return `toast-${cryptoUUID}`;
  }

  toastCounter += 1;
  return `toast-${Date.now()}-${toastCounter}`;
}

/**
 * Toast queue reducer state
 */
interface ToastQueueState {
  toasts: ToastData[];
}

/**
 * Toast queue reducer actions
 */
type ToastQueueAction =
  | { type: 'ADD_TOAST'; toast: ToastData }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'REMOVE_ALL' }
  | { type: 'UPDATE_TOAST'; id: string; data: Partial<ToastData> };

/**
 * Toast queue reducer
 */
function toastQueueReducer(state: ToastQueueState, action: ToastQueueAction): ToastQueueState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
    case 'REMOVE_ALL':
      return {
        ...state,
        toasts: [],
      };
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.id ? { ...t, ...action.data } : t)),
      };
    default:
      return state;
  }
}

/**
 * Toast Context
 */
const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * ToastProvider Component
 *
 * Provides toast functionality throughout the component tree via React Context.
 * Manages toast queue, positioning, and auto-dismiss functionality.
 *
 * FEATURES:
 * - Queue management with configurable max toasts
 * - Position customization (top-start, top-center, top-end, etc.)
 * - Configurable auto-dismiss duration
 * - Imperative API via useToast hook
 *
 * @example
 * ```tsx
 * // Wrap your app with ToastProvider
 * function App() {
 *   return (
 *     <ToastProvider position="top-end" maxToasts={5}>
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 *
 * // Use the hook in any component
 * function SaveButton() {
 *   const toast = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast.success('Saved successfully!');
 *     } catch (error) {
 *       toast.error('Failed to save');
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function ToastProvider({
  children,
  position = 'top-end',
  maxToasts = DEFAULT_MAX_TOASTS,
  defaultDuration = DEFAULT_DURATION_MS,
  gap = 12,
  containerId,
  pauseOnHover = true,
  pauseOnFocusLoss = true,
}: ToastProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(toastQueueReducer, { toasts: [] });

  // Add a toast
  const addToast = useCallback(
    (message: ReactNode, options?: ToastOptions): string => {
      const id = generateToastId();
      const toast: ToastData = {
        id,
        message,
        variant: options?.variant ?? 'default',
        title: options?.title,
        duration: options?.duration ?? defaultDuration,
        dismissible: options?.dismissible ?? true,
        icon: options?.icon,
        showProgress: options?.showProgress ?? false,
        onClose: options?.onClose,
        onOpen: options?.onOpen,
        className: options?.className,
      };

      dispatch({ type: 'ADD_TOAST', toast });

      // Remove oldest toasts if exceeding max
      if (state.toasts.length >= maxToasts) {
        const oldestId = state.toasts[0]?.id;
        if (oldestId) {
          dispatch({ type: 'REMOVE_TOAST', id: oldestId });
        }
      }

      return id;
    },
    [defaultDuration, maxToasts, state.toasts]
  );

  // Success toast
  const success = useCallback(
    (message: ReactNode, options?: ToastOptions): string => {
      return addToast(message, { ...options, variant: 'success' });
    },
    [addToast]
  );

  // Error toast
  const error = useCallback(
    (message: ReactNode, options?: ToastOptions): string => {
      return addToast(message, { ...options, variant: 'error' });
    },
    [addToast]
  );

  // Warning toast
  const warning = useCallback(
    (message: ReactNode, options?: ToastOptions): string => {
      return addToast(message, { ...options, variant: 'warning' });
    },
    [addToast]
  );

  // Info toast
  const info = useCallback(
    (message: ReactNode, options?: ToastOptions): string => {
      return addToast(message, { ...options, variant: 'info' });
    },
    [addToast]
  );

  // Dismiss a specific toast
  const dismiss = useCallback((id: string): void => {
    dispatch({ type: 'REMOVE_TOAST', id });
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback((): void => {
    dispatch({ type: 'REMOVE_ALL' });
  }, []);

  // Update an existing toast
  const update = useCallback((id: string, data: Partial<ToastData>): void => {
    dispatch({ type: 'UPDATE_TOAST', id, data });
  }, []);

  // Handle individual toast close
  const handleToastClose = useCallback(
    (toastData: ToastData): void => {
      toastData.onClose?.();
      dismiss(toastData.id);
    },
    [dismiss]
  );

  // Context value
  const contextValue = useMemo<ToastContextValue>(
    () => ({
      toast: addToast,
      success,
      error,
      warning,
      info,
      dismiss,
      dismissAll,
      update,
      toasts: state.toasts,
    }),
    [addToast, success, error, warning, info, dismiss, dismissAll, update, state.toasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} gap={gap} id={containerId} data-testid="toast-container">
        {state.toasts.map((toastData) => (
          <Toast
            key={toastData.id}
            id={toastData.id}
            message={toastData.message}
            title={toastData.title}
            variant={toastData.variant}
            duration={toastData.duration}
            dismissible={toastData.dismissible}
            icon={toastData.icon}
            showProgress={toastData.showProgress}
            onClose={() => handleToastClose(toastData)}
            onOpen={toastData.onOpen}
            className={toastData.className}
            pauseOnHover={pauseOnHover}
            pauseOnFocusLoss={pauseOnFocusLoss}
            data-testid={`toast-${toastData.id}`}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';

/**
 * useToast Hook
 *
 * Access the toast API from any component within a ToastProvider.
 *
 * @returns Toast context with methods to create and manage toasts
 * @throws Error if used outside of ToastProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   return (
 *     <div>
 *       <button onClick={() => toast.success('Success!')}>
 *         Show Success
 *       </button>
 *       <button onClick={() => toast.error('Error!')}>
 *         Show Error
 *       </button>
 *       <button onClick={() => toast.dismissAll()}>
 *         Dismiss All
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
