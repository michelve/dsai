import { render, screen } from '@testing-library/react';

import { Card, CardBody, CardLink } from './Card';

describe('Card - Security (HREF Validation & XSS Prevention)', () => {
  // ===========================================================================
  // Card Component HREF Validation
  // ===========================================================================
  describe('Card component - href validation', () => {
    it('blocks javascript: protocol in Card href', () => {
      const { container } = render(
        <Card href="javascript:alert('XSS')">
          <CardBody>Dangerous</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks javascript: protocol with whitespace variations', () => {
      const { container } = render(
        <Card href="  javascript:alert('XSS')  ">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks uppercase JAVASCRIPT: protocol', () => {
      const { container } = render(
        <Card href="JAVASCRIPT:alert('XSS')">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol in Card href', () => {
      const { container } = render(
        <Card href="data:text/html,<script>alert('XSS')</script>">
          <CardBody>Danger</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol in Card href', () => {
      const { container } = render(
        <Card href="vbscript:msgbox('XSS')">
          <CardBody>VB</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks file: protocol in Card href', () => {
      const { container } = render(
        <Card href="file:///etc/passwd">
          <CardBody>File</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('allows http:// protocol in Card href', () => {
      const { container } = render(
        <Card href="http://example.com">
          <CardBody>External</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'http://example.com');
    });

    it('allows https:// protocol in Card href', () => {
      const { container } = render(
        <Card href="https://example.com">
          <CardBody>Secure</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('allows root path / in Card href', () => {
      const { container } = render(
        <Card href="/">
          <CardBody>Home</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/');
    });

    it('allows relative paths /path in Card href', () => {
      const { container } = render(
        <Card href="/products/category">
          <CardBody>Products</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/products/category');
    });

    it('allows hash anchors # in Card href', () => {
      const { container } = render(
        <Card href="#section">
          <CardBody>Section</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#section');
    });
  });

  // ===========================================================================
  // CardLink Component HREF Validation
  // ===========================================================================
  describe('CardLink component - href validation', () => {
    it('blocks javascript: protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="javascript:alert('XSS')">Dangerous</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Dangerous');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks javascript: protocol with uppercase variations', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="JavaScript:alert('XSS')">Test</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Test');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="data:text/html,<script>alert('XSS')</script>">Danger</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Danger');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="vbscript:msgbox('XSS')">VB</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('VB');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks file: protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="file:///etc/passwd">File</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('File');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('allows http:// protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="http://example.com">External</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('External');
      expect(link.closest('a')).toHaveAttribute('href', 'http://example.com');
    });

    it('allows https:// protocol in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="https://example.com">Secure</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Secure');
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
    });

    it('allows relative paths in CardLink href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="/products">Products</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Products');
      expect(link.closest('a')).toHaveAttribute('href', '/products');
    });
  });

  // ===========================================================================
  // External Link Protection
  // ===========================================================================
  describe('external link protection', () => {
    it('adds rel="noopener noreferrer" to external http links in Card', () => {
      const { container } = render(
        <Card href="http://external.com">
          <CardBody>External</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('adds rel="noopener noreferrer" to external https links in Card', () => {
      const { container } = render(
        <Card href="https://external.com">
          <CardBody>Secure</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel to internal paths in Card', () => {
      const { container } = render(
        <Card href="/internal">
          <CardBody>Internal</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link?.getAttribute('rel')).toBeNull();
    });

    it('does not add rel to hash anchors in Card', () => {
      const { container } = render(
        <Card href="#section">
          <CardBody>Section</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link?.getAttribute('rel')).toBeNull();
    });

    it('adds rel="noopener noreferrer" to external links in CardLink', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="https://example.com">External</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('External');
      expect(link.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel to internal paths in CardLink', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="/internal">Internal</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Internal');
      expect(link.closest('a')?.getAttribute('rel')).toBeNull();
    });
  });

  // ===========================================================================
  // Card href Fallback Behavior
  // ===========================================================================
  describe('Card href fallback behavior', () => {
    it('renders as article when href is undefined', () => {
      const { container } = render(
        <Card>
          <CardBody>No href</CardBody>
        </Card>
      );
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('a')).toBeNull();
    });

    it('renders as article when href is empty string', () => {
      const { container } = render(
        <Card href="">
          <CardBody>Empty href</CardBody>
        </Card>
      );
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('renders as article when href is null', () => {
      const { container } = render(
        <Card href={undefined}>
          <CardBody>Null href</CardBody>
        </Card>
      );
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('renders as button when onClick is provided without href', () => {
      const handleClick = jest.fn();
      const { container } = render(
        <Card onClick={handleClick}>
          <CardBody>Clickable</CardBody>
        </Card>
      );
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  // ===========================================================================
  // CardLink href Fallback Behavior
  // ===========================================================================
  describe('CardLink href fallback behavior', () => {
    it('renders with # as fallback for dangerous href', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="javascript:alert('XSS')">Safe</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Safe');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Protocol Case Insensitivity
  // ===========================================================================
  describe('protocol case insensitivity', () => {
    it('blocks mixed case javascript protocol in Card', () => {
      const { container } = render(
        <Card href="JaVaScRiPt:alert('XSS')">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks mixed case data protocol in Card', () => {
      const { container } = render(
        <Card href="DaTa:text/html,<script>alert('XSS')</script>">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks mixed case vbscript protocol in Card', () => {
      const { container } = render(
        <Card href="VbScRiPt:msgbox('XSS')">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks mixed case file protocol in Card', () => {
      const { container } = render(
        <Card href="FiLe:///etc/passwd">
          <CardBody>Test</CardBody>
        </Card>
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '#');
    });

    it('blocks mixed case javascript protocol in CardLink', () => {
      render(
        <Card>
          <CardBody>
            <CardLink href="JaVaScRiPt:alert('XSS')">Test</CardLink>
          </CardBody>
        </Card>
      );
      const link = screen.getByText('Test');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Button Accessibility for Interactive Cards
  // ===========================================================================
  describe('interactive card accessibility', () => {
    it('renders as button with type="button" when onClick is provided', () => {
      const { container } = render(
        <Card interactive onClick={() => {}}>
          <CardBody>Click me</CardBody>
        </Card>
      );
      const button = container.querySelector('button[type="button"]');
      expect(button).toBeInTheDocument();
    });

    it('button has proper accessible text', () => {
      const { container } = render(
        <Card interactive onClick={() => {}}>
          <CardBody>Click me</CardBody>
        </Card>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(container.querySelector('button')).toContainElement(screen.getByText('Click me'));
    });
  });
});
