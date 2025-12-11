# Task Template

**Task ID:** TASK-075-1  
**Title:** Refactor Select Component to Use useClickOutside Hook  
**Priority:** High  
**Status:** 🟡 Ready  
**Assigned To:** Developer  
**Estimated Time:** 3-4 hours  
**Actual Time:** _TBD_  
**Parent Task:** TASK-075 (Refactor Components to Use Centralized Hooks)  
**Blocked By:** None  
**Created:** 2025-12-10  
**Updated:** 2025-12-10  
**Completed:** _Not yet_

---

## 📋 Task Description

### Goal

Refactor the Select component to replace manual click-outside detection logic with the centralized `useClickOutside` hook, removing ~30 lines of manual event listener code while maintaining 100% backward compatibility.

### Problem/Issue

**Current State:**

The Select component manually implements click-outside detection with ~40 lines of event listener code (lines 386-420):

```tsx
// Select.tsx - Manual implementation
const handleClickOutside = (e: globalThis.MouseEvent): void => {
  if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
    if (isOpen) {
      handleClose();
    }
  }
};

useEffect(() => {
  if (!isOpen) return undefined;

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isOpen]);
```

**Problems:**

- Manual event listener management (40+ lines)
- Doesn't handle iframe edge cases
- Doesn't handle portal edge cases
- Manual cleanup logic
- Duplicates logic available in `useClickOutside` hook

### Expected Outcome

Select component uses `useClickOutside` hook:

```tsx
// After refactoring
useClickOutside(
  selectRef,
  () => {
    if (isOpen) {
      handleClose();
    }
  },
  { enabled: isOpen }
);
```

**Benefits:**

- **Code Reduction**: Remove ~30-40 lines
- **Bug Fixes**: Better iframe/portal handling
- **Maintainability**: Single source of truth
- **Performance**: Optimized event handling

---

## 🎯 Acceptance Criteria

### Functionality

- [ ] **Import useClickOutside hook**

  ```tsx
  import { useClickOutside } from '../../hooks';
  ```

- [ ] **Replace manual click outside detection**
  - Remove `handleClickOutside` function definition
  - Remove manual `useEffect` with event listeners
  - Add `useClickOutside(selectRef, handleClose, { enabled: isOpen })`

- [ ] **Preserve all existing features**
  - Dropdown opens/closes correctly
  - Clear button works
  - Search functionality works
  - Multi-select works
  - Keyboard navigation preserved (Arrow keys, Enter, Escape)
  - Disabled state works
  - Portal rendering works

- [ ] **Handle edge cases**
  - Clicks inside select don't close dropdown
  - Clicks on portal content don't close dropdown
  - Iframe clicks close dropdown correctly
  - Multiple selects on page don't interfere

### Code Quality

- [ ] Remove ~30-40 lines of manual event listener code
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper hook dependencies
- [ ] JSDoc comments preserved
- [ ] No console errors/warnings

### Testing

- [ ] All existing Select tests pass (80+ test cases)
- [ ] Click outside closes dropdown
- [ ] Click inside keeps dropdown open
- [ ] Portal clicks handled correctly
- [ ] Clearable feature works
- [ ] Searchable feature works
- [ ] Multi-select works
- [ ] Keyboard navigation works
- [ ] Disabled state works

### Validation

- [ ] Component works in Storybook
- [ ] All Select stories render correctly
- [ ] Manual testing completed
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] No accessibility regressions

---

## 📂 Files to Modify

### Primary File

**`packages/@dsai/react/src/components/Select/Select.tsx`** (~500 lines)

**Changes:**

- Line 14: Add `useClickOutside` import
- Lines 386-420: Remove manual click outside implementation
- Add: `useClickOutside` hook call (1 line)

### Test File

**`packages/@dsai/react/src/components/Select/Select.test.tsx`**

**Changes:**

- Add test for click outside with portal
- Add test for iframe edge case (optional)
- Verify existing tests still pass

---

## 🔗 Dependencies

### Prerequisites

- [x] `useClickOutside` hook available in `@dsai/react/hooks`
- [x] Comprehensive component analysis complete

### Blocks

- TASK-075-2 (Input refactor) - Independent, can proceed in parallel
- TASK-075-3 (Navbar refactor) - Independent, can proceed in parallel

---

## 🔄 Implementation Steps

### Step 1: Preparation (15 minutes)

1. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-1-select-useClickOutside
   ```

2. [ ] **Review current implementation**
   - Open `packages/@dsai/react/src/components/Select/Select.tsx`
   - Locate manual click outside code (lines 386-420)
   - Review FSM state management
   - Note all refs used

3. [ ] **Review useClickOutside hook**
   - Open `packages/@dsai/react/src/hooks/useClickOutside/useClickOutside.ts`
   - Review hook API and options
   - Understand `enabled` option
   - Note any edge cases handled

---

### Step 2: Implementation (1-2 hours)

4. [ ] **Import useClickOutside hook**

   Find line 14 where other hooks are imported:

   ```tsx
   import { cn } from '../../utils';
   import { isEnterKey, isEscapeKey } from '../../utils/keyboard';
   import { ClearIcon } from '../../utils/misc';
   ```

   Add after utilities:

   ```tsx
   import { useClickOutside } from '../../hooks';
   ```

5. [ ] **Locate manual click outside code**

   Find around line 386-420, look for:

   ```tsx
   const handleClickOutside = (e: globalThis.MouseEvent): void => {
     // ... click outside logic
   };

   useEffect(() => {
     // ... event listener setup
   }, [isOpen]);
   ```

6. [ ] **Remove manual implementation**

   Delete the entire manual implementation block:
   - Remove `handleClickOutside` function (~10 lines)
   - Remove `useEffect` for event listeners (~15 lines)
   - Remove any related variables (~5 lines)

   **Total removal:** ~30-40 lines

7. [ ] **Add useClickOutside hook call**

   Add after other hooks (near where FSM is initialized):

   ```tsx
   // Close dropdown when clicking outside
   useClickOutside(
     selectRef,
     () => {
       if (isOpen) {
         handleClose();
       }
     },
     { enabled: isOpen }
   );
   ```

   **Note:** The `enabled: isOpen` option ensures the hook only runs when dropdown is open.

8. [ ] **Verify selectRef exists**

   Make sure `selectRef` is defined earlier in the component:

   ```tsx
   const selectRef = useRef<HTMLDivElement>(null);
   ```

   If not, you may need to create it or use the existing ref.

9. [ ] **Check handleClose function**

   Verify `handleClose` function exists and dispatches close event to FSM:

   ```tsx
   const handleClose = useCallback(() => {
     dispatch(closeEvent());
   }, [dispatch]);
   ```

---

### Step 3: Testing (1 hour)

10. [ ] **Run unit tests**

    ```bash
    # Run Select tests
    pnpm nx test @dsai/react --testPathPattern=Select

    # Expected: All tests pass (80+ test cases)
    ```

11. [ ] **Test in Storybook**

    ```bash
    # Start Storybook
    pnpm nx storybook @dsai/storybook

    # Navigate to Select stories
    # Test all variants manually
    ```

12. [ ] **Manual testing checklist**
    - [ ] Open Select dropdown
    - [ ] Click outside → dropdown closes ✅
    - [ ] Click inside dropdown → stays open ✅
    - [ ] Click on option → selects and closes ✅
    - [ ] Clear button → clears selection ✅
    - [ ] Search input → filters options ✅
    - [ ] Multi-select → allows multiple selections ✅
    - [ ] Keyboard (Arrow keys) → navigates options ✅
    - [ ] Keyboard (Enter) → selects option ✅
    - [ ] Keyboard (Escape) → closes dropdown ✅
    - [ ] Disabled state → doesn't open ✅

13. [ ] **Accessibility testing**
    - [ ] Screen reader announces dropdown state
    - [ ] Focus management works correctly
    - [ ] ARIA attributes correct
    - [ ] Keyboard-only navigation works

14. [ ] **Edge case testing**
    - [ ] Test with portal rendering (if used)
    - [ ] Test with multiple selects on same page
    - [ ] Test rapid open/close
    - [ ] Test with React.StrictMode

---

### Step 4: Code Quality (30 minutes)

15. [ ] **Run TypeScript check**

    ```bash
    pnpm nx type-check @dsai/react
    # Expected: 0 errors
    ```

16. [ ] **Run linter**

    ```bash
    pnpm nx lint @dsai/react --fix
    # Expected: 0 warnings
    ```

17. [ ] **Run Codacy analysis**

    ```bash
    # Analyze Select.tsx
    codacy-cli analyze --file packages/@dsai/react/src/components/Select/Select.tsx
    # Expected: 0 issues
    ```

18. [ ] **Self code review**
    - [ ] Review git diff
    - [ ] Verify only intended changes
    - [ ] Check for TODO comments
    - [ ] Check for console.logs
    - [ ] Verify imports are clean

---

### Step 5: Documentation (15 minutes)

19. [ ] **Update inline comments**

    Add comment above hook usage:

    ```tsx
    // Close dropdown when clicking outside (using centralized hook)
    useClickOutside(
      selectRef,
      () => {
        if (isOpen) {
          handleClose();
        }
      },
      { enabled: isOpen }
    );
    ```

20. [ ] **Check if README needs updates**

    Open `packages/@dsai/react/src/components/Select/README.md`

    If it mentions click outside behavior, update to mention hook usage.

21. [ ] **Update CHANGELOG** (if not already done in parent task)

    Add entry:

    ```markdown
    ### Changed

    - **Select**: Refactored to use `useClickOutside` hook for click detection
    ```

---

### Step 6: Commit & Review (15 minutes)

22. [ ] **Stage changes**

    ```bash
    git add packages/@dsai/react/src/components/Select/Select.tsx
    git add packages/@dsai/react/src/components/Select/Select.test.tsx  # if modified
    ```

23. [ ] **Commit with conventional commit message**
    ```bash
    git commit -m "refactor(select): replace manual click outside with useClickOutside hook
    ```

- Remove ~30 lines of manual event listener code
- Better edge case handling (iframes, portals)
- Maintains 100% backward compatibility
- All 80+ tests passing

Closes TASK-075-1"
```

