# Task Template

**Task ID:** TASK-075  
**Title:** Refactor Components to Use Centralized Hooks  
**Priority:** High  
**Status:** 🟡 Ready  
**Assigned To:** Developer  
**Estimated Time:** 4-6 days  
**Actual Time:** _TBD_  
**Parent Task:** TASK-074 (Type System Standardization)  
**Blocked By:** None (TASK-074 completed)  
**Created:** 2025-12-10  
**Updated:** 2025-12-10  
**Completed:** _Not yet_

---

## 📋 Task Description

### Goal

Refactor 5 priority components to use centralized hooks from `@dsai/react/hooks`, removing manual implementations and improving code maintainability while preserving 100% backward compatibility and functionality.

### Problem/Issue

**Current State:**

Based on comprehensive component analysis (see `tasks/01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md`):

1. **Hook Underutilization**: Only 1 of 33 components uses centralized hooks (Modal)
2. **Manual Implementations**: Components manually implement:
   - Click outside detection (Select, Navbar, Dropdown, Popover)
   - Controlled/uncontrolled state (Input, CardList, CheckboxGroup, RadioGroup, Switch)
   - Intersection observers (Scrollspy)
   - Keyboard event handling (multiple components)
3. **Code Duplication**: Same patterns repeated across multiple components
4. **Maintenance Burden**: 30-50+ lines of manual event listener code per component

**Examples of Manual Implementation:**

```tsx
// Select.tsx - Manual click outside (40+ lines)
useEffect(() => {
  const handleClickOutside = (e: globalThis.MouseEvent): void => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

// Could be replaced with:
useClickOutside(selectRef, () => setIsOpen(false));
```

**Available Hooks Not Being Used:**

- `useClickOutside` - Click detection outside element (23 hooks available total)
- `useControllableState` - Controlled/uncontrolled pattern
- `useKeyPress` - Keyboard event handling
- `useIntersectionObserver` - Visibility detection
- `useHover` - Hover state management
- `useDebounce` - Value debouncing
- `useField` - Form field integration

### Expected Outcome

**5 Priority Components Refactored:**

1. **Select** → useClickOutside, useControllableState
2. **Input** → useField, useControllableState, useDebounce
3. **Navbar** → useClickOutside, useMediaQuery
4. **CardList** → useControllableState
5. **CheckboxGroup** → useControllableState

**Benefits:**

- **Code Reduction**: Remove 150-200+ lines of manual implementation code
- **Bug Fixes**: Hooks handle edge cases (iframes, portals, cleanup)
- **Consistency**: Standard patterns across all components
- **Maintainability**: Single source of truth for common patterns
- **Performance**: Optimized hook implementations
- **Type Safety**: Better TypeScript inference with hooks

**Success Metrics:**

- ✅ 100% backward compatibility (all existing tests pass)
- ✅ 0 breaking changes to component APIs
- ✅ Code reduction: 150-200 lines removed
- ✅ Test coverage maintained at 90%+
- ✅ All accessibility features preserved
- ✅ Bundle size unchanged or improved

---

## 🎯 Acceptance Criteria

### Phase 1: Select Component → useClickOutside ✅ HIGH VALUE

**Files to Modify:**

- `packages/@dsai/react/src/components/Select/Select.tsx`

**Changes Required:**

- [ ] **Import useClickOutside hook**

  ```tsx
  import { useClickOutside } from '../../hooks';
  ```

