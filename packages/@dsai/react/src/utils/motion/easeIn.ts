import type { EasingFunction } from './types';

/**
 * Ease-in easing function (cubic)
 *
 * Starts slowly and accelerates towards the end.
 * Approximates cubic-bezier(0.32, 0, 0.67, 0).
 *
 * @param t - Time parameter (0 to 1)
 * @returns Eased value (0 to 1)
 *
 * @example
 * ```typescript
 * const progress = easeIn(0.5); // Returns ~0.125 (accelerating)
 * const start = easeIn(0); // Returns 0
 * const end = easeIn(1); // Returns 1
 * ```
 */
export const easeIn: EasingFunction = (t: number): number => {
  // Clamp t to [0, 1]
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-in
  return clamped * clamped * clamped;
};
