import type { CSSProperties, ReactNode } from 'react';
import type { ComponentSize } from '../../types';

/**
 * Switch sizes matching DS AI design tokens
 * @see ComponentSize
 */
export type SwitchSize = ComponentSize;

/**
 * Switch component props
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/#switches
 *
 * @example
 * ```tsx
 * // Basic switch
 * <Switch label="Enable notifications" />
 *
 * // Controlled switch
 * <Switch
 *   checked={isEnabled}
 *   onChange={(checked) => setIsEnabled(checked)}
 *   label="Dark mode"
 * />
 *
 * // With loading state
 * <Switch
 *   checked={isSaving}
 *   loading={isSaving}
 *   label="Auto-save"
 * />
 *
 * // Different sizes
 * <Switch size="sm" label="Small" />
 * <Switch size="md" label="Medium" />
 * <Switch size="lg" label="Large" />
 * ```
 */
export interface SwitchProps {
  /**
   * Whether the switch is checked
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean;

  /**
   * Callback when the switch is toggled
   * @param checked - The new checked state
   */
  onChange?: (checked: boolean) => void;

  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Label displayed next to the switch
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the switch
   * @default 'end'
   */
  labelPosition?: 'start' | 'end';

  /**
   * Helper text displayed below the switch
   */
  helperText?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Error state
   * @default false
   */
  error?: boolean;

  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /**
   * Icon to show when switch is on
   */
  onIcon?: ReactNode;

  /**
   * Icon to show when switch is off
   */
  offIcon?: ReactNode;

  /**
   * Text to show when switch is on (inside the track)
   */
  onText?: string;

  /**
   * Text to show when switch is off (inside the track)
   */
  offText?: string;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * Value attribute for form submission
   */
  value?: string;

  /**
   * ID attribute
   * Auto-generated if not provided
   */
  id?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for screen readers (when no visible label)
   */
  'aria-label'?: string;

  /**
   * ID of element that describes this switch
   */
  'aria-describedby'?: string;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;
}
