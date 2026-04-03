/**
 * EmojiAstonishedFillIcon
 *
 * Bootstrap Icons - Emoji astonished fill
 * @category Emoji
 * @tags emoticon
 * @see https://icons.getbootstrap.com/icons/emoji-astonished-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<EmojiAstonishedFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <EmojiAstonishedFillIcon aria-label="Emoji astonished fill" />
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

export const EmojiAstonishedFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.884-3.978a2.1 2.1 0 0 1 .53.332.5.5 0 0 0 .708-.708h-.001v-.001a2 2 0 0 0-.237-.197 3 3 0 0 0-.606-.345 3 3 0 0 0-2.168-.077.5.5 0 1 0 .316.948 2 2 0 0 1 1.458.048m-4.774-.048a.5.5 0 0 0 .316-.948 3 3 0 0 0-2.167.077 3.1 3.1 0 0 0-.773.478q-.036.03-.07.064l-.002.001a.5.5 0 1 0 .728.689 2 2 0 0 1 .51-.313 2 2 0 0 1 1.458-.048M7 6.5C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5m-5.247 4.746c-.383.478.08 1.06.687.98q1.56-.202 3.12 0c.606.08 1.07-.502.687-.98C9.747 10.623 8.998 10 8 10s-1.747.623-2.247 1.246" />
      </svg>
    );
  }
);

EmojiAstonishedFillIcon.displayName = 'EmojiAstonishedFillIcon';
