# Component Templates

Reusable templates for creating DSAi React components.

## Basic Component Template

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

## Types Template

```tsx
import type { ComponentSize, SafeHTMLAttributes, SemanticColorVariant } from '../../types';
import type { ReactNode } from 'react';

/**
 * Variant using semantic color tokens
 */
export type ComponentNameVariant = SemanticColorVariant;

/**
 * Size using standard component sizes
 */
export type ComponentNameSize = ComponentSize;

export interface ComponentNameProps extends SafeHTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: ComponentNameVariant;

  /** Component size */
  size?: ComponentNameSize;

  /** Child content */
  children?: ReactNode;

  /** Additional CSS classes */
  className?: string;
}
```

## Test Template

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ComponentName>Content</ComponentName>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ComponentName className="custom">Content</ComponentName>);
      expect(screen.getByText('Content')).toHaveClass('custom');
    });

    it('forwards ref', () => {
      const ref = { current: null };
      render(<ComponentName ref={ref}>Content</ComponentName>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<ComponentName>Content</ComponentName>);
      expect(screen.getByText('Content')).toHaveClass('component-name--primary');
    });

    it('renders secondary variant', () => {
      render(<ComponentName variant="secondary">Content</ComponentName>);
      expect(screen.getByText('Content')).toHaveClass('component-name--secondary');
    });
  });

  describe('Sizes', () => {
    it('renders md size by default', () => {
      render(<ComponentName>Content</ComponentName>);
      expect(screen.getByText('Content')).toHaveClass('component-name--md');
    });

    it.each(['sm', 'md', 'lg'] as const)('renders %s size', (size) => {
      render(<ComponentName size={size}>Content</ComponentName>);
      expect(screen.getByText('Content')).toHaveClass(`component-name--${size}`);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ComponentName>Content</ComponentName>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

## Index Template

```tsx
export { ComponentName } from './ComponentName';
export type {
  ComponentNameProps,
  ComponentNameVariant,
  ComponentNameSize,
} from './ComponentName.types';
```

## Interactive Component Template

For components with state (toggles, inputs, etc.):

```tsx
import { forwardRef, memo, useCallback, useMemo } from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';

import type { ToggleProps } from './Toggle.types';

export const Toggle = memo(
  forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
    {
      className = '',
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      disabled = false,
      ...props
    },
    ref
  ) {
    const [checked, setChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange,
    });

    const handleClick = useCallback(() => {
      if (!disabled) {
        setChecked(!checked);
      }
    }, [checked, disabled, setChecked]);

    const classes = useMemo(
      () => cn('toggle', checked && 'toggle--checked', disabled && 'toggle--disabled', className),
      [checked, disabled, className]
    );

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        className={classes}
        onClick={handleClick}
        {...props}
      />
    );
  })
);

Toggle.displayName = 'Toggle';
```

## Modal/Dialog Template

```tsx
import { forwardRef, memo, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useFocusTrap, useLockBodyScroll } from '../../hooks';
import { cn, isEscapeKey } from '../../utils';

import type { ModalProps } from './Modal.types';

export const Modal = memo(
  forwardRef<HTMLDivElement, ModalProps>(function Modal(
    {
      className = '',
      isOpen,
      onClose,
      children,
      title,
      closeOnEscape = true,
      closeOnOverlayClick = true,
      ...props
    },
    ref
  ) {
    const modalRef = useRef<HTMLDivElement>(null);
    const combinedRef = ref ?? modalRef;

    // Lock body scroll when modal is open
    useLockBodyScroll(isOpen);

    // Trap focus within modal
    useFocusTrap(combinedRef as React.RefObject<HTMLDivElement>, isOpen);

    // Handle escape key
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (closeOnEscape && isEscapeKey(event)) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return createPortal(
      <div className="modal-overlay" onClick={closeOnOverlayClick ? onClose : undefined}>
        <div
          ref={combinedRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className={cn('modal', className)}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <header className="modal-header">
            <h2 id="modal-title">{title}</h2>
            <button type="button" aria-label="Close modal" onClick={onClose}>
              ×
            </button>
          </header>
          <div className="modal-body">{children}</div>
        </div>
      </div>,
      document.body
    );
  })
);

Modal.displayName = 'Modal';
```

## README Template

```markdown
# ComponentName

Brief description of what the component does.

## Usage

\`\`\`tsx
import { ComponentName } from '@dsai-io/react';

function Example() {
return (
<ComponentName variant="primary" size="md">
Content
</ComponentName>
);
}
\`\`\`

## Props

| Prop        | Type                              | Default     | Description            |
| ----------- | --------------------------------- | ----------- | ---------------------- |
| `variant`   | `'primary' \| 'secondary' \| ...` | `'primary'` | Visual variant         |
| `size`      | `'sm' \| 'md' \| 'lg'`            | `'md'`      | Component size         |
| `children`  | `ReactNode`                       | -           | Child content          |
| `className` | `string`                          | `''`        | Additional CSS classes |

## Accessibility

- Keyboard navigable
- Screen reader friendly
- WCAG 2.1 AA compliant

## Examples

### Primary Variant

\`\`\`tsx
<ComponentName variant="primary">Primary</ComponentName>
\`\`\`

### Different Sizes

\`\`\`tsx
<ComponentName size="sm">Small</ComponentName>
<ComponentName size="md">Medium</ComponentName>
<ComponentName size="lg">Large</ComponentName>
\`\`\`
```
