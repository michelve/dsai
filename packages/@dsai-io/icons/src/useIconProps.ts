/**
 * Shared icon props hook
 *
 * Extracts common icon logic (accessibility, styling, prop filtering)
 * into a single hook to reduce per-component cognitive complexity.
 *
 * @packageDocumentation
 */

import { useId, useMemo } from 'react';

import type { IconProps } from './types';
import type { CSSProperties } from 'react';


const ALLOWED_PROPS = [
  'id',
  'data-testid',
  'data-icon',
  'focusable',
  'preserveAspectRatio',
  'transform',
  'opacity',
] as const;

/**
 * Compute icon accessibility, styling, and filtered props.
 *
 * @param props - Raw IconProps from the component
 * @returns Computed values ready for the SVG element
 */
export function useIconProps(props: IconProps) {
  const {
    size = 16,
    color = 'currentColor',
    className,
    title,
    style: propStyle,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    ...rest
  } = props;

  const isDecorative = !ariaLabel && !title;

  // Prevent contradictory aria-hidden when labelled
  // - Decorative → always hidden
  // - With aria-label → never hidden (ignore user's aria-hidden)
  // - With title only → respect user's aria-hidden
  let computedAriaHidden: boolean | undefined = ariaHidden;
  if (isDecorative) {
    computedAriaHidden = true;
  } else if (ariaLabel) {
    computedAriaHidden = null;
  }

  const titleId = useId();
  const computedLabelledBy = !ariaLabel && title ? titleId : undefined;
  const titleContent = title || ariaLabel;

  const style: CSSProperties = useMemo(
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

  return {
    color,
    className,
    style,
    ariaLabel,
    computedAriaHidden,
    titleId,
    computedLabelledBy,
    titleContent,
    allowedProps,
  };
}
