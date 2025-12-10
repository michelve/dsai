# Create useMediaQuery Hook

**Task ID:** TASK-067
**Title:** Create useMediaQuery Hook
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 3 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Create a new `useMediaQuery` hook in `packages/@dsai/react/src/hooks/useMediaQuery/` that reactively tracks CSS media query matches, enabling responsive component behavior in JavaScript.

### Problem/Issue

Currently, responsive behavior is primarily handled via CSS classes and media queries. However, some components need JavaScript-level awareness of viewport size or media features:

- **Carousel:** May want different slides-per-view at different breakpoints
- **Modal:** May render as full-screen sheet on mobile
- **Navigation:** May switch between desktop/mobile layouts
- **Grid components:** May need to calculate columns dynamically

Additionally, this hook enables:

- Consistent breakpoint definitions across CSS and JS
- SSR-safe responsive logic with hydration handling
- Foundation for `useReducedMotion` and similar media-based hooks

### Expected Outcome

A standalone `useMediaQuery` hook that:

- Accepts any valid CSS media query string
- Returns boolean indicating current match status
- Updates reactively when viewport/media changes
- Is SSR-safe with configurable default values
- Has comprehensive unit tests

---

## 🎯 Acceptance Criteria

- [ ] Hook created at `hooks/useMediaQuery/useMediaQuery.ts`
- [ ] Accepts any valid media query string
- [ ] Returns boolean match status
- [ ] Updates in real-time on viewport resize
- [ ] SSR-safe with configurable default value
- [ ] Handles hydration mismatch gracefully
- [ ] Unit tests with 100% coverage
- [ ] Exported from `hooks/index.ts`
- [ ] JSDoc documentation complete
- [ ] Convenience hooks for common breakpoints

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/useMediaQuery/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useMediaQuery/useMediaQuery.ts` - Main hook
- `packages/@dsai/react/src/hooks/useMediaQuery/useMediaQuery.test.ts` - Unit tests
- `packages/@dsai/react/src/hooks/useMediaQuery/breakpoints.ts` - Breakpoint constants

### Modify

- `packages/@dsai/react/src/hooks/index.ts` - Add useMediaQuery export
- `packages/@dsai/react/src/index.ts` - Export useMediaQuery from main entry

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- TASK-065: useReducedMotion (can be refactored to use this hook)
- Responsive component variants
- Dynamic layout components

---

## 🧪 Testing Requirements

- [ ] Test returns `true` when media query matches
- [ ] Test returns `false` when media query doesn't match
- [ ] Test updates when viewport changes
- [ ] Test SSR returns default value
- [ ] Test custom SSR default value
- [ ] Test hydration (SSR default → client value)
- [ ] Test cleanup removes event listener on unmount
- [ ] Test invalid media query (graceful error handling)
- [ ] Test multiple hook instances with same query (shared listener)
- [ ] Test breakpoint convenience hooks (useIsMobile, etc.)

---

## 📖 Documentation Requirements

- [ ] JSDoc for hook with usage examples
- [ ] README.md in useMediaQuery/ directory
- [ ] Document all breakpoint constants
- [ ] Add to hooks section in Storybook docs

---

## 🔄 Implementation Steps

1. [ ] Create directory structure `hooks/useMediaQuery/`
2. [ ] Define breakpoint constants in `breakpoints.ts`:

```typescript
/**
 * DSAi breakpoint constants aligned with design tokens.
 * These match the SCSS breakpoint variables.
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Generate a min-width media query for a breakpoint.
 */
export function breakpointUp(breakpoint: Breakpoint): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Generate a max-width media query for a breakpoint.
 * Uses breakpoint - 0.02px to avoid overlap.
 */
export function breakpointDown(breakpoint: Breakpoint): string {
  const value = BREAKPOINTS[breakpoint] - 0.02;
  return `(max-width: ${value}px)`;
}

/**
 * Generate a media query for a range between two breakpoints.
 */
