# TASK-024: Progress Component

**Task ID:** TASK-024
**Title:** Progress Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create accessible Progress component for showing progress bars. Support determinate (with value) and indeterminate (loading) states, multiple variants, sizes, and optional label.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Progress/Progress.tsx`
- [ ] Determinate mode: `value` prop (0-100)
- [ ] Indeterminate mode: animated loading
- [ ] Variants: `primary`, `success`, `warning`, `danger`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] Optional label: `label` prop
- [ ] Show percentage: `showValue` prop

### Styling
- [ ] CSS Modules with design tokens
- [ ] Smooth fill animation
- [ ] Indeterminate animation (moving gradient)
- [ ] Rounded corners

### Accessibility
- [ ] `role="progressbar"`
- [ ] `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] `aria-valuetext` for percentage
- [ ] `aria-busy="true"` for indeterminate

### Testing
- [ ] Unit tests 90%+
- [ ] Test value updates
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
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value?: number; // 0-100, undefined = indeterminate
  variant?: ProgressVariant;
  size?: ProgressSize;
  label?: string;
  showValue?: boolean;
}
```

### Step 2: Component (2 hours)
```typescript
export const Progress: React.FC<ProgressProps> = ({
  value,
  variant = 'primary',
  size = 'md',
  label,
  showValue = false,
}) => {
  const isIndeterminate = value === undefined;
  const percentage = Math.min(100, Math.max(0, value ?? 0));

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        className={`${styles.track} ${styles[`track--${size}`]}`}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={isIndeterminate ? 'Loading' : `${percentage}%`}
        aria-busy={isIndeterminate}
      >
        <div
          className={`${styles.fill} ${styles[`fill--${variant}`]} ${
            isIndeterminate ? styles['fill--indeterminate'] : ''
          }`}
          style={!isIndeterminate ? { width: `${percentage}%` } : undefined}
        />
      </div>
      {showValue && !isIndeterminate && (
        <div className={styles.value}>{percentage}%</div>
      )}
    </div>
  );
};
```

### Step 3: Styles with animation (1.5 hours)

### Step 4: Tests (1 hour)

### Step 5: Storybook (0.5 hours)

### Step 6: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Progress component with determinate/indeterminate
- [ ] All variants work
- [ ] Smooth animations
- [ ] ARIA attributes correct
- [ ] Tests pass
- [ ] Stories complete

---

**Estimated Effort:** 6 hours
