# Async Utilities

Enterprise-grade asynchronous control flow utilities with retry logic, timeout management, and promise cancellation.

## Overview

This module provides utilities for:

- Retry logic with exponential backoff
- Promise timeout wrappers
- Abortable promises
- Task queuing and scheduling

## Installation

```tsx
import {
  retryWithBackoff,
  withTimeout,
  createAbortable,
  createTaskQueue,
  queueTask,
  exponentialBackoff,
} from '@dsai-io/react';
```

---

## Functions

### `retryWithBackoff`

Retry failed promises with exponential backoff and configurable retry logic.

**Signature:**

```tsx
function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: RetryWithBackoffOptions
): Promise<RetryResult<T>>;

interface RetryWithBackoffOptions extends ExponentialBackoffOptions {
  maxAttempts?: number; // Default: 3
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delay: number) => void;
  signal?: AbortSignal;
}

interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: unknown;
  attempts: number;
  totalTime: number;
  aborted?: boolean;
}
```

**Examples:**

```tsx
// Basic usage
const result = await retryWithBackoff(() => fetch('/api/data').then((r) => r.json()));

if (result.success) {
  console.log('Data:', result.data);
} else {
  console.error('Failed after', result.attempts, 'attempts');
}

// With custom options
const result = await retryWithBackoff(() => unstableApiCall(), {
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 10000,
  onRetry: (error, attempt, delay) => {
    console.log(`Retry attempt ${attempt} after ${delay}ms`);
  },
});

// Conditional retry
const result = await retryWithBackoff(() => apiCall(), {
  shouldRetry: (error, attempt) => {
    if (error instanceof NetworkError) return true;
    if (attempt >= 3) return false;
    return error.statusCode >= 500;
  },
});

// With abort signal
const controller = new AbortController();
const result = retryWithBackoff(() => fetchData(), { signal: controller.signal });

// Cancel after 30 seconds
setTimeout(() => controller.abort(), 30000);
```

---

### `withTimeout`

Wrap a promise with a timeout that rejects if not resolved within specified duration.

**Signature:**

```tsx
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  options?: WithTimeoutOptions
): Promise<T>;

interface WithTimeoutOptions {
  message?: string;
  controller?: AbortController;
}

class TimeoutError extends Error {
  name: 'TimeoutError';
  timeout: number;
}
```

**Examples:**

```tsx
// Basic usage
try {
  const data = await withTimeout(fetch('/api/data'), 5000);
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Request timed out after', error.timeout, 'ms');
  }
}

// With custom message
const result = await withTimeout(slowOperation(), 10000, { message: 'Operation took too long' });

// With AbortController for cleanup
const controller = new AbortController();
try {
  const data = await withTimeout(fetch('/api/data', { signal: controller.signal }), 5000, {
    controller,
  });
} catch (error) {
  console.log('Aborted:', controller.signal.aborted);
}

// In React component
useEffect(() => {
  const controller = new AbortController();

  withTimeout(fetchData({ signal: controller.signal }), 5000, { controller })
    .then(setData)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    });

  return () => controller.abort();
}, []);
```

---

### `createAbortable`

Create a cancellable promise wrapper using AbortController.

**Signature:**

```tsx
function createAbortable<T>(fn: (signal: AbortSignal) => Promise<T>): AbortablePromise<T>;

interface AbortablePromise<T> {
  promise: Promise<T>;
  abort: () => void;
  controller: AbortController;
  readonly aborted: boolean;
}
```

**Examples:**

```tsx
// Basic usage
const { promise, abort } = createAbortable(async (signal) => {
  const response = await fetch('/api/data', { signal });
  return response.json();
});

setTimeout(abort, 5000);

try {
  const data = await promise;
  console.log('Data:', data);
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}

// In React useEffect
useEffect(() => {
  const { promise, abort } = createAbortable(async (signal) => {
    const data = await fetchData({ signal });
    setData(data);
  });

  promise.catch((error) => {
    if (error.name !== 'AbortError') {
      setError(error);
    }
  });

  return abort;
}, []);

// Multiple fetch calls
const { promise, abort } = createAbortable(async (signal) => {
  const [users, posts] = await Promise.all([
    fetch('/api/users', { signal }).then((r) => r.json()),
    fetch('/api/posts', { signal }).then((r) => r.json()),
  ]);
  return { users, posts };
});
```

---

### `exponentialBackoff`

Calculate exponential backoff delay with jitter.

**Signature:**

```tsx
function exponentialBackoff(attempt: number, options?: ExponentialBackoffOptions): number;

interface ExponentialBackoffOptions {
  baseDelay?: number; // Default: 1000ms
  maxDelay?: number; // Default: 30000ms
  factor?: number; // Default: 2
  jitter?: boolean; // Default: true
}
```

**Examples:**

```tsx
// Calculate delay for attempt
const delay = exponentialBackoff(1); // ~1000ms
const delay = exponentialBackoff(2); // ~2000ms
const delay = exponentialBackoff(3); // ~4000ms

// Custom configuration
const delay = exponentialBackoff(attempt, {
  baseDelay: 500,
  maxDelay: 10000,
  factor: 3,
});

// Without jitter (deterministic)
const delay = exponentialBackoff(attempt, { jitter: false });
```

---

## Common Patterns

### API Request with Retry and Timeout

```tsx
async function robustApiCall<T>(endpoint: string): Promise<T> {
  const result = await retryWithBackoff(
    () =>
      withTimeout(
        fetch(endpoint).then((r) => r.json()),
        5000
      ),
    {
      maxAttempts: 3,
      shouldRetry: (error) => {
        if (error instanceof TimeoutError) return true;
        return error.statusCode >= 500;
      },
    }
  );

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
```

### React Data Fetching

```tsx
function useDataFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { promise, abort } = createAbortable(async (signal) => {
      const result = await retryWithBackoff(
        () =>
          withTimeout(
            fetch(url, { signal }).then((r) => r.json()),
            10000
          ),
        { maxAttempts: 3 }
      );

      if (result.success) {
        setData(result.data);
      } else {
        throw result.error;
      }
    });

    promise
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      })
      .finally(() => setLoading(false));

    return abort;
  }, [url]);

  return { data, loading, error };
}
```

### Task Queue

```tsx
const queue = createTaskQueue({ concurrency: 2 });

// Add tasks
queue.enqueue(() => fetchUser(1));
queue.enqueue(() => fetchUser(2));
queue.enqueue(() => fetchUser(3));

// Wait for all
await queue.drain();
```

---

## Best Practices

1. **Always handle AbortError:**

```tsx
try {
  await promise;
} catch (error) {
  if (error.name === 'AbortError') {
    // Expected cancellation, don't report as error
    return;
  }
  throw error;
}
```

1. **Use cleanup in React:**

```tsx
useEffect(() => {
  const { abort } = createAbortable(...);
  return abort;
}, []);
```

1. **Combine utilities:**

```tsx
const result = await retryWithBackoff(() => withTimeout(apiCall(), 5000), { maxAttempts: 3 });
```

1. **Structured error handling:**

```tsx
const result = await retryWithBackoff(fn);
if (!result.success) {
  logError(result.error, {
    attempts: result.attempts,
    duration: result.totalTime,
  });
}
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Browser Utilities](../browser/README.md)
- [React Component Library](../../README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
