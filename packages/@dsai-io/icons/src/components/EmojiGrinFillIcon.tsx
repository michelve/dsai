/**
 * EmojiGrinFillIcon
 *
 * Bootstrap Icons - Emoji grin fill
 * @category Emoji
 * @tags emoticon
 * @see https://icons.getbootstrap.com/icons/emoji-grin-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<EmojiGrinFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <EmojiGrinFillIcon aria-label="Emoji grin fill" />
 * ```
 */
import { forwardRef, useMemo } from 'react';

import type { IconProps } from '../types';

const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;

export const EmojiGrinFillIcon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      size = 16,
      color = 'currentColor',
      className,
      title,
      style: propStyle,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      ...rest
    },
    ref
  ) => {
    const isDecorative = !ariaLabel && !title;

    // Improved A11y: Prevent contradictory aria-hidden when labelled
    // - Decorative → always hidden
    // - With aria-label → never hidden (ignore user's aria-hidden)
    // - With title only → respect user's aria-hidden
    let computedAriaHidden: boolean | undefined = ariaHidden;
    if (isDecorative) {
      computedAriaHidden = true;
    } else if (ariaLabel) {
      computedAriaHidden = undefined;
    }

    const style = useMemo(
      () => ({
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        ...propStyle,
      }),
      [size, propStyle]
    );

    const allowedProps: Record<string, unknown> = {};
    for (const key of ALLOWED_PROPS) {
      if (key in rest) {
        allowedProps[key] = rest[key as keyof typeof rest];
      }
    }

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
        focusable="false"
        {...allowedProps}
      >
        <title>{title || ariaLabel}</title>
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M6.488 7c-.23-.598-.661-1-1.155-1-.493 0-.924.402-1.155 1A2.8 2.8 0 0 1 4 6c0-1.105.597-2 1.333-2 .737 0 1.334.895 1.334 2 0 .364-.065.706-.179 1m5.334 0c-.23-.598-.662-1-1.155-1-.494 0-.925.402-1.155 1a2.8 2.8 0 0 1-.179-1c0-1.105.597-2 1.334-2C11.403 4 12 4.895 12 6c0 .364-.065.706-.178 1M2.696 8.756a.48.48 0 0 1 .382-.118C4.348 8.786 6.448 9 8 9c1.553 0 3.653-.214 4.922-.362a.48.48 0 0 1 .383.118.3.3 0 0 1 .096.29c-.09.47-.242.921-.445 1.342-.263.035-.576.075-.929.115A37 37 0 0 1 8 10.75c-1.475 0-2.934-.123-4.027-.247-.353-.04-.666-.08-.93-.115A5.5 5.5 0 0 1 2.6 9.045a.3.3 0 0 1 .097-.29ZM8 13.5a5.49 5.49 0 0 1-4.256-2.017l.116.014c1.115.126 2.615.253 4.14.253s3.025-.127 4.14-.253l.117-.014A5.49 5.49 0 0 1 8 13.5" />
      </svg>
    );
  }
);

EmojiGrinFillIcon.displayName = 'EmojiGrinFillIcon';
