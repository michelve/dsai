import type { Point2D } from './types';

/**
 * Validate that a Point2D has finite coordinates
 * @internal
 */
function isValidPoint(point: Point2D): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

/**
 * Calculate angle between two points in radians
 *
 * Returns the angle from p1 to p2, measured counter-clockwise from the positive x-axis.
 * Range: -π to π (or -180° to 180°).
 *
 * @param p1 - Starting point
 * @param p2 - Ending point
 * @returns Angle in radians
 * @throws Error if any coordinate is NaN or Infinity
 *
 * @example
 * ```typescript
 * const angle = angle({ x: 0, y: 0 }, { x: 1, y: 0 });
 * console.log(angle); // Returns 0 (pointing right)
 *
 * const angle2 = angle({ x: 0, y: 0 }, { x: 0, y: 1 });
 * console.log(angle2); // Returns π/2 (pointing up)
 * ```
 */
export function angle(p1: Point2D, p2: Point2D): number {
  if (!isValidPoint(p1) || !isValidPoint(p2)) {
    throw new Error('Point coordinates must be finite numbers');
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}
