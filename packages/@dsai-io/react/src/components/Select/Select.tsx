import {
  autoUpdate,
  flip,
  offset,
  shift,
  size as sizeMiddleware,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useTypeahead,
} from '@floating-ui/react';
import {
  forwardRef,
  memo,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { isEnterKey, isEscapeKey } from '../../utils/keyboard';
import { ClearIcon } from '../../utils/misc';

import type { SelectOption, SelectOptionGroup, SelectProps, SelectSize } from './Select.types';

/**
 * Map select sizes to Bootstrap classes
 */
const sizeClassMap: Record<SelectSize, string> = {
  sm: 'form-select-sm',
  md: '',
  lg: 'form-select-lg',
};

/**
 * Check if options are grouped
 */
function isGroupedOptions<T>(
  options: SelectOption<T>[] | SelectOptionGroup<T>[]
): options is SelectOptionGroup<T>[] {
  return options.length > 0 && options[0] !== undefined && 'options' in options[0];
}

/**
 * Flatten grouped options into a single array
 */
function flattenOptions<T>(options: SelectOption<T>[] | SelectOptionGroup<T>[]): SelectOption<T>[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }
  return options;
}

/**
 * Check icon for selected options
 */
function CheckIcon(): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
    </svg>
  );
}

/**
 * Spinner icon for loading state
 */
function SpinnerIcon(): React.JSX.Element {
  return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />;
}

/**
 * Select component for dropdown selection
 *
 * A flexible dropdown select component built with Bootstrap 5 classes.
 * Supports single/multiple selection, search, custom rendering, and keyboard navigation.
 * Uses Floating UI for reliable dropdown positioning.
 *
 * ARIA behavior:
 * - Non-searchable: trigger is a button with aria-haspopup="listbox"
 * - Searchable: search input gets role="combobox" with aria-autocomplete="list"
 *
 * @see https://getbootstrap.com/docs/5.3/forms/select/
 */
