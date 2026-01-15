/**
 * @file Telemetry runtime guards test suite
 */

import { catchErrors } from '../telemetry/catchErrors';
import { getTelemetryClient, setTelemetryClient, resetTelemetryConfig } from '../telemetry/config';
import { measurePerformance } from '../telemetry/measurePerformance';
import { startTiming } from '../telemetry/startTiming';

describe('Telemetry runtime guards', () => {
  afterEach(() => {
    resetTelemetryConfig();
    jest.restoreAllMocks();
  });

  it('uses Date.now when performance is unavailable', () => {
    const savedPerf = (globalThis as any).performance;
    delete (globalThis as any).performance;
    const result = measurePerformance(() => 'ok');
    expect(result.duration).toBeGreaterThanOrEqual(0);
    if (savedPerf) {
      (globalThis as any).performance = savedPerf;
    }
  });

  it('startTiming returns sane values without performance', () => {
    const savedPerf = (globalThis as any).performance;
    delete (globalThis as any).performance;
    const timer = startTiming('no-perf');
    const elapsed = timer.elapsed();
    const total = timer.end();
    expect(elapsed).toBeGreaterThanOrEqual(0);
    expect(total).toBeGreaterThanOrEqual(0);
    if (savedPerf) {
      (globalThis as any).performance = savedPerf;
    }
  });

  it('catchErrors swallows handler errors and respects rethrow', () => {
    const onError = jest.fn(() => {
      throw new Error('handler failed');
    });
    const fn = catchErrors(
      () => {
        throw new Error('boom');
      },
      { onError, rethrow: false, fallback: 'fallback' }
    );
    expect(fn()).toBe('fallback');
    expect(onError).toHaveBeenCalled();
  });

  it('telemetry client errors do not throw', () => {
    const badClient = {
      trackError: () => {
        throw new Error('client failed');
      },
    } as any;
    setTelemetryClient(badClient);
    const fn = catchErrors(() => {
      throw new Error('boom');
    });
    expect(fn()).toBeUndefined();
    expect(getTelemetryClient()).toBe(badClient);
  });
});
