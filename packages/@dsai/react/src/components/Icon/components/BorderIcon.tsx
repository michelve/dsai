/**
 * BorderIcon
 *
 * Bootstrap Icons - Border
 * @category UI and keyboard
 * @tags borders
 * @see https://icons.getbootstrap.com/icons/border/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<BorderIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <BorderIcon aria-label="Border" />
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

export const BorderIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M0 0h.969v.5H1v.469H.969V1H.5V.969H0zm2.844 1h-.938V0h.938zm1.875 0H3.78V0h.938v1zm1.875 0h-.938V0h.938zm.937 0V.969H7.5V.5h.031V0h.938v.5H8.5v.469h-.031V1zm2.813 0h-.938V0h.938zm1.875 0h-.938V0h.938zm1.875 0h-.938V0h.938zM15.5 1h-.469V.969H15V.5h.031V0H16v.969h-.5zM1 1.906v.938H0v-.938zm6.5.938v-.938h1v.938zm7.5 0v-.938h1v.938zM1 3.78v.938H0V3.78zm6.5.938V3.78h1v.938zm7.5 0V3.78h1v.938zM1 5.656v.938H0v-.938zm6.5.938v-.938h1v.938zm7.5 0v-.938h1v.938zM.969 8.5H.5v-.031H0V7.53h.5V7.5h.469v.031H1v.938H.969zm1.875 0h-.938v-1h.938zm1.875 0H3.78v-1h.938v1zm1.875 0h-.938v-1h.938zm1.875-.031V8.5H7.53v-.031H7.5V7.53h.031V7.5h.938v.031H8.5v.938zm1.875.031h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.406 0h-.469v-.031H15V7.53h.031V7.5h.469v.031h.5v.938h-.5zM0 10.344v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM0 12.22v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM0 14.094v-.938h1v.938zm7.5 0v-.938h1v.938zm8.5-.938v.938h-1v-.938zM.969 16H0v-.969h.5V15h.469v.031H1v.469H.969zm1.875 0h-.938v-1h.938zm1.875 0H3.78v-1h.938v1zm1.875 0h-.938v-1h.938zm.937 0v-.5H7.5v-.469h.031V15h.938v.031H8.5v.469h-.031v.5zm2.813 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm1.875 0h-.938v-1h.938zm.937 0v-.5H15v-.469h.031V15h.469v.031h.5V16z" />
      </svg>
    );
  }
);

BorderIcon.displayName = 'BorderIcon';
