import type { Point2D } from './types';

/**
 * Clamp velocity to a maximum magnitude
 *
 * Useful for gesture-based animations to prevent overly fast movements.
 * Preserves velocity direction while limiting magnitude.
 *
 * @param velocity - Velocity vector (x, y)
 * @param maxVelocity - Maximum velocity magnitude
 * @returns Clamped velocity vector
 *
 * @example
 * ```typescript
 * const velocity = { x: 100, y: 100 };
 * const clamped = clampVelocity(velocity, 50);
 * // Returns { x: ~35.36, y: ~35.36 } (magnitude = 50)
 * ```
 */
export function clampVelocity(velocity: Point2D, maxVelocity: number): Point2D {
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
