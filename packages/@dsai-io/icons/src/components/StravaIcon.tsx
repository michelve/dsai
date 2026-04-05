/**
 * StravaIcon
 *
 * Bootstrap Icons - Strava
 * @category Brand
 * @tags social
 * @see https://icons.getbootstrap.com/icons/strava/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<StravaIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <StravaIcon aria-label="Strava" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const StravaIcon = forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const {
      color,
      className,
      style,
      ariaLabel,
      computedAriaHidden,
      titleId,
      computedLabelledBy,
      titleContent,
      allowedProps,
    } = useIconProps(props);

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
        aria-labelledby={computedLabelledBy}
        focusable="false"
        {...allowedProps}
      >
        {titleContent && <title id={titleId}>{titleContent}</title>}
        <path d="M6.731 0 2 9.125h2.788L6.73 5.497l1.93 3.628h2.766zm4.694 9.125-1.372 2.756L8.66 9.125H6.547L10.053 16l3.484-6.875z" />
      </svg>
    );
  }
);

StravaIcon.displayName = 'StravaIcon';
