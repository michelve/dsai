/**
 * Suitcase2Icon
 *
 * Bootstrap Icons - Suitcase2
 * @category Travel
 * @tags luggage
 * @see https://icons.getbootstrap.com/icons/suitcase2/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<Suitcase2Icon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <Suitcase2Icon aria-label="Suitcase2" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const Suitcase2Icon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M6.5 0a.5.5 0 0 0-.5.5V3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 1.031 1.75A1.003 1.003 0 0 0 5 16a1 1 0 0 0 1-1h4a1 1 0 1 0 1.969-.25A2 2 0 0 0 13 13V5a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-.5-.5zM9 3H7V1h2zm3 10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7h8zM5 4h6a1 1 0 0 1 1 1v1H4V5a1 1 0 0 1 1-1" />
      </svg>
    );
  }
);

Suitcase2Icon.displayName = 'Suitcase2Icon';
