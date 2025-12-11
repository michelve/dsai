# Task Template

**Task ID:** TASK-075-2  
**Title:** Refactor Input Component to Use useField, useControllableState, and useDebounce  
**Priority:** High  
**Status:** 🟡 Ready  
**Assigned To:** Developer  
**Estimated Time:** 4-5 hours  
**Actual Time:** _TBD_  
**Parent Task:** TASK-075 (Refactor Components to Use Centralized Hooks)  
**Blocked By:** None (can proceed in parallel with TASK-075-1)  
**Created:** 2025-12-10  
**Updated:** 2025-12-10  
**Completed:** _Not yet_

---

## 📋 Task Description

### Goal

Refactor the Input component to add optional form integration (`useField`), standardize controlled/uncontrolled state management (`useControllableState`), and add optional debouncing (`useDebounce`), creating new features while maintaining 100% backward compatibility.

### Problem/Issue

**Current State:**

Input component manually manages controlled/uncontrolled state:

```tsx
// Manual state management
const [internalValue, setValue] = useState(defaultValue);
const actualValue = value ?? internalValue;

const handleChange = (newValue: string) => {
  if (value === undefined) {
    setValue(newValue);
  }
  onChange?.(newValue);
};
```

**Missing Features:**

- No form integration support
- No built-in validation
- No debouncing option
- Manual controlled/uncontrolled logic

### Expected Outcome

Input component with hook integration:

```tsx
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
const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
```

**Benefits:**

- **New Features**: Form integration, validation, debouncing
- **Consistency**: Standard controlled/uncontrolled pattern
- **Maintainability**: Less manual state management
- **Backward Compatible**: All new props are optional

---

## 🎯 Acceptance Criteria

### New Props (All Optional)

- [ ] **Add `name` prop** for form integration

  ```tsx
  name?: string;
  ```

- [ ] **Add `validate` prop** for validation function

  ```tsx
  validate?: (value: string) => string | undefined;
  ```

- [ ] **Add `debounceMs` prop** for debouncing
  ```tsx
  debounceMs?: number;
  ```

### Functionality

- [ ] **Import required hooks**

  ```tsx
  import { useField, useControllableState, useDebounce } from '../../hooks';
  ```

- [ ] **Implement optional form integration**
  - Only activates when `name` and `validate` are provided
  - Integrates with form-level state management
  - Shows field-level errors

- [ ] **Replace state management with useControllableState**
  - Remove manual controlled/uncontrolled logic
  - Use standard hook pattern
  - Preserve onChange behavior

- [ ] **Add optional debouncing**
  - Only activates when `debounceMs > 0`
  - Debounces value changes
  - Still calls onChange immediately

- [ ] **Preserve all existing features**
  - Clear button works
  - Input masks work
  - Validation feedback works
  - Error states work
  - Helper text displays
  - All input types work
  - Disabled state works

### Backward Compatibility

- [ ] **All existing props work exactly as before**
- [ ] **No breaking changes**
- [ ] **All existing tests pass (100+ test cases)**
- [ ] **Components using Input don't need changes**

### Code Quality

- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Proper hook dependencies
- [ ] JSDoc comments for new props
- [ ] No console errors/warnings

### Testing

- [ ] All existing Input tests pass (100+ test cases)
- [ ] Add tests for form integration (5-10 new tests)
- [ ] Add tests for debouncing (3-5 new tests)
- [ ] Controlled mode works
- [ ] Uncontrolled mode works
- [ ] Form integration works (new)
- [ ] Debouncing works (new)
- [ ] Clear button works
- [ ] Input masks work
- [ ] Validation feedback works

---

## 📂 Files to Modify

### Primary Files

**1. `packages/@dsai/react/src/components/Input/Input.types.ts`**

**Changes:**

- Add new optional props to `InputProps` interface

**2. `packages/@dsai/react/src/components/Input/Input.tsx`** (~400 lines)

**Changes:**

- Add hook imports
- Destructure new props
- Add optional form integration
- Replace state management
- Add optional debouncing
- Update error handling

