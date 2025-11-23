# TASK-014: Create Base Component Template

**Task ID:** TASK-014
**Title:** Create Base Component Template
**Priority:** High
**Status:** Not Started
**Assigned To:** Developer
**Estimated Time:** 6 hours
**Phase:** Phase 1 - Token System (Weeks 3-6)

---

## Description

Create a standardized base component template that establishes patterns for all future component development. This template will include TypeScript structure, prop definitions, styling approach with CSS Modules and design tokens, accessibility attributes, testing structure, and Storybook stories. This ensures consistency across all 38 components.

---

## Acceptance Criteria

### Component Structure

- [ ] Component directory structure defined:
  ```
  packages/react/src/Button/
  ├── Button.tsx (main component)
  ├── Button.module.css (styles)
  ├── Button.types.ts (TypeScript types)
  ├── Button.test.tsx (tests)
  ├── Button.stories.tsx (Storybook)
  ├── index.ts (exports)
  └── README.md (component docs)
  ```

### TypeScript Template

- [ ] Component props interface with JSDoc comments
- [ ] Proper React.FC or function component typing
- [ ] Generic props support where needed
- [ ] Ref forwarding with `React.forwardRef`
- [ ] Proper typing for children, className, style props

### Styling Template

- [ ] CSS Modules configured and working
- [ ] Design tokens imported via CSS variables
- [ ] BEM-like naming convention for CSS classes
- [ ] Theming support via CSS variables
- [ ] No hard-coded values (all from tokens)

### Accessibility Template

- [ ] ARIA attributes where needed
- [ ] Semantic HTML elements
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] Screen reader announcements

### Testing Template

- [ ] Component renders without errors
- [ ] Props validation tests
- [ ] User interaction tests
- [ ] Accessibility tests with jest-axe
- [ ] Snapshot tests (optional)
- [ ] Test coverage ≥90%

### Storybook Template

- [ ] Default story
- [ ] All variants as separate stories
- [ ] Interactive controls (args)
- [ ] Actions for event handlers
- [ ] MDX documentation page
- [ ] Accessibility checks enabled

### Documentation Template

- [ ] README with component overview
- [ ] Props table (auto-generated from TypeScript)
- [ ] Usage examples
- [ ] Accessibility notes
- [ ] Related components

---

## Dependencies

### Requires:

- **TASK-001**: Nx Monorepo Structure
- **TASK-002**: TypeScript/ESLint/Prettier
- **TASK-003**: Build Pipeline
- **TASK-005**: Testing Infrastructure
- **TASK-012**: Style Dictionary Pipeline
- **TASK-013**: Configure Storybook

### Blocks:

- All component development tasks (TASK-021 through TASK-045)

---

## Implementation Steps

### Step 1: Create Component Structure (1 hour)

1. Create example Button component:
   ```
   packages/react/src/Button/
   ├── Button.tsx
   ├── Button.module.css
   ├── Button.types.ts
   ├── Button.test.tsx
   ├── Button.stories.tsx
   ├── index.ts
   └── README.md
   ```

### Step 2: TypeScript Template (1 hour)

```typescript
// Button.types.ts
export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

// Button.tsx
import React from 'react';
import styles from './Button.module.css';
import { ButtonProps } from './Button.types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    ...rest
  }, ref) => {
    const classNames = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      disabled && styles['button--disabled'],
      className
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Step 3: CSS Module Template (1 hour)

```css
/* Button.module.css */
.button {
  /* Use design tokens */
  font-family: var(--typography-font-family-body);
  font-size: var(--typography-font-size-body);
  font-weight: var(--typography-font-weight-medium);

  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-md);
  border: var(--border-width-thin) solid transparent;

  cursor: pointer;
  transition: all 0.2s ease;

  /* Reset */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: none;
}

.button--primary {
  background-color: var(--color-button-primary-background);
  color: var(--color-button-primary-text);
  border-color: var(--color-button-primary-border);
}

.button--primary:hover:not(:disabled) {
  background-color: var(--color-button-primary-background-hover);
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Step 4: Testing Template (1.5 hours)

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Step 5: Storybook Template (1 hour)

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Button visual style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};
```

### Step 6: Documentation Template (0.5 hours)

```markdown
# Button

A versatile button component with multiple variants, sizes, and states.

## Usage

\`\`\`tsx
import { Button } from '@yourorg/react';

function App() {
return <Button variant="primary">Click me</Button>;
}
\`\`\`

## Props

See TypeScript types for complete prop documentation.

## Accessibility

- Uses semantic `<button>` element
- Supports keyboard navigation (Enter, Space)
- Includes disabled state
- WCAG 2.2 AA compliant

## Related Components

- Link
- IconButton
```

### Step 7: Create Generator Script (1 hour)

1. Create Nx generator for new components
2. Template generates all required files
3. Script: `nx g component ComponentName`
4. Test generator with sample component

---

## Definition of Done

- [ ] Base component template created (Button example)
- [ ] All template files present (component, types, styles, tests, stories, docs)
- [ ] TypeScript types properly defined with JSDoc
- [ ] CSS Modules use design tokens (no hard-coded values)
- [ ] Tests pass with ≥90% coverage
- [ ] Accessibility tests included (jest-axe)
- [ ] Storybook stories work with interactive controls
- [ ] Documentation template complete
- [ ] Component generator script created (optional)
- [ ] Template reviewed and approved by team
- [ ] Template documented in project wiki/README

---

## Notes

### Component Best Practices:

- Forward refs for all interactive components
- Use semantic HTML
- No hard-coded styles (use tokens)
- Always include accessibility attributes
- Test user interactions, not implementation details

### CSS Modules Benefits:

- Scoped styles (no global conflicts)
- Tree-shakeable (unused styles removed)
- Works with design tokens
- TypeScript support via css-modules

---

## Related Tasks

- **TASK-001-005**: Foundation setup
- **TASK-012**: Style Dictionary Pipeline
- **TASK-013**: Configure Storybook
- **TASK-021-045**: All component tasks

---

**Estimated Effort:** 6 hours
