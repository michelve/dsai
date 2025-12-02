/**
 * Navbar Security Tests
 *
 * Tests for XSS prevention, href validation, and prop whitelisting.
 */

import { render, screen } from '@testing-library/react';

import { Navbar } from './Navbar';

// =============================================================================
// Navbar.Brand HREF Validation Tests
// =============================================================================

describe('Navbar - Security (HREF Validation & XSS Prevention)', () => {
  describe('Navbar.Brand - href validation', () => {
    it('blocks javascript: protocol in Brand href', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="javascript:alert('XSS')">Brand</Navbar.Brand>
        </Navbar>
      );
      // When blocked, should render as span (no href means no link)
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks javascript: protocol with whitespace', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="  javascript:alert('XSS')  ">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks uppercase JAVASCRIPT: protocol', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="JAVASCRIPT:alert('XSS')">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks data: protocol in Brand href', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="data:text/html,<script>alert('XSS')</script>">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks vbscript: protocol in Brand href', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="vbscript:msgbox('XSS')">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks file: protocol in Brand href', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="file:///etc/passwd">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('allows http:// protocol in Brand href', () => {
      render(
        <Navbar>
          <Navbar.Brand href="http://example.com">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', 'http://example.com');
    });

    it('allows https:// protocol in Brand href', () => {
      render(
        <Navbar>
          <Navbar.Brand href="https://example.com">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    });

    it('allows root path / in Brand href', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    });

    it('allows relative paths in Brand href', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/products/category">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', '/products/category');
    });

    it('allows hash anchors # in Brand href', () => {
      render(
        <Navbar>
          <Navbar.Brand href="#section">Brand</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('href', '#section');
    });
  });

  // ===========================================================================
  // Navbar.Link HREF Validation Tests
  // ===========================================================================

  describe('Navbar.Link - href validation', () => {
    it('blocks javascript: protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="javascript:alert('XSS')">Dangerous</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Dangerous')).toHaveAttribute('href', '#');
    });

    it('blocks javascript: protocol with uppercase variations', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="JavaScript:alert('XSS')">Test</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Test')).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="data:text/html,<script>alert('XSS')</script>">
                  Danger
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Danger')).toHaveAttribute('href', '#');
    });

    it('blocks vbscript: protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="vbscript:msgbox('XSS')">VB</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('VB')).toHaveAttribute('href', '#');
    });

    it('blocks file: protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="file:///etc/passwd">File</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('File')).toHaveAttribute('href', '#');
    });

    it('allows http:// protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="http://example.com">External</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('External')).toHaveAttribute('href', 'http://example.com');
    });

    it('allows https:// protocol in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="https://example.com">Secure</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Secure')).toHaveAttribute('href', 'https://example.com');
    });

    it('allows relative paths in Link href', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/products">Products</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Products')).toHaveAttribute('href', '/products');
    });

    it('defaults to # when no href provided', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link>No Href</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('No Href')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // External Link Protection Tests
  // ===========================================================================

  describe('External link protection', () => {
    it('adds rel="noopener noreferrer" for target="_blank" in Brand', () => {
      render(
        <Navbar>
          <Navbar.Brand href="https://external.com" target="_blank">
            External
          </Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('adds rel="noopener noreferrer" for target="_blank" in Link', () => {
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
      expect(screen.getByText('External')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel to internal paths in Brand', () => {
      render(
        <Navbar>
          <Navbar.Brand href="/internal">Internal</Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('rel');
    });

    it('does not add rel to internal paths in Link', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/internal">Internal</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Internal')).not.toHaveAttribute('rel');
    });

    it('preserves custom rel attribute in Brand', () => {
      render(
        <Navbar>
          <Navbar.Brand href="https://example.com" rel="author">
            Author
          </Navbar.Brand>
        </Navbar>
      );
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'author');
    });

    it('preserves custom rel attribute in Link', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="https://example.com" rel="author">
                  Author
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Author')).toHaveAttribute('rel', 'author');
    });
  });

  // ===========================================================================
  // Protocol Case Insensitivity Tests
  // ===========================================================================

  describe('Protocol case insensitivity', () => {
    it('blocks mixed case javascript protocol in Brand', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="JaVaScRiPt:alert('XSS')">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks mixed case data protocol in Brand', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="DaTa:text/html,<script>alert('XSS')</script>">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks mixed case vbscript protocol in Brand', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="VbScRiPt:msgbox('XSS')">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks mixed case file protocol in Brand', () => {
      const { container } = render(
        <Navbar>
          <Navbar.Brand href="FiLe:///etc/passwd">Brand</Navbar.Brand>
        </Navbar>
      );
      const brand = container.querySelector('.navbar-brand');
      expect(brand?.tagName).toBe('SPAN');
    });

    it('blocks mixed case javascript protocol in Link', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="JaVaScRiPt:alert('XSS')">Test</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Test')).toHaveAttribute('href', '#');
    });

    it('blocks mixed case data protocol in Link', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="DaTa:text/html,danger">Test</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      expect(screen.getByText('Test')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Prop Whitelisting Tests
  // ===========================================================================

  describe('Prop whitelisting', () => {
    it('does not spread arbitrary props to DOM elements', () => {
      const { container } = render(
        <Navbar
          // @ts-expect-error - Testing that arbitrary props are not spread
          onLoad={() => {}}
          onError={() => {}}
        >
          <Navbar.Brand href="/">Brand</Navbar.Brand>
        </Navbar>
      );

      const nav = container.querySelector('nav');
      expect(nav).not.toHaveAttribute('onload');
      expect(nav).not.toHaveAttribute('onerror');
    });

    it('does not spread dangerous handlers to Brand link', () => {
      render(
        <Navbar>
          <Navbar.Brand
            href="/"
            // @ts-expect-error - Testing that dangerous props are not spread
            onLoad={() => {}}
            onError={() => {}}
          >
            Brand
          </Navbar.Brand>
        </Navbar>
      );

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('onload');
      expect(link).not.toHaveAttribute('onerror');
    });

    it('does not spread dangerous handlers to Link', () => {
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link
                  href="/"
                  // @ts-expect-error - Testing that dangerous props are not spread
                  onLoad={() => {}}
                  onError={() => {}}
                >
                  Link
                </Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      const link = screen.getByText('Link');
      expect(link).not.toHaveAttribute('onload');
      expect(link).not.toHaveAttribute('onerror');
    });
  });

  // ===========================================================================
  // No dangerouslySetInnerHTML Tests
  // ===========================================================================

  describe('No dangerouslySetInnerHTML', () => {
    it('renders children safely without innerHTML', () => {
      const maliciousContent = '<img src=x onerror=alert(1)>';
      render(
        <Navbar>
          <Navbar.Brand href="/">{maliciousContent}</Navbar.Brand>
        </Navbar>
      );

      // Content should be escaped, not rendered as HTML
      expect(screen.getByText(maliciousContent)).toBeInTheDocument();
    });

    it('renders link children safely', () => {
      const maliciousContent = '<script>alert("xss")</script>';
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Nav>
              <Navbar.Item>
                <Navbar.Link href="/">{maliciousContent}</Navbar.Link>
              </Navbar.Item>
            </Navbar.Nav>
          </Navbar.Collapse>
        </Navbar>
      );

      // Content should be escaped, not rendered as HTML
      expect(screen.getByText(maliciousContent)).toBeInTheDocument();
    });

    it('renders text children safely', () => {
      const maliciousContent = '<img src=x onerror=alert(1)>';
      render(
        <Navbar expanded>
          <Navbar.Collapse>
            <Navbar.Text>{maliciousContent}</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      );

      // Content should be escaped, not rendered as HTML
      expect(screen.getByText(maliciousContent)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Button Type Safety
  // ===========================================================================

  describe('Button type safety', () => {
    it('toggle button has type="button" to prevent form submission', () => {
      const { container } = render(
        <form>
          <Navbar>
            <Navbar.Toggle />
            <Navbar.Collapse>Content</Navbar.Collapse>
          </Navbar>
        </form>
      );

      const button = container.querySelector('.navbar-toggler');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('brand button has type="button" to prevent form submission', () => {
      const { container } = render(
        <form>
          <Navbar>
            <Navbar.Brand onClick={() => {}}>Brand</Navbar.Brand>
          </Navbar>
        </form>
      );

      const button = container.querySelector('.navbar-brand');
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