### Test File

**3. `packages/@dsai/react/src/components/Input/Input.test.tsx`**

**Changes:**

- Add tests for form integration
- Add tests for debouncing
- Verify backward compatibility

---

## 🔗 Dependencies

### Prerequisites

- [x] `useField` hook available in `@dsai/react/hooks`
- [x] `useControllableState` hook available
- [x] `useDebounce` hook available
- [x] Comprehensive component analysis complete

### Blocks

- None (independent subtask)

---

## 🔄 Implementation Steps

### Step 1: Preparation (15 minutes)

1. [ ] **Create feature branch**

   ```bash
   git checkout -b feature/task-075-2-input-hooks
   ```

2. [ ] **Review current Input implementation**
   - Open `packages/@dsai/react/src/components/Input/Input.tsx`
   - Locate state management logic
   - Review onChange handling
   - Note error handling

3. [ ] **Review hook documentation**
   - Read `useField` hook API
   - Read `useControllableState` hook API
   - Read `useDebounce` hook API
   - Understand options and edge cases

---

### Step 2: Update Types (30 minutes)

4. [ ] **Open Input.types.ts**

   ```bash
   packages/@dsai/react/src/components/Input/Input.types.ts
   ```

5. [ ] **Add new props to InputProps interface**

   Find the `InputProps` interface and add:

   ```tsx
   export interface InputProps {
     // ... existing props

     /**
      * Form field name for integration with useField hook
      * When provided with validate, enables form-level state management
      * @optional
      */
     name?: string;

     /**
      * Validation function for form integration
      * Returns error message string or undefined if valid
      * Only works when name is also provided
      * @optional
      */
     validate?: (value: string) => string | undefined;

     /**
      * Debounce delay in milliseconds
      * When > 0, onChange will be debounced by this amount
      * @default 0
      * @optional
      */
     debounceMs?: number;
   }
   ```

6. [ ] **Verify TypeScript compiles**
   ```bash
   pnpm nx type-check @dsai/react
   ```

---

### Step 3: Update Component Implementation (2-3 hours)

7. [ ] **Import hooks in Input.tsx**

   Find line ~12 where React hooks are imported:

   ```tsx
   import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
   ```

   Add after utilities imports:

   ```tsx
   import { useField, useControllableState, useDebounce } from '../../hooks';
   ```

8. [ ] **Destructure new props**

   Find the component function signature:

   ```tsx
   const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
     const {
       value: valueProp,
       defaultValue,
       onChange: onChangeProp,
       error: errorProp,
       // ... other props
     } = props;
   ```

   Add new props to destructuring:

   ```tsx
   const {
     value: valueProp,
     defaultValue,
     onChange: onChangeProp,
     error: errorProp,
     name, // NEW
     validate, // NEW
     debounceMs = 0, // NEW (with default)
     // ... other props
   } = props;
   ```

9. [ ] **Add optional form integration**

   Add near the top of the component (after prop destructuring):

   ```tsx
   // Optional form field integration
   // Only activates when both name and validate are provided
   const fieldState = name && validate ? useField(name, { validate }) : null;
   ```

10. [ ] **Locate current state management**

    Find the manual state management code (around line 50-80):

    ```tsx
    const [internalValue, setValue] = useState(defaultValue);
    const actualValue = value ?? internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setValue(newValue);
      }
      onChange?.(newValue);
    };
    ```

11. [ ] **Replace with useControllableState**

    Delete the manual state code and replace with:

    ```tsx
    // Controlled/uncontrolled state management with centralized hook
    const [value, setValue] = useControllableState({
      value: fieldState?.value ?? valueProp,
      defaultValue,
      onChange: (newValue) => {
        // Call prop onChange
        onChangeProp?.(newValue);

        // Update form field if integrated
        if (fieldState) {
          fieldState.setValue(newValue);
        }
      },
    });

    // Handle input change event
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      [setValue]
    );
    ```

