import type { EasingFunction } from './types';

/**
 * Ease-out easing function (cubic)
 *
 * Starts quickly and decelerates towards the end.
 * Approximates cubic-bezier(0.33, 1, 0.68, 1).
 *
 * @param t - Time parameter (0 to 1)
 * @returns Eased value (0 to 1)
 *
 * @example
 * ```typescript
 * const progress = easeOut(0.5); // Returns ~0.875 (decelerating)
 * const start = easeOut(0); // Returns 0
 * const end = easeOut(1); // Returns 1
 * ```
 */
/** Cubic polynomial degree used in easing calculation */
const CUBIC_EXPONENT = 3;

export const easeOut: EasingFunction = (t: number): number => {
  // Clamp t to [0, 1]
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-out
  return 1 - (1 - clamped) ** CUBIC_EXPONENT;
};
