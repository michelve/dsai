/**
 * Motion utility types
 * @module utils/motion/types
 */

/**
 * 2D point coordinates
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Spring physics configuration
 */
export interface SpringConfig {
  /** Mass of the spring (default: 1) */
  mass?: number;
  /** Stiffness of the spring (default: 100) */
  stiffness?: number;
  /** Damping coefficient (default: 10) */
  damping?: number;
  /** Initial velocity (default: 0) */
  velocity?: number;
}

/**
 * Spring physics state at a point in time
 */
export interface SpringState {
  /** Current position */
  position: number;
  /** Current velocity */
  velocity: number;
  /** Whether the spring has settled */
  done: boolean;
}

/**
 * Easing function type
 */
export type EasingFunction = (t: number) => number;

/**
 * Interpolation range
 */
export interface InterpolationRange {
  /** Input range (domain) */
  inputRange: number[];
  /** Output range (codomain) */
  outputRange: number[];
}
