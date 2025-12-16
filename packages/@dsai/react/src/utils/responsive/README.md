# Responsive Utilities

Runtime utilities for working with responsive values and breakpoints.

## Overview

This module provides utilities for:

- Extracting values from responsive objects
- Runtime breakpoint value resolution

## Installation

```tsx
import { getResponsiveValue } from '@dsai/react';
```

---

## Functions

### `getResponsiveValue`

Extract value for specific breakpoint from responsive object.

**Signature:**

```tsx
function getResponsiveValue<T>(value: ResponsiveValue<T>, breakpoint?: Breakpoint): T | undefined;

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
```

**Examples:**

```tsx
// Single value (non-responsive)
const columns = getResponsiveValue(3, 'lg');
// 3

// Responsive object
const responsiveColumns = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};

getResponsiveValue(responsiveColumns, 'xs'); // 1
getResponsiveValue(responsiveColumns, 'md'); // 3
getResponsiveValue(responsiveColumns, 'xl'); // undefined

// With fallback logic
function getColumns(breakpoint: Breakpoint) {
  const value = getResponsiveValue(responsiveColumns, breakpoint);
  return value ?? getResponsiveValue(responsiveColumns, 'xs') ?? 1;
}
```

---

## Common Patterns

### Responsive Component

```tsx
interface GridProps {
  columns: ResponsiveValue<number>;
}

function Grid({ columns }: GridProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 576) setBreakpoint('xs');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 992) setBreakpoint('md');
      else if (width < 1200) setBreakpoint('lg');
      else if (width < 1400) setBreakpoint('xl');
      else setBreakpoint('xxl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const columnCount = getResponsiveValue(columns, breakpoint) ?? 1;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`
      }}
    >
      {/* content */}
    </div>
  );
}

// Usage
<Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} />
<Grid columns={3} />
```

### Responsive Spacing

```tsx
interface BoxProps {
  padding: ResponsiveValue<number>;
}

function Box({ padding }: BoxProps) {
  const currentBreakpoint = useBreakpoint();
  const paddingValue = getResponsiveValue(padding, currentBreakpoint);

  return <div style={{ padding: `${paddingValue ?? 16}px` }}>{/* content */}</div>;
}

// Usage
<Box padding={{ xs: 8, md: 16, lg: 24 }} />;
```

---

## Hook Example

```tsx
function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const newBreakpoint =
        width < 576
          ? 'xs'
          : width < 768
            ? 'sm'
            : width < 992
              ? 'md'
              : width < 1200
                ? 'lg'
                : width < 1400
                  ? 'xl'
                  : 'xxl';
      setBreakpoint(newBreakpoint);
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

function useResponsiveValue<T>(value: ResponsiveValue<T>): T | undefined {
  const breakpoint = useBreakpoint();
  return getResponsiveValue(value, breakpoint);
}
```

---

## Best Practices

1. **Provide fallback values:**

```tsx
const value = getResponsiveValue(responsive, bp) ?? defaultValue;
```

2. **Use with media queries for SSR:**

```tsx
// Server renders mobile-first
const columns = getResponsiveValue(config, 'xs');
```

3. **Debounce resize handlers:**

```tsx
const debouncedUpdate = debounce(updateBreakpoint, 150);
window.addEventListener('resize', debouncedUpdate);
```

---

## Related Documentation

- [Main Utils README](../README.md)
- [Platform Utilities](../platform/README.md)
- [Layout Utilities](../layout/README.md)

---

## License

Copyright © 2024 DSAi. All rights reserved.
