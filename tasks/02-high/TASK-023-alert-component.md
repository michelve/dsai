# TASK-023: Alert Component

**Task ID:** TASK-023
**Title:** Alert Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create an accessible Alert component for displaying important messages to users. Support info, success, warning, and error variants with optional title, close button, and icon.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Alert/Alert.tsx`
- [ ] Variants: `info`, `success`, `warning`, `error`
- [ ] Optional title prop
- [ ] Optional close button: `onClose` callback
- [ ] Optional custom icon
- [ ] Default icons for each variant

### Styling
- [ ] CSS Modules using alert semantic tokens
- [ ] Flexbox layout (icon, content, close button)
- [ ] Responsive padding
- [ ] Smooth transitions for close animation

### Accessibility
- [ ] `role="alert"` for error/warning
- [ ] `role="status"` for info/success
- [ ] `aria-live="assertive"` for errors
- [ ] Close button has `aria-label="Close"`
- [ ] Keyboard accessible (close with Escape)

### Testing
- [ ] Unit tests 90%+ coverage
- [ ] Test close functionality
- [ ] jest-axe tests

### Documentation
- [ ] Storybook stories with examples
- [ ] README with usage patterns

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions
- **TASK-021**: Button Component (for close button)

---

## Implementation Steps

### Step 1: Define Types (0.5 hours)
```typescript
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  onClose?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}
```

### Step 2: Implement Component (2 hours)
```typescript
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  onClose,
  icon,
  children,
}) => {
  const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  const ariaLive = variant === 'error' ? 'assertive' : 'polite';
  
  const defaultIcons = {
    info: <InfoIcon />,
    success: <CheckIcon />,
    warning: <WarningIcon />,
    error: <ErrorIcon />,
  };

  return (
    <div 
      className={`${styles.alert} ${styles[`alert--${variant}`]}`}
      role={role}
      aria-live={ariaLive}
    >
      <span className={styles.icon}>
        {icon ?? defaultIcons[variant]}
      </span>
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button 
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};
```

### Step 3: Styles (1.5 hours)

### Step 4: Tests (1 hour)

### Step 5: Storybook (0.5 hours)

### Step 6: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Alert component with all variants
- [ ] Close button functionality
- [ ] Proper ARIA attributes
- [ ] Tests pass 90%+
- [ ] Storybook stories complete

---

**Estimated Effort:** 6 hours
