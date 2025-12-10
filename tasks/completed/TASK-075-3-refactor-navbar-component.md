# Task Template

**Task ID:** TASK-075-3  
**Title:** Refactor Navbar Component to Use useClickOutside Hook  
**Priority:** High  
**Status:** 🟡 Ready  
**Assigned To:** Developer  
**Estimated Time:** 3-4 hours  
**Actual Time:** _TBD_  
**Parent Task:** TASK-075 (Refactor Components to Use Centralized Hooks)  
**Blocked By:** None (can proceed in parallel)  
**Created:** 2025-12-10  
**Updated:** 2025-12-10  
**Completed:** _Not yet_

---

## 📋 Task Description

### Goal

Refactor the Navbar component to replace manual click-outside detection logic with the centralized `useClickOutside` hook, removing ~40 lines of complex event listener code while maintaining 100% backward compatibility and mobile menu functionality.

### Problem/Issue

**Current State:**

Navbar component manually implements click-outside detection with ~40+ lines of complex event management:

```tsx
// Manual click outside implementation
const handleClickOutside = useCallback(
  (e: globalThis.MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
      if (expanded) {
        setExpanded(false);
        onToggle?.(false);
      }
    }
  },
  [expanded, onToggle]
);

useEffect(() => {
  if (!expanded) return undefined;

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [expanded, handleClickOutside]);
```

**Problems:**

- Manual event listener management (~40 lines)
- Complex dependency tracking
- Doesn't handle iframe edge cases
- Manual cleanup logic
- Duplicates logic available in `useClickOutside` hook

### Expected Outcome

Navbar component uses `useClickOutside` hook:

```tsx
// Clean hook implementation
useClickOutside(
  navbarRef,
  () => {
    if (expanded) {
      setExpanded(false);
      onToggle?.(false);
    }
  },
  { enabled: expanded }
);
```

**Benefits:**

- **Code Reduction**: Remove ~40 lines
- **Simplification**: Single hook call replaces complex useEffect + useCallback
- **Bug Fixes**: Better iframe/portal handling
- **Maintainability**: Standard pattern across codebase

---

## 🎯 Acceptance Criteria

### Functionality

- [ ] **Import useClickOutside hook**

  ```tsx
  import { useClickOutside } from '../../hooks';
  ```

- [ ] **Replace manual click outside detection**
  - Remove `handleClickOutside` useCallback
  - Remove manual `useEffect` with event listeners
  - Add single `useClickOutside` hook call

- [ ] **Preserve all existing features**
  - Mobile menu toggle works
  - Expand/collapse animation works
  - Click outside closes mobile menu
  - Click inside keeps menu open
  - Toggle button works
  - onToggle callback fires correctly
  - Keyboard navigation works (Tab, Escape)
  - Disabled state works
  - Responsive behavior works

