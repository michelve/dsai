/**
 * @file Tests for RateLimiter
 * @description Tests for rate limiting logic used by the Figma API client
 */

import { RateLimiter } from '../rate-limiter.js';

// ==========================================================================
// Test Constants
// ==========================================================================

/** Custom throttle threshold for config tests */
const TEST_THROTTLE_THRESHOLD = 0.3;

/** Custom throttle delay in ms for config tests */
const TEST_THROTTLE_DELAY_MS = 3000;

/** Custom critical delay in ms for config tests */
const TEST_CRITICAL_DELAY_MS = 8000;

/** Custom critical threshold for config tests */
const TEST_CRITICAL_THRESHOLD = 0.05;

/** Default critical threshold used by RateLimiter */
const DEFAULT_CRITICAL_THRESHOLD = 0.1;

/** Default throttle delay in ms used by RateLimiter */
const DEFAULT_THROTTLE_DELAY_MS = 2000;

/** Default critical delay in ms used by RateLimiter */
const DEFAULT_CRITICAL_DELAY_MS = 5000;

/** Future reset offset in seconds for test headers */
const TEST_RESET_OFFSET_LONG_S = 300;

/** Short reset offset in seconds */
const TEST_RESET_OFFSET_SHORT_S = 60;

/** Medium reset offset in seconds */
const TEST_RESET_OFFSET_MEDIUM_S = 120;

/** Milliseconds per second */
const MS_PER_SECOND = 1000;

/** Tolerance window in ms for time-until-reset assertions */
const RESET_TIME_TOLERANCE_MS = 119000;

