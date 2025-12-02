import { Badge, Table } from '@dsai/react';
import { useState } from 'react';

import type { RowId, SortConfig, TableColumn } from '@dsai/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// =============================================================================
// Test Data Types
// =============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  department: string;
  salary: number;
  joinDate: string;
}

// =============================================================================
// Test Data
// =============================================================================

const users: User[] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'Engineer',
    status: 'active',
    department: 'Engineering',
    salary: 95000,
    joinDate: '2021-03-15',
  },
  {
    id: 2,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Designer',
    status: 'active',
    department: 'Design',
    salary: 85000,
    joinDate: '2020-07-22',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'Manager',
    status: 'inactive',
    department: 'Operations',
    salary: 110000,
    joinDate: '2019-11-01',
  },
  {
    id: 4,
    name: 'Diana Ross',
    email: 'diana@example.com',
    role: 'Engineer',
    status: 'active',
    department: 'Engineering',
    salary: 98000,
    joinDate: '2022-01-10',
  },
  {
    id: 5,
    name: 'Eve Wilson',
    email: 'eve@example.com',
    role: 'Analyst',
    status: 'pending',
    department: 'Analytics',
    salary: 78000,
    joinDate: '2023-06-05',
  },
];

// =============================================================================
// Column Definitions
// =============================================================================

const basicColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'role', header: 'Role', accessor: 'role' },
  { id: 'department', header: 'Department', accessor: 'department' },
];

const sortableColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
  { id: 'role', header: 'Role', accessor: 'role', sortable: true },
  { id: 'salary', header: 'Salary', accessor: 'salary', sortable: true, align: 'right' },
];

// =============================================================================
// Storybook Configuration
// =============================================================================

/**
 * Table is a Bootstrap 5 table component with sorting, row selection,
 * responsive layout, and sticky header support.
 *
 * Features:
 * - **Sortable columns** with visual indicators and keyboard support
 * - **Row selection** with three modes: none, single, multiple
 * - **Responsive layout** with horizontal scroll on small screens
 * - **Sticky header** support for long tables
 * - **FSM-based** state management for predictable behavior
 *
 * Variants:
 * - `default`: Standard table
 * - `striped`: Alternating row colors
 * - `bordered`: All cell borders
 * - `borderless`: No borders
 *
 * Selection Modes:
 * - `none`: Display only, no selection
 * - `single`: Radio-like, one row at a time
 * - `multiple`: Checkbox-like, multiple rows with select-all
 *
 * Accessibility Features (WCAG 2.2 AA):
 * - Semantic table elements (`table`, `thead`, `tbody`, `th`, `td`)
 * - `aria-sort` on sortable columns
 * - `aria-selected` on selected rows
 * - Keyboard navigation for sorting and selection
 * - Support for caption and ARIA labels
 *
 * @see https://getbootstrap.com/docs/5.3/content/tables/
 */
