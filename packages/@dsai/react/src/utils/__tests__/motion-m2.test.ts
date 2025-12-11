/**
 * @file Motion & Animation Utilities Test Suite (M2.12)
 * @module @dsai/react/utils/__tests__/motion-m2.test
 *
 * Comprehensive test coverage for M2.12 Motion utilities:
 * - Spring physics: createSpring
 * - Easing functions: easeIn, easeOut, easeInOut
 * - Interpolation: interpolate
 * - Physics: clampVelocity, distance, angle
 *
 * Target: 100% code coverage for motion utilities
 */

import {
  angle,
  clampVelocity,
  createSpring,
  distance,
  easeIn,
  easeInOut,
  easeOut,
  interpolate,
} from '../motion';

import type { Point2D, SpringConfig } from '../motion/types';

describe('M2.12 Motion Utilities', () => {
  describe('createSpring', () => {
    it('should create spring calculator function', () => {
      const spring = createSpring(0, 100);

      expect(typeof spring).toBe('function');
    });

    it('should calculate position at time t=0', () => {
      const spring = createSpring(0, 100);
      const state = spring(0);

      expect(state.position).toBe(0);
      expect(state.velocity).toBe(0);
      expect(state.done).toBe(false);
    });

    it('should animate towards target value', () => {
      const spring = createSpring(0, 100, { stiffness: 100, damping: 10 });

      const state1 = spring(0.1);
      const state2 = spring(0.5);
      const state3 = spring(1.0);

      expect(state1.position).toBeGreaterThan(0);
      expect(state2.position).toBeGreaterThan(state1.position);
      expect(state3.position).toBeCloseTo(100, 0);
    });

    it('should handle custom config', () => {
      const config: SpringConfig = {
        mass: 1,
        stiffness: 200,
        damping: 20,
        velocity: 0,
      };

      const spring = createSpring(0, 100, config);
      const state = spring(0.5);

      expect(state.position).toBeGreaterThan(0);
      expect(state.position).toBeLessThanOrEqual(100);
    });

    it('should indicate when spring has settled', () => {
      const spring = createSpring(0, 100, { stiffness: 500, damping: 50 });

      const state = spring(5);

      expect(state.done).toBe(true);
      expect(state.position).toBeCloseTo(100, 1);
    });

    it('should handle negative time by returning initial state', () => {
      const spring = createSpring(0, 100);
      const state = spring(-1);

      expect(state.position).toBe(0);
      expect(state.done).toBe(false);
    });

    it('should throw error for invalid mass', () => {
      expect(() => createSpring(0, 100, { mass: 0 })).toThrow('Spring mass must be positive');
      expect(() => createSpring(0, 100, { mass: -1 })).toThrow('Spring mass must be positive');
    });

    it('should throw error for invalid stiffness', () => {
      expect(() => createSpring(0, 100, { stiffness: -1 })).toThrow(
        'Spring stiffness must be non-negative'
      );
    });

    it('should throw error for invalid damping', () => {
      expect(() => createSpring(0, 100, { damping: -1 })).toThrow(
        'Spring damping must be non-negative'
      );
    });

    it('should handle underdamped spring (oscillation)', () => {
      const spring = createSpring(0, 100, { stiffness: 300, damping: 10 });

      const positions: number[] = [];
      for (let t = 0; t <= 2; t += 0.1) {
        positions.push(spring(t).position);
      }

      // Underdamped springs may overshoot
      const maxPosition = Math.max(...positions);
      expect(maxPosition).toBeGreaterThan(100);
    });

    it('should handle critically damped spring', () => {
      const mass = 1;
      const stiffness = 100;
      const criticalDamping = 2 * Math.sqrt(mass * stiffness);

      const spring = createSpring(0, 100, { mass, stiffness, damping: criticalDamping });

      const state = spring(1);
      expect(state.position).toBeGreaterThan(0);
      expect(state.position).toBeLessThanOrEqual(100);
    });

    it('should handle overdamped spring', () => {
      const spring = createSpring(0, 100, { stiffness: 50, damping: 50 });

      const state = spring(1);
      expect(state.position).toBeGreaterThan(0);
      expect(state.position).toBeLessThan(100);
    });

    it('should handle initial velocity', () => {
      const springWithVelocity = createSpring(0, 100, { velocity: 50 });
      const springWithoutVelocity = createSpring(0, 100, { velocity: 0 });

      const state1 = springWithVelocity(0.1);
      const state2 = springWithoutVelocity(0.1);

      expect(state1.position).toBeGreaterThan(state2.position);
    });
  });

  describe('easeIn', () => {
    it('should return 0 at t=0', () => {
      expect(easeIn(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeIn(1)).toBe(1);
    });

    it('should accelerate (cubic)', () => {
      const t1 = easeIn(0.25);
      const t2 = easeIn(0.5);
      const t3 = easeIn(0.75);

      // Cubic easing accelerates (slow start)
      expect(t1).toBeCloseTo(0.015625, 4);
      expect(t2).toBeCloseTo(0.125, 4);
      expect(t3).toBeCloseTo(0.421875, 4);
    });

    it('should clamp values below 0', () => {
      expect(easeIn(-0.5)).toBe(0);
    });

    it('should clamp values above 1', () => {
      expect(easeIn(1.5)).toBe(1);
    });

    it('should be smooth within range', () => {
      const values: number[] = [];
      for (let t = 0; t <= 1; t += 0.1) {
        values.push(easeIn(t));
      }

      // All values should be between 0 and 1
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('easeOut', () => {
    it('should return 0 at t=0', () => {
      expect(easeOut(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeOut(1)).toBe(1);
    });

    it('should decelerate (cubic)', () => {
      const t1 = easeOut(0.25);
      const t2 = easeOut(0.5);
      const t3 = easeOut(0.75);

      // Cubic easing decelerates (fast start, slow end)
      expect(t1).toBeCloseTo(0.578125, 4);
      expect(t2).toBeCloseTo(0.875, 4);
      expect(t3).toBeCloseTo(0.984375, 4);
    });

    it('should clamp values below 0', () => {
      expect(easeOut(-0.5)).toBe(0);
    });

    it('should clamp values above 1', () => {
      expect(easeOut(1.5)).toBe(1);
    });

    it('should be inverse of easeIn', () => {
      for (let t = 0; t <= 1; t += 0.1) {
        const easeInValue = easeIn(t);
        const easeOutValue = easeOut(1 - t);
        expect(easeOutValue).toBeCloseTo(1 - easeInValue, 5);
      }
    });
  });

  describe('easeInOut', () => {
    it('should return 0 at t=0', () => {
      expect(easeInOut(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeInOut(1)).toBe(1);
    });

    it('should return 0.5 at t=0.5', () => {
      expect(easeInOut(0.5)).toBeCloseTo(0.5, 5);
    });

    it('should accelerate in first half', () => {
      const t1 = easeInOut(0.1);
      const t2 = easeInOut(0.2);
      const t3 = easeInOut(0.3);

      const delta1 = t2 - t1;
      const delta2 = t3 - t2;

      expect(delta2).toBeGreaterThan(delta1);
    });

    it('should decelerate in second half', () => {
      const t1 = easeInOut(0.7);
      const t2 = easeInOut(0.8);
      const t3 = easeInOut(0.9);

      const delta1 = t2 - t1;
      const delta2 = t3 - t2;

      expect(delta1).toBeGreaterThan(delta2);
    });

    it('should be symmetric', () => {
      for (let t = 0; t <= 0.5; t += 0.1) {
        const value1 = easeInOut(t);
        const value2 = easeInOut(1 - t);
        expect(value1 + value2).toBeCloseTo(1, 5);
      }
    });

    it('should clamp values', () => {
      expect(easeInOut(-0.5)).toBe(0);
      expect(easeInOut(1.5)).toBe(1);
    });
  });

  describe('interpolate', () => {
    it('should interpolate between two values', () => {
      expect(interpolate(0, [0, 100], [0, 1])).toBe(0);
      expect(interpolate(50, [0, 100], [0, 1])).toBe(0.5);
      expect(interpolate(100, [0, 100], [0, 1])).toBe(1);
    });

    it('should handle extrapolation', () => {
      expect(interpolate(150, [0, 100], [0, 1])).toBe(1.5);
      expect(interpolate(-50, [0, 100], [0, 1])).toBe(-0.5);
    });

    it('should handle multi-segment interpolation', () => {
      const result = interpolate(50, [0, 50, 100], [0, 0.8, 1]);
      expect(result).toBeCloseTo(0.8, 5);

      const result2 = interpolate(75, [0, 50, 100], [0, 0.8, 1]);
      expect(result2).toBeCloseTo(0.9, 5);
    });

    it('should handle negative numbers', () => {
      expect(interpolate(-50, [-100, 100], [0, 1])).toBe(0.25);
      expect(interpolate(0, [-100, 100], [0, 1])).toBe(0.5);
    });

    it('should throw error for mismatched range lengths', () => {
      expect(() => interpolate(50, [0, 100], [0, 1, 2])).toThrow(
        'Input and output ranges must have the same length'
      );
    });

    it('should throw error for ranges with less than 2 values', () => {
      expect(() => interpolate(50, [0], [0])).toThrow('Ranges must have at least 2 values');
    });

    it('should handle zero-width input range', () => {
      const result = interpolate(50, [50, 50], [0, 1]);
      expect(result).toBe(0);
    });

    it('should handle descending ranges', () => {
      const result = interpolate(50, [100, 0], [0, 1]);
      expect(result).toBe(0.5);
    });
  });

  describe('clampVelocity', () => {
    it('should not clamp within range', () => {
      const velocity: Point2D = { x: 30, y: 40 };
      const result = clampVelocity(velocity, 100);

      expect(result).toEqual(velocity);
    });

    it('should clamp velocity exceeding max', () => {
      const velocity: Point2D = { x: 100, y: 100 };
      const maxVelocity = 50;

      const result = clampVelocity(velocity, maxVelocity);
      const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);

      expect(magnitude).toBeCloseTo(maxVelocity, 5);
    });

    it('should preserve direction when clamping', () => {
      const velocity: Point2D = { x: 100, y: 100 };
      const result = clampVelocity(velocity, 50);

      // Direction should be preserved (45 degrees)
      expect(result.x).toBeCloseTo(result.y, 5);
      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeGreaterThan(0);
    });

    it('should handle zero velocity', () => {
      const velocity: Point2D = { x: 0, y: 0 };
      const result = clampVelocity(velocity, 100);

      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('should handle negative velocities', () => {
      const velocity: Point2D = { x: -100, y: -100 };
      const result = clampVelocity(velocity, 50);
      const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);

      expect(magnitude).toBeCloseTo(50, 5);
      expect(result.x).toBeLessThan(0);
      expect(result.y).toBeLessThan(0);
    });

    it('should handle mixed sign velocities', () => {
      const velocity: Point2D = { x: 100, y: -100 };
      const result = clampVelocity(velocity, 50);

      expect(result.x).toBeGreaterThan(0);
      expect(result.y).toBeLessThan(0);
    });
  });

  describe('distance', () => {
    it('should calculate distance between points', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 3, y: 4 };

      expect(distance(p1, p2)).toBe(5);
    });

    it('should handle same point', () => {
      const p: Point2D = { x: 10, y: 20 };

      expect(distance(p, p)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const p1: Point2D = { x: -3, y: -4 };
      const p2: Point2D = { x: 0, y: 0 };

      expect(distance(p1, p2)).toBe(5);
    });

    it('should handle horizontal distance', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 10, y: 0 };

      expect(distance(p1, p2)).toBe(10);
    });

    it('should handle vertical distance', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 0, y: 10 };

      expect(distance(p1, p2)).toBe(10);
    });

    it('should be symmetric', () => {
      const p1: Point2D = { x: 1, y: 2 };
      const p2: Point2D = { x: 4, y: 6 };

      expect(distance(p1, p2)).toBe(distance(p2, p1));
    });

    it('should handle floating point coordinates', () => {
      const p1: Point2D = { x: 0.5, y: 0.5 };
      const p2: Point2D = { x: 1.5, y: 1.5 };

      expect(distance(p1, p2)).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('should calculate large distances', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 1000, y: 1000 };

      expect(distance(p1, p2)).toBeCloseTo(1414.21, 2);
    });
  });

  describe('angle', () => {
    it('should calculate angle to the right (0 radians)', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 1, y: 0 };

      expect(angle(p1, p2)).toBe(0);
    });

    it('should calculate angle upward (π/2 radians)', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 0, y: 1 };

      expect(angle(p1, p2)).toBeCloseTo(Math.PI / 2, 5);
    });

    it('should calculate angle to the left (±π radians)', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: -1, y: 0 };

      expect(Math.abs(angle(p1, p2))).toBeCloseTo(Math.PI, 5);
    });

    it('should calculate angle downward (-π/2 radians)', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 0, y: -1 };

      expect(angle(p1, p2)).toBeCloseTo(-Math.PI / 2, 5);
    });

    it('should calculate 45° angle (π/4 radians)', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 1, y: 1 };

      expect(angle(p1, p2)).toBeCloseTo(Math.PI / 4, 5);
    });

    it('should handle same point', () => {
      const p: Point2D = { x: 10, y: 20 };

      expect(angle(p, p)).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const p1: Point2D = { x: -5, y: -5 };
      const p2: Point2D = { x: -4, y: -4 };

      expect(angle(p1, p2)).toBeCloseTo(Math.PI / 4, 5);
    });

    it('should return angle in range [-π, π]', () => {
      const p1: Point2D = { x: 0, y: 0 };

      const angles = [
        angle(p1, { x: 1, y: 1 }),
        angle(p1, { x: -1, y: 1 }),
        angle(p1, { x: -1, y: -1 }),
        angle(p1, { x: 1, y: -1 }),
      ];

      for (const a of angles) {
        expect(a).toBeGreaterThanOrEqual(-Math.PI);
        expect(a).toBeLessThanOrEqual(Math.PI);
      }
    });
  });

  describe('Integration Tests', () => {
    it('should use easing with interpolation', () => {
      const values: number[] = [];

      for (let t = 0; t <= 1; t += 0.1) {
        const easedT = easeInOut(t);
        const value = interpolate(easedT, [0, 1], [0, 100]);
        values.push(value);
      }

      expect(values[0]).toBe(0);
      expect(values[values.length - 1]).toBeCloseTo(100, 0);
    });

    it('should calculate velocity direction and magnitude', () => {
      const p1: Point2D = { x: 0, y: 0 };
      const p2: Point2D = { x: 10, y: 10 };

      const dist = distance(p1, p2);
      const ang = angle(p1, p2);

      expect(dist).toBeCloseTo(14.14, 2);
      expect(ang).toBeCloseTo(Math.PI / 4, 5);

      // Create velocity vector
      const velocity: Point2D = {
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
      };

      const clamped = clampVelocity(velocity, 10);
      const clampedMagnitude = Math.sqrt(clamped.x * clamped.x + clamped.y * clamped.y);

      expect(clampedMagnitude).toBeCloseTo(10, 5);
    });

    it('should create smooth animation with spring and interpolation', () => {
      const spring = createSpring(0, 1, { stiffness: 100, damping: 10 });
      const positions: number[] = [];

      for (let t = 0; t <= 2; t += 0.1) {
        const springState = spring(t);
        const value = interpolate(springState.position, [0, 1], [0, 100]);
        positions.push(value);
      }

      expect(positions[0]).toBe(0);
      expect(positions[positions.length - 1]).toBeCloseTo(100, 0);
    });
  });
});
