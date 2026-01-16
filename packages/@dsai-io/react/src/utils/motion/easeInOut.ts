import type { EasingFunction } from './types';

/**
 * Ease-in-out easing function (cubic Bezier approximation)
 *
 * Starts slowly, accelerates in the middle, then decelerates at the end.
 * Approximates cubic-bezier(0.42, 0, 0.58, 1).
 *
 * @param t - Time parameter (0 to 1)
 * @returns Eased value (0 to 1)
 *
 * @example
 * ```typescript
 * const progress = easeInOut(0.5); // Returns ~0.5 (accelerating)
 * const start = easeInOut(0); // Returns 0
 * const end = easeInOut(1); // Returns 1
 * ```
 */
export const easeInOut: EasingFunction = (t: number): number => {
  // Clamp t to [0, 1]
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-in-out
  return clamped < 0.5 ? 4 * clamped * clamped * clamped : 1 - (-2 * clamped + 2) ** 3 / 2;
};