12. [ ] **Add optional debouncing**

    Add after state management:

    ```tsx
    // Optional debouncing for onChange callback
    const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;

    // Effect to call onChange with debounced value
    useEffect(() => {
      if (debounceMs > 0 && debouncedValue !== undefined) {
        onChangeProp?.(debouncedValue);
      }
    }, [debouncedValue, debounceMs, onChangeProp]);
    ```

13. [ ] **Update error handling**

    Find where error is used:

    ```tsx
    const error = errorProp;
    ```

    Replace with:

    ```tsx
    // Error from form field or prop (form field takes precedence)
    const error = fieldState?.error ?? errorProp;
    ```

14. [ ] **Update touched/validation state**

    If component tracks touched state, integrate with form field:

    ```tsx
    const touched = fieldState?.touched ?? false;
    ```

15. [ ] **Verify clear button still works**

    Find clear button handler and ensure it works with new state:

    ```tsx
    const handleClear = useCallback(() => {
      setValue('');
      // fieldState will be updated via onChange in useControllableState
    }, [setValue]);
    ```

---

### Step 4: Testing (1-1.5 hours)

16. [ ] **Run existing tests**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=Input
    # Expected: All 100+ tests pass
    ```

17. [ ] **Add new tests for form integration**

    Add to `Input.test.tsx`:

    ```tsx
    describe('Input with useField integration', () => {
      it('integrates with form field when name and validate provided', () => {
        const validate = jest.fn((value: string) => {
          if (!value) return 'Required';
          return undefined;
        });

        const { getByRole } = render(
          <Input name="email" validate={validate} placeholder="Email" />
        );

        const input = getByRole('textbox');

        // Should show error for empty value
        fireEvent.blur(input);
        expect(validate).toHaveBeenCalledWith('');
      });

      it('validates on change when configured', () => {
        const validate = jest.fn((value: string) => {
          if (!value.includes('@')) return 'Invalid email';
          return undefined;
        });

        const { getByRole } = render(<Input name="email" validate={validate} />);

        const input = getByRole('textbox');

        fireEvent.change(input, { target: { value: 'test' } });
        expect(validate).toHaveBeenCalledWith('test');

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(validate).toHaveBeenCalledWith('test@example.com');
      });

      it('shows field errors from validation', () => {
        const { getByRole, getByText } = render(
          <Input
            name="email"
            validate={(value) => {
              if (!value.includes('@')) return 'Invalid email';
            }}
          />
        );

        const input = getByRole('textbox');

        fireEvent.change(input, { target: { value: 'invalid' } });
        fireEvent.blur(input);

        expect(getByText('Invalid email')).toBeInTheDocument();
      });

      it('does not activate form integration without name', () => {
        const validate = jest.fn();

        const { getByRole } = render(<Input validate={validate} placeholder="No name" />);

        const input = getByRole('textbox');

        fireEvent.change(input, { target: { value: 'test' } });

        // Validate should not be called without name
        expect(validate).not.toHaveBeenCalled();
      });
    });
    ```

18. [ ] **Add tests for debouncing**

    ```tsx
    describe('Input with debounce', () => {
      jest.useFakeTimers();

      it('debounces onChange when debounceMs provided', () => {
        const onChange = jest.fn();

        const { getByRole } = render(<Input debounceMs={500} onChange={onChange} />);

        const input = getByRole('textbox');

        // Type quickly
        fireEvent.change(input, { target: { value: 't' } });
        fireEvent.change(input, { target: { value: 'te' } });
        fireEvent.change(input, { target: { value: 'tes' } });
        fireEvent.change(input, { target: { value: 'test' } });

        // Should not call onChange immediately
        expect(onChange).not.toHaveBeenCalled();

        // Fast-forward time
        jest.advanceTimersByTime(500);

        // Now should be called once with final value
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('test');
      });

      it('does not debounce when debounceMs is 0', () => {
        const onChange = jest.fn();

        const { getByRole } = render(<Input debounceMs={0} onChange={onChange} />);

        const input = getByRole('textbox');

        fireEvent.change(input, { target: { value: 'test' } });

        // Should call immediately
        expect(onChange).toHaveBeenCalledWith('test');
      });

      jest.useRealTimers();
    });
    ```

19. [ ] **Test backward compatibility**

    ```tsx
    describe('Input backward compatibility', () => {
      it('works as controlled input without new props', () => {
        const onChange = jest.fn();
        const { getByRole } = render(<Input value="test" onChange={onChange} />);

        const input = getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('test');
      });

      it('works as uncontrolled input without new props', () => {
        const { getByRole } = render(<Input defaultValue="test" />);

        const input = getByRole('textbox') as HTMLInputElement;
        expect(input.value).toBe('test');
      });

      it('preserves clear button functionality', () => {
        const onChange = jest.fn();
        const { getByRole, getByLabelText } = render(
          <Input value="test" onChange={onChange} clearable />
        );

        const clearButton = getByLabelText('Clear');
        fireEvent.click(clearButton);

        expect(onChange).toHaveBeenCalledWith('');
      });
    });
    ```

20. [ ] **Run all tests again**

    ```bash
    pnpm nx test @dsai/react --testPathPattern=Input
    # Expected: All tests pass including new ones
    ```

21. [ ] **Test in Storybook**

    ```bash
    pnpm nx storybook @dsai/storybook
    # Navigate to Input stories
    # Test all variants manually
    ```

22. [ ] **Manual testing checklist**
    - [ ] Controlled mode works
    - [ ] Uncontrolled mode works
    - [ ] Clear button works
    - [ ] Form integration works (new)
    - [ ] Validation shows errors (new)
    - [ ] Debouncing works (new)
    - [ ] Input masks work
    - [ ] Error states display
    - [ ] Helper text displays
    - [ ] Disabled state works

---

### Step 5: Code Quality (30 minutes)

23. [ ] **Run TypeScript check**

    ```bash
    pnpm nx type-check @dsai/react
    ```

24. [ ] **Run linter**

    ```bash
    pnpm nx lint @dsai/react --fix
    ```

25. [ ] **Run Codacy analysis**

    ```bash
    codacy-cli analyze --file packages/@dsai/react/src/components/Input/Input.tsx
    ```

26. [ ] **Self code review**
    - [ ] Review git diff
    - [ ] Verify only intended changes
    - [ ] Check JSDoc comments complete
    - [ ] No console.logs or debug code

---

### Step 6: Documentation (30 minutes)

27. [ ] **Update component README**

    Add new section to `packages/@dsai/react/src/components/Input/README.md`:

    ```markdown
    ## Form Integration

    Input supports optional form integration with the `useField` hook:

    ### Basic Form Integration

    \`\`\`tsx
    <Input
    name="email"
    validate={(value) => {
    if (!value) return 'Email is required';
    if (!value.includes('@')) return 'Invalid email';
    return undefined;
    }}
    />
    \`\`\`

    ### With Debouncing

    \`\`\`tsx
    <Input
    name="search"
    debounceMs={500}
    onChange={(value) => {
    // Called after 500ms of no typing
    performSearch(value);
    }}
    />
    \`\`\`

    ### Form Integration Props

    | Prop         | Type                                     | Description                                 |
    | ------------ | ---------------------------------------- | ------------------------------------------- |
    | `name`       | `string`                                 | Field name for form integration             |
    | `validate`   | `(value: string) => string \| undefined` | Validation function                         |
    | `debounceMs` | `number`                                 | Debounce delay in milliseconds (default: 0) |
    ```

