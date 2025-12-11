/**
 * @file exponentialBackoff - Calculate exponential backoff delay with jitter
 * @module @dsai/react/utils/async
 *
 * Enterprise-grade backoff calculator with:
 * - Configurable base delay and multiplier
 * - Optional jitter to prevent thundering herd
 * - Maximum delay cap
 * - Attempt-based calculation
 */

/**
 * Options for exponential backoff calculation
 */
export interface ExponentialBackoffOptions {
  /** Base delay in milliseconds (default: 1000) */
  baseDelay?: number;
  /** Multiplier for each attempt (default: 2) */
  multiplier?: number;
  /** Maximum delay cap in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Whether to add random jitter (default: true) */
  jitter?: boolean;
  /** Maximum jitter as percentage of delay (default: 0.25 = 25%) */
  jitterFactor?: number;
}

/**
 * Calculate exponential backoff delay for a given attempt
 *
 * Formula: min(maxDelay, baseDelay * (multiplier ^ attempt)) + jitter
 *
 * @param attempt - The current attempt number (0-indexed)
 * @param options - Backoff configuration options
 * @returns Delay in milliseconds before next retry
 *
 * @example
 * ```tsx
 * // Basic usage
 * exponentialBackoff(0); // ~1000ms (first retry)
 * exponentialBackoff(1); // ~2000ms (second retry)
 * exponentialBackoff(2); // ~4000ms (third retry)
 *
 * // Custom configuration
 * exponentialBackoff(2, {
 *   baseDelay: 500,
 *   multiplier: 3,
 *   maxDelay: 10000
 * }); // min(10000, 500 * 3^2) = 4500ms + jitter
 *
 * // Without jitter (deterministic)
 * exponentialBackoff(3, { jitter: false }); // Exactly 8000ms
 *
 * // Use in retry logic
 * async function fetchWithRetry(url: string, maxAttempts = 3) {
 *   for (let attempt = 0; attempt < maxAttempts; attempt++) {
 *     try {
 *       return await fetch(url);
 *     } catch (error) {
 *       if (attempt < maxAttempts - 1) {
 *         const delay = exponentialBackoff(attempt);
 *         await new Promise(resolve => setTimeout(resolve, delay));
 *       } else {
 *         throw error;
 *       }
 *     }
 *   }
 * }
 * ```
 */
export function exponentialBackoff(
  attempt: number,
  options: ExponentialBackoffOptions = {}
): number {
  const {
    baseDelay = 1000,
    multiplier = 2,
    maxDelay = 30000,
    jitter = true,
    jitterFactor = 0.25,
  } = options;

  // Validate inputs
  if (attempt < 0) {
    console.warn('[exponentialBackoff] Attempt must be >= 0, using 0');
    attempt = 0;
  }

  if (baseDelay <= 0) {
    console.warn('[exponentialBackoff] baseDelay must be > 0, using 1000');
    return 1000;
  }

  // Calculate base exponential delay
  const exponentialDelay = baseDelay * multiplier ** attempt;

  // Cap at maximum delay
  const cappedDelay = Math.min(maxDelay, exponentialDelay);

  // Add jitter if enabled
  if (jitter) {
    // Jitter range: delay * (1 - jitterFactor) to delay * (1 + jitterFactor)
    const jitterRange = cappedDelay * jitterFactor;
    const randomJitter = (Math.random() * 2 - 1) * jitterRange;
    return Math.max(0, Math.round(cappedDelay + randomJitter));
  }

  return Math.round(cappedDelay);
}
