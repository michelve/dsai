/**
 * Figma Code Connect - Table Component
 *
 * Maps the DSAi Table Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Table/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Table } from './Table';

import type { TableColumn } from './Table.types';

/**
 * DSAi Table - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_TABLE>` substitution variable defined in figma.config.json.
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Row selection: none / single / multiple modes
 * - FSM-based state management
 * - Responsive wrapper for horizontal scroll
 * - Sticky header support
 *
 * Accessibility goals:
 * - Semantic table elements (table, thead, tbody, th, td)
 * - aria-sort for sortable columns
 * - aria-selected for selected rows
 * - Keyboard navigation for selection
 */
figma.connect(Table, '<FIGMA_DSAI_TABLE>', {
  props: {
    /**
     * Table variant
     * Maps Figma "Variant" property
     */
    variant: figma.enum('Variant', {
      Default: 'default',
      Striped: 'striped',
      Bordered: 'bordered',
      Borderless: 'borderless',
    }),

    /**
     * Table size
     * Maps Figma "Size" property
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Selection mode
     * Maps Figma "Selection Mode" property
     */
    selectionMode: figma.enum('Selection Mode', {
      None: 'none',
      Single: 'single',
      Multiple: 'multiple',
    }),

    /**
     * Header color
     * Maps Figma "Header Color" property
     */
    headerColor: figma.enum('Header Color', {
      None: undefined,
      Primary: 'primary',
      Secondary: 'secondary',
      Light: 'light',
      Dark: 'dark',
    }),

    /**
     * Hover effect on rows
     * Maps Figma "Hover" boolean property
     */
    hover: figma.boolean('Hover'),

    /**
     * Responsive horizontal scroll
     * Maps Figma "Responsive" boolean property
     */
    responsive: figma.boolean('Responsive'),

    /**
     * Sticky header
     * Maps Figma "Sticky Header" boolean property
     */
    stickyHeader: figma.boolean('Sticky Header'),

    /**
     * Show sortable columns
     * Maps Figma "Sortable" boolean property
     */
    sortable: figma.boolean('Sortable'),

    /**
     * Number of columns
     * Maps Figma "Column Count" property
     */
    columnCount: figma.enum('Column Count', {
      '3': 3,
      '4': 4,
      '5': 5,
    }),

    /**
     * Number of rows
     * Maps Figma "Row Count" property
     */
    rowCount: figma.enum('Row Count', {
      '3': 3,
      '5': 5,
      '10': 10,
    }),

    /**
     * Show empty state
     * Maps Figma "Empty" boolean property
     */
    empty: figma.boolean('Empty'),

    /**
     * Caption text
     * Maps Figma "Caption" text property
     */
    caption: figma.string('Caption'),
  },

  example: ({
    variant,
    size,
    selectionMode,
    headerColor,
    hover,
    responsive,
    stickyHeader,
    sortable,
    columnCount,
    rowCount,
    empty,
    caption,
  }) => {
    const normalizedCaption = caption && caption.trim().length > 0 ? caption.trim() : undefined;

    const colCount = columnCount || 4;
    const columns: TableColumn<Record<string, unknown>>[] = [
      { id: 'id', header: 'ID', accessor: 'id', sortable },
      { id: 'name', header: 'Name', accessor: 'name', sortable },
      { id: 'email', header: 'Email', accessor: 'email', sortable },
      { id: 'status', header: 'Status', accessor: 'status' },
      { id: 'date', header: 'Date', accessor: 'date', sortable },
    ].slice(0, colCount);

    const count = rowCount || 5;
    const data = empty
      ? []
      : Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          status: i % 2 === 0 ? 'Active' : 'Inactive',
          date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        }));

    // Type-safe props based on selection mode
    const selectionProps =
      selectionMode === 'none'
        ? {}
        : selectionMode === 'single'
          ? { selectionMode: 'single' as const, onSelectionChange: () => {} }
          : { selectionMode: 'multiple' as const, onSelectionChange: () => {} };

    return (
      <Table
        columns={columns}
        data={data}
        rowId="id"
        variant={variant}
        size={size}
        headerColor={headerColor}
        hover={hover}
        responsive={responsive}
        stickyHeader={stickyHeader}
        maxHeight={stickyHeader ? 400 : undefined}
        caption={normalizedCaption}
        {...selectionProps}
      />
    );
  },
});

/**
 * Table Usage Patterns
 *
 * 1. Basic Table:
 *    <Table
 *      columns={[
 *        { id: 'name', header: 'Name', accessor: 'name' },
 *        { id: 'email', header: 'Email', accessor: 'email' },
 *      ]}
 *      data={users}
 *    />
 *
 * 2. With Sorting:
 *    <Table
 *      columns={[
 *        { id: 'name', header: 'Name', accessor: 'name', sortable: true },
 *        { id: 'date', header: 'Date', accessor: 'date', sortable: true },
 *      ]}
 *      data={items}
 *      defaultSortConfig={{ columnId: 'date', direction: 'desc' }}
 *    />
 *
 * 3. Single Selection:
 *    <Table
 *      columns={columns}
 *      data={data}
 *      selectionMode="single"
 *      selectedRows={selectedId}
 *      onSelectionChange={setSelectedId}
 *    />
 *
 * 4. Multiple Selection:
 *    <Table
 *      columns={columns}
 *      data={data}
 *      selectionMode="multiple"
 *      selectedRows={selectedIds}
 *      onSelectionChange={setSelectedIds}
 *    />
 *
 * 5. Sticky Header:
 *    <Table
 *      columns={columns}
 *      data={data}
 *      stickyHeader
 *      maxHeight={400}
 *    />
 *
 * 6. With Custom Cell Rendering:
 *    <Table
 *      columns={[
 *        { id: 'name', header: 'Name', accessor: 'name' },
 *        {
 *          id: 'status',
 *          header: 'Status',
 *          accessor: 'status',
 *          cell: (value) => <Badge variant={value}>{value}</Badge>
 *        },
 *      ]}
 *      data={data}
 *    />
 *
 * 7. Striped with Hover:
 *    <Table
 *      variant="striped"
 *      hover
 *      columns={columns}
 *      data={data}
 *    />
 *
 * Accessibility Notes:
 * - Semantic <table>, <thead>, <tbody>, <th>, <td> elements
 * - aria-sort on sortable column headers
 * - aria-selected on selected rows
 * - Keyboard navigation (Enter/Space to select, Tab between rows)
 * - Optional caption for table description
 */
