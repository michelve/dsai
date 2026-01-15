import type { SpringConfig, SpringState } from './types';

/**
 * Create a spring physics calculator for smooth animations
 *
 * Uses spring-damper physics to calculate position and velocity over time.
 * The spring equation is: F = -k * x - c * v
 * where k is stiffness, x is displacement, c is damping, and v is velocity.
 *
 * @param from - Starting value
 * @param to - Target value
 * @param config - Spring configuration (mass, stiffness, damping, velocity)
 * @returns Function that calculates spring state at a given time (in seconds)
 *
 * @example
 * ```typescript
 * const spring = createSpring(0, 100, { stiffness: 100, damping: 10 });
 * const state = spring(0.5); // Get state after 0.5 seconds
 * console.log(state.position); // Current position
 * console.log(state.done); // Whether spring has settled
 * ```
 */
export function createSpring(
  from: number,
  to: number,
  config: SpringConfig = {}
): (t: number) => SpringState {
  const { mass = 1, stiffness = 100, damping = 10, velocity = 0 } = config;

  // Validate inputs
  if (mass <= 0) {
    throw new Error('Spring mass must be positive');
  }
  if (stiffness < 0) {
    throw new Error('Spring stiffness must be non-negative');
  }
  if (damping < 0) {
    throw new Error('Spring damping must be non-negative');
  }

  const displacement = from - to;

  // Calculate damping ratio (zeta)
  const criticalDamping = 2 * Math.sqrt(mass * stiffness);
  const dampingRatio = damping / criticalDamping;

  // Natural frequency
  const w0 = Math.sqrt(stiffness / mass);

  // Settling threshold (when spring is considered "done")
  const SETTLE_THRESHOLD = 0.01;
  const VELOCITY_THRESHOLD = 0.01;

  return (t: number): SpringState => {
    if (t < 0) {
      return { position: from, velocity, done: false };
    }

    let position: number;
    let currentVelocity: number;

    if (dampingRatio < 1) {
      // Underdamped: oscillates before settling
      const wd = w0 * Math.sqrt(1 - dampingRatio * dampingRatio);
      const A = displacement;
      const B = (dampingRatio * w0 * displacement + velocity) / wd;
      const envelope = Math.exp(-dampingRatio * w0 * t);

      position = to + envelope * (A * Math.cos(wd * t) + B * Math.sin(wd * t));
      currentVelocity =
        envelope *
        ((-dampingRatio * w0 * A - wd * B) * Math.cos(wd * t) +
          (wd * A - dampingRatio * w0 * B) * Math.sin(wd * t));
    } else if (dampingRatio === 1) {
      // Critically damped: fastest settling without oscillation
      const A = displacement;
      const B = velocity + w0 * displacement;
      const envelope = Math.exp(-w0 * t);

      position = to + envelope * (A + B * t);
      currentVelocity = envelope * (B - w0 * (A + B * t));
    } else {
      // Overdamped: slow settling without oscillation
      const r1 = -w0 * (dampingRatio + Math.sqrt(dampingRatio * dampingRatio - 1));
      const r2 = -w0 * (dampingRatio - Math.sqrt(dampingRatio * dampingRatio - 1));
      const A = (velocity - r2 * displacement) / (r1 - r2);
      const B = displacement - A;

      position = to + A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
      currentVelocity = A * r1 * Math.exp(r1 * t) + B * r2 * Math.exp(r2 * t);
    }

    // Check if spring has settled
    const positionDiff = Math.abs(position - to);
    const velocityMagnitude = Math.abs(currentVelocity);
    const done = positionDiff < SETTLE_THRESHOLD && velocityMagnitude < VELOCITY_THRESHOLD;

    return { position, velocity: currentVelocity, done };
  };
}
