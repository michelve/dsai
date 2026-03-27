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
 * - Built-in pagination with server-side support
 * - Column resizing with drag handles
 * - Expandable rows with custom content
 * - Column visibility control
 * - Shift+Click batch selection
 *
 * Security Features:
 * - Props are typed and validated
 * - Custom cell renderers receive sanitized values
 * - No unsafe HTML injection
 *
 * Accessibility Features:
 * - Semantic table elements (table, thead, tbody, th, td)
 * - aria-sort for sortable columns
 * - aria-selected for selected rows
 * - Keyboard navigation for selection
 * - Optional caption for screen readers
 * - aria-expanded for expandable rows
 * - Pagination navigation with aria-labels
 *
 * @see https://getbootstrap.com/docs/5.3/content/tables/
 * @module Table
 */

import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';
import { Checkbox } from '../Checkbox';

import {
  createInitialTableFSMState,
  isRowSelected,
  isSelectAllChecked,
  isSelectAllIndeterminate,
  resetFromPropsEvent,
  selectRangeEvent,
  selectRowEvent,
  tableFSMReducer,
  toggleAllEvent,
  toggleRowEvent,
} from './Table.fsm';

import type {
  CellAlign,
  PaginationState,
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

/**
 * Generate an array of page numbers to display in pagination.
 * Shows at most `maxVisible` page buttons around the current page.
 */
function getVisiblePages(currentPage: number, totalPages: number, maxVisible = 5): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(0, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible);

  // Adjust start if near the end
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
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
      {direction === 'asc' && '\u25B2'}
      {direction === 'desc' && '\u25BC'}
      {!direction && '\u21C5'}
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
      manualSorting = false,
      // Pagination
      pagination,
      defaultPagination,
      onPaginationChange,
      manualPagination = false,
      totalRows,
      pageSizeOptions,
      paginationPosition = 'bottom',
      // Filtering (future-proofing)
      manualFiltering: _manualFiltering,
      // Expandable
      expandable,
      expandedRows,
      defaultExpandedRows,
      onExpandedRowsChange,
      // Column Visibility
      columnVisibility,
      defaultColumnVisibility,
      onColumnVisibilityChange,
      // Column Resizing
      onColumnResize,
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
    // Column Visibility State
    // ==========================================================================
    const [visibilityState] = useControllableState<Record<string, boolean>>({
      value: columnVisibility,
      defaultValue: defaultColumnVisibility ?? {},
      onChange: onColumnVisibilityChange,
    });

    // Filter columns based on visibility
    const visibleColumns = useMemo(() => {
      return columns.filter((col) => {
        const key = col.id;
        return Reflect.get(visibilityState, key) !== false;
      });
    }, [columns, visibilityState]);

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
    // Pagination State
    // ==========================================================================
    const [paginationState, setPaginationState] = useControllableState<
      PaginationState | undefined
    >({
      value: pagination,
      defaultValue: defaultPagination,
      onChange: onPaginationChange,
    });

    // ==========================================================================
    // Expansion State
    // ==========================================================================
    const [expandedRowIds, setExpandedRowIds] = useControllableState<RowId[]>({
      value: expandedRows,
      defaultValue: defaultExpandedRows ?? [],
      onChange: onExpandedRowsChange,
    });

    const expandedRowSet = useMemo(() => new Set(expandedRowIds), [expandedRowIds]);

    const handleToggleExpand = useCallback(
      (rowId: RowId) => {
        setExpandedRowIds((prev: RowId[]) => {
          if (prev.includes(rowId)) {
            return prev.filter((rid) => rid !== rowId);
          }
          return [...prev, rowId];
        });
      },
      [setExpandedRowIds]
    );

    const handleToggleExpandAll = useCallback(() => {
      const allRowIds = data.map((row, idx) => getRowId(row, idx, rowIdAccessor));
      const allExpanded = allRowIds.every((rid) => expandedRowSet.has(rid));

      if (allExpanded) {
        setExpandedRowIds([]);
      } else {
        setExpandedRowIds(allRowIds);
      }
    }, [data, rowIdAccessor, expandedRowSet, setExpandedRowIds]);

    // ==========================================================================
    // Column Resizing State
    // ==========================================================================
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const resizingRef = useRef<{
      columnId: string;
      startX: number;
      startWidth: number;
    } | null>(null);

    const handleResizeStart = useCallback(
      (e: React.PointerEvent, columnId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        // Get current width from state or measure the header cell
        const th = target.parentElement;
        const currentWidth = (Reflect.get(columnWidths, columnId) as number | undefined)
          ?? (th ? th.getBoundingClientRect().width : 100);

        resizingRef.current = {
          columnId,
          startX: e.clientX,
          startWidth: currentWidth,
        };

        const handlePointerMove = (moveEvent: PointerEvent): void => {
          if (!resizingRef.current) return;

          const delta = moveEvent.clientX - resizingRef.current.startX;
          let newWidth = resizingRef.current.startWidth + delta;

          // Find column constraints
          const col = columns.find((c) => c.id === columnId);
          if (col) {
            const minW = typeof col.minWidth === 'number' ? col.minWidth : 50;
            const maxW = typeof col.maxWidth === 'number' ? col.maxWidth : Infinity;
            newWidth = Math.max(minW, Math.min(maxW, newWidth));
          }

          setColumnWidths((prev) => ({
            ...prev,
            [columnId]: newWidth,
          }));
        };

        const handlePointerUp = (): void => {
          if (resizingRef.current) {
            const cid = resizingRef.current.columnId;
            // Read the latest width from state via closure
            setColumnWidths((prev) => {
              const finalWidth = Reflect.get(prev, cid) as number | undefined;
              if (finalWidth !== undefined) {
                onColumnResize?.(cid, finalWidth);
              }
              return prev;
            });
          }
          resizingRef.current = null;
          target.removeEventListener('pointermove', handlePointerMove);
          target.removeEventListener('pointerup', handlePointerUp);
        };

        target.addEventListener('pointermove', handlePointerMove);
        target.addEventListener('pointerup', handlePointerUp);
      },
      [columns, columnWidths, onColumnResize]
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
    // Shift+Click Batch Selection
    // ==========================================================================
    const lastClickedRowIdRef = useRef<RowId | null>(null);

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

    // Handle Shift+Click range selection for multiple mode
    const handleRangeSelect = useCallback(
      (rowId: RowId, allRowIds: RowId[]) => {
        if (lastClickedRowIdRef.current === null) {
          // No previous click, fall back to toggle
          handleToggleRow(rowId);
          return;
        }

        const lastIdx = allRowIds.indexOf(lastClickedRowIdRef.current);
        const currentIdx = allRowIds.indexOf(rowId);

        if (lastIdx === -1 || currentIdx === -1) {
          handleToggleRow(rowId);
          return;
        }

        const start = Math.min(lastIdx, currentIdx);
        const end = Math.max(lastIdx, currentIdx);
        const rangeIds = allRowIds
          .slice(start, end + 1)
          .filter((rid) => !disabledRowSet.has(rid));

        const event = selectRangeEvent(rangeIds, totalEnabled);
        const nextState = tableFSMReducer(fsmState, event);

        if (!isSelectionControlled) {
          dispatch(event);
        }

        if (onSelectionChange) {
          onSelectionChange(nextState.selectedRows);
        }
      },
      [
        fsmState,
        totalEnabled,
        disabledRowSet,
        isSelectionControlled,
        onSelectionChange,
        handleToggleRow,
      ]
    );

    // Handle row click for selection
    const handleRowSelectionClick = useCallback(
      (rowId: RowId, isDisabled: boolean, shiftKey: boolean, allRowIds: RowId[]) => {
        if (isDisabled) {
          return;
        }

        if (selectionMode === 'single') {
          handleSelectRow(rowId);
        } else if (selectionMode === 'multiple') {
          if (shiftKey && lastClickedRowIdRef.current !== null) {
            handleRangeSelect(rowId, allRowIds);
          } else {
            handleToggleRow(rowId);
          }
        }

        lastClickedRowIdRef.current = rowId;
      },
      [selectionMode, handleSelectRow, handleToggleRow, handleRangeSelect]
    );

    // Handle keyboard navigation for selection
    const handleRowKeyDown = useCallback(
      (e: React.KeyboardEvent, rowId: RowId, isDisabled: boolean, allRowIds: RowId[]) => {
        if (isDisabled) {
          return;
        }
        if (selectionMode === 'none') {
          return;
        }

        if (isEnterKey(e) || e.key === ' ') {
          e.preventDefault();
          handleRowSelectionClick(rowId, isDisabled, e.shiftKey, allRowIds);
        }
      },
      [selectionMode, handleRowSelectionClick]
    );

    // ==========================================================================
    // Sorted Data
    // ==========================================================================

    const sortedData = useMemo(() => {
      // When manualSorting is true, skip client-side sorting
      if (manualSorting) {
        return data;
      }

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
    }, [data, currentSortConfig, columns, manualSorting]);

    // ==========================================================================
    // Paginated Data
    // ==========================================================================

    const paginatedData = useMemo(() => {
      if (paginationState && !manualPagination) {
        return sortedData.slice(
          paginationState.page * paginationState.pageSize,
          (paginationState.page + 1) * paginationState.pageSize
        );
      }
      return sortedData;
    }, [sortedData, paginationState, manualPagination]);

    // Pagination computed values
    const paginationInfo = useMemo(() => {
      if (!paginationState) return null;

      const totalCount = manualPagination
        ? (totalRows ?? data.length)
        : sortedData.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / paginationState.pageSize));
      const currentPage = Math.min(paginationState.page, totalPages - 1);
      const startRow = currentPage * paginationState.pageSize + 1;
      const endRow = Math.min((currentPage + 1) * paginationState.pageSize, totalCount);

      return { totalCount, totalPages, currentPage, startRow, endRow };
    }, [paginationState, manualPagination, totalRows, data.length, sortedData.length]);

    const goToPage = useCallback(
      (page: number) => {
        if (!paginationState || !paginationInfo) return;
        const safePage = Math.max(0, Math.min(page, paginationInfo.totalPages - 1));
        setPaginationState({ ...paginationState, page: safePage });
      },
      [paginationState, paginationInfo, setPaginationState]
    );

    const handlePageSizeChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!paginationState) return;
        const newSize = Number(e.target.value);
        setPaginationState({ page: 0, pageSize: newSize });
      },
      [paginationState, setPaginationState]
    );

    // ==========================================================================
    // All row IDs (for shift+click range calculation)
    // ==========================================================================
    const allDisplayedRowIds = useMemo(() => {
      return paginatedData.map((row, idx) => getRowId(row, idx, rowIdAccessor));
    }, [paginatedData, rowIdAccessor]);

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
    // Column count adjustment
    // ==========================================================================
    const hasSelectionColumn = selectionMode !== 'none';
    const hasExpandColumn = !!expandable;
    const totalColumns =
      visibleColumns.length + (hasSelectionColumn ? 1 : 0) + (hasExpandColumn ? 1 : 0);

    // ==========================================================================
    // Pagination UI
    // ==========================================================================

    const paginationElement = paginationState && paginationInfo ? (
      <nav aria-label="Table pagination">
        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            Showing {paginationInfo.startRow}-{paginationInfo.endRow} of{' '}
            {paginationInfo.totalCount} rows
          </div>
          <ul className="pagination mb-0">
            <li className={cn('page-item', paginationInfo.currentPage === 0 && 'disabled')}>
              <button
                className="page-link"
                onClick={() => goToPage(0)}
                aria-label="First page"
                disabled={paginationInfo.currentPage === 0}
              >
                {'\u00AB'}
              </button>
            </li>
            <li className={cn('page-item', paginationInfo.currentPage === 0 && 'disabled')}>
              <button
                className="page-link"
                onClick={() => goToPage(paginationInfo.currentPage - 1)}
                aria-label="Previous page"
                disabled={paginationInfo.currentPage === 0}
              >
                {'\u2039'}
              </button>
            </li>
            {getVisiblePages(paginationInfo.currentPage, paginationInfo.totalPages).map(
              (pageNum) => (
                <li
                  key={pageNum}
                  className={cn(
                    'page-item',
                    pageNum === paginationInfo.currentPage && 'active'
                  )}
                >
                  <button
                    className="page-link"
                    onClick={() => goToPage(pageNum)}
                    aria-label={`Page ${pageNum + 1}`}
                    aria-current={
                      pageNum === paginationInfo.currentPage ? 'page' : undefined
                    }
                  >
                    {pageNum + 1}
                  </button>
                </li>
              )
            )}
            <li
              className={cn(
                'page-item',
                paginationInfo.currentPage === paginationInfo.totalPages - 1 && 'disabled'
              )}
            >
              <button
                className="page-link"
                onClick={() => goToPage(paginationInfo.currentPage + 1)}
                aria-label="Next page"
                disabled={paginationInfo.currentPage === paginationInfo.totalPages - 1}
              >
                {'\u203A'}
              </button>
            </li>
            <li
              className={cn(
                'page-item',
                paginationInfo.currentPage === paginationInfo.totalPages - 1 && 'disabled'
              )}
            >
              <button
                className="page-link"
                onClick={() => goToPage(paginationInfo.totalPages - 1)}
                aria-label="Last page"
                disabled={paginationInfo.currentPage === paginationInfo.totalPages - 1}
              >
                {'\u00BB'}
              </button>
            </li>
          </ul>
          {pageSizeOptions && paginationState && (
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={paginationState.pageSize}
              onChange={handlePageSizeChange}
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz} / page
                </option>
              ))}
            </select>
          )}
        </div>
      </nav>
    ) : null;

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

        {/* Colgroup for column widths */}
        <colgroup>
          {hasExpandColumn && <col style={{ width: '48px' }} />}
          {hasSelectionColumn && <col style={{ width: '48px' }} />}
          {visibleColumns.map((column) => {
            const w = Reflect.get(columnWidths, column.id) as number | undefined;
            return (
              <col
                key={column.id}
                style={w !== undefined ? { width: `${w}px` } : undefined}
              />
            );
          })}
        </colgroup>

        {/* Header */}
        <thead className={headerClasses} style={stickyHeaderStyle}>
          <tr>
            {/* Expand header */}
            {hasExpandColumn && (
              <th scope="col" className="table-expand-cell" style={{ width: '48px' }}>
                {expandable?.expandAll ? (
                  <button
                    className="btn btn-sm btn-link p-0"
                    onClick={handleToggleExpandAll}
                    aria-label="Expand all rows"
                    type="button"
                  >
                    {data.every((row, idx) =>
                      expandedRowSet.has(getRowId(row, idx, rowIdAccessor))
                    )
                      ? '\u25BC'
                      : '\u25B6'}
                  </button>
                ) : (
                  <span className="visually-hidden">Expand</span>
                )}
              </th>
            )}

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
            {visibleColumns.map((column) => {
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
              // Override with resized width
              const resizedWidth = Reflect.get(columnWidths, column.id) as number | undefined;
              if (resizedWidth !== undefined) {
                headerStyle.width = `${resizedWidth}px`;
              }
              // Sticky columns (left/right) work independently
              if (column.sticky) {
                headerStyle.position = 'sticky';
                headerStyle[column.sticky] = 0;
                headerStyle.zIndex = stickyHeader ? 3 : 2; // Higher z-index if also sticky header
                headerStyle.backgroundColor = 'var(--bs-table-bg, #fff)';
              }
              // Resizable columns need relative positioning for the handle
              if (column.resizable && !column.sticky) {
                headerStyle.position = 'relative';
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
                  {column.resizable && (
                    <div
                      className="table-resize-handle"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        cursor: 'col-resize',
                      }}
                      onPointerDown={(e) => handleResizeStart(e, column.id)}
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize column ${typeof column.header === 'string' ? column.header : column.id}`}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Body */}
        {/* TODO(virtualization): Integrate @tanstack/react-virtual for 10k+ row support. When virtual={true}, replace this tbody with a virtualized container. */}
        <tbody>
          {paginatedData.length === 0 && showEmpty ? (
            <tr>
              <td colSpan={totalColumns} className="text-center text-muted py-4">
                {emptyContent}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const rowIdValue = getRowId(row, rowIndex, rowIdAccessor);
              const isSelected = isRowSelected(fsmState, rowIdValue);
              const isDisabled = disabledRowSet.has(rowIdValue);
              const isInteractive = selectionMode !== 'none' || onRowClick;
              const isExpanded = expandedRowSet.has(rowIdValue);

              const rowClasses = cn(isSelected && 'table-active', isDisabled && 'table-disabled');

              return (
                <React.Fragment key={rowIdValue}>
                  <tr
                    className={rowClasses || undefined}
                    aria-selected={selectionMode !== 'none' ? isSelected : undefined}
                    aria-disabled={isDisabled || undefined}
                    onClick={(e) => {
                      onRowClick?.(row, rowIndex);
                      if (selectionMode !== 'none' && !isDisabled) {
                        handleRowSelectionClick(
                          rowIdValue,
                          isDisabled,
                          e.shiftKey,
                          allDisplayedRowIds
                        );
                      }
                    }}
                    onKeyDown={
                      isInteractive
                        ? (e) =>
                            handleRowKeyDown(e, rowIdValue, isDisabled, allDisplayedRowIds)
                        : undefined
                    }
                    tabIndex={isInteractive && !isDisabled ? 0 : undefined}
                    role={selectionMode !== 'none' ? 'row' : undefined}
                  >
                    {/* Expand cell */}
                    {hasExpandColumn && (
                      <td className="table-expand-cell">
                        <button
                          className="btn btn-sm btn-link p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleExpand(rowIdValue);
                          }}
                          onKeyDown={(e) => {
                            if (isEnterKey(e) || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleExpand(rowIdValue);
                            }
                          }}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} row ${rowIndex + 1}`}
                          type="button"
                        >
                          {isExpanded ? '\u25BC' : '\u25B6'}
                        </button>
                      </td>
                    )}

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
                    {visibleColumns.map((column) => {
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

                  {/* Expanded row content */}
                  {hasExpandColumn && isExpanded && expandable && (
                    <tr className="table-expanded-row">
                      <td colSpan={totalColumns}>
                        {expandable.render(row, rowIndex)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

    // Build final output with pagination
    const showTopPagination =
      paginationElement && (paginationPosition === 'top' || paginationPosition === 'both');
    const showBottomPagination =
      paginationElement && (paginationPosition === 'bottom' || paginationPosition === 'both');

    const content = (
      <>
        {showTopPagination && paginationElement}
        {responsive || (stickyHeader && maxHeight) ? (
          <div className={wrapperClasses || undefined} style={computedWrapperStyle}>
            {tableElement}
          </div>
        ) : (
          tableElement
        )}
        {showBottomPagination && paginationElement}
      </>
    );

    // If we have pagination, we need a wrapping div
    if (paginationElement) {
      return <div className="table-container">{content}</div>;
    }

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