28. [ ] **Add Storybook stories**

    Add to `Input.stories.tsx`:

    ```tsx
    export const WithFormIntegration: Story = {
      args: {
        name: 'email',
        placeholder: 'Enter email',
        validate: (value: string) => {
          if (!value) return 'Email is required';
          if (!value.includes('@')) return 'Invalid email';
          return undefined;
        },
      },
    };

    export const WithDebounce: Story = {
      args: {
        placeholder: 'Type to search...',
        debounceMs: 500,
        onChange: (value) => console.log('Debounced:', value),
      },
    };
    ```

---

### Step 7: Commit & Review (15 minutes)

29. [ ] **Stage changes**

    ```bash
    git add packages/@dsai/react/src/components/Input/
    ```

30. [ ] **Commit with conventional commit**
    ```bash
    git commit -m "feat(input): add useField, useControllableState, and useDebounce integration
    ```

- Add optional form integration with name and validate props
- Add optional debouncing with debounceMs prop
- Replace manual state management with useControllableState
- Maintain 100% backward compatibility
- All 100+ existing tests pass
- Add 15+ new tests for hook features

Closes TASK-075-2"
```

31. [ ] **Push feature branch**
    ```bash
    git push origin feature/task-075-2-input-hooks
    ```

---

## 📝 Notes

### Component Details

**File:** `packages/@dsai/react/src/components/Input/Input.tsx`  
**Current Lines:** ~400  
**Lines to Add:** ~20-30  
**Lines Modified:** ~10-15  
**Complexity:** Medium-High  
**Risk Level:** Medium (new features, but all optional)

### Hook Integration Pattern

```tsx
// 1. Optional form integration
const fieldState =
  name && validate ? useField(name, { validate, validateOnChange, validateOnBlur }) : null;

