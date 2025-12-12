import type { Point2D } from './types';

/**
 * Validate that a Point2D has finite coordinates
 * @internal
 */
function isValidPoint(point: Point2D): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

/**
 * Clamp velocity to a maximum magnitude
 *
 * Useful for gesture-based animations to prevent overly fast movements.
 * Preserves velocity direction while limiting magnitude.
 *
 * @param velocity - Velocity vector (x, y)
 * @param maxVelocity - Maximum velocity magnitude (must be positive and finite)
 * @returns Clamped velocity vector
 * @throws Error if velocity coordinates are NaN or Infinity
 * @throws Error if maxVelocity is not a positive finite number
 *
 * @example
 * ```typescript
 * const velocity = { x: 100, y: 100 };
 * const clamped = clampVelocity(velocity, 50);
 * // Returns { x: ~35.36, y: ~35.36 } (magnitude = 50)
 * ```
 */
export function clampVelocity(velocity: Point2D, maxVelocity: number): Point2D {
  if (!isValidPoint(velocity)) {
    throw new Error('Velocity coordinates must be finite numbers');
  }
  if (!Number.isFinite(maxVelocity) || maxVelocity < 0) {
    throw new Error('maxVelocity must be a non-negative finite number');
  }

  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

  if (magnitude <= maxVelocity) {
    return velocity;
  }

  // Scale down to max velocity while preserving direction
  const scale = maxVelocity / magnitude;
  return {
    x: velocity.x * scale,
    y: velocity.y * scale,
  };
}
