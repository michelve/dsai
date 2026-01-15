# Telemetry Utilities

Performance measurement, timing, and error tracking utilities for observability.

## Overview

This module provides utilities for:

- Performance measurement
- Timing sessions
- Error tracking
- Telemetry client configuration

## Installation

```tsx
import {
  measurePerformance,
  startTiming,
  endTiming,
  catchErrors,
  wrapWithTelemetry,
  setTelemetryClient,
} from '@dsai-io/react';
```

---

## Configuration

### `setTelemetryClient`

Configure global telemetry client.

**Signature:**

```tsx
function setTelemetryClient(client: TelemetryClient): void;

interface TelemetryClient {
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackMetric: (name: string, value: number, properties?: Record<string, unknown>) => void;
  trackError: (error: Error, context?: Record<string, unknown>) => void;
}
```

**Examples:**

```tsx
// Configure with Application Insights
setTelemetryClient({
  trackEvent: (name, props) => {
    appInsights.trackEvent({ name, properties: props });
  },
  trackMetric: (name, value, props) => {
    appInsights.trackMetric({ name, average: value }, props);
  },
  trackError: (error, context) => {
    appInsights.trackException({ exception: error, properties: context });
  },
});

// Configure with custom analytics
setTelemetryClient({
  trackEvent: (name, props) => analytics.track(name, props),
  trackMetric: (name, value) => analytics.metric(name, value),
  trackError: (error, context) => logger.error(error, context),
});
```

---

## Performance Measurement

### `measurePerformance`

Measure synchronous function performance.

**Signature:**

```tsx
function measurePerformance<T>(
  fn: () => T,
  options?: MeasurePerformanceOptions
): PerformanceMeasurement<T>;

interface PerformanceMeasurement<T> {
  result: T;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}
```

**Examples:**

```tsx
// Measure function
const measurement = measurePerformance(() => {
  return expensiveCalculation();
});

console.log('Duration:', measurement.duration, 'ms');
console.log('Result:', measurement.result);

// With metadata
const measurement = measurePerformance(() => processData(data), {
  name: 'dataProcessing',
  metadata: { rows: data.length },
  trackMetric: true, // Auto-send to telemetry client
});

// Async version
const measurement = await measurePerformanceAsync(
  async () => {
    return await fetchData();
  },
  {
    name: 'fetchData',
    trackMetric: true,
  }
);
```

---

## Timing Sessions

### `startTiming` / `endTiming`

Track duration of operations with manual control.

**Signature:**

```tsx
function startTiming(name: string): TimingSession;

interface TimingSession {
  name: string;
  startTime: number;
  end(metadata?: Record<string, unknown>): number;
}

function endTiming(session: TimingSession): number;
```

**Examples:**

```tsx
// Manual timing
const session = startTiming('renderComponent');

// ... do work ...

const duration = endTiming(session);
console.log('Rendered in', duration, 'ms');

// With session object
const session = startTiming('apiCall');
try {
  await api.fetch();
  session.end({ success: true });
} catch (error) {
  session.end({ success: false, error: error.message });
}
```

---

## Error Tracking

### `catchErrors`

Catch and track errors with context.

**Signature:**

```tsx
function catchErrors<T>(fn: () => T, options?: CatchErrorsOptions): T | undefined;

interface CatchErrorsOptions {
  onError?: ErrorHandler;
  context?: Record<string, unknown>;
  rethrow?: boolean;
}
```

**Examples:**

```tsx
// Basic error catching
const result = catchErrors(
  () => {
    return riskyOperation();
  },
  {
    onError: (error, context) => {
      console.error('Operation failed:', error);
    },
  }
);

// With context
const result = catchErrors(() => processItem(item), {
  context: { itemId: item.id },
  rethrow: false, // Don't throw, return undefined
});

// Async version
const result = await catchErrorsAsync(
  async () => {
    return await api.call();
  },
  {
    onError: (error, context) => {
      logError(error, context);
    },
  }
);
```

---

## Function Wrapping

### `wrapWithTelemetry`

Wrap function with automatic telemetry.

**Signature:**

```tsx
function wrapWithTelemetry<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: WrapTelemetryOptions
): T;

interface TelemetryHooks {
  onStart?: (args: unknown[]) => void;
  onSuccess?: (result: unknown) => void;
  onError?: (error: Error) => void;
  onEnd?: (duration: number) => void;
}
```

**Examples:**

```tsx
// Wrap function with telemetry
const trackedFunction = wrapWithTelemetry(myFunction, {
  name: 'myFunction',
  hooks: {
    onStart: (args) => {
      console.log('Started with:', args);
    },
    onSuccess: (result) => {
      console.log('Succeeded with:', result);
    },
    onError: (error) => {
      console.error('Failed with:', error);
    },
    onEnd: (duration) => {
      console.log('Took:', duration, 'ms');
    },
  },
});

// Async wrapper
const trackedAsync = wrapWithTelemetryAsync(asyncFunction, { name: 'asyncOperation' });
```

---

## Common Patterns

### React Component Performance

```tsx
function ExpensiveComponent({ data }: Props) {
  useEffect(() => {
    const session = startTiming('ExpensiveComponent.render');

    return () => {
      endTiming(session);
    };
  }, []);

  const processedData = useMemo(() => {
    return measurePerformance(() => processData(data), { name: 'dataProcessing' }).result;
  }, [data]);

  return <div>{processedData}</div>;
}
```

### API Call Tracking

```tsx
async function fetchUser(id: string) {
  const measurement = await measurePerformanceAsync(
    async () => {
      const response = await fetch(`/api/users/${id}`);
      return response.json();
    },
    {
      name: 'fetchUser',
      metadata: { userId: id },
      trackMetric: true,
    }
  );

  return measurement.result;
}
```

### Error Boundary Integration

```tsx
function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      onError={(error, errorInfo) => {
        catchErrors(
          () => {
            throw error;
          },
          {
            context: {
              componentStack: errorInfo.componentStack,
            },
          }
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

---

## Best Practices

1. **Configure telemetry client early:**

```tsx
// In app initialization
setTelemetryClient(appInsightsClient);
```

1. **Add context to measurements:**

```tsx
measurePerformance(fn, {
  metadata: { userId, actionType },
});
```

1. **Use timing sessions for multi-step operations:**

```tsx
const session = startTiming('checkout');
// ... multiple steps ...
session.end({ itemCount, total });
```

1. **Wrap critical functions:**

```tsx
const trackedFunction = wrapWithTelemetry(criticalOperation, { name: 'criticalOperation' });
```

---

## Performance Notes

- Zero overhead when telemetry client not configured
- Uses `performance.now()` for high-precision timing
- Async operations tracked correctly with Promise handling

---

## Related Documentation

- [Main Utils README](../README.md)
- [DX Utilities](../dx/README.md)
- [Timing Utilities](../timing/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
