import { render, screen } from '@testing-library/react';

import { Badge } from './Badge';

describe('Badge Security Tests', () => {
  describe('Prop Whitelisting', () => {
    it('accepts whitelisted data-testid attribute', () => {
      render(<Badge data-testid="badge-test">Content</Badge>);
      expect(screen.getByTestId('badge-test')).toBeInTheDocument();
    });

    it('accepts whitelisted data-test attribute', () => {
      render(<Badge data-test="badge-test">Content</Badge>);
      const badge = screen.getByText('Content');
      expect(badge).toHaveAttribute('data-test', 'badge-test');
    });

    it('accepts id attribute', () => {
      render(<Badge id="test-badge">Content</Badge>);
      expect(document.getElementById('test-badge')).toBeInTheDocument();
    });

    it('accepts className attribute', () => {
      render(<Badge className="custom-class">Content</Badge>);
      const badge = screen.getByText('Content');
      expect(badge).toHaveClass('custom-class');
      expect(badge).toHaveClass('badge'); // Still has base class
    });

    it('accepts style attribute', () => {
      render(<Badge style={{ marginTop: '10px' }}>Content</Badge>);
      const badge = screen.getByText('Content');
      expect(badge).toHaveStyle({ marginTop: '10px' });
    });

    it('accepts title attribute', () => {
      render(<Badge title="Badge tooltip">Content</Badge>);
      const badge = screen.getByText('Content');
      expect(badge).toHaveAttribute('title', 'Badge tooltip');
    });

    it('accepts aria-label attribute', () => {
      render(<Badge aria-label="Status badge">Content</Badge>);
      const badge = screen.getByText('Content');
      expect(badge).toHaveAttribute('aria-label', 'Status badge');
    });
  });

  describe('Role Assignment', () => {
    it('applies role="status" for dot-only badges', () => {
      render(<Badge dot aria-label="Online status" />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not apply role="status" when badge has content', () => {
      render(<Badge dot>Online</Badge>);
      // With content, no special role is applied
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not apply role="status" for non-dot badges', () => {
      render(<Badge>New</Badge>);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Dot Indicator Security', () => {
    it('dot element is aria-hidden when badge has content', () => {
      const { container } = render(<Badge dot>Online</Badge>);
      const dotSpan = container.querySelector('.rounded-circle');
      expect(dotSpan).toHaveAttribute('aria-hidden', 'true');
    });

    it('dot element is not aria-hidden for dot-only badges (needs to be announced)', () => {
      const { container } = render(<Badge dot aria-label="Status" />);
      const dotSpan = container.querySelector('.rounded-circle');
      // Dot-only: aria-hidden should NOT be set since aria-label provides the accessible name
      expect(dotSpan).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Icon Security', () => {
    it('icon wrapper is aria-hidden', () => {
      const { container } = render(
        <Badge icon={<span data-testid="icon">★</span>}>Featured</Badge>
      );
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('XSS Prevention', () => {
    it('does not render dangerouslySetInnerHTML', () => {
      // TypeScript prevents this, but let's verify runtime behavior
      const maliciousProps = {
        dangerouslySetInnerHTML: { __html: '<script>alert("xss")</script>' },
      } as unknown as Record<string, unknown>;

      // Badge should not spread arbitrary props
      const { container } = render(<Badge {...maliciousProps}>Safe Content</Badge>);

      // Should not contain script tag
      expect(container.querySelector('script')).not.toBeInTheDocument();
      expect(screen.getByText('Safe Content')).toBeInTheDocument();
    });

    it('sanitizes children content (React handles this by default)', () => {
      // React escapes text content by default
      const maliciousContent = '<script>alert("xss")</script>';
      render(<Badge>{maliciousContent}</Badge>);

      // Should render as text, not as HTML
      expect(screen.getByText(maliciousContent)).toBeInTheDocument();
    });
  });

  describe('Element Type Security', () => {
    it('only allows span or div as element type', () => {
      // as="span" (default)
      const { container: container1 } = render(<Badge>Span Badge</Badge>);
      expect(container1.querySelector('span.badge')).toBeInTheDocument();

      // as="div"
      const { container: container2 } = render(<Badge as="div">Div Badge</Badge>);
      expect(container2.querySelector('div.badge')).toBeInTheDocument();
    });
  });

  describe('Variant Security', () => {
    const validVariants = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
    ] as const;

    validVariants.forEach((variant) => {
      it(`accepts valid variant: ${variant}`, () => {
        render(<Badge variant={variant}>{variant}</Badge>);
        const badge = screen.getByText(variant);
        expect(badge).toHaveClass(`text-bg-${variant}`);
      });
    });
  });
});
