/**
 * @file shouldAnimate - Check if animations should run
 * @module @dsai/react/utils/a11y
 *
 * Enterprise-grade animation preference checker with:
 * - Respects prefers-reduced-motion
 * - SSR-safe
 * - Browser fallback
 * - Caches media query
 */

let cachedMediaQuery: MediaQueryList | null = null;

/**
 * Check if animations should be enabled based on user preferences
 *
 * @returns true if animations should run, false if reduced motion preferred
 *
 * @example
 * ```tsx
 * // Basic usage
 * if (shouldAnimate()) {
 *   element.classList.add('animate-fade-in');
 * }
 *
 * // React usage
 * const [animate, setAnimate] = useState(shouldAnimate());
 *
 * useEffect(() => {
 *   if (!shouldAnimate()) {
 *     setAnimate(false);
 *   }
 * }, []);
 *
 * // Conditional animation
 * <div className={shouldAnimate() ? 'transition-all' : ''}>
 *   Content
 * </div>
 *
 * // With CSS-in-JS
 * const styles = {
 *   transition: shouldAnimate() ? 'all 0.3s ease' : 'none'
 * };
 * ```
 */
export function shouldAnimate(): boolean {
  // SSR fallback - default to no animations
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }

  // Cache media query for performance
  if (!cachedMediaQuery) {
    cachedMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  // Return true if reduced motion is NOT preferred
  return !cachedMediaQuery.matches;
}

/**
 * Listen for changes to animation preferences
 *
 * @param callback - Function called when preference changes
 * @returns Cleanup function
 *
 * @example
 * ```tsx
 * // React usage
 * useEffect(() => {
 *   return onAnimationPreferenceChange((shouldAnimate) => {
 *     setAnimationsEnabled(shouldAnimate);
 *   });
 * }, []);
 * ```
 */
export function onAnimationPreferenceChange(
  callback: (shouldAnimate: boolean) => void
): () => void {
  // SSR fallback
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {};
  }

  if (!cachedMediaQuery) {
    cachedMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  const handler = (event: MediaQueryListEvent): void => {
    callback(!event.matches);
  };

  cachedMediaQuery.addEventListener('change', handler);

  return (): void => {
    if (cachedMediaQuery) {
      cachedMediaQuery.removeEventListener('change', handler);
    }
  };
}
