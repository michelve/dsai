/**
 * SignMergeLeftIcon
 *
 * Bootstrap Icons - Sign merge left
 * @category Transportation
 * @tags road
 * @see https://icons.getbootstrap.com/icons/sign-merge-left/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SignMergeLeftIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SignMergeLeftIcon aria-label="Sign merge left" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const SignMergeLeftIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M7.25 6v1q-.211.451-.588.95c-.537.716-1.259 1.44-2.016 2.196l.708.708.015-.016c.652-.652 1.33-1.33 1.881-2.015V12h1.5V6h1.216a.25.25 0 0 0 .192-.41L8.192 3.23a.25.25 0 0 0-.384 0L5.842 5.59a.25.25 0 0 0 .192.41z" />
        <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zm-1.4.7a.495.495 0 0 1 .7 0l6.516 6.515a.495.495 0 0 1 0 .7L8.35 14.866a.495.495 0 0 1-.7 0L1.134 8.35a.495.495 0 0 1 0-.7L7.65 1.134Z" />
      </svg>
    );
  }
);

SignMergeLeftIcon.displayName = 'SignMergeLeftIcon';
