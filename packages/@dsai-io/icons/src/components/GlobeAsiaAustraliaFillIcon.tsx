/**
 * GlobeAsiaAustraliaFillIcon
 *
 * Bootstrap Icons - Globe Asia Australia fill
 * @category
 * @tags
 * @see https://icons.getbootstrap.com/icons/globe-asia-australia-fill/
 *
 * @accessibility
 * - Decorative (default): No aria-label or title → aria-hidden="true"
 * - Semantic: Pass aria-label for screen reader announcement
 * - With title: Renders <title> element inside SVG
 *
 * @example Decorative (inside Button)
 * ```tsx
 * <Button startIcon={<GlobeAsiaAustraliaFillIcon />}>Click me</Button>
 * ```
 *
 * @example Semantic (standalone)
 * ```tsx
 * <GlobeAsiaAustraliaFillIcon aria-label="Globe Asia Australia fill" />
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

export const GlobeAsiaAustraliaFillIcon = forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fillRule="evenodd"
          d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m3.041 9a1 1 0 0 0-.946.674l-.172.499a1 1 0 0 1-.403.515l-.803.517a1 1 0 0 0-.458.84v.455a1 1 0 0 0 1 1h.257c.192 0 .38.055.542.16l.762.491a1 1 0 0 0 .282.123A7 7 0 0 0 14.82 9.57a1 1 0 0 0-.085-.061l-.315-.204a1 1 0 0 0-.977-.06l-.169.082a1 1 0 0 1-.742.051l-1.02-.33A1 1 0 0 0 11.205 9zm-5.832 2.655a.302.302 0 1 0-.298.52l.762.325.48.232A.386.386 0 1 0 6.321 12h-.417a.7.7 0 0 1-.418-.139zM8 1a7 7 0 0 0-6.387 9.864l.754-1.285a1 1 0 0 1 1.546-.225l1.074 1.005a.986.986 0 0 0 1.36-.011l.038-.037a.88.88 0 0 0 .26-.754c-.075-.549.37-1.035.92-1.1.728-.086 1.587-.324 1.728-.957.086-.386-.115-.83-.361-1.2-.208-.312 0-.8.374-.8.122 0 .24-.055.318-.15l.393-.474c.196-.237.49-.368.797-.403.554-.065 1.407-.277 1.582-.973.185-.731-.986-.944-.998-1.62A7 7 0 0 0 8 1m.524 8.963a.413.413 0 1 0-.783-.183v.028a.46.46 0 0 1-.137.326l-.113.107a.36.36 0 0 0 .5.518l.193-.187a.6.6 0 0 0 .12-.166zm3.374-4.444c-.252-.244-.681-.139-.931.107-.256.251-.578.406-.918.585-.338.177-.264.625.101.735a.48.48 0 0 0 .345-.027l1.278-.617a.484.484 0 0 0 .125-.783"
        />
      </svg>
    );
  }
);

GlobeAsiaAustraliaFillIcon.displayName = 'GlobeAsiaAustraliaFillIcon';
