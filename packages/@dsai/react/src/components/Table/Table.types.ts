/**
 * Table Component Type Definitions
 *
 * This module provides comprehensive types for the Table component,
 * supporting sorting, row selection, responsive layouts, and accessibility.
 *
 * @example
 * ```tsx
 * // Basic usage
 * const columns: TableColumn<User>[] = [
 *   { id: 'name', header: 'Name', accessor: 'name' },
 *   { id: 'email', header: 'Email', accessor: 'email' },
 * ];
 * <Table columns={columns} data={users} />
 *
 * // With selection
 * <Table
 *   columns={columns}
 *   data={users}
 *   selectionMode="multiple"
 *   selectedRows={selectedIds}
 *   onSelectionChange={setSelectedIds}
 * />
 * ```
 *
 * @module Table/Types
 */

import type { ComponentSize, SemanticColorVariant } from '../../types';
import type { CSSProperties, ReactNode } from 'react';

// =============================================================================
// Sorting Types
// =============================================================================

/**
 * Sort direction for columns
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort configuration for a column
 */
export interface SortConfig {
  /** Column ID being sorted */
  columnId: string;
  /** Sort direction */
  direction: SortDirection;
}

// =============================================================================
// Selection Types
// =============================================================================

/**
 * Selection mode for rows
 */
export type TableSelectionMode = 'none' | 'single' | 'multiple';

/**
 * Visual state for the Table based on selection
 */
export type TableVisualState = 'none' | 'one' | 'some' | 'all';

// =============================================================================
// Column Types
// =============================================================================

/**
 * Text alignment for cells
 */
export type CellAlign = 'left' | 'center' | 'right';

/**
 * Column definition for the Table
 *
 * @typeParam T - The type of row data
 */
export interface TableColumn<T = Record<string, unknown>> {
  /**
   * Unique identifier for this column
   */
  id: string;

  /**
   * Header content (string or ReactNode)
   */
  header: ReactNode;

  /**
   * Key to access data from row object, or a function that returns the value
   * - string: Key path to access (e.g., 'user.name')
   * - function: Custom accessor function
   */
  accessor: keyof T | ((row: T) => unknown);

  /**
   * Custom cell renderer
   * @param value - The cell value from accessor
   * @param row - The full row data
   * @param rowIndex - The row index in the data array
   */
  cell?: (value: unknown, row: T, rowIndex: number) => ReactNode;

  /**
   * Whether this column is sortable
   * @default false
   */
  sortable?: boolean;

  /**
   * Custom sort function for this column
   * @param a - First row
   * @param b - Second row
   * @param direction - Sort direction
   * @returns Negative, zero, or positive number
   */
  sortFn?: (a: T, b: T, direction: SortDirection) => number;

  /**
   * Column width (CSS value)
   */
  width?: string | number;

  /**
   * Minimum column width (CSS value)
   */
  minWidth?: string | number;

  /**
   * Maximum column width (CSS value)
   */
  maxWidth?: string | number;

  /**
   * Text alignment for cells in this column
   * @default 'left'
   */
  align?: CellAlign;

  /**
   * Whether to hide this column on smaller screens
   * @default false
   */
  hideOnMobile?: boolean;

  /**
   * Additional CSS class for header cell
   */
  headerClassName?: string;

  /**
   * Additional CSS class for body cells
   */
  cellClassName?: string;

  /**
   * Make column sticky (left or right)
   */
  sticky?: 'left' | 'right';
}

// =============================================================================
// Row Types
// =============================================================================

/**
 * Row identifier type - must be string or number
 */
export type RowId = string | number;

/**
 * Row identifier accessor
 *
 * @typeParam T - The type of row data
 */
export type RowIdAccessor<T> = keyof T | ((row: T, index: number) => RowId);

// =============================================================================
// Table Variant Types
// =============================================================================

/**
 * Table visual variant
 */
export type TableVariant = 'default' | 'striped' | 'bordered' | 'borderless';

/**
 * Table size
 * @see ComponentSize
 */
export type TableSize = ComponentSize;

/**
 * Table color scheme (for header or accents)
 * @see SemanticColorVariant
 */
export type TableColor = SemanticColorVariant;