export const Select = memo(
  forwardRef<HTMLButtonElement, SelectProps>(function Select<T = string>(
    {
      options,
      value,
      defaultValue,
      onChange,
      multiple = false,
      searchable = false,
      filterOption,
      size = 'md',
      label,
      placeholder = 'Select...',
      helperText,
      error = false,
      success = false,
      disabled = false,
      required = false,
      loading = false,
      clearable = false,
      onClear,
      renderOption,
      renderValue,
      name,
      id: providedId,
      className,
      style,
      'aria-label': ariaLabel,
      maxDropdownHeight = 300,
      noOptionsMessage = 'No options',
      loadingMessage = 'Loading...',
      onOpen,
      onClose,
      onSearchChange,
      tabIndex = 0,
      limit = 100,
      limitMessage = 'Type to search for more options',
    }: SelectProps<T>,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) {
    // Generate unique IDs
    const generatedId = useId();
    const selectId = providedId ?? generatedId;
    const labelId = `${selectId}-label`;
    const helperId = `${selectId}-helper`;
    const listboxId = `${selectId}-listbox`;
    const optionIdPrefix = `${selectId}-option`;

    // Refs
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const listContentRef = useRef<(string | null)[]>([]);

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Controllable value state
    const [currentValue, setCurrentValue] = useControllableState<T | T[] | undefined>({
      value,
      defaultValue,
      onChange: onChange as (value: T | T[] | undefined) => void,
    });

    // Merge refs for the trigger button
    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [ref]
    );

    // Flatten options for easier access
    const flatOptions = useMemo(() => flattenOptions(options), [options]);

    // Filter options based on search
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchValue) {
        return flatOptions;
      }

      const searchLower = searchValue.toLowerCase();
      return flatOptions.filter((option) => {
        if (filterOption) {
          return filterOption(option, searchValue);
        }
        return option.label.toLowerCase().includes(searchLower);
      });
    }, [flatOptions, searchable, searchValue, filterOption]);

    // Apply limit
    const isLimited = filteredOptions.length > limit;
    const displayOptions = isLimited ? filteredOptions.slice(0, limit) : filteredOptions;

    // Keep listContentRef in sync for type-ahead
    useEffect(() => {
      listContentRef.current = displayOptions.map((opt) => opt.label);
    }, [displayOptions]);

    // Helper: find next non-disabled index
    const findNextEnabledIndex = useCallback(
      (startIndex: number, direction: 1 | -1): number | null => {
        let index = startIndex;
        while (index >= 0 && index < displayOptions.length) {
          if (!(Reflect.get(displayOptions, index) as SelectOption<T> | undefined)?.disabled) {
            return index;
          }
          index += direction;
        }
        return null;
      },
      [displayOptions]
    );

    // Floating UI setup
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: (open) => {
        if (disabled || loading) {
          return;
        }
        setIsOpen(open);
        if (open) {
          onOpen?.();
          const firstEnabled = findNextEnabledIndex(0, 1);
          setFocusedIndex(firstEnabled);
          if (searchable) {
            requestAnimationFrame(() => {
              searchInputRef.current?.focus();
            });
          }
        } else {
          onClose?.();
          setSearchValue('');
          setFocusedIndex(null);
          // Return focus to trigger
          queueMicrotask(() => {
            triggerRef.current?.focus();
          });
        }
      },
      placement: 'bottom-start',
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 8 }),
        sizeMiddleware({
          apply({ rects, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
              maxHeight: `${Math.min(availableHeight - 8, maxDropdownHeight)}px`,
            });
          },
        }),
      ],
      whileElementsMounted: autoUpdate,
    });

    // Floating UI interaction hooks
    const click = useClick(context, {
      enabled: !disabled && !loading,
      toggle: true,
    });

    const dismiss = useDismiss(context, {
      escapeKey: true,
      outsidePress: true,
    });

    const typeahead = useTypeahead(context, {
      listRef: listContentRef,
      activeIndex: focusedIndex,
      onMatch: (index) => {
        if (index !== null && !(Reflect.get(displayOptions, index) as SelectOption<T> | undefined)?.disabled) {
          setFocusedIndex(index);
        }
      },
      enabled: isOpen && !searchable,
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, typeahead]);

    // Get selected options
    const selectedOptions = useMemo(() => {
      if (currentValue === undefined) {
        return [];
      }
      const values = Array.isArray(currentValue) ? currentValue : [currentValue];
      return flatOptions.filter((opt) => values.includes(opt.value));
    }, [currentValue, flatOptions]);

    // Check if a value is selected
    const isSelected = useCallback(
      (optionValue: T): boolean => {
        if (currentValue === undefined) {
          return false;
        }
        if (Array.isArray(currentValue)) {
          return currentValue.includes(optionValue);
        }
        return currentValue === optionValue;
      },
      [currentValue]
    );

    // Generate option ID for a given index
    const getOptionId = useCallback(
      (index: number): string => `${optionIdPrefix}-${index}`,
      [optionIdPrefix]
    );

    // Handle value change
    const handleSelect = useCallback(
      (option: SelectOption<T> | undefined) => {
        if (!option || option.disabled) {
          return;
        }

        if (multiple) {
          const currentArray = Array.isArray(currentValue) ? currentValue : [];
          if (currentArray.includes(option.value)) {
            setCurrentValue(currentArray.filter((v) => v !== option.value) as T[]);
          } else {
            setCurrentValue([...currentArray, option.value] as T[]);
          }
        } else {
          setCurrentValue(option.value as T | T[] | undefined);
          setIsOpen(false);
          onClose?.();
          setSearchValue('');
          setFocusedIndex(null);
          // Return focus to trigger after single selection
          queueMicrotask(() => {
            triggerRef.current?.focus();
          });
        }
      },
      [multiple, currentValue, setCurrentValue, onClose]
    );

    // Handle clear
    const handleClear = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        const newValue = multiple ? ([] as unknown as T | T[] | undefined) : undefined;
        setCurrentValue(newValue);
        onClear?.();
      },
      [multiple, setCurrentValue, onClear]
    );

    // Open the dropdown and focus the first enabled option
    const openDropdown = useCallback(() => {
      setIsOpen(true);
      onOpen?.();
      const firstEnabled = findNextEnabledIndex(0, 1);
      setFocusedIndex(firstEnabled);
      if (searchable) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    }, [onOpen, findNextEnabledIndex, searchable]);

    // Close the dropdown and reset search state
    const closeDropdown = useCallback(() => {
      setIsOpen(false);
      onClose?.();
      setSearchValue('');
      setFocusedIndex(null);
    }, [onClose]);

    // Handle Enter/Space key
    const handleActivateKey = useCallback(
      (e: KeyboardEvent) => {
        e.preventDefault();
        if (isOpen && focusedIndex !== null && focusedIndex >= 0) {
          const focusedOption = Reflect.get(displayOptions, focusedIndex) as SelectOption<T> | undefined;
          if (focusedOption) { handleSelect(focusedOption); }
        } else if (!isOpen) {
          openDropdown();
        }
      },
      [isOpen, focusedIndex, displayOptions, handleSelect, openDropdown],
    );

    // Handle arrow key navigation
    const handleArrowNavigation = useCallback(
      (e: KeyboardEvent, direction: 1 | -1) => {
        e.preventDefault();
        if (!isOpen && direction === 1) {
          openDropdown();
          return;
        }
        if (!isOpen) { return; }
        const startIndex = direction === 1
          ? (focusedIndex ?? -1) + 1
          : (focusedIndex ?? displayOptions.length) - 1;
        const next = findNextEnabledIndex(startIndex, direction);
        if (next !== null) { setFocusedIndex(next); }
      },
      [isOpen, focusedIndex, displayOptions.length, findNextEnabledIndex, openDropdown],
    );

    // Handle keyboard on trigger (Enter/Space to select, Home/End, Arrow navigation)
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (disabled || loading) { return; }

        if (isEnterKey(e) || e.key === ' ') { handleActivateKey(e); return; }
        if (e.key === 'ArrowDown') { handleArrowNavigation(e, 1); return; }
        if (e.key === 'ArrowUp') { handleArrowNavigation(e, -1); return; }

        if (e.key === 'Home' && isOpen) {
          e.preventDefault();
          const first = findNextEnabledIndex(0, 1);
          if (first !== null) { setFocusedIndex(first); }
          return;
        }

        if (e.key === 'End' && isOpen) {
          e.preventDefault();
          const last = findNextEnabledIndex(displayOptions.length - 1, -1);
          if (last !== null) { setFocusedIndex(last); }
          return;
        }

        if (e.key === 'Tab' && isOpen) { closeDropdown(); }
      },
      [
        disabled,
        loading,
        isOpen,
        displayOptions,
        handleActivateKey,
        handleArrowNavigation,
        findNextEnabledIndex,
        closeDropdown,
      ],
    );

    // Handle search input change
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchValue(newValue);
        setFocusedIndex(0);
        onSearchChange?.(newValue);
      },
      [onSearchChange]
    );

    // Handle search input keyboard navigation
    const handleSearchKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = findNextEnabledIndex((focusedIndex ?? -1) + 1, 1);
          if (next !== null) {
            setFocusedIndex(next);
          }
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = findNextEnabledIndex((focusedIndex ?? displayOptions.length) - 1, -1);
          if (prev !== null) {
            setFocusedIndex(prev);
          }
          return;
        }

        if (isEnterKey(e) && focusedIndex !== null && focusedIndex >= 0) {
          e.preventDefault();
          const option = Reflect.get(displayOptions, focusedIndex) as SelectOption<T> | undefined;
          if (option) {
            handleSelect(option);
          }
          return;
        }

        if (isEscapeKey(e)) {
          e.preventDefault();
          setIsOpen(false);
          onClose?.();
          setSearchValue('');
          setFocusedIndex(null);
          queueMicrotask(() => {
            triggerRef.current?.focus();
          });
        }
      },
      [focusedIndex, displayOptions, handleSelect, onClose, findNextEnabledIndex]
    );

    // Scroll focused option into view
    useEffect(() => {
      if (isOpen && focusedIndex !== null && focusedIndex >= 0 && listboxRef.current) {
        const children = Array.from(listboxRef.current.querySelectorAll('[role="option"]'));
        const focusedElement = Reflect.get(children, focusedIndex) as HTMLElement | undefined;
        if (focusedElement && typeof focusedElement.scrollIntoView === 'function') {
          focusedElement.scrollIntoView({ block: 'nearest' });
        }
      }
    }, [isOpen, focusedIndex]);

    // Build button classes
    const buttonClasses = cn(
      'form-select',
      Reflect.get(sizeClassMap, size) as string ?? '',
      error && 'is-invalid',
      success && !error && 'is-valid',
      'd-flex align-items-center justify-content-between'
    );

    // Render display value
    const renderDisplayValue = (): ReactNode => {
      if (selectedOptions.length === 0) {
        return <span className="text-body-secondary">{placeholder}</span>;
      }

      if (renderValue) {
        const valueToRender = multiple ? selectedOptions : selectedOptions[0];
        if (valueToRender) {
          return renderValue(valueToRender);
        }
      }

      if (multiple) {
        return selectedOptions.map((opt) => opt.label).join(', ');
      }

      return selectedOptions[0]?.label ?? '';
    };

    // Render option item
    const renderOptionItem = (option: SelectOption<T>, index: number): React.JSX.Element => {
      const selected = isSelected(option.value);
      const focused = index === focusedIndex;

      return (
        <div
          key={String(option.value)}
          id={getOptionId(index)}
          role="option"
          tabIndex={-1}
          aria-selected={selected}
          aria-disabled={option.disabled || undefined}
          className={cn(
            'dropdown-item',
            'd-flex align-items-center gap-2',
            selected && 'active',
            focused && 'bg-light',
            option.disabled && 'disabled'
          )}
          onClick={() => handleSelect(option)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(option); } }}
          onMouseEnter={() => setFocusedIndex(index)}
          style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}
        >
          {multiple && (
            <span
              className={cn(
                'border rounded d-inline-flex align-items-center justify-content-center',
                selected && 'bg-primary border-primary text-white'
              )}
              style={{ width: '18px', height: '18px' }}
            >
              {selected && <CheckIcon />}
            </span>
          )}
          {renderOption ? renderOption(option, selected) : option.label}
          {!multiple && selected && <CheckIcon />}
        </div>
      );
    };

    // Build flat index map for grouped rendering
    const flatIndexMap = useMemo(() => {
      const map = new Map<T, number>();
      displayOptions.forEach((opt, i) => {
        map.set(opt.value, i);
      });
      return map;
    }, [displayOptions]);

    // Render options list
    const renderOptions = (): React.JSX.Element => {
      if (loading) {
        return (
          <div className="dropdown-item text-muted d-flex align-items-center gap-2">
            <SpinnerIcon />
            {loadingMessage}
          </div>
        );
      }

      if (displayOptions.length === 0) {
        return <div className="dropdown-item text-muted">{noOptionsMessage}</div>;
      }

      if (isGroupedOptions(options)) {
        const displayValueSet = new Set(displayOptions.map((opt) => opt.value));

        return (
          <>
            {options.map((group) => {
              const visibleGroupOptions = group.options.filter((opt) =>
                displayValueSet.has(opt.value)
              );
              if (visibleGroupOptions.length === 0) {
                return null;
              }

              const groupLabelId = `${selectId}-group-${group.label
                .replaceAll(/\s+/g, '-')
                .toLowerCase()}`;

              return (
                <div key={group.label} role="group" aria-labelledby={groupLabelId}>
                  <div role="presentation" id={groupLabelId} className="dropdown-header">
                    {group.label}
                  </div>
                  {visibleGroupOptions.map((opt) => {
                    const flatIndex = flatIndexMap.get(opt.value) ?? 0;
                    return renderOptionItem(opt, flatIndex);
                  })}
                </div>
              );
            })}
          </>
        );
      }

      return <>{displayOptions.map((opt, index) => renderOptionItem(opt, index))}</>;
    };

    // Build aria-describedby
    const describedByIds = helperText ? helperId : undefined;

    // Has value for clear button
    const hasValue = selectedOptions.length > 0;
    const showClearButton = clearable && hasValue && !disabled && !loading;

    // Pre-compute floating-ui interaction props to avoid ref access in JSX
    const referenceInteractionProps = getReferenceProps();

    // Merge floating-ui keyboard handler with our custom handler
    const mergedKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        handleKeyDown(e);
        const floatingKeyDown = Reflect.get(referenceInteractionProps, 'onKeyDown');
        if (typeof floatingKeyDown === 'function') {
          (floatingKeyDown as React.KeyboardEventHandler<HTMLButtonElement>)(e);
        }
      },
      [handleKeyDown, referenceInteractionProps]
    );

    return (
      <div className={className} style={style}>
        {/* Label */}
        {label && (
          <label id={labelId} htmlFor={selectId} className="form-label">
            {label}
            {required && (
              <span className="text-danger ms-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Hidden native select for form submission */}
        {name && (
          <select
            name={name}
            multiple={multiple}
            value={
              multiple
                ? (Array.isArray(currentValue) ? currentValue : []).map(String)
                : currentValue !== undefined
                  ? String(currentValue)
                  : ''
            }
            onChange={() => {}}
            style={{ display: 'none' }}
            aria-hidden="true"
            tabIndex={-1}
          >
            <option value="" />
            {flatOptions.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Custom select trigger */}
        <div className="position-relative">
          {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- Button acts as form select trigger, aria-required/invalid are semantically appropriate */}
          <button
            ref={(node) => {
              setTriggerRef(node);
              refs.setReference(node);
            }}
            type="button"
            id={selectId}
            className={buttonClasses}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? ariaLabel : undefined}
            aria-describedby={describedByIds}
            aria-controls={isOpen ? listboxId : undefined}
            aria-required={required || undefined}
            aria-invalid={error || undefined}
            aria-busy={loading || undefined}
            data-state={isOpen ? 'open' : 'closed'}
            tabIndex={disabled ? -1 : (tabIndex ?? 0)}
            style={{
              textAlign: 'left',
              paddingRight: showClearButton ? '4rem' : undefined,
            }}
            {...referenceInteractionProps}
            onKeyDown={mergedKeyDown}
          >
            <span className="flex-grow-1 text-truncate">{renderDisplayValue()}</span>
          </button>

          {/* Clear button */}
          {showClearButton && (
            <button
              type="button"
              className="btn btn-link position-absolute p-0 border-0"
              onClick={handleClear}
              aria-label="Clear selection"
              tabIndex={-1}
              style={{
                right: '2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--bs-secondary)',
              }}
            >
              <ClearIcon />
            </button>
          )}

          {/* Dropdown */}
          {isOpen && (
            <div
              ref={(node) => {
                refs.setFloating(node);
              }}
              className="dropdown-menu show"
              data-state="open"
              style={{
                ...floatingStyles,
                overflowY: 'auto',
              }}
              {...getFloatingProps()}
            >
              {/* Search input */}
              {searchable && (
                <div className="px-2 pb-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    role="combobox"
                    className="form-control form-control-sm"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Search options"
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-activedescendant={
                      focusedIndex !== null && focusedIndex >= 0
                        ? getOptionId(focusedIndex)
                        : undefined
                    }
                    aria-expanded
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              )}

              {/* Options list */}
              <div
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                tabIndex={-1}
                aria-multiselectable={multiple || undefined}
                aria-labelledby={label ? labelId : undefined}
                aria-activedescendant={
                  focusedIndex !== null && focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined
                }
                className="list-unstyled mb-0"
              >
                {renderOptions()}
              </div>

              {/* Limit message */}
              {isLimited && (
                <div className="dropdown-item text-muted small fst-italic" aria-live="polite">
                  {limitMessage}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper text */}
        {helperText && (
          <div id={helperId} className={error ? 'invalid-feedback d-block' : 'form-text'}>
            {helperText}
          </div>
        )}
      </div>
    );
  }) as <T = string>(
    props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
  ) => React.JSX.Element
) as <T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) => React.JSX.Element;

(Select as React.FC).displayName = 'Select';
