# TASK-025: Spinner Component

**Task ID:** TASK-025
**Title:** Spinner Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create accessible Spinner (loading indicator) component. Support multiple sizes, variants, and optional label for context.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Spinner/Spinner.tsx`
- [ ] Sizes: `xs`, `sm`, `md`, `lg`, `xl`
- [ ] Variants: `primary`, `secondary`, `white`
- [ ] Optional label: `label` prop
- [ ] Centered wrapper option: `centered` prop

### Styling
- [ ] CSS animation (rotating circle)
- [ ] SVG-based spinner
- [ ] Smooth 360° rotation
- [ ] Uses design token colors

### Accessibility
- [ ] `role="status"`
- [ ] `aria-label` or `aria-labelledby`
- [ ] `aria-live="polite"`
- [ ] Hidden from screen readers when decorative

### Testing
- [ ] Unit tests 90%+
- [ ] jest-axe tests

### Documentation
- [ ] Storybook stories
- [ ] README

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template

### Blocks:
- **TASK-021**: Button Component (uses Spinner in loading state)

---

## Implementation Steps

### Step 1: Types (0.5 hours)
```typescript
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  centered?: boolean;
}
```

### Step 2: Component with SVG (2 hours)
```typescript
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label,
  centered = false,
}) => {
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  const spinnerSize = sizeMap[size];

  const spinner = (
    <svg
      className={`${styles.spinner} ${styles[`spinner--${variant}`]}`}
      width={spinnerSize}
      height={spinnerSize}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      <circle
        className={styles.circle}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  if (centered) {
    return <div className={styles.centered}>{spinner}</div>;
  }

  return spinner;
};
```

### Step 3: CSS Animation (1.5 hours)
```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}

.spinner--primary {
  color: var(--color-teal-500);
}

.circle {
  stroke-dasharray: 50, 150;
  stroke-dashoffset: 0;
}
```

### Step 4: Tests (1 hour)

### Step 5: Storybook (0.5 hours)

### Step 6: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Spinner with smooth animation
- [ ] All sizes work
- [ ] ARIA attributes correct
- [ ] Tests pass
- [ ] Stories complete

---

**Estimated Effort:** 6 hours
