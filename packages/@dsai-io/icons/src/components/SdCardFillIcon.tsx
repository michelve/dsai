/**
 * SdCardFillIcon
 *
 * Bootstrap Icons - SD card fill
 * @category Devices
 * @tags storage
 * @see https://icons.getbootstrap.com/icons/sd-card-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SdCardFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SdCardFillIcon aria-label="SD card fill" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const SdCardFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M12.5 0H5.914a1.5 1.5 0 0 0-1.06.44L2.439 2.853A1.5 1.5 0 0 0 2 3.914V14.5A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 12.5 0m-7 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m2 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75m2.75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 1.5 0m1.25-.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .75-.75" />
      </svg>
    );
  }
);

SdCardFillIcon.displayName = 'SdCardFillIcon';
