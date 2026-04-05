/**
 * NoiseReductionIcon
 *
 * Bootstrap Icons - Noise reduction
 * @category Graphics
 * @tags photo
 * @see https://icons.getbootstrap.com/icons/noise-reduction/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<NoiseReductionIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <NoiseReductionIcon aria-label="Noise reduction" />
 * ```
 */
import { forwardRef } from 'react';

import type { IconProps } from '../types';
import { useIconProps } from '../useIconProps';

export const NoiseReductionIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m.5-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-5 7a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1.5-1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1-1a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-3 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m.5-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m1-1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 0 1 12.83-3.875.5.5 0 1 0 .15.235q.197.322.359.667a.5.5 0 1 0 .359.932q.201.658.27 1.364a.5.5 0 1 0 .021.282 7 7 0 0 1-.091 1.592.5.5 0 1 0-.172.75 7 7 0 0 1-.418 1.091.5.5 0 0 0-.3.555 7 7 0 0 1-.296.454.5.5 0 0 0-.712.453c0 .111.036.214.098.297a7 7 0 0 1-.3.3.5.5 0 0 0-.75.614 7 7 0 0 1-.455.298.5.5 0 0 0-.555.3 7 7 0 0 1-1.092.417.5.5 0 1 0-.749.172 7 7 0 0 1-1.592.091.5.5 0 1 0-.282-.021 7 7 0 0 1-1.364-.27A.498.498 0 0 0 5.5 14a.5.5 0 0 0-.473.339 7 7 0 0 1-.668-.36A.5.5 0 0 0 5 13.5a.5.5 0 1 0-.875.33A7 7 0 0 1 1 8" />
      </svg>
    );
  }
);

NoiseReductionIcon.displayName = 'NoiseReductionIcon';
