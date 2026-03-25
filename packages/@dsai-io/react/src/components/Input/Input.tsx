import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  type InputHTMLAttributes,
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { ClearIcon, getSafeInputProps } from '../../utils/misc';

import type { InputProps, InputSize } from './Input.types';

const resolveInputSizeClass = (size: InputSize): string => {
  switch (size) {
    case 'sm':
      return 'form-control-sm';
    case 'lg':
      return 'form-control-lg';
    default:
      return '';
  }
};

/**
 * X icon for clear button
 */

/**
 * Input component for text entry
 *
 * A flexible text input component built with Bootstrap 5 classes.
 * Supports multiple types, sizes, validation states, and addons.
 *
 * Security Features:
 * - Restricts prop spreading to safe HTML attributes only
 * - Blocks dangerous event handlers (onLoad, onError, etc.)
 * - Uses explicit whitelist for input element attributes
 *
 * Performance Features:
 * - Memoized class name construction (useMemo)
 * - Component wrapped with React.memo to prevent unnecessary re-renders
 * - Memoized event handlers (useCallback)
 * - Memoized computed values (hasPrefix, hasSuffix, showClearButton, etc.)
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
const InputComponent = forwardRef<HTMLInputElement, InputProps>(function Input(
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

  // Track focus state
  const [isFocused, setIsFocused] = useState(false);

  // Controlled/uncontrolled state management with centralized hook
  const [currentValue, setCurrentValue] = useControllableState<string>({
    value: value !== undefined ? String(value) : undefined,
    defaultValue: String(defaultValue ?? ''),
    onChange: (newValue, event) => {
      if (!onChange) {
        return;
      }
      if (event) {
        onChange(event as ChangeEvent<HTMLInputElement>);
        return;
      }

      // Fallback synthetic event for programmatic updates (e.g., clear button)
      const syntheticEvent = {
        target: { value: newValue, type },
        currentTarget: { value: newValue, type },
      } as unknown as ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    },
  });

  // Memoize event handlers
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setCurrentValue(e.target.value, e);
    },
    [setCurrentValue]
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>): void => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>): void => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const handleClear = useCallback((): void => {
    setCurrentValue('');
    onClear?.();
  }, [setCurrentValue, onClear]);

  // Memoize input classes
  const inputClasses = useMemo(
    () =>
      cn(
        plaintext ? 'form-control-plaintext' : 'form-control',
        resolveInputSizeClass(size),
        error && 'is-invalid',
        success && !error && 'is-valid',
        inputClassName
      ),
    [plaintext, size, error, success, inputClassName]
  );

  // Memoize wrapper classes
  const wrapperClasses = useMemo(
    () => cn(floating && 'form-floating', className),
    [floating, className]
  );

  // Memoize computed values
  const hasPrefix = useMemo(() => Boolean(prefix), [prefix]);
  const hasSuffix = useMemo(() => Boolean(suffix), [suffix]);
  const showClearButton = useMemo(
    () => clearable && String(currentValue).length > 0 && !disabled && !readOnly,
    [clearable, currentValue, disabled, readOnly]
  );
  const hasAddons = useMemo(
    () => hasPrefix || hasSuffix || showClearButton,
    [hasPrefix, hasSuffix, showClearButton]
  );

  // Character count
  const charCount = String(currentValue).length;
  const showCharCount = showCount && maxLength !== undefined;

  // Memoize aria-describedby
  const describedByIds = useMemo(
    () => cn(helperText && helperId, ariaDescribedBy),
    [helperText, helperId, ariaDescribedBy]
  );

  // Get safe props (filter out dangerous event handlers)
  const safeProps = getSafeInputProps(props) as InputHTMLAttributes<HTMLInputElement>;

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
      value={currentValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={!label ? ariaLabel : undefined}
      aria-invalid={error || undefined}
      aria-describedby={describedByIds || undefined}
      aria-required={required || undefined}
      data-focused={isFocused || undefined}
      {...safeProps}
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
            >
              <ClearIcon />
            </button>
          )}
          {hasSuffix && <span className="input-group-text">{suffix}</span>}
          {error && helperElement}
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

InputComponent.displayName = 'Input';

// Memoize component to prevent unnecessary re-renders
export const Input = memo(InputComponent);
Input.displayName = 'Input';
