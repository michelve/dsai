/**
 * Motion utilities for animations and gestures
 * @module utils/motion
 */

export { angle } from './angle';
export { clampVelocity } from './clampVelocity';
export { createSpring } from './createSpring';
export { distance } from './distance';
export { easeIn } from './easeIn';
export { easeInOut } from './easeInOut';
export { easeOut } from './easeOut';
export { interpolate } from './interpolate';

export type { InterpolateOptions } from './interpolate';
export type {
  EasingFunction,
  InterpolationRange,
  Point2D,
  SpringConfig,
  SpringState,
} from './types';
