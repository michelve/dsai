# Create useReducedMotion Hook

**Task ID:** TASK-065
**Title:** Create useReducedMotion Hook
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 2 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Create a new `useReducedMotion` hook in `packages/@dsai/react/src/hooks/useReducedMotion/` that detects the user's `prefers-reduced-motion` system preference, enabling components to respect accessibility needs for motion sensitivity.

### Problem/Issue

Currently, DSAi components with animations (Carousel, Modal transitions, Collapse, Accordion) do not respect the user's motion preferences. Users with vestibular disorders or motion sensitivity may experience discomfort from animations.

**WCAG 2.1 Success Criterion 2.3.3 (AAA):** Motion from interactions can be disabled.

### Expected Outcome

A standalone `useReducedMotion` hook that:

- Detects `prefers-reduced-motion: reduce` media query
- Updates reactively when user changes system preference
- Can be used by Carousel, Modal, Collapse, Accordion, and animation utilities
- Is SSR-safe with sensible defaults
- Has comprehensive unit tests

---

## 🎯 Acceptance Criteria

- [ ] Hook created at `hooks/useReducedMotion/useReducedMotion.ts`
- [ ] Returns boolean `prefersReducedMotion`
- [ ] Listens to media query changes in real-time
- [ ] SSR-safe (returns `false` during SSR by default)
- [ ] Supports custom default value for SSR
- [ ] Unit tests with 100% coverage
- [ ] Exported from `hooks/index.ts`
- [ ] JSDoc documentation complete
- [ ] Storybook example demonstrating usage

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/useReducedMotion/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useReducedMotion/useReducedMotion.ts` - Main hook
- `packages/@dsai/react/src/hooks/useReducedMotion/useReducedMotion.test.ts` - Unit tests

### Modify

- `packages/@dsai/react/src/hooks/index.ts` - Add useReducedMotion export
- `packages/@dsai/react/src/index.ts` - Export useReducedMotion from main entry

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- Carousel animation improvements
- Modal transition improvements
- Collapse/Accordion animation improvements
- Future animation system

---

## 🧪 Testing Requirements

- [ ] Test returns `false` when `prefers-reduced-motion: no-preference`
- [ ] Test returns `true` when `prefers-reduced-motion: reduce`
- [ ] Test updates when media query changes
- [ ] Test SSR returns default value (false)
- [ ] Test custom SSR default value
- [ ] Test cleanup removes event listener on unmount
- [ ] Test multiple hook instances share same media query listener

---

## 📖 Documentation Requirements

- [ ] JSDoc for hook with usage examples
- [ ] README.md in useReducedMotion/ directory
- [ ] Add to hooks section in Storybook docs
- [ ] Example showing conditional animation

---

## 🔄 Implementation Steps

1. [ ] Create directory structure `hooks/useReducedMotion/`
2. [ ] Implement hook in `useReducedMotion.ts`:

````typescript
import { useState, useEffect } from 'react';
import { isBrowser } from '../../utils/isBrowser';

export interface UseReducedMotionOptions {
  /** Default value to return during SSR. Default: false */
  defaultValue?: boolean;
}

/**
 * Detects if the user prefers reduced motion based on their system settings.
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion();
 *
 *   return (
 *     <div
 *       style={{
 *         transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease',
 *       }}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns `true` if the user prefers reduced motion, `false` otherwise
 */
export function useReducedMotion(options: UseReducedMotionOptions = {}): boolean {
  const { defaultValue = false } = options;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (!isBrowser()) {
      return defaultValue;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!isBrowser()) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    // Sync initial value (in case it changed between render and effect)
    setPrefersReducedMotion(mediaQuery.matches);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
````

3. [ ] Write comprehensive unit tests in `useReducedMotion.test.ts`

4. [ ] Create barrel export in `useReducedMotion/index.ts`

5. [ ] Export from `hooks/index.ts`

6. [ ] Export from main `index.ts`

7. [ ] Create Storybook example

8. [ ] Run Codacy analysis

---

## 📝 Notes

### Usage Examples

**Carousel with reduced motion:**

```tsx
function Carousel({ autoPlay, ...props }) {
  const prefersReducedMotion = useReducedMotion();

  // Disable auto-play for users who prefer reduced motion
  const effectiveAutoPlay = prefersReducedMotion ? false : autoPlay;

  return <CarouselInner autoPlay={effectiveAutoPlay} {...props} />;
}
```

**Modal with conditional transition:**

```tsx
function Modal({ isOpen, ...props }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('modal', prefersReducedMotion ? 'modal--no-animation' : 'modal--animated')}>
      {/* content */}
    </div>
  );
}
```

### Quality Benchmarks

Reference implementations:

- [Framer Motion useReducedMotion](https://www.framer.com/motion/use-reduced-motion/)
- [Radix useReducedMotion](https://www.radix-ui.com/primitives/utilities/use-reduced-motion)
- [Mantine useReducedMotion](https://mantine.dev/hooks/use-reduced-motion/)

### Future Enhancements

1. **Global Provider:** Allow setting preference at app level
2. **Override mechanism:** Allow components to force animations for critical feedback
3. **Preference persistence:** Remember user's in-app preference

---

## ✅ Definition of Done

- [ ] Hook implemented
- [ ] 100% test coverage
- [ ] TypeScript types complete
- [ ] JSDoc documentation complete
- [ ] Storybook example created
- [ ] Exported from main index.ts
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
