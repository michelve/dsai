import { forwardRef, useId, useState, type KeyboardEvent } from 'react';

import type { SwitchProps, SwitchSize } from './Switch.types';

/**
 * Size dimensions for the switch (in pixels)
 */
const sizeDimensions: Record<
  SwitchSize,
  { trackWidth: number; trackHeight: number; thumbSize: number }
> = {
  sm: { trackWidth: 32, trackHeight: 18, thumbSize: 14 },
  md: { trackWidth: 44, trackHeight: 24, thumbSize: 20 },
  lg: { trackWidth: 56, trackHeight: 30, thumbSize: 26 },
};

/**
 * Switch component for binary on/off states
 *
 * A toggle switch component built with Bootstrap 5 styling.
 * Supports sizes, labels, loading state, and smooth animations.
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
 *   checked={darkMode}
 *   onChange={setDarkMode}
 *   label="Dark mode"
 * />
 *
 * // With loading state
 * <Switch loading label="Processing..." />
 *
 * // Different sizes
 * <Switch size="sm" label="Small" />
 * <Switch size="lg" label="Large" />
 * ```
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    label,
    labelPosition = 'end',
    helperText,
    disabled = false,
    loading = false,
    error = false,
    required = false,
    onIcon,
    offIcon,
    onText,
    offText,
    name,
    value,
    id: providedId,
    className,
    style,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    tabIndex = 0,
  },
  ref
) {
  // Generate unique IDs
  const generatedId = useId();
  const switchId = providedId ?? generatedId;
  const labelId = `${switchId}-label`;
  const helperId = `${switchId}-helper`;

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Determine if controlled
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  // Handle toggle
  const handleToggle = (): void => {
    if (disabled || loading) {
      return;
    }

    const newValue = !isChecked;

    if (!isControlled) {
      setInternalChecked(newValue);
    }

    onChange?.(newValue);
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Get size dimensions
  const { trackWidth, trackHeight, thumbSize } = sizeDimensions[size];

  // Calculate thumb position
  const thumbOffset = 2; // padding inside track
  const thumbTranslateX = isChecked ? trackWidth - thumbSize - thumbOffset * 2 : 0;

  // Build track classes
  const trackClasses = [
    'position-relative d-inline-flex align-items-center rounded-pill',
    isChecked ? 'bg-primary' : 'bg-secondary',
    (disabled || loading) && 'opacity-50',
    error && 'border border-danger',
  ]
    .filter(Boolean)
    .join(' ');

  // Build wrapper classes
  const wrapperClasses = [
    'd-inline-flex align-items-center gap-2',
    labelPosition === 'start' && 'flex-row-reverse',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build aria-describedby
  const describedByIds = [helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ');

  // Render loading spinner
  const renderSpinner = (): React.JSX.Element => (
    <span
      className="spinner-border spinner-border-sm text-primary"
      role="status"
      aria-hidden="true"
      style={{
        width: `${thumbSize - 6}px`,
        height: `${thumbSize - 6}px`,
      }}
    />
  );

  // Render thumb content
  const renderThumbContent = (): React.ReactNode => {
    if (loading) {
      return renderSpinner();
    }
    if (isChecked && onIcon) {
      return onIcon;
    }
    if (!isChecked && offIcon) {
      return offIcon;
    }
    return null;
  };

  return (
    <div style={style}>
      <div className={wrapperClasses}>
        {/* Hidden input for form submission */}
        {name && <input type="hidden" name={name} value={isChecked ? (value ?? 'on') : ''} />}

        {/* Switch button */}
        <button
          ref={ref}
          type="button"
          id={switchId}
          role="switch"
          aria-checked={isChecked}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedByIds || undefined}
          aria-busy={loading || undefined}
          disabled={disabled || loading}
          tabIndex={disabled ? -1 : tabIndex}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={trackClasses}
          style={{
            width: `${trackWidth}px`,
            height: `${trackHeight}px`,
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            border: 'none',
            padding: `${thumbOffset}px`,
            transition: 'background-color 0.15s ease-in-out',
          }}
        >
          {/* On/Off text inside track */}
          {(onText || offText) && (
            <span
              className="position-absolute text-white small fw-bold"
              style={{
                left: isChecked ? `${thumbOffset + 4}px` : 'auto',
                right: isChecked ? 'auto' : `${thumbOffset + 4}px`,
                fontSize: size === 'sm' ? '8px' : size === 'lg' ? '11px' : '9px',
                userSelect: 'none',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {isChecked ? onText : offText}
            </span>
          )}

          {/* Thumb */}
          <span
            className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm"
            style={{
              width: `${thumbSize}px`,
              height: `${thumbSize}px`,
              transform: `translateX(${thumbTranslateX}px)`,
              transition: 'transform 0.15s ease-in-out',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {renderThumbContent()}
          </span>
        </button>

        {/* Label */}
        {label && (
          <span
            id={labelId}
            className="form-label mb-0"
            style={{ cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleToggle();
              }
            }}
            role="presentation"
          >
            {label}
            {required && (
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
        )}
      </div>

      {/* Helper text */}
      {helperText && (
        <div
          id={helperId}
          className={error ? 'invalid-feedback d-block' : 'form-text'}
          style={{
            marginLeft: labelPosition === 'end' ? `calc(${trackWidth}px + 0.5rem)` : 0,
          }}
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';
