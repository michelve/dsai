/**
 * @jest-environment jsdom
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';

import { Table } from './Table';

import type { RowId, SortConfig, SortingState, TableColumn } from './Table.types';

expect.extend(toHaveNoViolations);

// =============================================================================
// Test Data
// =============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
}

const testData: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 30, department: 'Engineering' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', age: 25, department: 'Marketing' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 35, department: 'Sales' },
  { id: 4, name: 'Diana Ross', email: 'diana@example.com', age: 28, department: 'Engineering' },
];

const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'age', header: 'Age', accessor: 'age', align: 'right' },
  { id: 'department', header: 'Department', accessor: 'department' },
];

const sortableColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true, align: 'right' },
  { id: 'department', header: 'Department', accessor: 'department', sortable: true },
];

// =============================================================================
// Basic Rendering Tests
// =============================================================================

describe('Table', () => {
  describe('Basic Rendering', () => {
    it('renders with data', () => {
      render(<Table columns={columns} data={testData} />);

      // Headers
      expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Department' })).toBeInTheDocument();

      // Data
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('35')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });

    it('renders as semantic table element', () => {
      const { container } = render(<Table columns={columns} data={testData} />);

      expect(container.querySelector('table')).toBeInTheDocument();
      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      render(<Table columns={columns} data={[]} />);

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty content', () => {
      render(<Table columns={columns} data={[]} emptyContent="No users found" />);

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('renders with caption', () => {
      render(<Table columns={columns} data={testData} caption="User List" />);

      expect(screen.getByText('User List')).toBeInTheDocument();
    });

    it('renders footer', () => {
      render(<Table columns={columns} data={testData} footer="Total: 4 users" />);

      expect(screen.getByText('Total: 4 users')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Table columns={columns} data={testData} className="custom-table" />
      );

      expect(container.querySelector('.custom-table')).toBeInTheDocument();
    });

    it('applies custom style', () => {
      const { container } = render(
        <Table columns={columns} data={testData} style={{ marginTop: '20px' }} />
      );

      expect(container.querySelector('table')).toHaveStyle({ marginTop: '20px' });
    });

    it('forwards ref to table element', () => {
      const ref = createRef<HTMLTableElement>();
      render(<Table ref={ref} columns={columns} data={testData} />);

      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });
  });

  // ===========================================================================
  // Variants
  // ===========================================================================

  describe('Variants', () => {
    it('renders default variant', () => {
      const { container } = render(<Table columns={columns} data={testData} variant="default" />);

      expect(container.querySelector('.table')).toBeInTheDocument();
      expect(container.querySelector('.table-striped')).not.toBeInTheDocument();
    });

    it('renders striped variant', () => {
      const { container } = render(<Table columns={columns} data={testData} variant="striped" />);

      expect(container.querySelector('.table-striped')).toBeInTheDocument();
    });

    it('renders bordered variant', () => {
      const { container } = render(<Table columns={columns} data={testData} variant="bordered" />);

      expect(container.querySelector('.table-bordered')).toBeInTheDocument();
    });

    it('renders borderless variant', () => {
      const { container } = render(
        <Table columns={columns} data={testData} variant="borderless" />
      );

      expect(container.querySelector('.table-borderless')).toBeInTheDocument();
    });

    it('renders small size', () => {
      const { container } = render(<Table columns={columns} data={testData} size="sm" />);

      expect(container.querySelector('.table-sm')).toBeInTheDocument();
    });

    it('renders with header color', () => {
      const { container } = render(
        <Table columns={columns} data={testData} headerColor="primary" />
      );

      expect(container.querySelector('.table-primary')).toBeInTheDocument();
    });

    it('renders with hover effect by default', () => {
      const { container } = render(<Table columns={columns} data={testData} />);

      expect(container.querySelector('.table-hover')).toBeInTheDocument();
    });

    it('renders without hover effect when disabled', () => {
      const { container } = render(<Table columns={columns} data={testData} hover={false} />);

      expect(container.querySelector('.table-hover')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Responsive
  // ===========================================================================

  describe('Responsive', () => {
    it('renders in responsive wrapper by default', () => {
      const { container } = render(<Table columns={columns} data={testData} />);

      expect(container.querySelector('.table-responsive')).toBeInTheDocument();
    });

    it('renders without responsive wrapper when disabled', () => {
      const { container } = render(<Table columns={columns} data={testData} responsive={false} />);

      expect(container.querySelector('.table-responsive')).not.toBeInTheDocument();
    });

    it('applies wrapper className', () => {
      const { container } = render(
        <Table columns={columns} data={testData} wrapperClassName="custom-wrapper" />
      );

      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Sorting
  // ===========================================================================

  describe('Sorting', () => {
    it('renders sortable column headers with sort indicator', () => {
      render(<Table columns={sortableColumns} data={testData} />);

      // Should have sort icons on all sortable columns
      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toBeInTheDocument();
      expect(nameHeader.querySelector('.table-sort-icon')).toBeInTheDocument();
    });

    it('applies aria-sort when sorted ascending', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'asc' }}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('applies aria-sort when sorted descending', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'desc' }}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('sorts data when header clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      // Click name header to sort ascending
      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      await user.click(nameHeader);

      // Get all cells in name column
      const rows = screen.getAllByRole('row').slice(1); // Skip header row
      const firstCell = within(rows[0]).getAllByRole('cell')[0];
      expect(firstCell).toHaveTextContent('Alice Smith');
    });

    it('calls onSortChange when header clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      render(<Table columns={sortableColumns} data={testData} onSortChange={onSortChange} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      await user.click(nameHeader);

      expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });
    });

    it('toggles sort direction on repeated clicks', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ControlledSort = () => {
        const [sort, setSort] = useState<SortConfig | undefined>();
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ControlledSort />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });

      // First click - ascending
      await user.click(nameHeader);
      expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'asc' });

      // Second click - descending
      await user.click(nameHeader);
      expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'desc' });

      // Third click - clear sort
      await user.click(nameHeader);
      expect(onSortChange).toHaveBeenLastCalledWith(undefined);
    });

    it('supports keyboard sorting with Enter', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      render(<Table columns={sortableColumns} data={testData} onSortChange={onSortChange} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await user.keyboard('{Enter}');

      expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });
    });

    it('supports keyboard sorting with Space', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      render(<Table columns={sortableColumns} data={testData} onSortChange={onSortChange} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await user.keyboard(' ');

      expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });
    });

    it('uses custom sort function when provided', async () => {
      const user = userEvent.setup();
      const customSortFn = jest.fn((a: User, b: User, direction: 'asc' | 'desc') => {
        const comparison = a.name.localeCompare(b.name);
        return direction === 'asc' ? comparison : -comparison;
      });

      const columnsWithCustomSort: TableColumn<User>[] = [
        { id: 'name', header: 'Name', accessor: 'name', sortable: true, sortFn: customSortFn },
        { id: 'email', header: 'Email', accessor: 'email' },
      ];

      render(<Table columns={columnsWithCustomSort} data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      await user.click(nameHeader);

      expect(customSortFn).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Row Selection - None Mode
  // ===========================================================================

  describe('Selection - None Mode', () => {
    it('does not render selection column when selectionMode is none', () => {
      const { container } = render(
        <Table columns={columns} data={testData} selectionMode="none" />
      );

      expect(container.querySelector('.table-select-cell')).not.toBeInTheDocument();
    });

    it('does not have aria-selected on rows when selectionMode is none', () => {
      render(<Table columns={columns} data={testData} selectionMode="none" />);

      const rows = screen.getAllByRole('row').slice(1); // Skip header
      rows.forEach((row) => {
        expect(row).not.toHaveAttribute('aria-selected');
      });
    });
  });

  // ===========================================================================
  // Row Selection - Single Mode
  // ===========================================================================

  describe('Selection - Single Mode', () => {
    it('renders selection column', () => {
      const { container } = render(
        <Table columns={columns} data={testData} selectionMode="single" rowId="id" />
      );

      expect(container.querySelectorAll('.table-select-cell').length).toBeGreaterThan(0);
    });

    it('selects row when checkbox clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Table columns={columns} data={testData} selectionMode="single" rowId="id" />
      );

      // Find first row checkbox (skip header)
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      await user.click(checkboxes[0]);

      // Row should be selected
      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('calls onSelectionChange when row selected', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      await user.click(checkboxes[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(1); // id of first row
    });

    it('deselects previous row when new row selected', async () => {
      const user = userEvent.setup();

      const ControlledSingle = () => {
        const [selected, setSelected] = useState<RowId | undefined>();
        return (
          <Table
            columns={columns}
            data={testData}
            selectionMode="single"
            rowId="id"
            selectedRows={selected}
            onSelectionChange={setSelected}
          />
        );
      };

      const { container } = render(<ControlledSingle />);

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      await user.click(checkboxes[0]); // Select first
      await user.click(checkboxes[1]); // Select second

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveAttribute('aria-selected', 'false');
      expect(rows[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('supports controlled mode', () => {
      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          selectedRows={2}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveAttribute('aria-selected', 'false');
      expect(rows[1]).toHaveAttribute('aria-selected', 'true'); // id: 2
    });
  });

  // ===========================================================================
  // Row Selection - Multiple Mode
  // ===========================================================================

  describe('Selection - Multiple Mode', () => {
    it('renders select all checkbox in header', () => {
      render(<Table columns={columns} data={testData} selectionMode="multiple" rowId="id" />);

      expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
    });

    it('selects multiple rows', async () => {
      const user = userEvent.setup();

      const ControlledMultiple = () => {
        const [selected, setSelected] = useState<RowId[]>([]);
        return (
          <Table
            columns={columns}
            data={testData}
            selectionMode="multiple"
            rowId="id"
            selectedRows={selected}
            onSelectionChange={setSelected}
          />
        );
      };

      const { container } = render(<ControlledMultiple />);

      // Skip first checkbox (select all)
      const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
      await user.click(checkboxes[0]);
      await user.click(checkboxes[2]);

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');
      expect(rows[1]).toHaveAttribute('aria-selected', 'false');
      expect(rows[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('select all checkbox selects all enabled rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
      await user.click(selectAll);

      expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3, 4]);
    });

    it('select all checkbox deselects all when all are selected', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1, 2, 3, 4]}
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
      await user.click(selectAll);

      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });

    it('shows indeterminate state when some rows selected', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1, 2]}
        />
      );

      const selectAll = container.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
      expect(selectAll.indeterminate).toBe(true);
    });

    it('excludes disabled rows from selection', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          disabledRows={[2]}
          onSelectionChange={onSelectionChange}
        />
      );

      const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' });
      await user.click(selectAll);

      // Should select all except disabled row (id: 2)
      expect(onSelectionChange).toHaveBeenCalledWith([1, 3, 4]);
    });
  });

  // ===========================================================================
  // Row Click
  // ===========================================================================

  describe('Row Click', () => {
    it('calls onRowClick when row clicked', async () => {
      const user = userEvent.setup();
      const onRowClick = jest.fn();

      render(<Table columns={columns} data={testData} onRowClick={onRowClick} />);

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]);

      expect(onRowClick).toHaveBeenCalledWith(testData[0], 0);
    });

    it('selects row when clicked in selection mode', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(1);
    });

    it('supports keyboard selection with Enter', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      rows[0].focus();
      await user.keyboard('{Enter}');

      expect(onSelectionChange).toHaveBeenCalledWith(1);
    });

    it('supports keyboard selection with Space', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      rows[0].focus();
      await user.keyboard(' ');

      expect(onSelectionChange).toHaveBeenCalledWith(1);
    });

    it('does not select disabled rows', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          disabledRows={[1]}
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]); // First row is disabled

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Custom Cell Renderer
  // ===========================================================================

  describe('Custom Cell Renderer', () => {
    it('renders custom cell content', () => {
      const customColumns: TableColumn<User>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name',
          cell: (value) => <strong data-testid="custom-name">{String(value)}</strong>,
        },
        { id: 'email', header: 'Email', accessor: 'email' },
      ];

      render(<Table columns={customColumns} data={testData} />);

      const customNames = screen.getAllByTestId('custom-name');
      expect(customNames).toHaveLength(4);
      expect(customNames[0]).toHaveTextContent('Alice Smith');
    });

    it('passes row data to cell renderer', () => {
      const cellRenderer = jest.fn((_value, row, index) => <span>{`${row.name} - ${index}`}</span>);

      const customColumns: TableColumn<User>[] = [
        { id: 'name', header: 'Name', accessor: 'name', cell: cellRenderer },
      ];

      render(<Table columns={customColumns} data={testData} />);

      expect(cellRenderer).toHaveBeenCalledTimes(4);
      expect(cellRenderer).toHaveBeenCalledWith(
        'Alice Smith',
        expect.objectContaining({ id: 1, name: 'Alice Smith' }),
        0
      );
    });
  });

  // ===========================================================================
  // Row ID
  // ===========================================================================

  describe('Row ID', () => {
    it('uses index as rowId when not specified', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(0); // Index
    });

    it('uses property as rowId when string provided', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]);

      expect(onSelectionChange).toHaveBeenCalledWith(1); // id property
    });

    it('uses function as rowId when provided', async () => {
      const user = userEvent.setup();
      const onSelectionChange = jest.fn();

      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId={(row) => `user-${row.id}`}
          onSelectionChange={onSelectionChange}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      await user.click(rows[0]);

      expect(onSelectionChange).toHaveBeenCalledWith('user-1');
    });
  });

  // ===========================================================================
  // Column Alignment
  // ===========================================================================

  describe('Column Alignment', () => {
    it('applies text alignment to cells', () => {
      const alignedColumns: TableColumn<User>[] = [
        { id: 'name', header: 'Name', accessor: 'name', align: 'left' },
        { id: 'age', header: 'Age', accessor: 'age', align: 'right' },
        { id: 'department', header: 'Dept', accessor: 'department', align: 'center' },
      ];

      const { container } = render(<Table columns={alignedColumns} data={testData} />);

      // Check header alignment
      const headers = container.querySelectorAll('th');
      expect(headers[1]).toHaveClass('text-end'); // age - right
      expect(headers[2]).toHaveClass('text-center'); // department - center

      // Check cell alignment
      const cells = container.querySelectorAll('tbody td');
      expect(cells[1]).toHaveClass('text-end'); // age cell
      expect(cells[2]).toHaveClass('text-center'); // dept cell
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} caption="User List" aria-label="Users table" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no axe violations with selection', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          caption="Selectable User List"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('applies aria-label', () => {
      render(<Table columns={columns} data={testData} aria-label="User data table" />);

      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'User data table');
    });

    it('applies aria-labelledby', () => {
      render(
        <>
          <h2 id="table-title">Users</h2>
          <Table columns={columns} data={testData} aria-labelledby="table-title" />
        </>
      );

      expect(screen.getByRole('table')).toHaveAttribute('aria-labelledby', 'table-title');
    });

    it('applies aria-describedby', () => {
      render(
        <>
          <p id="table-desc">List of all registered users</p>
          <Table columns={columns} data={testData} aria-describedby="table-desc" />
        </>
      );

      expect(screen.getByRole('table')).toHaveAttribute('aria-describedby', 'table-desc');
    });

    it('has scope="col" on header cells', () => {
      const { container } = render(<Table columns={columns} data={testData} />);

      const headers = container.querySelectorAll('th');
      headers.forEach((th) => {
        expect(th).toHaveAttribute('scope', 'col');
      });
    });

    it('applies aria-disabled to disabled rows', () => {
      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          disabledRows={[1]}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).toHaveAttribute('aria-disabled', 'true');
      expect(rows[1]).not.toHaveAttribute('aria-disabled');
    });
  });

  // ===========================================================================
  // Visual State
  // ===========================================================================

  describe('Visual State', () => {
    it('has data-visual-state="none" when nothing selected', () => {
      const { container } = render(
        <Table columns={columns} data={testData} selectionMode="multiple" rowId="id" />
      );

      expect(container.querySelector('table')).toHaveAttribute('data-visual-state', 'none');
    });

    it('has data-visual-state="one" when one row selected', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1]}
        />
      );

      expect(container.querySelector('table')).toHaveAttribute('data-visual-state', 'one');
    });

    it('has data-visual-state="some" when some rows selected', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1, 2]}
        />
      );

      expect(container.querySelector('table')).toHaveAttribute('data-visual-state', 'some');
    });

    it('has data-visual-state="all" when all rows selected', () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1, 2, 3, 4]}
        />
      );

      expect(container.querySelector('table')).toHaveAttribute('data-visual-state', 'all');
    });
  });

  // ===========================================================================
  // Sticky Header
  // ===========================================================================

  describe('Sticky Header', () => {
    it('applies sticky styles to header when enabled', () => {
      const { container } = render(
        <Table columns={columns} data={testData} stickyHeader maxHeight={300} />
      );

      const thead = container.querySelector('thead');
      expect(thead).toHaveStyle({ position: 'sticky', top: '0px' });
    });

    it('applies maxHeight to wrapper', () => {
      const { container } = render(
        <Table columns={columns} data={testData} stickyHeader maxHeight={300} />
      );

      const wrapper = container.querySelector('.table-responsive');
      expect(wrapper).toHaveStyle({ maxHeight: '300px' });
    });
  });

  // ===========================================================================
  // Arrow Key Header Navigation
  // ===========================================================================

  describe('Arrow Key Header Navigation', () => {
    it('moves focus right with ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await user.keyboard('{ArrowRight}');

      const emailHeader = screen.getByRole('columnheader', { name: /Email/ });
      expect(emailHeader).toHaveFocus();
    });

    it('moves focus left with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const emailHeader = screen.getByRole('columnheader', { name: /Email/ });
      emailHeader.focus();
      await user.keyboard('{ArrowLeft}');

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveFocus();
    });

    it('moves focus to first header with Home', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const deptHeader = screen.getByRole('columnheader', { name: /Department/ });
      deptHeader.focus();
      await user.keyboard('{Home}');

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveFocus();
    });

    it('moves focus to last header with End', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await user.keyboard('{End}');

      const deptHeader = screen.getByRole('columnheader', { name: /Department/ });
      expect(deptHeader).toHaveFocus();
    });

    it('applies data-focusable to sortable headers', () => {
      const { container } = render(<Table columns={sortableColumns} data={testData} />);

      const sortableHeaders = container.querySelectorAll('[data-focusable]');
      expect(sortableHeaders.length).toBe(4);
    });

    it('uses roving tabindex on sortable headers', () => {
      const { container } = render(<Table columns={sortableColumns} data={testData} />);

      const headers = container.querySelectorAll('th[data-focusable]');
      // First sortable header should have tabIndex 0, others -1
      expect(headers[0]).toHaveAttribute('tabindex', '0');
      expect(headers[1]).toHaveAttribute('tabindex', '-1');
      expect(headers[2]).toHaveAttribute('tabindex', '-1');
      expect(headers[3]).toHaveAttribute('tabindex', '-1');
    });

    it('does not move past the last header with ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const deptHeader = screen.getByRole('columnheader', { name: /Department/ });
      deptHeader.focus();
      await user.keyboard('{ArrowRight}');

      // Should remain on the same header
      expect(deptHeader).toHaveFocus();
    });

    it('does not move past the first header with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<Table columns={sortableColumns} data={testData} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await user.keyboard('{ArrowLeft}');

      expect(nameHeader).toHaveFocus();
    });
  });

  // ===========================================================================
  // Multi-Column Sorting
  // ===========================================================================

  describe('Multi-Column Sorting', () => {
    it('adds column to multi-sort via Shift+Click', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ControlledMultiSort = () => {
        const [sort, setSort] = useState<SortConfig | SortingState | undefined>();
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ControlledMultiSort />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      const ageHeader = screen.getByRole('columnheader', { name: /Age/ });

      // Plain click on Name — single sort
      await user.click(nameHeader);
      expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'asc' });

      // Shift+click on Age — add to multi-sort
      await user.keyboard('{Shift>}');
      await user.click(ageHeader);
      await user.keyboard('{/Shift}');

      expect(onSortChange).toHaveBeenLastCalledWith([
        { columnId: 'name', direction: 'asc' },
        { columnId: 'age', direction: 'asc' },
      ]);
    });

    it('shows sort priority indicators for multi-sort', () => {
      const multiSortConfig: SortingState = [
        { columnId: 'name', direction: 'asc' },
        { columnId: 'age', direction: 'desc' },
      ];

      const { container } = render(
        <Table columns={sortableColumns} data={testData} sortConfig={multiSortConfig} />
      );

      const priorities = container.querySelectorAll('[data-sort-priority]');
      expect(priorities.length).toBe(2);
      expect(priorities[0]).toHaveAttribute('data-sort-priority', '1');
      expect(priorities[1]).toHaveAttribute('data-sort-priority', '2');
    });

    it('does not show priority for single-column sort', () => {
      const { container } = render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'asc' }}
        />
      );

      const priorities = container.querySelectorAll('[data-sort-priority]');
      expect(priorities.length).toBe(0);
    });

    it('caps multi-sort at maxSortColumns', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ControlledMaxSort = () => {
        const [sort, setSort] = useState<SortConfig | SortingState | undefined>();
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            maxSortColumns={2}
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ControlledMaxSort />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      const emailHeader = screen.getByRole('columnheader', { name: /Email/ });
      const ageHeader = screen.getByRole('columnheader', { name: /Age/ });

      // Click Name
      await user.click(nameHeader);

      // Shift+click Email
      await user.keyboard('{Shift>}');
      await user.click(emailHeader);
      await user.keyboard('{/Shift}');

      // At max 2, now Shift+click Age should replace the last
      await user.keyboard('{Shift>}');
      await user.click(ageHeader);
      await user.keyboard('{/Shift}');

      expect(onSortChange).toHaveBeenLastCalledWith([
        { columnId: 'name', direction: 'asc' },
        { columnId: 'age', direction: 'asc' },
      ]);
    });

    it('sorts data by multiple columns', () => {
      const multiData: User[] = [
        { id: 1, name: 'Alice', email: 'a@b.com', age: 30, department: 'Eng' },
        { id: 2, name: 'Alice', email: 'a2@b.com', age: 25, department: 'Mkt' },
        { id: 3, name: 'Bob', email: 'b@b.com', age: 35, department: 'Sales' },
      ];

      const multiSortConfig: SortingState = [
        { columnId: 'name', direction: 'asc' },
        { columnId: 'age', direction: 'asc' },
      ];

      render(
        <Table columns={sortableColumns} data={multiData} sortConfig={multiSortConfig} />
      );

      const rows = screen.getAllByRole('row').slice(1);
      // Alice age 25 should come before Alice age 30
      expect(within(rows[0]).getAllByRole('cell')[2]).toHaveTextContent('25');
      expect(within(rows[1]).getAllByRole('cell')[2]).toHaveTextContent('30');
      expect(within(rows[2]).getAllByRole('cell')[0]).toHaveTextContent('Bob');
    });

    it('toggles direction on Shift+Click of already sorted column', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ControlledToggle = () => {
        const [sort, setSort] = useState<SortConfig | SortingState | undefined>([
          { columnId: 'name', direction: 'asc' },
          { columnId: 'age', direction: 'asc' },
        ]);
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ControlledToggle />);

      const ageHeader = screen.getByRole('columnheader', { name: /Age/ });

      // Shift+click Age to toggle from asc to desc
      await user.keyboard('{Shift>}');
      await user.click(ageHeader);
      await user.keyboard('{/Shift}');

      expect(onSortChange).toHaveBeenLastCalledWith([
        { columnId: 'name', direction: 'asc' },
        { columnId: 'age', direction: 'desc' },
      ]);
    });

    it('removes column from multi-sort on Shift+Click of desc column', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ControlledRemove = () => {
        const [sort, setSort] = useState<SortConfig | SortingState | undefined>([
          { columnId: 'name', direction: 'asc' },
          { columnId: 'age', direction: 'desc' },
        ]);
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ControlledRemove />);

      const ageHeader = screen.getByRole('columnheader', { name: /Age/ });

      // Shift+click Age (desc) to remove it
      await user.keyboard('{Shift>}');
      await user.click(ageHeader);
      await user.keyboard('{/Shift}');

      expect(onSortChange).toHaveBeenLastCalledWith([
        { columnId: 'name', direction: 'asc' },
      ]);
    });
  });

  // ===========================================================================
  // Manual Sorting
  // ===========================================================================

  describe('Manual Sorting', () => {
    it('does not sort data when manualSorting is true', async () => {
      const user = userEvent.setup();
      const onSortChange = jest.fn();

      const ManualSort = () => {
        const [sort, setSort] = useState<SortConfig | SortingState | undefined>();
        return (
          <Table
            columns={sortableColumns}
            data={testData}
            sortConfig={sort}
            manualSorting
            onSortChange={(config) => {
              setSort(config);
              onSortChange(config);
            }}
          />
        );
      };

      render(<ManualSort />);

      // Click Name to sort ascending
      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      await user.click(nameHeader);

      expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'asc' });

      // Data order should NOT change (still original order)
      const rows = screen.getAllByRole('row').slice(1);
      const firstCell = within(rows[0]).getAllByRole('cell')[0];
      expect(firstCell).toHaveTextContent('Alice Smith');

      // Verify original order is preserved (Bob is second)
      const secondCell = within(rows[1]).getAllByRole('cell')[0];
      expect(secondCell).toHaveTextContent('Bob Johnson');
    });

    it('fires onSortChange but preserves data order with manualSorting', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'desc' }}
          manualSorting
        />
      );

      // With desc sort and manual sorting, data should stay in original order
      const rows = screen.getAllByRole('row').slice(1);
      expect(within(rows[0]).getAllByRole('cell')[0]).toHaveTextContent('Alice Smith');
      expect(within(rows[1]).getAllByRole('cell')[0]).toHaveTextContent('Bob Johnson');
      expect(within(rows[2]).getAllByRole('cell')[0]).toHaveTextContent('Charlie Brown');
    });
  });

  // ===========================================================================
  // useControllableState Adoption
  // ===========================================================================

  describe('useControllableState Sorting', () => {
    it('works in uncontrolled mode with defaultSortConfig', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          defaultSortConfig={{ columnId: 'name', direction: 'asc' }}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

      // Verify data is sorted
      const rows = screen.getAllByRole('row').slice(1);
      expect(within(rows[0]).getAllByRole('cell')[0]).toHaveTextContent('Alice Smith');
    });

    it('works in controlled mode', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'desc' }}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

      // Verify data is sorted descending
      const rows = screen.getAllByRole('row').slice(1);
      expect(within(rows[0]).getAllByRole('cell')[0]).toHaveTextContent('Diana Ross');
    });

    it('accepts SortingState (array) as sortConfig', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={[{ columnId: 'name', direction: 'asc' }]}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });

  // ===========================================================================
  // Pagination
  // ===========================================================================
  describe('Pagination', () => {
    const manyRows = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Row ${i + 1}`,
      email: `row${i + 1}@example.com`,
      age: 20 + (i % 30),
      department: 'Dept',
    }));
    const paginationColumns: TableColumn<{
      id: number;
      name: string;
      email: string;
      age: number;
      department: string;
    }>[] = [
      { id: 'id', header: 'ID', accessor: 'id' },
      { id: 'name', header: 'Name', accessor: 'name' },
      { id: 'age', header: 'Age', accessor: 'age' },
    ];

    it('renders pagination controls when pagination is provided', () => {
      render(
        <Table
          data={manyRows}
          columns={paginationColumns}
          defaultPagination={{ page: 0, pageSize: 10 }}
          aria-label="Paginated"
        />
      );
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('shows correct page of data', () => {
      render(
        <Table
          data={manyRows}
          columns={paginationColumns}
          defaultPagination={{ page: 0, pageSize: 10 }}
          aria-label="Paginated"
        />
      );
      expect(screen.getByText('Row 1')).toBeInTheDocument();
      expect(screen.queryByText('Row 11')).not.toBeInTheDocument();
    });

    it('calls onPaginationChange when page changes', async () => {
      const handleChange = jest.fn();
      render(
        <Table
          data={manyRows}
          columns={paginationColumns}
          pagination={{ page: 0, pageSize: 10 }}
          onPaginationChange={handleChange}
          aria-label="Paginated"
        />
      );
      await userEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(handleChange).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Row Expansion
  // ===========================================================================
  describe('Row Expansion', () => {
    it('renders expand toggle buttons when expandable is provided', () => {
      render(
        <Table
          data={testData}
          columns={columns}
          expandable={{ render: (row) => <div>Details for {row.name}</div> }}
          aria-label="Expandable"
        />
      );
      const toggles = screen.getAllByRole('button', { name: /expand/i });
      expect(toggles.length).toBe(testData.length);
    });

    it('expands a row when toggle is clicked', async () => {
      render(
        <Table
          data={testData}
          columns={columns}
          expandable={{
            render: (row) => <div data-testid="expanded">Details for {row.name}</div>,
          }}
          aria-label="Expandable"
        />
      );
      await userEvent.click(screen.getAllByRole('button', { name: /expand/i })[0]);
      expect(screen.getByTestId('expanded')).toBeInTheDocument();
    });

    it('sets aria-expanded on toggle buttons', async () => {
      render(
        <Table
          data={testData}
          columns={columns}
          expandable={{ render: () => <div>Details</div> }}
          aria-label="Expandable"
        />
      );
      const toggle = screen.getAllByRole('button', { name: /expand/i })[0];
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ===========================================================================
  // Column Visibility
  // ===========================================================================
  describe('Column Visibility', () => {
    it('hides columns when columnVisibility is set', () => {
      render(
        <Table
          data={testData}
          columns={columns}
          columnVisibility={{ age: false }}
          aria-label="Visibility"
        />
      );
      // The "Age" header should not be present
      const headers = screen.getAllByRole('columnheader');
      const headerTexts = headers.map((h) => h.textContent);
      expect(headerTexts).not.toContain('Age');
    });

    it('shows all columns by default', () => {
      render(<Table data={testData} columns={columns} aria-label="All visible" />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Column Resizing
  // ===========================================================================
  describe('Column Resizing', () => {
    it('renders resize handles for resizable columns', () => {
      const resizableColumns = columns.map((c) => ({ ...c, resizable: true }));
      const { container } = render(
        <Table data={testData} columns={resizableColumns} aria-label="Resizable" />
      );
      const handles = container.querySelectorAll('.table-resize-handle');
      expect(handles.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // Accessibility (jest-axe) — new features
  // ===========================================================================
  describe('Accessibility (jest-axe) — new features', () => {
    it('has no violations with pagination', async () => {
      const manyRows = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Row ${i + 1}`,
        email: `row${i + 1}@example.com`,
        age: 20 + i,
        department: 'Dept',
      }));
      const cols: TableColumn<{
        id: number;
        name: string;
        email: string;
        age: number;
        department: string;
      }>[] = [
        { id: 'id', header: 'ID', accessor: 'id' },
        { id: 'name', header: 'Name', accessor: 'name' },
      ];
      const { container } = render(
        <Table
          data={manyRows}
          columns={cols}
          defaultPagination={{ page: 0, pageSize: 5 }}
          aria-label="Axe pagination"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with expandable rows', async () => {
      const { container } = render(
        <Table
          data={testData}
          columns={columns}
          expandable={{ render: () => <div>Details</div> }}
          aria-label="Axe expandable"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
