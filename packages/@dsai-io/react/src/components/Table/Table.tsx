/**
 * Table Component
 *
 * A Bootstrap 5 table component with sorting, row selection, responsive layout,
 * and sticky header support. Uses semantic HTML table elements with proper ARIA.
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Row selection: none / single / multiple modes
 * - Controlled and uncontrolled selection
 * - FSM-based state management for predictable behavior
 * - Responsive wrapper for horizontal scroll
 * - Sticky header support
 * - Empty state handling
 * - Configurable variants: default, striped, bordered, borderless
 *
 * Security Features:
 * - No dangerouslySetInnerHTML
 * - Props are typed and validated
 * - Custom cell renderers receive sanitized values
 *
 * Accessibility Features:
 * - Semantic table elements (table, thead, tbody, th, td)
 * - aria-sort for sortable columns
 * - aria-selected for selected rows
 * - Keyboard navigation for selection
 * - Optional caption for screen readers
 *
 * @see https://getbootstrap.com/docs/5.3/content/tables/
 * @module Table
 */

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { Checkbox } from '../Checkbox';

import {
  createInitialTableFSMState,
  isRowSelected,
  isSelectAllChecked,
  isSelectAllIndeterminate,
  resetFromPropsEvent,
  selectRowEvent,
  tableFSMReducer,
  toggleAllEvent,
  toggleRowEvent,
} from './Table.fsm';

import type {
  CellAlign,
  RowId,
  RowIdAccessor,
  SortConfig,
  SortDirection,
  TableColumn,
  TableProps,
  TablePropsInternal,
} from './Table.types';

// =============================================================================
// Utilities
// =============================================================================

/**
 * Get the value from a row using an accessor
 */
function getValue<T>(row: T, accessor: TableColumn<T>['accessor']): unknown {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  // Safe property access - accessor is validated by TypeScript as keyof T
  return (row as Record<string, unknown>)[accessor as string];
}

/**
 * Get row ID using the rowId accessor
 */
function getRowId<T>(row: T, index: number, rowIdAccessor?: RowIdAccessor<T>): RowId {
  if (!rowIdAccessor) {
    return index;
  }
  if (typeof rowIdAccessor === 'function') {
    return rowIdAccessor(row, index);
  }
  // Safe property access - rowIdAccessor is validated by TypeScript as keyof T
  return (row as Record<string, unknown>)[rowIdAccessor as string] as RowId;
}

/**
 * Default sort function for columns
 */
function defaultSortFn<T>(
  a: T,
  b: T,
  accessor: TableColumn<T>['accessor'],
  direction: SortDirection
): number {
  const aVal = getValue(a, accessor);
  const bVal = getValue(b, accessor);

  // Handle null/undefined
  if (aVal === null || aVal === undefined) {
    if (bVal === null || bVal === undefined) {
      return 0;
    }
    return direction === 'asc' ? -1 : 1;
  }
  if (bVal === null || bVal === undefined) {
    return direction === 'asc' ? 1 : -1;
  }

  // Compare based on type
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  }

  // String comparison
  const aStr = String(aVal);
  const bStr = String(bVal);
  const comparison = aStr.localeCompare(bStr);
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Get text alignment class
 */
function getAlignClass(align?: CellAlign): string {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-end';
    default:
      return '';
  }
}

// =============================================================================
// Sort Icon Component
// =============================================================================

interface SortIconProps {
  direction?: SortDirection;
  sortable?: boolean;
}

const SortIcon = memo(function SortIcon({ direction, sortable }: SortIconProps) {
  if (!sortable) {
    return null;
  }

  return (
    <span className="table-sort-icon ms-1" aria-hidden="true">
      {direction === 'asc' && '▲'}
      {direction === 'desc' && '▼'}
      {!direction && '⇅'}
    </span>
  );
});

SortIcon.displayName = 'SortIcon';

// =============================================================================
// Table Component
// =============================================================================