// =============================================================================
// Table Props - Base
// =============================================================================

/**
 * Base props shared across all Table configurations
 *
 * @typeParam T - The type of row data
 */
interface TableBaseProps<T = Record<string, unknown>> {
  // ===========================================================================
  // Data
  // ===========================================================================

  /**
   * Column definitions
   */
  columns: TableColumn<T>[];

  /**
   * Array of row data
   */
  data: T[];

  /**
   * Function or key to get unique ID for each row
   * Used for selection tracking and React keys
   * @default Uses array index (not recommended for dynamic data)
   */
  rowId?: RowIdAccessor<T>;

  // ===========================================================================
  // Sorting
  // ===========================================================================

  /**
   * Current sort configuration (controlled mode)
   */
  sortConfig?: SortConfig;

  /**
   * Default sort configuration (uncontrolled mode)
   */
  defaultSortConfig?: SortConfig;

  /**
   * Callback when sort changes
   */
  onSortChange?: (config: SortConfig | undefined) => void;

  // ===========================================================================
  // Visual
  // ===========================================================================

  /**
   * Table variant
   * @default 'default'
   */
  variant?: TableVariant;

  /**
   * Table size
   * @default 'md'
   */
  size?: TableSize;

  /**
   * Table color for header
   */
  headerColor?: TableColor;

  /**
   * Add hover effect on rows
   * @default true
   */
  hover?: boolean;

  /**
   * Make table responsive (horizontal scroll on small screens)
   * @default true
   */
  responsive?: boolean;

  /**
   * Make header sticky
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Height for sticky header container
   */
  maxHeight?: string | number;

  // ===========================================================================
  // Empty State
  // ===========================================================================

  /**
   * Content to show when data array is empty
   * @default 'No data available'
   */
  emptyContent?: ReactNode;

  /**
   * Whether to show empty content
   * @default true
   */
  showEmpty?: boolean;

  // ===========================================================================
  // Footer
  // ===========================================================================

  /**
   * Table footer content
   */
  footer?: ReactNode;

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  /**
   * Accessible caption for the table
   */
  caption?: ReactNode;

  /**
   * Caption position
   * @default 'top'
   */
  captionSide?: 'top' | 'bottom';

  /**
   * ARIA label for the table
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this table
   */
  'aria-labelledby'?: string;

  /**
   * ID of element that describes this table
   */
  'aria-describedby'?: string;

  // ===========================================================================
  // Styling
  // ===========================================================================

  /**
   * Additional CSS class for the table
   */
  className?: string;

  /**
   * Additional inline styles for the table
   */
  style?: CSSProperties;

  /**
   * Custom ID for the table
   */
  id?: string;

  /**
   * Additional CSS class for the responsive wrapper
   */
  wrapperClassName?: string;

  /**
   * Additional inline styles for the responsive wrapper
   */
  wrapperStyle?: CSSProperties;

  // ===========================================================================
  // Callbacks
  // ===========================================================================

  /**
   * Callback when a row is clicked
   * @param row - The row data
   * @param rowIndex - The row index
   */
  onRowClick?: (row: T, rowIndex: number) => void;
}

// =============================================================================
// Selection Mode Props (Discriminated Union)
// =============================================================================

/**
 * Props for Table with no selection
 */
interface TableNoSelectionProps<T> extends TableBaseProps<T> {
  /**
   * No selection mode
   */
  selectionMode?: 'none';

  /**
   * Not applicable in 'none' mode
   */
  selectedRows?: never;

  /**
   * Not applicable in 'none' mode
   */
  defaultSelectedRows?: never;

  /**
   * Not applicable in 'none' mode
   */
  onSelectionChange?: never;

  /**
   * Not applicable in 'none' mode
   */
  disabledRows?: never;
}

/**
 * Props for Table with single selection
 */
interface TableSingleSelectionProps<T> extends TableBaseProps<T> {
  /**
   * Single row selection mode (radio-like)
   */
  selectionMode: 'single';

  /**
   * Currently selected row ID (controlled mode)
   */
  selectedRows?: RowId;

  /**
   * Default selected row ID (uncontrolled mode)
   */
  defaultSelectedRows?: RowId;

