/**
 * Navbar Accessibility Tests
 *
 * Tests for WCAG 2.2 AA compliance using jest-axe.
 * Covers keyboard navigation, ARIA attributes, and screen reader support.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Navbar } from './Navbar';

expect.extend(toHaveNoViolations);

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
            <Navbar.Text>Signed in as: John</Navbar.Text>
          </Navbar.Collapse>
        </>
      )}
    </Navbar>
  );
};

// =============================================================================
// Automated A11y Tests (jest-axe)
// =============================================================================

describe('Navbar Accessibility', () => {
  describe('Automated A11y Checks (jest-axe)', () => {
    it('has no accessibility violations in collapsed state', async () => {
      const { container } = renderNavbar();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations in expanded state', async () => {
      const { container } = renderNavbar({ expanded: true });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with dark variant', async () => {
      const { container } = renderNavbar({ variant: 'dark', bg: 'dark' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with brand link', async () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
        </Navbar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with brand button', async () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand onClick={() => {}}>Brand</Navbar.Brand>
        </Navbar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with brand text', async () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand>Brand</Navbar.Brand>
        </Navbar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with active link', async () => {
      const { container } = render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" active>
                  Home
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with disabled link', async () => {
      const { container } = render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/" disabled>
                  Disabled
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations after user interaction', async () => {
      const user = userEvent.setup();
      const { container } = renderNavbar();

      // Toggle navbar
      await user.click(screen.getByRole('button', { name: /toggle/i }));

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('has no accessibility violations with custom aria-label', async () => {
      const { container } = renderNavbar({ 'aria-label': 'Primary navigation' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Navigation Landmark Tests
  // ===========================================================================

  describe('Navigation Landmark', () => {
    it('uses semantic nav element', () => {
      renderNavbar();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('has aria-label for landmark identification', () => {
      renderNavbar();
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label');
    });

    it('uses provided aria-label', () => {
      renderNavbar({ 'aria-label': 'Site navigation' });
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Site navigation');
    });
  });

  // ===========================================================================
  // Toggle Button A11y Tests
  // ===========================================================================

  describe('Toggle Button Accessibility', () => {
    it('toggle is a button element', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: /toggle/i })).toBeInTheDocument();
    });

    it('toggle has aria-label', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute('aria-label');
    });

    it('toggle has aria-expanded when collapsed', () => {
      renderNavbar({ expanded: false });
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('toggle has aria-expanded when expanded', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('toggle has aria-controls pointing to collapse', () => {
      const { container } = renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle/i });
      const collapseId = toggle.getAttribute('aria-controls');

      expect(collapseId).toBeTruthy();
      expect(container.querySelector(`#${collapseId}`)).toBeInTheDocument();
    });

    it('toggle icon has aria-hidden', () => {
      const { container } = renderNavbar();
      const icon = container.querySelector('.navbar-toggler-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ===========================================================================
  // Link A11y Tests
  // ===========================================================================

  describe('Link Accessibility', () => {
    it('active link has aria-current="page"', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    });

    it('non-active link does not have aria-current', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('About')).not.toHaveAttribute('aria-current');
    });

    it('disabled link has aria-disabled', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Contact')).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled link has tabIndex=-1', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Contact')).toHaveAttribute('tabindex', '-1');
    });

    it('enabled link does not have aria-disabled', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Home')).not.toHaveAttribute('aria-disabled');
    });

    it('enabled link does not have negative tabIndex', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Home')).not.toHaveAttribute('tabindex', '-1');
    });
  });

  // ===========================================================================
  // Keyboard Navigation Tests
  // ===========================================================================

  describe('Keyboard Navigation', () => {
    it('toggle is focusable with Tab', async () => {
      const user = userEvent.setup();
      renderNavbar();

      await user.tab();
      // First tab should focus brand link
      await user.tab();
      // Second tab should focus toggle
      expect(screen.getByRole('button', { name: /toggle/i })).toHaveFocus();
    });

    it('toggle responds to Enter key', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      toggle.focus();

      await user.keyboard('{Enter}');
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('toggle responds to Space key', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      toggle.focus();

      await user.keyboard(' ');
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('links are focusable with Tab', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Tab through elements until we reach a link
      for (let i = 0; i < 10; i++) {
        await user.tab();
        if (document.activeElement?.classList.contains('nav-link')) {
          break;
        }
      }

      expect(document.activeElement).toHaveClass('nav-link');
    });

    it('disabled link is not focusable', async () => {
      const user = userEvent.setup();
      renderNavbar({ expanded: true });

      // Tab through all elements
      const disabledLink = screen.getByText('Contact');
      for (let i = 0; i < 20; i++) {
        await user.tab();
        // Focus should never land on disabled link
        expect(document.activeElement).not.toBe(disabledLink);
        if (document.activeElement === document.body) {
          break;
        }
      }
    });

    it('brand link is focusable', async () => {
      const user = userEvent.setup();
      renderNavbar();

      await user.tab();
      expect(screen.getByRole('link', { name: 'Brand' })).toHaveFocus();
    });

    it('brand button is focusable', async () => {
      const user = userEvent.setup();
      render(
        <Navbar>
          <Navbar.Brand onClick={() => {}}>Brand</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>Content</Navbar.Collapse>
        </Navbar>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Brand' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Screen Reader Support Tests
  // ===========================================================================

  describe('Screen Reader Support', () => {
    it('navigation landmark is properly labeled', () => {
      renderNavbar({ 'aria-label': 'Main site navigation' });
      expect(screen.getByRole('navigation', { name: 'Main site navigation' })).toBeInTheDocument();
    });

    it('expanded state is announced via aria-expanded', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');

      await user.click(toggle);
      await waitFor(() => {
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('active page is announced via aria-current', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    });

    it('toggle button has accessible name', () => {
      renderNavbar();
      expect(screen.getByRole('button', { name: 'Toggle navigation' })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Focus Management Tests
  // ===========================================================================

  describe('Focus Management', () => {
    it('focus remains on toggle after click', async () => {
      const user = userEvent.setup();
      renderNavbar();

      const toggle = screen.getByRole('button', { name: /toggle/i });
      await user.click(toggle);

      expect(toggle).toHaveFocus();
    });

    it('focus is not trapped in navbar', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button type="button">Before</button>
          <Navbar>
            <Navbar.Brand href="/">Brand</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar.Nav>
                <Navbar.Item>
                  <Navbar.Link href="/">Link</Navbar.Link>
                </Navbar.Item>
              </Navbar.Nav>
            </Navbar.Collapse>
          </Navbar>
          <button type="button">After</button>
        </div>
      );

      const afterButton = screen.getByText('After');
      const toggle = screen.getByRole('button', { name: /toggle/i });

      toggle.focus();

      // Tab through to get to After button
      for (let i = 0; i < 10; i++) {
        await user.tab();
        if (document.activeElement === afterButton) {
          break;
        }
      }

      expect(afterButton).toHaveFocus();
    });
  });

  // ===========================================================================
  // Color and Contrast Tests
  // ===========================================================================

  describe('Visual Accessibility', () => {
    it('applies visual state data attribute for styling', () => {
      renderNavbar({ expanded: true });
      expect(screen.getByRole('navigation')).toHaveAttribute('data-visual-state', 'expanded');
    });

    it('dark variant sets theme for contrast', () => {
      renderNavbar({ variant: 'dark', bg: 'dark' });
      expect(screen.getByRole('navigation')).toHaveAttribute('data-bs-theme', 'dark');
    });

    it('toggle has visible focus state class', () => {
      renderNavbar();
      const toggle = screen.getByRole('button', { name: /toggle/i });
      // Bootstrap provides focus styles via .navbar-toggler:focus
      expect(toggle).toHaveClass('navbar-toggler');
    });
  });

  // ===========================================================================
  // External Link Security A11y Tests
  // ===========================================================================

  describe('External Link Accessibility', () => {
    it('external links have rel="noopener noreferrer" for security', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="https://external.com" target="_blank">
                  External
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      const link = screen.getByText('External');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
