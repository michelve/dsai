import { forwardRef, type KeyboardEvent, useId } from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';

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
 * Resolve size dimensions from the size prop, falling back to 'md'.
 */
function resolveDimensions(size: SwitchSize): { trackWidth: number; trackHeight: number; thumbSize: number } {
  return size in sizeDimensions
    ? sizeDimensions[size as keyof typeof sizeDimensions]
    : sizeDimensions.md;
}

/**
 * Resolve on/off text font size based on switch size.
 */
function resolveOnOffFontSize(size: SwitchSize): string {
  if (size === 'sm') { return '8px'; }
  if (size === 'lg') { return '11px'; }
  return '9px';
}

/**
 * Build button style for the switch control.
 */
function buildButtonStyle(
  disabled: boolean,
  loading: boolean,
  error: boolean,
  thumbOffset: number,
): React.CSSProperties {
  return {
    minHeight: '44px', // WCAG touch target
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: error ? undefined : 'none',
    padding: `${thumbOffset}px`,
    transition: 'background-color 0.15s ease-in-out',
    background: 'transparent',
  };
}

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

  // Controllable state
  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
    onChange,
  });

  // Handle toggle
  const handleToggle = (): void => {
    if (disabled || loading) {
      return;
    }

    setIsChecked(!isChecked);
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === ' ' || isEnterKey(e)) {
      e.preventDefault();
      handleToggle();
    }
  };

  // Get size dimensions
  const { trackWidth, trackHeight, thumbSize } = resolveDimensions(size);

  // Calculate thumb position
  const thumbOffset = 2; // padding inside track
  const thumbTranslateX = isChecked ? trackWidth - thumbSize - thumbOffset * 2 : 0;

  // Build button classes (single control containing track + label)
  const buttonClasses = cn('d-inline-flex align-items-center border-0', className);

  // Build wrapper classes
  const wrapperClasses = 'd-inline-flex align-items-center';

  // Build aria-describedby
  const describedByIds = cn(helperText && helperId, ariaDescribedBy);

  // Resolve track class names
  const trackClasses = cn(
    'position-relative d-inline-flex align-items-center rounded-pill',
    isChecked ? 'bg-primary' : 'bg-secondary',
    (disabled || loading) && 'opacity-50',
    error && 'border border-danger'
  );

  // Resolve button style
  const buttonStyle: React.CSSProperties = {
    minHeight: '44px', // WCAG touch target
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: error ? undefined : 'none',
    padding: `${thumbOffset}px`,
    transition: 'background-color 0.15s ease-in-out',
    background: 'transparent',
  };

  // Resolve on/off text font size
  const onOffFontSize = size === 'sm' ? '8px' : size === 'lg' ? '11px' : '9px';

  // Render loading spinner (purely visual; aria-busy on button signals loading state)
  const renderSpinner = (): React.JSX.Element => (
    <span
      className="spinner-border spinner-border-sm text-primary"
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

  /**
   * Render label content (inside button for single-control pattern).
   * This ensures one interactive element with consistent hit area.
   */
  const renderLabelContent = (): React.JSX.Element | null => {
    if (!label) {
      return null;
    }

    return (
      <span id={labelId} className="form-label mb-0 ms-2">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-hidden="true">
            *
          </span>
        )}
      </span>
    );
  };

  return (
    <div style={style}>
      <div className={wrapperClasses}>
        {/* Hidden input for form submission */}
        {name && <input type="hidden" name={name} value={isChecked ? (value ?? 'on') : ''} />}

        {/* Switch button - single control containing track, thumb, and label */}
        <button
          ref={ref}
          type="button"
          id={switchId}
          role="switch"
          aria-checked={isChecked}
          aria-label={ariaLabel ?? (label ? undefined : 'Toggle switch')}
          aria-describedby={describedByIds || undefined}
          aria-busy={loading || undefined}
          disabled={disabled || loading}
          tabIndex={disabled ? -1 : tabIndex}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`${buttonClasses} ${labelPosition === 'start' ? 'flex-row-reverse' : ''}`}
          style={buildButtonStyle(disabled, loading, error, thumbOffset)}
        >
          {/* Track (visual container) */}
          <span
            className={trackClasses}
            style={{
              width: `${trackWidth}px`,
              height: `${trackHeight}px`,
              padding: `${thumbOffset}px`,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {/* On/Off text inside track */}
            {(onText || offText) && (
              <span
                className="position-absolute text-white small fw-bold"
                style={{
                  left: isChecked ? `${thumbOffset + 4}px` : 'auto',
                  right: isChecked ? 'auto' : `${thumbOffset + 4}px`,
                  fontSize: resolveOnOffFontSize(size),
                  userSelect: 'none',
                  lineHeight: 1,
                }}
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
            >
              {renderThumbContent()}
            </span>
          </span>

          {/* Label inside button */}
          {renderLabelContent()}
        </button>
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
