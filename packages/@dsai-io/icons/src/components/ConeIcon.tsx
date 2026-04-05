/**
 * ConeIcon
 *
 * Bootstrap Icons - Cone
 * @category Real world
 * @tags construction
 * @see https://icons.getbootstrap.com/icons/cone/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<ConeIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <ConeIcon aria-label="Cone" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const ConeIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M7.03 1.88c.252-1.01 1.688-1.01 1.94 0l2.905 11.62H14a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1h2.125z" />
      </svg>
    );
  }
);

ConeIcon.displayName = 'ConeIcon';
