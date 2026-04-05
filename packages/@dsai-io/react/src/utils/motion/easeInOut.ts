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
/** Cubic polynomial degree used in easing calculations */
const CUBIC_EXPONENT = 3;

/** Coefficient for the first-half cubic ease-in (2^3 = 8, but split: 4 * t^3) */
const EASE_IN_COEFFICIENT = 4;

/** Coefficient for the second-half reflection (-2 * t + 2) */
const EASE_OUT_REFLECTION = -2;

/** Divisor for the second-half cubic ease-out */
const EASE_OUT_DIVISOR = 2;

export const easeInOut: EasingFunction = (t: number): number => {
  // Clamp t to [0, 1]
  const clamped = Math.max(0, Math.min(1, t));

  // Cubic ease-in-out
  return clamped < 0.5
    ? EASE_IN_COEFFICIENT * clamped * clamped * clamped
    : 1 - (EASE_OUT_REFLECTION * clamped + 2) ** CUBIC_EXPONENT / EASE_OUT_DIVISOR;
};
