/**
 * CcCircleFillIcon
 *
 * Bootstrap Icons - CC circle fill
 * @category Shapes
 * @tags "creative commons"
 * @see https://icons.getbootstrap.com/icons/cc-circle-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<CcCircleFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <CcCircleFillIcon aria-label="CC circle fill" />
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

export const CcCircleFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
    let computedAriaHidden: boolean | undefined = ariaHidden;
    if (isDecorative) {
      computedAriaHidden = true;
    } else if (ariaLabel) {
      computedAriaHidden = undefined;
    }

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
        focusable="false"
        {...allowedProps}
      >
        <title>{title || ariaLabel}</title>
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.408 5.89c.681 0 1.138.47 1.187 1.107h1.147v-.11c-.053-1.187-1.024-2-2.343-2-1.604 0-2.518 1.05-2.518 2.751v.747c0 1.7.906 2.73 2.518 2.73 1.314 0 2.285-.792 2.343-1.939v-.114H6.595c-.049.615-.497 1.05-1.187 1.05-.84 0-1.318-.62-1.318-1.727v-.742c0-1.112.488-1.754 1.318-1.754Zm5.404 0c.68 0 1.138.47 1.186 1.107h1.147v-.11c-.053-1.187-1.024-2-2.342-2-1.604 0-2.518 1.05-2.518 2.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727v-.742c0-1.112.488-1.754 1.319-1.754Z" />
      </svg>
    );
  }
);

CcCircleFillIcon.displayName = 'CcCircleFillIcon';
