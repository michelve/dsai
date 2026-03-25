/**
 * CheckboxGroup Component
 *
 * A high-level component for managing groups of checkboxes with tri-state
 * selection logic. Uses the Checkbox primitive internally without modifying it.
 *
 * Features:
 * - Tri-state selection: none / some / all
 * - Optional "select all" checkbox with indeterminate state
 * - Controlled and uncontrolled modes
 * - Proper group-level accessibility (fieldset/legend)
 * - FSM-based state management for predictable behavior
 *
 * Security Features:
 * - Uses Checkbox component which has safe attribute whitelist
 * - No dangerouslySetInnerHTML
 * - Props are typed and validated
 *
 * @see https://getbootstrap.com/docs/5.3/forms/checks-radios/
 * @module CheckboxGroup
 */

import { forwardRef, memo, useCallback, useEffect, useId, useMemo, useReducer } from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { Checkbox } from '../Checkbox/Checkbox';

import {
  checkboxGroupFSMReducer,
  createInitialCheckboxGroupFSMState,
  resetFromPropsEvent,
  toggleAllEvent,
  toggleItemEvent,
} from './CheckboxGroup.fsm';

import type { CheckboxGroupProps } from './CheckboxGroup.types';

// Development warning for accessibility
const warnedGroups = new Set<string>();

function warnMissingGroupLabel(groupId: string): void {
  if (
    typeof process !== 'undefined' &&
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
    process.env?.['NODE_ENV'] !== 'production' &&
    !warnedGroups.has(groupId)
  ) {
    warnedGroups.add(groupId);
    console.warn(
      `[DSAi CheckboxGroup] Missing accessible label. ` +
        `Provide a "label" prop or "aria-label"/"aria-labelledby" for screen reader users. ` +
        `This warning will only appear in development mode.`
    );
  }
}

/**
 * CheckboxGroup Component
 *
 * Manages a group of Checkbox components with tri-state selection logic.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CheckboxGroup
 *   label="Notification preferences"
 *   options={[
 *     { value: 'email', label: 'Email' },
 *     { value: 'sms', label: 'SMS' },
 *     { value: 'push', label: 'Push notifications' },
 *   ]}
 *   onChange={(values) => console.log('Selected:', values)}
 * />
 *
 * // With select all
 * <CheckboxGroup
 *   label="Select items"
 *   showSelectAll
 *   options={options}
 *   value={selected}
 *   onChange={setSelected}
 * />
 * ```
 */
