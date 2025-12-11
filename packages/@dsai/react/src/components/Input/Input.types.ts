import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';
import type { ComponentSize } from '../../types';

/**
 * Input types supported by the component
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

/**
 * Input sizes matching DS AI design tokens
 * @see ComponentSize
 */
export type InputSize = ComponentSize;

/**
 * Input component props
 *
 * Extends native input attributes for full HTML compatibility.
 * Supports controlled and uncontrolled modes.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/form-control/
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input label="Email" type="email" placeholder="Enter your email" />
 *
 * // With validation
 * <Input
 *   label="Username"
 *   error
 *   helperText="Username is already taken"
 * />
 *
 * // With prefix and suffix
 * <Input
 *   label="Website"
 *   prefix="https://"
 *   suffix=".com"
 *   placeholder="example"
 * />
 *
 * // Password with toggle
 * <Input
 *   label="Password"
 *   type="password"
 *   clearable
 * />
 *
 * // With character counter
 * <Input
 *   label="Bio"
 *   maxLength={150}
 *   showCount
 * />
 * ```
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /**
   * Input type
   * @default 'text'
   */
  type?: InputType;

  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Input label
   */
  label?: ReactNode;

  /**
   * Helper text displayed below the input
   * Used for additional context or error messages
   */
  helperText?: string;

  /**
   * Error state - shows error styling
   * @default false
   */
  error?: boolean;

  /**
   * Success state - shows success styling
   * @default false
   */
  success?: boolean;

  /**
   * Content to display before the input
   * Can be text (e.g., "$") or an icon
   */
  prefix?: ReactNode;

  /**
   * Content to display after the input
   * Can be text (e.g., ".com") or an icon
   */
  suffix?: ReactNode;

  /**
   * Show a clear button when input has value
   * @default false
   */
  clearable?: boolean;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;

  /**
   * Show character count when maxLength is set
   * @default false
   */
  showCount?: boolean;

  /**
   * Floating label style (label inside input)
   * @default false
   */
  floating?: boolean;

  /**
   * Plain text readonly display
   * @default false
   */
  plaintext?: boolean;

  /**
   * Additional CSS class names for the wrapper
   */
  className?: string;

  /**
   * Additional CSS class names for the input element
   */
  inputClassName?: string;

  /**
   * Inline styles for the wrapper
   */
  style?: CSSProperties;

  /**
   * ID attribute for the input
   * Auto-generated if not provided
   */
  id?: string;

  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /**
   * Accessible label for screen readers (when no visible label)
   */
  'aria-label'?: string;
}
