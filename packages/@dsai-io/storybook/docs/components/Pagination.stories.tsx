import { Pagination } from '@dsai-io/react';
import { useCallback, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Pagination component for navigating through pages of content.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * **Key Features:**
 * - Controlled and uncontrolled modes
 * - Smart boundary/sibling algorithm for ellipsis rendering
 * - First/Last/Previous/Next navigation buttons
 * - Multiple sizes (sm, md, lg)
 * - Alignment options (start, center, end)
 *
 * **Performance Optimizations:**
 * - React.memo wrapper prevents unnecessary re-renders
 * - Memoized pagination item components
 * - useCallback for event handlers
 * - Efficient pagination calculation algorithm
 *
 * **Accessibility:**
 * - WCAG 2.2 AA compliant
 * - Semantic navigation landmark
 * - Proper aria-label on all buttons
 * - aria-current="page" on active page
 * - Disabled items have aria-disabled="true"
 *
 * **Security:**
 * - All custom content is safely escaped
 * - No dangerouslySetInnerHTML usage
 * - Safe handling of edge cases
 */
const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An accessible pagination component for page navigation. ' +
          'Supports controlled/uncontrolled modes, boundary/sibling counts for smart ellipsis, ' +
          'multiple sizes, alignment options, and WCAG 2.2 AA compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Total number of pages',
      table: {
        type: { summary: 'number' },
      },
    },
    page: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Current page (controlled mode)',
      table: {
        type: { summary: 'number' },
      },
    },
    defaultPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'Initial page (uncontrolled mode)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    alignment: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Horizontal alignment',
      table: {
        type: { summary: "'start' | 'center' | 'end'" },
        defaultValue: { summary: "'start'" },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable all pagination items',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    boundaryCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of pages at start and end boundaries',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of sibling pages around current page',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    showFirstButton: {
      control: 'boolean',
      description: 'Show first page button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showLastButton: {
      control: 'boolean',
      description: 'Show last page button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hidePrevButton: {
      control: 'boolean',
      description: 'Hide previous button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideNextButton: {
      control: 'boolean',
      description: 'Hide next button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default pagination with 10 pages
 */
export const Default: Story = {
  args: {
    count: 10,
  },
};

/**
 * Pagination starting on page 5
 */
export const WithDefaultPage: Story = {
  args: {
    count: 10,
    defaultPage: 5,
  },
};

// =============================================================================
// Size Variants
// =============================================================================

/**
 * Small size pagination
 */
export const Small: Story = {
  args: {
    count: 10,
    size: 'sm',
  },
};

/**
 * Large size pagination
 */
export const Large: Story = {
  args: {
    count: 10,
    size: 'lg',
  },
};

/**
 * All sizes displayed together for comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div>
        <p className="text-muted mb-2">Small</p>
        <Pagination count={5} size="sm" aria-label="Small size pagination" />
      </div>
      <div>
        <p className="text-muted mb-2">Medium (default)</p>
        <Pagination count={5} size="md" aria-label="Medium size pagination" />
      </div>
      <div>
        <p className="text-muted mb-2">Large</p>
        <Pagination count={5} size="lg" aria-label="Large size pagination" />
      </div>
    </div>
  ),
};

// =============================================================================
// Alignment
// =============================================================================

/**
 * Pagination aligned to start (default)
 */
export const AlignStart: Story = {
  args: {
    count: 5,
    alignment: 'start',
  },
};

/**
 * Pagination aligned to center
 */
export const AlignCenter: Story = {
  args: {
    count: 5,
    alignment: 'center',
  },
};

/**
 * Pagination aligned to end
 */
export const AlignEnd: Story = {
  args: {
    count: 5,
    alignment: 'end',
  },
};

/**
 * All alignments displayed together
 */
export const AlignmentComparison: Story = {
  render: () => (
    <div className="d-flex flex-column gap-4">
      <div className="border p-3">
        <p className="text-muted mb-2">Start</p>
        <Pagination count={5} alignment="start" aria-label="Start aligned pagination" />
      </div>
      <div className="border p-3">
        <p className="text-muted mb-2">Center</p>
        <Pagination count={5} alignment="center" aria-label="Center aligned pagination" />
      </div>
      <div className="border p-3">
        <p className="text-muted mb-2">End</p>
        <Pagination count={5} alignment="end" aria-label="End aligned pagination" />
      </div>
    </div>
  ),
};

// =============================================================================
// Navigation Buttons
// =============================================================================

/**
 * With first and last buttons
 */
export const WithFirstLast: Story = {
  args: {
    count: 10,
    defaultPage: 5,
    showFirstButton: true,
    showLastButton: true,
  },
};

/**
 * Without previous and next buttons
 */
export const WithoutPrevNext: Story = {
  args: {
    count: 5,
    hidePrevButton: true,
    hideNextButton: true,
  },
};

/**
 * All navigation buttons
 */
export const AllNavigationButtons: Story = {
  args: {
    count: 10,
    defaultPage: 5,
    showFirstButton: true,
    showLastButton: true,
  },
};

// =============================================================================
// Boundary and Sibling Counts
// =============================================================================

/**
 * Default boundary (1) and sibling (1) counts
 */
export const DefaultBoundarySibling: Story = {
  args: {
    count: 20,
    defaultPage: 10,
  },
};

/**
 * Higher boundary count (2) - shows more pages at start and end
 */
export const HigherBoundaryCount: Story = {
  args: {
    count: 20,
    defaultPage: 10,
    boundaryCount: 2,
  },
};

/**
 * Higher sibling count (2) - shows more pages around current
 */
export const HigherSiblingCount: Story = {
  args: {
    count: 20,
    defaultPage: 10,
    siblingCount: 2,
  },
};

/**
 * No boundaries (0) - only shows ellipsis and current range
 */
export const NoBoundaries: Story = {
  args: {
    count: 20,
    defaultPage: 10,
    boundaryCount: 0,
  },
};

// =============================================================================
// Disabled State
// =============================================================================

/**
 * All pagination items disabled
 */
export const Disabled: Story = {
  args: {
    count: 10,
    defaultPage: 5,
    disabled: true,
  },
};

// =============================================================================
// Controlled Mode
// =============================================================================

/**
 * Interactive controlled pagination example
 */
export const Controlled: Story = {
  render: function ControlledPagination() {
    const [page, setPage] = useState(1);

    const handleChange = useCallback((newPage: number) => {
      setPage(newPage);
    }, []);

    return (
      <div>
        <p className="mb-3">
          Current page: <strong>{page}</strong>
        </p>
        <Pagination count={10} page={page} onChange={handleChange} showFirstButton showLastButton />
      </div>
    );
  },
};

// =============================================================================
// Custom Content
// =============================================================================

/**
 * With custom navigation button content
 */
export const CustomContent: Story = {
  args: {
    count: 10,
    defaultPage: 5,
    showFirstButton: true,
    showLastButton: true,
    previousContent: '←',
    nextContent: '→',
    firstContent: '⏮',
    lastContent: '⏭',
  },
};

/**
 * With text navigation buttons
 */
export const TextNavigation: Story = {
  args: {
    count: 10,
    defaultPage: 5,
    previousContent: 'Prev',
    nextContent: 'Next',
  },
};

// =============================================================================
// Edge Cases
// =============================================================================

/**
 * Single page - minimal pagination
 */
export const SinglePage: Story = {
  args: {
    count: 1,
  },
};

/**
 * Two pages
 */
export const TwoPages: Story = {
  args: {
    count: 2,
  },
};

/**
 * Many pages with ellipsis
 */
export const ManyPages: Story = {
  args: {
    count: 100,
    defaultPage: 50,
    showFirstButton: true,
    showLastButton: true,
  },
};

// =============================================================================
// Real-World Examples
// =============================================================================

/**
 * Data table pagination example
 */
export const DataTableExample: Story = {
  render: function DataTablePagination() {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = 150;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, totalItems);

    return (
      <div className="border p-3 rounded">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">
            Showing {startItem}-{endItem} of {totalItems} items
          </span>
          <span className="text-muted">{itemsPerPage} items per page</span>
        </div>
        <table className="table table-striped mb-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.min(itemsPerPage, totalItems - startItem + 1) }, (_, i) => {
              const itemNumber = startItem + i;
              return (
                <tr key={itemNumber}>
                  <td>{itemNumber}</td>
                  <td>Item {itemNumber}</td>
                  <td>
                    <span className="badge bg-success">Active</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={setPage}
            showFirstButton
            showLastButton
            alignment="center"
          />
        </div>
      </div>
    );
  },
};

/**
 * Search results pagination
 */
export const SearchResultsExample: Story = {
  render: function SearchResultsPagination() {
    const [page, setPage] = useState(1);
    const resultsPerPage = 20;
    const totalResults = 1234;
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return (
      <div>
        <p className="text-muted mb-3">
          Showing results {(page - 1) * resultsPerPage + 1}-
          {Math.min(page * resultsPerPage, totalResults)} of {totalResults}
        </p>
        <Pagination
          count={totalPages}
          page={page}
          onChange={setPage}
          aria-label="Search results pagination"
          size="sm"
          alignment="center"
        />
      </div>
    );
  },
};
