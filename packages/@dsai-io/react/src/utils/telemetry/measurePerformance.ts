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
  const globalPerf = (globalThis as { performance?: PerformanceLike }).performance;

  // In jsdom, window.performance may be separate; prefer global, then window.
  const windowPerf =
    typeof window !== 'undefined'
      ? (window as { performance?: PerformanceLike }).performance
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
/**
 * Check if the Performance API supports marks and measures.
 */
function canUsePerformanceMarks(perf: PerformanceLike | null | undefined, useMarks: boolean): perf is PerformanceLike {
  return (
    !!perf &&
    useMarks &&
    typeof perf.mark === 'function' &&
    typeof perf.measure === 'function'
  );
}

/**
 * Create a performance mark safely.
 */
function safePerformanceMark(perf: PerformanceLike, markName: string): void {
  try {
    perf.mark(markName);
  } catch {
    // Ignore mark errors (quota exceeded, etc.)
  }
}

/**
 * Create a performance measure and clean up marks.
 */
function safePerformanceMeasure(perf: PerformanceLike, name: string, markStart: string, markEnd: string): void {
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
    // Ignore measure errors
  }
}

/**
 * Safely invoke the onMeasure callback.
 */
function safeOnMeasure<T>(
  onMeasure: ((m: PerformanceMeasurement & { result: unknown }) => void) | undefined,
  measurement: PerformanceMeasurement & { result: T }
): void {
  if (!onMeasure) {
    return;
  }
  try {
    onMeasure(measurement);
  } catch {
    // Never throw from callbacks
  }
}

export function measurePerformance<T>(
  fn: () => T,
  options: MeasurePerformanceOptions = {}
): PerformanceMeasurement & { result: T } {
  const { name = 'anonymous', onMeasure, useMarks = true } = options;

  const perf = getPerformance();
  const useMarksApi = canUsePerformanceMarks(perf, useMarks);
  const markStart = `${name}-start`;
  const markEnd = `${name}-end`;

  if (useMarksApi) {
    safePerformanceMark(perf, markStart);
  }

  const startTime = now();
  const result = fn();
  const endTime = now();
  const duration = endTime - startTime;

  if (useMarksApi) {
    safePerformanceMeasure(perf, name, markStart, markEnd);
  }

  const measurement: PerformanceMeasurement & { result: T } = {
    duration,
    result,
    name,
    startTime,
    endTime,
  };

  safeOnMeasure(onMeasure, measurement);

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
  const useMarksApi = canUsePerformanceMarks(perf, useMarks);
  const markStart = `${name}-start`;
  const markEnd = `${name}-end`;

  if (useMarksApi) {
    safePerformanceMark(perf, markStart);
  }

  const startTime = now();
  const result = await fn();
  const endTime = now();
  const duration = endTime - startTime;

  if (useMarksApi) {
    safePerformanceMeasure(perf, name, markStart, markEnd);
  }

  const measurement: PerformanceMeasurement & { result: T } = {
    duration,
    result,
    name,
    startTime,
    endTime,
  };

  safeOnMeasure(onMeasure, measurement);

  return measurement;
}