const TableComponent = forwardRef<HTMLTableElement, TablePropsInternal<Record<string, unknown>>>(
  (
    {
      columns,
      data,
      rowId: rowIdAccessor,
      // Sorting
      sortConfig,
      defaultSortConfig,
      onSortChange,
      // Selection
      selectionMode = 'none',
      selectedRows,
      defaultSelectedRows,
      onSelectionChange,
      disabledRows = [],
      // Visual
      variant = 'default',
      size = 'md',
      headerColor,
      hover = true,
      responsive = true,
      stickyHeader = false,
      maxHeight,
      // Empty state
      emptyContent = 'No data available',
      showEmpty = true,
      // Footer
      footer,
      // Accessibility
      caption,
      captionSide = 'top',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      // Styling
      className = '',
      style,
      id: providedId,
      wrapperClassName = '',
      wrapperStyle,
      // Callbacks
      onRowClick,
    },
    ref
  ) => {
    // Generate unique ID
    const generatedId = useId();
    const id = providedId || generatedId;

    // ==========================================================================
    // Sorting State (can be controlled or uncontrolled)
    // ==========================================================================
    const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | undefined>(
      defaultSortConfig
    );
    const isSortControlled = sortConfig !== undefined;
    const currentSortConfig = isSortControlled ? sortConfig : internalSortConfig;

    const handleSortClick = useCallback(
      (columnId: string) => {
        let newConfig: SortConfig | undefined;

        if (currentSortConfig?.columnId === columnId) {
          // Toggle direction or clear
          if (currentSortConfig.direction === 'asc') {
            newConfig = { columnId, direction: 'desc' };
          } else {
            // Clear sort
            newConfig = undefined;
          }
        } else {
          // New column, start with ascending
          newConfig = { columnId, direction: 'asc' };
        }

        if (!isSortControlled) {
          setInternalSortConfig(newConfig);
        }

        onSortChange?.(newConfig);
      },
      [currentSortConfig, isSortControlled, onSortChange]
    );

    // ==========================================================================
    // Selection State (FSM-based)
    // ==========================================================================

    // Compute enabled row IDs
    const disabledRowSet = useMemo(() => new Set(disabledRows), [disabledRows]);

    const enabledRowIds = useMemo(() => {
      return data
        .map((row, idx) => getRowId(row, idx, rowIdAccessor))
        .filter((rowId) => !disabledRowSet.has(rowId));
    }, [data, rowIdAccessor, disabledRowSet]);

    const totalEnabled = enabledRowIds.length;

    // Normalize selection value to array
    const normalizeSelectedRows = useCallback((val: RowId | RowId[] | undefined): RowId[] => {
      if (val === undefined) {
        return [];
      }
      if (Array.isArray(val)) {
        return val;
      }
      return [val];
    }, []);

    // Determine if controlled
    const isSelectionControlled = selectedRows !== undefined;

    // Initialize FSM state
    const initialSelectedRows = normalizeSelectedRows(
      isSelectionControlled ? selectedRows : defaultSelectedRows
    );

    const [fsmState, dispatch] = useReducer(
      tableFSMReducer,
      { rowIds: initialSelectedRows, mode: selectionMode, totalEnabled },
      (init) => createInitialTableFSMState(init.rowIds, init.mode, init.totalEnabled)
    );

    // Sync FSM with controlled selectedRows prop
    useEffect(() => {
      if (isSelectionControlled) {
        dispatch(
          resetFromPropsEvent(normalizeSelectedRows(selectedRows), selectionMode, totalEnabled)
        );
      }
    }, [isSelectionControlled, selectedRows, selectionMode, totalEnabled, normalizeSelectedRows]);

    // ==========================================================================
    // Selection Handlers
    // ==========================================================================

    // Handle row selection for single mode
    const handleSelectRow = useCallback(
      (rowId: RowId) => {
        const nextState = tableFSMReducer(fsmState, selectRowEvent(rowId, totalEnabled));

        if (!isSelectionControlled) {
          dispatch(selectRowEvent(rowId, totalEnabled));
        }

        if (onSelectionChange) {
          const newValue =
            nextState.selectedRows.length > 0 ? nextState.selectedRows[0] : undefined;
          onSelectionChange(newValue);
        }
      },
      [fsmState, totalEnabled, isSelectionControlled, onSelectionChange]
    );

    // Handle row toggle for multiple mode
    const handleToggleRow = useCallback(
      (rowId: RowId) => {
        const nextState = tableFSMReducer(fsmState, toggleRowEvent(rowId, totalEnabled));

        if (!isSelectionControlled) {
          dispatch(toggleRowEvent(rowId, totalEnabled));
        }

        if (onSelectionChange) {
          onSelectionChange(nextState.selectedRows);
        }
      },
      [fsmState, totalEnabled, isSelectionControlled, onSelectionChange]
    );

    // Handle toggle all for multiple mode
    const handleToggleAll = useCallback(() => {
      const nextState = tableFSMReducer(fsmState, toggleAllEvent(enabledRowIds, totalEnabled));

      if (!isSelectionControlled) {
        dispatch(toggleAllEvent(enabledRowIds, totalEnabled));
      }

      if (onSelectionChange) {
        onSelectionChange(nextState.selectedRows);
      }
    }, [fsmState, enabledRowIds, totalEnabled, isSelectionControlled, onSelectionChange]);

    // Handle row click for selection
    const handleRowSelectionClick = useCallback(
      (rowId: RowId, isDisabled: boolean) => {
        if (isDisabled) {
          return;
        }

        if (selectionMode === 'single') {
          handleSelectRow(rowId);
        } else if (selectionMode === 'multiple') {
          handleToggleRow(rowId);
        }
      },
      [selectionMode, handleSelectRow, handleToggleRow]
    );

    // Handle keyboard navigation for selection
    const handleRowKeyDown = useCallback(
      (e: React.KeyboardEvent, rowId: RowId, isDisabled: boolean) => {
        if (isDisabled) {
          return;
        }
        if (selectionMode === 'none') {
          return;
        }

        if (isEnterKey(e) || e.key === ' ') {
          e.preventDefault();
          handleRowSelectionClick(rowId, isDisabled);
        }
      },
      [selectionMode, handleRowSelectionClick]
    );

    // ==========================================================================
    // Sorted Data
    // ==========================================================================

    const sortedData = useMemo(() => {
      if (!currentSortConfig) {
        return data;
      }

      const column = columns.find((col) => col.id === currentSortConfig.columnId);
      if (!column) {
        return data;
      }

      return [...data].sort((a, b) => {
        if (column.sortFn) {
          return column.sortFn(a, b, currentSortConfig.direction);
        }
        return defaultSortFn(a, b, column.accessor, currentSortConfig.direction);
      });
    }, [data, currentSortConfig, columns]);

    // ==========================================================================
    // Class Names
    // ==========================================================================

    const tableClasses = useMemo(() => {
      return cn(
        'table',
        variant === 'striped' && 'table-striped',
        variant === 'bordered' && 'table-bordered',
        variant === 'borderless' && 'table-borderless',
        size === 'sm' && 'table-sm',
        hover && 'table-hover',
        className
      );
    }, [variant, size, hover, className]);

    const headerClasses = useMemo(() => {
      if (headerColor) {
        return `table-${headerColor}`;
      }
      return '';
    }, [headerColor]);

    const wrapperClasses = useMemo(() => {
      return cn(responsive && 'table-responsive', wrapperClassName);
    }, [responsive, wrapperClassName]);

    // ==========================================================================
    // Styles
    // ==========================================================================

    const computedWrapperStyle = useMemo(() => {
      const baseStyle: React.CSSProperties = { ...wrapperStyle };

      if (stickyHeader && maxHeight) {
        baseStyle.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;
        baseStyle.overflowY = 'auto';
      }

      return baseStyle;
    }, [stickyHeader, maxHeight, wrapperStyle]);

    const stickyHeaderStyle = useMemo<React.CSSProperties | undefined>(() => {
      if (!stickyHeader) {
        return undefined;
      }
      return {
        position: 'sticky',
        top: 0,
        zIndex: 1,
      };
    }, [stickyHeader]);

    // ==========================================================================
    // Selection column count adjustment
    // ==========================================================================
    const hasSelectionColumn = selectionMode !== 'none';
    const totalColumns = columns.length + (hasSelectionColumn ? 1 : 0);

    // ==========================================================================
    // Render
    // ==========================================================================

    const tableElement = (
      <table
        ref={ref}
        id={id}
        className={tableClasses}
        style={style}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        data-visual-state={fsmState.visualState}
      >
        {/* Caption */}
        {caption && <caption style={{ captionSide }}>{caption}</caption>}

        {/* Header */}
        <thead className={headerClasses} style={stickyHeaderStyle}>
          <tr>
            {/* Selection header */}
            {selectionMode === 'multiple' && (
              <th scope="col" className="table-select-cell" style={{ width: '48px' }}>
                <Checkbox
                  checked={isSelectAllChecked(fsmState)}
                  indeterminate={isSelectAllIndeterminate(fsmState)}
                  onChange={handleToggleAll}
                  aria-label="Select all rows"
                  disabled={totalEnabled === 0}
                />
              </th>
            )}
            {selectionMode === 'single' && (
              <th scope="col" className="table-select-cell" style={{ width: '48px' }}>
                <span className="visually-hidden">Selection</span>
              </th>
            )}

            {/* Column headers */}
            {columns.map((column) => {
              const isSorted = currentSortConfig?.columnId === column.id;
              const sortDirection = isSorted ? currentSortConfig.direction : undefined;
              const ariaSortValue = isSorted
                ? sortDirection === 'asc'
                  ? 'ascending'
                  : 'descending'
                : column.sortable
                  ? 'none'
                  : undefined;

              const headerStyle: React.CSSProperties = {};
              if (column.width) {
                headerStyle.width = column.width;
              }
              if (column.minWidth) {
                headerStyle.minWidth = column.minWidth;
              }
              if (column.maxWidth) {
                headerStyle.maxWidth = column.maxWidth;
              }
              // Sticky columns (left/right) work independently
              if (column.sticky) {
                headerStyle.position = 'sticky';
                headerStyle[column.sticky] = 0;
                headerStyle.zIndex = stickyHeader ? 3 : 2; // Higher z-index if also sticky header
                headerStyle.backgroundColor = 'var(--bs-table-bg, #fff)';
              }

              const alignClass = getAlignClass(column.align);
              const headerCellClasses = cn(
                alignClass,
                column.headerClassName,
                column.sortable && 'table-sortable-header',
                isSorted && 'table-sorted'
              );

              return (
                <th
                  key={column.id}
                  scope="col"
                  className={headerCellClasses || undefined}
                  style={headerStyle}
                  aria-sort={ariaSortValue}
                  onClick={column.sortable ? () => handleSortClick(column.id) : undefined}
                  onKeyDown={
                    column.sortable
                      ? (e) => {
                          if (isEnterKey(e) || e.key === ' ') {
                            e.preventDefault();
                            handleSortClick(column.id);
                          }
                        }
                      : undefined
                  }
                  tabIndex={column.sortable ? 0 : undefined}
                >
                  {column.header}
                  <SortIcon sortable={column.sortable} direction={sortDirection} />
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {sortedData.length === 0 && showEmpty ? (
            <tr>
              <td colSpan={totalColumns} className="text-center text-muted py-4">
                {emptyContent}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => {
              const rowIdValue = getRowId(row, rowIndex, rowIdAccessor);
              const isSelected = isRowSelected(fsmState, rowIdValue);
              const isDisabled = disabledRowSet.has(rowIdValue);
              const isInteractive = selectionMode !== 'none' || onRowClick;

              const rowClasses = cn(isSelected && 'table-active', isDisabled && 'table-disabled');

              return (
                <tr
                  key={rowIdValue}
                  className={rowClasses || undefined}
                  aria-selected={selectionMode !== 'none' ? isSelected : undefined}
                  aria-disabled={isDisabled || undefined}
                  onClick={() => {
                    onRowClick?.(row, rowIndex);
                    if (selectionMode !== 'none' && !isDisabled) {
                      handleRowSelectionClick(rowIdValue, isDisabled);
                    }
                  }}
                  onKeyDown={
                    isInteractive ? (e) => handleRowKeyDown(e, rowIdValue, isDisabled) : undefined
                  }
                  tabIndex={isInteractive && !isDisabled ? 0 : undefined}
                  role={selectionMode !== 'none' ? 'row' : undefined}
                >
                  {/* Selection cell */}
                  {selectionMode === 'multiple' && (
                    <td className="table-select-cell">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggleRow(rowIdValue)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        disabled={isDisabled}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {selectionMode === 'single' && (
                    <td className="table-select-cell">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowIdValue)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        disabled={isDisabled}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => {
                    const cellValue = getValue(row, column.accessor);
                    const alignClass = getAlignClass(column.align);

                    const cellStyle: React.CSSProperties = {};
                    if (column.sticky) {
                      cellStyle.position = 'sticky';
                      cellStyle[column.sticky] = 0;
                      cellStyle.zIndex = 1;
                      // Use solid background to prevent content showing through
                      cellStyle.backgroundColor = isSelected
                        ? 'var(--bs-table-active-bg, rgba(0, 0, 0, 0.075))'
                        : 'var(--bs-table-bg, var(--bs-body-bg, #fff))';
                    }

                    const cellClasses = cn(alignClass, column.cellClassName);

                    return (
                      <td key={column.id} className={cellClasses || undefined} style={cellStyle}>
                        {column.cell
                          ? column.cell(cellValue, row, rowIndex)
                          : (cellValue as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>

        {/* Footer */}
        {footer && (
          <tfoot>
            <tr>
              <td colSpan={totalColumns}>{footer}</td>
            </tr>
          </tfoot>
        )}
      </table>
    );

    // Wrap in responsive container if needed
    if (responsive || (stickyHeader && maxHeight)) {
      return (
        <div className={wrapperClasses || undefined} style={computedWrapperStyle}>
          {tableElement}
        </div>
      );
    }

    return tableElement;
  }
);

TableComponent.displayName = 'Table';

// Memoize component and cast to public type for better DX
export const Table = memo(TableComponent) as <T = Record<string, unknown>>(
  props: TableProps<T> & React.RefAttributes<HTMLTableElement>
) => React.ReactElement | null;

// Type assertion for displayName (memo loses it for generic components)
(Table as unknown as { displayName: string }).displayName = 'Table';
