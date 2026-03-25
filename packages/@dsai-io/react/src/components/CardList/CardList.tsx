/**
 * CardList Component
 *
 * A high-level component for managing groups of SelectableCards with
 * selection logic. Uses the SelectableCard primitive internally.
 *
 * Features:
 * - Three selection modes: none / single / multiple
 * - Controlled and uncontrolled modes
 * - Proper group-level accessibility (fieldset/legend)
 * - FSM-based state management for predictable behavior
 * - Responsive grid/flex layout options
 *
 * Security Features:
 * - Uses SelectableCard which has safe attribute handling
 * - No dangerouslySetInnerHTML
 * - Props are typed and validated
 *
 * @see https://getbootstrap.com/docs/5.3/components/card/
 * @module CardList
 */

import { forwardRef, memo, useCallback, useEffect, useId, useMemo, useReducer } from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { SelectableCard } from '../SelectableCard';

import {
  cardListFSMReducer,
  createInitialCardListFSMState,
  resetFromPropsEvent,
  selectItemEvent,
  toggleItemEvent,
} from './CardList.fsm';

import type { CardListProps } from './CardList.types';

// Development warning for accessibility
const WARN_CACHE_LIMIT = 50;
const warnedLists = new Set<string>();

function warnMissingListLabel(listId: string): void {
  if (
    typeof process !== 'undefined' &&
    // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket access
    process.env?.['NODE_ENV'] !== 'production' &&
    !warnedLists.has(listId)
  ) {
    if (warnedLists.size >= WARN_CACHE_LIMIT) {
      const first = warnedLists.values().next().value;
      if (first !== undefined) warnedLists.delete(first);
    }
    warnedLists.add(listId);
    console.warn(
      `[DSAi CardList] Missing accessible label. ` +
        `Provide a "label" prop or "aria-label"/"aria-labelledby" for screen reader users. ` +
        `This warning will only appear in development mode.`
    );
  }
}

/**
 * CardList Component
 *
 * Manages a list of SelectableCard components with selection logic.
 *
 * @example
 * ```tsx
 * // Display only (no selection)
 * <CardList
 *   label="Available plans"
 *   items={[
 *     { value: 'basic', title: 'Basic', description: '$9/month' },
 *     { value: 'pro', title: 'Pro', description: '$29/month' },
 *   ]}
 * />
 *
 * // Single selection (radio-like)
 * <CardList
 *   label="Select a plan"
 *   selectionMode="single"
 *   items={plans}
 *   value={selectedPlan}
 *   onChange={setSelectedPlan}
 * />
 *
 * // Multiple selection (checkbox-like)
 * <CardList
 *   label="Select features"
 *   selectionMode="multiple"
 *   items={features}
 *   value={selectedFeatures}
 *   onChange={setSelectedFeatures}
 * />
 * ```
 */