describe('RateLimiter', () => {
  // ==========================================================================
  // Constructor
  // ==========================================================================

  describe('Constructor', () => {
    it('uses default config values when no config is provided', () => {
      const limiter = new RateLimiter();

      // No limit info yet, so defaults are tested indirectly
      expect(limiter.getInfo()).toBeNull();
      expect(limiter.getRemaining()).toBe(-1);
      expect(limiter.getRatio()).toBe(1);
    });

    it('accepts custom config values', () => {
      const limiter = new RateLimiter({
        throttleThreshold: TEST_THROTTLE_THRESHOLD,
        throttleDelay: TEST_THROTTLE_DELAY_MS,
        criticalDelay: TEST_CRITICAL_DELAY_MS,
        criticalThreshold: TEST_CRITICAL_THRESHOLD,
      });

      // Set up headers with a future reset time and ratio at 0.06 (between custom critical 0.05 and custom throttle 0.3)
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;
      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '6',
        'x-ratelimit-reset': String(futureReset),
      });

      // 6/100 = 0.06, which is > criticalThreshold(0.05) but <= throttleThreshold(0.3)
      expect(limiter.shouldThrottle()).toBe(true);
      expect(limiter.isCritical()).toBe(false);
      expect(limiter.getDelay()).toBe(TEST_THROTTLE_DELAY_MS);
    });

    it('applies critical delay when ratio is at or below critical threshold', () => {
      const limiter = new RateLimiter({
        criticalThreshold: DEFAULT_CRITICAL_THRESHOLD,
        criticalDelay: TEST_CRITICAL_DELAY_MS,
      });

      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;
      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5', // 5/100 = 0.05 <= 0.1
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.isCritical()).toBe(true);
      expect(limiter.getDelay()).toBe(TEST_CRITICAL_DELAY_MS);
    });
  });

  // ==========================================================================
  // updateFromHeaders
  // ==========================================================================

  describe('updateFromHeaders', () => {
    it('parses rate limit headers from a Headers instance', () => {
      const limiter = new RateLimiter();
      const resetTime = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_SHORT_S;

      const headers = new Headers();
      headers.set('x-ratelimit-limit', '500');
      headers.set('x-ratelimit-remaining', '450');
      headers.set('x-ratelimit-reset', String(resetTime));

      limiter.updateFromHeaders(headers);

      const info = limiter.getInfo();
      expect(info).not.toBeNull();
      expect(info!.limit).toBe(500);
      expect(info!.remaining).toBe(450);
      expect(info!.reset).toBe(resetTime);
      expect(info!.resetAt).toEqual(new Date(resetTime * MS_PER_SECOND));
    });

    it('parses rate limit headers from a plain object', () => {
      const limiter = new RateLimiter();
      const resetTime = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_MEDIUM_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '80',
        'x-ratelimit-reset': String(resetTime),
      });

      const info = limiter.getInfo();
      expect(info).not.toBeNull();
      expect(info!.limit).toBe(100);
      expect(info!.remaining).toBe(80);
      expect(info!.reset).toBe(resetTime);
    });

    it('handles case-insensitive header lookup in plain objects', () => {
      const limiter = new RateLimiter();
      const resetTime = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_SHORT_S;

      limiter.updateFromHeaders({
        'X-RateLimit-Limit': '200',
        'X-RateLimit-Remaining': '150',
        'X-RateLimit-Reset': String(resetTime),
      });

      const info = limiter.getInfo();
      expect(info).not.toBeNull();
      expect(info!.limit).toBe(200);
      expect(info!.remaining).toBe(150);
    });

    it('does not update info when headers are missing', () => {
      const limiter = new RateLimiter();

      limiter.updateFromHeaders({});

      expect(limiter.getInfo()).toBeNull();
    });

    it('does not update info when only some headers are present', () => {
      const limiter = new RateLimiter();

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        // missing remaining and reset
      });

      expect(limiter.getInfo()).toBeNull();
    });

    it('does not update info with empty Headers instance', () => {
      const limiter = new RateLimiter();
      limiter.updateFromHeaders(new Headers());
      expect(limiter.getInfo()).toBeNull();
    });
  });

  // ==========================================================================
  // getDelay
  // ==========================================================================

  describe('getDelay', () => {
    it('returns 0 when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.getDelay()).toBe(0);
    });

    it('returns 0 when quota is healthy', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '80', // 80% remaining, well above threshold
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getDelay()).toBe(0);
    });

    it('returns throttle delay when below throttle threshold', () => {
      const limiter = new RateLimiter(); // default thresholds: throttle=0.2, critical=0.1
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '15', // 15% - below 20% throttle threshold, above 10% critical
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getDelay()).toBe(DEFAULT_THROTTLE_DELAY_MS);
    });

    it('returns critical delay when below critical threshold', () => {
      const limiter = new RateLimiter(); // default critical threshold: 0.1
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5', // 5% - below 10% critical threshold
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getDelay()).toBe(DEFAULT_CRITICAL_DELAY_MS);
    });

    it('returns critical delay when remaining is 0', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getDelay()).toBe(DEFAULT_CRITICAL_DELAY_MS);
    });

    it('returns 0 when rate limit has already reset (past reset time)', () => {
      const limiter = new RateLimiter();
      const pastReset = Math.floor(Date.now() / MS_PER_SECOND) - TEST_RESET_OFFSET_SHORT_S; // 60 seconds ago

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5', // Would normally be critical
        'x-ratelimit-reset': String(pastReset),
      });

      expect(limiter.getDelay()).toBe(0);
    });
  });

  // ==========================================================================
  // wait
  // ==========================================================================

  describe('wait', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('resolves immediately when no delay is needed', async () => {
      const limiter = new RateLimiter();
      // No limit info set, so delay = 0
      await limiter.wait();
      // If we got here, it resolved immediately
    });

    it('waits for the throttle delay', async () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '15', // throttle range
        'x-ratelimit-reset': String(futureReset),
      });

      const waitPromise = limiter.wait();
      jest.advanceTimersByTime(DEFAULT_THROTTLE_DELAY_MS);
      await waitPromise;
      // Promise resolved after advancing timers
    });

    it('waits for the critical delay', async () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5', // critical range
        'x-ratelimit-reset': String(futureReset),
      });

      const waitPromise = limiter.wait();
      jest.advanceTimersByTime(DEFAULT_CRITICAL_DELAY_MS);
      await waitPromise;
    });
  });

  // ==========================================================================
  // isCritical
  // ==========================================================================

  describe('isCritical', () => {
    it('returns false when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.isCritical()).toBe(false);
    });

    it('returns false when ratio is above critical threshold', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '50',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.isCritical()).toBe(false);
    });

    it('returns true when ratio is at or below critical threshold', () => {
      const limiter = new RateLimiter(); // critical threshold 0.1
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '10', // exactly 10% = 0.1
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.isCritical()).toBe(true);
    });
  });

  // ==========================================================================
  // shouldThrottle
  // ==========================================================================

  describe('shouldThrottle', () => {
    it('returns false when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.shouldThrottle()).toBe(false);
    });

    it('returns false when ratio is above throttle threshold', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '50',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.shouldThrottle()).toBe(false);
    });

    it('returns true when ratio is at or below throttle threshold', () => {
      const limiter = new RateLimiter(); // throttle threshold 0.2
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '20', // exactly 20% = 0.2
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.shouldThrottle()).toBe(true);
    });

    it('returns true when critical (critical implies throttle)', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.shouldThrottle()).toBe(true);
      expect(limiter.isCritical()).toBe(true);
    });
  });

  // ==========================================================================
  // getInfo
  // ==========================================================================

  describe('getInfo', () => {
    it('returns null when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.getInfo()).toBeNull();
    });

    it('returns the full rate limit info object after headers are parsed', () => {
      const limiter = new RateLimiter();
      const resetTime = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_MEDIUM_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '500',
        'x-ratelimit-remaining': '300',
        'x-ratelimit-reset': String(resetTime),
      });

      const info = limiter.getInfo();
      expect(info).toEqual({
        limit: 500,
        remaining: 300,
        reset: resetTime,
        resetAt: new Date(resetTime * MS_PER_SECOND),
      });
    });
  });

  // ==========================================================================
  // getRemaining
  // ==========================================================================

  describe('getRemaining', () => {
    it('returns -1 when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.getRemaining()).toBe(-1);
    });

    it('returns remaining requests after headers are parsed', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '42',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getRemaining()).toBe(42);
    });
  });

  // ==========================================================================
  // getRatio
  // ==========================================================================

  describe('getRatio', () => {
    it('returns 1 when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.getRatio()).toBe(1);
    });

    it('returns correct ratio after headers are parsed', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '200',
        'x-ratelimit-remaining': '100',
        'x-ratelimit-reset': String(futureReset),
      });

      expect(limiter.getRatio()).toBe(0.5);
    });
  });

  // ==========================================================================
  // getTimeUntilReset
  // ==========================================================================

  describe('getTimeUntilReset', () => {
    it('returns 0 when no limit info is set', () => {
      const limiter = new RateLimiter();
      expect(limiter.getTimeUntilReset()).toBe(0);
    });

    it('returns positive time until reset for a future reset', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_MEDIUM_S; // 2 minutes from now

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '50',
        'x-ratelimit-reset': String(futureReset),
      });

      const timeUntilReset = limiter.getTimeUntilReset();
      // Should be roughly 120000ms (2 minutes), allowing some tolerance
      expect(timeUntilReset).toBeGreaterThan(RESET_TIME_TOLERANCE_MS);
      expect(timeUntilReset).toBeLessThanOrEqual(TEST_RESET_OFFSET_MEDIUM_S * MS_PER_SECOND);
    });

    it('returns 0 when reset time is in the past', () => {
      const limiter = new RateLimiter();
      const pastReset = Math.floor(Date.now() / MS_PER_SECOND) - TEST_RESET_OFFSET_SHORT_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '50',
        'x-ratelimit-reset': String(pastReset),
      });

      expect(limiter.getTimeUntilReset()).toBe(0);
    });
  });

  // ==========================================================================
  // reset
  // ==========================================================================

  describe('reset', () => {
    it('clears all rate limit state', () => {
      const limiter = new RateLimiter();
      const futureReset = Math.floor(Date.now() / MS_PER_SECOND) + TEST_RESET_OFFSET_LONG_S;

      limiter.updateFromHeaders({
        'x-ratelimit-limit': '100',
        'x-ratelimit-remaining': '5',
        'x-ratelimit-reset': String(futureReset),
      });

      // Verify state is set
      expect(limiter.getInfo()).not.toBeNull();
      expect(limiter.isCritical()).toBe(true);

      // Reset
      limiter.reset();

      // Verify state is cleared
      expect(limiter.getInfo()).toBeNull();
      expect(limiter.getRemaining()).toBe(-1);
      expect(limiter.getRatio()).toBe(1);
      expect(limiter.getTimeUntilReset()).toBe(0);
      expect(limiter.isCritical()).toBe(false);
      expect(limiter.shouldThrottle()).toBe(false);
      expect(limiter.getDelay()).toBe(0);
    });
  });
});
