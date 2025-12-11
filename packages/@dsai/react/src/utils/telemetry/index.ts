/**
 * Telemetry utilities
 *
 * Performance measurement, timing, and error tracking utilities.
 * All utilities are SSR-safe and provide zero-overhead when telemetry is disabled.
 *
 * @module utils/telemetry
 */

export { catchErrors, catchErrorsAsync } from './catchErrors';
export type { CatchErrorsOptions, ErrorHandler } from './catchErrors';

export {
  getTelemetryClient,
  getTelemetryConfig,
  resetTelemetryConfig,
  setTelemetryClient,
  setTelemetryConfig,
} from './config';
export type { TelemetryClient, TelemetryGlobalConfig } from './config';

export { endTiming } from './endTiming';

export { measurePerformance, measurePerformanceAsync } from './measurePerformance';
export type { MeasurePerformanceOptions, PerformanceMeasurement } from './measurePerformance';

export { startTiming } from './startTiming';
export type { TimingSession } from './startTiming';

export {
  isTelemetryContext,
  normalizeTelemetryContext,
  type FlexibleContext,
  type TelemetryContext,
} from './types';

export { wrapWithTelemetry, wrapWithTelemetryAsync } from './wrapWithTelemetry';
export type { TelemetryHooks, WrapTelemetryOptions } from './wrapWithTelemetry';
