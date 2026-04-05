/**
 * EmojiSurpriseFillIcon
 *
 * Bootstrap Icons - Emoji surprise fill
 * @category Emoji
 * @tags emoticon
 * @see https://icons.getbootstrap.com/icons/emoji-surprise-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<EmojiSurpriseFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <EmojiSurpriseFillIcon aria-label="Emoji surprise fill" />
 * ```
 */
import { forwardRef } from 'react';

import { useIconProps } from '../useIconProps';

import type { IconProps } from '../types';

export const EmojiSurpriseFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M7 5.5C7 4.672 6.552 4 6 4s-1 .672-1 1.5S5.448 7 6 7s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 7 10 7s1-.672 1-1.5M8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
      </svg>
    );
  }
);

EmojiSurpriseFillIcon.displayName = 'EmojiSurpriseFillIcon';
