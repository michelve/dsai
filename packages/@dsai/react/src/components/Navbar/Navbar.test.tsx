/**
 * Navbar Component Tests
 *
 * Comprehensive unit tests for the Navbar component covering:
 * - Rendering and structure
 * - Controlled and uncontrolled modes
 * - Collapse/expand behavior
 * - Keyboard interactions
 * - Event callbacks
 * - Visual states and CSS classes
 * - All subcomponents (Brand, Toggle, Collapse, Nav, Item, Link, Text)
 */

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import { Navbar } from './Navbar';

// =============================================================================
// Test Setup
// =============================================================================

const renderNavbar = (
  props: Partial<React.ComponentProps<typeof Navbar>> = {},
  content?: React.ReactNode
) => {
  return render(
    <Navbar {...props}>
      {content ?? (
        <>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" active>
                  Home
                </Navbar.Link>
              </Navbar.Item>
              <Navbar.Item>
                <Navbar.Link href="/about">About</Navbar.Link>
              </Navbar.Item>
              <Navbar.Item>
                <Navbar.Link href="/contact" disabled>
                  Contact
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

// =============================================================================
// Navbar Root Tests
// =============================================================================

describe('Navbar', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderNavbar();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders with the navbar class', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.navbar')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderNavbar({ className: 'custom-navbar' });
      expect(container.querySelector('.navbar.custom-navbar')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      renderNavbar({ 'data-testid': 'test-navbar' });
      expect(screen.getByTestId('test-navbar')).toBeInTheDocument();
    });

    it('applies custom id to navbar', () => {
      renderNavbar({ id: 'my-navbar' });
      expect(document.getElementById('my-navbar')).toBeInTheDocument();
    });

    it('forwards ref to nav element', () => {
      const ref = createRef<HTMLElement>();
      render(
        <Navbar ref={ref}>
          <Navbar.Brand>Test</Navbar.Brand>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('NAV');
    });

    it('renders with aria-label for accessibility', () => {
      renderNavbar();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('renders with custom aria-label', () => {
      renderNavbar({ 'aria-label': 'Site navigation' });
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Site navigation');
    });

    it('renders with custom role override', () => {
      const { container } = renderNavbar({ role: 'menubar' });
      const nav = container.querySelector('nav');
      expect(nav).toHaveAttribute('role', 'menubar');
    });

    it('removes role when role is none', () => {
      const { container } = renderNavbar({ role: 'none' });
      const nav = container.querySelector('nav');
      expect(nav).not.toHaveAttribute('role');
    });

    it('renders with horizontal orientation by default', () => {
      renderNavbar();
      // horizontal is default, so no aria-orientation should be present
      expect(screen.getByRole('navigation')).not.toHaveAttribute('aria-orientation');
    });

    it('renders with vertical orientation when specified', () => {
      renderNavbar({ orientation: 'vertical', expanded: true });
      const navList = screen.getByRole('list');
      expect(navList).toHaveAttribute('data-orientation', 'vertical');
    });

    it('renders children inside container', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.container-fluid')).toBeInTheDocument();
      expect(container.querySelector('.navbar-brand')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Expand Breakpoint Tests
  // ===========================================================================

  describe('Expand Breakpoints', () => {
    it('applies navbar-expand-lg class by default', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.navbar-expand-lg')).toBeInTheDocument();
    });

    it('applies navbar-expand-sm for sm breakpoint', () => {
      const { container } = renderNavbar({ expand: 'sm' });
      expect(container.querySelector('.navbar-expand-sm')).toBeInTheDocument();
    });

    it('applies navbar-expand-md for md breakpoint', () => {
      const { container } = renderNavbar({ expand: 'md' });
      expect(container.querySelector('.navbar-expand-md')).toBeInTheDocument();
    });

    it('applies navbar-expand-xl for xl breakpoint', () => {
      const { container } = renderNavbar({ expand: 'xl' });
      expect(container.querySelector('.navbar-expand-xl')).toBeInTheDocument();
    });

    it('applies navbar-expand-xxl for xxl breakpoint', () => {
      const { container } = renderNavbar({ expand: 'xxl' });
      expect(container.querySelector('.navbar-expand-xxl')).toBeInTheDocument();
    });

    it('applies navbar-expand when expand is true', () => {
      const { container } = renderNavbar({ expand: true });
      expect(container.querySelector('.navbar-expand')).toBeInTheDocument();
    });

    it('does not apply expand class when expand is false', () => {
      const { container } = renderNavbar({ expand: false });
      expect(container.querySelector('[class*="navbar-expand"]')).toBeNull();
    });
  });

  // ===========================================================================
  // Variant Tests
  // ===========================================================================

  describe('Variants', () => {
    it('does not apply navbar-dark class for light variant', () => {
      const { container } = renderNavbar({ variant: 'light' });
      expect(container.querySelector('.navbar-dark')).toBeNull();
    });

    it('applies navbar-dark class for dark variant', () => {
      const { container } = renderNavbar({ variant: 'dark' });
      expect(container.querySelector('.navbar-dark')).toBeInTheDocument();
    });

    it('applies data-bs-theme="dark" for dark variant', () => {
      renderNavbar({ variant: 'dark' });
      expect(screen.getByRole('navigation')).toHaveAttribute('data-bs-theme', 'dark');
    });

    it('does not apply data-bs-theme for light variant', () => {
      renderNavbar({ variant: 'light' });
      expect(screen.getByRole('navigation')).not.toHaveAttribute('data-bs-theme');
    });
  });

  // ===========================================================================
  // Background Tests
  // ===========================================================================

  describe('Background', () => {
    it('applies bg-body-tertiary by default', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.bg-body-tertiary')).toBeInTheDocument();
    });

    it('applies bg-primary for primary background', () => {
      const { container } = renderNavbar({ bg: 'primary' });
      expect(container.querySelector('.bg-primary')).toBeInTheDocument();
    });

    it('applies bg-dark for dark background', () => {
      const { container } = renderNavbar({ bg: 'dark' });
      expect(container.querySelector('.bg-dark')).toBeInTheDocument();
    });

    it('applies bg-light for light background', () => {
      const { container } = renderNavbar({ bg: 'light' });
      expect(container.querySelector('.bg-light')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Placement Tests
  // ===========================================================================

  describe('Placement', () => {
    it('does not apply placement class for static (default)', () => {
      const { container } = renderNavbar({ placement: 'static' });
      expect(container.querySelector('.fixed-top')).toBeNull();
      expect(container.querySelector('.fixed-bottom')).toBeNull();
      expect(container.querySelector('.sticky-top')).toBeNull();
    });

    it('applies fixed-top class', () => {
      const { container } = renderNavbar({ placement: 'fixed-top' });
      expect(container.querySelector('.fixed-top')).toBeInTheDocument();
    });

    it('applies fixed-bottom class', () => {
      const { container } = renderNavbar({ placement: 'fixed-bottom' });
      expect(container.querySelector('.fixed-bottom')).toBeInTheDocument();
    });

    it('applies sticky-top class', () => {
      const { container } = renderNavbar({ placement: 'sticky-top' });
      expect(container.querySelector('.sticky-top')).toBeInTheDocument();
    });

    it('applies sticky-bottom class', () => {
      const { container } = renderNavbar({ placement: 'sticky-bottom' });
      expect(container.querySelector('.sticky-bottom')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Container Tests
  // ===========================================================================

  describe('Container', () => {
    it('uses container-fluid by default', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.container-fluid')).toBeInTheDocument();
    });

    it('uses container when fluid is false', () => {
      const { container } = renderNavbar({ fluid: false });
      expect(container.querySelector('.container')).toBeInTheDocument();
      expect(container.querySelector('.container-fluid')).toBeNull();
    });

    it('uses container-sm when container is sm', () => {
      const { container } = renderNavbar({ fluid: false, container: 'sm' });
      expect(container.querySelector('.container-sm')).toBeInTheDocument();
    });

    it('uses container-md when container is md', () => {
      const { container } = renderNavbar({ fluid: false, container: 'md' });
      expect(container.querySelector('.container-md')).toBeInTheDocument();
    });

    it('uses container-lg when container is lg', () => {
      const { container } = renderNavbar({ fluid: false, container: 'lg' });
      expect(container.querySelector('.container-lg')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode Tests
  // ===========================================================================

  describe('Uncontrolled Mode', () => {
    it('starts collapsed by default', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.collapse.show')).toBeNull();
    });

    it('respects defaultExpanded prop', () => {
      const { container } = renderNavbar({ defaultExpanded: true });
      expect(container.querySelector('.collapse.show')).toBeInTheDocument();
    });

    it('toggles on toggle button click', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      await user.click(toggle);

      await waitFor(() => {
        expect(container.querySelector('.collapse.show')).toBeInTheDocument();
      });
    });

    it('collapses when clicking toggle again', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar({ defaultExpanded: true });

      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      await user.click(toggle);

      await waitFor(() => {
        expect(container.querySelector('.collapse.show')).toBeNull();
      });
    });
  });

  // ===========================================================================
  // Controlled Mode Tests
  // ===========================================================================

  describe('Controlled Mode', () => {
    it('respects expanded prop', () => {
      const { container } = renderNavbar({ expanded: true });
      expect(container.querySelector('.collapse.show')).toBeInTheDocument();
    });

    it('respects expanded=false prop', () => {
      const { container } = renderNavbar({ expanded: false });
      expect(container.querySelector('.collapse.show')).toBeNull();
    });

    it('calls onExpandedChange on toggle', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      renderNavbar({ expanded: false, onExpandedChange: handleChange });

      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      await user.click(toggle);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('does not change state without expanded update', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      const { container } = renderNavbar({ expanded: false, onExpandedChange: handleChange });

      const toggle = screen.getByRole('button', { name: /toggle navigation/i });
      await user.click(toggle);

      // Should still be collapsed (controlled)
      expect(container.querySelector('.collapse.show')).toBeNull();
    });

    it('updates when expanded prop changes', () => {
      const { container, rerender } = render(
        <Navbar expanded={false}>
          <Navbar.Toggle />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );

      expect(container.querySelector('.collapse.show')).toBeNull();

      rerender(
        <Navbar expanded={true}>
          <Navbar.Toggle />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );

      expect(container.querySelector('.collapse.show')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Visual State Tests
  // ===========================================================================

  describe('Visual States', () => {
    it('applies data-visual-state collapsed when collapsed', () => {
      renderNavbar({ expanded: false });
      expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'collapsed');
    });

    it('applies data-visual-state expanded when expanded', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'expanded');
    });
  });

  // ===========================================================================
  // Display Names
  // ===========================================================================

  describe('Display Names', () => {
    it('has correct displayName for Navbar', () => {
      expect(Navbar.displayName).toBe('Navbar');
    });

    it('has correct displayName for subcomponents', () => {
      expect(Navbar.Brand.displayName).toBe('Navbar.Brand');
      expect(Navbar.Toggle.displayName).toBe('Navbar.Toggle');
      expect(Navbar.Collapse.displayName).toBe('Navbar.Collapse');
      expect(Navbar.Nav.displayName).toBe('Navbar.Nav');
      expect(Navbar.Item.displayName).toBe('Navbar.Item');
      expect(Navbar.Link.displayName).toBe('Navbar.Link');
      expect(Navbar.Text.displayName).toBe('Navbar.Text');
    });
  });
});

// =============================================================================
// Navbar.Brand Tests
// =============================================================================

describe('Navbar.Brand', () => {
  describe('Rendering', () => {
    it('renders with navbar-brand class', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(document.querySelector('.navbar-brand')).toBeInTheDocument();
    });

    it('renders as anchor when href is provided', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link', { name: 'Brand' })).toBeInTheDocument();
    });

    it('renders as span when no href is provided', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand>Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('renders as button when onClick is provided without href', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Navbar>
          <Navbar.Brand onClick={handleClick}>Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('BUTTON');
      expect(brand).toHaveAttribute('type', 'button');
    });

    it('renders with custom className', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/" className="custom-brand">
            Brand
          </Navbar.Brand>
        </Navbar>
      );
      expect(document.querySelector('.navbar-brand.custom-brand')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/" data-testid="brand-test">
            Brand
          </Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByTestId('brand-test')).toBeInTheDocument();
    });

    it('forwards ref to anchor element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Brand ref={ref} href="/">
            Brand
          </Navbar.Brand>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it('forwards ref to button element when onClick', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Brand ref={ref} onClick={() => {}}>
            Brand
          </Navbar.Brand>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('forwards ref to span element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Brand ref={ref}>Brand</Navbar.Brand>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Click Handling', () => {
    it('calls onClick when brand link is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Navbar>
          <Navbar.Brand href="/" onClick={handleClick}>
            Brand
          </Navbar.Brand>
        </Navbar>
      );

      await user.click(screen.getByRole('link', { name: 'Brand' }));
      expect(handleClick).toHaveBeenCalled();
    });

    it('calls onClick when brand button is clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Navbar>
          <Navbar.Brand onClick={handleClick}>Brand</Navbar.Brand>
        </Navbar>
      );

      await user.click(screen.getByRole('button', { name: 'Brand' }));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('External Links', () => {
    it('adds rel="noopener noreferrer" for target="_blank"', () => {
      render(
        <Navbar>
          <Navbar.Brand href="https://example.com" target="_blank">
            External
          </Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('preserves custom rel attribute', () => {
      render(
        <Navbar>
          <Navbar.Brand href="https://example.com" rel="custom">
            External
          </Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'custom');
    });
  });
});

// =============================================================================
// Navbar.Toggle Tests
// =============================================================================

describe('Navbar.Toggle', () => {
  describe('Rendering', () => {
    it('renders as a button element', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: /toggle navigation/i })).toBeInTheDocument();
    });

    it('renders with navbar-toggler class', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.navbar-toggler')).toBeInTheDocument();
    });

    it('renders default icon when no children', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.navbar-toggler-icon')).toBeInTheDocument();
    });

    it('renders custom children when provided', () => {
      render(
        <Navbar>
          <Navbar.Toggle>
            <span>Custom Icon</span>
          </Navbar.Toggle>
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Custom Icon')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Navbar>
          <Navbar.Toggle className="custom-toggle" />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.navbar-toggler.custom-toggle')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar>
          <Navbar.Toggle data-testid="toggle-test" />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('toggle-test')).toBeInTheDocument();
    });

    it('forwards ref to button element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Toggle ref={ref} />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('has aria-label for accessibility', () => {
      renderNavbar();
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Toggle navigation');
    });

    it('allows custom aria-label', () => {
      render(
        <Navbar>
          <Navbar.Toggle aria-label="Custom toggle" />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Custom toggle');
    });

    it('has aria-expanded=false when collapsed', () => {
      renderNavbar({ expanded: false });
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('has aria-expanded=true when expanded', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('has aria-controls pointing to collapse', () => {
      const { container } = renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle/i });
      const collapseId = toggle.getAttribute('aria-controls');
      expect(collapseId).toBeTruthy();
      expect(container.querySelector(`#${collapseId}`)).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('toggles collapse state on click', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });

      // Initially collapsed
      expect(container.querySelector('.collapse.show')).toBeNull();

      await user.click(toggle);
      await waitFor(() => {
        expect(container.querySelector('.collapse.show')).toBeInTheDocument();
      });
    });

    it('calls custom onClick handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Navbar>
          <Navbar.Toggle onClick={handleClick} />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Keyboard Interactions', () => {
    it('toggles on Enter key', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      toggle.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(container.querySelector('.collapse.show')).toBeInTheDocument();
      });
    });

    it('toggles on Space key', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      toggle.focus();
      await user.keyboard(' ');

      await waitFor(() => {
        expect(container.querySelector('.collapse.show')).toBeInTheDocument();
      });
    });

    it('closes on Escape key and returns focus to toggle', async () => {
      const user = userEvent.setup();
      renderNavbar({ defaultExpanded: true });

      // Verify menu is open
      expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'expanded');

      // Focus on a link inside the navbar first (Escape must be pressed while focus is within navbar)
      const links = within(screen.getByRole('list')).getAllByRole('link');
      links[0]?.focus();

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'collapsed');
      });

      // Focus should return to toggle button
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveFocus();
    });

    it('navigates links with Arrow Down key', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on first link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      firstLink.focus();
      expect(firstLink).toHaveFocus();

      // Press Arrow Down
      await user.keyboard('{ArrowDown}');
      expect(secondLink).toHaveFocus();

      // Press Arrow Down again (wraps to first)
      await user.keyboard('{ArrowDown}');
      expect(firstLink).toHaveFocus();
    });

    it('navigates links with Arrow Up key', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on second link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      secondLink.focus();
      expect(secondLink).toHaveFocus();

      // Press Arrow Up
      await user.keyboard('{ArrowUp}');
      expect(firstLink).toHaveFocus();
    });

    it('navigates to first link with Home key', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on second link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      secondLink.focus();

      // Press Home
      await user.keyboard('{Home}');
      expect(firstLink).toHaveFocus();
    });

    it('navigates to last link with End key', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on first link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      firstLink.focus();

      // Press End
      await user.keyboard('{End}');
      // Last non-disabled link
      expect(secondLink).toHaveFocus();
    });

    it('wraps around on Arrow Down at last item', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on last enabled link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      secondLink.focus();

      // Press Arrow Down should wrap to first
      await user.keyboard('{ArrowDown}');
      expect(firstLink).toHaveFocus();
    });

    it('wraps around on Arrow Up at first item', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Focus on first link
      const links = within(screen.getByRole('list')).getAllByRole('link');
      const firstLink = links[0];
      const secondLink = links[1];
      if (!firstLink || !secondLink) {
        throw new Error('Links not found');
      }

      firstLink.focus();

      // Press Arrow Up should wrap to last
      await user.keyboard('{ArrowUp}');
      expect(secondLink).toHaveFocus();
    });
  });
});

// =============================================================================
// Navbar.Collapse Tests
// =============================================================================

describe('Navbar.Collapse', () => {
  describe('Rendering', () => {
    it('renders with collapse and navbar-collapse classes', () => {
      const { container } = renderNavbar();
      expect(container.querySelector('.collapse.navbar-collapse')).toBeInTheDocument();
    });

    it('renders with show class when expanded', () => {
      const { container } = renderNavbar({ expanded: true });
      expect(container.querySelector('.collapse.navbar-collapse.show')).toBeInTheDocument();
    });

    it('renders without show class when collapsed', () => {
      const { container } = renderNavbar({ expanded: false });
      const collapse = container.querySelector('.collapse.navbar-collapse');
      expect(collapse).toBeInTheDocument();
      expect(collapse).not.toHaveClass('show');
    });

    it('renders with custom className', () => {
      render(
        <Navbar>
          <Navbar.Collapse className="custom-collapse">Content</Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.collapse.custom-collapse')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar>
          <Navbar.Collapse data-testid="collapse-test">Content</Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('collapse-test')).toBeInTheDocument();
    });

    it('forwards ref to div element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Collapse ref={ref}>Content</Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('uses generated ID from context', () => {
      const { container } = renderNavbar({ id: 'my-navbar' });
      const collapse = container.querySelector('.navbar-collapse');
      expect(collapse?.id).toContain('navbar-collapse');
    });

    it('allows custom ID override', () => {
      render(
        <Navbar>
          <Navbar.Collapse id="custom-collapse">Content</Navbar.Collapse>
        </Navbar>
      );
      expect(document.getElementById('custom-collapse')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// Navbar.Nav Tests
// =============================================================================

describe('Navbar.Nav', () => {
  describe('Rendering', () => {
    it('renders as ul element', () => {
      renderNavbar();
      expect(document.querySelector('ul.navbar-nav')).toBeInTheDocument();
    });

    it('renders with navbar-nav class', () => {
      renderNavbar();
      expect(document.querySelector('.navbar-nav')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav className="custom-nav">
              <Navbar.Item>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.navbar-nav.custom-nav')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav data-testid="nav-test">
              <Navbar.Item>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('nav-test')).toBeInTheDocument();
    });

    it('forwards ref to ul element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Collapse>
            <Navbar.Nav ref={ref}>
              <Navbar.Item>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLUListElement);
    });
  });

  describe('Scroll Behavior', () => {
    it('applies navbar-nav-scroll class when scroll is true', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav scroll>
              <Navbar.Item>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.navbar-nav-scroll')).toBeInTheDocument();
    });

    it('applies custom scroll height', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav scroll scrollHeight="200px" data-testid="scroll-nav">
              <Navbar.Item>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      const nav = screen.getByTestId('scroll-nav');
      expect(nav).toHaveStyle({ '--bs-scroll-height': '200px' });
    });
  });

  describe('ARIA & Roles', () => {
    it('renders with list role for navigation semantics', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders with horizontal data-orientation by default', () => {
      renderNavbar({ expanded: true });
      const nav = screen.getByRole('list');
      expect(nav).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('renders with vertical data-orientation when navbar orientation is vertical', () => {
      renderNavbar({ expanded: true, orientation: 'vertical' });
      const nav = screen.getByRole('list');
      expect(nav).toHaveAttribute('data-orientation', 'vertical');
    });
  });
});

// =============================================================================
// Navbar.Item Tests
// =============================================================================

describe('Navbar.Item', () => {
  describe('Rendering', () => {
    it('renders as li element', () => {
      renderNavbar();
      expect(document.querySelector('li.nav-item')).toBeInTheDocument();
    });

    it('renders with nav-item class', () => {
      renderNavbar();
      expect(document.querySelector('.nav-item')).toBeInTheDocument();
    });

    it('renders as standard listitem for navigation semantics', () => {
      renderNavbar({ expanded: true });
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
    });

    it('applies dropdown class when dropdown is true', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item dropdown>
                <Navbar.Link href="#">Dropdown</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.nav-item.dropdown')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item className="custom-item">
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.nav-item.custom-item')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item data-testid="item-test">
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('item-test')).toBeInTheDocument();
    });

    it('forwards ref to li element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item ref={ref}>
                <Navbar.Link href="/">Link</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLLIElement);
    });
  });
});

