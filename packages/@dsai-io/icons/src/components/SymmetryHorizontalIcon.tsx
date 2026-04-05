/**
 * SymmetryHorizontalIcon
 *
 * Bootstrap Icons - Symmetry horizontal
 * @category Graphics
 * @tags align
 * @see https://icons.getbootstrap.com/icons/symmetry-horizontal/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SymmetryHorizontalIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SymmetryHorizontalIcon aria-label="Symmetry horizontal" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const SymmetryHorizontalIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M13.5 7a.5.5 0 0 0 .24-.939l-11-6A.5.5 0 0 0 2 .5v6a.5.5 0 0 0 .5.5zm.485 2.376a.5.5 0 0 1-.246.563l-11 6A.5.5 0 0 1 2 15.5v-6a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .485.376M11.539 10H3v4.658z" />
      </svg>
    );
  }
);

SymmetryHorizontalIcon.displayName = 'SymmetryHorizontalIcon';
