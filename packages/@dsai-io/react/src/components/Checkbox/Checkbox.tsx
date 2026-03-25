import {
  forwardRef,
  type InputHTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import './Checkbox.css';

import { cn } from '../../utils';
import { getSafeInputProps } from '../../utils/misc';

import type { CheckboxProps } from './Checkbox.types';

// Development-only warning for accessibility issues
const warnedComponents = new Set<string>();

function warnMissingAccessibleName(componentId: string, componentName: string): void {
  if (
    typeof process !== 'undefined' &&
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
    process.env?.['NODE_ENV'] !== 'production' &&
    !warnedComponents.has(componentId)
  ) {
    warnedComponents.add(componentId);
    console.warn(
      `[DSAi ${componentName}] Missing accessible name. ` +
        `Provide either a "label" prop or an "aria-label" attribute for screen reader users. ` +
        `This warning will only appear in development mode.`
    );
  }
}

/**
 * Checkbox Component
 *
 * A Bootstrap 5 checkbox component for form inputs.
 * Supports controlled and uncontrolled modes, indeterminate state,
 * error states, and switch styling.
 *
 * Security Features:
 * - Restricts prop spreading to safe HTML attributes only
 * - Blocks dangerous event handlers (onLoad, onError, etc.)
 * - Uses explicit whitelist for input element attributes
 *
 * Performance Features:
 * - Memoized class name construction (useMemo)
 * - Component wrapped with React.memo to prevent unnecessary re-renders
 * - Memoized ID calculation for helper text
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

const CheckboxComponent = forwardRef<HTMLInputElement, CheckboxProps>(
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
      size,
      variant,
      readOnly = false,
      checkedIcon,
      uncheckedIcon,
      indeterminateIcon,
      'aria-label': ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const generatedId = useId();
    const id = providedId || generatedId;

    // Memoize helperId calculation
    const helperId = useMemo(() => (helperText ? `${id}-helper` : undefined), [helperText, id]);

    // Internal ref for indeterminate state
    const internalRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    // Set indeterminate property on input element
    // This must be done via JavaScript as there's no HTML attribute for it
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Development-only warning for missing accessible name
    useEffect(() => {
      if (!label && !ariaLabel) {
        warnMissingAccessibleName(id, 'Checkbox');
      }
    }, [label, ariaLabel, id]);

    // ReadOnly handlers — HTML readOnly has no effect on checkboxes, so enforce via JS
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLInputElement>) => {
        if (readOnly && !disabled) {
          event.preventDefault();
        }
      },
      [readOnly, disabled]
    );

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly && !disabled) {
          return;
        }
        onChange?.(event);
      },
      [readOnly, disabled, onChange]
    );

    // Custom icon support
    const hasCustomIcons = checkedIcon !== undefined && uncheckedIcon !== undefined;

    // Dev warning: custom icons require controlled mode
    useEffect(() => {
      if (
        hasCustomIcons &&
        checked === undefined &&
        typeof process !== 'undefined' &&
        // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
        process.env?.['NODE_ENV'] !== 'production'
      ) {
        console.warn(
          '[DSAi Checkbox] Custom icons require controlled mode (checked + onChange). Uncontrolled checkboxes cannot update icon state.'
        );
      }
    }, [hasCustomIcons, checked]);

    const currentIcon = useMemo(() => {
      if (!hasCustomIcons) {
        return null;
      }
      if (indeterminate) {
        return (
          indeterminateIcon ?? (
            <span className="dsai-checkbox-icon-fallback" aria-hidden="true">
              —
            </span>
          )
        );
      }
      return checked ? checkedIcon : uncheckedIcon;
    }, [hasCustomIcons, indeterminate, indeterminateIcon, checked, checkedIcon, uncheckedIcon]);

    // Memoize wrapper classes
    const wrapperClasses = useMemo(
      () =>
        cn(
          'form-check',
          isSwitch && 'form-switch',
          inline && 'form-check-inline',
          reverse && 'form-check-reverse',
          size === 'sm' && 'dsai-checkbox-sm',
          size === 'lg' && 'dsai-checkbox-lg',
          variant && `dsai-checkbox-${variant}`,
          readOnly && !disabled && 'dsai-checkbox-readonly',
          className
        ),
      [isSwitch, inline, reverse, size, variant, readOnly, disabled, className]
    );

    // Memoize input classes
    const inputClasses = useMemo(
      () => cn('form-check-input', error && 'is-invalid', hasCustomIcons && 'visually-hidden'),
      [error, hasCustomIcons]
    );

    // Label classes (static, no memoization needed)
    const labelClasses = 'form-check-label';

    // Memoize helper text classes
    const helperClasses = useMemo(() => cn(error ? 'invalid-feedback' : 'form-text'), [error]);

    // Get safe props (filter out dangerous event handlers)
    const safeProps = getSafeInputProps(rest) as InputHTMLAttributes<HTMLInputElement>;

    return (
      <div className={wrapperClasses} style={style} data-size={size}>
        <input
          ref={internalRef}
          type="checkbox"
          id={id}
          className={inputClasses}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          onClick={handleClick}
          disabled={disabled}
          aria-readonly={readOnly && !disabled ? true : undefined}
          name={name}
          value={value}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          aria-label={!label ? ariaLabel : undefined}
          aria-checked={indeterminate ? 'mixed' : undefined}
          {...safeProps}
        />
        {hasCustomIcons && (
          <label htmlFor={id} className="dsai-checkbox-icon" aria-hidden="true">
            <span aria-hidden="true">{currentIcon}</span>
          </label>
        )}
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

CheckboxComponent.displayName = 'Checkbox';

// Memoize component to prevent unnecessary re-renders
export const Checkbox = memo(CheckboxComponent);

// Preserve displayName through memo wrapper for DevTools
Checkbox.displayName = 'Checkbox';
