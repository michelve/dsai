/**
 * KanbanIcon
 *
 * Bootstrap Icons - Kanban
 * @category Miscellaneous
 * @tags board
 * @see https://icons.getbootstrap.com/icons/kanban/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<KanbanIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <KanbanIcon aria-label="Kanban" />
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

export const KanbanIcon = forwardRef<SVGSVGElement, IconProps>(
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
    const computedAriaHidden = isDecorative ? true : ariaLabel ? undefined : ariaHidden;

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
        role={ariaLabel ? 'img' : undefined}
        focusable="false"
        {...allowedProps}
      >
        {title && <title>{title}</title>}
        <path d="M13.5 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm-11-1a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        <path d="M6.5 3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm-4 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zm8 0a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1z" />
      </svg>
    );
  }
);

KanbanIcon.displayName = 'KanbanIcon';
