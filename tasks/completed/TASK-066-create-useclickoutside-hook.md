# Create useClickOutside Hook

**Task ID:** TASK-066
**Title:** Create useClickOutside Hook
**Priority:** Medium
**Status:** ⚪ Not Started
**Assigned To:** Unassigned
**Estimated Time:** 3 Hours
**Created:** 2024-12-05
**Updated:** 2024-12-05

---

## 📋 Task Description

### Goal

Create a new `useClickOutside` hook in `packages/@dsai/react/src/hooks/useClickOutside/` that detects clicks outside a referenced element, enabling dismissal of dropdowns, popovers, modals, and other overlay components.

### Problem/Issue

Currently, click-outside detection is handled in various ways across components:

- **Dropdown:** Uses Floating UI's `useDismiss` interaction
- **Tooltip:** Uses Floating UI's dismiss behavior
- **Popover:** Will need click-outside detection (planned component)
- **Modal:** Uses backdrop click (different pattern)

While Floating UI handles this for floating elements, a standalone hook provides:

1. Consistent API across all components
2. Flexibility for non-Floating UI components
3. Support for multiple excluded elements
4. Better testability

### Expected Outcome

A standalone `useClickOutside` hook that:

- Detects clicks/touches outside referenced element(s)
- Supports multiple excluded refs (e.g., trigger + content)
- Handles both mouse and touch events
- Is SSR-safe
- Has comprehensive unit tests

---

## 🎯 Acceptance Criteria

- [ ] Hook created at `hooks/useClickOutside/useClickOutside.ts`
- [ ] Accepts single ref or array of refs to ignore
- [ ] Calls callback when click is outside all refs
- [ ] Supports `mousedown` and `touchstart` events
- [ ] Supports `enabled` option to conditionally enable/disable
- [ ] Supports `capture` phase option
- [ ] SSR-safe (no document access during SSR)
- [ ] Unit tests with 100% coverage
- [ ] Exported from `hooks/index.ts`
- [ ] JSDoc documentation complete

---

## 📂 Files to Create/Modify

### Create

- `packages/@dsai/react/src/hooks/useClickOutside/index.ts` - Barrel export
- `packages/@dsai/react/src/hooks/useClickOutside/useClickOutside.ts` - Main hook
- `packages/@dsai/react/src/hooks/useClickOutside/useClickOutside.test.ts` - Unit tests

### Modify

- `packages/@dsai/react/src/hooks/index.ts` - Add useClickOutside export
- `packages/@dsai/react/src/index.ts` - Export useClickOutside from main entry

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-062: Hooks infrastructure inventory (approved plan)

### Blocks

- Custom dropdown implementations
- Popover component (TASK-043)
- Context menu component (future)
- Any component needing click-outside dismissal

---

## 🧪 Testing Requirements

- [ ] Test callback called on click outside single ref
- [ ] Test callback NOT called on click inside ref
- [ ] Test with multiple refs (click inside any = no callback)
- [ ] Test with `enabled: false` (no callback)
- [ ] Test mousedown event handling
- [ ] Test touchstart event handling
- [ ] Test cleanup removes event listeners on unmount
- [ ] Test SSR (no errors during server render)
- [ ] Test capture phase option
- [ ] Test with null/undefined refs (graceful handling)

---

## 📖 Documentation Requirements

- [ ] JSDoc for hook with usage examples
- [ ] README.md in useClickOutside/ directory
- [ ] Add to hooks section in Storybook docs

---

## 🔄 Implementation Steps

1. [ ] Create directory structure `hooks/useClickOutside/`
2. [ ] Define TypeScript types:

```typescript
export interface UseClickOutsideOptions {
  /** Whether the listener is enabled. Default: true */
  enabled?: boolean;
  /** Use capture phase for event listeners. Default: true */
  capture?: boolean;
  /** Event types to listen for. Default: ['mousedown', 'touchstart'] */
  events?: Array<'mousedown' | 'touchstart' | 'pointerdown'>;
}

export type UseClickOutsideRefs =
  | React.RefObject<HTMLElement | null>
  | React.RefObject<HTMLElement | null>[];
```

3. [ ] Implement hook in `useClickOutside.ts`:

````typescript
import { useEffect, useCallback } from 'react';
import { isBrowser } from '../../utils/isBrowser';

/**
 * Detects clicks outside of the specified element(s) and calls the provided callback.
 *
 * @example
 * ```tsx
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   const contentRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(
 *     [triggerRef, contentRef],
 *     () => setIsOpen(false),
 *     { enabled: isOpen }
 *   );
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setIsOpen(true)}>
 *         Open
 *       </button>
 *       {isOpen && (
 *         <div ref={contentRef}>Dropdown content</div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @param refs - Element ref(s) to consider as "inside"
 * @param callback - Function to call when click is outside
 * @param options - Configuration options
 */
export function useClickOutside(
  refs: UseClickOutsideRefs,
  callback: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {}
): void {
  const { enabled = true, capture = true, events = ['mousedown', 'touchstart'] } = options;

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];

      const isOutside = refsArray.every((ref) => {
        const element = ref.current;
        return element && !element.contains(event.target as Node);
      });

      if (isOutside) {
        callback(event);
      }
    },
    [refs, callback]
  );

  useEffect(() => {
    if (!enabled || !isBrowser()) return;

    events.forEach((eventType) => {
      document.addEventListener(eventType, handleClickOutside, capture);
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, handleClickOutside, capture);
      });
    };
  }, [enabled, events, capture, handleClickOutside]);
}
````

4. [ ] Write comprehensive unit tests in `useClickOutside.test.ts`

5. [ ] Create barrel export in `useClickOutside/index.ts`

6. [ ] Export from `hooks/index.ts`

7. [ ] Export from main `index.ts`

8. [ ] Run Codacy analysis

---

## 📝 Notes

### Design Decisions

**Why use capture phase by default?**

Using the capture phase (`capture: true`) ensures our handler runs before any event.stopPropagation() in child elements can prevent the event from bubbling.

**Why support multiple refs?**

Common pattern for dropdowns/popovers: the trigger element and the floating content are siblings, not parent-child. We need to exclude both from "outside" detection.

**Why mousedown instead of click?**

`mousedown` fires before the potential `blur` of an input, allowing us to prevent dismissal while user is still interacting. This matches Radix UI and Floating UI behavior.

### Comparison with Floating UI

| Feature         | useClickOutside | Floating UI useDismiss |
| --------------- | --------------- | ---------------------- |
| Multiple refs   | ✅              | ✅                     |
| Touch events    | ✅              | ✅                     |
| Escape key      | ❌              | ✅                     |
| Outside press   | ✅              | ✅                     |
| Focus outside   | ❌              | ✅                     |
| Ancestor scroll | ❌              | ✅                     |

For Floating UI components, continue using `useDismiss`. This hook is for:

- Non-floating components
- Custom implementations
- Components that can't use Floating UI

### Quality Benchmarks

Reference implementations:

- [Mantine useClickOutside](https://mantine.dev/hooks/use-click-outside/)
- [React Aria useInteractOutside](https://react-spectrum.adobe.com/react-aria/useInteractOutside.html)
- [Radix Dismissable Layer](https://www.radix-ui.com/primitives/utilities/dismissable-layer)

---

## ✅ Definition of Done

- [ ] Hook implemented with all options
- [ ] 100% test coverage
- [ ] TypeScript types complete
- [ ] JSDoc documentation complete
- [ ] Exported from main index.ts
- [ ] Codacy analysis passing
- [ ] Code reviewed and approved