  /**
   * Callback when selection changes
   * @param selectedId - The selected row ID, or undefined if deselected
   */
  onSelectionChange?: (selectedId: RowId | undefined) => void;

  /**
   * Row IDs that cannot be selected
   */
  disabledRows?: RowId[];
}

/**
 * Props for Table with multiple selection
 */
interface TableMultipleSelectionProps<T> extends TableBaseProps<T> {
  /**
   * Multiple row selection mode (checkbox-like)
   */
  selectionMode: 'multiple';

  /**
   * Currently selected row IDs (controlled mode)
   */
  selectedRows?: RowId[];

  /**
   * Default selected row IDs (uncontrolled mode)
   */
  defaultSelectedRows?: RowId[];

  /**
   * Callback when selection changes
   * @param selectedIds - Array of all currently selected row IDs
   */
  onSelectionChange?: (selectedIds: RowId[]) => void;

  /**
   * Row IDs that cannot be selected
   */
  disabledRows?: RowId[];
}

/**
 * Props for the Table component
 *
 * This is a discriminated union type that provides type-safe props
 * based on the selectionMode:
 *
 * - `'none'`: No selection-related props (default)
 * - `'single'`: selectedRows is `RowId`, onSelectionChange receives `RowId | undefined`
 * - `'multiple'`: selectedRows is `RowId[]`, onSelectionChange receives `RowId[]`
 *
 * @typeParam T - The type of row data
 *
 * @example
 * ```tsx
 * // No selection (default)
 * <Table columns={columns} data={data} />
 *
 * // Single selection
 * <Table
 *   columns={columns}
 *   data={data}
 *   selectionMode="single"
 *   selectedRows={selectedId}
 *   onSelectionChange={setSelectedId}
 * />
 *
 * // Multiple selection
 * <Table
 *   columns={columns}
 *   data={data}
 *   selectionMode="multiple"
 *   selectedRows={selectedIds}
 *   onSelectionChange={setSelectedIds}
 * />
 * ```
 */
export type TableProps<T = Record<string, unknown>> =
  | TableNoSelectionProps<T>
  | TableSingleSelectionProps<T>
  | TableMultipleSelectionProps<T>;

/**
 * Internal props type for the Table component implementation.
 * This is more permissive than the public type to allow for easy
 * destructuring in the component implementation.
 *
 * @internal
 */
export interface TablePropsInternal<T = Record<string, unknown>> extends TableBaseProps<T> {
  selectionMode?: TableSelectionMode;
  selectedRows?: RowId | RowId[];
  defaultSelectedRows?: RowId | RowId[];
  onSelectionChange?: (selectedRows: RowId | RowId[] | undefined) => void;
  disabledRows?: RowId[];
}

// =============================================================================
// Component Sub-parts Types
// =============================================================================

/**
 * Props for TableHeader component
 */
export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Props for TableBody component
 */
export interface TableBodyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Props for TableFooter component
 */
export interface TableFooterProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Props for TableRow component
 */
export interface TableRowProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Whether the row is selected
   */
  selected?: boolean;
  /**
   * Whether the row is disabled
   */
  disabled?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Props for TableCell component (td)
 */
export interface TableCellProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Text alignment
   * @default 'left'
   */
  align?: CellAlign;
  /**
   * Column span
   */
  colSpan?: number;
  /**
   * Row span
   */
  rowSpan?: number;
}

/**
 * Props for TableHeaderCell component (th)
 */
export interface TableHeaderCellProps extends TableCellProps {
  /**
   * Scope of the header cell
   * @default 'col'
   */
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
  /**
   * Whether this column is sortable
   */
  sortable?: boolean;
  /**
   * Current sort direction (if sorted)
   */
  sortDirection?: SortDirection;
  /**
   * Click handler for sorting
   */
  onSort?: () => void;
}

// =============================================================================
// FSM State Types (for selection management)
// =============================================================================

/**
 * Internal FSM state for Table selection
 */
export interface TableFSMState {
  /** Currently selected row IDs */
  selectedRows: RowId[];
  /** Derived visual state based on selection count */
  visualState: TableVisualState;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Extract row data type from columns
 */
export type InferRowType<C> = C extends TableColumn<infer T>[] ? T : never;
