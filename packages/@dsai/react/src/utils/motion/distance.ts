import type { Point2D } from './types';

/**
 * Calculate Euclidean distance between two points
 *
 * Uses the Pythagorean theorem to calculate straight-line distance.
 *
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 *
 * @example
 * ```typescript
 * const d = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
 * console.log(d); // Returns 5
 * ```
 */
export function distance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
