# TASK-027: Radio Component

**Task ID:** TASK-027
**Title:** Radio Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create accessible Radio button component and RadioGroup wrapper for managing radio button groups. Support controlled/uncontrolled modes, error states, and full keyboard navigation (arrow keys).

---

## Acceptance Criteria

### Component Implementation
- [ ] Radio component: `packages/components/src/Radio/Radio.tsx`
- [ ] RadioGroup component: `RadioGroup.tsx`
- [ ] Controlled mode: `value` + `onChange` on group
- [ ] Uncontrolled mode: `defaultValue` on group
- [ ] Label for each radio
- [ ] Disabled state (individual or group)
- [ ] Error state on group
- [ ] Helper text on group

### Styling
- [ ] Custom radio design (circle)
- [ ] Inner dot when selected
- [ ] Focus ring
- [ ] Error styling

### Accessibility
- [ ] Native `<input type="radio">`
- [ ] `role="radiogroup"` on container
- [ ] `aria-labelledby` on group
- [ ] `aria-invalid` when error
- [ ] Arrow key navigation (up/down/left/right)
- [ ] Minimum 44×44px touch target

### Testing
- [ ] Unit tests 90%+
- [ ] Test RadioGroup controlled/uncontrolled
- [ ] Test keyboard navigation
- [ ] jest-axe tests

### Documentation
- [ ] Storybook stories
- [ ] README with RadioGroup examples

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions

---

## Implementation Steps

### Step 1: Types (0.5 hours)
```typescript
export interface RadioProps {
  value: string;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name: string;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  children: ReactNode;
}
```

### Step 2: Radio Component (1.5 hours)
```typescript
export const Radio: React.FC<RadioProps> = ({
  value,
  label,
  disabled,
  checked,
  onChange,
}) => {
  const id = useId();

  return (
    <div className={styles.radio}>
      <input
        type="radio"
        id={id}
        value={value}
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.(value)}
      />
      <span className={styles.circle}>
        {checked && <span className={styles.dot} />}
      </span>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};
```

### Step 3: RadioGroup Component (1.5 hours)
```typescript
export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onChange,
  name,
  label,
  disabled,
  error,
  helperText,
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const labelId = useId();

  return (
    <div className={styles.group}>
      {label && (
        <div id={labelId} className={styles.groupLabel}>
          {label}
        </div>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={error}
      >
        {Children.map(children, (child) => {
          if (isValidElement(child) && child.type === Radio) {
            return cloneElement(child, {
              checked: child.props.value === currentValue,
              onChange: handleChange,
              disabled: disabled || child.props.disabled,
            });
          }
          return child;
        })}
      </div>
      {helperText && (
        <div className={`${styles.helper} ${error ? styles.helperError : ''}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};
```

### Step 4: Styles (1 hour)

### Step 5: Tests (1 hour)

### Step 6: Storybook (0.5 hours)

### Step 7: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Radio component works
- [ ] RadioGroup manages state
- [ ] Keyboard navigation works
- [ ] ARIA attributes correct
- [ ] Tests pass
- [ ] Stories complete

---

**Estimated Effort:** 6 hours
