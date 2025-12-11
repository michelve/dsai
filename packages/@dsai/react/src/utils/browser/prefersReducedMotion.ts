/**
 * prefersReducedMotion - Detects user preference for reduced motion.
 * Safe for SSR; returns false when matchMedia is unavailable or throws.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  try {
    const result = window.matchMedia('(prefers-reduced-motion: reduce)');
    return Boolean(result && 'matches' in result && result.matches);
  } catch (error) {
    // matchMedia may throw in some environments
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[prefersReducedMotion] matchMedia threw an error:', error);
    }
    return false;
  }
}

export default prefersReducedMotion;
