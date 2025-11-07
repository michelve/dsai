# TASK-022: Badge Component

**Task ID:** TASK-022
**Title:** Badge Component
**Priority:** High  
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create an accessible Badge component for displaying labels, status indicators, and counts. Support multiple variants (primary, secondary, success, warning, danger, info), sizes (sm, md, lg), and optional dot indicator for status badges.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Badge/Badge.tsx`
- [ ] TypeScript with strict mode
- [ ] Variants: `primary`, `secondary`, `success`, `warning`, `danger`, `info`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] Optional dot indicator: `dot` prop
- [ ] Optional icon support
- [ ] Pill shape option: `pill` prop (fully rounded)

### Styling
- [ ] CSS Modules: `Badge.module.css`
- [ ] Design tokens only (badge semantic tokens)
- [ ] Inline-flex display
- [ ] Proper padding and border radius
- [ ] Dot indicator positioned correctly

### Accessibility
- [ ] Semantic HTML (`<span>` or `<div>`)
- [ ] `role="status"` for status badges
- [ ] `aria-label` when content is icon-only
- [ ] Sufficient contrast (4.5:1 minimum)

### Testing
- [ ] Unit tests with 90%+ coverage
- [ ] jest-axe accessibility tests
- [ ] Snapshot tests for variants

### Documentation
- [ ] Storybook stories for all variants
- [ ] Usage examples in README

---

## Dependencies

### Requires:
- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions (badge tokens)

---

## Implementation Steps

### Step 1: Create Component Structure (0.5 hours)

### Step 2: Define Types (0.5 hours)
```typescript
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  pill?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

### Step 3: Implement Component (1.5 hours)
```typescript
export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  dot = false,
  pill = false,
  icon,
  children,
  className,
}) => {
  const classNames = [
    styles.badge,
    styles[`badge--${variant}`],
    styles[`badge--${size}`],
    pill && styles['badge--pill'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} role="status">
      {dot && <span className={styles.dot} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};
```

### Step 4: Create Styles (1.5 hours)
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  
  font-family: var(--typography-font-family-body);
  font-weight: var(--typography-font-weight-medium);
  
  border-radius: var(--border-radius-sm);
  line-height: 1;
}

.badge--primary {
  background-color: var(--badge-primary-bg);
  color: var(--badge-primary-text);
}

.badge--success {
  background-color: var(--badge-success-bg);
  color: var(--badge-success-text);
}

.badge--sm {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--typography-font-size-caption);
}

.badge--md {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--typography-font-size-small);
}

.badge--pill {
  border-radius: 9999px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}
```

### Step 5: Tests (1 hour)

### Step 6: Storybook Stories (0.5 hours)

### Step 7: Documentation (0.5 hours)

---

## Definition of Done

- [ ] Badge component implemented with all variants
- [ ] All sizes work correctly
- [ ] Dot indicator works
- [ ] Pill shape option works
- [ ] Tests pass with 90%+ coverage
- [ ] Accessibility tests pass
- [ ] Storybook stories complete
- [ ] README documentation complete

---

**Estimated Effort:** 6 hours
