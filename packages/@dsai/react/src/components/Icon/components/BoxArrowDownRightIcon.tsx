/**
 * BoxArrowDownRightIcon
 *
 * Bootstrap Icons - Box arrow bottom-right
 * @category Box arrows
 * @tags arrow
 * @see https://icons.getbootstrap.com/icons/box-arrow-down-right/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<BoxArrowDownRightIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <BoxArrowDownRightIcon aria-label="Box arrow bottom-right" />
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

export const BoxArrowDownRightIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fillRule="evenodd"
          d="M8.636 12.5a.5.5 0 0 1-.5.5H1.5A1.5 1.5 0 0 1 0 11.5v-10A1.5 1.5 0 0 1 1.5 0h10A1.5 1.5 0 0 1 13 1.5v6.636a.5.5 0 0 1-1 0V1.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h6.636a.5.5 0 0 1 .5.5"
        />
        <path
          fillRule="evenodd"
          d="M16 15.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1 0-1h3.793L6.146 6.854a.5.5 0 1 1 .708-.708L15 14.293V10.5a.5.5 0 0 1 1 0z"
        />
      </svg>
    );
  }
);

BoxArrowDownRightIcon.displayName = 'BoxArrowDownRightIcon';
