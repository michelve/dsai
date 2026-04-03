/**
 * Mouse2Icon
 *
 * Bootstrap Icons - Mouse2
 * @category Devices
 * @tags mice
 * @see https://icons.getbootstrap.com/icons/mouse2/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<Mouse2Icon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <Mouse2Icon aria-label="Mouse2" />
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

export const Mouse2Icon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M3 5.188C3 2.341 5.22 0 8 0s5 2.342 5 5.188v5.625C13 13.658 10.78 16 8 16s-5-2.342-5-5.188V5.189zm4.5-4.155C5.541 1.289 4 3.035 4 5.188V5.5h3.5zm1 0V5.5H12v-.313c0-2.152-1.541-3.898-3.5-4.154M12 6.5H4v4.313C4 13.145 5.81 15 8 15s4-1.855 4-4.188z" />
      </svg>
    );
  }
);

Mouse2Icon.displayName = 'Mouse2Icon';
