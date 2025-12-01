import { forwardRef, memo, useEffect, useId, useMemo, useRef } from 'react';

import type { CheckboxProps } from './Checkbox.types';

// Development-only warning for accessibility issues
const warnedComponents = new Set<string>();

function warnMissingAccessibleName(componentId: string, componentName: string): void {
  if (
    typeof process !== 'undefined' &&
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

// Safe whitelist of HTML attributes allowed on input element
// Blocks all event handlers and dangerous attributes
const SAFE_INPUT_ATTRIBUTES = {
  accept: true,
  acceptCharset: true,
  alt: true,
  autoComplete: true,
  autoFocus: true,
  capture: true,
  className: true,
  contentEditable: true,
  crossOrigin: true,
  data: true,
  datatype: true,
  defaultChecked: true,
  defaultValue: true,
  dir: true,
  disabled: true,
  draggable: true,
  form: true,
  formAction: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: true,
  formTarget: true,
  height: true,
  hidden: true,
  id: true,
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
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    // Set indeterminate property on input element
    // This must be done via JavaScript as there's no HTML attribute for it
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate, inputRef]);

    // Development-only warning for missing accessible name
    useEffect(() => {
      if (!label && !ariaLabel) {
        warnMissingAccessibleName(id, 'Checkbox');
      }
    }, [label, ariaLabel, id]);

    // Memoize wrapper classes
    const wrapperClasses = useMemo(
      () =>
        [
          'form-check',
          isSwitch && 'form-switch',
          inline && 'form-check-inline',
          reverse && 'form-check-reverse',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isSwitch, inline, reverse, className]
    );

    // Memoize input classes
    const inputClasses = useMemo(
      () => ['form-check-input', error && 'is-invalid'].filter(Boolean).join(' '),
      [error]
    );

    // Memoize label classes
    const labelClasses = useMemo(() => ['form-check-label'].filter(Boolean).join(' '), []);

    // Memoize helper text classes
    const helperClasses = useMemo(
      () => [error ? 'invalid-feedback' : 'form-text'].filter(Boolean).join(' '),
      [error]
    );

    // Get safe props (filter out dangerous event handlers)
    const safeProps = getSafeInputProps(rest);

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
          aria-checked={indeterminate ? 'mixed' : undefined}
          {...safeProps}
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

CheckboxComponent.displayName = 'Checkbox';

// Memoize component to prevent unnecessary re-renders
export const Checkbox = memo(CheckboxComponent);

// Preserve displayName through memo wrapper for DevTools
Checkbox.displayName = 'Checkbox';
