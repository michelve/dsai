/**
 * @file Motion & Animation Utilities Test Suite (M2.12)
 * @module @dsai-io/react/utils/__tests__/motion-m2.test
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

// ── Test constants (S109) ──
const TEST_SPRING_TARGET = 100;
const TEST_STIFFNESS = 100;
const TEST_DAMPING = 10;
const TEST_HIGH_STIFFNESS = 200;
const TEST_HIGH_DAMPING = 20;
const TEST_SNAP_STIFFNESS = 500;
const TEST_SNAP_DAMPING = 50;
const TEST_UNDERDAMPED_STIFFNESS = 300;
const TEST_UNDERDAMPED_DAMPING = 10;
const TEST_OVERDAMPED_STIFFNESS = 50;
const TEST_OVERDAMPED_DAMPING = 50;
const TEST_ULTRA_STIFFNESS = 10000;
const TEST_ULTRA_DAMPING = 100;
const TEST_LOW_DAMPING = 1;
const TEST_SETTLE_TIME = 5;
const TEST_SETTLE_TIME_SHORT = 3;
const TEST_DURATION_SHORT = 0.1;
const TEST_DURATION_MID = 0.5;
const TEST_DURATION_LONG = 1.0;
const TEST_TRANSLATION = 150;
const TEST_NEGATIVE_TRANSLATION = -50;
const TEST_CLAMP_MAX = 50;
const TEST_INITIAL_VELOCITY = 50;
const TEST_LARGE_DISPLACEMENT = 1000;
const TEST_DISTANCE_EXPECTED = 1414.21;

describe('M2.12 Motion Utilities', () => {
  describe('createSpring', () => {
    it('should create spring calculator function', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET);

      expect(typeof spring).toBe('function');
    });

    it('should calculate position at time t=0', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET);
      const state = spring(0);

      expect(state.position).toBe(0);
      // Initial velocity is from spring force, not zero
      expect(typeof state.velocity).toBe('number');
      expect(Number.isFinite(state.velocity)).toBe(true);
      expect(state.done).toBe(false);
    });

    it('should animate towards target value', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET, {
        stiffness: TEST_STIFFNESS,
        damping: TEST_DAMPING,
      });

      const state1 = spring(TEST_DURATION_SHORT);
      const state2 = spring(TEST_DURATION_MID);
      const state3 = spring(TEST_DURATION_LONG);

      expect(state1.position).toBeGreaterThan(0);
      expect(state2.position).toBeGreaterThan(state1.position);
      expect(state3.position).toBeCloseTo(TEST_SPRING_TARGET, 0);
    });

    it('should handle custom config', () => {
      const config: SpringConfig = {
        mass: 1,
        stiffness: TEST_HIGH_STIFFNESS,
        damping: TEST_HIGH_DAMPING,
        velocity: 0,
      };

      const spring = createSpring(0, TEST_SPRING_TARGET, config);
      const state = spring(TEST_DURATION_MID);

      expect(state.position).toBeGreaterThan(0);
      // Spring physics may overshoot slightly depending on damping
      expect(state.position).toBeCloseTo(TEST_SPRING_TARGET, 0);
    });

    it('should indicate when spring has settled', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET, {
        stiffness: TEST_SNAP_STIFFNESS,
        damping: TEST_SNAP_DAMPING,
      });

      const state = spring(TEST_SETTLE_TIME);

      expect(state.done).toBe(true);
      expect(state.position).toBeCloseTo(TEST_SPRING_TARGET, 1);
    });

    it('should handle negative time by returning initial state', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET);
      const state = spring(-1);

      expect(state.position).toBe(0);
      expect(state.done).toBe(false);
    });

    it('should throw error for invalid mass', () => {
      expect(() => createSpring(0, TEST_SPRING_TARGET, { mass: 0 })).toThrow('Spring mass must be positive');
      expect(() => createSpring(0, TEST_SPRING_TARGET, { mass: -1 })).toThrow('Spring mass must be positive');
    });

    it('should throw error for invalid stiffness', () => {
      expect(() => createSpring(0, TEST_SPRING_TARGET, { stiffness: -1 })).toThrow(
        'Spring stiffness must be non-negative'
      );
    });

    it('should throw error for invalid damping', () => {
      expect(() => createSpring(0, TEST_SPRING_TARGET, { damping: -1 })).toThrow(
        'Spring damping must be non-negative'
      );
    });

    it('should handle underdamped spring (oscillation)', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET, {
        stiffness: TEST_UNDERDAMPED_STIFFNESS,
        damping: TEST_UNDERDAMPED_DAMPING,
      });

      const positions: number[] = [];
      for (let t = 0; t <= 2; t += 0.1) {
        positions.push(spring(t).position);
      }

      // Underdamped springs may overshoot
      const maxPosition = Math.max(...positions);
      expect(maxPosition).toBeGreaterThan(TEST_SPRING_TARGET);
    });

    it('should handle critically damped spring', () => {
      const mass = 1;
      const stiffness = TEST_STIFFNESS;
      const criticalDamping = 2 * Math.sqrt(mass * stiffness);

      const spring = createSpring(0, TEST_SPRING_TARGET, { mass, stiffness, damping: criticalDamping });

      const state = spring(1);
      expect(state.position).toBeGreaterThan(0);
      expect(state.position).toBeLessThanOrEqual(TEST_SPRING_TARGET);
    });

    it('should handle overdamped spring', () => {
      const spring = createSpring(0, TEST_SPRING_TARGET, {
        stiffness: TEST_OVERDAMPED_STIFFNESS,
        damping: TEST_OVERDAMPED_DAMPING,
      });

      const state = spring(1);
      expect(state.position).toBeGreaterThan(0);
      expect(state.position).toBeLessThan(TEST_SPRING_TARGET);
    });

    it('should handle initial velocity', () => {
      const springWithVelocity = createSpring(0, TEST_SPRING_TARGET, { velocity: TEST_INITIAL_VELOCITY });
      const springWithoutVelocity = createSpring(0, TEST_SPRING_TARGET, { velocity: 0 });

      const state1 = springWithVelocity(TEST_DURATION_SHORT);
      const state2 = springWithoutVelocity(TEST_DURATION_SHORT);

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
      expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1])).toBe(1.5);
      expect(interpolate(TEST_NEGATIVE_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1])).toBe(-0.5);
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
      const velocity: Point2D = { x: TEST_SPRING_TARGET, y: TEST_SPRING_TARGET };
      const maxVelocity = TEST_CLAMP_MAX;

      const result = clampVelocity(velocity, maxVelocity);
      const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);

      expect(magnitude).toBeCloseTo(maxVelocity, 5);
    });

    it('should preserve direction when clamping', () => {
      const velocity: Point2D = { x: TEST_SPRING_TARGET, y: TEST_SPRING_TARGET };
      const result = clampVelocity(velocity, TEST_CLAMP_MAX);

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
      const velocity: Point2D = { x: -TEST_SPRING_TARGET, y: -TEST_SPRING_TARGET };
      const result = clampVelocity(velocity, TEST_CLAMP_MAX);
      const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);

      expect(magnitude).toBeCloseTo(50, 5);
      expect(result.x).toBeLessThan(0);
      expect(result.y).toBeLessThan(0);
    });

    it('should handle mixed sign velocities', () => {
      const velocity: Point2D = { x: TEST_SPRING_TARGET, y: -TEST_SPRING_TARGET };
      const result = clampVelocity(velocity, TEST_CLAMP_MAX);

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
      const p2: Point2D = { x: TEST_LARGE_DISPLACEMENT, y: TEST_LARGE_DISPLACEMENT };

      expect(distance(p1, p2)).toBeCloseTo(TEST_DISTANCE_EXPECTED, 2);
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
        const value = interpolate(easedT, [0, 1], [0, TEST_SPRING_TARGET]);
        values.push(value);
      }

      expect(values[0]).toBe(0);
      expect(values[values.length - 1]).toBeCloseTo(TEST_SPRING_TARGET, 0);
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
      const spring = createSpring(0, 1, { stiffness: TEST_STIFFNESS, damping: TEST_DAMPING });
      const positions: number[] = [];

      for (let t = 0; t <= 2; t += 0.1) {
        const springState = spring(t);
        const value = interpolate(springState.position, [0, 1], [0, TEST_SPRING_TARGET]);
        positions.push(value);
      }

      expect(positions[0]).toBe(0);
      expect(positions[positions.length - 1]).toBeCloseTo(TEST_SPRING_TARGET, 0);
    });
  });

  describe('Edge Cases & Input Validation', () => {
    describe('interpolate with clamp option', () => {
      it('should clamp extrapolation when clamp option is true', () => {
        // Without clamp, extrapolates
        expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1])).toBe(1.5);
        expect(interpolate(TEST_NEGATIVE_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1])).toBe(-0.5);

        // With clamp, limits to output range
        expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1], { clamp: true })).toBe(1);
        expect(interpolate(TEST_NEGATIVE_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1], { clamp: true })).toBe(0);
      });

      it('should handle clamping with inverted output range', () => {
        // Output range is [1, 0] (inverted)
        expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [1, 0], { clamp: true })).toBe(0);
        expect(interpolate(TEST_NEGATIVE_TRANSLATION, [0, TEST_SPRING_TARGET], [1, 0], { clamp: true })).toBe(1);
      });

      it('should not clamp when clamp option is false', () => {
        expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1], { clamp: false })).toBe(1.5);
      });

      it('should not clamp by default (undefined options)', () => {
        expect(interpolate(TEST_TRANSLATION, [0, TEST_SPRING_TARGET], [0, 1])).toBe(1.5);
      });
    });

    describe('NaN and Infinity handling', () => {
      it('should throw for NaN value in interpolate', () => {
        expect(() => interpolate(Number.NaN, [0, 100], [0, 1])).toThrow('Value must be a finite number');
      });

      it('should throw for Infinity value in interpolate', () => {
        expect(() => interpolate(Infinity, [0, 100], [0, 1])).toThrow(
          'Value must be a finite number'
        );
        expect(() => interpolate(-Infinity, [0, 100], [0, 1])).toThrow(
          'Value must be a finite number'
        );
      });

      it('should throw for NaN coordinates in distance', () => {
        expect(() => distance({ x: Number.NaN, y: 0 }, { x: 1, y: 1 })).toThrow(
          'Point coordinates must be finite numbers'
        );
        expect(() => distance({ x: 0, y: 0 }, { x: 1, y: Number.NaN })).toThrow(
          'Point coordinates must be finite numbers'
        );
      });

      it('should throw for Infinity coordinates in distance', () => {
        expect(() => distance({ x: Infinity, y: 0 }, { x: 1, y: 1 })).toThrow(
          'Point coordinates must be finite numbers'
        );
      });

      it('should throw for NaN coordinates in angle', () => {
        expect(() => angle({ x: Number.NaN, y: 0 }, { x: 1, y: 1 })).toThrow(
          'Point coordinates must be finite numbers'
        );
        expect(() => angle({ x: 0, y: 0 }, { x: Number.NaN, y: 1 })).toThrow(
          'Point coordinates must be finite numbers'
        );
      });

      it('should throw for Infinity coordinates in angle', () => {
        expect(() => angle({ x: 0, y: -Infinity }, { x: 1, y: 1 })).toThrow(
          'Point coordinates must be finite numbers'
        );
      });

      it('should throw for NaN velocity in clampVelocity', () => {
        expect(() => clampVelocity({ x: Number.NaN, y: 10 }, 100)).toThrow(
          'Velocity coordinates must be finite numbers'
        );
      });

      it('should throw for Infinity velocity in clampVelocity', () => {
        expect(() => clampVelocity({ x: Infinity, y: 10 }, 100)).toThrow(
          'Velocity coordinates must be finite numbers'
        );
      });

      it('should throw for NaN maxVelocity in clampVelocity', () => {
        expect(() => clampVelocity({ x: 10, y: 10 }, Number.NaN)).toThrow(
          'maxVelocity must be a non-negative finite number'
        );
      });

      it('should throw for Infinity maxVelocity in clampVelocity', () => {
        expect(() => clampVelocity({ x: 10, y: 10 }, Infinity)).toThrow(
          'maxVelocity must be a non-negative finite number'
        );
      });

      it('should throw for negative maxVelocity in clampVelocity', () => {
        expect(() => clampVelocity({ x: 10, y: 10 }, -TEST_CLAMP_MAX)).toThrow(
          'maxVelocity must be a non-negative finite number'
        );
      });
    });

    describe('extreme spring values', () => {
      it('should handle very high stiffness (snap behavior)', () => {
        const spring = createSpring(0, 1, {
          stiffness: TEST_ULTRA_STIFFNESS,
          damping: TEST_ULTRA_DAMPING,
        });

        // With very high stiffness, should reach target quickly
        const state = spring(TEST_DURATION_SHORT);
        expect(state.position).toBeGreaterThan(0.9);
      });

      it('should handle very low damping (oscillation)', () => {
        const spring = createSpring(0, 1, { stiffness: TEST_STIFFNESS, damping: TEST_LOW_DAMPING });
        const positions: number[] = [];

        // With low damping, expect oscillation (overshooting)
        for (let t = 0; t <= 2; t += 0.1) {
          positions.push(spring(t).position);
        }

        // Should overshoot the target at some point
        const hasOvershoot = positions.some((p) => p > 1.1);
        expect(hasOvershoot).toBe(true);
      });

      it('should handle equal stiffness and damping (critically damped)', () => {
        const spring = createSpring(0, 1, { stiffness: TEST_STIFFNESS, damping: TEST_HIGH_DAMPING });
        const positions: number[] = [];

        for (let t = 0; t <= 2; t += 0.1) {
          positions.push(spring(t).position);
        }

        // Critically damped should approach target without significant overshoot
        const maxPosition = Math.max(...positions);
        expect(maxPosition).toBeLessThan(1.15); // Small tolerance for numerical precision
      });

      it('should handle negative start/target values', () => {
        const spring = createSpring(-10, -5, { stiffness: TEST_STIFFNESS, damping: TEST_DAMPING });

        expect(spring(0).position).toBe(-10);
        const finalState = spring(2);
        expect(finalState.position).toBeCloseTo(-5, 1);
      });

      it('should handle large displacement', () => {
        const spring = createSpring(0, TEST_LARGE_DISPLACEMENT, { stiffness: TEST_STIFFNESS, damping: TEST_DAMPING });

        expect(spring(0).position).toBe(0);
        const finalState = spring(TEST_SETTLE_TIME_SHORT);
        expect(finalState.position).toBeCloseTo(TEST_LARGE_DISPLACEMENT, 0);
      });
    });

    describe('clampVelocity edge cases', () => {
      it('should handle zero maxVelocity', () => {
        const velocity: Point2D = { x: TEST_SPRING_TARGET, y: TEST_SPRING_TARGET };
        const result = clampVelocity(velocity, 0);

        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
      });

      it('should handle very small maxVelocity', () => {
        const velocity: Point2D = { x: TEST_SPRING_TARGET, y: TEST_SPRING_TARGET };
        const result = clampVelocity(velocity, 0.001);

        const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
        expect(magnitude).toBeCloseTo(0.001, 6);
      });
    });
  });
});
