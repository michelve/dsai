import type { ComponentSize, SemanticColorVariant } from '../../types';
import type { ReactNode } from 'react';

/**
 * Progress bar color variants
 * Maps to Bootstrap 5 progress bar background utilities
 * Note: Excludes 'light' variant as it's not visible on light backgrounds
 *
 * @see https://getbootstrap.com/docs/5.3/components/progress/
 * @see SemanticColorVariant
 */
export type ProgressVariant = Exclude<SemanticColorVariant, 'light'>;

/**
 * Progress bar sizes
 * @see ComponentSize
 */
export type ProgressSize = ComponentSize;

/**
 * Progress component props
 *
 * @example
 * ```tsx
 * // Determinate progress bar
 * <Progress value={75} variant="primary" />
 *
 * // Indeterminate (loading) progress bar
 * <Progress indeterminate variant="info" />
 *
 * // With label
 * <Progress value={50} label="Uploading..." showValue />
 *
 * // Striped and animated
 * <Progress value={60} striped animated />
 *
 * // Stacked progress bars
 * <Progress>
 *   <Progress.Bar value={15} variant="success" />
 *   <Progress.Bar value={30} variant="warning" />
 *   <Progress.Bar value={20} variant="danger" />
 * </Progress>
 * ```
 */
export interface ProgressProps {
  /**
   * Progress value (0-100)
   * If undefined and not indeterminate, defaults to 0
   */
  value?: number;

  /**
   * Progress bar color variant
   * @default 'primary'
   */
  variant?: ProgressVariant;

  /**
   * Progress bar size
   * @default 'md'
   */
  size?: ProgressSize;

  /**
   * Optional label displayed above the progress bar
   */
  label?: string;

  /**
   * Show percentage value inside the progress bar
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom value text (overrides percentage display)
   */
  valueText?: string;

  /**
   * Indeterminate mode (animated loading state)
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Striped pattern
   * @default false
   */
  striped?: boolean;

  /**
   * Animated stripes (requires striped to be true)
   * @default false
   */
  animated?: boolean;

  /**
   * Minimum value for aria-valuemin.
   *
   * **Note**: `min` and `max` control ARIA semantics only, not the visual range.
   * The visual width is always calculated as a percentage of 0-100.
   *
   * For example, with `min=10, max=20, value=15`:
   * - Visual width = 50% (since 15 is halfway between 0 and 100 as a percentage)
   * - `aria-valuenow=15`, `aria-valuemin=10`, `aria-valuemax=20`
   *
   * @default 0
   */
  min?: number;

  /**
   * Maximum value for aria-valuemax.
   *
   * **Note**: `min` and `max` control ARIA semantics only, not the visual range.
   * The visual width is always calculated as a percentage of 0-100.
   *
   * @default 100
   */
  max?: number;

  /**
   * Children for stacked progress bars
   */
  children?: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this progress bar
   */
  'aria-labelledby'?: string;
}

/**
 * Progress.Bar component props (for stacked progress bars)
 */
export interface ProgressBarProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Progress bar color variant
   * @default 'primary'
   */
  variant?: ProgressVariant;

  /**
   * Show percentage value inside the bar
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom value text
   */
  valueText?: string;

  /**
   * Striped pattern
   * @default false
   */
  striped?: boolean;

  /**
   * Animated stripes
   * @default false
   */
  animated?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Accessible label for screen readers.
   * If not provided, defaults to "{variant} progress: {percentage}%".
   */
  'aria-label'?: string;

  /**
   * Mark this progress bar as decorative (hidden from assistive technology).
   * Use this for purely decorative stacked bars where the parent Progress
   * component provides the accessible label.
   *
   * @default false
   */
  'aria-hidden'?: boolean;
}
