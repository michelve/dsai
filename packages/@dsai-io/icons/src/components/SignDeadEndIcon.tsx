/**
 * SignDeadEndIcon
 *
 * Bootstrap Icons - Sign dead end
 * @category Transportation
 * @tags road
 * @see https://icons.getbootstrap.com/icons/sign-dead-end/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<SignDeadEndIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <SignDeadEndIcon aria-label="Sign dead end" />
 * ```
 */
import { forwardRef, useId, useMemo } from 'react';

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

export const SignDeadEndIcon = forwardRef<SVGSVGElement, IconProps>(
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

    const titleId = useId();

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
        aria-labelledby={!ariaLabel && title ? titleId : undefined}
        focusable="false"
        {...allowedProps}
      >
        {(title || ariaLabel) && <title id={titleId}>{title || ariaLabel}</title>}
        <path d="M4.783 6v2h.69c.593 0 .886-.359.886-1.002S6.07 6 5.473 6zm.333.28h.32c.395 0 .582.24.582.722 0 .48-.186.718-.581.718h-.321zM7.82 7.72h-.918v-.602h.863V6.85h-.863v-.57h.917V6H6.571v2H7.82zm.573-.274L8.216 8h-.34l.688-2h.371l.689 2h-.352l-.177-.554zm.627-.255-.268-.845h-.015l-.27.845zM9.746 6v2h.69c.593 0 .886-.359.886-1.002S11.032 6 10.436 6zm.333.28h.32c.394 0 .582.24.582.722 0 .48-.186.718-.582.718h-.32zm-4.173 4.44h.917V11H5.575V9h1.248v.28h-.917v.57h.863v.268h-.863zm1.489.28V9.56h.013L8.344 11h.292V9h-.32v1.436h-.014L7.369 9h-.293v2zm1.56 0V9h.69c.596 0 .886.355.886.998S10.238 11 9.645 11zm.653-1.72h-.32v1.44h.32c.395 0 .581-.239.581-.718 0-.481-.187-.722-.581-.722" />
        <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098zm-1.4.7a.495.495 0 0 1 .7 0l6.516 6.515a.495.495 0 0 1 0 .7L8.35 14.866a.495.495 0 0 1-.7 0L1.134 8.35a.495.495 0 0 1 0-.7L7.65 1.134Z" />
      </svg>
    );
  }
);

SignDeadEndIcon.displayName = 'SignDeadEndIcon';
