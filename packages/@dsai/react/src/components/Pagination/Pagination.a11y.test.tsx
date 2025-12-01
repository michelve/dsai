/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Pagination } from './Pagination';

expect.extend(toHaveNoViolations);

describe('Pagination Accessibility', () => {
  // ===========================================================================
  // Basic Accessibility
  // ===========================================================================

  describe('Basic Accessibility', () => {
    it('should have no a11y violations in default state', async () => {
      const { container } = render(<Pagination count={10} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with custom aria-label', async () => {
      const { container } = render(
        <Pagination count={10} aria-label="Search results pagination" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations on middle page', async () => {
      const { container } = render(<Pagination count={10} page={5} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations on last page', async () => {
      const { container } = render(<Pagination count={10} page={10} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Size Variants Accessibility
  // ===========================================================================

  describe('Size Variants Accessibility', () => {
    it('should have no a11y violations with small size', async () => {
      const { container } = render(<Pagination count={5} size="sm" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with large size', async () => {
      const { container } = render(<Pagination count={5} size="lg" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Disabled State Accessibility
  // ===========================================================================

  describe('Disabled State Accessibility', () => {
    it('should have no a11y violations when fully disabled', async () => {
      const { container } = render(<Pagination count={10} disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations when disabled on first page', async () => {
      const { container } = render(<Pagination count={10} page={1} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations when disabled on last page', async () => {
      const { container } = render(<Pagination count={10} page={10} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Navigation Buttons Accessibility
  // ===========================================================================

  describe('Navigation Buttons Accessibility', () => {
    it('should have no a11y violations with all navigation buttons', async () => {
      const { container } = render(
        <Pagination count={10} page={5} showFirstButton showLastButton />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with hidden prev/next buttons', async () => {
      const { container } = render(
        <Pagination count={10} page={5} hidePrevButton hideNextButton />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Boundary/Sibling Range Accessibility
  // ===========================================================================

  describe('Boundary/Sibling Range Accessibility', () => {
    it('should have no a11y violations with ellipsis', async () => {
      const { container } = render(
        <Pagination count={20} page={10} boundaryCount={1} siblingCount={1} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with large boundary count', async () => {
      const { container } = render(
        <Pagination count={20} page={10} boundaryCount={3} siblingCount={2} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Custom Labels Accessibility
  // ===========================================================================

  describe('Custom Labels Accessibility', () => {
    it('should have no a11y violations with custom navigation labels', async () => {
      const { container } = render(
        <Pagination
          count={10}
          page={5}
          previousLabel="Go back"
          nextLabel="Go forward"
          showFirstButton
          showLastButton
          firstLabel="Jump to start"
          lastLabel="Jump to end"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with custom page aria label function', async () => {
      const { container } = render(
        <Pagination
          count={10}
          page={5}
          getPageAriaLabel={(page) => `Navigate to page ${page} of 10`}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Alignment Accessibility
  // ===========================================================================

  describe('Alignment Accessibility', () => {
    it('should have no a11y violations with center alignment', async () => {
      const { container } = render(<Pagination count={10} alignment="center" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with end alignment', async () => {
      const { container } = render(<Pagination count={10} alignment="end" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Edge Cases Accessibility
  // ===========================================================================

  describe('Edge Cases Accessibility', () => {
    it('should have no a11y violations with single page', async () => {
      const { container } = render(<Pagination count={1} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with zero pages', async () => {
      const { container } = render(<Pagination count={0} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no a11y violations with two pages', async () => {
      const { container } = render(<Pagination count={2} page={2} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
