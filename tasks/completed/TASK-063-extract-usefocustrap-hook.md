# Extract useFocusTrap Hook

**Task ID:** TASK-063
**Title:** Extract useFocusTrap Hook from Modal.tsx
**Priority:** High
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 4 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Extract the `useFocusTrap` hook from Modal.tsx into a standalone, reusable hook in `packages/@dsai/react/src/hooks/useFocusTrap/` with full TypeScript types, comprehensive tests, and documentation.

### Problem/Issue

The `useFocusTrap` hook is currently defined inline within Modal.tsx (lines 66-127, 62 LOC). This creates several problems:

1. **Code Duplication Risk:** Sheet, Drawer, and Dialog components all need focus trapping
2. **No Reusability:** Hook is not exported, cannot be used elsewhere
3. **Testing Gap:** Hook logic is tested only through Modal integration tests
4. **Maintenance Burden:** Bug fixes would need to be applied to multiple copies

### Expected Outcome

A standalone `useFocusTrap` hook that:

- Can be used by Modal, Sheet, Drawer, Dialog, and any future overlay components
- Has comprehensive unit tests with 100% coverage
- Is fully typed with TypeScript and JSDoc documentation
- Follows enterprise-grade quality standards (React Aria, Radix UI level)
- Is SSR-safe with proper isBrowser checks

---

## 🎯 Acceptance Criteria

- [ ] Hook extracted to `hooks/useFocusTrap/useFocusTrap.ts`
- [ ] TypeScript interface `UseFocusTrapOptions` defined
- [ ] Returns `UseFocusTrapReturn` with `activate`, `deactivate`, `isActive`
- [ ] Supports `autoFocus` option (focus first element on mount)
- [ ] Supports `restoreFocus` option (restore focus on unmount)
- [ ] Supports `initialFocusRef` option (custom initial focus target)
- [ ] Supports `finalFocusRef` option (custom restore focus target)
- [ ] Supports `enabled` option (conditionally enable/disable)
- [ ] Tab and Shift+Tab cycle within container
- [ ] Escape key support (optional callback)
- [ ] SSR-safe (no document/window access during SSR)
- [ ] Unit tests with 100% coverage
- [ ] Modal.tsx refactored to use new hook
- [ ] Exported from `hooks/index.ts`
- [ ] JSDoc documentation complete

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/useFocusTrap/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useFocusTrap/useFocusTrap.ts` - Main hook implementation
- `packages/@dsai/react/src/hooks/useFocusTrap/useFocusTrap.types.ts` - TypeScript types
- `packages/@dsai/react/src/hooks/useFocusTrap/useFocusTrap.test.ts` - Unit tests

### Modify

- `packages/@dsai/react/src/hooks/index.ts` - Add useFocusTrap export
- `packages/@dsai/react/src/components/Modal/Modal.tsx` - Refactor to use new hook
- `packages/@dsai/react/src/index.ts` - Export useFocusTrap from main entry

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- TASK-060: Sheet component (requires useFocusTrap)
- TASK-XXX: Drawer component (future)
- TASK-XXX: Dialog component (future)

---

## 🧪 Testing Requirements

- [ ] Unit tests for all options (autoFocus, restoreFocus, enabled, etc.)
- [ ] Test Tab key cycles focus within container
- [ ] Test Shift+Tab cycles focus backwards
- [ ] Test initialFocusRef receives focus on mount
- [ ] Test finalFocusRef receives focus on unmount
- [ ] Test disabled state (no trapping when enabled=false)
- [ ] Test with no focusable elements (edge case)
- [ ] Test with single focusable element
- [ ] Test SSR (no errors when window/document undefined)
- [ ] Test cleanup on unmount (removes event listeners)
- [ ] Modal integration tests still pass after refactor

---

## 📖 Documentation Requirements

- [ ] JSDoc for hook with usage examples
- [ ] JSDoc for all options in UseFocusTrapOptions
- [ ] README.md in useFocusTrap/ directory
- [ ] Add to hooks section in Storybook docs

---

## 🔄 Implementation Steps

1. [ ] Create directory structure `hooks/useFocusTrap/`
2. [ ] Define TypeScript types in `useFocusTrap.types.ts`:

```typescript
export interface UseFocusTrapOptions {
  /** Whether the focus trap is enabled. Default: true */
  enabled?: boolean;
  /** Auto-focus first focusable element on mount. Default: true */
  autoFocus?: boolean;
  /** Restore focus to previously focused element on unmount. Default: true */
  restoreFocus?: boolean;
  /** Ref to element that should receive initial focus */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Ref to element that should receive focus on unmount */
  finalFocusRef?: React.RefObject<HTMLElement>;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
}

export interface UseFocusTrapReturn {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement>;
  /** Manually activate the focus trap */
  activate: () => void;
  /** Manually deactivate the focus trap */
  deactivate: () => void;
  /** Whether the focus trap is currently active */
  isActive: boolean;
}
```

3. [ ] Implement hook in `useFocusTrap.ts`:
   - Extract logic from Modal.tsx lines 66-127
   - Use existing `trapFocus()` utility from `utils/a11y/trapFocus`
   - Use existing `focusableSelectors` from `utils/a11y/focusableSelectors`
   - Add isBrowser() check for SSR safety

4. [ ] Write comprehensive unit tests in `useFocusTrap.test.ts`

5. [ ] Create barrel export in `useFocusTrap/index.ts`

6. [ ] Export from `hooks/index.ts`

7. [ ] Refactor Modal.tsx to import and use new hook

8. [ ] Export from main `index.ts`

9. [ ] Verify Modal tests still pass

10. [ ] Run Codacy analysis

---

## 📝 Notes

### Current Implementation Reference (Modal.tsx:66-127)

```typescript
function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isOpen: boolean,
  options: {
    autoFocus?: boolean;
    restoreFocus?: boolean;
    initialFocusRef?: React.RefObject<HTMLElement>;
  } = {}
) {
  const { autoFocus = true, restoreFocus = true, initialFocusRef } = options;
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    // Store currently focused element
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement;
    }

    // Focus management
    const container = containerRef.current;

    // Set initial focus
    if (autoFocus) {
      const target = initialFocusRef?.current || getFocusableElements(container)[0];
      target?.focus();
    }

    // Trap focus handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        trapFocus(container, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus
      if (restoreFocus && previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, autoFocus, restoreFocus, initialFocusRef, containerRef]);
}
```

### Quality Benchmarks

Reference implementations to match:

- [React Aria useFocusScope](https://react-spectrum.adobe.com/react-aria/FocusScope.html)
- [Radix FocusTrap](https://www.radix-ui.com/primitives/utilities/focus-trap)
- [Mantine useFocusTrap](https://mantine.dev/hooks/use-focus-trap/)

### Key Differences from Current Implementation

1. Add `enabled` option for conditional trapping
2. Add `finalFocusRef` for custom restore target
3. Add `onEscape` callback
4. Return `activate`/`deactivate` methods for manual control
5. Return `isActive` state for UI feedback
6. Better TypeScript types with full JSDoc

---

## ✅ Definition of Done

- [ ] Hook implemented with all options
- [ ] 100% test coverage
- [ ] Modal refactored to use new hook
- [ ] All Modal tests passing
- [ ] TypeScript types complete
- [ ] JSDoc documentation complete
- [ ] Exported from main index.ts
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
