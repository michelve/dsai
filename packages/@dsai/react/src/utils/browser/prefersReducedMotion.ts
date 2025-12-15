import { isBrowser } from './isBrowser';

/**
 * Options for prefersReducedMotion utility
 */
export interface PrefersReducedMotionOptions {
  /**
   * Default value to return when detection is unavailable (SSR, missing matchMedia).
   * Use `true` for a conservative default that respects potential motion sensitivity.
   * @default false
   */
  defaultValue?: boolean;
  /**
   * Custom matchMedia function for testing or specialized environments.
   * If not provided, uses `window.matchMedia`.
   */
  matchMedia?: (query: string) => MediaQueryList | null;
  /**
   * Custom media query string.
   * @default '(prefers-reduced-motion: reduce)'
   */
  query?: string;
}

/**
 * prefersReducedMotion - Detects user preference for reduced motion.
 *
 * Safe for SSR; returns the configured default when matchMedia is unavailable or throws.
 * Use this to gate animations, transitions, and auto-playing content.
 *
 * @param options - Configuration options
 * @returns `true` if user prefers reduced motion, `false` otherwise (or the default value)
 *
 * @remarks
 * - Returns `defaultValue` (default: `false`) when detection is unavailable.
 * - For critical accessibility flows, consider `defaultValue: true` to err on the side of caution.
 * - Pair with `useReducedMotion` hook for reactive component behavior.
 *
 * @example
 * ```tsx
 * // Basic usage - gate animations
 * const shouldAnimate = !prefersReducedMotion();
 *
 * // Conservative default for critical flows
 * const shouldAnimate = !prefersReducedMotion({ defaultValue: true });
 *
 * // In a component with animation
 * function AnimatedComponent() {
 *   const reduceMotion = useReducedMotion();
 *   return (
 *     <motion.div
 *       animate={{ opacity: 1 }}
 *       transition={{ duration: reduceMotion ? 0 : 0.3 }}
 *     />
 *   );
 * }
 * ```
 */
export function prefersReducedMotion(options: PrefersReducedMotionOptions = {}): boolean {
  const {
    defaultValue = false,
    matchMedia: customMatchMedia,
    query = '(prefers-reduced-motion: reduce)',
  } = options;

  // SSR safety: return default when not in browser
  if (!isBrowser()) {
    return defaultValue;
  }

  // Resolve matchMedia function
  const matchMediaFn = customMatchMedia ?? window.matchMedia?.bind(window);

  if (typeof matchMediaFn !== 'function') {
    return defaultValue;
  }

  try {
    const result = matchMediaFn(query);
    if (result && 'matches' in result) {
      return result.matches;
    }
    return defaultValue;
  } catch (error) {
    // matchMedia may throw in some environments
    // Guard process access for non-Node, non-bundled runtimes
  if (typeof process !== 'undefined' && process?.env?.['NODE_ENV'] !== 'production') {
      console.warn('[prefersReducedMotion] matchMedia threw an error:', error);
    }
    return defaultValue;
  }
}

export default prefersReducedMotion;
