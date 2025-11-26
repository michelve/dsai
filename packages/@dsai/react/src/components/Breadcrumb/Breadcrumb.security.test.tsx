import { render, screen } from '@testing-library/react';

import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

describe('Breadcrumb - Security (HREF Validation & XSS Prevention)', () => {
  // ===========================================================================
  // javascript: Protocol Tests
  // ===========================================================================
  describe('javascript: protocol blocking', () => {
    it('blocks javascript: protocol in BreadcrumbItem href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="javascript:alert('XSS')">Dangerous</BreadcrumbItem>
        </Breadcrumb>
      );
      const link = screen.getByText('Dangerous');
      expect(link.closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks javascript: protocol in items mode', () => {
      const items = [{ id: 'danger', label: 'Danger', href: 'javascript:alert("XSS")' }];
      render(<Breadcrumb items={items} />);
      expect(screen.getByText('Danger').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks javascript: protocol with whitespace variations', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="  javascript:alert('XSS')  ">Test</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Test').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks uppercase JAVASCRIPT: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="JAVASCRIPT:alert('XSS')">Test</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Test').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks mixed case JavaScript: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="JavaScript:alert('XSS')">Test</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Test').closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // data: Protocol Tests
  // ===========================================================================
  describe('data: protocol blocking', () => {
    it('blocks data: protocol in BreadcrumbItem href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="data:text/html,<script>alert('XSS')</script>">
            Danger
          </BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Danger').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks data: protocol in items mode', () => {
      const items = [
        { id: 'data', label: 'Data', href: 'data:text/html,<script>alert("XSS")</script>' },
      ];
      render(<Breadcrumb items={items} />);
      expect(screen.getByText('Data').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks uppercase DATA: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="DATA:text/html,<script>alert('XSS')</script>">Test</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Test').closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // vbscript: Protocol Tests
  // ===========================================================================
  describe('vbscript: protocol blocking', () => {
    it('blocks vbscript: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="vbscript:msgbox('XSS')">VB</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('VB').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks uppercase VBSCRIPT: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="VBSCRIPT:msgbox('XSS')">VB</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('VB').closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // file: Protocol Tests
  // ===========================================================================
  describe('file: protocol blocking', () => {
    it('blocks file: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="file:///etc/passwd">File</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('File').closest('a')).toHaveAttribute('href', '#');
    });

    it('blocks uppercase FILE: protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="FILE:///etc/passwd">File</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('File').closest('a')).toHaveAttribute('href', '#');
    });
  });

  // ===========================================================================
  // Safe URL Passthrough Tests
  // ===========================================================================
  describe('safe URL passthrough', () => {
    it('allows http:// protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="http://example.com">External</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('External').closest('a')).toHaveAttribute(
        'href',
        'http://example.com'
      );
    });

    it('allows https:// protocol', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="https://example.com">Secure</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Secure').closest('a')).toHaveAttribute(
        'href',
        'https://example.com'
      );
    });

    it('allows root path /', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    });

    it('allows relative paths /path', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/products/category">Products</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Products').closest('a')).toHaveAttribute(
        'href',
        '/products/category'
      );
    });

    it('allows hash anchors #', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="#section">Section</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Section').closest('a')).toHaveAttribute('href', '#section');
    });
  });

  // ===========================================================================
  // External Link Protection
  // ===========================================================================
  describe('external link protection', () => {
    it('adds rel="noopener noreferrer" to external http links', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="http://external.com">External</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('External').closest('a')).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });

    it('adds rel="noopener noreferrer" to external https links', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="https://external.com">Secure</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Secure').closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not add rel to internal paths', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/internal">Internal</BreadcrumbItem>
        </Breadcrumb>
      );
      const link = screen.getByText('Internal').closest('a');
      expect(link?.getAttribute('rel')).toBeNull();
    });

    it('does not add rel to hash anchors', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="#section">Section</BreadcrumbItem>
        </Breadcrumb>
      );
      const link = screen.getByText('Section').closest('a');
      expect(link?.getAttribute('rel')).toBeNull();
    });

    it('adds rel to external links in items mode', () => {
      const items = [{ id: 'external', label: 'External', href: 'https://example.com' }];
      render(<Breadcrumb items={items} />);
      expect(screen.getByText('External').closest('a')).toHaveAttribute(
        'rel',
        'noopener noreferrer'
      );
    });
  });

  // ===========================================================================
  // Fallback Behavior
  // ===========================================================================
  describe('fallback behavior', () => {
    it('defaults to # for undefined href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>No Href</BreadcrumbItem>
        </Breadcrumb>
      );
      const text = screen.getByText('No Href');
      expect(text.closest('a')).toBeNull();
      expect(text).toBeInTheDocument();
    });

    it('defaults to # for empty string href', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="">Empty</BreadcrumbItem>
        </Breadcrumb>
      );
      const text = screen.getByText('Empty');
      expect(text.closest('a')).toBeNull();
    });

    it('renders as text when no href and not active', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>Text Only</BreadcrumbItem>
        </Breadcrumb>
      );
      expect(screen.getByText('Text Only')).toBeInTheDocument();
      expect(screen.getByText('Text Only').closest('a')).toBeNull();
    });
  });

  // ===========================================================================
  // Icon Accessibility
  // ===========================================================================
  describe('icon accessibility', () => {
    it('hides icons from screen readers with aria-hidden="true"', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" icon="🏠">
            Home
          </BreadcrumbItem>
        </Breadcrumb>
      );
      const iconSpan = screen.getByText('🏠').parentElement;
      expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
    });

    it('icon span has me-1 class for margin', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem href="/" icon="📦">
            Products
          </BreadcrumbItem>
        </Breadcrumb>
      );
      const iconSpan = screen.getByText('📦').parentElement;
      expect(iconSpan).toHaveClass('me-1');
    });

    it('icons in items mode are also accessible', () => {
      const items = [{ id: 'home', label: 'Home', href: '/', icon: '🏠' }];
      render(<Breadcrumb items={items} />);
      expect(screen.getByText('🏠')).toBeInTheDocument();
    });
  });
});
