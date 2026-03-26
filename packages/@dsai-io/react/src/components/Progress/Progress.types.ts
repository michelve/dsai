import type { ComponentSize, SemanticColorVariant } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Gradient configuration for progress bars
 * Similar to Ant Design's `strokeColor: { from, to }` pattern
 *
 * @example
 * ```tsx
 * <Progress value={75} gradient={{ from: '#108ee9', to: '#87d068' }} />
 * ```
 */
export interface ProgressGradient {
  /** Start color (left side in LTR) */
  from: string;
  /** End color (right side in LTR) */
  to: string;
  /** Gradient direction
   * @default 'to right'
   */
  direction?: string;
}

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
   * Custom value formatter function.
   * Receives current value and max, returns content to display.
   * Takes precedence over `valueText` when both are provided.
   *
   * Similar to Ant Design's `format` and Ark UI's `getValueLabel`.
   *
   * @example
   * ```tsx
   * <Progress value={3} max={10} formatValue={(v, max) => `${v}/${max} items`} showValue />
   * ```
   */
  formatValue?: (value: number, max: number) => ReactNode;

  /**
   * Buffer value (0-100) for showing a secondary lighter bar.
   * Commonly used for video buffering or two-stage progress.
   *
   * Similar to MUI's `variant="buffer"` with `valueBuffer` prop.
   *
   * @example
   * ```tsx
   * <Progress value={30} bufferValue={60} />
   * ```
   */
  bufferValue?: number;

  /**
   * Number of discrete steps/segments to render.
   * Progress fills segments proportionally based on value.
   *
   * Similar to Ant Design's `steps` prop.
   *
   * @example
   * ```tsx
   * <Progress value={60} steps={5} /> // Fills 3 of 5 segments
   * ```
   */
  steps?: number;

  /**
   * Gradient fill for the progress bar.
   * Overrides the variant background color when provided.
   *
   * Similar to Ant Design's `strokeColor: { from, to }`.
   *
   * @example
   * ```tsx
   * <Progress value={75} gradient={{ from: '#108ee9', to: '#87d068' }} />
   * ```
   */
  gradient?: ProgressGradient;

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

  /**
   * Test ID for testing frameworks
   */
  'data-testid'?: string;

  /**
   * Additional test selector
   */
  'data-test'?: string;
}

/**
 * Progress.Bar component props (for stacked progress bars)
 */
/**
 * Progress.Circle component props
 *
 * SVG-based circular progress indicator.
 * Complements the linear Progress component for dashboard-style displays.
 *
 * @example
 * ```tsx
 * <Progress.Circle value={75} />
 * <Progress.Circle value={75} size={120} showValue />
 * <Progress.Circle indeterminate variant="info" />
 * ```
 */
export interface ProgressCircleProps {
  /** Progress value (0-100) */
  value?: number;

  /** Circle color variant
   * @default 'primary'
   */
  variant?: ProgressVariant;

  /** Diameter of the circle in pixels
   * @default 80
   */
  size?: number;

  /** Stroke width in pixels
   * @default 6
   */
  strokeWidth?: number;

  /** Show value text in the center
   * @default false
   */
  showValue?: boolean;

  /** Custom value text */
  valueText?: string;

  /** Custom value formatter */
  formatValue?: (value: number, max: number) => ReactNode;

  /** Indeterminate (loading) mode
   * @default false
   */
  indeterminate?: boolean;

  /** Gradient fill */
  gradient?: ProgressGradient;

  /** Minimum value for ARIA
   * @default 0
   */
  min?: number;

  /** Maximum value for ARIA
   * @default 100
   */
  max?: number;

  /** Additional CSS class names */
  className?: string;

  /** Inline styles */
  style?: CSSProperties;

  /** ID attribute */
  id?: string;

  /** Accessible label */
  'aria-label'?: string;

  /** Test ID */
  'data-testid'?: string;

  /** Additional test selector */
  'data-test'?: string;
}

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
   * Custom value formatter. Takes precedence over `valueText`.
   */
  formatValue?: (value: number, max: number) => ReactNode;

  /**
   * Gradient fill. Overrides variant background color.
   */
  gradient?: ProgressGradient;

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

  /**
   * Test ID for testing frameworks
   */
  'data-testid'?: string;

  /**
   * Additional test selector
   */
  'data-test'?: string;
}
