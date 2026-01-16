---
name: component-development
description: Creates React components for DSAi design system following TypeScript patterns, WCAG 2.1 AA accessibility, and 90%+ test coverage. Use when building new UI components, extending existing ones, or implementing component patterns like Button, Card, Modal, Input.
license: Complete terms in LICENSE.txt
metadata:
  author: dsai
  version: '1.0'
---

# Component Development

Create production-ready React components for the DSAi design system.

## When to Use

- Building new UI components for the design system
- Extending or modifying existing components
- Implementing accessible interactive patterns
- Creating component variants or compositions

## Component Structure

All components live in `packages/@dsai-io/react/src/components/`:

```text
ComponentName/
├── ComponentName.tsx           # Main component
├── ComponentName.types.ts      # TypeScript types
├── ComponentName.test.tsx      # Jest tests
├── ComponentName.a11y.test.tsx # Accessibility tests (optional)
├── ComponentName.fsm.ts        # Finite state machine (complex components)
├── ComponentName.fsm.test.ts   # FSM tests
├── ComponentName.figma.tsx     # Figma code connect (optional)
├── README.md                   # Component documentation
└── index.ts                    # Public exports
```

**Note:** DSAi uses Bootstrap 5 classes with CSS custom properties (design tokens) applied via `dsai-theme-bs.css`. No `.module.scss` files are used.

## Component Template

```tsx
import { forwardRef, memo, useMemo } from 'react';

import { cn } from '../../utils';

import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName = memo(
  forwardRef<HTMLDivElement, ComponentNameProps>(function ComponentName(
    { className = '', children, variant = 'primary', size = 'md', ...props },
    ref
  ) {
    const classes = useMemo(
      () =>
        cn('component-name', `component-name--${variant}`, `component-name--${size}`, className),
      [variant, size, className]
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  })
);

ComponentName.displayName = 'ComponentName';
```

### Key Utilities

| Utility                     | Import                 | Purpose                            |
| --------------------------- | ---------------------- | ---------------------------------- |
| `cn`                        | `../../utils`          | Combines class names conditionally |
| `useControllableState`      | `../../hooks`          | Controlled/uncontrolled state      |
| `useFocusTrap`              | `../../hooks`          | Modal focus management             |
| `isEscapeKey`, `isEnterKey` | `../../utils/keyboard` | Keyboard helpers                   |

## Props Pattern

```tsx
import type { ComponentSize, SafeHTMLAttributes, SemanticColorVariant } from '../../types';
import type { ReactNode } from 'react';

/**
 * Variant using semantic color tokens
 * Maps to: primary | secondary | success | danger | warning | info | light | dark
 */
export type ComponentNameVariant = SemanticColorVariant;

/**
 * Size using standard component sizes
 * Maps to: 'sm' | 'md' | 'lg'
 */
export type ComponentNameSize = ComponentSize;

export interface ComponentNameProps extends SafeHTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: ComponentNameVariant;
  /** Size modifier */
  size?: ComponentNameSize;
  /** Disabled state */
  disabled?: boolean;
  /** Child content */
  children?: ReactNode;
}
```

**Security:** Use `SafeHTMLAttributes` instead of `React.HTMLAttributes` to prevent dangerous prop spreading (blocks `onLoad`, `onError`, etc.).

## Required Features

### Accessibility

- Keyboard navigation (Tab, Enter, Space, Escape, Arrow keys)
- ARIA attributes (`role`, `aria-label`, `aria-expanded`, etc.)
- Focus management and visible focus indicators
- Screen reader announcements for state changes

### Testing (90%+ coverage)

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders children', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies variant class', () => {
    render(<ComponentName variant="primary">Content</ComponentName>);
    expect(screen.getByText('Content')).toHaveClass('dsai-component-name--primary');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<ComponentName ref={ref}>Content</ComponentName>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick}>Content</ComponentName>);
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Styling with Bootstrap + Design Tokens

DSAi uses **Bootstrap 5 classes** enhanced with CSS custom properties:

```tsx
// Use Bootstrap classes directly
<button className="btn btn-primary btn-lg">Primary Button</button>;

// Combine with cn utility
const classes = cn(
  'card',
  variant === 'primary' && 'bg-primary text-white',
  size === 'lg' && 'p-4',
  className
);
```

**Design tokens** are applied via `dsai-theme-bs.css` which overrides Bootstrap CSS variables:

```css
/* Design tokens map to Bootstrap variables */
:root {
  --bs-primary: var(--dsai-color-blue-500);
  --bs-body-font-family: var(--dsai-typography-font-family-base);
  --bs-border-radius: var(--dsai-border-radius-md);
}
```

## Export Pattern

In `index.ts`:

```tsx
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

Add to `packages/@dsai-io/react/src/components/index.ts`:

```tsx
export * from './ComponentName';
```

## Existing Components Reference

DSAi includes 30+ components in `packages/@dsai-io/react/src/components/`:

| Component      | Pattern     | Key Features                                                 |
| -------------- | ----------- | ------------------------------------------------------------ |
| Button         | Interactive | FSM state, variants, loading, icons, `SafeHTMLAttributes`    |
| Card           | Container   | Compound (Header/Body/Footer), interactive, color variants   |
| Modal          | Overlay     | `useFocusTrap`, `useScrollLock`, portal, FSM, compound       |
| Input          | Form        | `useControllableState`, validation, prefix/suffix, clearable |
| Tabs           | Navigation  | Compound, keyboard nav, context, orientation                 |
| Select         | Form        | Custom dropdown, search, multi-select, keyboard              |
| Dropdown       | Interactive | Positioning, nested menus, keyboard                          |
| Toast          | Feedback    | Auto-dismiss, positions, variants                            |
| Table          | Data        | Sorting, selection, sticky headers                           |
| Checkbox/Radio | Form        | `useControllableState`, groups, validation                   |

## Edge Cases

- Always support `className` prop (default to `''` not `undefined`)
- Use `forwardRef` wrapped in `memo` for performance
- Handle `disabled` state with `aria-disabled` for non-button elements
- Use `useControllableState` for form elements (controlled/uncontrolled)
- Use `useMemo` for computed class names
- Use `useCallback` for event handlers
- Use FSM pattern (`useReducer`) for complex state (Button, Modal)
- Support compound components with Context (Modal, Tabs, Card)
- Always set `displayName` for debugging