// =============================================================================
// Navbar.Link Tests
// =============================================================================

describe('Navbar.Link', () => {
  describe('Rendering', () => {
    it('renders as anchor element', () => {
      renderNavbar();
      expect(document.querySelector('a.nav-link')).toBeInTheDocument();
    });

    it('renders with nav-link class', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link')).toBeInTheDocument();
    });

    it('renders as links for standard navigation semantics', () => {
      renderNavbar({ expanded: true });
      const navLinks = within(screen.getByRole('list')).getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('renders with active class when active', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link.active')).toBeInTheDocument();
    });

    it('renders with disabled class when disabled', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link.disabled')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" className="custom-link">
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.nav-link.custom-link')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" data-testid="link-test">
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('link-test')).toBeInTheDocument();
    });

    it('forwards ref to anchor element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link ref={ref} href="/">
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });
  });

  describe('Accessibility', () => {
    it('has aria-current="page" when active', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link.active')).toHaveAttribute('aria-current', 'page');
    });

    it('does not have aria-current when not active', () => {
      renderNavbar();
      const aboutLink = screen.getByText('About');
      expect(aboutLink).not.toHaveAttribute('aria-current');
    });

    it('has aria-disabled when disabled', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link.disabled')).toHaveAttribute('aria-disabled', 'true');
    });

    it('has tabIndex=-1 when disabled', () => {
      renderNavbar();
      expect(document.querySelector('.nav-link.disabled')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Click Handling', () => {
    it('calls onClick handler', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" onClick={handleClick}>
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      await user.click(screen.getByText('Link'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('prevents default when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" disabled onClick={handleClick}>
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      await user.click(screen.getByText('Link'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('External Links', () => {
    it('adds rel="noopener noreferrer" for target="_blank"', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="https://example.com" target="_blank">
                  External
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('External').closest('a')).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });

    it('preserves custom rel attribute', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="https://example.com" rel="custom">
                  External
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('External').closest('a')).toHaveAttribute('rel', 'custom');
    });
  });

  describe('Custom Component', () => {
    it('supports custom as prop for router links', () => {
      // Mock router component
      const MockLink = ({ children, ...props }: { children: React.ReactNode; href: string }) => (
        <a data-router-link {...props}>
          {children}
        </a>
      );

      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" as={MockLink}>
                  Router Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      const link = screen.getByText('Router Link').closest('a');
      expect(link).toHaveAttribute('data-router-link');
    });
  });
});

// =============================================================================
// Navbar.Text Tests
// =============================================================================

describe('Navbar.Text', () => {
  describe('Rendering', () => {
    it('renders as span element', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text>Some text</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('span.navbar-text')).toBeInTheDocument();
    });

    it('renders with navbar-text class', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text>Some text</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.navbar-text')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text className="custom-text">Some text</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(document.querySelector('.navbar-text.custom-text')).toBeInTheDocument();
    });

    it('renders with custom data-testid', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text data-testid="text-test">Some text</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByTestId('text-test')).toBeInTheDocument();
    });

    it('forwards ref to span element', () => {
      const ref = { current: null };
      render(
        <Navbar>
          <Navbar.Collapse>
            <Navbar.Text ref={ref}>Some text</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('renders children correctly', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text>Signed in as: John Doe</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Signed in as: John Doe')).toBeInTheDocument();
    });
  });
});

