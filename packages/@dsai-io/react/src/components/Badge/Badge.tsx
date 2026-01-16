import { forwardRef, memo, useMemo } from 'react';

import { cn } from '../../utils';

import type { BadgeProps } from './Badge.types';

/**
 * Badge Component
 *
 * A Bootstrap 5 badge component for displaying labels, status indicators, and counts.
 * Uses native Bootstrap classes for consistent styling with the design system.
 *
 * Performance Features:
 * - Memoized component to prevent unnecessary re-renders
 * - Memoized class name construction
 * - Memoized status calculations (hasVisibleContent)
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Icons are hidden from screen readers (aria-hidden="true")
 * - Decorative dots are hidden when badge has content
 * - Dev warning when dot-only badge lacks aria-label
 * - Semantic HTML with proper roles
 * - aria-label support for status indicators
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
 * // Status indicator (dot only) - requires aria-label
 * <Badge variant="success" dot aria-label="Online status" />
 * ```
 */
function BadgeComponent(
  {
    children,
    variant = 'primary',
    pill = false,
    dot = false,
    icon,
    className = '',
    style,
    'aria-label': ariaLabel,
    'data-testid': dataTestId,
    'data-test': dataTest,
    title,
    id,
    as: Component = 'span',
  }: BadgeProps,
  ref: React.ForwardedRef<HTMLSpanElement | HTMLDivElement>
): React.JSX.Element {
  // Determine if badge has visible content
  const hasVisibleContent = useMemo(() => {
    return !!children || !!icon;
  }, [children, icon]);

  // Memoize class name construction
  const bootstrapClasses = useMemo(
    () =>
      cn(
        'badge', // Base Bootstrap badge class
        `text-bg-${variant}`, // Background color: text-bg-primary, text-bg-secondary, etc.
        pill && 'rounded-pill', // Pill shape
        className // Allow additional custom classes
      ),
    [variant, pill, className]
  );

  // Dev warning: dot-only badge without aria-label
  // Shows in development and test environments
  const isDevelopmentOrTest =
    typeof process !== 'undefined' &&
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
    (process.env?.['NODE_ENV'] === 'development' || process.env?.['NODE_ENV'] === 'test');
  if (isDevelopmentOrTest && dot && !hasVisibleContent && !ariaLabel) {
    console.warn(
      'Badge: Dot-only badges must have an aria-label for accessibility. ' +
        'Example: <Badge dot aria-label="Online status" />'
    );
  }

  const role = dot && !hasVisibleContent ? 'status' : undefined;

  const badgeContent = (
    <>
      {/* Dot indicator */}
      {dot && (
        <span
          className="d-inline-block rounded-circle me-1"
          style={{
            width: '0.5em',
            height: '0.5em',
            backgroundColor: 'currentColor',
          }}
          aria-hidden={hasVisibleContent ? 'true' : undefined}
        />
      )}
      {/* Icon - hidden from screen readers as it's decorative */}
      {icon && (
        <span className="me-1 d-inline-flex align-items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {/* Badge content */}
      {children}
    </>
  );

  // Build aria props object - always pass aria-label when provided; include role for status badges
  const ariaProps = role
    ? { role, 'aria-label': ariaLabel }
    : ariaLabel
      ? { 'aria-label': ariaLabel }
      : {};

  if (Component === 'div') {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={bootstrapClasses}
        style={style}
        id={id}
        title={title}
        data-testid={dataTestId}
        data-test={dataTest}
        {...ariaProps}
      >
        {badgeContent}
      </div>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={bootstrapClasses}
      style={style}
      id={id}
      title={title}
      data-testid={dataTestId}
      data-test={dataTest}
      {...ariaProps}
    >
      {badgeContent}
    </span>
  );
}

BadgeComponent.displayName = 'Badge';

// Create the Badge component with forwardRef and memo
const BadgeWithRef = forwardRef(BadgeComponent);
BadgeWithRef.displayName = 'Badge';

export const Badge = memo(BadgeWithRef);
Badge.displayName = 'Badge';
