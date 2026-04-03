/**
 * LuggageIcon
 *
 * Bootstrap Icons - Luggage
 * @category Travel
 * @tags luggage
 * @see https://icons.getbootstrap.com/icons/luggage/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<LuggageIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <LuggageIcon aria-label="Luggage" />
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

export const LuggageIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M2.5 1a.5.5 0 0 0-.5.5V5h-.5A1.5 1.5 0 0 0 0 6.5v7a1.5 1.5 0 0 0 1 1.415v.335a.75.75 0 0 0 1.5 0V15H4v-1H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V7h1v-.5A1.5 1.5 0 0 0 6.5 5H6V1.5a.5.5 0 0 0-.5-.5zM5 5H3V2h2z" />
        <path d="M3 7.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0zM11 6a1.5 1.5 0 0 1 1.5 1.5V8h2A1.5 1.5 0 0 1 16 9.5v5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 14.5v-5A1.5 1.5 0 0 1 6.5 8h2v-.5A1.5 1.5 0 0 1 10 6zM9.5 7.5V8h2v-.5A.5.5 0 0 0 11 7h-1a.5.5 0 0 0-.5.5M6 9.5v5a.5.5 0 0 0 .5.5H7V9h-.5a.5.5 0 0 0-.5.5m7 5.5V9H8v6zm1.5 0a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5H14v6z" />
      </svg>
    );
  }
);

LuggageIcon.displayName = 'LuggageIcon';
