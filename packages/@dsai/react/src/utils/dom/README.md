# DOM Utilities

Enterprise-grade DOM manipulation utilities with React integration and type safety.

## Overview

This module provides utilities for:

- React ref composition and merging
- Type-safe DOM manipulation
- React ref forwarding patterns

## Installation

```tsx
import { mergeRefs } from '@dsai/react';
```

---

## Functions

### `mergeRefs`

Safely compose multiple React refs into a single callback ref. Supports both function refs and mutable object refs, with automatic null/undefined handling.

**Signature:**

```tsx
function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T>;

// OR array signature
function mergeRefs<T>(refs: Array<Ref<T> | undefined>): RefCallback<T>;
```

**Type Definitions:**

```tsx
type Ref<T> = RefCallback<T> | RefObject<T> | null | undefined;
type RefCallback<T> = (instance: T | null) => void;
type RefObject<T> = { readonly current: T | null };
```

**Examples:**

**Basic Usage (Variadic):**

```tsx
import { mergeRefs } from '@dsai/react';
import { forwardRef, useRef } from 'react';

const Component = forwardRef<HTMLDivElement>((props, ref) => {
  const localRef = useRef<HTMLDivElement>(null);

  return <div ref={mergeRefs(ref, localRef)} />;
});
```

**Array Signature:**

```tsx
const refs = [ref1, ref2, ref3];
const mergedRef = mergeRefs(refs);

<div ref={mergedRef} />;
```

**Multiple Refs:**

```tsx
function Component() {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  return <input ref={mergeRefs(ref1, ref2, ref3)} />;
}
```

**Function Refs:**

```tsx
function Component() {
  const callbackRef1 = (node: HTMLElement | null) => {
    console.log('Ref 1:', node);
  };

  const callbackRef2 = (node: HTMLElement | null) => {
    console.log('Ref 2:', node);
  };

  return <div ref={mergeRefs(callbackRef1, callbackRef2)} />;
}
```

**Mixed Ref Types:**

```tsx
function Component() {
  const objectRef = useRef<HTMLElement>(null);
  const callbackRef = (node: HTMLElement | null) => {
    console.log('Element:', node);
  };

  return <div ref={mergeRefs(objectRef, callbackRef)} />;
}
```

**Forwarding with Local Ref:**

```tsx
const Input = forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
  const localRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Use local ref for imperative operations
    if (localRef.current) {
      localRef.current.focus();
    }
  }, []);

  return <input ref={mergeRefs(forwardedRef, localRef)} {...props} />;
});
```

**Conditional Refs:**

```tsx
function Component({ enableTracking }: Props) {
  const trackingRef = useRef<HTMLElement>(null);
  const observerRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      // Set up IntersectionObserver
    }
  }, []);

  return <div ref={mergeRefs(enableTracking ? trackingRef : null, observerRef)} />;
}
```

**Null/Undefined Handling:**

```tsx
// All null/undefined refs are safely ignored
<div ref={mergeRefs(null, undefined, ref1, null, ref2)} />
// Only ref1 and ref2 are called
```

**Common Patterns:**

**1. Focus Management:**

```tsx
const FocusableInput = forwardRef<HTMLInputElement>((props, ref) => {
  const focusRef = useRef<HTMLInputElement>(null);

  const focus = () => {
    focusRef.current?.focus();
  };

  // Expose focus method via ref
  useImperativeHandle(ref, () => ({
    focus,
  }));

  return <input ref={focusRef} {...props} />;
});
```

**2. Dimension Tracking:**

```tsx
function TrackedComponent({ onResize }: Props) {
  const localRef = useRef<HTMLDivElement>(null);

  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new ResizeObserver((entries) => {
        onResize(entries[0].contentRect);
      });

      observer.observe(node);
      return () => observer.disconnect();
    },
    [onResize]
  );

  return <div ref={mergeRefs(localRef, observerRef)} />;
}
```

**3. Scroll Restoration:**

```tsx
const ScrollRestorable = forwardRef<HTMLDivElement>((props, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('scrollPos');
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
    }

    return () => {
      if (scrollRef.current) {
        sessionStorage.setItem('scrollPos', String(scrollRef.current.scrollTop));
      }
    };
  }, []);

  return <div ref={mergeRefs(ref, scrollRef)} {...props} />;
});
```

**4. Animation Ref:**

```tsx
function AnimatedComponent({ animate }: Props) {
  const animationRef = useRef<HTMLElement>(null);

  const gsapRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  return <div ref={mergeRefs(animationRef, gsapRef)}>Content</div>;
}
```

**5. Third-Party Library Integration:**

