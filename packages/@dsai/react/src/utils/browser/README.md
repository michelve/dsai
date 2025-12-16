# Browser Utilities

Environment detection utilities for SSR-safe browser and accessibility feature checks.

## Overview

This module provides utilities for:

- Detecting browser environment (client vs server)
- Checking user motion preferences (accessibility)

## Installation

```tsx
import { isBrowser, prefersReducedMotion } from '@dsai/react';
```

---

## Functions

### `isBrowser`

Detect if code is running in browser environment.

**Signature:**

```tsx
function isBrowser(): boolean;
```

**Examples:**

```tsx
// Check environment before accessing window
if (isBrowser()) {
  window.addEventListener('resize', handler);
}

// SSR-safe localStorage access
const getStoredValue = (key: string) => {
  if (!isBrowser()) return null;
  return localStorage.getItem(key);
};

// Conditional rendering
function MyComponent() {
  const canUseDOM = isBrowser();

  return <div>{canUseDOM && <ClientOnlyFeature />}</div>;
}
```

---

### `prefersReducedMotion`

Check if user prefers reduced motion (accessibility).

**Signature:**

```tsx
function prefersReducedMotion(): boolean;
```

**Examples:**

```tsx
// Respect user preferences
const shouldAnimate = !prefersReducedMotion();

if (shouldAnimate) {
  element.animate(...);
}

// In React component
function AnimatedCard() {
  const reducedMotion = prefersReducedMotion();

  return (
    <motion.div
      animate={reducedMotion ? {} : { scale: 1.1 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}

// CSS-in-JS
const getTransition = () => {
  if (prefersReducedMotion()) {
    return 'none';
  }
  return 'all 0.3s ease';
};
```

---

## Best Practices

1. **Always check isBrowser() before accessing browser APIs:**

```tsx
if (isBrowser()) {
  const width = window.innerWidth;
}
```

2. **Respect prefersReducedMotion for accessibility:**

```tsx
const duration = prefersReducedMotion() ? 0 : 300;
```

3. **Use in useEffect for SSR safety:**

```tsx
useEffect(() => {
  if (isBrowser()) {
    // Safe to use browser APIs
  }
}, []);
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Platform Utilities](../platform/README.md)
- [Motion Utilities](../motion/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
