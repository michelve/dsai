# Extract useScrollLock Hook

**Task ID:** TASK-064
**Title:** Extract useScrollLock Hook from Modal.tsx
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 3 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Extract the `useScrollLock` hook from Modal.tsx into a standalone, reusable hook in `packages/@dsai/react/src/hooks/useScrollLock/` with full TypeScript types, comprehensive tests, and documentation.

### Problem/Issue

The `useScrollLock` hook is currently defined inline within Modal.tsx (lines 135-160, 26 LOC). This creates several problems:

1. **Code Duplication Risk:** Sheet, Drawer, and Dialog components all need scroll locking
2. **No Reusability:** Hook is not exported, cannot be used elsewhere
3. **Stacking Issue:** Current implementation doesn't handle multiple overlays (overlay stacking)
4. **Scrollbar Jump:** Need proper scrollbar width compensation

### Expected Outcome

A standalone `useScrollLock` hook that:

- Can be used by Modal, Sheet, Drawer, Dialog, and any future overlay components
- Handles overlay stacking (multiple scroll locks active simultaneously)
- Compensates for scrollbar width to prevent layout shift
- Has comprehensive unit tests with 100% coverage
- Is fully typed with TypeScript and JSDoc documentation
- Is SSR-safe with proper isBrowser checks

---

## 🎯 Acceptance Criteria

- [ ] Hook extracted to `hooks/useScrollLock/useScrollLock.ts`
- [ ] TypeScript interface `UseScrollLockOptions` defined
- [ ] Returns `UseScrollLockReturn` with `lock`, `unlock`, `isLocked`
- [ ] Supports `enabled` option (conditionally enable/disable)
- [ ] Supports `reserveScrollBarGap` option (prevent layout shift)
- [ ] Handles overlay stacking (reference counting)
- [ ] Preserves scroll position
- [ ] SSR-safe (no document/window access during SSR)
- [ ] Unit tests with 100% coverage
- [ ] Modal.tsx refactored to use new hook
- [ ] Exported from `hooks/index.ts`
- [ ] JSDoc documentation complete

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/useScrollLock/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useScrollLock/useScrollLock.ts` - Main hook implementation
- `packages/@dsai/react/src/hooks/useScrollLock/useScrollLock.types.ts` - TypeScript types
- `packages/@dsai/react/src/hooks/useScrollLock/useScrollLock.test.ts` - Unit tests

### Modify

- `packages/@dsai/react/src/hooks/index.ts` - Add useScrollLock export
- `packages/@dsai/react/src/components/Modal/Modal.tsx` - Refactor to use new hook
- `packages/@dsai/react/src/index.ts` - Export useScrollLock from main entry

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- TASK-060: Sheet component (requires useScrollLock)
- TASK-XXX: Drawer component (future)
- TASK-XXX: Dialog component (future)

---

## 🧪 Testing Requirements

- [ ] Test scroll is locked when enabled
- [ ] Test scroll is unlocked when disabled
- [ ] Test scrollbar width compensation (padding-right added)
- [ ] Test overlay stacking (lock called twice, unlock once = still locked)
- [ ] Test overlay stacking (lock twice, unlock twice = unlocked)
- [ ] Test scroll position preserved on lock/unlock
- [ ] Test SSR (no errors when window/document undefined)
- [ ] Test cleanup on unmount (scroll restored)
- [ ] Test with no scrollbar present (no unnecessary padding)
- [ ] Modal integration tests still pass after refactor

---

## 📖 Documentation Requirements

- [ ] JSDoc for hook with usage examples
- [ ] JSDoc for all options in UseScrollLockOptions
- [ ] README.md in useScrollLock/ directory
- [ ] Add to hooks section in Storybook docs

---

## 🔄 Implementation Steps

1. [ ] Create directory structure `hooks/useScrollLock/`
2. [ ] Define TypeScript types in `useScrollLock.types.ts`:

```typescript
export interface UseScrollLockOptions {
  /** Whether the scroll lock is enabled. Default: true */
  enabled?: boolean;
  /** Reserve space for scrollbar to prevent layout shift. Default: true */
  reserveScrollBarGap?: boolean;
  /** Target element to lock scroll on. Default: document.body */
  target?: React.RefObject<HTMLElement> | HTMLElement;
}

export interface UseScrollLockReturn {
  /** Manually lock scrolling */
  lock: () => void;
  /** Manually unlock scrolling */
  unlock: () => void;
  /** Whether scrolling is currently locked */
  isLocked: boolean;
}
```

3. [ ] Implement hook in `useScrollLock.ts`:
   - Extract logic from Modal.tsx lines 135-160
   - Add reference counting for overlay stacking
   - Add scrollbar width calculation
   - Add isBrowser() check for SSR safety

4. [ ] Write comprehensive unit tests in `useScrollLock.test.ts`

5. [ ] Create barrel export in `useScrollLock/index.ts`

6. [ ] Export from `hooks/index.ts`

7. [ ] Refactor Modal.tsx to import and use new hook

8. [ ] Export from main `index.ts`

9. [ ] Verify Modal tests still pass

10. [ ] Run Codacy analysis

---

## 📝 Notes

### Current Implementation Reference (Modal.tsx:135-160)

```typescript
function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Prevent layout shift from scrollbar disappearing
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);
}
```

### Enhanced Implementation - Overlay Stacking

The new implementation must support overlay stacking (multiple modals open):

```typescript
// Module-level counter for overlay stacking
let lockCount = 0;
let originalStyles: { overflow: string; paddingRight: string } | null = null;

export function useScrollLock(options: UseScrollLockOptions = {}): UseScrollLockReturn {
  const { enabled = true, reserveScrollBarGap = true } = options;
  const [isLocked, setIsLocked] = useState(false);

  const lock = useCallback(() => {
    if (!isBrowser()) return;

    if (lockCount === 0) {
      // First lock - save original styles
      originalStyles = {
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight,
      };

      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';

      if (reserveScrollBarGap && scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    lockCount++;
    setIsLocked(true);
  }, [reserveScrollBarGap]);

  const unlock = useCallback(() => {
    if (!isBrowser()) return;

    lockCount--;

    if (lockCount === 0 && originalStyles) {
      // Last unlock - restore original styles
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.paddingRight = originalStyles.paddingRight;
      originalStyles = null;
    }

    setIsLocked(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      lock();
      return unlock;
    }
  }, [enabled, lock, unlock]);

  return { lock, unlock, isLocked };
}
```

### Quality Benchmarks

Reference implementations to match:

- [React Aria usePreventScroll](https://react-spectrum.adobe.com/react-aria/usePreventScroll.html)
- [Radix ScrollLock](https://www.radix-ui.com/primitives/utilities/scroll-lock)
- [body-scroll-lock](https://github.com/willmcpo/body-scroll-lock)

### Edge Cases to Handle

1. **iOS Safari:** May need `-webkit-overflow-scrolling: touch` handling
2. **Fixed elements:** May need scrollbar compensation on fixed headers
3. **Multiple targets:** Future enhancement to lock specific elements
4. **Touch scrolling:** May need `touchmove` event prevention for mobile

---

## ✅ Definition of Done

- [ ] Hook implemented with all options
- [ ] Overlay stacking working correctly
- [ ] 100% test coverage
- [ ] Modal refactored to use new hook
- [ ] All Modal tests passing
- [ ] TypeScript types complete
- [ ] JSDoc documentation complete
- [ ] Exported from main index.ts
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
