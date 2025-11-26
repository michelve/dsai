import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react';

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
 * Safe whitelist of HTML attributes allowed on input element
 * Blocks all event handlers and dangerous attributes
 */
const SAFE_INPUT_ATTRIBUTES = {
  accept: true,
  acceptCharset: true,
  alt: true,
  autoComplete: true,
  autoFocus: true,
  capture: true,
  contentEditable: true,
  crossOrigin: true,
  data: true,
  datatype: true,
  defaultValue: true,
  dir: true,
  disabled: true,
  draggable: true,
  form: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  height: true,
  hidden: true,
  lang: true,
  list: true,
  max: true,
  maxLength: true,
  min: true,
  minLength: true,
  multiple: true,
  name: true,
  pattern: true,
  placeholder: true,
  prefix: true,
  property: true,
  readOnly: true,
  required: true,
  resource: true,
  rev: true,
  role: true,
  spellCheck: true,
  step: true,
  style: true,
  tabIndex: true,
  title: true,
  translate: true,
  typeof: true,
  value: true,
  vocab: true,
  width: true,
  // ARIA attributes
  'aria-activedescendant': true,
  'aria-atomic': true,
  'aria-autocomplete': true,
  'aria-busy': true,
  'aria-checked': true,
  'aria-colcount': true,
  'aria-colindex': true,
  'aria-colspan': true,
  'aria-controls': true,
  'aria-current': true,
  'aria-describedby': true,
  'aria-description': true,
  'aria-details': true,
  'aria-disabled': true,
  'aria-errormessage': true,
  'aria-expanded': true,
  'aria-flowto': true,
  'aria-haspopup': true,
  'aria-hidden': true,
  'aria-invalid': true,
  'aria-keyshortcuts': true,
  'aria-label': true,
  'aria-labelledby': true,
  'aria-level': true,
  'aria-live': true,
  'aria-modal': true,
  'aria-multiline': true,
  'aria-multiselectable': true,
  'aria-orientation': true,
  'aria-owns': true,
  'aria-placeholder': true,
  'aria-posinset': true,
  'aria-pressed': true,
  'aria-readonly': true,
  'aria-relevant': true,
  'aria-required': true,
  'aria-roledescription': true,
  'aria-rowcount': true,
  'aria-rowindex': true,
  'aria-rowspan': true,
  'aria-selected': true,
  'aria-setsize': true,
  'aria-sort': true,
  'aria-valuemax': true,
  'aria-valuemin': true,
  'aria-valuenow': true,
  'aria-valuetext': true,
} as const;

/**
 * Filters props to only include safe HTML attributes
 * Blocks dangerous event handlers and attributes
 */
function getSafeInputProps(props: Record<string, unknown>): Record<string, unknown> {
  const safeProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key in SAFE_INPUT_ATTRIBUTES) {
      safeProps[key] = value;
    }
  }
  return safeProps;
}

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

  // Track internal value for character count and clear button
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [_isFocused, setIsFocused] = useState(false);

  // Determine if controlled or uncontrolled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Memoize event handlers
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    },
    [isControlled, onChange]
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
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  }, [isControlled, onClear]);

  // Memoize input classes
  const inputClasses = useMemo(
    () =>
      [
        plaintext ? 'form-control-plaintext' : 'form-control',
        sizeClassMap[size],
        error && 'is-invalid',
        success && !error && 'is-valid',
        inputClassName,
      ]
        .filter(Boolean)
        .join(' '),
    [plaintext, size, error, success, inputClassName]
  );

  // Memoize wrapper classes
  const wrapperClasses = useMemo(
    () => [floating && 'form-floating', className].filter(Boolean).join(' '),
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
    () => [helperText && helperId, ariaDescribedBy].filter(Boolean).join(' '),
    [helperText, helperId, ariaDescribedBy]
  );

  // Get safe props (filter out dangerous event handlers)
  const safeProps = getSafeInputProps(props);

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

InputComponent.displayName = 'Input';

// Memoize component to prevent unnecessary re-renders
export const Input = memo(InputComponent);