// =============================================================================
// Context Error Tests
// =============================================================================

describe('Context Errors', () => {
  it('throws error when Toggle is used outside Navbar', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<Navbar.Toggle />);
    }).toThrow('Navbar components must be used within a Navbar component');

    consoleSpy.mockRestore();
  });

  it('throws error when Collapse is used outside Navbar', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<Navbar.Collapse>Content</Navbar.Collapse>);
    }).toThrow('Navbar components must be used within a Navbar component');

    consoleSpy.mockRestore();
  });
});

// =============================================================================
// Edge Cases
// =============================================================================

describe('Edge Cases', () => {
  it('handles empty navbar', () => {
    const { container } = render(<Navbar>{null}</Navbar>);
    expect(container.querySelector('.navbar')).toBeInTheDocument();
  });

  it('handles single child', () => {
    render(
      <Navbar>
        <Navbar.Brand href="/">Single</Navbar.Brand>
      </Navbar>
    );
    expect(screen.getByText('Single')).toBeInTheDocument();
  });

  it('handles rapid toggling by ignoring clicks during animation', async () => {
    // Mock requestAnimationFrame to queue callbacks instead of running immediately
    const rafCallbacks: FrameRequestCallback[] = [];
    const originalRaf = window.requestAnimationFrame;
    const originalCancelRaf = window.cancelAnimationFrame;

    window.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    }) as typeof window.requestAnimationFrame;
    window.cancelAnimationFrame = jest.fn();

    try {
      const user = userEvent.setup();
      renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });

      // First click: collapsed → expanding
      await user.click(toggle);
      // FSM is now in 'expanding' state, RAF callback is queued but not run
      expect(toggle).toHaveAttribute('aria-expanded', 'true'); // isExpanded returns true for 'expanding'

      // Second click: ignored because we're in 'expanding' state
      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      // Third click: also ignored because still in 'expanding' state
      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      // Now run the RAF callback to complete animation
      for (const cb of rafCallbacks) {
        cb(performance.now());
      }

      // After animation ends, should be expanded (not collapsed)
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    } finally {
      // Restore original functions
      window.requestAnimationFrame = originalRaf;
      window.cancelAnimationFrame = originalCancelRaf;
    }
  });

  it('handles switching from uncontrolled to controlled', () => {
    const { rerender } = render(
      <Navbar defaultExpanded={true}>
        <Navbar.Toggle />
        <Navbar.Collapse>Content</Navbar.Collapse>
      </Navbar>
    );

    rerender(
      <Navbar expanded={true}>
        <Navbar.Toggle />
        <Navbar.Collapse>Content</Navbar.Collapse>
      </Navbar>
    );

    // Should not crash and maintain state
    expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
