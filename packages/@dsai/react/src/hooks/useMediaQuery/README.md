# useMediaQuery Hook

Reactive hooks for tracking CSS media queries in React components.

## Overview

The `useMediaQuery` hook provides a simple, type-safe way to respond to viewport changes and media features in your React components. Built on React's `useSyncExternalStore`, it offers excellent performance and SSR compatibility.

## Features

- ✅ **Reactive Updates** - Automatically updates when media query match status changes
- ✅ **SSR-Safe** - Handles server-side rendering gracefully with configurable defaults
- ✅ **TypeScript** - Full type safety with TypeScript support
- ✅ **Any Media Query** - Works with any valid CSS media query string
- ✅ **Breakpoint Helpers** - Includes pre-configured breakpoint constants
- ✅ **Convenience Hooks** - Named hooks for common breakpoints (`useIsMobile`, `useIsTablet`, etc.)
- ✅ **Zero Dependencies** - Uses only React's built-in hooks
- ✅ **Lightweight** - Minimal bundle size impact

## Installation

The hook is included in `@dsai/react`. Import it directly:

```tsx
import { useMediaQuery } from '@dsai/react';
```

## Basic Usage

### Simple Media Query

```tsx
import { useMediaQuery } from '@dsai/react';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 767.98px)');

  return <div>{isMobile ? <MobileLayout /> : <DesktopLayout />}</div>;
}
```

### Using Breakpoint Helpers

```tsx
import { useMediaQuery, breakpointUp } from '@dsai/react';

function Grid() {
  const isDesktop = useMediaQuery(breakpointUp('lg'));
  const columns = isDesktop ? 4 : 2;

  return <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }} />;
}
```

### Convenience Hooks

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@dsai/react';

function Header() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  if (isMobile) return <MobileHeader />;
  if (isTablet) return <TabletHeader />;
  return <DesktopHeader />;
}
```

## API Reference

### `useMediaQuery(query, options?)`

Main hook for tracking media query matches.

#### Parameters

- **query** `string` - Any valid CSS media query string
- **options** `UseMediaQueryOptions` (optional)
  - **defaultValue** `boolean` - Value to return during SSR (default: `false`)

#### Returns

`boolean` - `true` if the media query matches, `false` otherwise

#### Example

```tsx
const preferssDark = useMediaQuery('(prefers-color-scheme: dark)');
const isPortrait = useMediaQuery('(orientation: portrait)');
const canHover = useMediaQuery('(hover: hover)');
```

### Convenience Hooks

#### `useIsMobile(options?)`

Returns `true` when viewport is **less than 768px** (mobile devices).

```tsx
const isMobile = useIsMobile();
```

#### `useIsTablet(options?)`

Returns `true` when viewport is **768px or larger** (tablets and up).

```tsx
const isTablet = useIsTablet();
```

#### `useIsDesktop(options?)`

Returns `true` when viewport is **992px or larger** (desktop and up).

```tsx
const isDesktop = useIsDesktop();
```

#### `useIsLargeDesktop(options?)`

Returns `true` when viewport is **1200px or larger** (large desktops).

```tsx
const isLargeDesktop = useIsLargeDesktop();
```

### Breakpoint Constants

```tsx
import { BREAKPOINTS, breakpointUp, breakpointDown, breakpointBetween } from '@dsai/react';

// Breakpoint values (px)
BREAKPOINTS.xs; // 0
BREAKPOINTS.sm; // 576
BREAKPOINTS.md; // 768
BREAKPOINTS.lg; // 992
BREAKPOINTS.xl; // 1200
BREAKPOINTS.xxl; // 1400

