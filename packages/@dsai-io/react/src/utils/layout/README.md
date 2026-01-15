# Layout Utilities

Enterprise-grade layout and measurement utilities for viewport, bounds, and animation frame management.

## Overview

This module provides utilities for:

- Element bounds and viewport measurements
- ResizeObserver wrapper
- RequestAnimationFrame scheduling
- Frame throttling

## Installation

```tsx
import {
  getElementBounds,
  isInViewport,
  getViewportSize,
  observeResize,
  scheduleFrame,
  throttleFrame,
} from '@dsai-io/react';
```

---

## Element Measurements

### `getElementBounds`

Get element bounding box with viewport context.

**Signature:**

```tsx
function getElementBounds(element: Element, options?: GetElementBoundsOptions): ElementBounds;
```

**Examples:**

```tsx
const bounds = getElementBounds(element);
// { top, left, width, height, right, bottom }

const isVisible = isInViewport(element);
const doIntersect = boundsIntersect(bounds1, bounds2);
```

---

### `getViewportSize`

Get viewport dimensions.

**Signature:**

```tsx
function getViewportSize(options?: GetViewportSizeOptions): ViewportSize;

interface ViewportSize {
  width: number;
  height: number;
  aspectRatio: number;
}
```

**Examples:**

```tsx
const viewport = getViewportSize();
const docSize = getDocumentSize();
const scrollProgress = getScrollProgress(); // 0-1
```

---

## ResizeObserver

### `observeResize`

Observe element size changes.

**Signature:**

```tsx
function observeResize(
  element: Element,
  callback: ResizeCallback,
  options?: ObserveResizeOptions
): ResizeCleanup;
```

**Examples:**

```tsx
// Basic usage
const cleanup = observeResize(element, (entry) => {
  console.log('Size:', entry.contentRect);
});

// In React
useEffect(() => {
  if (!ref.current) return;

  return observeResize(ref.current, ({ contentRect }) => {
    setSize({
      width: contentRect.width,
      height: contentRect.height,
    });
  });
}, []);

// Multiple elements
const cleanup = observeResizeMany([element1, element2], (entries) => {
  entries.forEach((entry) => {
    console.log('Resized:', entry.target);
  });
});
```

---

## Animation Frame

### `scheduleFrame`

Schedule callback for next animation frame.

**Signature:**

```tsx
function scheduleFrame(callback: FrameCallback): FrameCleanup;

function scheduleFrameAfter(callback: FrameCallback, delay: number): FrameCleanup;
```

**Examples:**

```tsx
// Single frame
const cancel = scheduleFrame((info) => {
  element.style.transform = `translateX(${info.timestamp}px)`;
});

// Delayed frame
const cancel = scheduleFrameAfter(() => {
  // Run after 2 frames
}, 2);

// Animation loop
const stopLoop = startLoop((info) => {
  if (info.frame > 100) {
    return false; // Stop loop
  }

  updateAnimation(info.timestamp);
  return true; // Continue
});
```

---

### `throttleFrame`

Throttle function to animation frame rate.

**Signature:**

```tsx
function throttleFrame<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options?: ThrottleFrameOptions
): ThrottledFrameFunction<T>;
```

**Examples:**

```tsx
// Throttle scroll handler
const handleScroll = throttleFrame(() => {
  const scrollY = window.scrollY;
  updateParallax(scrollY);
});

window.addEventListener('scroll', handleScroll);

// Cleanup
handleScroll.cancel();
```

---

## Common Patterns

### Responsive Component

```tsx
function ResponsiveComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    return observeResize(ref.current, ({ contentRect }) => {
      setSize({
        width: contentRect.width,
        height: contentRect.height,
      });
    });
  }, []);

  return (
    <div ref={ref}>
      Size: {size.width} x {size.height}
    </div>
  );
}
```

### Scroll Progress Indicator

```tsx
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttleFrame(() => {
      setProgress(getScrollProgress());
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div className="progress-bar" style={{ width: `${progress * 100}%` }} />;
}
```

### Lazy Load on Viewport

```tsx
function LazyImage({ src, alt }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const checkVisibility = throttleFrame(() => {
      if (ref.current && isInViewport(ref.current)) {
        setShouldLoad(true);
      }
    });

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check initial

    return () => {
      checkVisibility.cancel();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return <img ref={ref} src={shouldLoad ? src : placeholder} alt={alt} />;
}
```

---

## Best Practices

1. **Always cleanup observers:**

```tsx
useEffect(() => {
  const cleanup = observeResize(element, callback);
  return cleanup;
}, []);
```

1. **Throttle expensive operations:**

```tsx
const handler = throttleFrame(expensiveCalculation);
```

1. **Check for element existence:**

```tsx
if (ref.current && isInViewport(ref.current)) {
  // ...
}
```

---

## Performance Notes

- ResizeObserver is more efficient than polling
- throttleFrame prevents layout thrashing
- scheduleFrame uses requestAnimationFrame for optimal timing

---

## Related Documentation

- [Main Utils README](../README.md)
- [Motion Utilities](../motion/README.md)
- [Timing Utilities](../timing/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