const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Bootstrap 5 table component with sorting, row selection, responsive layout, ' +
          'and sticky header support. Uses FSM for predictable selection state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered', 'borderless'],
      description: 'Table style variant',
      table: {
        type: { summary: "'default' | 'striped' | 'bordered' | 'borderless'" },
        defaultValue: { summary: "'default'" },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Table size',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    headerColor: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ],
      description: 'Header background color',
    },
    hover: {
      control: 'boolean',
      description: 'Enable row hover effect',
      table: { defaultValue: { summary: 'true' } },
    },
    responsive: {
      control: 'boolean',
      description: 'Enable responsive wrapper',
      table: { defaultValue: { summary: 'true' } },
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Sticky header',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// =============================================================================
// Basic Stories
// =============================================================================

/**
 * Basic table with default styling.
 */
export const Default: Story = {
  args: {
    columns: basicColumns,
    data: users,
    'aria-label': 'User list',
  },
};

/**
 * Striped table with alternating row colors.
 */
export const Striped: Story = {
  args: {
    columns: basicColumns,
    data: users,
    variant: 'striped',
    'aria-label': 'Striped user list',
  },
};

/**
 * Bordered table with all cell borders.
 */
export const Bordered: Story = {
  args: {
    columns: basicColumns,
    data: users,
    variant: 'bordered',
    'aria-label': 'Bordered user list',
  },
};

/**
 * Borderless table with no borders.
 */
export const Borderless: Story = {
  args: {
    columns: basicColumns,
    data: users,
    variant: 'borderless',
    'aria-label': 'Borderless user list',
  },
};

/**
 * Small table with reduced padding.
 */
export const SmallSize: Story = {
  args: {
    columns: basicColumns,
    data: users,
    size: 'sm',
    'aria-label': 'Compact user list',
  },
};

/**
 * Table without hover effect.
 */
export const NoHover: Story = {
  args: {
    columns: basicColumns,
    data: users,
    hover: false,
    'aria-label': 'User list without hover',
  },
};

// =============================================================================
// Header Color Stories
// =============================================================================

/**
 * Table with dark header.
 */
export const DarkHeader: Story = {
  args: {
    columns: basicColumns,
    data: users,
    headerColor: 'dark',
    'aria-label': 'User list with dark header',
  },
};

/**
 * Table with primary colored header.
 */
export const PrimaryHeader: Story = {
  args: {
    columns: basicColumns,
    data: users,
    headerColor: 'primary',
    'aria-label': 'User list with primary header',
  },
};

// =============================================================================
// Sorting Stories
// =============================================================================

/**
 * Table with sortable columns. Click column headers to sort.
 */
export const Sortable: Story = {
  args: {
    columns: sortableColumns,
    data: users,
    'aria-label': 'Sortable user list',
  },
};

/**
 * Controlled sorting with external state management.
 */
export const ControlledSorting: Story = {
  render: function ControlledSortingStory() {
    const [sortConfig, setSortConfig] = useState<SortConfig | undefined>({
      columnId: 'name',
      direction: 'asc',
    });

    return (
      <div>
        <div className="mb-3">
          <strong>Current sort:</strong>{' '}
          {sortConfig ? `${sortConfig.columnId} (${sortConfig.direction})` : 'None'}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => setSortConfig(undefined)}
          >
            Clear sort
          </button>
        </div>
        <Table
          columns={sortableColumns}
          data={users}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          aria-label="Controlled sorting example"
        />
      </div>
    );
  },
};

// =============================================================================
// Selection Stories
// =============================================================================

/**
 * Single row selection (radio-like behavior).
 */
export const SingleSelection: Story = {
  render: function SingleSelectionStory() {
    const [selected, setSelected] = useState<RowId | undefined>();

    return (
      <div>
        <div className="mb-3">
          <strong>Selected:</strong> {selected !== undefined ? `Row ${selected}` : 'None'}
        </div>
        <Table
          columns={basicColumns}
          data={users}
          selectionMode="single"
          rowId="id"
          selectedRows={selected}
          onSelectionChange={setSelected}
          aria-label="Single selection table"
        />
      </div>
    );
  },
};

/**
 * Multiple row selection with select-all checkbox.
 */
export const MultipleSelection: Story = {
  render: function MultipleSelectionStory() {
    const [selected, setSelected] = useState<RowId[]>([]);

    return (
      <div>
        <div className="mb-3">
          <strong>Selected ({selected.length}):</strong>{' '}
          {selected.length > 0 ? selected.join(', ') : 'None'}
        </div>
        <Table
          columns={basicColumns}
          data={users}
          selectionMode="multiple"
          rowId="id"
          selectedRows={selected}
          onSelectionChange={setSelected}
          aria-label="Multiple selection table"
        />
      </div>
    );
  },
};

/**
 * Selection with some rows disabled.
 */
export const SelectionWithDisabledRows: Story = {
  render: function DisabledRowsStory() {
    const [selected, setSelected] = useState<RowId[]>([]);

    return (
      <div>
        <div className="mb-3">
          <strong>Note:</strong> Rows 2 and 4 are disabled and cannot be selected.
        </div>
        <Table
          columns={basicColumns}
          data={users}
          selectionMode="multiple"
          rowId="id"
          selectedRows={selected}
          onSelectionChange={setSelected}
          disabledRows={[2, 4]}
          aria-label="Table with disabled rows"
        />
      </div>
    );
  },
};

// =============================================================================
// Custom Cell Stories
// =============================================================================

/**
 * Table with custom cell renderers for rich content.
 */
export const CustomCellRenderers: Story = {
  render: function CustomCellStory() {
    const customColumns: TableColumn<User>[] = [
      { id: 'name', header: 'Name', accessor: 'name', sortable: true },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
        cell: (value) => (
          <a href={`mailto:${value}`} className="text-decoration-none">
            {String(value)}
          </a>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        cell: (value) => {
          const variant =
            value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
          return <Badge variant={variant}>{String(value)}</Badge>;
        },
      },
      {
        id: 'salary',
        header: 'Salary',
        accessor: 'salary',
        align: 'right',
        cell: (value) => `$${Number(value).toLocaleString()}`,
      },
    ];

    return <Table columns={customColumns} data={users} aria-label="Table with custom cells" />;
  },
};

