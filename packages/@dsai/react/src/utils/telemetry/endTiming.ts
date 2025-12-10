/**
 * End a timing session (convenience wrapper for startTiming().end())
 *
 * This module is intentionally minimal - prefer using startTiming() directly.
 * Provided for API completeness and backward compatibility with timing patterns.
 *
 * @module utils/telemetry
 */

import type { TimingSession } from './startTiming';

/**
 * End a timing session and return duration
 *
 * This is a convenience function. Prefer using the TimingSession.end() method directly.
 *
 * @example
 * ```ts
 * const timer = startTiming('operation');
 * // ... do work ...
 * const duration = endTiming(timer);
 * console.log(`Operation took ${duration}ms`);
 * ```
 *
 * @example Prefer this pattern instead
 * ```ts
 * const timer = startTiming('operation');
 * // ... do work ...
 * const duration = timer.end(); // More direct
 * ```
 *
 * @param session - Timing session to end
 * @returns Duration in milliseconds
 */
export function endTiming(session: TimingSession): number {
  return session.end();
}