// Use internal type for implementation (more permissive), but expose public discriminated union type
const CardListComponent = forwardRef<HTMLFieldSetElement, CardListProps>(
  (
    {
      items,
      selectionMode = 'none',
      value,
      defaultValue,
      onChange,
      name,
      disabled = false,
      error = false,
      errorMessage,
      required = false,
      size,
      variant = 'outlined',
      selectedColor,
      horizontal = false,
      orientation = 'vertical',
      gap = '0.5rem',
      columns,
      label,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': externalDescribedby,
      helperText,
      onVisualStateChange,
      renderItem,
      className = '',
      style,
      id: providedId,
      dangerouslySetInnerHTML: _dSIH,
      ...rest
    },
    ref
  ) => {
    // Generate unique IDs
    const generatedId = useId();
    const id = providedId || generatedId;
    const labelId = `${id}-label`;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    // Ensure radio groups always have a stable name for accessibility
    const computedName = useMemo(() => {
      if (selectionMode === 'single') {
        return name ?? `${id}-group`;
      }
      return name;
    }, [selectionMode, name, id]);

    // Compute enabled items
    const enabledItems = useMemo(
      () => items.filter((item) => !item.disabled && !disabled),
      [items, disabled]
    );
    const enabledValues = useMemo(() => enabledItems.map((item) => item.value), [enabledItems]);
    const totalEnabled = enabledValues.length;

    // Normalize value to array
    const normalizeValue = useCallback((val: string | string[] | undefined): string[] => {
      if (val === undefined) {
        return [];
      }
      if (Array.isArray(val)) {
        return val;
      }
      return [val];
    }, []);

    const normalizedValue = useMemo(
      () => (value !== undefined ? normalizeValue(value) : undefined),
      [value, normalizeValue]
    );

    const normalizedDefaultValue = useMemo(
      () => normalizeValue(defaultValue),
      [defaultValue, normalizeValue]
    );

    // Use centralized hook for controlled/uncontrolled state management
    const [selectedValues, setSelectedValues] = useControllableState<string[]>({
      value: normalizedValue,
      defaultValue: normalizedDefaultValue,
      onChange: (newValues) => {
        if (onChange) {
          // For single mode, return single value or undefined
          if (selectionMode === 'single') {
            onChange(newValues.length > 0 ? newValues[0] : undefined);
          } else {
            // For multiple mode, return array
            onChange(newValues);
          }
        }
      },
    });

    // Initialize FSM state with current selected values
    const [fsmState, dispatch] = useReducer(
      cardListFSMReducer,
      { values: selectedValues, mode: selectionMode, totalEnabled },
      (init) => createInitialCardListFSMState(init.values, init.mode, init.totalEnabled)
    );

    // Sync FSM with current selected values (controlled or uncontrolled)
    useEffect(() => {
      dispatch(resetFromPropsEvent(selectedValues, selectionMode, totalEnabled));
    }, [selectedValues, selectionMode, totalEnabled]);

    // Dev warning for missing accessible label
    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledby) {
        warnMissingListLabel(id);
      }
    }, [label, ariaLabel, ariaLabelledby, id]);

    // Handle card selection for single mode
    const handleSelectItem = useCallback(
      (itemValue: string) => {
        // Compute next state
        const nextState = cardListFSMReducer(fsmState, selectItemEvent(itemValue, totalEnabled));
        // Update selected values via hook (handles both controlled and uncontrolled)
        setSelectedValues(nextState.selectedValues);
      },
      [fsmState, totalEnabled, setSelectedValues]
    );

    // Handle card toggle for multiple mode
    const handleToggleItem = useCallback(
      (itemValue: string) => {
        // Compute next state
        const nextState = cardListFSMReducer(fsmState, toggleItemEvent(itemValue, totalEnabled));
        // Update selected values via hook (handles both controlled and uncontrolled)
        setSelectedValues(nextState.selectedValues);
      },
      [fsmState, totalEnabled, setSelectedValues]
    );

    // Handle card selection based on mode
    const handleCardChange = useCallback(
      (itemValue: string, checked: boolean) => {
        if (selectionMode === 'single') {
          // Only handle selection (not deselection) for single mode
          if (checked) {
            handleSelectItem(itemValue);
          }
        } else if (selectionMode === 'multiple') {
          handleToggleItem(itemValue);
        }
      },
      [selectionMode, handleSelectItem, handleToggleItem]
    );

    // Derive visual state for rendering (selectedValues comes from useControllableState)
    const { visualState } = fsmState;
    const renderSelectedValues = fsmState.selectedValues;

    // Notify consumer of visual state changes
    useEffect(() => {
      onVisualStateChange?.(visualState);
    }, [visualState, onVisualStateChange]);

    // Determine selection mode for SelectableCard
    const cardSelectionMode = useMemo(() => {
      switch (selectionMode) {
        case 'none':
          return 'none' as const;
        case 'single':
          return 'radio' as const;
        case 'multiple':
          return 'checkbox' as const;
        default:
          return 'none' as const;
      }
    }, [selectionMode]);

    // Build class names
    const wrapperClasses = useMemo(
      () => cn('card-list', error && 'has-error', className),
      [error, className]
    );

    // Whether columns is a responsive object
    const isResponsiveColumns = typeof columns === 'object';

    // Build container classes based on layout
    const containerClasses = useMemo(() => {
      if (isResponsiveColumns) {
        const classes = ['card-list-container', 'row'];
        if (columns.sm) classes.push(`row-cols-sm-${columns.sm}`);
        if (columns.md) classes.push(`row-cols-md-${columns.md}`);
        if (columns.lg) classes.push(`row-cols-lg-${columns.lg}`);
        if (columns.xl) classes.push(`row-cols-xl-${columns.xl}`);
        return classes.join(' ');
      }
      return 'card-list-container';
    }, [columns, isResponsiveColumns]);

    // Build container styles based on layout
    const containerStyle = useMemo<React.CSSProperties>(() => {
      if (isResponsiveColumns) {
        // Bootstrap row handles layout; use gap as inline style
        return { gap };
      }

      const baseStyle: React.CSSProperties = {
        gap,
      };

      if (typeof columns === 'number') {
        baseStyle.display = 'grid';
        baseStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      } else if (orientation === 'horizontal') {
        baseStyle.display = 'flex';
        baseStyle.flexWrap = 'wrap';
      } else {
        baseStyle.display = 'flex';
        baseStyle.flexDirection = 'column';
      }

      return baseStyle;
    }, [gap, columns, orientation, isResponsiveColumns]);

    // Compute describedby
    const computedDescribedby = useMemo(() => {
      const parts: string[] = [];
      if (externalDescribedby) {
        parts.push(externalDescribedby);
      }
      if (helperText) {
        parts.push(helperId);
      }
      if (error && errorMessage) {
        parts.push(errorId);
      }
      return parts.length > 0 ? parts.join(' ') : undefined;
    }, [externalDescribedby, helperText, helperId, error, errorMessage, errorId]);

    // Content inside fieldset
    const content = (
      <>
        {/* Legend */}
        {label && (
          <legend id={labelId} className="card-list-legend fw-semibold mb-2">
            {label}
            {required && selectionMode !== 'none' && <span className="text-danger ms-1">*</span>}
          </legend>
        )}

        {/* Helper text */}
        {helperText && (
          <div id={helperId} className="form-text mb-2">
            {helperText}
          </div>
        )}

        {/* Cards container */}
        <div className={containerClasses} style={containerStyle} data-visual-state={visualState}>
          {items.map((item, index) => {
            const itemId = `${id}-item-${item.value}`;
            const isSelected = renderSelectedValues.includes(item.value);
            const isDisabled = disabled || item.disabled;

            const card = (
              <SelectableCard
                key={item.value}
                id={itemId}
                value={item.value}
                name={selectionMode === 'none' ? undefined : computedName}
                selectionMode={cardSelectionMode}
                checked={isSelected}
                onChange={(checked) => handleCardChange(item.value, checked)}
                disabled={isDisabled}
                required={required}
                error={error}
                variant={variant}
                selectedColor={selectedColor}
                size={size}
                horizontal={horizontal}
                title={renderItem ? undefined : item.title}
                subtitle={renderItem ? undefined : item.subtitle}
                description={renderItem ? undefined : item.description}
                media={renderItem ? undefined : item.media}
                footer={renderItem ? undefined : item.footer}
              >
                {renderItem
                  ? renderItem(item, { checked: isSelected, disabled: isDisabled ?? false, index })
                  : item.children}
              </SelectableCard>
            );

            if (isResponsiveColumns) {
              return (
                <div key={item.value} className="col">
                  {card}
                </div>
              );
            }

            return card;
          })}
        </div>

        {/* Error message */}
        {error && errorMessage && (
          <div id={errorId} className="invalid-feedback d-block mt-2">
            {errorMessage}
          </div>
        )}
      </>
    );

    return (
      <fieldset
        ref={ref}
        {...rest}
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

CardListComponent.displayName = 'CardList';

// Memoize component and cast to public type for better DX
// The internal type is more permissive to allow easy implementation,
// but the public type provides discriminated union for type safety
export const CardList = memo(CardListComponent) as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<CardListProps & React.RefAttributes<HTMLFieldSetElement>>
>;

// Preserve displayName through memo wrapper
CardList.displayName = 'CardList';