24. [ ] **Push feature branch**

    ```bash
    git push origin feature/task-075-1-select-useClickOutside
    ```

25. [ ] **Create PR** (if not part of larger PR)
    - Title: "refactor(select): use useClickOutside hook (TASK-075-1)"
    - Description: Link to task, list changes
    - Labels: `refactor`, `hooks`, `select`
    - Request review

---

## 📝 Notes

### Component Details

**File:** `packages/@dsai/react/src/components/Select/Select.tsx`  
**Current Lines:** ~500  
**Lines to Remove:** ~30-40  
**Lines to Add:** ~5  
**Complexity:** Medium  
**Risk Level:** Low

### Hook Configuration

```tsx
useClickOutside(selectRef, handleClose, {
  enabled: isOpen,
  // Optional: exclude specific refs if needed
  // excludeRefs: [clearButtonRef]
});
```

**Hook Options:**

- `enabled`: Only run when dropdown is open
- `detectIframe`: Automatically handles iframe clicks (default: true)
- `excludeRefs`: Array of refs to exclude from outside detection

### FSM Integration

The Select component uses FSM (Finite State Machine) for state management:

```tsx
// FSM events
- openEvent() → Opens dropdown
- closeEvent() → Closes dropdown
- selectEvent(value) → Selects option
```

**Important:** Don't modify FSM logic, only replace click outside detection.

### Common Issues

**Issue 1: Hook runs when dropdown is closed**

```tsx
// ❌ Wrong - runs always
useClickOutside(selectRef, handleClose);

// ✅ Correct - only when open
useClickOutside(selectRef, handleClose, { enabled: isOpen });
```

**Issue 2: Closes when clicking clear button**

```tsx
// If clear button causes issues, exclude its ref:
useClickOutside(selectRef, handleClose, {
  enabled: isOpen,
  excludeRefs: [clearButtonRef],
});
```

**Issue 3: TypeScript errors on ref**

```tsx
// Make sure ref type matches
const selectRef = useRef<HTMLDivElement>(null);
```

---

## ✅ Definition of Done

### Code

- [ ] Manual click outside code removed (~30-40 lines)
- [ ] `useClickOutside` hook integrated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Clean git diff (only intended changes)

### Tests

- [ ] All 80+ Select tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested with screen reader
- [ ] Edge cases verified

### Documentation

- [ ] Inline comments added
- [ ] README updated (if needed)
- [ ] CHANGELOG entry added

### Process

- [ ] Code committed with proper message
- [ ] Feature branch pushed
- [ ] PR created (if separate)
- [ ] Ready for review

---

## Post-Completion

After completing this subtask:

1. [ ] Mark task as ✅ COMPLETED
2. [ ] Update actual time spent
3. [ ] Update parent task (TASK-075) progress
4. [ ] Notify team in communication channel
5. [ ] Move to next subtask (TASK-075-2 or TASK-075-3)

---

## Rollback Plan

If issues are discovered:

```bash
# Revert commit
git revert <commit-hash>

# Or reset to before changes
git reset --hard HEAD~1

# Restore from backup
git checkout backup/task-075-pre-refactor -- packages/@dsai/react/src/components/Select/
```

---

## Related Tasks

- **Parent:** TASK-075 (Refactor Components to Use Centralized Hooks)
- **Next:** TASK-075-2 (Input Component)
- **Next:** TASK-075-3 (Navbar Component)
- **Related:** TASK-074 (Type System Standardization)

---

**Subtask Ready for Implementation! 🚀**

**Time Estimate:** 3-4 hours  
**Difficulty:** Medium  
**Risk:** Low  
**Value:** High (removes 30+ lines, better edge case handling)