// Helper functions
breakpointUp('lg'); // "(min-width: 992px)"
breakpointDown('md'); // "(max-width: 767.98px)"
breakpointBetween('sm', 'lg'); // "(min-width: 576px) and (max-width: 991.98px)"
```

## Common Patterns

### Responsive Component Variants

```tsx
function Card() {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? 'card--mobile' : 'card--desktop'}>
      <CardContent compact={isMobile} />
    </div>
  );
}
```

### Conditional Rendering

```tsx
function Sidebar() {
  const isDesktop = useIsDesktop();

  // Don't render sidebar on mobile
  if (!isDesktop) return null;

  return <aside>...</aside>;
}
```

### Dynamic Styles

```tsx
function Gallery() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const columns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isMobile ? '1rem' : '2rem',
      }}
    >
      {images.map((img) => (
        <Image key={img.id} src={img.src} />
      ))}
    </div>
  );
}
```

### Media Feature Detection

```tsx
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <ThemeContext.Provider
      value={{
        theme: prefersDark ? 'dark' : 'light',
        reducedMotion: prefersReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

### Combined Media Queries

```tsx
function VideoPlayer() {
  // Only autoplay on desktop with reduced motion off
  const shouldAutoplay = useMediaQuery(
    '(min-width: 992px) and (prefers-reduced-motion: no-preference)'
  );

  return <video autoPlay={shouldAutoplay} />;
}
```

## SSR Considerations

### Default Values

During server-side rendering, the hook returns the `defaultValue` option (default: `false`):

```tsx
function Component() {
  // Returns false during SSR, then updates to actual value on client
  const isMobile = useMediaQuery('(max-width: 767.98px)');

  // Custom SSR default
  const prefersDark = useMediaQuery(
    '(prefers-color-scheme: dark)',
    { defaultValue: true } // Assume dark mode during SSR
  );

  return <div />;
}
```

### Hydration

The hook is designed to avoid hydration mismatches:

1. **Server render**: Returns `defaultValue`
2. **Client hydration**: Initially returns `defaultValue`
3. **After mount**: Updates to actual media query match value

This prevents React hydration errors while ensuring the UI updates quickly after mount.

### Next.js Example

```tsx
// app/components/ResponsiveNav.tsx
'use client';

import { useIsMobile } from '@dsai/react';

export function ResponsiveNav() {
  const isMobile = useIsMobile();

  return <nav>{isMobile ? <MobileMenu /> : <DesktopMenu />}</nav>;
}
```

## Best Practices

### Use Convenience Hooks When Possible

```tsx
// ✅ Good - Clear and maintainable
const isMobile = useIsMobile();

// ❌ Avoid - Magic numbers
const isMobile = useMediaQuery('(max-width: 767.98px)');
```

### Combine with CSS Media Queries

Use CSS for visual styling, JavaScript for behavior:

```tsx
// CSS handles visual changes
.card {
  padding: 2rem;
}

@media (max-width: 767.98px) {
  .card {
    padding: 1rem;
  }
}

// JS handles behavioral changes
function Card() {
  const isMobile = useIsMobile();

  return (
    <div className="card">
      {isMobile ? (
        <MobileTouchGestures />
      ) : (
        <DesktopHoverInteractions />
      )}
    </div>
  );
}
```

### Avoid Overuse

```tsx
// ❌ Bad - Excessive JS-based responsiveness
function Component() {
  const isMobile = useIsMobile();

  return (
    <div>
      <h1 style={{ fontSize: isMobile ? '24px' : '32px' }}>Title</h1>
      <p style={{ fontSize: isMobile ? '14px' : '16px' }}>Text</p>
      <button style={{ padding: isMobile ? '8px' : '12px' }}>Click</button>
    </div>
  );
}

// ✅ Good - Use CSS for styling
function Component() {
  return (
    <div className="component">
      <h1 className="title">Title</h1>
      <p className="text">Text</p>
      <button className="button">Click</button>
    </div>
  );
}

// component.css
.title { font-size: 32px; }
.text { font-size: 16px; }
.button { padding: 12px; }

@media (max-width: 767.98px) {
  .title { font-size: 24px; }
  .text { font-size: 14px; }
  .button { padding: 8px; }
}
```

## Performance

### Efficient Updates

The hook uses `useSyncExternalStore`, which:

- ✅ Batches updates automatically
- ✅ Prevents unnecessary re-renders
- ✅ Synchronizes with React's rendering cycle
- ✅ Works correctly with Concurrent Mode

### Shared Listeners

Multiple hook instances with the same query share the same `MediaQueryList` listener, reducing memory usage.

## TypeScript

### Type Definitions

```tsx
interface UseMediaQueryOptions {
  defaultValue?: boolean;
}

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const BREAKPOINTS: Record<Breakpoint, number>;
```

### Usage

```tsx
import type { Breakpoint } from '@dsai/react';

function getBreakpointQuery(bp: Breakpoint): string {
  return breakpointUp(bp);
}
```

## Browser Support

Works in all modern browsers that support:

- `window.matchMedia()` (IE 10+)
- `MediaQueryList.addEventListener()` (All modern browsers)

## Migration Guide

### From `useEffect` + `matchMedia`

Before:

```tsx
function Component() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767.98px)');
    setIsMobile(mql.matches);

    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

After:

```tsx
function Component() {
  const isMobile = useIsMobile();

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

## Related Hooks

- [`useReducedMotion`](../useReducedMotion/README.md) - Detect reduced motion preference
- [`useScrollLock`](../useScrollLock/README.md) - Lock scroll on mobile overlays
- [`useFocusTrap`](../useFocusTrap/README.md) - Trap focus in modals

## Contributing

Found a bug or have a suggestion? Please open an issue or submit a pull request.

## License

Copyright © 2024 DSAi. All rights reserved.