- [ ] **Handle edge cases**
  - Clicks inside navbar don't close menu
  - Clicks on toggle button toggle (don't just close)
  - Multiple navbars on page don't interfere
  - Rapid toggle doesn't cause issues

### Code Quality

- [ ] Remove ~40 lines of manual event listener code
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper hook dependencies
- [ ] JSDoc comments preserved
- [ ] No console errors/warnings

### Testing

- [ ] All existing Navbar tests pass (60+ test cases)
- [ ] Click outside closes mobile menu
- [ ] Click inside keeps menu open
- [ ] Toggle button works correctly
- [ ] onToggle callback fires
- [ ] Keyboard navigation works (Escape key)
- [ ] Responsive behavior works
- [ ] Animation doesn't break

### Validation

- [ ] Component works in Storybook
- [ ] All Navbar stories render correctly
- [ ] Mobile simulation tested
- [ ] Tablet simulation tested
- [ ] Desktop rendering verified
- [ ] Accessibility tested (screen reader)
- [ ] No regressions

---

## 📂 Files to Modify

### Primary File

**`packages/@dsai/react/src/components/Navbar/Navbar.tsx`** (~450 lines)

**Changes:**

- Line ~18: Add `useClickOutside` import
- Lines ~120-160: Remove `handleClickOutside` callback
- Lines ~160-175: Remove manual `useEffect` with event listeners
- Add: Single `useClickOutside` hook call (~3 lines)

### Test File

**`packages/@dsai/react/src/components/Navbar/Navbar.test.tsx`**

**Changes:**

- Add test for click outside with nested elements
- Add test for rapid toggling
- Verify existing tests still pass

---

## 🔗 Dependencies

### Prerequisites

- [x] `useClickOutside` hook available in `@dsai/react/hooks`
- [x] Comprehensive component analysis complete

### Blocks

- TASK-075-4 (CardList refactor) - Can proceed independently
- TASK-075-5 (CheckboxGroup refactor) - Can proceed independently

---

## 🔄 Implementation Steps

### Step 1: Preparation (15 minutes)

1. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-3-navbar-useClickOutside
   ```

2. [ ] **Review current Navbar implementation**
   - Open `packages/@dsai/react/src/components/Navbar/Navbar.tsx`
   - Locate manual click outside code (~lines 120-175)
   - Review expanded state management
   - Note toggle button interaction
   - Check onToggle callback usage

3. [ ] **Review useClickOutside hook**
   - Open `packages/@dsai/react/src/hooks/useClickOutside/useClickOutside.ts`
   - Review hook API and options
   - Understand `enabled` option
   - Note `excludeRefs` option (for toggle button)

---

### Step 2: Implementation (1.5-2 hours)

4. [ ] **Import useClickOutside hook**

   Find line ~18 where hooks are imported:

   ```tsx
   import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
   import { cn } from '../../utils';
   ```

   Add hook import:

   ```tsx
   import { useClickOutside } from '../../hooks';
   ```

5. [ ] **Locate manual click outside code**

   Find around lines 120-175:

   ```tsx
   // Manual implementation to remove
   const handleClickOutside = useCallback(
     (e: globalThis.MouseEvent) => {
       if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
         if (expanded) {
           setExpanded(false);
           onToggle?.(false);
         }
       }
     },
     [expanded, onToggle]
   );

   useEffect(() => {
     if (!expanded) return undefined;

     document.addEventListener('mousedown', handleClickOutside);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [expanded, handleClickOutside]);
   ```

6. [ ] **Identify toggle button ref (if exists)**

   Look for toggle button ref:

   ```tsx
   const toggleRef = useRef<HTMLButtonElement>(null);
   ```

   If it doesn't exist, we may need to create it to exclude from click outside detection.

7. [ ] **Remove manual implementation**

   Delete entire manual click outside block:
   - Remove `handleClickOutside` useCallback (~15 lines)
   - Remove event listener `useEffect` (~10 lines)
   - Remove any related variables

   **Total removal:** ~30-40 lines

8. [ ] **Add useClickOutside hook call**

   Add after expanded state management:

   ```tsx
   // Close mobile menu when clicking outside
   useClickOutside(
     navbarRef,
     () => {
       if (expanded) {
         setExpanded(false);
         onToggle?.(false);
       }
     },
     { enabled: expanded }
   );
   ```

9. [ ] **Handle toggle button exclusion (if needed)**

   If toggle button is being treated as "outside" click, exclude it:

   ```tsx
   // Create ref for toggle button if not exists
   const toggleRef = useRef<HTMLButtonElement>(null);

   // Exclude toggle button from outside clicks
   useClickOutside(navbarRef, () => {
     if (expanded) {
       setExpanded(false);
       onToggle?.(false);
     }
   }, {
     enabled: expanded,
     excludeRefs: [toggleRef]
   });

   // Add ref to toggle button in JSX
   <button ref={toggleRef} ... >
   ```

10. [ ] **Verify expanded state management**

    Ensure expanded state is properly managed:

    ```tsx
    const [expanded, setExpanded] = useState(defaultExpanded ?? false);

    const handleToggle = useCallback(() => {
      const newExpanded = !expanded;
      setExpanded(newExpanded);
      onToggle?.(newExpanded);
    }, [expanded, onToggle]);
    ```

11. [ ] **Check navbarRef exists and is used**

    Verify ref is defined and attached:

    ```tsx
    const navbarRef = useRef<HTMLDivElement>(null);

    // In JSX
    <div ref={navbarRef} className={navbarClasses}>
    ```

---

### Step 3: Testing (1 hour)

12. [ ] **Run unit tests**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=Navbar
    # Expected: All 60+ tests pass
    ```

13. [ ] **Test in Storybook**

    ```bash
    pnpm nx storybook @dsai/storybook
    # Navigate to Navbar stories
    ```

14. [ ] **Manual testing checklist - Desktop**
    - [ ] Navbar renders correctly
    - [ ] Toggle button hidden on desktop
    - [ ] All nav items visible
    - [ ] Links work correctly
    - [ ] Hover states work
    - [ ] Focus states work (keyboard navigation)

15. [ ] **Manual testing checklist - Mobile (< 992px)**
    - [ ] Toggle button visible
    - [ ] Menu collapsed by default
    - [ ] Click toggle → menu expands ✅
    - [ ] Click toggle again → menu collapses ✅
    - [ ] Click outside menu → menu collapses ✅
    - [ ] Click inside menu → stays open ✅
    - [ ] Click on nav item → navigates (menu may close based on config)
    - [ ] Escape key → closes menu ✅
    - [ ] Animation smooth
    - [ ] No layout shift

16. [ ] **Edge case testing**
    - [ ] Rapid clicking toggle button works
    - [ ] Click during animation doesn't break
    - [ ] Multiple navbars on page work independently
    - [ ] Nested clickable elements work
    - [ ] Form inputs inside navbar work

17. [ ] **Responsive testing**
    - [ ] Test at 320px width (iPhone SE)
    - [ ] Test at 768px width (iPad)
    - [ ] Test at 991px (breakpoint - 1)
    - [ ] Test at 992px (breakpoint)
    - [ ] Test at 1200px (desktop)

18. [ ] **Accessibility testing**
    - [ ] Screen reader announces menu state
    - [ ] Toggle button has proper aria-label
    - [ ] Focus management works
    - [ ] Keyboard navigation works (Tab, Shift+Tab, Escape)
    - [ ] No focus trap issues

---

### Step 4: Code Quality (30 minutes)

19. [ ] **Run TypeScript check**

    ```bash
    pnpm nx type-check @dsai/react
    ```

20. [ ] **Run linter**

    ```bash
    pnpm nx lint @dsai/react --fix
    ```

21. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/Navbar/Navbar.tsx
    ```

22. [ ] **Self code review**
    - [ ] Review git diff carefully
    - [ ] Verify only manual click outside code removed
    - [ ] Check imports are clean
    - [ ] No debug code left
    - [ ] Comments updated

---

### Step 5: Documentation (15 minutes)

23. [ ] **Update inline comments**

    Add comment above hook usage:

    ```tsx
    // Close mobile menu when clicking outside (using centralized hook)
    useClickOutside(
      navbarRef,
      () => {
        if (expanded) {
          setExpanded(false);
          onToggle?.(false);
        }
      },
      { enabled: expanded }
    );
    ```

24. [ ] **Check README for updates**

    Open `packages/@dsai/react/src/components/Navbar/README.md`

    If it mentions click outside behavior, update to reference hook usage.

25. [ ] **Update CHANGELOG** (if not done in parent task)

    ```markdown
    ### Changed

    - **Navbar**: Refactored to use `useClickOutside` hook for mobile menu
    ```

---

### Step 6: Commit & Review (15 minutes)

26. [ ] **Stage changes**

    ```bash
    git add packages/@dsai/react/src/components/Navbar/
    ```

27. [ ] **Commit with conventional commit**
    ```bash
    git commit -m "refactor(navbar): replace manual click outside with useClickOutside hook
    ```

- Remove ~40 lines of complex event listener code
- Simplify click outside detection with single hook call
- Better edge case handling (iframes, rapid clicks)
- Maintains 100% backward compatibility
- All 60+ tests passing
- Mobile menu functionality preserved

Closes TASK-075-3"
```

28. [ ] **Push feature branch**
    ```bash
    git push origin feature/task-075-3-navbar-useClickOutside
    ```

---

## 📝 Notes

### Component Details

**File:** `packages/@dsai/react/src/components/Navbar/Navbar.tsx`  
**Current Lines:** ~450  
**Lines to Remove:** ~30-40  
**Lines to Add:** ~3-5  
**Complexity:** Medium  
**Risk Level:** Low-Medium

### Mobile Menu State Management

The Navbar uses `expanded` state to control mobile menu visibility:

```tsx
// State
const [expanded, setExpanded] = useState(defaultExpanded ?? false);

// Toggle handler
const handleToggle = () => {
  const newExpanded = !expanded;
  setExpanded(newExpanded);
  onToggle?.(newExpanded);
};

// Hook integration
useClickOutside(
  navbarRef,
  () => {
    if (expanded) {
      setExpanded(false);
      onToggle?.(false);
    }
  },
  { enabled: expanded }
);
```

### Responsive Behavior

**Breakpoint:** 992px (Bootstrap 5 `lg` breakpoint)

- **< 992px (Mobile/Tablet):**
  - Toggle button visible
  - Menu collapsible
  - Click outside closes menu
  - useClickOutside active

- **≥ 992px (Desktop):**
  - Toggle button hidden
  - Menu always visible
  - Click outside not relevant
  - useClickOutside disabled (expanded always false)

### Common Issues

**Issue 1: Toggle button closes menu**

```tsx
// Problem: Toggle button is outside navbarRef
// Solution: Exclude toggle button ref

useClickOutside(navbarRef, handleClose, {
  enabled: expanded,
  excludeRefs: [toggleRef], // Exclude toggle button
});
```

**Issue 2: Hook runs on desktop**

```tsx
// Problem: Hook active when not needed
// Solution: Only enable when mobile menu is expanded

useClickOutside(navbarRef, handleClose, {
  enabled: expanded, // Only true on mobile when open
});
```

**Issue 3: Animation interrupted**

```tsx
// Hook respects expanded state
// Animation controlled by CSS, not affected by hook
```

### Toggle Button Ref

If toggle button needs exclusion:

```tsx
// 1. Create ref
const toggleRef = useRef<HTMLButtonElement>(null);

// 2. Attach to button
<button
  ref={toggleRef}
  className="navbar-toggler"
  onClick={handleToggle}
  aria-label="Toggle navigation"
>
  <span className="navbar-toggler-icon" />
</button>;

// 3. Exclude from click outside
useClickOutside(navbarRef, handleClose, {
  enabled: expanded,
  excludeRefs: [toggleRef],
});
```

---

## ✅ Definition of Done

### Code

- [ ] Manual click outside code removed (~40 lines)
- [ ] `useClickOutside` hook integrated
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Clean git diff

### Tests

- [ ] All 60+ Navbar tests pass
- [ ] Manual testing on mobile completed
- [ ] Responsive behavior verified
- [ ] Accessibility tested
- [ ] Edge cases verified

### Documentation

- [ ] Inline comments added
- [ ] README updated (if needed)
- [ ] CHANGELOG entry added

### Process

- [ ] Code committed
- [ ] Feature branch pushed
- [ ] Ready for review

---

## Post-Completion

1. [ ] Mark task as ✅ COMPLETED
2. [ ] Update actual time spent
3. [ ] Update parent task (TASK-075) progress
4. [ ] Test on actual mobile device (optional but recommended)
5. [ ] Move to next subtask (TASK-075-4)

---

## Rollback Plan

```bash
# Revert commit
git revert <commit-hash>

# Or reset
git reset --hard HEAD~1

# Restore from backup
git checkout backup/task-075-pre-refactor -- packages/@dsai/react/src/components/Navbar/
```

---

## Related Tasks

- **Parent:** TASK-075 (Refactor Components to Use Centralized Hooks)
- **Previous:** TASK-075-2 (Input Component)
- **Next:** TASK-075-4 (CardList Component)
- **Similar:** TASK-075-1 (Select Component - same hook)

---

**Subtask Ready for Implementation! 🚀**

**Time Estimate:** 3-4 hours  
**Difficulty:** Medium  
**Risk:** Low-Medium  
**Value:** High (removes 40+ lines, simplifies mobile menu logic)
