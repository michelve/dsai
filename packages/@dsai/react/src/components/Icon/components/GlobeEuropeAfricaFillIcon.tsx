/**
 * GlobeEuropeAfricaFillIcon
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
 * <Button startIcon={<GlobeEuropeAfricaFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <GlobeEuropeAfricaFillIcon aria-label="Activity indicator" />
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

export const GlobeEuropeAfricaFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m0 1a6.97 6.97 0 0 0-4.335 1.505l-.285.641a.847.847 0 0 0 1.48.816l.244-.368a.81.81 0 0 1 1.035-.275.81.81 0 0 0 .722 0l.262-.13a1 1 0 0 1 .775-.05l.984.34q.118.04.243.054c.784.093.855.377.694.801a.84.84 0 0 1-1.035.487l-.01-.003C8.273 4.663 7.747 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 3 1.935 1.89 3 3 1.146 1.194-1 4 2 4 1.75 0 3-3.5 3-4.5 0-.704 1.5-1 1-2.5-.097-.291-.396-.568-.642-.756-.173-.133-.206-.396-.051-.55a.334.334 0 0 1 .42-.043l1.085.724a.276.276 0 0 0 .348-.035c.15-.15.414-.083.488.117.16.428.445 1.046.847 1.354A7 7 0 0 0 8 1"
        />
      </svg>
    );
  }
);

GlobeEuropeAfricaFillIcon.displayName = 'GlobeEuropeAfricaFillIcon';
