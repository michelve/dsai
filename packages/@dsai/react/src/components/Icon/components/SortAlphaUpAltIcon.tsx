/**
 * SortAlphaUpAltIcon
 *
 * Bootstrap Icons - Sort alpha up alt
 * @category Sort and filter
 * @tags sort
 * @see https://icons.getbootstrap.com/icons/sort-alpha-up-alt/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SortAlphaUpAltIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SortAlphaUpAltIcon aria-label="Sort alpha up alt" />
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

export const SortAlphaUpAltIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
        <path
          fillRule="evenodd"
          d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"
        />
        <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
      </svg>
    );
  }
);

SortAlphaUpAltIcon.displayName = 'SortAlphaUpAltIcon';
