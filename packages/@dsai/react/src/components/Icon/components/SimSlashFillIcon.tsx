/**
 * SimSlashFillIcon
 *
 * Bootstrap Icons - React Component
 * @see https://icons.getbootstrap.com/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SimSlashFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SimSlashFillIcon aria-label="Activity indicator" />
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

export const SimSlashFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="m11.646.44.897.896-1.703 1.703A1.5 1.5 0 0 0 10.5 3h-5A1.5 1.5 0 0 0 4 4.5v5.379l-2 2V1.5A1.5 1.5 0 0 1 3.5 0h7.086a1.5 1.5 0 0 1 1.06.44M8.5 5.378 9.879 4H8.5zM5 8.879 6.879 7H5zm6-1.758L9.121 9H11zm-3.5 3.5L6.121 12H7.5zM5.5 13q-.175 0-.34-.039L2.502 15.62c.265.236.615.38.998.38h9a1.5 1.5 0 0 0 1.5-1.5V4.121l-2 2V11.5a1.5 1.5 0 0 1-1.5 1.5zM5 4.5a.5.5 0 0 1 .5-.5h2v2H5zM8.5 10H11v1.5a.5.5 0 0 1-.5.5h-2zm6.354-8.146a.5.5 0 0 0-.708-.708l-13 13a.5.5 0 0 0 .708.708z" />
      </svg>
    );
  }
);

SimSlashFillIcon.displayName = 'SimSlashFillIcon';
