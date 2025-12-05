import { forwardRef, useId } from 'react';

import { cn } from '../../utils';

import type { RadioProps } from './Radio.types';

/**
 * Radio Component
 *
 * A Bootstrap 5 radio button component for single-selection inputs.
 * Usually used within a RadioGroup for proper state management.
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
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Native `<input type="radio">` for full keyboard support
 * - `<label>` properly associated with input
 * - Arrow key navigation (within RadioGroup)
 * - Minimum 44×44px touch target via Bootstrap styling
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      label,
      checked,
      onChange,
      disabled = false,
      error = false,
      name,
      inline = false,
      reverse = false,
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

    // Build wrapper classes
    const wrapperClasses = cn(
      'form-check',
      inline && 'form-check-inline',
      reverse && 'form-check-reverse',
      className
    );

    // Build input classes
    const inputClasses = cn('form-check-input', error && 'is-invalid');

    return (
      <div className={wrapperClasses} style={style}>
        <input
          ref={ref}
          type="radio"
          id={id}
          className={inputClasses}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          name={name}
          required={required}
          aria-label={!label ? ariaLabel : undefined}
          {...rest}
        />
        {label && (
          <label htmlFor={id} className="form-check-label">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