const CheckboxGroupComponent = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    {
      label,
      helperText,
      options,
      value,
      defaultValue,
      onChange,
      name,
      required = false,
      showSelectAll = false,
      selectAllLabel = 'Select all',
      error = false,
      errorMessage,
      disabled = false,
      className = '',
      style,
      id: providedId,
      orientation = 'vertical',
      size,
      variant,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const id = providedId || generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    // Compute enabled options
    const enabledOptions = useMemo(
      () => options.filter((opt) => !opt.disabled && !disabled),
      [options, disabled]
    );
    const enabledValues = useMemo(() => enabledOptions.map((opt) => opt.value), [enabledOptions]);
    const totalEnabled = enabledValues.length;

    // Use centralized hook for controlled/uncontrolled state management
    const [selectedValues, setSelectedValues] = useControllableState<string[]>({
      value,
      defaultValue: defaultValue ?? [],
      onChange,
    });

    // Initialize FSM state with current selected values
    const [fsmState, dispatch] = useReducer(
      checkboxGroupFSMReducer,
      { values: selectedValues, totalEnabled },
      (init) => createInitialCheckboxGroupFSMState(init.values, init.totalEnabled)
    );

    // Sync FSM with current selected values (controlled or uncontrolled)
    useEffect(() => {
      dispatch(resetFromPropsEvent(selectedValues, totalEnabled));
    }, [selectedValues, totalEnabled]);

    // Dev warning for missing accessible label
    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledby) {
        warnMissingGroupLabel(id);
      }
    }, [label, ariaLabel, ariaLabelledby, id]);

    // Handle individual item toggle
    const handleToggleItem = useCallback(
      (optionValue: string) => {
        // Compute next state
        const nextState = checkboxGroupFSMReducer(
          fsmState,
          toggleItemEvent(optionValue, totalEnabled)
        );
        // Update selected values via hook (handles both controlled and uncontrolled)
        setSelectedValues(nextState.selectedValues);
      },
      [fsmState, totalEnabled, setSelectedValues]
    );

    // Handle "select all" toggle
    const handleToggleAll = useCallback(() => {
      // Compute next state
      const nextState = checkboxGroupFSMReducer(
        fsmState,
        toggleAllEvent(enabledValues, totalEnabled)
      );
      // Update selected values via hook (handles both controlled and uncontrolled)
      setSelectedValues(nextState.selectedValues);
    }, [fsmState, enabledValues, totalEnabled, setSelectedValues]);

    // Derive selection state for rendering (selectedValues managed by useControllableState)
    const { selectionState } = fsmState;
    const renderSelectedValues = fsmState.selectedValues;
    const selectAllChecked = selectionState === 'all';
    const selectAllIndeterminate = selectionState === 'some';

    // Build class names
    const wrapperClasses = useMemo(
      () => cn('checkbox-group', error && 'has-error', className),
      [error, className]
    );

    const optionsClasses = useMemo(
      () => cn('checkbox-group-options', orientation === 'horizontal' && 'd-flex flex-wrap gap-3'),
      [orientation]
    );

    // Compute describedby
    const computedDescribedby = useMemo(() => {
      const parts: string[] = [];
      if (ariaDescribedby) {
        parts.push(ariaDescribedby);
      }
      if (helperText) {
        parts.push(helperId);
      }
      if (error && errorMessage) {
        parts.push(errorId);
      }
      return parts.length > 0 ? parts.join(' ') : undefined;
    }, [ariaDescribedby, helperText, helperId, error, errorMessage, errorId]);

    // Content inside fieldset
    const content = (
      <>
        {/* Legend */}
        {label && (
          <legend id={labelId} className="checkbox-group-legend fw-semibold mb-2">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </legend>
        )}

        {/* Helper text */}
        {helperText && (
          <div id={helperId} className="form-text mb-2">
            {helperText}
          </div>
        )}

        {/* Select all checkbox */}
        {showSelectAll && (
          <div className="checkbox-group-select-all mb-2">
            <Checkbox
              label={selectAllLabel}
              checked={selectAllChecked}
              indeterminate={selectAllIndeterminate}
              onChange={handleToggleAll}
              disabled={disabled || totalEnabled === 0}
              size={size}
              variant={variant}
              aria-controls={options.map((opt) => `${id}-option-${opt.value}`).join(' ')}
            />
          </div>
        )}

        {/* Options */}
        <div className={optionsClasses} data-visual-state={selectionState}>
          {options.map((option) => {
            const optionId = `${id}-option-${option.value}`;
            const isSelected = renderSelectedValues.includes(option.value);
            const isDisabled = disabled || option.disabled;

            return (
              <Checkbox
                key={option.value}
                id={optionId}
                name={name}
                value={option.value}
                label={option.label}
                checked={isSelected}
                onChange={() => handleToggleItem(option.value)}
                disabled={isDisabled}
                required={required}
                helperText={option.helperText}
                inline={orientation === 'horizontal'}
                size={size}
                variant={variant}
              />
            );
          })}
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <div id={errorId} className="invalid-feedback d-block">
            {errorMessage}
          </div>
        )}
      </>
    );

    return (
      <fieldset
        ref={ref}
        id={id}
        aria-labelledby={ariaLabelledby}
        aria-label={!label && !ariaLabelledby ? ariaLabel : undefined}
        aria-describedby={computedDescribedby}
        aria-invalid={error || undefined}
        className={wrapperClasses}
        style={style}
        disabled={disabled}
      >
        {content}
      </fieldset>
    );
  }
);

CheckboxGroupComponent.displayName = 'CheckboxGroup';

// Memoize component to prevent unnecessary re-renders
export const CheckboxGroup = memo(CheckboxGroupComponent);

// Preserve displayName through memo wrapper
CheckboxGroup.displayName = 'CheckboxGroup';

// Re-export types
export type { CheckboxGroupOption, CheckboxGroupProps } from './CheckboxGroup.types';
