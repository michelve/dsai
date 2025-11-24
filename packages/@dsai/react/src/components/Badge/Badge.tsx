import type { BadgeProps } from './Badge.types';

/**
 * Badge Component
 *
 * A Bootstrap 5 badge component for displaying labels, status indicators, and counts.
 * Uses native Bootstrap classes for consistent styling with the design system.
 *
 * @see https://getbootstrap.com/docs/5.3/components/badge/
 *
 * @example
 * ```tsx
 * // Basic badge
 * <Badge variant="primary">New</Badge>
 *
 * // Pill badge
 * <Badge variant="success" pill>Active</Badge>
 *
 * // Badge with dot indicator
 * <Badge variant="danger" dot>Alerts</Badge>
 *
 * // Notification badge on button
 * <Button className="position-relative">
 *   Inbox
 *   <Badge
 *     variant="danger"
 *     pill
 *     className="position-absolute top-0 start-100 translate-middle"
 *   >
 *     99+
 *   </Badge>
 * </Button>
 *
 * // Status indicator (dot only)
 * <Badge variant="success" dot aria-label="Online status" />
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Uses semantic HTML (`<span>` or `<div>`)
 * - Supports `aria-label` for screen readers
 * - Sufficient color contrast via Bootstrap theme colors
 * - Visible focus indicators when used as interactive element
 */
export function Badge({
  children,
  variant = 'primary',
  pill = false,
  dot = false,
  icon,
  className = '',
  style,
  'aria-label': ariaLabel,
  id,
  as: Component = 'span',
}: BadgeProps): JSX.Element {
  // Build Bootstrap class names
  // Bootstrap badge classes: badge, text-bg-{variant}, rounded-pill
  const bootstrapClasses = [
    'badge', // Base Bootstrap badge class
    `text-bg-${variant}`, // Background color: text-bg-primary, text-bg-secondary, etc.
    pill && 'rounded-pill', // Pill shape
    className, // Allow additional custom classes
  ]
    .filter(Boolean)
    .join(' ');

  // Determine if badge has visible content
  const hasVisibleContent = children || icon;

  return (
    <Component
      className={bootstrapClasses}
      style={style}
      id={id}
      aria-label={ariaLabel}
      // Use role="status" for status indicators (dot badges)
      role={dot && !hasVisibleContent ? 'status' : undefined}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className="d-inline-block rounded-circle me-1"
          style={{
            width: '0.5em',
            height: '0.5em',
            backgroundColor: 'currentColor',
          }}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      {icon && <span className="me-1 d-inline-flex align-items-center">{icon}</span>}

      {/* Badge content */}
      {children}
    </Component>
  );
}

Badge.displayName = 'Badge';
