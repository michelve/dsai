import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

/**
 * Radio button component props
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/#radios
 *
 * @example
 * ```tsx
 * // Basic radio button
 * <Radio value="option1" label="Option 1" name="options" />
 *
 * // Within a RadioGroup (recommended)
 * <RadioGroup name="size" value={size} onChange={setSize}>
 *   <Radio value="sm" label="Small" />
 *   <Radio value="md" label="Medium" />
 *   <Radio value="lg" label="Large" />
 * </RadioGroup>
 * ```
 */
export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * Radio button value (required for form submission)
   */
  value: string;

  /**
   * Radio button label
   */
  label?: ReactNode;

  /**
   * Checked state (controlled by RadioGroup or manually)
   */
  checked?: boolean;

  /**
   * Change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state - shows error styling
   * @default false
   */
  error?: boolean;

  /**
   * Form field name (usually provided by RadioGroup)
   */
  name?: string;

  /**
   * Display radio inline with others
   * @default false
   */
  inline?: boolean;

  /**
   * Reverse the order of label and radio
   * @default false
   */
  reverse?: boolean;

  /**
   * Additional CSS class names for the wrapper
   */
  className?: string;

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

/**
 * RadioGroup component props
 *
 * Manages a group of Radio buttons with controlled or uncontrolled state.
 *
 * @example
 * ```tsx
 * // Controlled RadioGroup
 * const [value, setValue] = useState('option1');
 * <RadioGroup
 *   name="options"
 *   label="Select an option"
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * >
 *   <Radio value="option1" label="Option 1" />
 *   <Radio value="option2" label="Option 2" />
 *   <Radio value="option3" label="Option 3" />
 * </RadioGroup>
 *
 * // Uncontrolled RadioGroup
 * <RadioGroup name="size" defaultValue="md" label="Size">
 *   <Radio value="sm" label="Small" />
 *   <Radio value="md" label="Medium" />
 *   <Radio value="lg" label="Large" />
 * </RadioGroup>
 * ```
 */
export interface RadioGroupProps {
  /**
   * Radio group children (Radio components)
   */
  children: ReactNode;

  /**
   * Form field name (required, shared by all radios)
   */
  name: string;

  /**
   * Controlled value
   */
  value?: string;

  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Change handler for controlled mode
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Group label (displayed above the radios)
   */
  label?: ReactNode;

  /**
   * Disable all radios in the group
   * @default false
   */
  disabled?: boolean;

  /**
   * Error state for the group
   * @default false
   */
  error?: boolean;

  /**
   * Helper text displayed below the group
   */
  helperText?: string;

  /**
   * Display radios inline
   * @default false
   */
  inline?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * ID for the group container
   */
  id?: string;
}
