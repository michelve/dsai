/**
 * Example accessibility test demonstrating jest-axe usage
 * All components MUST pass accessibility tests
 */

import { render, testA11y } from '@/test/utils/test-utils';

// Example Link component for testing
// TODO: Replace with actual component from your library
interface LinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  ariaLabel?: string;
}

function Link({ href, children, external, ariaLabel }: LinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
      {external && <span className="sr-only"> (opens in new window)</span>}
    </a>
  );
}

describe('Link Component - Accessibility', () => {
  it('should have no accessibility violations in default state', async () => {
    const { container } = render(<Link href="/home">Home</Link>);

    expect(await testA11y(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with external link', async () => {
    const { container } = render(
      <Link href="https://example.com" external>
        External Site
      </Link>
    );

    expect(await testA11y(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with custom aria-label', async () => {
    const { container } = render(
      <Link href="/about" ariaLabel="Learn more about us">
        About
      </Link>
    );

    expect(await testA11y(container)).toHaveNoViolations();
  });

  describe('WCAG 2.1 AA Compliance', () => {
    it('should have accessible name', () => {
      const { getByRole } = render(<Link href="/home">Home</Link>);

      const link = getByRole('link', { name: /home/i });
      expect(link).toBeInTheDocument();
    });

    it('should indicate external links to screen readers', () => {
      const { getByText } = render(
        <Link href="https://example.com" external>
          External Site
        </Link>
      );

      // Screen reader will announce "External Site (opens in new window)"
      expect(getByText('(opens in new window)')).toBeInTheDocument();
    });

    it('should have proper security attributes for external links', () => {
      const { getByRole } = render(
        <Link href="https://example.com" external>
          External Site
        </Link>
      );

      const link = getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should allow custom aria-label for icon-only links', () => {
      const { getByRole } = render(
        <Link href="/settings" ariaLabel="Go to settings">
          <span aria-hidden="true">⚙️</span>
        </Link>
      );

      const link = getByRole('link', { name: /settings/i });
      expect(link).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be keyboard accessible', () => {
      const { getByRole } = render(<Link href="/home">Home</Link>);

      const link = getByRole('link');
      expect(link).toHaveAttribute('href', '/home');
    });
  });
});

/**
 * Testing Tips:
 *
 * 1. Always test with jest-axe first: expect(await testA11y(container)).toHaveNoViolations()
 * 2. Test keyboard navigation (Tab, Enter, Space, Arrow keys)
 * 3. Test screen reader announcements (aria-label, aria-describedby)
 * 4. Test focus management (autofocus, focus trap, focus restoration)
 * 5. Test color contrast (at least 4.5:1 for normal text, 3:1 for large text)
 * 6. Test with different states (hover, focus, active, disabled, error)
 * 7. Test responsive behavior (mobile, tablet, desktop)
 *
 * WCAG 2.1 AA Requirements:
 * - Perceivable: Text alternatives, captions, adaptable, distinguishable
 * - Operable: Keyboard accessible, enough time, seizures, navigable
 * - Understandable: Readable, predictable, input assistance
 * - Robust: Compatible with assistive technologies
 */
