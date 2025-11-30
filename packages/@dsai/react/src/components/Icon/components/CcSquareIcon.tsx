/**
 * CcSquareIcon
 *
 * Bootstrap Icons - CC square
 * @category Shapes
 * @tags "creative commons"
 * @see https://icons.getbootstrap.com/icons/cc-square/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<CcSquareIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <CcSquareIcon aria-label="CC square" />
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

export const CcSquareIcon = forwardRef<SVGSVGElement, IconProps>(
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
          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.408 3.89c-.83 0-1.318.64-1.318 1.753v.742c0 1.108.479 1.727 1.318 1.727.69 0 1.138-.435 1.187-1.05h1.147v.114c-.058 1.147-1.029 1.938-2.343 1.938-1.612 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.75 2.518-2.75 1.319 0 2.29.812 2.343 1.999v.11H6.595c-.049-.638-.506-1.108-1.187-1.108Zm5.404 0c-.831 0-1.319.64-1.319 1.753v.742c0 1.108.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05h1.147v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.75 2.518-2.75 1.318 0 2.29.812 2.342 1.999v.11h-1.147c-.048-.638-.505-1.108-1.186-1.108Z"
        />
        <path
          fillRule="evenodd"
          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.408 3.89c-.83 0-1.318.64-1.318 1.753v.742c0 1.108.479 1.727 1.318 1.727.69 0 1.138-.435 1.187-1.05h1.147v.114c-.058 1.147-1.029 1.938-2.343 1.938-1.612 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.75 2.518-2.75 1.319 0 2.29.812 2.343 1.999v.11H6.595c-.049-.638-.506-1.108-1.187-1.108Zm5.404 0c-.831 0-1.319.64-1.319 1.753v.742c0 1.108.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05h1.147v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.75 2.518-2.75 1.318 0 2.29.812 2.342 1.999v.11h-1.147c-.048-.638-.505-1.108-1.186-1.108Z"
        />
      </svg>
    );
  }
);

CcSquareIcon.displayName = 'CcSquareIcon';
