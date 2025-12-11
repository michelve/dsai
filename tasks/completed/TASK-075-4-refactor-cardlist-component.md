# Task Template

**Task ID:** TASK-075-4  
**Title:** Refactor CardList Component to Use useControllableState Hook  
**Priority:** Medium-High  
**Status:** 🟡 Ready  
**Assigned To:** Developer  
**Estimated Time:** 2-3 hours  
**Actual Time:** _TBD_  
**Parent Task:** TASK-075 (Refactor Components to Use Centralized Hooks)  
**Blocked By:** None (can proceed independently)  
**Created:** 2025-12-10  
**Updated:** 2025-12-10  
**Completed:** _Not yet_

---

## 📋 Task Description

### Goal

Refactor the CardList component to replace manual controlled/uncontrolled state management with the centralized `useControllableState` hook, simplifying the selection logic while maintaining 100% backward compatibility.

### Problem/Issue

**Current State:**

CardList manually manages controlled/uncontrolled selection state with custom logic:

```tsx
// Manual state management (~8-10 lines)
const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected ?? []);

const actualSelected = selected ?? internalSelected;

const handleSelect = (id: string) => {
  const newSelected = actualSelected.includes(id)
    ? actualSelected.filter((item) => item !== id)
    : [...actualSelected, id];

  if (selected === undefined) {
    setInternalSelected(newSelected);
  }

  onSelectionChange?.(newSelected);
};
```

**Problems:**

- Manual controlled/uncontrolled logic (8-10 lines)
- Duplicates pattern available in `useControllableState`
- Inconsistent with other components using the hook
- More complex than necessary

### Expected Outcome

CardList uses `useControllableState` hook:

```tsx
// Clean hook implementation (~3 lines)
const [selectedIds, setSelectedIds] = useControllableState({
  value: selected,
  defaultValue: defaultSelected ?? [],
  onChange: onSelectionChange,
});

const handleSelect = (id: string) => {
  const newSelected = selectedIds.includes(id)
    ? selectedIds.filter((item) => item !== id)
    : [...selectedIds, id];
  setSelectedIds(newSelected);
};
```

**Benefits:**

- **Code Reduction**: ~5-8 lines removed
- **Consistency**: Standard pattern across codebase
- **Maintainability**: Single source of truth
- **Simplification**: Less mental overhead

---

## 🎯 Acceptance Criteria

### Functionality

- [ ] **Import useControllableState hook**

  ```tsx
  import { useControllableState } from '../../hooks';
  ```

- [ ] **Replace manual state management**
  - Remove manual `useState` for internal state
  - Remove manual controlled/uncontrolled logic
  - Add `useControllableState` hook call

- [ ] **Preserve all existing features**
  - Controlled mode works (selected prop provided)
  - Uncontrolled mode works (defaultSelected provided)
  - Single selection works (when multi is false)
  - Multi-selection works (when multi is true)
  - onSelectionChange callback fires correctly
  - Card selection/deselection works
  - Initial selection state correct

### Code Quality

- [ ] Remove ~5-8 lines of manual state logic
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper hook dependencies
- [ ] JSDoc comments preserved

### Testing

- [ ] All existing CardList tests pass (40+ test cases)
- [ ] Controlled mode tested
- [ ] Uncontrolled mode tested
- [ ] Single selection tested
- [ ] Multi-selection tested
- [ ] onSelectionChange callback tested
- [ ] Initial state tested

### Validation

- [ ] Component works in Storybook
- [ ] All CardList stories render correctly
- [ ] Manual testing completed
- [ ] No visual regressions

---

## 📂 Files to Modify

### Primary File

**`packages/@dsai/react/src/components/CardList/CardList.tsx`** (~250 lines)

**Changes:**

- Line ~15: Add `useControllableState` import
- Lines ~80-95: Remove manual state management
- Add: `useControllableState` hook call (~5 lines)
- Update: `handleSelect` function (~3 lines simplified)

### Test File

**`packages/@dsai/react/src/components/CardList/CardList.test.tsx`**

**Changes:**

- Verify existing tests still pass (should pass without changes)
- Optionally add explicit test for hook integration

---

## 🔗 Dependencies

### Prerequisites

- [x] `useControllableState` hook available in `@dsai/react/hooks`
- [x] Comprehensive component analysis complete

### Blocks

- None (independent subtask)

---

## 🔄 Implementation Steps

### Step 1: Preparation (10 minutes)

1. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-4-cardlist-useControllableState
   ```

2. [ ] **Review current CardList implementation**
   - Open `packages/@dsai/react/src/components/CardList/CardList.tsx`
   - Locate manual state management (~lines 80-95)
   - Review handleSelect logic
   - Note selected/defaultSelected props
   - Check onSelectionChange callback

3. [ ] **Review useControllableState hook**
   - Open `packages/@dsai/react/src/hooks/useControllableState/useControllableState.ts`
   - Review hook API
   - Understand value/defaultValue/onChange pattern

---

### Step 2: Implementation (1-1.5 hours)

4. [ ] **Import useControllableState hook**

   Find line ~15 where hooks are imported:

   ```tsx
   import { forwardRef, useCallback, useState } from 'react';
   import { cn } from '../../utils';
   ```

   Add hook import:

   ```tsx
   import { useControllableState } from '../../hooks';
   ```

5. [ ] **Locate manual state management code**

   Find around lines 80-95:

   ```tsx
   // Manual implementation to remove
   const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected ?? []);

   const actualSelected = selected ?? internalSelected;

   const handleSelect = useCallback(
     (id: string) => {
       const newSelected = actualSelected.includes(id)
         ? actualSelected.filter((item) => item !== id)
         : [...actualSelected, id];

       if (selected === undefined) {
         setInternalSelected(newSelected);
       }

       onSelectionChange?.(newSelected);
     },
     [actualSelected, selected, onSelectionChange]
   );
   ```

6. [ ] **Remove manual implementation**

   Delete:
   - Manual `useState` for internalSelected
   - `actualSelected` variable
   - Complex conditional logic in handleSelect

   **Total removal:** ~8-10 lines

7. [ ] **Add useControllableState hook**

   Replace removed code with:

   ```tsx
   // Controlled/uncontrolled selection state with centralized hook
   const [selectedIds, setSelectedIds] = useControllableState({
     value: selected,
     defaultValue: defaultSelected ?? [],
     onChange: onSelectionChange,
   });
   ```

8. [ ] **Update handleSelect function**

   Simplify to:

   ```tsx
   const handleSelect = useCallback(
     (id: string) => {
       const newSelected = selectedIds.includes(id)
         ? selectedIds.filter((item) => item !== id)
         : [...selectedIds, id];

       setSelectedIds(newSelected);
     },
     [selectedIds, setSelectedIds]
   );
   ```

   **Note:** The hook automatically handles:
   - Calling `onSelectionChange` callback
   - Managing controlled vs uncontrolled state
   - Proper cleanup and updates

9. [ ] **Update any references to selection state**

   Find all references to `actualSelected` and replace with `selectedIds`:

   ```tsx
   // In JSX or logic
   const isSelected = selectedIds.includes(card.id);
   ```

10. [ ] **Verify multi-select logic still works**

    Check if component handles single vs multi selection:

    ```tsx
    const handleSelect = useCallback(
      (id: string) => {
        let newSelected: string[];

        if (multi) {
          // Multi-select: toggle selection
          newSelected = selectedIds.includes(id)
            ? selectedIds.filter((item) => item !== id)
            : [...selectedIds, id];
        } else {
          // Single select: replace selection
          newSelected = selectedIds.includes(id) ? [] : [id];
        }

        setSelectedIds(newSelected);
      },
      [selectedIds, setSelectedIds, multi]
    );
    ```

---

### Step 3: Testing (45 minutes)

11. [ ] **Run unit tests**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=CardList
    # Expected: All 40+ tests pass
    ```

12. [ ] **Test in Storybook**

    ```bash
    pnpm nx storybook @dsai/storybook
    # Navigate to CardList stories
    ```

13. [ ] **Manual testing checklist**
    - [ ] **Uncontrolled mode**
      - Cards render correctly
      - Click card → selects card ✅
      - Click selected card → deselects card ✅
      - Initial defaultSelected state correct ✅
    - [ ] **Controlled mode**
      - Provide selected prop
      - Selection controlled by parent ✅
      - onSelectionChange fires correctly ✅
      - UI updates when selected prop changes ✅
    - [ ] **Multi-select mode**
      - Multiple cards can be selected ✅
      - Clicking selected card deselects it ✅
      - Other selections remain ✅
    - [ ] **Single select mode**
      - Only one card selected at a time ✅
      - Selecting new card deselects previous ✅

14. [ ] **Edge case testing**
    - [ ] Empty defaultSelected works
    - [ ] Pre-selecting invalid IDs handled gracefully
    - [ ] Rapid clicking works
    - [ ] onChange called with correct values

---

### Step 4: Code Quality (20 minutes)

15. [ ] **Run TypeScript check**

    ```bash
    pnpm nx type-check @dsai/react
    ```

16. [ ] **Run linter**

    ```bash
    pnpm nx lint @dsai/react --fix
    ```

17. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/CardList/CardList.tsx
    ```

18. [ ] **Self code review**
    - [ ] Review git diff
    - [ ] Verify only state management changed
    - [ ] Check imports
    - [ ] No debug code

---

### Step 5: Documentation (10 minutes)

19. [ ] **Update inline comments**

    Add comment above hook:

    ```tsx
    // Controlled/uncontrolled selection state (using centralized hook)
    const [selectedIds, setSelectedIds] = useControllableState({
      value: selected,
      defaultValue: defaultSelected ?? [],
      onChange: onSelectionChange,
    });
    ```

20. [ ] **Check README for updates**

    Open `packages/@dsai/react/src/components/CardList/README.md`

    If it mentions state management, no updates needed (behavior is identical).

---

### Step 6: Commit & Review (10 minutes)

21. [ ] **Stage changes**

    ```bash
    git add packages/@dsai/react/src/components/CardList/
    ```

22. [ ] **Commit with conventional commit**
    ```bash
    git commit -m "refactor(cardlist): replace manual state with useControllableState hook
    ```

- Remove ~8 lines of manual controlled/uncontrolled logic
- Use standard hook pattern for state management
- Simplify handleSelect function
- Maintain 100% backward compatibility
- All 40+ tests passing

Closes TASK-075-4"
```

23. [ ] **Push feature branch**
    ```bash
    git push origin feature/task-075-4-cardlist-useControllableState
    ```

---

## 📝 Notes

### Component Details

**File:** `packages/@dsai/react/src/components/CardList/CardList.tsx`  
**Current Lines:** ~250  
**Lines to Remove:** ~8-10  
**Lines to Add:** ~5  
**Complexity:** Low-Medium  
**Risk Level:** Low

### Hook Integration Pattern

```tsx
// Before: Manual state management
const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelected ?? []);
const actualSelected = selected ?? internalSelected;

const handleSelect = (id: string) => {
  const newSelected = /* ... logic ... */;
  if (selected === undefined) {
    setInternalSelected(newSelected);
  }
  onSelectionChange?.(newSelected);
};

// After: Using hook
const [selectedIds, setSelectedIds] = useControllableState({
  value: selected,
  defaultValue: defaultSelected ?? [],
  onChange: onSelectionChange
});

const handleSelect = (id: string) => {
  const newSelected = /* ... logic ... */;
  setSelectedIds(newSelected);  // Hook handles everything
};
```

### Selection Logic

**Multi-Select (default):**

```tsx
const newSelected = selectedIds.includes(id)
  ? selectedIds.filter((item) => item !== id) // Remove
  : [...selectedIds, id]; // Add
```

**Single-Select:**

```tsx
const newSelected = selectedIds.includes(id)
  ? [] // Deselect
  : [id]; // Select only this one
```

### Props Interface

```tsx
interface CardListProps {
  // Controlled mode
  selected?: string[];
  onSelectionChange?: (selected: string[]) => void;

  // Uncontrolled mode
  defaultSelected?: string[];

  // Selection mode
  multi?: boolean;

  // ... other props
}
```

### Common Issues

**Issue 1: Selection not working**

```tsx
// Make sure handleSelect is properly memoized
const handleSelect = useCallback(
  (id: string) => {
    // ... logic
    setSelectedIds(newSelected);
  },
  [selectedIds, setSelectedIds, multi]
);
```

**Issue 2: onChange not firing**

```tsx
// Hook automatically calls onChange
// No need to manually call it
const [selectedIds, setSelectedIds] = useControllableState({
  value: selected,
  defaultValue: defaultSelected ?? [],
  onChange: onSelectionChange, // ✅ Hook calls this
});
```

**Issue 3: TypeScript errors**

```tsx
// Make sure types match
const [selectedIds, setSelectedIds] = useControllableState<string[]>({
  value: selected,
  defaultValue: defaultSelected ?? [],
  onChange: onSelectionChange,
});
```

---

## ✅ Definition of Done

### Code

- [ ] Manual state management removed (~8 lines)
- [ ] `useControllableState` hook integrated
- [ ] handleSelect simplified
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Clean git diff

### Tests

- [ ] All 40+ CardList tests pass
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Multi-select works
- [ ] Single-select works

### Documentation

- [ ] Inline comments added
- [ ] Code self-documenting

### Process

- [ ] Code committed
- [ ] Feature branch pushed
- [ ] Ready for review

---

## Post-Completion

1. [ ] Mark task as ✅ COMPLETED
2. [ ] Update actual time spent
3. [ ] Update parent task (TASK-075) progress
4. [ ] Move to next subtask (TASK-075-5)

---

## Rollback Plan

```bash
# Revert commit
git revert <commit-hash>

# Or reset
git reset --hard HEAD~1
```

---

## Related Tasks

- **Parent:** TASK-075 (Refactor Components to Use Centralized Hooks)
- **Previous:** TASK-075-3 (Navbar Component)
- **Next:** TASK-075-5 (CheckboxGroup Component)
- **Similar:** TASK-075-2 (Input - same hook)

---

**Subtask Ready for Implementation! 🚀**

**Time Estimate:** 2-3 hours  
**Difficulty:** Low-Medium  
**Risk:** Low  
**Value:** Medium (simplifies state management, increases consistency)
