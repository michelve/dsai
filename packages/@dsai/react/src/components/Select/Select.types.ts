import type { CSSProperties, ReactNode } from 'react';
import type { ComponentSize } from '../../types';

/**
 * Option item for the Select component
 */
export interface SelectOption<T = string> {
  /**
   * Unique value for the option
   */
  value: T;

  /**
   * Display label for the option
   */
  label: string;

  /**
   * Whether the option is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Optional group this option belongs to
   */
  group?: string;

  /**
   * Custom data associated with the option
   */
  data?: Record<string, unknown>;
}

/**
 * Option group for organizing options
 */
export interface SelectOptionGroup<T = string> {
  /**
   * Group label
   */
  label: string;

  /**
   * Options in this group
   */
  options: SelectOption<T>[];
}

/**
 * Select sizes matching DS AI design tokens
 * @see ComponentSize
 */
export type SelectSize = ComponentSize;

/**
 * Select component props
 *
 * @see https://getbootstrap.com/docs/5.3/forms/select/\n *
 * @example
 * ```tsx
 * // Basic select
 * <Select
 *   label="Country"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'uk', label: 'United Kingdom' },
 *   ]}
 *   onChange={(value) => console.log(value)}
 * />
 *
 * // Multiple selection
 * <Select
 *   label="Skills"
 *   multiple
 *   options={skills}
 *   value={selectedSkills}
 *   onChange={setSelectedSkills}
 * />
 *
 * // Searchable
 * <Select
 *   label="Search countries"
 *   searchable
 *   options={countries}
 *   placeholder="Type to search..."
 * />
 * ```
 */
export interface SelectProps<T = string> {
  /**
   * Array of options or option groups
   */
  options: SelectOption<T>[] | SelectOptionGroup<T>[];

  /**
   * Current value (controlled mode)
   */
  value?: T | T[];

  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: T | T[];

  /**
   * Callback when selection changes
   */
  onChange?: (value: T | T[] | undefined) => void;

  /**
   * Enable multiple selection
   * @default false
   */
  multiple?: boolean;

  /**
   * Enable search/filter functionality
   * @default false
   */
  searchable?: boolean;

  /**
   * Custom search function
   */
  filterOption?: (option: SelectOption<T>, searchValue: string) => boolean;

  /**
   * Select size
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * Label for the select
   */
  label?: ReactNode;

  /**
   * Placeholder text when no selection
   */
  placeholder?: string;

  /**
   * Helper text displayed below the select
   */
  helperText?: string;

  /**
   * Error state
   * @default false
   */
  error?: boolean;

  /**
   * Success state
   * @default false
   */
  success?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Show loading indicator
   * @default false
   */
  loading?: boolean;

  /**
   * Show clear button when value is selected
   * @default false
   */
  clearable?: boolean;

  /**
   * Callback when clear button is clicked
   */
  onClear?: () => void;

  /**
   * Custom render function for options
   */
  renderOption?: (option: SelectOption<T>, isSelected: boolean) => ReactNode;

  /**
   * Custom render function for selected value display
   */
  renderValue?: (selected: SelectOption<T> | SelectOption<T>[]) => ReactNode;

  /**
   * Name attribute for form submission
   */
  name?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for screen readers (when no visible label)
   */
  'aria-label'?: string;

  /**
   * Maximum height for dropdown (in pixels)
   * @default 300
   */
  maxDropdownHeight?: number;

  /**
   * Text to show when no options match search
   * @default 'No options'
   */
  noOptionsMessage?: string;

  /**
   * Text to show when loading
   * @default 'Loading...'
   */
  loadingMessage?: string;

  /**
   * Callback when dropdown opens
   */
  onOpen?: () => void;

  /**
   * Callback when dropdown closes
   */
  onClose?: () => void;

  /**
   * Callback when search value changes
   */
  onSearchChange?: (searchValue: string) => void;

  /**
   * Use native select on mobile devices
   * @default true
   */
  useNativeOnMobile?: boolean;

  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;
}
