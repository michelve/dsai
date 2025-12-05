/**
 * prefersReducedMotion - Detects user preference for reduced motion.
 * Safe for SSR; returns false when matchMedia is unavailable.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  const result = window.matchMedia('(prefers-reduced-motion: reduce)');
  return Boolean(result && 'matches' in result && result.matches);
}

export default prefersReducedMotion;