```tsx
function ChartComponent({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart>();

  const initChartRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      chartInstanceRef.current = new Chart(canvas, {
        type: 'bar',
        data: data,
      });

      return () => {
        chartInstanceRef.current?.destroy();
      };
    },
    [data]
  );

  return <canvas ref={mergeRefs(chartRef, initChartRef)} />;
}
```

**6. Portal Ref Forwarding:**

```tsx
const Portal = forwardRef<HTMLElement, PortalProps>(({ children }, ref) => {
  const portalRef = useRef<HTMLElement>(null);

  return createPortal(<div ref={mergeRefs(ref, portalRef)}>{children}</div>, document.body);
});
```

**Best Practices:**

**1. Always Handle Cleanup:**

```tsx
const observerRef = useCallback((node: HTMLElement | null) => {
  if (!node) return;

  const observer = new IntersectionObserver(handleIntersect);
  observer.observe(node);

  // Return cleanup function
  return () => observer.disconnect();
}, []);
```

**2. Type Safety:**

```tsx
// Specify element type explicitly
const mergedRef = mergeRefs<HTMLInputElement>(ref1, ref2);

// Or let TypeScript infer from usage
<input ref={mergeRefs(ref1, ref2)} />;
```

**3. Avoid Inline Creation:**

```tsx
// Bad: Creates new function on every render
<div ref={mergeRefs(ref1, useRef(null))} />;

// Good: Stable refs
const localRef = useRef(null);
<div ref={mergeRefs(ref1, localRef)} />;
```

**4. Conditional Refs:**

```tsx
// Use null for conditional refs
<div ref={mergeRefs(condition ? ref1 : null, ref2)} />
```

**5. Array Syntax for Dynamic Refs:**

```tsx
function Component({ refs }: { refs: Ref<HTMLElement>[] }) {
  return <div ref={mergeRefs(refs)} />;
}
```

---

## Error Handling

**Development Warnings:**

In development mode, `mergeRefs` logs warnings when ref assignment fails:

```tsx
// If ref assignment throws
console.warn('[mergeRefs] Failed to assign ref:', error);
```

**Production Behavior:**

In production, errors are silently caught to prevent crashes. Failed ref assignments are skipped without warning.

**Common Errors:**

1. **Read-only ref object:**

```tsx
const readOnlyRef = { current: null } as const;
mergeRefs(readOnlyRef); // Warning in dev, silent in prod
```

2. **Function ref throws:**

```tsx
const throwingRef = () => {
  throw new Error('Ref error');
};
mergeRefs(throwingRef); // Warning in dev, silent in prod
```

---

## Type Definitions

```tsx
// Full type signature
function mergeRefs<T>(
  ...refs: (Ref<T> | undefined)[] | [Array<Ref<T> | undefined>]
): RefCallback<T>;

// Ref type (from React)
type Ref<T> = RefCallback<T> | RefObject<T> | null | undefined;

// Callback ref
type RefCallback<T> = (instance: T | null) => void;

// Object ref
interface RefObject<T> {
  readonly current: T | null;
}

// Mutable ref (from useRef)
interface MutableRefObject<T> {
  current: T;
}
```

---

## Performance Notes

**Memoization:**

`mergeRefs` returns a new function on every call. For optimal performance in components that re-render frequently:

```tsx
// Option 1: useMemo (not usually necessary)
const mergedRef = useMemo(() => mergeRefs(ref1, ref2), [ref1, ref2]);

// Option 2: useCallback (for callback refs)
const mergedRef = useCallback(
  (node) => {
    ref1(node);
    ref2(node);
  },
  [ref1, ref2]
);

// In most cases, mergeRefs is fast enough without memoization
<div ref={mergeRefs(ref1, ref2)} />;
```

**Overhead:**

- Function creation: ~0.01ms
- Ref assignment: ~0.001ms per ref
- Total: Negligible for typical use cases

---

## React 19+ Ref Cleanup

In React 19+, ref callbacks can return cleanup functions:

```tsx
const cleanupRef = (node: HTMLElement | null) => {
  if (!node) return;

  // Setup
  const observer = new ResizeObserver(handleResize);
  observer.observe(node);

  // Cleanup (React 19+)
  return () => {
    observer.disconnect();
  };
};

<div ref={mergeRefs(cleanupRef, otherRef)} />;
```

**Note:** `mergeRefs` supports cleanup returns in React 19+ but does not propagate them. For complex cleanup logic, manage it separately.

---

## Related Documentation

- [Main Utils README](../README.md)
- [React Component Library](../../README.md)
- [React forwardRef Documentation](https://react.dev/reference/react/forwardRef)
- [React useRef Documentation](https://react.dev/reference/react/useRef)

---

## License

Copyright © 2026 DSAi. All rights reserved.
