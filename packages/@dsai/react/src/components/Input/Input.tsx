import { forwardRef, useId, useState, type ChangeEvent, type FocusEvent } from 'react';

import type { InputProps, InputSize } from './Input.types';

/**
 * Map input sizes to Bootstrap classes
 */
const sizeClassMap: Record<InputSize, string> = {
  sm: 'form-control-sm',
  md: '',
  lg: 'form-control-lg',
};

/**
 * X icon for clear button
 */
function ClearIcon(): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
}

/**
 * Input component for text entry
 *
 * A flexible text input component built with Bootstrap 5 classes.
 * Supports multiple types, sizes, validation states, and addons.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/form-control/
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input label="Name" placeholder="Enter your name" />
 *
 * // With error state
 * <Input
 *   label="Email"
 *   type="email"
 *   error
 *   helperText="Please enter a valid email"
 * />
 *
 * // With prefix and suffix
 * <Input
 *   label="Price"
 *   type="number"
 *   prefix="$"
 *   suffix=".00"
 * />
 *
 * // Clearable input
 * <Input
 *   label="Search"
 *   type="search"
 *   clearable
 *   onClear={() => console.log('Cleared')}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    size = 'md',
    label,
    helperText,
    error = false,
    success = false,
    prefix,
    suffix,
    clearable = false,
    onClear,
    showCount = false,
    floating = false,
    plaintext = false,
    className,
    inputClassName,
    style,
    id: providedId,
    required = false,
    disabled = false,
    readOnly = false,
    maxLength,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  // Generate unique IDs
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const helperId = `${inputId}-helper`;
  const labelId = `${inputId}-label`;

  // Track internal value for character count and clear button
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [_isFocused, setIsFocused] = useState(false);

  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Handle change
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  // Handle focus
  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Handle clear
  const handleClear = (): void => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  };

  // Build input classes
  const inputClasses = [
    plaintext ? 'form-control-plaintext' : 'form-control',
    sizeClassMap[size],
    error && 'is-invalid',
    success && !error && 'is-valid',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Build wrapper classes
  const wrapperClasses = [floating && 'form-floating', className].filter(Boolean).join(' ');

  // Has addons (prefix, suffix, or clearable with value)
  const hasPrefix = Boolean(prefix);
  const hasSuffix = Boolean(suffix);
  const showClearButton = clearable && String(currentValue).length > 0 && !disabled && !readOnly;
  const hasAddons = hasPrefix || hasSuffix || showClearButton;

  // Character count
  const charCount = String(currentValue).length;
  const showCharCount = showCount && maxLength !== undefined;

  // Build aria-describedby
  const describedByIds = [helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ');

  // Render the input element
  const inputElement = (
    <input
      ref={ref}
      id={inputId}
      type={type}
      className={inputClasses}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      maxLength={maxLength}
      value={isControlled ? value : undefined}
      defaultValue={!isControlled ? defaultValue : undefined}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={!label ? ariaLabel : undefined}
      aria-invalid={error || undefined}
      aria-describedby={describedByIds || undefined}
      aria-required={required || undefined}
      {...props}
    />
  );

  // Render label
  const labelElement = label && (
    <label id={labelId} htmlFor={inputId} className={floating ? '' : 'form-label'}>
      {label}
      {required && (
        <span className="text-danger ms-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  // Render helper text / error message
  const helperElement = helperText && (
    <div id={helperId} className={error ? 'invalid-feedback d-block' : 'form-text'}>
      {helperText}
    </div>
  );

  // Render character counter
  const counterElement = showCharCount && (
    <div className="form-text text-end">
      <small>
        {charCount}/{maxLength}
      </small>
    </div>
  );

  // Floating label layout
  if (floating) {
    return (
      <div className={wrapperClasses} style={style}>
        {inputElement}
        {labelElement}
        {helperElement}
        {counterElement}
      </div>
    );
  }

  // Input group with addons
  if (hasAddons) {
    return (
      <div className={className} style={style}>
        {labelElement}
        <div className={`input-group ${error ? 'has-validation' : ''}`}>
          {hasPrefix && <span className="input-group-text">{prefix}</span>}
          {inputElement}
          {showClearButton && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClear}
              aria-label="Clear input"
              disabled={disabled}
              tabIndex={-1}
            >
              <ClearIcon />
            </button>
          )}
          {hasSuffix && <span className="input-group-text">{suffix}</span>}
          {error && helperText && <div className="invalid-feedback">{helperText}</div>}
        </div>
        {!error && helperElement}
        {counterElement}
      </div>
    );
  }

  // Standard layout
  return (
    <div className={wrapperClasses || undefined} style={style}>
      {labelElement}
      {inputElement}
      {helperElement}
      {counterElement}
    </div>
  );
});

Input.displayName = 'Input';
