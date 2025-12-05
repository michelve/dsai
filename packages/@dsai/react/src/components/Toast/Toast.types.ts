import type { CSSProperties, ReactNode } from 'react';

/**
 * Toast position options
 * Controls where toasts are rendered in the viewport
 *
 * @see https://getbootstrap.com/docs/5.3/components/toasts/#placement
 */
export type ToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'middle-start'
  | 'middle-center'
  | 'middle-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

/**
 * Toast variant types
 * Maps to Bootstrap contextual classes for visual differentiation
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

/**
 * Toast visibility states for FSM
 *
 * States:
 * - hidden: Toast is not rendered
 * - entering: Toast is animating in
 * - visible: Toast is fully visible
 * - exiting: Toast is animating out
 */
export type ToastVisibility = 'hidden' | 'entering' | 'visible' | 'exiting';

/**
 * Toast visual state for data-visual-state attribute
 */
export type ToastVisualState = 'hidden' | 'showing' | 'visible' | 'hiding';

/**
 * Toast FSM state
 */
export interface ToastFSMState {
  readonly visibility: ToastVisibility;
  readonly shouldRender: boolean;
}

/**
 * Toast FSM events
 */
export type ToastFSMEvent =
  | { readonly type: 'SHOW' }
  | { readonly type: 'HIDE' }
  | { readonly type: 'ANIMATION_END' }
  | { readonly type: 'DISMISS' };

/**
 * Whitelisted HTML attributes for safe prop spreading in Toast component
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 */
export interface SafeToastHTMLAttributes {
  /**
   * Additional CSS class names (sanitized)
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Data attributes for testing (sanitized)
   */
  'data-testid'?: string;
  'data-test'?: string;

  /**
   * Custom accessible label (only forwarded when no title is present)
   */
  'aria-label'?: string;
}

/**
 * Individual toast data structure
 * Used by ToastProvider to manage toast queue
 */
export interface ToastData {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Toast variant/type
   * @default 'default'
   */
  variant?: ToastVariant;

  /**
   * Toast title/header
   */
  title?: ReactNode;

  /**
   * Toast message content
   */
  message: ReactNode;

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 or false to disable auto-dismiss
   * @default 5000
   */
  duration?: number | false;

  /**
   * Whether to show the close button
   * @default true
   */
  dismissible?: boolean;

  /**
   * Custom icon to display
   * If not provided, variant-based icon is used
   */
  icon?: ReactNode;

  /**
   * Whether to show progress bar for auto-dismiss
   * @default false
   */
  showProgress?: boolean;

  /**
   * Callback when toast is closed
   */
  onClose?: () => void;

  /**
   * Callback when toast is opened/shown
   */
  onOpen?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Options when creating a toast via useToast hook
 */
export type ToastOptions = Omit<ToastData, 'id' | 'message'>;

/**
 * Toast component props
 *
 * @example
 * ```tsx
 * // Basic toast
 * <Toast message="File saved successfully" variant="success" />
 *
 * // Toast with title
 * <Toast
 *   title="Update Available"
 *   message="A new version is ready to install."
 *   variant="info"
 * />
 *
 * // Auto-dismissing toast
 * <Toast
 *   message="Changes saved"
 *   variant="success"
 *   duration={3000}
 *   onClose={() => console.log('closed')}
 * />
 * ```
 */
export interface ToastProps extends SafeToastHTMLAttributes {
  /**
   * Toast message content
   */
  message: ReactNode;

  /**
   * Toast title/header (optional)
   */
  title?: ReactNode;

  /**
   * Toast variant for styling
   * @default 'default'
   */
  variant?: ToastVariant;

  /**
   * Whether the toast is visible
   * @default true
   */
  show?: boolean;

  /**
   * Whether the toast can be dismissed
   * @default true
   */
  dismissible?: boolean;

  /**
   * Auto-dismiss duration in milliseconds
   * Set to 0 or false to disable auto-dismiss
   * @default 5000
   */
  duration?: number | false;

  /**
   * Whether to show progress bar for auto-dismiss countdown
   * @default false
   */
  showProgress?: boolean;

  /**
   * Custom icon to display
   * If not provided, variant-based default icon is used
   */
  icon?: ReactNode;

  /**
   * Callback when toast is dismissed
   */
  onClose?: () => void;

  /**
   * Callback when toast becomes visible
   */
  onOpen?: () => void;

  /**
   * Accessible label for close button
   * @default 'Close notification'
   */
  closeButtonLabel?: string;

  /**
   * Animation duration in milliseconds
   * @default 150
   */
  animationDuration?: number;
}

/**
 * ToastContainer component props
 *
 * @example
 * ```tsx
 * // Container at top-right
 * <ToastContainer position="top-end">
 *   <Toast message="Notification" />
 * </ToastContainer>
 *
 * // Container at bottom-center
 * <ToastContainer position="bottom-center">
 *   {toasts.map(t => <Toast key={t.id} {...t} />)}
 * </ToastContainer>
 * ```
 */
export interface ToastContainerProps {
  /**
   * Toast children to render
   */
  children: ReactNode;

  /**
   * Position of the container
   * @default 'top-end'
   */
  position?: ToastPosition;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Container ID
   */
  id?: string;

  /**
   * Data attribute for testing
   */
  'data-testid'?: string;
  'data-test'?: string;

  /**
   * Gap between toasts in pixels
   * @default 12
   */
  gap?: number;
}

/**
 * ToastProvider props
 *
 * @example
 * ```tsx
 * // Wrap your app with ToastProvider
 * <ToastProvider position="top-end" maxToasts={5}>
 *   <App />
 * </ToastProvider>
 *
 * // Use the hook in any component
 * function MyComponent() {
 *   const toast = useToast();
 *   return (
 *     <button onClick={() => toast.success('Saved!')}>
 *       Save
 *     </button>
 *   );
 * }
 * ```
 */
export interface ToastProviderProps {
  /**
   * Children to render
   */
  children: ReactNode;

  /**
   * Default position for toasts
   * @default 'top-end'
   */
  position?: ToastPosition;

  /**
   * Maximum number of toasts to show at once
   * Older toasts are dismissed when limit is reached
   * @default 5
   */
  maxToasts?: number;

  /**
   * Default duration for auto-dismiss in milliseconds
   * @default 5000
   */
  defaultDuration?: number;

  /**
   * Gap between stacked toasts in pixels
   * @default 12
   */
  gap?: number;

  /**
   * Container ID for the toast container
   */
  containerId?: string;

  /**
   * Whether to pause auto-dismiss on hover
   * @default true
   */
  pauseOnHover?: boolean;
}

/**
 * Toast context value for useToast hook
 */
export interface ToastContextValue {
  /**
   * Show a success toast
   */
  success: (message: ReactNode, options?: ToastOptions) => string;

  /**
   * Show an error toast
   */
  error: (message: ReactNode, options?: ToastOptions) => string;

  /**
   * Show a warning toast
   */
  warning: (message: ReactNode, options?: ToastOptions) => string;

  /**
   * Show an info toast
   */
  info: (message: ReactNode, options?: ToastOptions) => string;

  /**
   * Show a default toast
   */
  toast: (message: ReactNode, options?: ToastOptions) => string;

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (id: string) => void;

  /**
   * Dismiss all toasts
   */
  dismissAll: () => void;

  /**
   * Update an existing toast
   */
  update: (id: string, data: Partial<ToastData>) => void;

  /**
   * Current list of active toasts
   */
  toasts: ToastData[];
}
