# TASK-021: Button Component

**Task ID:** TASK-021
**Title:** Button Component
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 2A - Simple Components (Weeks 7-8)

---

## Description

Create a fully accessible Button component with multiple variants (primary, secondary, danger, ghost), sizes (sm, md, lg), states (default, hover, active, disabled, loading), and support for icons. The button must meet WCAG 2.1 AA standards and include comprehensive tests and Storybook stories.

---

## Acceptance Criteria

### Component Implementation
- [ ] Component file: `packages/components/src/Button/Button.tsx`
- [ ] TypeScript with strict mode, proper typing for all props
- [ ] Forward ref support for button element
- [ ] Variants: `primary`, `secondary`, `danger`, `ghost`
- [ ] Sizes: `sm` (32px), `md` (40px), `lg` (48px)
- [ ] States: default, hover, active, disabled, loading
- [ ] Icon support: `startIcon`, `endIcon` props
- [ ] Loading state with spinner
- [ ] Full width option: `fullWidth` prop

### Styling
- [ ] CSS Modules: `Button.module.css`
- [ ] Uses design tokens exclusively (no hard-coded values)
- [ ] Semantic tokens for colors: `button-primary-bg`, `button-primary-text`, etc.
- [ ] Spacing tokens for padding: `component-padding-sm/md/lg`
- [ ] Border radius from tokens: `border-radius-md`
- [ ] Hover/active states with smooth transitions
- [ ] Focus ring for accessibility: 2px outline, token color
- [ ] Disabled state: 50% opacity, no pointer events

### Accessibility
- [ ] Semantic `<button>` element
- [ ] `disabled` attribute for disabled state
- [ ] `aria-disabled` for loading state
- [ ] `aria-busy="true"` when loading
- [ ] Focus visible outline (keyboard navigation)
- [ ] Minimum touch target: 44×44px (WCAG 2.5.5)
- [ ] Contrast ratio ≥4.5:1 for all variants (WCAG 1.4.3)

### Testing
- [ ] Unit tests: `Button.test.tsx`
- [ ] Test file co-located with component
- [ ] 90%+ code coverage
- [ ] Tests: renders correctly, variants render, sizes render, disabled state, loading state, click handler called, icon rendering
- [ ] Accessibility tests with jest-axe
- [ ] Snapshot tests for variants

### Documentation
- [ ] Storybook stories: `Button.stories.tsx`
- [ ] All variants documented with Controls
- [ ] All sizes documented
- [ ] Interactive examples (click, loading)
- [ ] Accessibility notes in docs
- [ ] README: `Button/README.md` with usage examples

---

## Dependencies

### Requires:
- **TASK-001**: Nx Monorepo Setup
- **TASK-002**: TypeScript Configuration
- **TASK-012**: Style Dictionary Pipeline (design tokens)
- **TASK-014**: Base Component Template (component structure)
- **TASK-019**: Semantic Token Definitions (button tokens)

### Blocks:
- **TASK-046**: Figma Code Connect (Button mapping)

---

## Implementation Steps

### Step 1: Create Component Structure (0.5 hours)
```bash
cd packages/components/src
mkdir Button
touch Button/Button.tsx
touch Button/Button.module.css
touch Button/Button.types.ts
touch Button/Button.test.tsx
touch Button/Button.stories.tsx
touch Button/index.ts
touch Button/README.md
```

### Step 2: Define TypeScript Types (0.5 hours)
Create `Button.types.ts`:
```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button visual style */
  variant?: ButtonVariant;
  
  /** Button size */
  size?: ButtonSize;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state with spinner */
  loading?: boolean;
  
  /** Full width button */
  fullWidth?: boolean;
  
  /** Icon before text */
  startIcon?: ReactNode;
  
  /** Icon after text */
  endIcon?: ReactNode;
  
  /** Button content */
  children: ReactNode;
}
```

### Step 3: Implement Component (2 hours)
Create `Button.tsx`:
```typescript
import React, { forwardRef } from 'react';
import { ButtonProps } from './Button.types';
import styles from './Button.module.css';
import { Spinner } from '../Spinner';

/**
 * Button component with multiple variants and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      startIcon,
      endIcon,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classNames = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      fullWidth && styles['button--full-width'],
      loading && styles['button--loading'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {loading && <Spinner className={styles.spinner} size="sm" />}
        {!loading && startIcon && (
          <span className={styles.icon}>{startIcon}</span>
        )}
        <span className={styles.label}>{children}</span>
        {!loading && endIcon && (
          <span className={styles.icon}>{endIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Step 4: Create Styles (1.5 hours)
Create `Button.module.css`:
```css
.button {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  
  font-family: var(--typography-font-family-body);
  font-weight: var(--typography-font-weight-medium);
  
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  /* Accessibility */
  min-width: 44px;
  min-height: 44px;
}

.button:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 2px;
}

/* Variants */
.button--primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  border-color: var(--button-primary-border);
}

.button--primary:hover:not(:disabled) {
  background-color: var(--button-primary-hover-bg);
}

.button--primary:active:not(:disabled) {
  background-color: var(--button-primary-active-bg);
}

.button--secondary {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
  border-color: var(--button-secondary-border);
}

.button--danger {
  background-color: var(--button-danger-bg);
  color: var(--button-danger-text);
}

.button--ghost {
  background-color: transparent;
  color: var(--button-ghost-text);
}

/* Sizes */
.button--sm {
  padding: var(--component-padding-xs) var(--component-padding-sm);
  font-size: var(--typography-font-size-small);
  min-height: 32px;
}

.button--md {
  padding: var(--component-padding-sm) var(--component-padding-md);
  font-size: var(--typography-font-size-body);
  min-height: 40px;
}

.button--lg {
  padding: var(--component-padding-md) var(--component-padding-lg);
  font-size: var(--typography-font-size-h4);
  min-height: 48px;
}

/* States */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--loading {
  position: relative;
  pointer-events: none;
}

.button--full-width {
  width: 100%;
}

/* Icons */
.icon {
  display: inline-flex;
  align-items: center;
}

.spinner {
  margin-right: var(--spacing-2);
}
```

### Step 5: Write Tests (1 hour)
Create `Button.test.tsx`:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders primary variant', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toHaveClass('button--primary');
  });

  it('handles click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders icons', () => {
    render(
      <Button startIcon={<span>→</span>} endIcon={<span>←</span>}>
        With Icons
      </Button>
    );
    expect(screen.getByText('→')).toBeInTheDocument();
    expect(screen.getByText('←')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Step 6: Create Storybook Stories (0.5 hours)
Create `Button.stories.tsx`:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};
```

---

## Definition of Done

- [ ] Button component implemented with all variants
- [ ] All sizes (sm, md, lg) work correctly
- [ ] Disabled and loading states work
- [ ] Icons supported (start and end)
- [ ] Styles use design tokens exclusively
- [ ] Tests written with 90%+ coverage
- [ ] jest-axe accessibility tests pass
- [ ] Storybook stories created for all variants
- [ ] README documentation complete
- [ ] Code review approved
- [ ] Component merged to main branch

---

## Related Tasks

- **TASK-014**: Base Component Template
- **TASK-019**: Semantic Token Definitions
- **TASK-025**: Spinner Component (used in loading state)

---

**Estimated Effort:** 6 hours