- [ ] **Replace manual click outside detection** (Lines ~386-400)

  ```tsx
  // BEFORE: Manual implementation
  const handleClickOutside = (e: globalThis.MouseEvent): void => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      if (isOpen) {
        handleClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // AFTER: Using hook
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

- [ ] **Remove manual event listener code** (~30 lines)
- [ ] **Keep all existing FSM logic** (no changes to state management)
- [ ] **Verify clearable/searchable features work**
- [ ] **Test multi-select functionality**

**Validation:**

- [ ] All existing Select tests pass (80+ test cases)
- [ ] Click outside closes dropdown
- [ ] Portal clicks handled correctly
- [ ] Iframe edge cases work
- [ ] Clearable feature works
- [ ] Searchable feature works
- [ ] Multi-select works
- [ ] Keyboard navigation preserved
- [ ] Screen reader compatibility maintained

**Estimated Time:** 3-4 hours

---

### Phase 1: Input Component → useField + useControllableState ✅ HIGH VALUE

**Files to Modify:**

- `packages/@dsai/react/src/components/Input/Input.tsx`
- `packages/@dsai/react/src/components/Input/Input.types.ts`

**Changes Required:**

- [ ] **Add optional useField integration support**

  ```tsx
  import { useField, useControllableState, useDebounce } from '../../hooks';

  export interface InputProps {
    // ... existing props
    name?: string; // For form integration
    validate?: (value: string) => string | undefined; // Validation function
    debounceMs?: number; // Debounce delay
  }
  ```

- [ ] **Implement optional form field integration**

  ```tsx
  const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
      value: valueProp,
      defaultValue,
      onChange: onChangeProp,
      name,
      validate,
      debounceMs = 0,
      error: errorProp,
      ...rest
    } = props;

    // Optional form integration
    const fieldState = name && validate ? useField(name, { validate }) : null;

    // Controlled/uncontrolled state
    const [value, setValue] = useControllableState({
      value: fieldState?.value ?? valueProp,
      defaultValue,
      onChange: (newValue) => {
        onChangeProp?.(newValue);
        fieldState?.setValue(newValue);
      },
    });

    // Optional debouncing
    const debouncedValue = useDebounce(value, debounceMs);

    // Error from field or prop
    const error = fieldState?.error ?? errorProp;

    // ... rest of component
  });
  ```

- [ ] **Keep all existing features working**
  - Clear button
  - Input masks
  - Validation
  - States (success, error, warning)

**Validation:**

- [ ] All existing Input tests pass (100+ test cases)
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Form integration works (new feature)
- [ ] Debouncing works (new feature)
- [ ] Clear button works
- [ ] Input masks work
- [ ] Validation feedback works
- [ ] Error states work
- [ ] Accessibility maintained

**Estimated Time:** 4-5 hours

---

### Phase 1: Navbar Component → useClickOutside ✅ HIGH VALUE

**Files to Modify:**

- `packages/@dsai/react/src/components/Navbar/Navbar.tsx`

**Changes Required:**

- [ ] **Import useClickOutside hook**

  ```tsx
  import { useClickOutside } from '../../hooks';
  ```

- [ ] **Replace manual outside click detection** (Lines ~600-650)

  ```tsx
  // BEFORE: Complex manual implementation
  useEffect(() => {
    if (!expanded) return undefined;

    const listener = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (navbarRef.current && !navbarRef.current.contains(target)) {
        dispatch(collapseEvent());
      }
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [expanded]);

  // AFTER: Using hook
  useClickOutside(
    navbarRef,
    () => {
      dispatch(collapseEvent());
    },
    { enabled: expanded }
  );
  ```

- [ ] **Remove manual event listener management** (~40 lines)
- [ ] **Keep all keyboard navigation** (Escape key)
- [ ] **Preserve all FSM state management**
- [ ] **Maintain responsive behavior**

**Validation:**

- [ ] All existing Navbar tests pass (60+ test cases)
- [ ] Click outside collapses navbar
- [ ] Escape key collapses navbar
- [ ] Toggle button works
- [ ] Navigation links work
- [ ] Dropdown menus work
- [ ] Mobile responsive behavior works
- [ ] Screen reader compatibility maintained

**Estimated Time:** 3-4 hours

---

### Phase 2: CardList Component → useControllableState 🔄 MEDIUM VALUE

**Files to Modify:**

- `packages/@dsai/react/src/components/CardList/CardList.tsx`

**Changes Required:**

- [ ] **Import useControllableState hook**

  ```tsx
  import { useControllableState } from '../../hooks';
  ```

- [ ] **Replace manual controlled/uncontrolled logic** (Lines ~50-80)

  ```tsx
  // BEFORE: Manual implementation
  const [internalValue, setInternalValue] = useState(defaultValue);
  const actualValue = value !== undefined ? value : internalValue;

  const handleChange = (newValue: string | string[]) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // AFTER: Using hook
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  ```

- [ ] **Keep all FSM logic for selection state**
- [ ] **Preserve single/multiple selection modes**
- [ ] **Maintain keyboard navigation**

**Validation:**

- [ ] All existing CardList tests pass (50+ test cases)
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Single selection works
- [ ] Multiple selection works
- [ ] onChange callbacks fire correctly
- [ ] Selection state persists
- [ ] Keyboard selection works

**Estimated Time:** 2-3 hours

---

### Phase 2: CheckboxGroup Component → useControllableState 🔄 MEDIUM VALUE

**Files to Modify:**

- `packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx`

**Changes Required:**

- [ ] **Import useControllableState hook**

  ```tsx
  import { useControllableState } from '../../hooks';
  ```

- [ ] **Replace manual state management** (Lines ~40-60)

  ```tsx
  // BEFORE: Manual implementation
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  const actualValue = value ?? internalValue;

  const handleChange = (checked: boolean, itemValue: string) => {
    const newValue = checked
      ? [...actualValue, itemValue]
      : actualValue.filter((v) => v !== itemValue);

    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  // AFTER: Using hook
  const [checkedValues, setCheckedValues] = useControllableState({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });

  const handleChange = (checked: boolean, itemValue: string) => {
    const newValue = checked
      ? [...checkedValues, itemValue]
      : checkedValues.filter((v) => v !== itemValue);
    setCheckedValues(newValue);
  };
  ```

- [ ] **Preserve all validation logic**
- [ ] **Maintain error/helper text display**
- [ ] **Keep accessibility features**

**Validation:**

- [ ] All existing CheckboxGroup tests pass (40+ test cases)
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Multi-select works
- [ ] onChange callbacks fire correctly
- [ ] Validation works
- [ ] Error states display
- [ ] Required field validation works
- [ ] Accessibility maintained

**Estimated Time:** 2-3 hours

---

### Code Quality Standards

**All Phases:**

- [ ] **TypeScript**: No `any` types, strict mode enabled
- [ ] **Imports**: Only import needed hooks
- [ ] **Comments**: Document hook usage with JSDoc
- [ ] **Error Handling**: Preserve all existing error handling
- [ ] **Performance**: No unnecessary re-renders introduced
- [ ] **Bundle Size**: Hooks are tree-shakeable, no size increase

**Hook Usage Patterns:**

```tsx
// ✅ GOOD: Conditional hook usage with proper deps
const clickOutsideEnabled = isOpen && !disabled;
useClickOutside(ref, handleClose, { enabled: clickOutsideEnabled });

// ❌ BAD: Conditional hook call (violates Rules of Hooks)
if (isOpen) {
  useClickOutside(ref, handleClose); // WRONG!
}

// ✅ GOOD: Controlled/uncontrolled with proper onChange
const [value, setValue] = useControllableState({
  value: valueProp,
  defaultValue,
  onChange: (newValue) => {
    onChangeProp?.(newValue);
    // Additional side effects
  },
});

// ✅ GOOD: Form integration (optional)
const fieldState = name ? useField(name, { validate }) : null;
const value = fieldState?.value ?? valueProp;
```

---

### Testing Requirements

**For Each Component:**

- [ ] **Unit Tests**: All existing tests pass (400+ tests total)
- [ ] **Integration Tests**: Components work in Storybook
- [ ] **Accessibility Tests**: jest-axe tests pass
- [ ] **Manual Testing**: Screen reader tested
- [ ] **Performance Tests**: No regression in render performance
- [ ] **Visual Tests**: No visual changes (pixel-perfect)

**New Tests to Add:**

- [ ] Test hook integration (new test cases)
- [ ] Test edge cases (iframes, portals, cleanup)
- [ ] Test hook options (enabled, debounce, etc.)

**Test Coverage Target:**

- Maintain 90%+ coverage for all components
- Add tests for new hook integration points
- Test both controlled and uncontrolled modes

---

### Accessibility Requirements

**Must Maintain:**

- [ ] Keyboard navigation (Tab, Enter, Escape, Arrows)
- [ ] Screen reader compatibility (ARIA labels, roles)
- [ ] Focus management (visible focus, trap, restore)
- [ ] Color contrast (WCAG 2.2 AA)
- [ ] Error announcements (aria-live regions)
- [ ] Form labels (proper associations)

**Validation:**

- [ ] Run jest-axe on all modified components
- [ ] Manual test with screen reader (NVDA or VoiceOver)
- [ ] Verify keyboard-only navigation works
- [ ] Check focus indicators visible

---

## 📂 Files to Modify

### Phase 1 Files (High Priority)

1. **Select Component**
   - `packages/@dsai/react/src/components/Select/Select.tsx` (~500 lines, remove ~30)
   - `packages/@dsai/react/src/components/Select/Select.test.tsx` (add hook tests)

2. **Input Component**
   - `packages/@dsai/react/src/components/Input/Input.tsx` (~400 lines, add ~20)
   - `packages/@dsai/react/src/components/Input/Input.types.ts` (add new props)
   - `packages/@dsai/react/src/components/Input/Input.test.tsx` (add hook tests)

3. **Navbar Component**
   - `packages/@dsai/react/src/components/Navbar/Navbar.tsx` (~800 lines, remove ~40)
   - `packages/@dsai/react/src/components/Navbar/Navbar.test.tsx` (add hook tests)

### Phase 2 Files (Medium Priority)

4. **CardList Component**
   - `packages/@dsai/react/src/components/CardList/CardList.tsx` (~300 lines, remove ~20)
   - `packages/@dsai/react/src/components/CardList/CardList.test.tsx` (add hook tests)

5. **CheckboxGroup Component**
   - `packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx` (~200 lines, remove ~15)
   - `packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.test.tsx` (add hook tests)

### Documentation Files

6. **Update Component Documentation**
   - Each component's README.md (add hook usage examples)
   - Storybook stories (add new hook-based examples)

---

## 🔗 Dependencies

### Prerequisites

- [x] TASK-074-1: Centralized types created
- [x] TASK-074-2: Components refactored to use types
- [x] TASK-074-3: Package exports updated
- [x] Comprehensive component analysis complete

### Hooks Available (From `@dsai/react/hooks`)

**Accessibility:**

- `useFocusTrap` - Focus management
- `useReducedMotion` - Motion preferences

**UI:**

- ✅ `useScrollLock` - Body scroll lock (used in Modal)
- ✅ `useMediaQuery` - Responsive breakpoints
- `useIsMobile`, `useIsTablet`, `useIsDesktop`, `useIsLargeDesktop`

**State:**

- 🔧 `useControllableState` - **Primary hook for this task**
- `usePrevious` - Track previous value
- `useLocalStorage` - Persist to localStorage
- `useSessionStorage` - Persist to sessionStorage
- 🔧 `useDebounce` - **Used in Input**
- `useThrottle` - Throttle value changes

**Form:**

- 🔧 `useField` - **Used in Input for form integration**
- `useForm` - Complete form state management

**Event:**

- 🔧 `useClickOutside` - **Primary hook for this task**
- `useKeyPress` - Keyboard event handling
- `useHover` - Hover state detection
- `useIntersectionObserver` - Visibility detection
- `useResizeObserver` - Size change detection

**Utility:**

- `useMounted` - Track mount state
- `useCallbackRef` - Stable callback refs
- `useAsync` - Async operation state
- `useId` - SSR-safe ID generation
- `useDarkMode` - Dark mode state

### Blocks

- TASK-074-4: Documentation (can proceed in parallel)

---

## 🔄 Implementation Steps

### Pre-Implementation (Day 1 - Morning, 2 hours)

1. [ ] **Review comprehensive analysis document**
   - Read `tasks/01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md`
   - Understand each component's current implementation
   - Note edge cases and special requirements

2. [ ] **Review hook documentation**
   - Read `packages/@dsai/react/src/hooks/README.md`
   - Understand hook APIs and options
   - Review hook tests for usage examples

3. [ ] **Create test baseline**

   ```bash
   # Run all tests before changes
   pnpm nx test @dsai/react --coverage
   # Save coverage report
   cp -r coverage/packages/@dsai/react baseline-coverage/
   ```

4. [ ] **Create backup branch**
   ```bash
   git checkout -b backup/task-075-pre-refactor
   git push origin backup/task-075-pre-refactor
   ```

---

### Phase 1: Select Component (Day 1 - Afternoon, 3-4 hours)

5. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-select-hooks
   ```

6. [ ] **Read current Select implementation**
   - Identify manual click outside code (lines 386-420)
   - Note all event listeners
   - Document cleanup logic
   - Review FSM state management

7. [ ] **Import useClickOutside hook**

   ```tsx
   import { useClickOutside } from '../../hooks';
   ```

8. [ ] **Replace manual click outside detection**
   - Remove `handleClickOutside` function
   - Remove `useEffect` for event listeners
   - Add `useClickOutside(selectRef, handleClose, { enabled: isOpen })`
   - Verify ref is passed correctly

9. [ ] **Test Select component**

   ```bash
   # Run unit tests
   pnpm nx test @dsai/react --testPathPattern=Select

   # Run in Storybook
   pnpm nx storybook @dsai/storybook
   ```

10. [ ] **Verify all Select features**
    - Click outside closes dropdown
    - Clearable button works
    - Searchable input works
    - Multi-select works
    - Keyboard navigation works
    - Disabled state works
    - Portal rendering works

11. [ ] **Run Codacy analysis**

    ```bash
    # Analyze Select.tsx
    codacy-cli analyze --file packages/@dsai/react/src/components/Select/Select.tsx
    ```

12. [ ] **Commit Select changes**
    ```bash
    git add .
    git commit -m "refactor(select): replace manual click outside with useClickOutside hook"
    ```

---

### Phase 1: Input Component (Day 2 - Full Day, 4-5 hours)

13. [ ] **Create feature branch**

    ```bash
    git checkout main
    git checkout -b feature/task-075-input-hooks
    ```

14. [ ] **Read current Input implementation**
    - Identify state management (controlled/uncontrolled)
    - Note validation logic
    - Review clear button implementation
    - Document onChange handling

15. [ ] **Update Input types**

    ```tsx
    // Input.types.ts
    export interface InputProps {
      // ... existing props
      name?: string; // For form integration
      validate?: (value: string) => string | undefined;
      debounceMs?: number; // Debounce delay (optional)
    }
    ```

16. [ ] **Import hooks**

    ```tsx
    import { useField, useControllableState, useDebounce } from '../../hooks';
    ```

17. [ ] **Implement optional form integration**

    ```tsx
    // Optional form field integration
    const fieldState = name && validate ? useField(name, { validate }) : null;
    ```

18. [ ] **Replace state management with useControllableState**

    ```tsx
    const [value, setValue] = useControllableState({
      value: fieldState?.value ?? valueProp,
      defaultValue,
      onChange: (newValue) => {
        onChangeProp?.(newValue);
        fieldState?.setValue(newValue);
      },
    });
    ```

19. [ ] **Add optional debouncing**

    ```tsx
    const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
    ```

20. [ ] **Test Input component**

    ```bash
    # Run unit tests
    pnpm nx test @dsai/react --testPathPattern=Input

    # Test in Storybook
    pnpm nx storybook @dsai/storybook
    ```

21. [ ] **Verify all Input features**
    - Controlled mode works
    - Uncontrolled mode works
    - Form integration works (new)
    - Debouncing works (new)
    - Clear button works
    - Input masks work
    - Validation feedback works
    - Error states work
    - Helper text displays

22. [ ] **Add new tests for hook integration**

    ```tsx
    // Input.test.tsx
    describe('Input with useField integration', () => {
      it('integrates with form field', () => { ... });
      it('validates on change', () => { ... });
      it('shows field errors', () => { ... });
    });

    describe('Input with debounce', () => {
      it('debounces onChange', () => { ... });
      it('respects debounceMs prop', () => { ... });
    });
    ```

23. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/Input/Input.tsx
    ```

24. [ ] **Commit Input changes**
    ```bash
    git add .
    git commit -m "feat(input): add useField, useControllableState, and useDebounce integration"
    ```

---

### Phase 1: Navbar Component (Day 3 - Morning, 3-4 hours)

25. [ ] **Create feature branch**

    ```bash
    git checkout main
    git checkout -b feature/task-075-navbar-hooks
    ```

26. [ ] **Read current Navbar implementation**
    - Identify manual click outside code (lines 600-650)
    - Note keyboard event handling (Escape key)
    - Review FSM for expand/collapse
    - Document responsive behavior

27. [ ] **Import useClickOutside hook**

    ```tsx
    import { useClickOutside } from '../../hooks';
    ```

28. [ ] **Replace manual outside click detection**
    - Remove manual `useEffect` with event listeners
    - Remove cleanup logic
    - Add `useClickOutside(navbarRef, () => dispatch(collapseEvent()), { enabled: expanded })`

29. [ ] **Verify keyboard handling preserved**
    - Escape key still works
    - Focus management intact
    - Keyboard navigation preserved

30. [ ] **Test Navbar component**

    ```bash
    # Run unit tests
    pnpm nx test @dsai/react --testPathPattern=Navbar

    # Test in Storybook
    pnpm nx storybook @dsai/storybook
    ```

31. [ ] **Verify all Navbar features**
    - Click outside collapses navbar
    - Escape key collapses navbar
    - Toggle button works
    - Navigation links work
    - Dropdown menus work
    - Mobile responsive behavior
    - Tablet responsive behavior
    - Desktop responsive behavior

32. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/Navbar/Navbar.tsx
    ```

33. [ ] **Commit Navbar changes**
    ```bash
    git add .
    git commit -m "refactor(navbar): replace manual click outside with useClickOutside hook"
    ```

---

### Phase 2: CardList Component (Day 3 - Afternoon, 2-3 hours)

34. [ ] **Create feature branch**

    ```bash
    git checkout main
    git checkout -b feature/task-075-cardlist-hooks
    ```

35. [ ] **Read current CardList implementation**
    - Identify manual controlled/uncontrolled logic
    - Note selection state management (FSM)
    - Review single/multiple selection modes
    - Document onChange handling

36. [ ] **Import useControllableState hook**

    ```tsx
    import { useControllableState } from '../../hooks';
    ```

37. [ ] **Replace state management**

    ```tsx
    const [selectedValue, setSelectedValue] = useControllableState({
      value,
      defaultValue,
      onChange,
    });
    ```

38. [ ] **Update FSM to use hook state**
    - Pass `selectedValue` to FSM
    - Call `setSelectedValue` in FSM callbacks
    - Preserve all selection logic

39. [ ] **Test CardList component**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=CardList
    ```

40. [ ] **Verify all CardList features**
    - Controlled mode works
    - Uncontrolled mode works
    - Single selection works
    - Multiple selection works
    - onChange fires correctly
    - Selection persists
    - Keyboard selection works
    - Disabled cards work

41. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/CardList/CardList.tsx
    ```

42. [ ] **Commit CardList changes**
    ```bash
    git add .
    git commit -m "refactor(cardlist): use useControllableState for state management"
    ```

---

### Phase 2: CheckboxGroup Component (Day 4 - Morning, 2-3 hours)

43. [ ] **Create feature branch**

    ```bash
    git checkout main
    git checkout -b feature/task-075-checkboxgroup-hooks
    ```

44. [ ] **Read current CheckboxGroup implementation**
    - Identify manual state management
    - Note array handling (checked values)
    - Review validation logic
    - Document error display

45. [ ] **Import useControllableState hook**

    ```tsx
    import { useControllableState } from '../../hooks';
    ```

46. [ ] **Replace state management**

    ```tsx
    const [checkedValues, setCheckedValues] = useControllableState({
      value,
      defaultValue: defaultValue ?? [],
      onChange,
    });
    ```

47. [ ] **Update checkbox change handler**

    ```tsx
    const handleChange = (checked: boolean, itemValue: string) => {
      const newValue = checked
        ? [...checkedValues, itemValue]
        : checkedValues.filter((v) => v !== itemValue);
      setCheckedValues(newValue);
    };
    ```

48. [ ] **Test CheckboxGroup component**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=CheckboxGroup
    ```

49. [ ] **Verify all CheckboxGroup features**
    - Controlled mode works
    - Uncontrolled mode works
    - Multi-select works
    - onChange fires correctly
    - Validation works
    - Error states display
    - Required validation works
    - Helper text displays

50. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/CheckboxGroup/CheckboxGroup.tsx
    ```

51. [ ] **Commit CheckboxGroup changes**
    ```bash
    git add .
    git commit -m "refactor(checkboxgroup): use useControllableState for value management"
    ```

---

### Testing & Validation (Day 4 - Afternoon, 2-3 hours)

52. [ ] **Run full test suite**

    ```bash
    # All tests
    pnpm nx test @dsai/react --coverage

    # Compare with baseline
    diff -r baseline-coverage/ coverage/packages/@dsai/react/
    ```

53. [ ] **Verify coverage maintained**
    - Overall coverage: 90%+ ✅
    - Modified components: 90%+ ✅
    - New hook integration: covered ✅

54. [ ] **Run accessibility tests**

    ```bash
    # A11y tests for modified components
    pnpm nx test @dsai/react --testPathPattern="(Select|Input|Navbar|CardList|CheckboxGroup).a11y"
    ```

55. [ ] **Manual accessibility testing**
    - [ ] Test Select with NVDA/VoiceOver
    - [ ] Test Input with keyboard only
    - [ ] Test Navbar with screen reader
    - [ ] Test CardList with keyboard
    - [ ] Test CheckboxGroup with screen reader

56. [ ] **Performance testing**

    ```bash
    # Build and check bundle size
    pnpm nx build @dsai/react

    # Compare bundle sizes
    ls -lh dist/packages/@dsai/react/
    ```

57. [ ] **Visual regression testing**
    - [ ] Open Storybook for each component
    - [ ] Verify no visual changes
    - [ ] Test all variants
    - [ ] Test all states
    - [ ] Test responsive breakpoints

58. [ ] **Integration testing**
    - [ ] Test in playground app
    - [ ] Test with real forms
    - [ ] Test with real user interactions
    - [ ] Verify no console errors/warnings

---

### Documentation (Day 5 - Morning, 2-3 hours)

59. [ ] **Update component READMEs**

    For each component, add hook usage section:

    ```markdown
    ## Hook Integration

    This component uses the following hooks from `@dsai/react`:

    - `useClickOutside` - Handles click detection outside the component
    - `useControllableState` - Manages controlled/uncontrolled state pattern

    ### Example: Controlled Mode

    \`\`\`tsx
    const [value, setValue] = useState('');

    <Input 
      value={value} 
      onChange={setValue}
    />
    \`\`\`

    ### Example: Uncontrolled Mode

    \`\`\`tsx
    <Input
    defaultValue="initial"
    onChange={(value) => console.log(value)}
    />
    \`\`\`

    ### Example: Form Integration

    \`\`\`tsx
    <Input
    name="email"
    validate={(value) => {
    if (!value.includes('@')) return 'Invalid email';
    }}
    />
    \`\`\`
    ```

60. [ ] **Update Storybook stories**

    Add new stories demonstrating hook features:

    ```tsx
    // Input.stories.tsx
    export const WithFormIntegration: Story = {
      args: {
        name: 'email',
        validate: (value: string) => {
          if (!value.includes('@')) return 'Invalid email';
        },
      },
    };

    export const WithDebounce: Story = {
      args: {
        debounceMs: 500,
        onChange: (value) => console.log('Debounced:', value),
      },
    };
    ```

61. [ ] **Create migration guide**

    Create `docs/HOOK-MIGRATION-GUIDE.md`:

    ```markdown
    # Hook Migration Guide

    ## Overview

    This guide explains the hook refactoring in TASK-075.

    ## What Changed

    ### Select Component

    - Manual click outside → `useClickOutside` hook
    - Code reduction: ~30 lines
    - Better edge case handling (iframes, portals)

    ### Input Component

    - Added `useField` integration (optional)
    - Added `useControllableState` for state management
    - Added `useDebounce` support (optional)
    - New props: `name`, `validate`, `debounceMs`

    ...
    ```

62. [ ] **Update CHANGELOG**

    ```markdown
    ## [Unreleased]

    ### Changed

    - **Select**: Refactored to use `useClickOutside` hook for click detection
    - **Navbar**: Refactored to use `useClickOutside` hook for collapse behavior
    - **CardList**: Refactored to use `useControllableState` for state management
    - **CheckboxGroup**: Refactored to use `useControllableState` for value management

    ### Added

    - **Input**: New optional form integration with `useField` hook
    - **Input**: New optional debouncing with `debounceMs` prop
    - **Input**: New props `name` and `validate` for form integration

    ### Fixed

    - **Select**: Better click outside detection for iframe and portal edge cases
    - **Navbar**: Improved outside click detection and cleanup
    ```

---

### Review & Merge (Day 5 - Afternoon, 2-3 hours)

63. [ ] **Self code review**
    - [ ] Review all changes in diff
    - [ ] Check for any TODO comments
    - [ ] Verify no console.logs left
    - [ ] Check for any debugging code
    - [ ] Verify all tests pass
    - [ ] Check TypeScript compilation
    - [ ] Run linter

64. [ ] **Run final validation**

    ```bash
    # TypeScript check
    pnpm nx type-check @dsai/react

    # Linting
    pnpm nx lint @dsai/react

    # All tests
    pnpm nx test @dsai/react --coverage

    # Build
    pnpm nx build @dsai/react

    # Codacy analysis
    codacy-cli analyze --repository michelve/dsai
    ```

65. [ ] **Merge feature branches**

    ```bash
    # Merge all feature branches to main
    git checkout main
    git merge feature/task-075-select-hooks
    git merge feature/task-075-input-hooks
    git merge feature/task-075-navbar-hooks
    git merge feature/task-075-cardlist-hooks
    git merge feature/task-075-checkboxgroup-hooks
    ```

66. [ ] **Create pull request**
    - Title: "refactor: migrate components to use centralized hooks (TASK-075)"
    - Description: Link to task and analysis
    - Labels: `refactor`, `hooks`, `high-priority`
    - Reviewers: Assign team members

67. [ ] **Address review feedback**
    - Make requested changes
    - Re-run tests
    - Update documentation
    - Re-request review

68. [ ] **Final merge to main**
    ```bash
    git checkout main
    git pull origin main
    git push origin main
    ```

---

### Post-Completion (Day 6 - Morning, 1 hour)

69. [ ] **Update task status**
    - Mark task as ✅ COMPLETED
    - Add completion date
    - Add actual time spent
    - Add completion summary

70. [ ] **Move task file**

    ```bash
    git mv tasks/02-high/TASK-075-refactor-components-to-use-centralized-hooks.md \
            tasks/completed/TASK-075-refactor-components-to-use-centralized-hooks.md
    ```

71. [ ] **Update progress tracking**
    - Update component refactoring progress
    - Update hook adoption metrics
    - Document lessons learned

72. [ ] **Notify team**
    - Post in team chat
    - Share metrics (lines removed, coverage maintained)
    - Share migration guide

73. [ ] **Clean up branches**

    ```bash
    # Delete feature branches (local)
    git branch -d feature/task-075-select-hooks
    git branch -d feature/task-075-input-hooks
    git branch -d feature/task-075-navbar-hooks
    git branch -d feature/task-075-cardlist-hooks
    git branch -d feature/task-075-checkboxgroup-hooks

    # Delete feature branches (remote)
    git push origin --delete feature/task-075-select-hooks
    git push origin --delete feature/task-075-input-hooks
    git push origin --delete feature/task-075-navbar-hooks
    git push origin --delete feature/task-075-cardlist-hooks
    git push origin --delete feature/task-075-checkboxgroup-hooks
    ```

74. [ ] **Archive analysis document**
    ```bash
    # Keep analysis for reference
    git add tasks/01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md
    git commit -m "docs: archive component analysis from TASK-075"
    ```

---

## 📝 Notes

### Component-Specific Considerations

#### Select Component

**Complexity:** Medium  
**Current Lines:** ~500  
**Lines to Remove:** ~30  
**Risk Level:** Low

**Key Challenges:**

- Multiple event listeners (mousedown, focusout)
- Portal rendering (click detection across boundaries)
- Clearable/searchable feature integration

**Hook Configuration:**

```tsx
useClickOutside(selectRef, handleClose, {
  enabled: isOpen,
  detectIframe: true, // Handle iframe clicks
});
```

---

#### Input Component

**Complexity:** Medium-High  
**Current Lines:** ~400  
**Lines to Add:** ~20  
**Risk Level:** Medium (new features)

**Key Challenges:**

- Backward compatibility (new props optional)
- Form integration (optional feature)
- Validation timing (onChange vs onBlur)

**Hook Configuration:**

```tsx
// Optional form integration
const fieldState = name
  ? useField(name, {
      validate,
      validateOnChange,
      validateOnBlur,
    })
  : null;

// State management
const [value, setValue] = useControllableState({
  value: fieldState?.value ?? valueProp,
  defaultValue,
  onChange: (newValue) => {
    onChangeProp?.(newValue);
    fieldState?.setValue(newValue);
  },
});

// Optional debouncing
const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
```

---

#### Navbar Component

**Complexity:** High  
**Current Lines:** ~800  
**Lines to Remove:** ~40  
**Risk Level:** Low

**Key Challenges:**

- Complex state management (FSM with expand/collapse)
- Multiple breakpoints (mobile/tablet/desktop)
- Keyboard navigation (Escape key)
- Nested dropdowns

**Hook Configuration:**

```tsx
useClickOutside(
  navbarRef,
  () => {
    dispatch(collapseEvent());
  },
  {
    enabled: expanded,
    // Don't close when clicking toggle button
    excludeRefs: [toggleButtonRef],
  }
);
```

---

#### CardList Component

**Complexity:** Medium  
**Current Lines:** ~300  
**Lines to Remove:** ~20  
**Risk Level:** Low

**Key Challenges:**

- Single vs multiple selection modes
- FSM integration (selection state)
- Keyboard navigation (Arrow keys)

**Hook Configuration:**

```tsx
const [selectedValue, setSelectedValue] = useControllableState({
  value,
  defaultValue,
  onChange: (newValue) => {
    onChange?.(newValue);
    // Dispatch to FSM
    dispatch(selectEvent(newValue));
  },
});
```

---

#### CheckboxGroup Component

**Complexity:** Simple  
**Current Lines:** ~200  
**Lines to Remove:** ~15  
**Risk Level:** Low

**Key Challenges:**

- Array value handling
- Validation with multiple values
- Error message display

**Hook Configuration:**

```tsx
const [checkedValues, setCheckedValues] = useControllableState({
  value,
  defaultValue: defaultValue ?? [],
  onChange,
});
```

---

### Common Patterns

#### Pattern 1: Click Outside Detection

**Before:**

```tsx
useEffect(() => {
  if (!condition) return undefined;

  const handleClick = (e: MouseEvent): void => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, [condition]);
```

**After:**

```tsx
useClickOutside(ref, handleClose, { enabled: condition });
```

**Benefits:**

- 10-15 lines → 1 line
- Handles cleanup automatically
- Better edge case handling (iframes, portals)
- Better TypeScript inference

---

#### Pattern 2: Controlled/Uncontrolled State

**Before:**

```tsx
const [internalValue, setInternalValue] = useState(defaultValue);
const actualValue = value !== undefined ? value : internalValue;

const handleChange = (newValue: T) => {
  if (value === undefined) {
    setInternalValue(newValue);
  }
  onChange?.(newValue);
};
```

**After:**

```tsx
const [actualValue, setActualValue] = useControllableState({
  value,
  defaultValue,
  onChange,
});
```

**Benefits:**

- 8-10 lines → 5 lines
- Standard pattern across library
- Better TypeScript inference
- Handles edge cases (undefined vs null)

---

#### Pattern 3: Form Field Integration

**Before:**

```tsx
// No form integration - manual validation
const [error, setError] = useState<string>();

const handleBlur = () => {
  if (validate) {
    const errorMessage = validate(value);
    setError(errorMessage);
  }
};
```

**After:**

```tsx
// Optional form integration
const fieldState = name ? useField(name, { validate }) : null;
const error = fieldState?.error ?? errorProp;
const value = fieldState?.value ?? valueProp;
```

**Benefits:**

- Built-in validation
- Form-level state management
- Consistent validation timing
- Better error handling

---

### Estimated Effort Breakdown

**Total: 4-6 days (32-48 hours)**

#### Day 1 (8 hours)

- Morning: Pre-implementation (2h)
- Afternoon: Select component (4h)
- Evening: Buffer/testing (2h)

#### Day 2 (8 hours)

- Full day: Input component (8h)
  - More complex due to new features
  - Form integration testing
  - Debounce testing

#### Day 3 (8 hours)

- Morning: Navbar component (4h)
- Afternoon: CardList component (3h)
- Evening: Buffer/testing (1h)

#### Day 4 (8 hours)

- Morning: CheckboxGroup component (3h)
- Afternoon: Testing & validation (5h)
  - Full test suite
  - A11y testing
  - Performance testing

#### Day 5 (8 hours)

- Morning: Documentation (3h)
- Afternoon: Review & merge (5h)
  - Self review
  - Final validation
  - PR creation

#### Day 6 (2-4 hours)

- Morning: Post-completion (1h)
- Buffer: Address review feedback (1-3h)

---

### Risk Mitigation

#### High Risk: Input Component (New Features)

**Mitigation:**

- Make all new props optional
- Maintain backward compatibility
- Add feature flags if needed
- Extensive testing of both modes
- Clear migration examples

**Rollback Plan:**

```tsx
// If issues found, can disable new features
const ENABLE_FORM_INTEGRATION = false;

const fieldState = ENABLE_FORM_INTEGRATION && name ? useField(name, { validate }) : null;
```

---

#### Medium Risk: Select/Navbar (Complex Components)

**Mitigation:**

- Test extensively in Storybook
- Manual testing of all interactions
- Verify portal/iframe edge cases
- Test on multiple browsers
- A11y testing with screen readers

**Rollback Plan:**

- Keep feature branches
- Can revert individual components
- Backup branch available

---

#### Low Risk: CardList/CheckboxGroup (Simple Refactor)

**Mitigation:**

- Straightforward state replacement
- Well-tested hook
- No API changes
- Good test coverage

---

### Success Metrics

#### Code Quality Metrics

- **Lines Removed**: 150-200 lines (manual implementation)
- **Lines Added**: ~50 lines (hook integration + new features)
- **Net Reduction**: ~100-150 lines
- **Complexity Reduction**: 20-30% (measured by cyclomatic complexity)

#### Test Metrics

- **Test Coverage**: Maintain 90%+ across all components
- **New Tests**: Add ~20-30 new tests for hook integration
- **Test Execution Time**: No significant increase
- **A11y Tests**: All passing (jest-axe)

#### Performance Metrics

- **Bundle Size**: No increase (hooks are tree-shakeable)
- **Render Performance**: No regression
- **First Paint**: No change
- **Interaction Time**: Potential improvement (better event handling)

#### Adoption Metrics

- **Components Using Hooks**: 1 → 6 (500% increase)
- **Hook Usage**: 2 hooks → 5 hooks
- **Manual Implementations**: 5 → 0 (100% reduction)

---

## ✅ Definition of Done

### Code Complete

- [ ] All 5 components refactored
- [ ] All manual implementations removed
- [ ] All hooks integrated correctly
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code passes Codacy analysis

### Tests Complete

- [ ] All existing tests pass (400+ tests)
- [ ] New hook integration tests added (~20-30 tests)
- [ ] Test coverage maintained at 90%+
- [ ] All A11y tests pass (jest-axe)
- [ ] Manual screen reader testing complete
- [ ] Performance tests show no regression

### Documentation Complete

- [ ] All component READMEs updated
- [ ] Storybook stories updated with hook examples
- [ ] Migration guide created
- [ ] CHANGELOG updated
- [ ] Hook usage documented
- [ ] Code comments added

### Validation Complete

- [ ] Works in Storybook
- [ ] Works in playground app
- [ ] Works in real forms
- [ ] No console errors/warnings
- [ ] Bundle size acceptable
- [ ] Cross-browser tested
- [ ] Mobile responsive

### Process Complete

- [ ] Code self-reviewed
- [ ] PR created and reviewed
- [ ] Merged to main
- [ ] Task file moved to completed/
- [ ] Team notified
- [ ] Progress tracking updated
- [ ] Feature branches deleted

---

## Post-Completion Checklist

### Immediate (Day 6)

1. [ ] Mark task as ✅ COMPLETED
2. [ ] Move task file to `tasks/completed/`
3. [ ] Update progress tracking
4. [ ] Clean up feature branches
5. [ ] Archive analysis document

### Short-term (Week 1)

1. [ ] Monitor for issues in production
2. [ ] Gather feedback from team
3. [ ] Document lessons learned
4. [ ] Update best practices documentation
5. [ ] Plan Phase 3 (optional enhancements)

### Long-term (Month 1)

1. [ ] Measure adoption metrics
2. [ ] Measure performance impact
3. [ ] Review developer satisfaction
4. [ ] Consider additional component refactors
5. [ ] Share results in team meeting

---

## Related Tasks

### Prerequisites

- TASK-074-1: Centralized types created ✅
- TASK-074-2: Components refactored to use types ✅
- TASK-074-3: Package exports updated ✅

### Blocks

- None (can proceed immediately)

### Follow-up Tasks

- TASK-076: Phase 3 optional enhancements (7 components)
- TASK-077: Remaining components hook migration (if needed)
- TASK-074-4: Documentation updates (can proceed in parallel)

---

## References

### Analysis Documents

- `tasks/01-critical/COMPREHENSIVE-COMPONENT-ANALYSIS.md` - Detailed component analysis
- Component READMEs in `packages/@dsai/react/src/components/`
- Hook documentation in `packages/@dsai/react/src/hooks/`

### Hook Documentation

- `useClickOutside`: `packages/@dsai/react/src/hooks/useClickOutside/README.md`
- `useControllableState`: `packages/@dsai/react/src/hooks/useControllableState/README.md`
- `useField`: `packages/@dsai/react/src/hooks/useField/README.md`
- `useDebounce`: `packages/@dsai/react/src/hooks/useDebounce/README.md`

### Component Documentation

- Select: `packages/@dsai/react/src/components/Select/README.md`
- Input: `packages/@dsai/react/src/components/Input/README.md`
- Navbar: `packages/@dsai/react/src/components/Navbar/README.md`
- CardList: `packages/@dsai/react/src/components/CardList/README.md`
- CheckboxGroup: `packages/@dsai/react/src/components/CheckboxGroup/README.md`

### Testing Resources

- React Testing Library: https://testing-library.com/react
- jest-axe: https://github.com/nickcolley/jest-axe
- Testing best practices: `docs/TESTING.md`

---

**Task Ready for Implementation! 🚀**

**Estimated Timeline**: 4-6 days  
**Risk Level**: Low-Medium  
**Value**: High  
**Team Impact**: Positive (better code quality, easier maintenance)
