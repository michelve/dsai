/**
 * @jest-environment jsdom
 */

/**
 * Table Accessibility Tests
 *
 * WCAG 2.2 AA compliance tests using jest-axe
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Table } from './Table';

import type { TableColumn } from './Table.types';

expect.extend(toHaveNoViolations);

// =============================================================================
// Test Data
// =============================================================================

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const testData: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
];

const columns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'email', header: 'Email', accessor: 'email' },
  { id: 'age', header: 'Age', accessor: 'age' },
];

const sortableColumns: TableColumn<User>[] = [
  { id: 'name', header: 'Name', accessor: 'name', sortable: true },
  { id: 'email', header: 'Email', accessor: 'email', sortable: true },
  { id: 'age', header: 'Age', accessor: 'age', sortable: true },
];

// =============================================================================
// Accessibility Tests
// =============================================================================

describe('Table Accessibility', () => {
  // ===========================================================================
  // axe-core Tests
  // ===========================================================================

  describe('axe-core Compliance', () => {
    it('passes axe for basic table', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} aria-label="User data" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe for table with caption', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} caption="List of users" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe for striped variant', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} variant="striped" aria-label="Striped table" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe for bordered variant', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} variant="bordered" aria-label="Bordered table" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe for empty table', async () => {
      const { container } = render(<Table columns={columns} data={[]} aria-label="Empty table" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with sortable columns', async () => {
      const { container } = render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'asc' }}
          aria-label="Sortable table"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with single selection', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="single"
          rowId="id"
          aria-label="Single selection table"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with multiple selection', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          aria-label="Multiple selection table"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with selected rows', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1, 2]}
          aria-label="Table with selections"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with disabled rows', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          disabledRows={[2]}
          aria-label="Table with disabled rows"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with header color', async () => {
      const { container } = render(
        <Table
          columns={columns}
          data={testData}
          headerColor="dark"
          aria-label="Table with dark header"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe with small size', async () => {
      const { container } = render(
        <Table columns={columns} data={testData} size="sm" aria-label="Compact table" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Semantic Structure Tests
  // ===========================================================================

  describe('Semantic Structure', () => {
    it('uses semantic table element', () => {
      render(<Table columns={columns} data={testData} aria-label="Users" />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('uses thead and tbody', () => {
      const { container } = render(<Table columns={columns} data={testData} aria-label="Users" />);

      expect(container.querySelector('thead')).toBeInTheDocument();
      expect(container.querySelector('tbody')).toBeInTheDocument();
    });

    it('uses th elements for headers with scope="col"', () => {
      const { container } = render(<Table columns={columns} data={testData} aria-label="Users" />);

      const headers = container.querySelectorAll('th');
      expect(headers.length).toBe(3);
      headers.forEach((th) => {
        expect(th).toHaveAttribute('scope', 'col');
      });
    });

    it('uses td elements for data cells', () => {
      const { container } = render(<Table columns={columns} data={testData} aria-label="Users" />);

      const cells = container.querySelectorAll('tbody td');
      expect(cells.length).toBe(9); // 3 columns × 3 rows
    });

    it('uses caption for table description', () => {
      render(<Table columns={columns} data={testData} caption="User information" />);

      expect(screen.getByText('User information')).toBeInTheDocument();
      expect(screen.getByText('User information').tagName).toBe('CAPTION');
    });
  });

  // ===========================================================================
  // ARIA Attributes Tests
  // ===========================================================================

  describe('ARIA Attributes', () => {
    it('supports aria-label', () => {
      render(<Table columns={columns} data={testData} aria-label="User data" />);

      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'User data');
    });

    it('supports aria-labelledby', () => {
      render(
        <>
          <h2 id="table-heading">Users</h2>
          <Table columns={columns} data={testData} aria-labelledby="table-heading" />
        </>
      );

      expect(screen.getByRole('table')).toHaveAttribute('aria-labelledby', 'table-heading');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <p id="table-desc">Showing registered users</p>
          <Table columns={columns} data={testData} aria-describedby="table-desc" />
        </>
      );

      expect(screen.getByRole('table')).toHaveAttribute('aria-describedby', 'table-desc');
    });

    it('applies aria-sort to sorted column', () => {
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

    it('applies aria-sort="descending" for desc direction', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'email', direction: 'desc' }}
        />
      );

      const emailHeader = screen.getByRole('columnheader', { name: /Email/ });
      expect(emailHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('applies aria-sort="none" to unsorted sortable columns', () => {
      render(
        <Table
          columns={sortableColumns}
          data={testData}
          sortConfig={{ columnId: 'name', direction: 'asc' }}
        />
      );

      const emailHeader = screen.getByRole('columnheader', { name: /Email/ });
      expect(emailHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('applies aria-selected to selected rows', () => {
      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          selectedRows={[1]}
        />
      );

      const rows = screen.getAllByRole('row').slice(1); // Skip header
      expect(rows[0]).toHaveAttribute('aria-selected', 'true');
      expect(rows[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('applies aria-disabled to disabled rows', () => {
      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          disabledRows={[2]}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).not.toHaveAttribute('aria-disabled');
      expect(rows[1]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ===========================================================================
  // Keyboard Navigation Tests
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('sortable headers are focusable', () => {
      render(<Table columns={sortableColumns} data={testData} />);

      const headers = screen.getAllByRole('columnheader');
      // Roving tabindex: first sortable header has tabindex="0", others have tabindex="-1"
      // All are still programmatically focusable (have a tabindex attribute)
      headers.forEach((header) => {
        expect(header).toHaveAttribute('tabindex');
      });
      // First sortable header is the active one
      expect(headers[0]).toHaveAttribute('tabindex', '0');
    });

    it('sortable headers respond to keyboard events', async () => {
      const handleSortChange = jest.fn();
      render(<Table columns={sortableColumns} data={testData} onSortChange={handleSortChange} />);

      const nameHeader = screen.getByRole('columnheader', { name: /Name/ });
      nameHeader.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleSortChange).toHaveBeenCalled();
    });

    it('selectable rows are focusable', () => {
      render(<Table columns={columns} data={testData} selectionMode="multiple" rowId="id" />);

      const rows = screen.getAllByRole('row').slice(1);
      rows.forEach((row) => {
        expect(row).toHaveAttribute('tabindex', '0');
      });
    });

    it('disabled rows are not focusable', () => {
      render(
        <Table
          columns={columns}
          data={testData}
          selectionMode="multiple"
          rowId="id"
          disabledRows={[1]}
        />
      );

      const rows = screen.getAllByRole('row').slice(1);
      expect(rows[0]).not.toHaveAttribute('tabindex', '0');
    });

    it('checkboxes have accessible labels', () => {
      render(<Table columns={columns} data={testData} selectionMode="multiple" rowId="id" />);

      expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Select row 1' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Select row 2' })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: 'Select row 3' })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Visual Indicators Tests
  // ===========================================================================

  describe('Visual Indicators', () => {
    it('sort icons are hidden from screen readers', () => {
      const { container } = render(<Table columns={sortableColumns} data={testData} />);

      const sortIcon = container.querySelector('.table-sort-icon');
      expect(sortIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('has data-visual-state attribute', () => {
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
  });
});
