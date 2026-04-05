/**
 * FlaskFlorenceFillIcon
 *
 * Bootstrap Icons - Flask florence fill
 * @category Real world
 * @tags beaker
 * @see https://icons.getbootstrap.com/icons/flask-florence-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<FlaskFlorenceFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <FlaskFlorenceFillIcon aria-label="Flask florence fill" />
 * ```
 */
import { forwardRef } from 'react';

import type { IconProps } from '../types';
import { useIconProps } from '../useIconProps';

export const FlaskFlorenceFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="m10.5 0 .1.01a.5.5 0 0 1-.1.99H10v5.417c.517.226.986.538 1.394.916l.043.038.14.14a6 6 0 0 1 .303.34l.101.128q.045.06.088.122a5 5 0 0 1 .26.4l.066.12a5 5 0 0 1 .16.32q.029.062.053.124.035.08.067.163.115.3.19.62l.024.111a5 5 0 0 1 .096.68Q13 10.82 13 11l-.007.257A5 5 0 0 1 8 16l-.257-.007A5 5 0 0 1 6 6.417V1h-.5a.5.5 0 0 1 0-1zM8 6a.5.5 0 0 0 0 1h1.065A.5.5 0 0 1 9 6.756V6zm0-2a.5.5 0 0 0 0 1h1V4zm0-2a.5.5 0 0 0 0 1h1V2z" />
      </svg>
    );
  }
);

FlaskFlorenceFillIcon.displayName = 'FlaskFlorenceFillIcon';
