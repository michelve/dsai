import { Children, cloneElement, isValidElement, type ReactElement, useId, useState } from 'react';

import { Radio } from './Radio';

import type { RadioGroupProps, RadioProps } from './Radio.types';

/**
 * RadioGroup Component
 *
 * A Bootstrap 5 container for managing a group of Radio buttons.
 * Handles controlled and uncontrolled state, and provides proper
 * accessibility attributes for the radio group.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/#radios
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
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - `role="radiogroup"` for screen readers
 * - `aria-labelledby` for group label
 * - `aria-describedby` for helper text
 * - `aria-invalid` for error state
 * - Arrow key navigation between radios
 */
export function RadioGroup({
  children,
  name,
  value,
  defaultValue,
  onChange,
  label,
  disabled = false,
  error = false,
  helperText,
  inline = false,
  className = '',
  style,
  required = false,
  id: providedId,
}: RadioGroupProps): React.JSX.Element {
  // Generate unique IDs
  const generatedId = useId();
  const groupId = providedId || generatedId;
  const labelId = label ? `${groupId}-label` : undefined;
  const helperId = helperText ? `${groupId}-helper` : undefined;

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Handle change for both controlled and uncontrolled modes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  };

  // Build wrapper classes
  const wrapperClasses = [inline && 'd-flex flex-wrap gap-3', className].filter(Boolean).join(' ');

  // Clone children and inject props
  const enhancedChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Radio) {
      const radioChild = child as ReactElement<RadioProps>;
      return cloneElement(radioChild, {
        name,
        checked: radioChild.props.value === currentValue,
        onChange: handleChange,
        disabled: disabled || radioChild.props.disabled,
        error: error || radioChild.props.error,
        inline,
      });
    }
    return child;
  });

  // Build helper text classes
  const helperClasses = [error ? 'invalid-feedback d-block' : 'form-text']
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset className={className} style={style} id={groupId}>
      {label && (
        <legend id={labelId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </legend>
      )}
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={helperId}
        aria-invalid={error || undefined}
        aria-required={required || undefined}
        className={wrapperClasses}
      >
        {enhancedChildren}
      </div>
      {helperText && (
        <div id={helperId} className={helperClasses}>
          {helperText}
        </div>
      )}
    </fieldset>
  );
}

RadioGroup.displayName = 'RadioGroup';
