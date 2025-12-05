import { cn } from '../../utils';

import type { SpinnerProps } from './Spinner.types';

/**
 * Size map for custom spinner sizes
 * Bootstrap only provides 'sm', we extend with xs, lg, xl
 */
const SIZE_STYLES = {
  xs: { width: '0.75rem', height: '0.75rem' },
  // sm uses Bootstrap's native spinner-*-sm class
  lg: { width: '3rem', height: '3rem' },
  xl: { width: '4rem', height: '4rem' },
};

const resolveCustomSizeStyle = (
  size?: SpinnerProps['size']
): { width: string; height: string } | undefined => {
  switch (size) {
    case 'xs':
      return SIZE_STYLES.xs;
    case 'lg':
      return SIZE_STYLES.lg;
    case 'xl':
      return SIZE_STYLES.xl;
    default:
      return undefined;
  }
};

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
 * // Extra large spinner
 * <Spinner size="xl" variant="primary" />
 *
 * // Centered spinner
 * <Spinner centered variant="primary" />
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
  centered = false,
  ...rest
}: SpinnerProps): React.JSX.Element {
  // Build Bootstrap class names
  // Bootstrap spinner classes: spinner-border, spinner-grow, spinner-border-sm, text-{color}
  const bootstrapClasses = cn(
    `spinner-${animation}`, // spinner-border or spinner-grow
    size === 'sm' && `spinner-${animation}-sm`, // spinner-border-sm or spinner-grow-sm
    variant && `text-${variant}`, // text-primary, text-secondary, etc.
    className
  );

  // Custom size styles for xs, lg, xl (Bootstrap only has sm)
  const customSizeStyle = resolveCustomSizeStyle(size);

  const spinner = (
    <Component
      className={bootstrapClasses}
      role="status"
      style={{ ...customSizeStyle, ...style }}
      aria-label={label}
      {...rest}
    >
      <span className="visually-hidden">{label}</span>
    </Component>
  );

  // Wrap in centering container if centered prop is true
  if (centered) {
    return <div className="d-flex justify-content-center align-items-center w-100">{spinner}</div>;
  }

  return spinner;
}

Spinner.displayName = 'Spinner';
