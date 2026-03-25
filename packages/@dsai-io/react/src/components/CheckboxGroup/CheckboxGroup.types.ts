/**
 * CheckboxGroup Types
 *
 * Type definitions for the CheckboxGroup component.
 * CheckboxGroup is a high-level component that manages a group of Checkbox components
 * with tri-state (none/some/all) selection logic.
 *
 * @module CheckboxGroup/Types
 */

import type { CSSProperties, ReactNode } from 'react';

// =============================================================================
// Option Types
// =============================================================================

/**
 * Configuration for a single option in the checkbox group
 */
export interface CheckboxGroupOption {
  /**
   * Unique value for the option
   * Used to track selection state
   */
  value: string;

  /**
   * Label displayed next to the checkbox
   */
  label: ReactNode;

  /**
   * Whether this option is disabled
   * Disabled options cannot be selected and are excluded from "select all"
   * @default false
   */
  disabled?: boolean;

  /**
   * Helper text for this specific option
   */
  helperText?: ReactNode;
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the CheckboxGroup component
 */
export interface CheckboxGroupProps {
  /**
   * Label for the entire group
   * Rendered as a <legend> inside a <fieldset>
   * Required unless aria-label or aria-labelledby is provided
   */
  label?: ReactNode;

  /**
   * Helper text for the group
   * Displayed below the legend
   */
  helperText?: ReactNode;

  /**
   * Array of options to render as checkboxes
   */
  options: CheckboxGroupOption[];

  /**
   * Controlled selected values
   * Array of option values that are currently selected
   */
  value?: string[];

  /**
   * Default selected values (uncontrolled mode)
   * Array of option values to select initially
   */
  defaultValue?: string[];

  /**
   * Callback fired when selection changes
   * Receives the new array of selected values
   */
  onChange?: (values: string[]) => void;

  /**
   * Shared name attribute for all checkboxes in the group
   * Useful for form submission
   */
  name?: string;

  /**
   * Whether at least one option must be selected
   * @default false
   */
  required?: boolean;

  /**
   * Whether to show a "select all" checkbox at the top of the group
   * This checkbox uses indeterminate state when some options are selected
   * @default false
   */
  showSelectAll?: boolean;

  /**
   * Label for the "select all" checkbox
   * Only used when showSelectAll is true
   * @default "Select all"
   */
  selectAllLabel?: ReactNode;

  /**
   * Whether the group is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display when error is true
   */
  errorMessage?: ReactNode;

  /**
   * Whether all options are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class name for the fieldset
   */
  className?: string;

  /**
   * Inline styles for the fieldset
   */
  style?: CSSProperties;

  /**
   * ID attribute for the fieldset
   */
  id?: string;

  /**
   * Orientation of the checkboxes
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Accessible label for the group when label prop is not visible text
   * Use when label is an icon or other non-text content
   */
  'aria-label'?: string;

  /**
   * ID of an element that labels this group
   * Alternative to label prop for custom layouts
   */
  'aria-labelledby'?: string;

  /**
   * ID of an element that describes this group
   * Alternative to helperText for custom layouts
   */
  'aria-describedby'?: string;
}

// =============================================================================
// Re-export FSM Types for convenience
// =============================================================================

export type { CheckboxGroupFSMState, GroupSelectionState } from './CheckboxGroup.fsm';
