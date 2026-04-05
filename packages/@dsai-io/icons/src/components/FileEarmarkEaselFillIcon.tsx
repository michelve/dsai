/**
 * FileEarmarkEaselFillIcon
 *
 * Bootstrap Icons - File earmark easel fill
 * @category Files and folders
 * @tags slides
 * @see https://icons.getbootstrap.com/icons/file-earmark-easel-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<FileEarmarkEaselFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <FileEarmarkEaselFillIcon aria-label="File earmark easel fill" />
 * ```
 */
import { forwardRef } from 'react';

import type { IconProps } from '../types';
import { useIconProps } from '../useIconProps';

export const FileEarmarkEaselFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" />
        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M8.5 6h2A1.5 1.5 0 0 1 12 7.5v2a1.5 1.5 0 0 1-1.5 1.5h-.473l.447 1.342a.5.5 0 0 1-.948.316L8.973 11H8.5v1a.5.5 0 0 1-1 0v-1h-.473l-.553 1.658a.5.5 0 1 1-.948-.316L5.973 11H5.5A1.5 1.5 0 0 1 4 9.5v-2A1.5 1.5 0 0 1 5.5 6h2a.5.5 0 0 1 1 0" />
      </svg>
    );
  }
);

FileEarmarkEaselFillIcon.displayName = 'FileEarmarkEaselFillIcon';
