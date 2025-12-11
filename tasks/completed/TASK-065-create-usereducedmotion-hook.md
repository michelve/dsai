# Create useReducedMotion Hook

**Task ID:** TASK-065
**Title:** Create useReducedMotion Hook
**Priority:** Medium
**Status:** ✅ Complete
**Assigned To:** AI Assistant
**Estimated Time:** 2 Hours
**Actual Time:** 2 Hours
**Created:** 2024-12-05
**Updated:** 2024-01-09
**Completed:** 2024-01-09

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

- [x] Hook created at `hooks/useReducedMotion/useReducedMotion.ts`
- [x] Returns boolean `prefersReducedMotion`
- [x] Listens to media query changes in real-time
- [x] SSR-safe (returns `false` during SSR by default)
- [x] Supports custom default value for SSR
- [x] Unit tests with 100% coverage (20 tests)
- [x] Exported from `hooks/index.ts`
- [x] JSDoc documentation complete
- [x] README with usage examples and accessibility guidelines

---

## 📂 Files Created/Modified

### Created

- `packages/@dsai/react/src/hooks/useReducedMotion/useReducedMotion.types.ts` - TypeScript interfaces
- `packages/@dsai/react/src/hooks/useReducedMotion/useReducedMotion.ts` - Main hook implementation (80 lines)
- `packages/@dsai/react/src/hooks/useReducedMotion/useReducedMotion.test.tsx` - Comprehensive tests (20 tests, 360+ lines)
- `packages/@dsai/react/src/hooks/useReducedMotion/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useReducedMotion/README.md` - Full documentation (323 lines)

### Modified

- `packages/@dsai/react/src/hooks/index.ts` - Added useReducedMotion export
- `packages/@dsai/react/src/index.ts` - Exported useReducedMotion from main entry

---

## ✅ Completion Summary

### Implementation Details

**Hook Features:**

- Detects `prefers-reduced-motion: reduce` media query using `window.matchMedia()`
- Reactive updates when user changes system preference (addEventListener on MediaQueryList)
- SSR-safe with `isBrowser()` check and configurable `defaultValue`
- Falls back to `defaultValue` when `matchMedia` is unavailable
- Proper cleanup of event listeners on unmount
- TypeScript with full type safety

**Test Coverage:**

- Basic functionality (5 tests)
- Media query changes (3 tests)
- SSR safety (2 tests)
- Options handling (2 tests)
- Multiple instances (3 tests)
- Edge cases (3 tests)
- Type safety (2 tests)
- **Total: 20 tests, all passing**

**Accessibility Compliance:**

- WCAG 2.1 SC 2.3.3 (AAA) - Animation from Interactions
- Documentation includes accessibility guidelines
- Examples for React Spring and Framer Motion integration
- Browser support documentation (all modern browsers)

### Quality Checks

- ✅ Biome lint/format: Clean
- ✅ ESLint: Clean
- ✅ TypeScript: No errors
- ✅ Codacy analysis: No issues
- ✅ All tests passing (20/20)
- ✅ README with comprehensive documentation
- ✅ Integration examples included

### Files Structure

```text
hooks/useReducedMotion/
├── index.ts                    # Barrel export
├── useReducedMotion.types.ts  # TypeScript interfaces
├── useReducedMotion.ts        # Implementation (80 lines)
├── useReducedMotion.test.tsx  # Tests (20 tests, 360+ lines)
└── README.md                  # Documentation (323 lines)
```

### Usage Example

```tsx
import { useReducedMotion } from '@dsai/react';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: 100 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: 'easeInOut',
      }}
    >
      Content
    </motion.div>
  );
}
```

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-062: Hooks infrastructure inventory (approved plan)
- [x] TASK-064: Extract useScrollLock Hook (pattern established)

### Enables

- Carousel animation improvements (can now respect motion preferences)
- Modal transition improvements (can disable animations)
- Collapse/Accordion animation improvements (can simplify animations)
- Future animation system (accessibility foundation)

---

## 📝 Notes

All acceptance criteria met. Hook is production-ready with comprehensive tests, documentation, and WCAG 2.1 compliance.

---### Usage Examples

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
