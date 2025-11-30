/**
 * CompassFillIcon
 *
 * Bootstrap Icons - Compass fill
 * @category Geo
 * @tags direction
 * @see https://icons.getbootstrap.com/icons/compass-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<CompassFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <CompassFillIcon aria-label="Compass fill" />
 * ```
 */
import { forwardRef, useMemo } from 'react';
import type { IconProps } from '../types';

const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;

export const CompassFillIcon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 16,
      color = 'currentColor',
      className,
      title,
      style: propStyle,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    ref
  ) => {
    const isDecorative = !ariaLabel && !title;

    // Improved A11y: Prevent contradictory aria-hidden when labelled
    // - Decorative → always hidden
    // - With aria-label → never hidden (ignore user's aria-hidden)
    // - With title only → respect user's aria-hidden
    const computedAriaHidden = isDecorative ? true : ariaLabel ? undefined : ariaHidden;

    const style = useMemo(
      () => ({
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        ...propStyle,
      }),
      [size, propStyle]
    );

    const allowedProps: Record<string, unknown> = {};
    for (const key of ALLOWED_PROPS) {
      if (key in rest) {
        allowedProps[key] = rest[key as keyof typeof rest];
      }
    }

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill={color}
        className={className}
        style={style}
        aria-hidden={computedAriaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : undefined}
        focusable="false"
        {...allowedProps}
      >
        {title && <title>{title}</title>}
        <path d="M15.5 8.516a7.5 7.5 0 1 1-9.462-7.24A1 1 0 0 1 7 0h2a1 1 0 0 1 .962 1.276 7.5 7.5 0 0 1 5.538 7.24m-3.61-3.905L6.94 7.439 4.11 12.39l4.95-2.828 2.828-4.95z" />
      </svg>
    );
  }
);

CompassFillIcon.displayName = 'CompassFillIcon';