// =============================================================================
// Empty State Stories
// =============================================================================

/**
 * Table with empty state.
 */
export const EmptyState: Story = {
  args: {
    columns: basicColumns,
    data: [],
    emptyContent: 'No users found',
    'aria-label': 'Empty table',
  },
};

/**
 * Table with custom empty content.
 */
export const CustomEmptyContent: Story = {
  render: function CustomEmptyStory() {
    return (
      <Table
        columns={basicColumns}
        data={[]}
        emptyContent={
          <div className="text-center py-4">
            <div className="fs-4 text-muted mb-2">📋</div>
            <p className="mb-2">No data available</p>
            <button type="button" className="btn btn-primary btn-sm">
              Add New User
            </button>
          </div>
        }
        aria-label="Table with custom empty state"
      />
    );
  },
};

// =============================================================================
// Caption and Footer Stories
// =============================================================================

/**
 * Table with caption for accessibility.
 */
export const WithCaption: Story = {
  args: {
    columns: basicColumns,
    data: users,
    caption: 'List of registered users in the system',
  },
};

/**
 * Table with footer.
 */
export const WithFooter: Story = {
  args: {
    columns: basicColumns,
    data: users,
    footer: `Total: ${users.length} users`,
    'aria-label': 'Table with footer',
  },
};

// =============================================================================
// Sticky Header Stories
// =============================================================================

/**
 * Table with sticky header for long lists.
 */
