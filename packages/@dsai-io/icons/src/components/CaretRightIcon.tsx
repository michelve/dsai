/**
 * CaretRightIcon
 *
 * Bootstrap Icons - Caret right
 * @category Carets
 * @tags caret
 * @see https://icons.getbootstrap.com/icons/caret-right/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<CaretRightIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <CaretRightIcon aria-label="Caret right" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const CaretRightIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
      </svg>
    );
  }
);

CaretRightIcon.displayName = 'CaretRightIcon';