export function breakpointBetween(min: Breakpoint, max: Breakpoint): string {
  return `${breakpointUp(min)} and ${breakpointDown(max)}`;
}
```

3. [ ] Implement hook in `useMediaQuery.ts`:

````typescript
import { useState, useEffect, useMemo } from 'react';
import { isBrowser } from '../../utils/isBrowser';

export interface UseMediaQueryOptions {
  /** Default value to return during SSR. Default: false */
  defaultValue?: boolean;
  /**
   * If true, use the default value on first render to avoid hydration mismatch.
   * Default: true
   */
  initializeWithValue?: boolean;
}

/**
 * Tracks whether a CSS media query matches the current viewport.
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 767.98px)');
 *   const prefersLight = useMediaQuery('(prefers-color-scheme: light)');
 *
 *   return (
 *     <div>
 *       {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param query - CSS media query string
 * @param options - Configuration options
 * @returns `true` if the media query matches, `false` otherwise
 */
export function useMediaQuery(query: string, options: UseMediaQueryOptions = {}): boolean {
  const { defaultValue = false, initializeWithValue = true } = options;

  const getMatches = (query: string): boolean => {
    if (!isBrowser()) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });

  // Memoize the media query list to avoid recreating on every render
  const mediaQueryList = useMemo(() => {
    if (!isBrowser()) return null;
    return window.matchMedia(query);
  }, [query]);

  useEffect(() => {
    if (!mediaQueryList) return;

    // Sync value on mount (handles hydration)
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [mediaQueryList]);

  return matches;
}
````

4. [ ] Add convenience hooks:

```typescript
import { useMediaQuery, UseMediaQueryOptions } from './useMediaQuery';
import { breakpointUp, breakpointDown } from './breakpoints';

/**
 * Returns true if viewport is mobile (< 768px).
 */
export function useIsMobile(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointDown('md'), options);
}

/**
 * Returns true if viewport is tablet or larger (>= 768px).
 */
export function useIsTablet(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('md'), options);
}

/**
 * Returns true if viewport is desktop or larger (>= 992px).
 */
export function useIsDesktop(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('lg'), options);
}

/**
 * Returns true if viewport is large desktop or larger (>= 1200px).
 */
export function useIsLargeDesktop(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery(breakpointUp('xl'), options);
}
```

5. [ ] Write comprehensive unit tests in `useMediaQuery.test.ts`

6. [ ] Create barrel export in `useMediaQuery/index.ts`

7. [ ] Export from `hooks/index.ts`

8. [ ] Export from main `index.ts`

9. [ ] Run Codacy analysis

---

## 📝 Notes

### SSR and Hydration

The hook handles SSR gracefully:

1. **During SSR:** Returns `defaultValue` (false by default)
2. **First client render:** Can optionally use `defaultValue` to avoid hydration mismatch
3. **After hydration:** Updates to actual media query match

For components where layout shift is acceptable, set `initializeWithValue: true` to get the correct value immediately.

### Breakpoint Alignment

The breakpoint constants should align with:

- `packages/@dsai/tokens/src/scss/_breakpoints.scss`
- Bootstrap 5 default breakpoints
- Figma responsive frame sizes

### Usage with useReducedMotion

After this hook is complete, `useReducedMotion` can be refactored to use it:

```typescript
export function useReducedMotion(options?: UseMediaQueryOptions): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', options);
}
```

### Quality Benchmarks

Reference implementations:

- [Mantine useMediaQuery](https://mantine.dev/hooks/use-media-query/)
- [usehooks-ts useMediaQuery](https://usehooks-ts.com/react-hook/use-media-query)
- [React Aria useMediaQuery](https://react-spectrum.adobe.com/react-aria/useMediaQuery.html)

### Performance Considerations

1. **Shared listeners:** Consider implementing a media query cache so multiple hooks with the same query share one listener
2. **Debouncing:** For resize-heavy queries, consider optional debounce
3. **SSR hydration:** The `initializeWithValue` option prevents unnecessary rerenders

---

## ✅ Definition of Done

- [ ] Hook implemented with all options
- [ ] Breakpoint constants defined
- [ ] Convenience hooks created (useIsMobile, etc.)
- [ ] 100% test coverage
- [ ] TypeScript types complete
- [ ] JSDoc documentation complete
- [ ] Exported from main index.ts
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
