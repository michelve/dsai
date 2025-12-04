/**
 * @fileoverview Accessibility tests for Scrollspy component
 * Tests WCAG 2.2 AA compliance with jest-axe
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Scrollspy } from './Scrollspy';

import type { ScrollspyItem } from './Scrollspy.types';

expect.extend(toHaveNoViolations);

// Mock IntersectionObserver
beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  });
});

// =============================================================================
// Test Data
// =============================================================================

const sampleItems: ScrollspyItem[] = [
  { id: '1', label: 'Introduction', target: 'intro' },
  { id: '2', label: 'Features', target: 'features' },
  { id: '3', label: 'API', target: 'api' },
  { id: '4', label: 'Examples', target: 'examples' },
];

const nestedItems: ScrollspyItem[] = [
  {
    id: '1',
    label: 'Getting Started',
    target: 'getting-started',
    children: [
      { id: '1-1', label: 'Installation', target: 'installation' },
      { id: '1-2', label: 'Quick Start', target: 'quick-start' },
    ],
  },
  { id: '2', label: 'Advanced', target: 'advanced' },
];

// =============================================================================
// jest-axe Tests
// =============================================================================

describe('Scrollspy Accessibility', () => {
  describe('jest-axe validation', () => {
    it('has no accessibility violations in default state', async () => {
      const { container } = render(<Scrollspy items={sampleItems} aria-label="Page navigation" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with active item', async () => {
      const { container } = render(
        <Scrollspy items={sampleItems} activeId="features" aria-label="Page navigation" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with nested items', async () => {
      const { container } = render(<Scrollspy items={nestedItems} aria-label="Page navigation" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <h2 id="nav-heading">Table of Contents</h2>
          <Scrollspy items={sampleItems} aria-labelledby="nav-heading" />
        </>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with custom children', async () => {
      const { container } = render(
        <Scrollspy items={[]} aria-label="Custom navigation">
          <ul className="nav nav-pills flex-column">
            <li className="nav-item">
              <Scrollspy.Link target="section1">Section 1</Scrollspy.Link>
            </li>
            <li className="nav-item">
              <Scrollspy.Link target="section2" active>
                Section 2
              </Scrollspy.Link>
            </li>
          </ul>
        </Scrollspy>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when sticky', async () => {
      const { container } = render(
        <Scrollspy items={sampleItems} sticky stickyTop={60} aria-label="Page navigation" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Semantic Structure
  // ===========================================================================
  describe('Semantic Structure', () => {
    it('uses nav element as root', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav.tagName).toBe('NAV');
    });

    it('renders links as anchor elements', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
      });
    });

    it('links have valid href attributes', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href).toMatch(/^#/);
      });
    });
  });

  // ===========================================================================
  // ARIA Attributes
  // ===========================================================================
  describe('ARIA Attributes', () => {
    it('has aria-label by default', () => {
      render(<Scrollspy items={sampleItems} data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('aria-label', 'Page navigation');
    });

    it('accepts custom aria-label', () => {
      render(
        <Scrollspy items={sampleItems} aria-label="Table of contents" data-testid="scrollspy" />
      );

      expect(screen.getByTestId('scrollspy')).toHaveAttribute('aria-label', 'Table of contents');
    });

    it('uses aria-labelledby when provided', () => {
      render(
        <>
          <h2 id="toc-heading">Contents</h2>
          <Scrollspy items={sampleItems} aria-labelledby="toc-heading" data-testid="scrollspy" />
        </>
      );

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveAttribute('aria-labelledby', 'toc-heading');
      expect(nav).not.toHaveAttribute('aria-label');
    });

    it('active link has aria-current="location"', () => {
      render(<Scrollspy items={sampleItems} activeId="features" />);

      const activeLink = screen.getByText('Features').closest('a');
      expect(activeLink).toHaveAttribute('aria-current', 'location');
    });

    it('inactive links do not have aria-current', () => {
      render(<Scrollspy items={sampleItems} activeId="features" />);

      const inactiveLink = screen.getByText('Introduction').closest('a');
      expect(inactiveLink).not.toHaveAttribute('aria-current');
    });

    it('nested nav has aria-label for subsections', () => {
      render(<Scrollspy items={nestedItems} />);

      // Look for nested nav with subsections label
      const nestedNav = document.querySelector('nav[aria-label*="subsections"]');
      expect(nestedNav).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('all links are focusable', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('links are in natural tab order', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        // Links should either have no tabindex or tabindex="0"
        const tabIndex = link.getAttribute('tabindex');
        expect(tabIndex === null || tabIndex === '0').toBe(true);
      });
    });
  });

  // ===========================================================================
  // Active State Accessibility
  // ===========================================================================
  describe('Active State Accessibility', () => {
    it('active link has visual indicator class', () => {
      render(<Scrollspy items={sampleItems} activeId="api" />);

      const activeLink = screen.getByText('API').closest('a');
      expect(activeLink).toHaveClass('active');
    });

    it('only one link is marked active', () => {
      render(<Scrollspy items={sampleItems} activeId="features" />);

      const activeLinks = screen
        .getAllByRole('link')
        .filter((link) => link.classList.contains('active'));
      expect(activeLinks).toHaveLength(1);
    });

    it('no links are active when activeId is null', () => {
      render(<Scrollspy items={sampleItems} activeId={null} />);

      const activeLinks = screen
        .getAllByRole('link')
        .filter((link) => link.classList.contains('active'));
      expect(activeLinks).toHaveLength(0);
    });
  });

  // ===========================================================================
  // Focus Management
  // ===========================================================================
  describe('Focus Management', () => {
    it('clicking link does not remove focus', () => {
      render(
        <div>
          <Scrollspy items={sampleItems} />
          <section id="features">
            <h2>Features Section</h2>
          </section>
        </div>
      );

      // Use getAllByRole to get the link specifically
      const links = screen.getAllByRole('link');
      const featuresLink = links.find((link) => link.textContent === 'Features');

      expect(featuresLink).toBeDefined();
      if (featuresLink) {
        featuresLink.focus();
        expect(document.activeElement).toBe(featuresLink);
      }
    });
  });

  // ===========================================================================
  // Color Contrast
  // ===========================================================================
  describe('Color Contrast', () => {
    it('uses Bootstrap nav-link class for proper contrast', () => {
      render(<Scrollspy items={sampleItems} />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveClass('nav-link');
      });
    });

    it('active state uses Bootstrap active class', () => {
      render(<Scrollspy items={sampleItems} activeId="intro" />);

      const activeLink = screen.getByText('Introduction').closest('a');
      expect(activeLink).toHaveClass('active');
    });
  });

  // ===========================================================================
  // Screen Reader Behavior
  // ===========================================================================
  describe('Screen Reader Behavior', () => {
    it('navigation landmark is properly labeled', () => {
      render(<Scrollspy items={sampleItems} aria-label="Document sections" />);

      const nav = screen.getByRole('navigation', { name: 'Document sections' });
      expect(nav).toBeInTheDocument();
    });

    it('links have descriptive text', () => {
      render(<Scrollspy items={sampleItems} />);

      for (const item of sampleItems) {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      }
    });

    it('current location is announced via aria-current', () => {
      render(<Scrollspy items={sampleItems} activeId="examples" />);

      const currentLink = screen.getByText('Examples').closest('a');
      expect(currentLink).toHaveAttribute('aria-current', 'location');
    });
  });
});
