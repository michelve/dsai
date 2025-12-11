# Task Template

**Task ID:** TASK-075-5  
**Title:** Refactor CheckboxGroup Component to Use useControllableState Hook  
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

Refactor the CheckboxGroup component to replace manual controlled/uncontrolled state management with the centralized `useControllableState` hook, standardizing the pattern used across form components while maintaining 100% backward compatibility.

### Problem/Issue

**Current State:**

CheckboxGroup manually manages controlled/uncontrolled value state with custom logic:

```tsx
// Manual state management (~8-10 lines)
const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);

const actualValue = value ?? internalValue;

const handleChange = (optionValue: string, checked: boolean) => {
  const newValue = checked
    ? [...actualValue, optionValue]
    : actualValue.filter((v) => v !== optionValue);

  if (value === undefined) {
    setInternalValue(newValue);
  }

  onChange?.(newValue);
};
```

**Problems:**

- Manual controlled/uncontrolled logic (8-10 lines)
- Duplicates pattern available in `useControllableState`
- Inconsistent with other form components using the hook
- More complex than necessary

### Expected Outcome

CheckboxGroup uses `useControllableState` hook:

```tsx
// Clean hook implementation (~3 lines)
const [selectedValues, setSelectedValues] = useControllableState({
  value,
  defaultValue: defaultValue ?? [],
  onChange,
});

const handleChange = (optionValue: string, checked: boolean) => {
  const newValue = checked
    ? [...selectedValues, optionValue]
    : selectedValues.filter((v) => v !== optionValue);
  setSelectedValues(newValue);
};
```

**Benefits:**

- **Code Reduction**: ~5-8 lines removed
- **Consistency**: Matches RadioGroup, CardList, Input patterns
- **Maintainability**: Single source of truth
- **Simplification**: Standard form component pattern

---

## 🎯 Acceptance Criteria

### Functionality

- [ ] **Import useControllableState hook**

  ```tsx
  import { useControllableState } from '../../hooks';
  ```

- [ ] **Replace manual state management**
  - Remove manual `useState` for internal value
  - Remove manual controlled/uncontrolled logic
  - Add `useControllableState` hook call

- [ ] **Preserve all existing features**
  - Controlled mode works (value prop provided)
  - Uncontrolled mode works (defaultValue provided)
  - Multiple checkbox selection works
  - onChange callback fires correctly with updated array
  - Checkbox checked state correct
  - Initial value state correct
  - Disabled checkboxes work
  - Required validation works

### Code Quality

- [ ] Remove ~5-8 lines of manual state logic
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper hook dependencies
- [ ] JSDoc comments preserved

### Testing

- [ ] All existing CheckboxGroup tests pass (50+ test cases)
- [ ] Controlled mode tested
- [ ] Uncontrolled mode tested
- [ ] Multiple selection tested
- [ ] onChange callback tested with correct values
- [ ] Individual checkbox state tested
- [ ] Initial state tested

### Validation

- [ ] Component works in Storybook
- [ ] All CheckboxGroup stories render correctly
- [ ] Manual testing completed
- [ ] Accessibility verified (screen reader)
- [ ] No visual regressions

---

## 📂 Files to Modify

### Primary File

**`packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx`** (~200 lines)

**Changes:**

- Line ~14: Add `useControllableState` import
- Lines ~60-75: Remove manual state management
- Add: `useControllableState` hook call (~5 lines)
- Update: `handleChange` function (~3 lines simplified)

### Test File

**`packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.test.tsx`**

**Changes:**

- Verify existing tests still pass (should pass without changes)
- Optionally add explicit test for controlled/uncontrolled transitions

---

## 🔗 Dependencies

### Prerequisites

- [x] `useControllableState` hook available in `@dsai/react/hooks`
- [x] Comprehensive component analysis complete

### Blocks

- None (this is the final subtask in TASK-075)

---

## 🔄 Implementation Steps

### Step 1: Preparation (10 minutes)

1. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-5-checkboxgroup-useControllableState
   ```

2. [ ] **Review current CheckboxGroup implementation**
   - Open `packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx`
   - Locate manual state management (~lines 60-75)
   - Review handleChange logic
   - Note value/defaultValue props
   - Check onChange callback

3. [ ] **Review useControllableState hook**
   - Open `packages/@dsai/react/src/hooks/useControllableState/useControllableState.ts`
   - Review hook API
   - Understand array value handling

---

### Step 2: Implementation (1-1.5 hours)

4. [ ] **Import useControllableState hook**

   Find line ~14 where hooks are imported:

   ```tsx
   import { forwardRef, useCallback, useState } from 'react';
   import { cn } from '../../utils';
   ```

   Add hook import:

   ```tsx
   import { useControllableState } from '../../hooks';
   ```

5. [ ] **Locate manual state management code**

   Find around lines 60-75:

   ```tsx
   // Manual implementation to remove
   const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);

   const actualValue = value ?? internalValue;

   const handleChange = useCallback(
     (optionValue: string, checked: boolean) => {
       const newValue = checked
         ? [...actualValue, optionValue]
         : actualValue.filter((v) => v !== optionValue);

       if (value === undefined) {
         setInternalValue(newValue);
       }

       onChange?.(newValue);
     },
     [actualValue, value, onChange]
   );
   ```

6. [ ] **Remove manual implementation**

   Delete:
   - Manual `useState` for internalValue
   - `actualValue` variable
   - Complex conditional logic in handleChange

   **Total removal:** ~8-10 lines

7. [ ] **Add useControllableState hook**

   Replace removed code with:

   ```tsx
   // Controlled/uncontrolled value state with centralized hook
   const [selectedValues, setSelectedValues] = useControllableState({
     value,
     defaultValue: defaultValue ?? [],
     onChange,
   });
   ```

8. [ ] **Update handleChange function**

   Simplify to:

   ```tsx
   const handleChange = useCallback(
     (optionValue: string, checked: boolean) => {
       const newValue = checked
         ? [...selectedValues, optionValue]
         : selectedValues.filter((v) => v !== optionValue);

       setSelectedValues(newValue);
     },
     [selectedValues, setSelectedValues]
   );
   ```

   **Note:** The hook automatically:
   - Calls `onChange` callback with new value
   - Manages controlled vs uncontrolled state
   - Handles proper cleanup and updates

9. [ ] **Update checkbox checked state logic**

   Find where individual checkbox checked state is determined:

   ```tsx
   // Before
   const isChecked = actualValue.includes(option.value);

   // After
   const isChecked = selectedValues.includes(option.value);
   ```

   Update all references to `actualValue` to use `selectedValues`.

10. [ ] **Verify disabled and required logic**

    Check that disabled and required props still work:

    ```tsx
    // These should not be affected by state management change
    <Checkbox
      checked={isChecked}
      disabled={disabled || option.disabled}
      required={required}
      onChange={(e) => handleChange(option.value, e.target.checked)}
    />
    ```

---

### Step 3: Testing (45 minutes)

11. [ ] **Run unit tests**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=CheckboxGroup
    # Expected: All 50+ tests pass
    ```

12. [ ] **Test in Storybook**

    ```bash
    pnpm nx storybook @dsai/storybook
    # Navigate to CheckboxGroup stories
    ```

13. [ ] **Manual testing checklist**
    - [ ] **Uncontrolled mode**
      - Checkboxes render correctly
      - Click checkbox → toggles checked state ✅
      - Multiple checkboxes can be checked ✅
      - Initial defaultValue state correct ✅
      - onChange fires with correct array ✅
    - [ ] **Controlled mode**
      - Provide value prop
      - Selection controlled by parent ✅
      - onChange fires correctly ✅
      - UI updates when value prop changes ✅
      - Checkbox state syncs with value prop ✅
    - [ ] **Edge cases**
      - Empty defaultValue works ✅
      - Pre-selecting values works ✅
      - Disabled checkboxes don't change ✅
      - Required validation works ✅
      - Rapid clicking works ✅

14. [ ] **Accessibility testing**
    - [ ] Screen reader announces each checkbox
    - [ ] Group label announced correctly
    - [ ] Keyboard navigation works (Tab, Space)
    - [ ] Focus visible on checkboxes
    - [ ] ARIA attributes correct

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
    codacy-cli analyze --file packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx
    ```

18. [ ] **Self code review**
    - [ ] Review git diff
    - [ ] Verify only state management changed
    - [ ] Check imports clean
    - [ ] No debug code

---

### Step 5: Documentation (10 minutes)

19. [ ] **Update inline comments**

    Add comment above hook:

    ```tsx
    // Controlled/uncontrolled value state (using centralized hook)
    const [selectedValues, setSelectedValues] = useControllableState({
      value,
      defaultValue: defaultValue ?? [],
      onChange,
    });
    ```

20. [ ] **Check README for updates**

    Open `packages/@dsai/react/src/components/CheckboxGroup/README.md`

    Behavior is identical, so no updates needed.

---

### Step 6: Commit & Review (10 minutes)

21. [ ] **Stage changes**

    ```bash
    git add packages/@dsai/react/src/components/CheckboxGroup/
    ```

22. [ ] **Commit with conventional commit**
    ```bash
    git commit -m "refactor(checkboxgroup): replace manual state with useControllableState hook
    ```

- Remove ~8 lines of manual controlled/uncontrolled logic
- Use standard hook pattern for state management
- Simplify handleChange function
- Maintain 100% backward compatibility
- All 50+ tests passing
- Completes hook standardization across form components

Closes TASK-075-5"
```

