/**
 * Type definitions for useReducedMotion hook
 */

/**
 * Options for the useReducedMotion hook
 */
export interface UseReducedMotionOptions {
  /**
   * Default value to return during server-side rendering (SSR).
   * Since the matchMedia API is not available on the server,
   * this value will be used until the component hydrates on the client.
   *
   * @default false
   *
   * @example
   * ```tsx
   * // Return true during SSR (animations off by default)
   * const prefersReducedMotion = useReducedMotion({ defaultValue: true });
   * ```
   */
  defaultValue?: boolean;
}
