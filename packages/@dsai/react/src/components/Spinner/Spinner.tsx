import type { SpinnerProps } from './Spinner.types';

/**
 * Spinner Component
 *
 * A Bootstrap 5 spinner component for indicating loading states.
 * Uses native Bootstrap classes for consistent styling with the design system.
 *
 * @see https://getbootstrap.com/docs/5.3/components/spinners/
 *
 * @example
 * ```tsx
 * // Default border spinner
 * <Spinner />
 *
 * // Growing spinner with color
 * <Spinner animation="grow" variant="primary" />
 *
 * // Small spinner for buttons
 * <Spinner size="sm" as="span" />
 *
 * // In a button
 * <Button disabled>
 *   <Spinner size="sm" as="span" className="me-2" />
 *   Loading...
 * </Button>
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses `role="status"` for screen reader announcement
 * - Includes visually hidden text for screen readers
 * - Respects `prefers-reduced-motion` via Bootstrap CSS
 */
export function Spinner({
  animation = 'border',
  size,
  variant,
  className = '',
  style,
  label = 'Loading...',
  as: Component = 'div',
  ...rest
}: SpinnerProps): JSX.Element {
  // Build Bootstrap class names
  // Bootstrap spinner classes: spinner-border, spinner-grow, spinner-border-sm, text-{color}
  const bootstrapClasses = [
    `spinner-${animation}`, // spinner-border or spinner-grow
    size === 'sm' && `spinner-${animation}-sm`, // spinner-border-sm or spinner-grow-sm
    variant && `text-${variant}`, // text-primary, text-secondary, etc.
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={bootstrapClasses}
      role="status"
      style={style}
      aria-label={label}
      {...rest}
    >
      <span className="visually-hidden">{label}</span>
    </Component>
  );
}

Spinner.displayName = 'Spinner';