// 2. Controlled/uncontrolled state
const [value, setValue] = useControllableState({
  value: fieldState?.value ?? valueProp,
  defaultValue,
  onChange: (newValue) => {
    onChangeProp?.(newValue);
    fieldState?.setValue(newValue);
  },
});

// 3. Optional debouncing
const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
```

### Backward Compatibility Strategy

**All new props are optional:**

- `name` - defaults to `undefined`
- `validate` - defaults to `undefined`
- `debounceMs` - defaults to `0` (no debouncing)

**When not provided:**

- Component works exactly as before
- No form integration activated
- No debouncing applied
- Existing behavior unchanged

### Common Issues

**Issue 1: Infinite re-render with onChange**

```tsx
// ❌ Wrong - creates new function each render
onChange: (newValue) => {
  props.onChange?.(newValue);
};

// ✅ Correct - use callback or memo
const handleChange = useCallback(
  (newValue) => {
    props.onChange?.(newValue);
    fieldState?.setValue(newValue);
  },
  [props.onChange, fieldState]
);
```

**Issue 2: Debounce doesn't work**

```tsx
// Make sure debounceMs is properly checked
const debouncedValue = debounceMs > 0 ? useDebounce(value, debounceMs) : value;
```

**Issue 3: Form integration always active**

```tsx
// ❌ Wrong - always creates field state
const fieldState = useField(name, { validate });

// ✅ Correct - only when both provided
const fieldState = name && validate ? useField(name, { validate }) : null;
```

---

## ✅ Definition of Done

### Code

- [ ] New props added to types
- [ ] Hooks integrated correctly
- [ ] State management refactored
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Clean git diff

### Tests

- [ ] All 100+ existing tests pass
- [ ] 15+ new tests added
- [ ] Form integration tested
- [ ] Debouncing tested
- [ ] Backward compatibility verified

### Documentation

- [ ] README updated
- [ ] New Storybook stories added
- [ ] JSDoc comments on new props
- [ ] Examples provided

### Process

- [ ] Code committed
- [ ] Feature branch pushed
- [ ] Ready for review

---

## Post-Completion

1. [ ] Mark task as ✅ COMPLETED
2. [ ] Update actual time spent
3. [ ] Update parent task (TASK-075) progress
4. [ ] Document any learnings
5. [ ] Move to next subtask (TASK-075-3)

---

## Related Tasks

- **Parent:** TASK-075 (Refactor Components to Use Centralized Hooks)
- **Previous:** TASK-075-1 (Select Component)
- **Next:** TASK-075-3 (Navbar Component)

---

**Subtask Ready for Implementation! 🚀**

**Time Estimate:** 4-5 hours  
**Difficulty:** Medium-High  
**Risk:** Medium (new features, but all optional)  
**Value:** High (adds form integration, validation, debouncing)
