import { forwardRef, useEffect, useId, useRef } from 'react';

import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox Component
 *
 * A Bootstrap 5 checkbox component for form inputs.
 * Supports controlled and uncontrolled modes, indeterminate state,
 * error states, and switch styling.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/
 *
 * @example
 * ```tsx
 * // Basic checkbox
 * <Checkbox label="Accept terms and conditions" />
 *
 * // Controlled checkbox
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   checked={checked}
 *   onChange={(e) => setChecked(e.target.checked)}
 *   label="Subscribe to newsletter"
 * />
 *
 * // Indeterminate state
 * <Checkbox indeterminate label="Select all" />
 *
 * // Switch style
 * <Checkbox switch label="Enable notifications" />
 *
 * // With error
 * <Checkbox error helperText="You must accept the terms" label="I agree" />
 *
 * // Inline checkboxes
 * <Checkbox inline label="Option 1" />
 * <Checkbox inline label="Option 2" />
 * ```
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Native `<input type="checkbox">` for full keyboard support
 * - `<label>` properly associated with input
 * - `aria-invalid` for error state
 * - `aria-describedby` for helper text
 * - Space key toggles checkbox
 * - Minimum 44×44px touch target via Bootstrap styling
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      disabled = false,
      error = false,
      helperText,
      name,
      value,
      inline = false,
      reverse = false,
      switch: isSwitch = false,
      className = '',
      style,
      id: providedId,
      required = false,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = helperText ? `${id}-helper` : undefined;

    // Internal ref for indeterminate state
    const internalRef = useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Set indeterminate property on input element
    // This must be done via JavaScript as there's no HTML attribute for it
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, inputRef]);

    // Build wrapper classes
    const wrapperClasses = [
      'form-check',
      isSwitch && 'form-switch',
      inline && 'form-check-inline',
      reverse && 'form-check-reverse',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Build input classes
    const inputClasses = ['form-check-input', error && 'is-invalid'].filter(Boolean).join(' ');

    // Build label classes
    const labelClasses = ['form-check-label'].filter(Boolean).join(' ');

    // Build helper text classes
    const helperClasses = [error ? 'invalid-feedback' : 'form-text'].filter(Boolean).join(' ');

    return (
      <div className={wrapperClasses} style={style}>
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          className={inputClasses}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          aria-label={!label ? ariaLabel : undefined}
          {...rest}
        />
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        {helperText && (
          <div id={helperId} className={helperClasses}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
