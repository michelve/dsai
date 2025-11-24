import type { CSSProperties, MouseEvent, ReactNode } from 'react';

/**
 * Button component variants
 * Maps to Bootstrap 5 button styles using design tokens
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'outline-light'
  | 'outline-dark'
  | 'link';

/**
 * Button component sizes
 * sm: Small button (0.875rem font size)
 * md: Medium button (1rem font size) - default
 * lg: Large button (1.25rem font size)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button HTML type attribute
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Button component props
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * // Loading button
 * <Button variant="primary" loading>
 *   Saving...
 * </Button>
 *
 * // Button with icons
 * <Button variant="primary" startIcon={<SaveIcon />} endIcon={<ArrowIcon />}>
 *   Save
 * </Button>
 * ```
 */
export interface ButtonProps {
  /**
   * Button content
   */
  children: ReactNode;

  /**
   * Button visual style variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Disabled state - prevents user interaction
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner and disables button
   * @default false
   */
  loading?: boolean;

  /**
   * Text to show while loading (replaces children)
   * If not provided, children will be shown with spinner
   */
  loadingText?: string;

  /**
   * Icon to display before button text
   */
  startIcon?: ReactNode;

  /**
   * Icon to display after button text
   */
  endIcon?: ReactNode;

  /**
   * Click event handler
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * Full width button (100%)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * ARIA label for accessibility
   * Required when button content is not descriptive (e.g., icon-only buttons)
   */
  'aria-label'?: string;

  /**
   * ARIA described by - references element IDs providing additional description
   */
  'aria-describedby'?: string;

  /**
   * ARIA controls - IDs of elements controlled by this button
   */
  'aria-controls'?: string;

  /**
   * ARIA expanded - indicates if controlled element is expanded
   */
  'aria-expanded'?: boolean;

  /**
   * ARIA pressed - indicates pressed state for toggle buttons
   */
  'aria-pressed'?: boolean | 'mixed';

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Name attribute
   */
  name?: string;

  /**
   * Value attribute
   */
  value?: string;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;

  /**
   * Auto focus on mount
   * @default false
   */
  autoFocus?: boolean;
}
