/**
 * CardList Component Type Definitions
 *
 * This module provides discriminated union types for CardList to ensure
 * type-safe usage in single vs multiple selection modes.
 *
 * @example
 * ```tsx
 * // Single mode - TypeScript knows onChange receives string | undefined
 * <CardList
 *   selectionMode="single"
 *   value={selected}
 *   onChange={(val) => setSelected(val)} // val: string | undefined
 * />
 *
 * // Multiple mode - TypeScript knows onChange receives string[]
 * <CardList
 *   selectionMode="multiple"
 *   value={selected}
 *   onChange={(vals) => setSelected(vals)} // vals: string[]
 * />
 * ```
 *
 * @module CardList/Types
 */

import type { CardListSelectionMode, CardListVisualState } from './CardList.fsm';
import type { CardColor, CardVariant } from '../Card/Card.types';
import type { ReactNode } from 'react';

// =============================================================================
// CardListItem - Option type for CardList items
// =============================================================================

/**
 * Configuration for a single item in the CardList
 */
export interface CardListItem {
  /** Unique value for this item */
  value: string;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Card description */
  description?: string;
  /** Media element (image, icon, etc.) */
  media?: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Custom children to render instead of title/description */
  children?: ReactNode;
  /** Whether this item is disabled */
  disabled?: boolean;
}

// =============================================================================
// CardListProps - Base and Mode-Specific Types
// =============================================================================

/**
 * Base props shared across all CardList modes
 */
interface CardListBaseProps {
  // ===========================================================================
  // Items
  // ===========================================================================

  /**
   * Array of card items to render
   */
  items: CardListItem[];

  /**
   * Name attribute for form submission (used for radio/checkbox inputs)
   */
  name?: string;

  // ===========================================================================
  // States
  // ===========================================================================

  /**
   * Whether all cards in the list are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the CardList is in an error state
   * @default false
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Whether selection is required
   * @default false
   */
  required?: boolean;

  // ===========================================================================
  // Visual
  // ===========================================================================

  /**
   * Card variant for all cards in the list
   * @default 'outlined'
   */
  variant?: CardVariant;

  /**
   * Card color when selected
   */
  selectedColor?: CardColor;

  /**
   * Whether to display cards horizontally
   * @default false
   */
  horizontal?: boolean;

  /**
   * Layout direction for the list
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Gap between cards (CSS value)
   * @default '0.5rem'
   */
  gap?: string;

  /**
   * Number of columns for grid layout (responsive)
   * If not set, cards flow naturally based on orientation
   */
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  /**
   * Visible label for the CardList (renders as legend in fieldset)
   */
  label?: string;

  /**
   * ARIA label for the CardList (if no visible label)
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this CardList
   */
  'aria-labelledby'?: string;

  /**
   * Helper text to display below the label
   */
  helperText?: string;

  // ===========================================================================
  // Styling
  // ===========================================================================

  /**
   * Additional CSS class for the CardList container
   */
  className?: string;

  /**
   * Additional inline styles for the CardList container
   */
  style?: React.CSSProperties;

  /**
   * Custom ID for the CardList
   */
  id?: string;
}

// =============================================================================
// Mode-Specific Props (Discriminated Union)
// =============================================================================

/**
 * Props for CardList in 'none' mode (display only, no selection)
 */
interface CardListNoneModeProps extends CardListBaseProps {
  /**
   * No selection mode - display only
   */
  selectionMode?: 'none';

  /**
   * Value not applicable in 'none' mode
   */
  value?: never;

  /**
   * Default value not applicable in 'none' mode
   */
  defaultValue?: never;

  /**
   * onChange not applicable in 'none' mode
   */
  onChange?: never;
}

/**
 * Props for CardList in 'single' mode (radio-like selection)
 */
interface CardListSingleModeProps extends CardListBaseProps {
  /**
   * Single selection mode - only one card can be selected
   */
  selectionMode: 'single';

  /**
   * Currently selected value (controlled mode)
   */
  value?: string;

  /**
   * Initial selected value (uncontrolled mode)
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   * @param value - The newly selected value, or undefined if deselected
   */
  onChange?: (value: string | undefined) => void;
}

/**
 * Props for CardList in 'multiple' mode (checkbox-like selection)
 */
interface CardListMultipleModeProps extends CardListBaseProps {
  /**
   * Multiple selection mode - multiple cards can be selected
   */
  selectionMode: 'multiple';

  /**
   * Currently selected values (controlled mode)
   */
  value?: string[];

  /**
   * Initial selected values (uncontrolled mode)
   */
  defaultValue?: string[];

  /**
   * Callback when selection changes
   * @param values - Array of all currently selected values
   */
  onChange?: (values: string[]) => void;
}

/**
 * Props for the CardList component
 *
 * This is a discriminated union type that provides type-safe props
 * based on the selectionMode:
 *
 * - `'none'`: No value/onChange props (display only)
 * - `'single'`: value is `string`, onChange receives `string | undefined`
 * - `'multiple'`: value is `string[]`, onChange receives `string[]`
 *
 * @example
 * ```tsx
 * // TypeScript will enforce correct types based on mode
 * <CardList
 *   selectionMode="single"
 *   value="basic"
 *   onChange={(val) => {
 *     // val is correctly typed as string | undefined
 *     console.log(val?.toUpperCase());
 *   }}
 * />
 * ```
 */
export type CardListProps =
  | CardListNoneModeProps
  | CardListSingleModeProps
  | CardListMultipleModeProps;

/**
 * Internal props type for the CardList component implementation.
 * This is more permissive than the public type to allow for easy
 * destructuring in the component implementation.
 *
 * @internal
 */
export interface CardListPropsInternal extends CardListBaseProps {
  selectionMode?: CardListSelectionMode;
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[] | undefined) => void;
}

// =============================================================================
// Internal Types
// =============================================================================

/**
 * Internal representation of CardList state (exposed for testing)
 */
export interface CardListState {
  /** Selected values */
  selectedValues: string[];
  /** Visual state */
  visualState: CardListVisualState;
}

// =============================================================================
// Re-exports
// =============================================================================

export type { CardListSelectionMode, CardListVisualState };
