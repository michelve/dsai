/**
 * Icon Component Types
 *
 * Type definitions for Bootstrap Icons React components.
 *
 * @packageDocumentation
 */

import type { CSSProperties, ForwardRefExoticComponent, RefAttributes, SVGAttributes } from 'react';

/**
 * Icon component props
 *
 * @accessibility
 * Icons follow WAI-ARIA best practices for SVG accessibility:
 *
 * **Decorative icons** (default):
 * - When used inside buttons, alerts, or next to text labels
 * - No `aria-label` or `title` → `aria-hidden="true"` automatically
 * - Let the parent component provide the accessible name
 *
 * **Semantic icons**:
 * - When used standalone or as the only content
 * - Pass `aria-label` for screen reader announcement
 * - Icon will have `role="img"` and the label
 *
 * **Icons with title**:
 * - Pass `title` for tooltip and basic AT support
 * - Renders `<title>` element inside SVG
 *
 * @example Decorative (inside Button - recommended)
 * ```tsx
 * <Button startIcon={<ArrowLeftIcon />}>Go back</Button>
 * ```
 *
 * @example Semantic (standalone with label)
 * ```tsx
 * <ArrowLeftIcon aria-label="Navigate back" />
 * ```
 *
 * @example With title (tooltip)
 * ```tsx
 * <WarningIcon title="Warning" />
 * ```
 */
export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /**
   * Icon size in pixels or CSS value
   * @default 16
   */
  size?: number | string;

  /**
   * Icon fill color
   * @default 'currentColor'
   */
  color?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Inline styles (merged with size)
   */
  style?: CSSProperties;

  /**
   * Title for accessibility and tooltip
   * Renders as `<title>` inside SVG
   */
  title?: string;

  /**
   * Accessible label for screen readers
   * When provided, icon gets `role="img"` and this label
   * Use for standalone icons that convey meaning
   */
  'aria-label'?: string;

  /**
   * Hide from assistive technology
   * - `true`: Always hide (for decorative icons)
   * - `false`: Force visible to AT
   * - `undefined`: Automatic based on aria-label/title presence
   *
   * Note: If `aria-label` is provided, `aria-hidden` is ignored
   * to prevent contradictory states.
   */
  'aria-hidden'?: boolean;
}

/**
 * Icon component type with forwardRef support
 */
export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