export const StickyHeader: Story = {
  render: function StickyHeaderStory() {
    // Generate more data
    const manyUsers = Array.from({ length: 20 }, (_, i) => ({
      ...users[i % users.length],
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    return (
      <Table
        columns={basicColumns}
        data={manyUsers}
        stickyHeader
        maxHeight={300}
        aria-label="Table with sticky header"
      />
    );
  },
};

// =============================================================================
// Sticky Columns Stories
// =============================================================================

/**
 * Table with sticky columns that stay visible during horizontal scroll.
 * The ID column is sticky to the left, and the Actions column is sticky to the right.
 */
export const StickyColumns: Story = {
  render: function StickyColumnsStory() {
    const wideColumns: TableColumn<User>[] = [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id',
        sticky: 'left',
        width: 60,
      },
      { id: 'name', header: 'Name', accessor: 'name', minWidth: 150 },
      { id: 'email', header: 'Email', accessor: 'email', minWidth: 200 },
      { id: 'role', header: 'Role', accessor: 'role', minWidth: 120 },
      { id: 'department', header: 'Department', accessor: 'department', minWidth: 150 },
      {
        id: 'salary',
        header: 'Salary',
        accessor: 'salary',
        minWidth: 120,
        align: 'right',
        cell: (value) => `$${Number(value).toLocaleString()}`,
      },
      { id: 'joinDate', header: 'Join Date', accessor: 'joinDate', minWidth: 120 },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        minWidth: 100,
        cell: (value) => {
          const variant =
            value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
          return <Badge variant={variant}>{String(value)}</Badge>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: () => null,
        sticky: 'right',
        width: 100,
        align: 'center',
        cell: () => (
          <button type="button" className="btn btn-sm btn-outline-primary">
            Edit
          </button>
        ),
      },
    ];

    return (
      <div style={{ maxWidth: 600 }}>
        <p className="text-muted small mb-2">
          Scroll horizontally to see sticky columns (ID on left, Actions on right).
        </p>
        <Table
          columns={wideColumns}
          data={users}
          responsive
          aria-label="Table with sticky columns"
        />
      </div>
    );
  },
};

// =============================================================================
// Action Column Stories
// =============================================================================

/**
 * Table with an actions column containing edit/delete buttons.
 * Action columns use a cell renderer since they don't map to data.
 */
export const ActionColumn: Story = {
  render: function ActionColumnStory() {
    const [lastAction, setLastAction] = useState<string | null>(null);

    const actionColumns: TableColumn<User>[] = [
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'email', header: 'Email', accessor: 'email' },
      { id: 'role', header: 'Role', accessor: 'role' },
      {
        id: 'actions',
        header: 'Actions',
        accessor: () => null, // No data to access for actions
        align: 'right',
        cell: (_, row) => (
          <div className="d-flex gap-1 justify-content-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={(e) => {
                e.stopPropagation();
                setLastAction(`Edit: ${(row as User).name}`);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={(e) => {
                e.stopPropagation();
                setLastAction(`Delete: ${(row as User).name}`);
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
    ];

    return (
      <div>
        {lastAction && (
          <div className="alert alert-info mb-3">
            Last action: <strong>{lastAction}</strong>
          </div>
        )}
        <Table columns={actionColumns} data={users} aria-label="Table with action buttons" />
      </div>
    );
  },
};

// =============================================================================
// Row Click Stories
// =============================================================================

/**
 * Table with row click handler.
 */
export const RowClick: Story = {
  render: function RowClickStory() {
    const [clickedRow, setClickedRow] = useState<User | null>(null);

    return (
      <div>
        {clickedRow && (
          <div className="alert alert-info mb-3">
            Clicked: {clickedRow.name} ({clickedRow.email})
          </div>
        )}
        <Table
          columns={basicColumns}
          data={users}
          onRowClick={(row) => setClickedRow(row as User)}
          aria-label="Clickable rows table"
        />
      </div>
    );
  },
};

// =============================================================================
// Combined Features Stories
// =============================================================================

/**
 * Full-featured table with sorting, selection, and custom cells.
 */
export const FullFeatured: Story = {
  render: function FullFeaturedStory() {
    const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
    const [selected, setSelected] = useState<RowId[]>([]);

    const fullColumns: TableColumn<User>[] = [
      { id: 'name', header: 'Name', accessor: 'name', sortable: true },
      { id: 'email', header: 'Email', accessor: 'email', sortable: true },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        cell: (value) => {
          const variant =
            value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'secondary';
          return <Badge variant={variant}>{String(value)}</Badge>;
        },
      },
      {
        id: 'salary',
        header: 'Salary',
        accessor: 'salary',
        align: 'right',
        sortable: true,
        cell: (value) => `$${Number(value).toLocaleString()}`,
      },
    ];

    return (
      <div>
        <div className="mb-3 d-flex gap-3 align-items-center">
          <span>
            <strong>Selected:</strong> {selected.length} rows
          </span>
          <span>
            <strong>Sort:</strong>{' '}
            {sortConfig ? `${sortConfig.columnId} (${sortConfig.direction})` : 'None'}
          </span>
        </div>
        <Table
          columns={fullColumns}
          data={users}
          variant="striped"
          selectionMode="multiple"
          rowId="id"
          selectedRows={selected}
          onSelectionChange={setSelected}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          caption="Employee Directory"
        />
      </div>
    );
  },
};

// =============================================================================
// Accessibility Stories
// =============================================================================

/**
 * Table with all accessibility features enabled.
 */
export const AccessibilityShowcase: Story = {
  render: function AccessibilityStory() {
    return (
      <div>
        <h2 id="employees-heading" className="h5 mb-3">
          Employee List
        </h2>
        <p id="employees-desc" className="text-muted small mb-3">
          This table shows all employees with their roles and departments.
        </p>
        <Table
          columns={sortableColumns}
          data={users}
          aria-labelledby="employees-heading"
          aria-describedby="employees-desc"
          selectionMode="multiple"
          rowId="id"
        />
      </div>
    );
  },
};

/**
 * Example showing all visual states based on selection.
 */
export const VisualStates: Story = {
  render: function VisualStatesStory() {
    const [state, setState] = useState<'none' | 'one' | 'some' | 'all'>('none');

    const getSelectedRows = (): RowId[] => {
      switch (state) {
        case 'none':
          return [];
        case 'one':
          return [1];
        case 'some':
          return [1, 2, 3];
        case 'all':
          return users.map((u) => u.id);
      }
    };

    return (
      <div>
        <div className="mb-3 btn-group">
          <button
            type="button"
            className={`btn btn-sm ${state === 'none' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setState('none')}
          >
            None
          </button>
          <button
            type="button"
            className={`btn btn-sm ${state === 'one' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setState('one')}
          >
            One
          </button>
          <button
            type="button"
            className={`btn btn-sm ${state === 'some' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setState('some')}
          >
            Some
          </button>
          <button
            type="button"
            className={`btn btn-sm ${state === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setState('all')}
          >
            All
          </button>
        </div>
        <p className="small text-muted mb-3">
          Current visual state: <code>data-visual-state=&quot;{state}&quot;</code>
        </p>
        <Table
          columns={basicColumns}
          data={users}
          selectionMode="multiple"
          rowId="id"
          selectedRows={getSelectedRows()}
          aria-label="Visual states demo"
        />
      </div>
    );
  },
};
