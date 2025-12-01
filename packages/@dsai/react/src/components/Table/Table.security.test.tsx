/**
 * @jest-environment jsdom
 */

/**
 * Table Security Tests
 *
 * Tests for XSS prevention and safe prop handling
 */

import { render, screen } from '@testing-library/react';

import { Table } from './Table';
import type { TableColumn } from './Table.types';

// =============================================================================
// Test Data
// =============================================================================

interface TestRow {
  id: number;
  name: string;
  content: string;
}

// =============================================================================
// Security Tests
// =============================================================================

describe('Table Security', () => {
  // ===========================================================================
  // XSS Prevention in Data
  // ===========================================================================

  describe('XSS Prevention in Data', () => {
    it('escapes script tags in cell values', () => {
      const maliciousData: TestRow[] = [
        { id: 1, name: '<script>alert("xss")</script>', content: 'Normal' },
      ];

      const columns: TableColumn<TestRow>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'content', header: 'Content', accessor: 'content' },
      ];

      const { container } = render(<Table columns={columns} data={maliciousData} />);

      // Should render as text, not execute
      expect(container.innerHTML).not.toContain('<script>');
      expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
    });

    it('escapes HTML entities in cell values', () => {
      const maliciousData: TestRow[] = [
        { id: 1, name: '<img src=x onerror="alert(1)">', content: 'Normal' },
      ];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(<Table columns={columns} data={maliciousData} />);

      // Should not contain img with onerror
      expect(container.querySelector('img[onerror]')).not.toBeInTheDocument();
      expect(screen.getByText('<img src=x onerror="alert(1)">')).toBeInTheDocument();
    });

    it('escapes event handlers in cell values', () => {
      const maliciousData: TestRow[] = [
        { id: 1, name: '<div onmouseover="alert(1)">hover</div>', content: 'Normal' },
      ];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(<Table columns={columns} data={maliciousData} />);

      expect(container.querySelector('[onmouseover]')).not.toBeInTheDocument();
    });

    it('handles javascript: URLs in data safely', () => {
      const maliciousData: TestRow[] = [{ id: 1, name: 'javascript:alert(1)', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(<Table columns={columns} data={maliciousData} />);

      // Should render as text
      expect(screen.getByText('javascript:alert(1)')).toBeInTheDocument();
      // Should not be an href
      expect(container.querySelector('a[href^="javascript:"]')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // XSS Prevention in Headers
  // ===========================================================================

  describe('XSS Prevention in Headers', () => {
    it('escapes script tags in header strings', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [
        { id: 'name', header: '<script>alert("xss")</script>', accessor: 'name' },
      ];

      const { container } = render(<Table columns={columns} data={data} />);

      expect(container.innerHTML).not.toContain('<script>alert');
      // Header should be rendered as text
      expect(screen.getByText('<script>alert("xss")</script>')).toBeInTheDocument();
    });

    it('escapes HTML in header strings', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [
        { id: 'name', header: '<img src=x onerror=alert(1)>', accessor: 'name' },
      ];

      const { container } = render(<Table columns={columns} data={data} />);

      expect(container.querySelector('img[onerror]')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Custom Cell Renderer Security
  // ===========================================================================

  describe('Custom Cell Renderer Security', () => {
    it('cell renderer receives escaped values', () => {
      const maliciousData: TestRow[] = [
        { id: 1, name: '<script>alert(1)</script>', content: 'Normal' },
      ];

      const columns: TableColumn<TestRow>[] = [
        {
          id: 'name',
          header: 'Name',
          accessor: 'name',
          cell: (value) => <span data-testid="custom-cell">{String(value)}</span>,
        },
      ];

      const { container } = render(<Table columns={columns} data={maliciousData} />);

      // Custom cell renders the string as text
      const customCell = screen.getByTestId('custom-cell');
      expect(customCell).toHaveTextContent('<script>alert(1)</script>');
      expect(container.querySelector('script')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Empty Content Security
  // ===========================================================================

  describe('Empty Content Security', () => {
    it('escapes HTML in empty content', () => {
      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(
        <Table columns={columns} data={[]} emptyContent="<script>alert('xss')</script>" />
      );

      expect(container.innerHTML).not.toContain('<script>alert');
      expect(screen.getByText("<script>alert('xss')</script>")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Caption Security
  // ===========================================================================

  describe('Caption Security', () => {
    it('escapes HTML in caption', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(
        <Table columns={columns} data={data} caption="<script>alert('xss')</script>" />
      );

      expect(container.innerHTML).not.toContain('<script>alert');
      const caption = container.querySelector('caption');
      expect(caption?.textContent).toBe("<script>alert('xss')</script>");
    });
  });

  // ===========================================================================
  // Footer Security
  // ===========================================================================

  describe('Footer Security', () => {
    it('escapes HTML in string footer', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      const { container } = render(
        <Table columns={columns} data={data} footer="<script>alert('xss')</script>" />
      );

      expect(container.innerHTML).not.toContain('<script>alert');
      expect(container.querySelector('tfoot')).toHaveTextContent("<script>alert('xss')</script>");
    });
  });

  // ===========================================================================
  // Attribute Safety
  // ===========================================================================

  describe('Attribute Safety', () => {
    it('className does not allow injection', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      // Test that special characters in className are handled safely
      const { container } = render(
        <Table columns={columns} data={data} className={'normal-class" onclick="alert(1)'} />
      );

      // React should properly escape the className
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      // onclick should not be a separate attribute
      expect(table).not.toHaveAttribute('onclick');
    });

    it('id attribute is properly escaped', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: 'Normal' }];

      const columns: TableColumn<TestRow>[] = [{ id: 'name', header: 'Name', accessor: 'name' }];

      // Test that special characters in id are handled safely
      const { container } = render(
        <Table columns={columns} data={data} id={'table-id" onclick="alert(1)'} />
      );

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table).not.toHaveAttribute('onclick');
    });
  });

  // ===========================================================================
  // No dangerouslySetInnerHTML
  // ===========================================================================

  describe('No dangerouslySetInnerHTML', () => {
    it('component does not use dangerouslySetInnerHTML', () => {
      const data: TestRow[] = [{ id: 1, name: 'Alice', content: '<b>Bold</b>' }];

      const columns: TableColumn<TestRow>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'content', header: 'Content', accessor: 'content' },
      ];

      const { container } = render(<Table columns={columns} data={data} />);

      // HTML in data should be escaped as text
      expect(container.querySelector('b')).not.toBeInTheDocument();
      expect(screen.getByText('<b>Bold</b>')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Row ID Safety
  // ===========================================================================

  describe('Row ID Safety', () => {
    it('handles malicious rowId values safely', () => {
      const data = [
        { id: '<script>alert(1)</script>', name: 'Alice' },
        { id: 'normal', name: 'Bob' },
      ];

      const columns: TableColumn<(typeof data)[0]>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
      ];

      const { container } = render(
        <Table columns={columns} data={data} selectionMode="multiple" rowId="id" />
      );

      // Should render without executing script
      expect(container.querySelector('script')).not.toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(3); // Header + 2 data rows
    });
  });
});
