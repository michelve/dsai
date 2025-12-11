/**
 * Measure function execution time.
 *
 * Uses the Performance API when available and falls back to Date.now() in SSR.
 * Provides accurate millisecond-precision timing for performance monitoring.
 */

/**
 * Performance measurement result.
 */
export interface PerformanceMeasurement {
  /**
   * Duration in milliseconds.
   */
  readonly duration: number;
  /**
   * Operation name.
   */
  readonly name: string;
  /**
   * Start timestamp (from performance.now() or Date.now()).
   */
  readonly startTime: number;
  /**
   * End timestamp (from performance.now() or Date.now()).
   */
  readonly endTime: number;
  /**
   * Optional trace identifier for correlating measurements.
   */
  readonly traceId?: string;
  /**
   * Optional span identifier for nested measurements.
   */
  readonly spanId?: string;
  /**
   * Optional string tags for indexing/aggregation.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Options for measuring performance.
 */
export interface MeasurePerformanceOptions {
  /**
   * Logical name of the operation being measured.
   */
  readonly name?: string;
  /**
   * Callback invoked with the final measurement.
   * Must never throw – we harden against that in the implementation.
   */
  readonly onMeasure?: (measurement: PerformanceMeasurement & { result: unknown }) => void;
  /**
   * Whether to use Performance marks/measures when available.
   * Defaults to true.
   */
  readonly useMarks?: boolean;
  /**
   * Optional sampling rate (0–1). If provided, overrides the global default.
   */
  readonly sampleRate?: number;
  /**
   * Optional trace identifier. If omitted, a new one is generated.
   */
  readonly traceId?: string;
  /**
   * Optional span identifier. If omitted, a new one is generated.
   */
  readonly spanId?: string;
  /**
   * Optional tags to attach to the measurement.
   */
  readonly tags?: Record<string, string>;
}

/**
 * Narrow view of the Performance API that we care about.
 */
type PerformanceLike = Pick<
  Performance,
  'now' | 'mark' | 'measure' | 'clearMarks' | 'clearMeasures'
>;

/**
 * Get Performance API instance from global scope if available.
 *
 * We avoid isBrowser() here on purpose so tests can reliably mock it
 * via (globalThis as any).performance or window.performance.
 */
function getPerformance(): PerformanceLike | undefined {
  const globalPerf = (globalThis as any).performance as PerformanceLike | undefined;

  // In jsdom, window.performance may be separate; prefer global, then window.
  const windowPerf =
    typeof window !== 'undefined'
      ? ((window as any).performance as PerformanceLike | undefined)
      : undefined;

  const perf = globalPerf ?? windowPerf;
  return perf ?? undefined;
}

/**
 * Get current timestamp with best available precision
 *
 * @returns Milliseconds since epoch (or Performance API origin)
 * @internal
 */
function now(): number {
  const perf = getPerformance();
  if (perf && typeof perf.now === 'function') {
    try {
      return perf.now();
    } catch {
      // Ignore Performance API failures and fall back
    }
  }

  return Date.now();
}

/**
 * Measure a synchronous function.
 */
export function measurePerformance<T>(
  fn: () => T,
  options: MeasurePerformanceOptions = {}
): PerformanceMeasurement & { result: T } {
  const { name = 'anonymous', onMeasure, useMarks = true } = options;

  const perf = getPerformance();
  const hasPerformance = !!perf;
  const canUseMarks =
    hasPerformance &&
    useMarks &&
    typeof perf?.mark === 'function' &&
    typeof perf?.measure === 'function';

  const markStart = `${name}-start`;
  const markEnd = `${name}-end`;

  // Create performance mark if available
  if (canUseMarks && perf) {
    try {
      perf.mark(markStart);
    } catch {
      // Ignore mark errors (quota exceeded, etc.)
    }
  }

  const startTime = now();
  const result = fn();
  const endTime = now();
  const duration = endTime - startTime;

  // Create performance measure if available
  if (canUseMarks && perf) {
    try {
      perf.mark(markEnd);
      perf.measure(name, markStart, markEnd);

      // Clean up marks to avoid memory leaks
      if (typeof perf.clearMarks === 'function') {
        perf.clearMarks(markStart);
        perf.clearMarks(markEnd);
      }
      if (typeof perf.clearMeasures === 'function') {
        perf.clearMeasures(name);
      }
    } catch {
      // Ignore measure errors
    }
  }

  const measurement: PerformanceMeasurement & { result: T } = {
    duration,
    result,
    name,
    startTime,
    endTime,
  };

  if (onMeasure) {
    try {
      onMeasure(measurement);
    } catch {
      // Never throw from callbacks
    }
  }

  return measurement;
}

/**
 * Measure an asynchronous function (Promise-returning).
 */
export async function measurePerformanceAsync<T>(
  fn: () => Promise<T>,
  options: MeasurePerformanceOptions = {}
): Promise<PerformanceMeasurement & { result: T }> {
  const { name = 'anonymous', onMeasure, useMarks = true } = options;

  const perf = getPerformance();
  const hasPerformance = !!perf;
  const canUseMarks =
    hasPerformance &&
    useMarks &&
    typeof perf?.mark === 'function' &&
    typeof perf?.measure === 'function';

  const markStart = `${name}-start`;
  const markEnd = `${name}-end`;

  if (canUseMarks && perf) {
    try {
      perf.mark(markStart);
    } catch {
      // Ignore
    }
  }

  const startTime = now();
  const result = await fn();
  const endTime = now();
  const duration = endTime - startTime;

  if (canUseMarks && perf) {
    try {
      perf.mark(markEnd);
      perf.measure(name, markStart, markEnd);
      if (typeof perf.clearMarks === 'function') {
        perf.clearMarks(markStart);
        perf.clearMarks(markEnd);
      }
      if (typeof perf.clearMeasures === 'function') {
        perf.clearMeasures(name);
      }
    } catch {
      // Ignore
    }
  }

  const measurement: PerformanceMeasurement & { result: T } = {
    duration,
    result,
    name,
    startTime,
    endTime,
  };

  if (onMeasure) {
    try {
      onMeasure(measurement);
    } catch {
      // Never throw from callbacks
    }
  }

  return measurement;
}
