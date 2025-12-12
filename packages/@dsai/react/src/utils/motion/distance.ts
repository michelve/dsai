import type { Point2D } from './types';

/**
 * Validate that a Point2D has finite coordinates
 * @internal
 */
function isValidPoint(point: Point2D): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

/**
 * Calculate Euclidean distance between two points
 *
 * Uses the Pythagorean theorem to calculate straight-line distance.
 *
 * @param p1 - First point
 * @param p2 - Second point
 * @returns Distance between points
 * @throws Error if any coordinate is NaN or Infinity
 *
 * @example
 * ```typescript
 * const d = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
 * console.log(d); // Returns 5
 * ```
 */
export function distance(p1: Point2D, p2: Point2D): number {
  if (!isValidPoint(p1) || !isValidPoint(p2)) {
    throw new Error('Point coordinates must be finite numbers');
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
