import type { ComponentSize, SemanticColorVariant } from '../../types';
import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

type OmittedCheckboxInputProps = 'type' | 'onChange' | 'readOnly' | 'size';

/**
 * Checkbox component props
 *
 * Extends native input attributes for full HTML compatibility.
 * Supports both controlled and uncontrolled modes.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/
 *
 * @example
 * ```tsx
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   label="Accept terms"
 * />
 *
 * // Uncontrolled checkbox
 * <Checkbox defaultChecked label="Subscribe to newsletter" />
 *
 * // Indeterminate state (for parent checkboxes)
 * <Checkbox indeterminate label="Select all" />
 *
 * // With error state
 * <Checkbox error helperText="This field is required" label="Required field" />
 *
 * // Inline checkboxes
 * <Checkbox inline label="Option 1" />
 * <Checkbox inline label="Option 2" />
 * ```
 */
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, OmittedCheckboxInputProps> {
  /**
   * Checkbox label text or element
   */
  label?: ReactNode;

  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled mode
   */
  defaultChecked?: boolean;

  /**
   * Indeterminate state (partially checked)
   * Used for parent checkboxes when some children are checked
   */
  indeterminate?: boolean;

  /**
   * Change handler for controlled mode
   * Receives the native change event
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Convenience change handler that receives the boolean checked state.
   * Called after onChange. Can be used alongside or instead of onChange.
   * Matches Radix/Chakra/shadcn API convention.
   */
  onCheckedChange?: (checked: boolean) => void;

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
   * Helper text displayed below the checkbox
   * Used for additional context or error messages
   */
  helperText?: ReactNode;

  /**
   * Form field name
   */
  name?: string;

  /**
   * Form field value
   */
  value?: string;

  /**
   * Display checkbox inline with others
   * @default false
   */
  inline?: boolean;

  /**
   * Reverse the order of label and checkbox
   * @default false
   */
  reverse?: boolean;

  /**
   * Switch style (toggle switch instead of checkbox)
   * @default false
   */
  switch?: boolean;

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
   * Checkbox size variant
   * @default undefined (Bootstrap default, equivalent to 'md')
   */
  size?: ComponentSize;

  /**
   * Color variant for checked/indeterminate state
   * @default undefined (Bootstrap default primary)
   */
  variant?: SemanticColorVariant;

  /**
   * ReadOnly mode — visible and focusable but cannot be toggled.
   * HTML readOnly has no effect on checkboxes. Enforced via JavaScript.
   * disabled takes priority over readOnly.
   * @default false
   */
  readOnly?: boolean;

  /**
   * Custom icon when checked. Requires controlled mode (checked + onChange).
   * Must provide uncheckedIcon too.
   */
  checkedIcon?: ReactNode;

  /**
   * Custom icon when unchecked. Must provide checkedIcon too.
   */
  uncheckedIcon?: ReactNode;

  /**
   * Custom icon when indeterminate. Falls back to a dash if omitted
   * while other icons provided.
   */
  indeterminateIcon?: ReactNode;

  /**
   * Accessible label for screen readers (when no visible label)
   */
  'aria-label'?: string;

  /**
   * Loading state — shows a spinner and disables interaction.
   * Sets `aria-busy="true"` for assistive technologies.
   * @default false
   */
  loading?: boolean;

  /**
   * Persistent description text displayed below the label.
   * Unlike `helperText` (used for validation feedback), `description`
   * provides permanent contextual information.
   * Both are linked via `aria-describedby` for accessibility.
   */
  description?: ReactNode;
}
