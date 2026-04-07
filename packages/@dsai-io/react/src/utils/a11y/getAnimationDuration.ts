/**
 * @file getAnimationDuration - Get animation duration based on user preference
 * @module @dsai-io/react/utils/a11y
 *
 * Enterprise-grade animation duration calculator with:
 * - Respects prefers-reduced-motion (returns 0ms)
 * - Predefined duration scales
 * - Type-safe duration values
 * - SSR-safe
 */

import { shouldAnimate } from './shouldAnimate';

import type { AnimationDuration } from '../types/shared';

/** Fast animation duration in milliseconds */
const DURATION_FAST = 150;

/** Normal animation duration in milliseconds */
const DURATION_NORMAL = 200;

/** Standard animation duration in milliseconds */
const DURATION_STANDARD = 300;

/** Slow animation duration in milliseconds */
const DURATION_SLOW = 500;

/**
 * Get animation duration in milliseconds, respecting user's motion preferences
 *
 * @param requestedDuration - Desired duration in milliseconds
 * @returns 0 if reduced motion preferred, otherwise requested duration
 *
 * @example
 * ```tsx
 * // Basic usage
 * const duration = getAnimationDuration(300);
 * // => 300 if animations enabled, 0 if reduced motion
 *
 * // With CSS
 * element.style.transitionDuration = `${getAnimationDuration(200)}ms`;
 *
 * // With React Spring
 * const springs = useSpring({
 *   opacity: visible ? 1 : 0,
 *   config: { duration: getAnimationDuration(300) }
 * });
 *
 * // With Framer Motion
 * <motion.div
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: getAnimationDuration(500) / 1000 }}
 * />
 *
 * // Predefined durations
 * getAnimationDuration(150); // Fast
 * getAnimationDuration(300); // Normal
 * getAnimationDuration(500); // Slow
 * ```
 */
export function getAnimationDuration(requestedDuration: AnimationDuration): number {
  return shouldAnimate() ? requestedDuration : 0;
}

/**
 * Predefined animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  /**
   * Instant (no animation)
   */
  INSTANT: 0 as const,

  /**
   * Fast animations (150ms)
   */
  FAST: DURATION_FAST,

  /**
   * Normal animations (200ms)
   */
  NORMAL: DURATION_NORMAL,

  /**
   * Standard animations (300ms)
   */
  STANDARD: DURATION_STANDARD,

  /**
   * Slow animations (500ms)
   */
  SLOW: DURATION_SLOW,
} as const;

/**
 * Get fast animation duration (150ms or 0ms)
 */
export function getFastDuration(): number {
  return getAnimationDuration(ANIMATION_DURATION.FAST);
}

/**
 * Get normal animation duration (200ms or 0ms)
 */
export function getNormalDuration(): number {
  return getAnimationDuration(ANIMATION_DURATION.NORMAL);
}

/**
 * Get standard animation duration (300ms or 0ms)
 */
export function getStandardDuration(): number {
  return getAnimationDuration(ANIMATION_DURATION.STANDARD);
}

/**
 * Get slow animation duration (500ms or 0ms)
 */
export function getSlowDuration(): number {
  return getAnimationDuration(ANIMATION_DURATION.SLOW);
}
