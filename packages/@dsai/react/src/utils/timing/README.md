# Timing Utilities

Debouncing and throttling utilities for rate-limiting function execution.

## Overview

This module provides utilities for:

- Debouncing (delay execution until idle)
- Throttling (limit execution rate)

## Installation

```tsx
import { debounce, throttle } from '@dsai/react';
```

---

## Functions

### `debounce`

Delay function execution until after wait period of inactivity.

**Signature:**

```tsx
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<T>;

interface DebouncedFunction<T> extends Function {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
  pending(): boolean;
}

interface DebounceOptions {
  leading?: boolean; // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge
  maxWait?: number; // Maximum time fn can be delayed
}
```

**Examples:**

```tsx
// Basic debounce (300ms delay)
const debouncedSearch = debounce((query: string) => {
  searchAPI(query);
}, 300);

// User types: 'hel'
// ... waits 300ms ...
// Calls searchAPI('hello')

// Leading edge (execute immediately, then wait)
const debouncedClick = debounce(handleClick, 1000, {
  leading: true,
  trailing: false,
});

// Max wait (ensure execution within timeframe)
const debouncedSave = debounce(saveData, 1000, {
  maxWait: 5000, // Execute at least every 5 seconds
});

// Cancel pending execution
debouncedSearch.cancel();

// Execute immediately
debouncedSearch.flush();

// Check if pending
if (debouncedSearch.pending()) {
  console.log('Execution scheduled');
}
```

---

### `throttle`

Limit function execution to once per time period.

**Signature:**

```tsx
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options?: ThrottleOptions
): ThrottledFunction<T>;

interface ThrottledFunction<T> extends Function {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

interface ThrottleOptions {
  leading?: boolean; // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge
}
```

**Examples:**

```tsx
// Basic throttle (max once per 100ms)
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

window.addEventListener('scroll', throttledScroll);

// Leading + trailing (default)
const throttledResize = throttle(handleResize, 200, {
  leading: true, // Immediate first call
  trailing: true, // Call after period ends
});

// Leading only (immediate, no trailing call)
const throttledClick = throttle(handleClick, 1000, {
  leading: true,
  trailing: false,
});

// Trailing only (delay all calls)
const throttledUpdate = throttle(update, 500, {
  leading: false,
  trailing: true,
});

// Cancel pending execution
throttledScroll.cancel();

// Execute immediately
throttledScroll.flush();
```

---

## Comparison

| Feature       | Debounce             | Throttle             |
| ------------- | -------------------- | -------------------- |
| **Use case**  | Wait for idle period | Limit execution rate |
| **Execution** | After inactivity     | At regular intervals |
| **Example**   | Search input         | Scroll handler       |
| **Timing**    | Resets on each call  | Fixed intervals      |

---

## Common Patterns

### Search Input

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        searchAPI(q);
      }, 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input type="search" value={query} onChange={handleChange} />;
}
```

### Scroll Handler

```tsx
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrolled / height);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div className="progress-bar" style={{ width: `${progress * 100}%` }} />;
}
```

### Auto-save

```tsx
function AutoSaveEditor() {
  const [content, setContent] = useState('');

  const debouncedSave = useMemo(
    () =>
      debounce(
        (value: string) => {
          saveToAPI(value);
        },
        1000,
        { maxWait: 5000 } // Save at least every 5s
      ),
    []
  );

  const handleChange = (value: string) => {
    setContent(value);
    debouncedSave(value);
  };

  return <textarea value={content} onChange={(e) => handleChange(e.target.value)} />;
}
```

### Window Resize

```tsx
function ResponsiveLayout() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = throttle(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);

    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      Size: {size.width} x {size.height}
    </div>
  );
}
```

---

## Best Practices

1. **Debounce for user input:**

```tsx
const debouncedSearch = debounce(search, 300);
```

2. **Throttle for events that fire rapidly:**

```tsx
const throttledScroll = throttle(updateUI, 100);
```

3. **Always cleanup in React:**

```tsx
useEffect(() => {
  const handler = throttle(fn, 100);
  window.addEventListener('event', handler);
  return () => {
    handler.cancel();
    window.removeEventListener('event', handler);
  };
}, []);
```

4. **Use maxWait for important operations:**

```tsx
debounce(save, 1000, { maxWait: 5000 });
```

5. **Memoize debounced/throttled functions:**

```tsx
const handler = useMemo(() => debounce(fn, 300), []);
```

---

## Performance Notes

- Debounce/throttle prevent excessive function calls
- Reduces unnecessary renders and API calls
- Improves scroll/resize performance
- Use leading edge for immediate feedback

---

## Related Documentation

- [Main Utils README](../README.md)
- [Layout Utilities](../layout/README.md)
- [Telemetry Utilities](../telemetry/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
