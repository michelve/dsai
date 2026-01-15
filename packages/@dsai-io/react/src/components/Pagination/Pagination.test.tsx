/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Pagination count={10} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders with default aria-label', () => {
      render(<Pagination count={10} />);
      expect(screen.getByRole('navigation').getAttribute('aria-label')).toMatch(
        /^Pagination navigation /
      );
    });

    it('renders with custom aria-label', () => {
      render(<Pagination count={10} aria-label="Search results pages" />);
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Search results pages');
    });

    it('renders pagination list', () => {
      render(<Pagination count={5} />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Pagination count={10} className="custom-class" />);
      expect(screen.getByRole('navigation')).toHaveClass('custom-class');
    });

    it('applies custom style', () => {
      render(<Pagination count={10} style={{ marginTop: '10px' }} />);
      expect(screen.getByRole('navigation')).toHaveStyle({ marginTop: '10px' });
    });

    it('applies id attribute', () => {
      render(<Pagination count={10} id="my-pagination" />);
      expect(screen.getByRole('navigation')).toHaveAttribute('id', 'my-pagination');
    });
  });

  // ===========================================================================
  // Size Variants
  // ===========================================================================

  describe('Size Variants', () => {
    it('renders default (md) size without size class', () => {
      render(<Pagination count={5} />);
      const list = screen.getByRole('list');
      expect(list).toHaveClass('pagination');
      expect(list).not.toHaveClass('pagination-sm');
      expect(list).not.toHaveClass('pagination-lg');
    });

    it('renders small size with pagination-sm class', () => {
      render(<Pagination count={5} size="sm" />);
      expect(screen.getByRole('list')).toHaveClass('pagination-sm');
    });

    it('renders large size with pagination-lg class', () => {
      render(<Pagination count={5} size="lg" />);
      expect(screen.getByRole('list')).toHaveClass('pagination-lg');
    });
  });

  // ===========================================================================
  // Alignment
  // ===========================================================================

  describe('Alignment', () => {
    it('renders with start alignment by default', () => {
      render(<Pagination count={5} />);
      expect(screen.getByRole('list')).toHaveClass('justify-content-start');
    });

    it('renders with center alignment', () => {
      render(<Pagination count={5} alignment="center" />);
      expect(screen.getByRole('list')).toHaveClass('justify-content-center');
    });

    it('renders with end alignment', () => {
      render(<Pagination count={5} alignment="end" />);
      expect(screen.getByRole('list')).toHaveClass('justify-content-end');
    });
  });

  // ===========================================================================
  // Page Items Rendering
  // ===========================================================================

  describe('Page Items Rendering', () => {
    it('renders correct number of page items for small count', () => {
      render(<Pagination count={3} />);
      // Should show: Previous, 1, 2, 3, Next
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders previous and next buttons by default', () => {
      // Start on page 3 so both Previous and Next are enabled (rendered as buttons)
      render(<Pagination count={5} page={3} />);
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('hides previous button when hidePrevButton is true', () => {
      render(<Pagination count={5} hidePrevButton />);
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    });

    it('hides next button when hideNextButton is true', () => {
      render(<Pagination count={5} hideNextButton />);
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
    });

    it('shows first button when showFirstButton is true', () => {
      // Start on page 3 so First button is enabled (rendered as button)
      render(<Pagination count={10} page={3} showFirstButton />);
      expect(screen.getByRole('button', { name: /first/i })).toBeInTheDocument();
    });

    it('shows last button when showLastButton is true', () => {
      render(<Pagination count={10} showLastButton />);
      expect(screen.getByRole('button', { name: /last/i })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Active Page
  // ===========================================================================

  describe('Active Page', () => {
    it('marks first page as active by default', () => {
      render(<Pagination count={5} />);
      const activePage = screen.getByText('1').closest('li');
      expect(activePage).toHaveClass('active');
    });

    it('marks specified page as active (controlled)', () => {
      render(<Pagination count={5} page={3} />);
      const activePage = screen.getByText('3').closest('li');
      expect(activePage).toHaveClass('active');
    });

    it('marks default page as active (uncontrolled)', () => {
      render(<Pagination count={5} defaultPage={2} />);
      const activePage = screen.getByText('2').closest('li');
      expect(activePage).toHaveClass('active');
    });

    it('active page has aria-current="page"', () => {
      render(<Pagination count={5} page={2} />);
      expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page');
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================

  describe('Disabled State', () => {
    it('previous button is disabled on first page', () => {
      render(<Pagination count={5} page={1} />);
      const prevItem = screen.getByLabelText(/previous/i).closest('li');
      expect(prevItem).toHaveClass('disabled');
    });

    it('next button is disabled on last page', () => {
      render(<Pagination count={5} page={5} />);
      const nextItem = screen.getByLabelText(/next/i).closest('li');
      expect(nextItem).toHaveClass('disabled');
    });

    it('first button is disabled on first page', () => {
      render(<Pagination count={5} page={1} showFirstButton />);
      const firstItem = screen.getByLabelText(/first/i).closest('li');
      expect(firstItem).toHaveClass('disabled');
    });

    it('last button is disabled on last page', () => {
      render(<Pagination count={5} page={5} showLastButton />);
      const lastItem = screen.getByLabelText(/last/i).closest('li');
      expect(lastItem).toHaveClass('disabled');
    });

    it('all items are disabled when disabled prop is true', () => {
      render(<Pagination count={5} page={3} disabled />);
      const items = screen.getAllByRole('listitem');
      items.forEach((item) => {
        // Skip active page which is rendered as span
        if (!item.classList.contains('active')) {
          expect(item).toHaveClass('disabled');
        }
      });
    });
  });

  // ===========================================================================
  // Page Change Events
  // ===========================================================================

  describe('Page Change Events', () => {
    it('calls onChange when page button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={1} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /page 3/i }));
      expect(handleChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange when previous button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={3} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /previous/i }));
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it('calls onChange when next button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={3} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(handleChange).toHaveBeenCalledWith(4);
    });

    it('calls onChange when first button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={10} page={5} showFirstButton onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /first/i }));
      expect(handleChange).toHaveBeenCalledWith(1);
    });

    it('calls onChange when last button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={10} page={5} showLastButton onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /last/i }));
      expect(handleChange).toHaveBeenCalledWith(10);
    });

    it('does not call onChange when disabled button is clicked', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={1} onChange={handleChange} />);

      // Previous is disabled on page 1
      const prevButton = screen.getByLabelText(/previous/i);
      fireEvent.click(prevButton);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when globally disabled', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={3} disabled onChange={handleChange} />);

      const nextButton = screen.getByLabelText(/next/i);
      fireEvent.click(nextButton);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Controlled vs Uncontrolled
  // ===========================================================================

  describe('Controlled vs Uncontrolled', () => {
    it('controlled: page does not change without external update', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} page={1} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /page 3/i }));

      // onChange called but page still shows 1 as active
      expect(handleChange).toHaveBeenCalledWith(3);
      expect(screen.getByText('1').closest('li')).toHaveClass('active');
    });

    it('uncontrolled: page changes on click', () => {
      const handleChange = jest.fn();
      render(<Pagination count={5} defaultPage={1} onChange={handleChange} />);

      fireEvent.click(screen.getByRole('button', { name: /page 3/i }));

      expect(handleChange).toHaveBeenCalledWith(3);
      expect(screen.getByText('3').closest('li')).toHaveClass('active');
    });
  });

  // ===========================================================================
  // Boundary and Sibling Ranges
  // ===========================================================================

  describe('Boundary and Sibling Ranges', () => {
    it('shows ellipsis for large page counts', () => {
      render(<Pagination count={20} page={10} />);
      const ellipses = screen.getAllByText('…');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('respects boundaryCount setting', () => {
      render(<Pagination count={20} page={10} boundaryCount={2} />);
      // Should show pages 1, 2 at start
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      // Should show pages 19, 20 at end
      expect(screen.getByText('19')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('respects siblingCount setting', () => {
      render(<Pagination count={20} page={10} siblingCount={2} />);
      // Should show pages 8, 9, 10, 11, 12 around current
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('ellipsis is not clickable', () => {
      render(<Pagination count={20} page={10} />);
      const ellipses = screen.getAllByText('…');
      expect(ellipses.length).toBeGreaterThan(0);
      const ellipsis = ellipses[0] as HTMLElement;
      expect(ellipsis.closest('button')).toBeNull();
    });
  });

  // ===========================================================================
  // Custom Labels and Content
  // ===========================================================================

  describe('Custom Labels and Content', () => {
    it('uses custom previousLabel', () => {
      render(<Pagination count={5} page={3} previousLabel="Back" />);
      expect(screen.getByLabelText('Back')).toBeInTheDocument();
    });

    it('uses custom nextLabel', () => {
      render(<Pagination count={5} page={3} nextLabel="Forward" />);
      expect(screen.getByLabelText('Forward')).toBeInTheDocument();
    });

    it('uses custom firstLabel', () => {
      render(<Pagination count={5} page={3} showFirstButton firstLabel="Start" />);
      expect(screen.getByLabelText('Start')).toBeInTheDocument();
    });

    it('uses custom lastLabel', () => {
      render(<Pagination count={5} page={3} showLastButton lastLabel="End" />);
      expect(screen.getByLabelText('End')).toBeInTheDocument();
    });

    it('uses custom getPageAriaLabel', () => {
      render(<Pagination count={5} page={1} getPageAriaLabel={(p) => `Page number ${p}`} />);
      expect(screen.getByLabelText('Page number 2')).toBeInTheDocument();
    });

    it('uses custom previousContent', () => {
      render(<Pagination count={5} page={3} previousContent="←" />);
      expect(screen.getByText('←')).toBeInTheDocument();
    });

    it('uses custom nextContent', () => {
      render(<Pagination count={5} page={3} nextContent="→" />);
      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Edge Cases
  // ===========================================================================

  describe('Edge Cases', () => {
    it('handles count of 1', () => {
      render(<Pagination count={1} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('handles count of 0', () => {
      render(<Pagination count={0} />);
      // Should not crash, may render empty or minimal
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('clamps page to valid range (too low)', () => {
      render(<Pagination count={5} page={-5} />);
      // Should clamp to 1
      expect(screen.getByText('1').closest('li')).toHaveClass('active');
    });

    it('clamps page to valid range (too high)', () => {
      render(<Pagination count={5} page={100} />);
      // Should clamp to 5
      expect(screen.getByText('5').closest('li')).toHaveClass('active');
    });
  });
});
