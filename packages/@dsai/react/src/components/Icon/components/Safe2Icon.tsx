/**
 * Safe2Icon
 *
 * Bootstrap Icons - Safe2
 * @category Real world
 * @tags vault
 * @see https://icons.getbootstrap.com/icons/safe2/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<Safe2Icon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <Safe2Icon aria-label="Safe2" />
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

export const Safe2Icon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h12A1.5 1.5 0 0 1 16 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 1 14.5V14H.5a.5.5 0 0 1 0-1H1V9H.5a.5.5 0 0 1 0-1H1V4H.5a.5.5 0 0 1 0-1H1zM2.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5z" />
        <path d="M5.035 8h1.528q.072-.277.214-.516l-1.08-1.08A3.5 3.5 0 0 0 5.035 8m1.369-2.303 1.08 1.08q.24-.142.516-.214V5.035a3.5 3.5 0 0 0-1.596.662M9 5.035v1.528q.277.072.516.214l1.08-1.08A3.5 3.5 0 0 0 9 5.035m2.303 1.369-1.08 1.08q.142.24.214.516h1.528a3.5 3.5 0 0 0-.662-1.596M11.965 9h-1.528q-.072.277-.214.516l1.08 1.08A3.5 3.5 0 0 0 11.965 9m-1.369 2.303-1.08-1.08q-.24.142-.516.214v1.528a3.5 3.5 0 0 0 1.596-.662M8 11.965v-1.528a2 2 0 0 1-.516-.214l-1.08 1.08A3.5 3.5 0 0 0 8 11.965m-2.303-1.369 1.08-1.08A2 2 0 0 1 6.563 9H5.035c.085.593.319 1.138.662 1.596M4 8.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0m4.5-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
      </svg>
    );
  }
);

Safe2Icon.displayName = 'Safe2Icon';
