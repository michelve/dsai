# TASK-026: Checkbox Component

**Task ID:** TASK-026
**Title:** Checkbox Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create accessible Checkbox component with controlled and uncontrolled modes, indeterminate state, label support, error states, and full keyboard navigation.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Checkbox/Checkbox.tsx`
- [ ] Controlled mode: `checked` + `onChange`
- [ ] Uncontrolled mode: `defaultChecked`
- [ ] Indeterminate state: `indeterminate` prop
- [ ] Label: `label` prop
- [ ] Disabled state
- [ ] Error state: `error` prop
- [ ] Helper text: `helperText` prop

### Styling
- [ ] Custom checkbox design (not native)
- [ ] Check icon on checked
- [ ] Dash icon on indeterminate
- [ ] Focus ring
- [ ] Error styling

### Accessibility
- [ ] Native `<input type="checkbox">`
- [ ] `<label>` associated with input
- [ ] `aria-invalid` when error
- [ ] `aria-describedby` for helper text
- [ ] Keyboard accessible (Space to toggle)
- [ ] Minimum 44×44px touch target

### Testing
- [ ] Unit tests 90%+
- [ ] Test controlled/uncontrolled
- [ ] Test indeterminate state
- [ ] jest-axe tests

### Documentation
- [ ] Storybook stories
- [ ] README

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions

---

## Implementation Steps

### Step 1: Types (0.5 hours)
```typescript
export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
}
```

### Step 2: Component (2.5 hours)
```typescript
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      label,
      disabled = false,
      error = false,
      helperText,
      name,
      value,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const combinedRef = ref || inputRef;

    // Set indeterminate property on input
    useEffect(() => {
      if (combinedRef && 'current' in combinedRef && combinedRef.current) {
        combinedRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, combinedRef]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const id = useId();

    return (
      <div className={styles.container}>
        <div className={styles.checkboxWrapper}>
          <input
            ref={combinedRef}
            type="checkbox"
            id={id}
            className={styles.input}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${id}-helper` : undefined}
            name={name}
            value={value}
          />
          <span className={`${styles.box} ${error ? styles.boxError : ''}`}>
            {checked && <CheckIcon className={styles.icon} />}
            {indeterminate && <MinusIcon className={styles.icon} />}
          </span>
          {label && (
            <label htmlFor={id} className={styles.label}>
              {label}
            </label>
          )}
        </div>
        {helperText && (
          <div
            id={`${id}-helper`}
            className={`${styles.helper} ${error ? styles.helperError : ''}`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);
```

### Step 3: Styles (1.5 hours)

### Step 4: Tests (1 hour)

### Step 5: Storybook (0.5 hours)

### Step 6: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Checkbox with all features
- [ ] Indeterminate state works
- [ ] ARIA attributes correct
- [ ] Tests pass
- [ ] Stories complete

---

**Estimated Effort:** 6 hours
