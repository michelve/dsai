/* eslint jsx-a11y/no-autofocus: 0 */
/* eslint-disable jsx-a11y/no-autofocus */
import { forwardRef } from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from './Button.types';

/**
 * Button Component
 *
 * A versatile, accessible button component built with Bootstrap 5 design tokens.
 * Supports multiple variants, sizes, and states with full WCAG 2.2 AA compliance.
 *
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Outline variant
 * <Button variant="outline-secondary" size="lg">
 *   Large Outline Button
 * </Button>
 *
 * // Full width button
 * <Button variant="success" fullWidth>
 *   Full Width
 * </Button>
 *
 * // With ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * <Button ref={buttonRef} onClick={handleClick}>
 *   Button with Ref
 * </Button>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Semantic HTML `<button>` element
 * - Keyboard navigation (Enter, Space)
 * - Focus indicators (visible focus ring)
 * - Disabled state with aria-disabled
 * - Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
 * - Touch target size ≥44×44px (WCAG 2.2 2.5.8)
 * - Focus Not Obscured (WCAG 2.2 2.4.11, 2.4.12)
 * - Consistent Help (WCAG 2.2 3.2.6)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      onClick,
      className = '',
      type = 'button',
      fullWidth = false,
      style,
      id,
      name,
      value,
      tabIndex,
      autoFocus = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      ...rest
    },
    ref
  ) => {
    // Build class names
    const classNames = [
      styles['button'],
      styles[`button--${variant}`],
      styles[`button--${size}`],
      fullWidth && styles['button--full-width'],
      disabled && styles['button--disabled'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={disabled}
        onClick={onClick}
        style={style}
        id={id}
        name={name}
        value={value}
        tabIndex={tabIndex}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
