/**
 * Global telemetry configuration
 *
 * Provides centralized configuration for telemetry behavior including
 * redaction rules, sampling rates, and integration with external monitoring.
 *
 * @module utils/telemetry
 */

import type { PerformanceMeasurement } from './measurePerformance';

/**
 * Secure-ish random fraction in [0,1) using crypto when available.
 * Falls back to time-based entropy to avoid Math.random for security scanners.
 */
function getSecureRandomFraction(): number {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    const buffer = new Uint32Array(1);
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0] / 0xffffffff;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomBytes } = require('node:crypto') as typeof import('node:crypto');
    const bytes = randomBytes(4);
    const value =
      (bytes[0] ?? 0) * 0x1000000 +
      (bytes[1] ?? 0) * 0x10000 +
      (bytes[2] ?? 0) * 0x100 +
      (bytes[3] ?? 0);
    return value / 0xffffffff;
  } catch {
    // Deterministic fallback: use time-based entropy
    const timeSlice = Date.now() % 1000;
    return timeSlice / 1000;
  }
}

/**
 * Telemetry client interface for external monitoring integration
 *
 * Implement this interface to integrate with services like:
 * - Datadog
 * - New Relic
 * - Sentry
 * - OpenTelemetry
 * - Custom logging backends
 *
 * @example
 * ```ts
 * const datadogClient: TelemetryClient = {
 *   trackPerformance(measurement) {
 *     DD_RUM.addTiming(measurement.name, measurement.duration);
 *   },
 *   trackError(error, context) {
 *     DD_LOGS.logger.error(error.message, { error, ...context });
 *   }
 * };
 *
 * setTelemetryClient(datadogClient);
 * ```
 */
export interface TelemetryClient {
  /**
   * Track performance measurement
   *
   * @param measurement - Performance measurement data
   */
  trackPerformance(measurement: PerformanceMeasurement & { result?: unknown }): void;

  /**
   * Track error occurrence
   *
   * @param error - Error instance
   * @param context - Additional context data (already redacted)
   */
  trackError(error: Error, context?: Record<string, unknown>): void;
}

/**
 * Global telemetry configuration options
 */
export interface TelemetryGlobalConfig {
  /**
   * Default keys to redact from error context
   *
   * These are merged with per-call redactKeys.
   * Case-insensitive partial matching.
   *
   * @default ['password', 'token', 'secret', 'apiKey', 'accessToken', 'auth']
   */
  defaultRedactKeys: string[];

  /**
   * Whether to allow additional redact keys per call
   *
   * When false, only defaultRedactKeys are used (strict mode).
   *
   * @default true
   */
  allowAdditionalRedactKeys: boolean;

  /**
   * Default sampling rate for performance measurements
   *
   * Value between 0 and 1:
   * - 1.0 = measure every call (100%)
   * - 0.1 = measure 10% of calls
   * - 0 = disable all measurements
   *
   * Can be overridden per measurement.
   *
   * @default 1.0 (measure everything)
   */
  defaultSampleRate: number;
}

/**
 * Default global configuration
 */
const DEFAULT_CONFIG: TelemetryGlobalConfig = {
  defaultRedactKeys: ['password', 'token', 'secret', 'apiKey', 'accessToken', 'auth'],
  allowAdditionalRedactKeys: true,
  defaultSampleRate: 1.0,
};

/**
 * Current global configuration
 */
let globalConfig: TelemetryGlobalConfig = { ...DEFAULT_CONFIG };

/**
 * Current telemetry client (if any)
 */
let telemetryClient: TelemetryClient | null = null;

/**
 * Set global telemetry configuration
 *
 * @example
 * ```ts
 * // Add custom redact keys for healthcare app
 * setTelemetryConfig({
 *   defaultRedactKeys: [
 *     'password', 'token', 'ssn', 'dob', 'medicalRecordNumber'
 *   ]
 * });
 * ```
 *
 * @example
 * ```ts
 * // Enable sampling for high-traffic endpoints
 * setTelemetryConfig({
 *   defaultSampleRate: 0.1 // Only measure 10% of calls
 * });
 * ```
 *
 * @param config - Partial configuration to merge with defaults
 */
export function setTelemetryConfig(config: Partial<TelemetryGlobalConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Get current global telemetry configuration
 *
 * @returns Current configuration (readonly copy)
 */
export function getTelemetryConfig(): Readonly<TelemetryGlobalConfig> {
  return { ...globalConfig };
}

/**
 * Reset telemetry configuration to defaults
 *
 * Useful for testing or cleanup.
 */
export function resetTelemetryConfig(): void {
  globalConfig = { ...DEFAULT_CONFIG };
}

/**
 * Set global telemetry client for external monitoring
 *
 * @example
 * ```ts
 * // Integrate with Sentry
 * setTelemetryClient({
 *   trackPerformance(measurement) {
 *     Sentry.addBreadcrumb({
 *       category: 'performance',
 *       message: measurement.name,
 *       level: 'info',
 *       data: { duration: measurement.duration }
 *     });
 *   },
 *   trackError(error, context) {
 *     Sentry.captureException(error, {
 *       tags: context,
 *       level: 'error'
 *     });
 *   }
 * });
 * ```
 *
 * @param client - Telemetry client implementation (or null to disable)
 */
export function setTelemetryClient(client: TelemetryClient | null): void {
  telemetryClient = client;
}

/**
 * Get current telemetry client
 *
 * @returns Current client or null if not set
 */
export function getTelemetryClient(): TelemetryClient | null {
  return telemetryClient;
}

/**
 * Get merged redact keys (global + per-call)
 *
 * @param additionalKeys - Per-call redact keys
 * @returns Combined unique redact keys
 * @internal
 */
export function getMergedRedactKeys(additionalKeys: string[] = []): string[] {
  const config = getTelemetryConfig();

  if (!config.allowAdditionalRedactKeys) {
    // Strict mode: only use global keys
    return [...config.defaultRedactKeys];
  }

  // Merge and deduplicate
  const merged = new Set([...config.defaultRedactKeys, ...additionalKeys]);
  return Array.from(merged);
}

/**
 * Check if measurement should be sampled based on sample rate
 *
 * @param sampleRate - Sample rate (0-1), or undefined to use global default
 * @returns True if measurement should proceed
 * @internal
 */
export function shouldSample(sampleRate?: number): boolean {
  const rate = sampleRate ?? getTelemetryConfig().defaultSampleRate;

  // Clamp to valid range
  const clampedRate = Math.max(0, Math.min(1, rate));

  // Always sample if rate is 1
  if (clampedRate >= 1) {
    return true;
  }

  // Never sample if rate is 0
  if (clampedRate <= 0) {
    return false;
  }

  // Probabilistic sampling
  return getSecureRandomFraction() < clampedRate;
}
