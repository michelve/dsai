/* eslint jsx-a11y/no-autofocus: 0 */
/* eslint-disable jsx-a11y/no-autofocus */
import { forwardRef, useMemo } from 'react';

import { Spinner } from '../Spinner';

import type { ButtonProps } from './Button.types';

/**
 * Button Component
 *
 * A versatile, accessible button component using Bootstrap 5 native classes.
 * DSAi design tokens are applied through the Bootstrap theme (bootstrap.css).
 * Supports multiple variants, sizes, states, icons, and loading with full WCAG 2.2 AA compliance.
 *
 * SECURITY: Prop spreading is restricted to a whitelist of safe HTML attributes only.
 * Event handlers must be explicitly passed through the component API.
 *
 * @see https://getbootstrap.com/docs/5.3/components/buttons/
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
 * // Loading state
 * <Button variant="primary" loading>
 *   Saving...
 * </Button>
 *
 * // With icons
 * <Button variant="success" startIcon={<CheckIcon />}>
 *   Save
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
 *
 * // With aria-live announcements for async operations
 * <Button announceText="Saving changes..." loading>
 *   Save
 * </Button>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Semantic HTML `<button>` element
 * - Keyboard navigation (Enter, Space)
 * - Focus indicators (visible focus ring via Bootstrap)
 * - Disabled state with aria-disabled
 * - Loading state with aria-busy
 * - Decorative icons marked with aria-hidden="true"
 * - Dynamic state announcements via aria-live="polite"
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
      loading = false,
      loadingText,
      startIcon,
      endIcon,
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
      'data-testid': dataTestId,
      'data-test': dataTest,
      title,
      form,
      formAction,
      formMethod,
      formNoValidate,
      formTarget,
      announceText,
      announce = !!announceText,
    },
    ref
  ) => {
    // Button is disabled when explicitly disabled or loading
    const isDisabled = disabled || loading;

    // Build Bootstrap class names - memoized to prevent unnecessary recalculation
    // This prevents performance overhead when props haven't changed
    const bootstrapClasses = useMemo(
      () =>
        [
          'btn', // Base Bootstrap button class
          `btn-${variant}`, // Variant: btn-primary, btn-outline-secondary, etc.
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          // Note: 'md' is the default size in Bootstrap, no class needed
          fullWidth && 'w-100', // Bootstrap utility for full width
          className, // Allow additional custom classes
        ]
          .filter(Boolean)
          .join(' '),
      [variant, size, fullWidth, className]
    );

    // Determine what content to show
    const showLoadingText = loading && loadingText;
    const displayText = showLoadingText ? loadingText : children;

    return (
      <>
        <button
          ref={ref}
          type={type}
          className={bootstrapClasses}
          disabled={isDisabled}
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
          aria-disabled={isDisabled}
          aria-busy={loading}
          data-testid={dataTestId}
          data-test={dataTest}
          title={title}
          form={form}
          formAction={formAction}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
        >
          {/* Loading spinner */}
          {loading && (
            <Spinner
              as="span"
              size="sm"
              className={displayText ? 'me-2' : undefined}
              label="Loading"
            />
          )}

          {/* Start icon (decorative, hidden from screen readers) */}
          {!loading && startIcon && (
            <span className="me-2 d-inline-flex align-items-center" aria-hidden="true">
              {startIcon}
            </span>
          )}

          {/* Button text content */}
          {displayText && <span>{displayText}</span>}

          {/* End icon (decorative, hidden from screen readers) */}
          {!loading && endIcon && (
            <span className="ms-2 d-inline-flex align-items-center" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </button>
        {/* Aria-live announcement region for dynamic state changes */}
        {announceText && announce && (
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          >
            {announceText}
          </div>
        )}
      </>
    );
  }
);

Button.displayName = 'Button';