23. [ ] **Push feature branch**
    ```bash
    git push origin feature/task-075-5-checkboxgroup-useControllableState
    ```

---

## 📝 Notes

### Component Details

**File:** `packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx`  
**Current Lines:** ~200  
**Lines to Remove:** ~8-10  
**Lines to Add:** ~5  
**Complexity:** Low-Medium  
**Risk Level:** Low

### Hook Integration Pattern

```tsx
// Before: Manual state management
const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
const actualValue = value ?? internalValue;

const handleChange = (optionValue: string, checked: boolean) => {
  const newValue = /* ... logic ... */;
  if (value === undefined) {
    setInternalValue(newValue);
  }
  onChange?.(newValue);
};

// After: Using hook
const [selectedValues, setSelectedValues] = useControllableState({
  value,
  defaultValue: defaultValue ?? [],
  onChange
});

const handleChange = (optionValue: string, checked: boolean) => {
  const newValue = /* ... logic ... */;
  setSelectedValues(newValue);  // Hook handles everything
};
```

### Value Management

**Adding value:**

```tsx
const newValue = [...selectedValues, optionValue];
```

**Removing value:**

```tsx
const newValue = selectedValues.filter((v) => v !== optionValue);
```

**Checking if checked:**

```tsx
const isChecked = selectedValues.includes(option.value);
```

### Props Interface

```tsx
interface CheckboxGroupProps {
  // Controlled mode
  value?: string[];
  onChange?: (value: string[]) => void;

  // Uncontrolled mode
  defaultValue?: string[];

  // Other props
  options: CheckboxOption[];
  disabled?: boolean;
  required?: boolean;
  name?: string;

  // ... layout props
}

interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

### Comparison with Similar Components

**Pattern consistency:**

- ✅ CheckboxGroup (this task)
- ✅ RadioGroup (similar pattern)
- ✅ CardList (TASK-075-4)
- ✅ Input (TASK-075-2)
- ✅ Switch (already uses pattern)

All use same `useControllableState` pattern for consistency.

### Common Issues

**Issue 1: Array reference equality**

```tsx
// Hook handles this internally, but be aware:
// Arrays are compared by reference, not content
// Hook uses shallow comparison by default
```

**Issue 2: onChange not firing**

```tsx
// Hook automatically calls onChange
// Don't manually call it
const [selectedValues, setSelectedValues] = useControllableState({
  value,
  defaultValue: defaultValue ?? [],
  onChange, // ✅ Hook calls this automatically
});
```

**Issue 3: TypeScript errors**

```tsx
// Make sure types match
const [selectedValues, setSelectedValues] = useControllableState<string[]>({
  value,
  defaultValue: defaultValue ?? [],
  onChange,
});
```

---

## ✅ Definition of Done

### Code

- [ ] Manual state management removed (~8 lines)
- [ ] `useControllableState` hook integrated
- [ ] handleChange simplified
- [ ] All references updated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Clean git diff

### Tests

- [ ] All 50+ CheckboxGroup tests pass
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Multiple selection works
- [ ] onChange fires correctly

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
4. [ ] **Update TASK-075 status to completed** (this is the last subtask)
5. [ ] Celebrate! 🎉 All component refactorings complete

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
- **Previous:** TASK-075-4 (CardList Component)
- **Similar:** RadioGroup (already uses this pattern)
- **Completes:** Hook standardization initiative

---

**Final Subtask Ready for Implementation! 🚀**

**Time Estimate:** 2-3 hours  
**Difficulty:** Low-Medium  
**Risk:** Low  
**Value:** Medium-High (completes standardization, increases consistency)

**Note:** This is the last of 5 component refactorings. After completion, all priority components will use centralized hooks!
