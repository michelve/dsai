/**
 * DeviceSsdIcon
 *
 * Bootstrap Icons - Device SSD
 * @category Devices
 * @tags "solid state"
 * @see https://icons.getbootstrap.com/icons/device-ssd/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<DeviceSsdIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <DeviceSsdIcon aria-label="Device SSD" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const DeviceSsdIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M4.75 4a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h6.5a.75.75 0 0 0 .75-.75v-3.5a.75.75 0 0 0-.75-.75zM5 8V5h6v3zm0-5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m7 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4.5 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m7 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm11 12V2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2a1 1 0 0 0 1-1m-7.25 1v-2H5v2zm1.75 0v-2h-.75v2zm1.75 0v-2H8.5v2zM11 13h-.75v2H11z" />
      </svg>
    );
  }
);

DeviceSsdIcon.displayName = 'DeviceSsdIcon';
