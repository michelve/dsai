/**
 * React Patterns - Code Examples
 *
 * Standard React component patterns for DSAi design system.
 */

import { forwardRef, memo, useCallback, useId, useMemo, type ReactNode } from 'react';

// =============================================================================
// COMPONENT PATTERN
// =============================================================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Utility for class name composition
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Primary action button component.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', disabled = false, className, children, onClick, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          'dsai-btn',
          `dsai-btn--${variant}`,
          `dsai-btn--${size}`,
          disabled && 'dsai-btn--disabled',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  })
);

Button.displayName = 'Button';

// =============================================================================
// HOOKS PATTERNS
// =============================================================================

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

/**
 * Form field with auto-generated IDs using useId.
 */
export const FormField = memo(function FormField({ label, error, children }: FormFieldProps) {
  // ✅ Always use useId for generated IDs
  const id = useId();
  const inputId = `${id}-input`;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;

  return (
    <div className="dsai-form-field">
      <label id={labelId} htmlFor={inputId}>
        {label}
      </label>
      <div aria-describedby={error ? errorId : undefined}>{children}</div>
      {error && (
        <span id={errorId} role="alert" className="dsai-form-field__error">
          {error}
        </span>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// =============================================================================
// MEMOIZATION PATTERNS
// =============================================================================

interface DataListProps {
  items: Array<{ id: string; name: string; value: number }>;
  onItemClick?: (id: string) => void;
}

export const DataList = memo(function DataList({ items, onItemClick }: DataListProps) {
  // ✅ Memoize expensive computations
  const processedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      displayValue: `${item.name}: ${item.value.toLocaleString()}`,
    }));
  }, [items]);

  // ✅ Stable callbacks with useCallback
  const handleItemClick = useCallback(
    (id: string) => {
      onItemClick?.(id);
    },
    [onItemClick]
  );

  return (
    <ul className="dsai-data-list">
      {processedItems.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => handleItemClick(item.id)}
            className="dsai-data-list__item"
          >
            {item.displayValue}
          </button>
        </li>
      ))}
    </ul>
  );
});

DataList.displayName = 'DataList';

// =============================================================================
// ACCESSIBLE INTERACTIVE PATTERN
// =============================================================================

interface ToggleButtonProps {
  pressed: boolean;
  onToggle: () => void;
  children: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}

export const ToggleButton = memo(
  forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
    { pressed, onToggle, children, ariaLabel, disabled = false },
    ref
  ) {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) {
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      },
      [disabled, onToggle]
    );

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        aria-pressed={pressed}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'dsai-toggle-btn',
          pressed && 'dsai-toggle-btn--pressed',
          disabled && 'dsai-toggle-btn--disabled'
        )}
        onClick={disabled ? undefined : onToggle}
        onKeyDown={handleKeyDown}
      >
        {children}
      </button>
    );
  })
);

ToggleButton.displayName = 'ToggleButton';
