/**
 * @fileoverview Rate limiter for Figma API
 * Respects X-RateLimit-* headers and implements proactive throttling
 */

/**
 * Rate limit information from headers
 */
export interface RateLimitInfo {
  /** Total rate limit */
  limit: number;
  /** Remaining requests */
  remaining: number;
  /** Time when rate limit resets (Unix timestamp) */
  reset: number;
  /** Time when rate limit resets (Date) */
  resetAt: Date;
}

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  /** Minimum percentage of remaining requests before throttling (0-1) */
  throttleThreshold?: number;
  /** Delay in ms when below threshold */
  throttleDelay?: number;
  /** Delay in ms when critically low */
  criticalDelay?: number;
  /** Critical threshold percentage (0-1) */
  criticalThreshold?: number;
}

/** Default percentage of remaining requests before throttling (20%) */
const DEFAULT_THROTTLE_THRESHOLD = 0.2;

/** Default delay in ms when below throttle threshold */
const DEFAULT_THROTTLE_DELAY_MS = 2000;

/** Default delay in ms when critically low */
const DEFAULT_CRITICAL_DELAY_MS = 5000;

/** Default critical threshold percentage (10%) */
const DEFAULT_CRITICAL_THRESHOLD = 0.1;

/**
 * Rate limiter for Figma API
 * Tracks rate limit state and applies proactive delays
 */
export class RateLimiter {
  private limitInfo: RateLimitInfo | null = null;
  private readonly throttleThreshold: number;
  private readonly throttleDelay: number;
  private readonly criticalDelay: number;
  private readonly criticalThreshold: number;

  constructor(config: RateLimiterConfig = {}) {
    this.throttleThreshold = config.throttleThreshold ?? DEFAULT_THROTTLE_THRESHOLD;
    this.throttleDelay = config.throttleDelay ?? DEFAULT_THROTTLE_DELAY_MS;
    this.criticalDelay = config.criticalDelay ?? DEFAULT_CRITICAL_DELAY_MS;
    this.criticalThreshold = config.criticalThreshold ?? DEFAULT_CRITICAL_THRESHOLD;
  }

  /**
   * Update rate limit info from response headers
   */
  updateFromHeaders(headers: Headers | Record<string, string>): void {
    const getHeader = (key: string): string | null => {
      if (headers instanceof Headers) {
        return headers.get(key);
      }
      // Safe access for plain objects using entries
      const entries = Object.entries(headers);
      for (const [k, v] of entries) {
        if (k === key || k.toLowerCase() === key.toLowerCase()) {
          return v ?? null;
        }
      }
      return null;
    };

    const limit = getHeader('x-ratelimit-limit');
    const remaining = getHeader('x-ratelimit-remaining');
    const reset = getHeader('x-ratelimit-reset');

    if (limit && remaining && reset) {
      const limitNum = Number.parseInt(limit, 10);
      const remainingNum = Number.parseInt(remaining, 10);
      const resetNum = Number.parseInt(reset, 10);

      this.limitInfo = {
        limit: limitNum,
        remaining: remainingNum,
        reset: resetNum,
        resetAt: new Date(resetNum * 1000),
      };
    }
  }

  /**
   * Get delay in milliseconds based on current rate limit state
   */
  getDelay(): number {
    if (!this.limitInfo) {
      return 0;
    }

    // Check if rate limit has reset
    if (Date.now() >= this.limitInfo.reset * 1000) {
      return 0;
    }

    const ratio = this.limitInfo.remaining / this.limitInfo.limit;

    if (ratio <= this.criticalThreshold) {
      return this.criticalDelay;
    }

    if (ratio <= this.throttleThreshold) {
      return this.throttleDelay;
    }

    return 0;
  }

  /**
   * Wait if rate limit requires throttling
   */
  async wait(): Promise<void> {
    const delay = this.getDelay();
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  /**
   * Check if rate limit is critically low
   */
  isCritical(): boolean {
    if (!this.limitInfo) {
      return false;
    }

    const ratio = this.limitInfo.remaining / this.limitInfo.limit;
    return ratio <= this.criticalThreshold;
  }

  /**
   * Check if rate limit requires throttling
   */
  shouldThrottle(): boolean {
    if (!this.limitInfo) {
      return false;
    }

    const ratio = this.limitInfo.remaining / this.limitInfo.limit;
    return ratio <= this.throttleThreshold;
  }

  /**
   * Get current rate limit info
   */
  getInfo(): RateLimitInfo | null {
    return this.limitInfo;
  }

  /**
   * Get remaining requests
   */
  getRemaining(): number {
    return this.limitInfo?.remaining ?? -1;
  }

  /**
   * Get rate limit ratio (0-1)
   */
  getRatio(): number {
    if (!this.limitInfo) {
      return 1;
    }
    return this.limitInfo.remaining / this.limitInfo.limit;
  }

  /**
   * Get time until rate limit resets
   */
  getTimeUntilReset(): number {
    if (!this.limitInfo) {
      return 0;
    }

    const now = Date.now();
    const resetTime = this.limitInfo.reset * 1000;

    return Math.max(0, resetTime - now);
  }

  /**
   * Reset rate limiter state
   */
  reset(): void {
    this.limitInfo = null;
  }
}
