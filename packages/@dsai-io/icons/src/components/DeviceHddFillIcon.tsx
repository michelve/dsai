/**
 * DeviceHddFillIcon
 *
 * Bootstrap Icons - Device HDD fill
 * @category Devices
 * @tags drive
 * @see https://icons.getbootstrap.com/icons/device-hdd-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<DeviceHddFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <DeviceHddFillIcon aria-label="Device HDD fill" />
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

export const DeviceHddFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M8.785 9.896A3.001 3.001 0 0 0 8 4a3 3 0 0 0-.891 5.865c.667-.44 1.396-.91 1.955-1.268.224-.144.483.115.34.34zM9 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm9 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-9.5.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1M4 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2.882 11.177a1.102 1.102 0 0 1-1.56-1.559c.1-.098.396-.314.795-.588a4 4 0 1 1 1.946.47c-.537.813-1.02 1.515-1.181 1.677" />
      </svg>
    );
  }
);

DeviceHddFillIcon.displayName = 'DeviceHddFillIcon';
