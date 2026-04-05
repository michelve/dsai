/**
 * Calendar3EventFillIcon
 *
 * Bootstrap Icons - Calendar3 event fill
 * @category Date and time
 * @tags date
 * @see https://icons.getbootstrap.com/icons/calendar3-event-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<Calendar3EventFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <Calendar3EventFillIcon aria-label="Calendar3 event fill" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const Calendar3EventFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3h16zm-3-9a1 1 0 1 0 0 2 1 1 0 0 0 0-2m1-5a2 2 0 0 1 2 2H0a2 2 0 0 1 2-2z" />
      </svg>
    );
  }
);

Calendar3EventFillIcon.displayName = 'Calendar3EventFillIcon';
