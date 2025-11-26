import {
  forwardRef,
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
 * Flatten grouped options
 */
function flattenOptions<T>(options: SelectOption<T>[] | SelectOptionGroup<T>[]): SelectOption<T>[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options);
  }
  return options;
}

/**
 * X icon for clear button
 */
function ClearIcon(): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
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
 *
 * @see https://getbootstrap.com/docs/5.3/forms/select/
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select<T = string>(
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
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  // Generate unique IDs
  const generatedId = useId();
  const selectId = providedId ?? generatedId;
  const labelId = `${selectId}-label`;
  const helperId = `${selectId}-helper`;
  const listboxId = `${selectId}-listbox`;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(defaultValue);

  // Determine if controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

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

  // Handle value change
  const handleSelect = useCallback(
    (option: SelectOption<T> | undefined) => {
      if (!option || option.disabled) {
        return;
      }

      let newValue: T | T[] | undefined;

      if (multiple) {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        if (currentArray.includes(option.value)) {
          newValue = currentArray.filter((v) => v !== option.value);
        } else {
          newValue = [...currentArray, option.value];
        }
      } else {
        newValue = option.value;
        setIsOpen(false);
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [multiple, currentValue, isControlled, onChange]
  );

  // Handle clear
  const handleClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      const newValue = multiple ? [] : undefined;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
      onClear?.();
    },
    [multiple, isControlled, onChange, onClear]
  );

  // Handle dropdown toggle
  const toggleDropdown = useCallback(() => {
    if (disabled || loading) {
      return;
    }

    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      onOpen?.();
      setFocusedIndex(0);
      // Focus search input if searchable
      setTimeout(() => {
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 0);
    } else {
      onClose?.();
      setSearchValue('');
      setFocusedIndex(-1);
    }
  }, [disabled, loading, isOpen, onOpen, onClose, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || loading) {
        return;
      }

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (!isOpen) {
            toggleDropdown();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            toggleDropdown();
          } else {
            setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          }
          break;

        case 'Home':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(0);
          }
          break;

        case 'End':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex(filteredOptions.length - 1);
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (isOpen) {
            setIsOpen(false);
            onClose?.();
            setSearchValue('');
          }
          break;

        case 'Tab':
          if (isOpen) {
            setIsOpen(false);
            onClose?.();
            setSearchValue('');
          }
          break;
      }
    },
    [
      disabled,
      loading,
      isOpen,
      focusedIndex,
      filteredOptions,
      handleSelect,
      toggleDropdown,
      onClose,
    ]
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onClose?.();
          setSearchValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const focusedElement = listboxRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement && typeof focusedElement.scrollIntoView === 'function') {
        focusedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, focusedIndex]);

  // Build button classes
  const buttonClasses = [
    'form-select',
    sizeClassMap[size],
    error && 'is-invalid',
    success && !error && 'is-valid',
    'd-flex align-items-center justify-content-between',
  ]
    .filter(Boolean)
    .join(' ');

  // Render display value
  const renderDisplayValue = (): ReactNode => {
    if (selectedOptions.length === 0) {
      return <span className="text-muted">{placeholder}</span>;
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
      <li
        key={String(option.value)}
        role="option"
        aria-selected={selected}
        aria-disabled={option.disabled}
        className={[
          'dropdown-item',
          'd-flex align-items-center gap-2',
          selected && 'active',
          focused && 'bg-light',
          option.disabled && 'disabled',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => handleSelect(option)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(option);
          }
        }}
        onMouseEnter={() => setFocusedIndex(index)}
        style={{ cursor: option.disabled ? 'not-allowed' : 'pointer' }}
      >
        {multiple && (
          <span
            className={`border rounded d-inline-flex align-items-center justify-content-center ${selected ? 'bg-primary border-primary text-white' : ''}`}
            style={{ width: '18px', height: '18px' }}
          >
            {selected && <CheckIcon />}
          </span>
        )}
        {renderOption ? renderOption(option, selected) : option.label}
        {!multiple && selected && <CheckIcon />}
      </li>
    );
  };

  // Render options list
  const renderOptions = (): React.JSX.Element => {
    if (loading) {
      return (
        <li className="dropdown-item text-muted d-flex align-items-center gap-2">
          <SpinnerIcon />
          {loadingMessage}
        </li>
      );
    }

    if (filteredOptions.length === 0) {
      return <li className="dropdown-item text-muted">{noOptionsMessage}</li>;
    }

    if (isGroupedOptions(options)) {
      let globalIndex = 0;
      return (
        <>
          {options.map((group) => (
            <div key={group.label}>
              <li className="dropdown-header">{group.label}</li>
              {group.options
                .filter((opt) => {
                  if (!searchable || !searchValue) {
                    return true;
                  }
                  const searchLower = searchValue.toLowerCase();
                  if (filterOption) {
                    return filterOption(opt, searchValue);
                  }
                  return opt.label.toLowerCase().includes(searchLower);
                })
                .map((opt) => {
                  const element = renderOptionItem(opt, globalIndex);
                  globalIndex++;
                  return element;
                })}
            </div>
          ))}
        </>
      );
    }

    return <>{filteredOptions.map((opt, index) => renderOptionItem(opt, index))}</>;
  };

  // Build aria-describedby
  const describedByIds = [helperText && helperId].filter(Boolean).join(' ');

  // Has value for clear button
  const hasValue = selectedOptions.length > 0;
  const showClearButton = clearable && hasValue && !disabled && !loading;

  return (
    <div ref={containerRef} className={className} style={style}>
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
        <button
          ref={ref}
          type="button"
          id={selectId}
          className={buttonClasses}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? ariaLabel : undefined}
          aria-describedby={describedByIds || undefined}
          aria-controls={isOpen ? listboxId : undefined}
          data-required={required || undefined}
          data-invalid={error || undefined}
          tabIndex={tabIndex}
          style={{
            textAlign: 'left',
            paddingRight: showClearButton ? '4rem' : undefined,
          }}
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
            className="dropdown-menu show w-100 mt-1"
            style={{ maxHeight: maxDropdownHeight, overflowY: 'auto' }}
          >
            {/* Search input */}
            {searchable && (
              <div className="px-2 pb-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Search options"
                />
              </div>
            )}

            {/* Options list */}
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple}
              aria-labelledby={label ? labelId : undefined}
              className="list-unstyled mb-0"
            >
              {renderOptions()}
            </ul>
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
) => React.JSX.Element;

(Select as React.FC).displayName = 'Select';
