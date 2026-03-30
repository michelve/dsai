import { render, screen } from '@testing-library/react';

import { Dropdown } from './Dropdown';

describe('Dropdown - Security (HREF Validation & XSS Prevention)', () => {
  // ===========================================================================
  // Dropdown.Item HREF Validation
  // ===========================================================================
  describe('Dropdown.Item component - href validation', () => {
    it('blocks javascript: protocol in Dropdown.Item href', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="javascript:alert('XSS')">Dangerous</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      // When href is blocked, it should not render as a link or use safe fallback
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks javascript: protocol with whitespace variations', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="  javascript:alert('XSS')  ">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks uppercase JAVASCRIPT: protocol', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="JAVASCRIPT:alert('XSS')">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks data: protocol in Dropdown.Item href', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="data:text/html,<script>alert('XSS')</script>">
              Danger
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks vbscript: protocol in Dropdown.Item href', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="vbscript:msgbox('XSS')">VB</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks file: protocol in Dropdown.Item href', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="file:///etc/passwd">File</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('allows http:// protocol in Dropdown.Item href', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="http://example.com">External</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'External' });
      expect(link).toHaveAttribute('href', 'http://example.com');
    });

    it('allows https:// protocol in Dropdown.Item href', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="https://example.com">Secure</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Secure' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('allows root path / in Dropdown.Item href', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="/">Home</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Home' });
      expect(link).toHaveAttribute('href', '/');
    });

    it('allows relative paths /path in Dropdown.Item href', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="/products/category">Products</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Products' });
      expect(link).toHaveAttribute('href', '/products/category');
    });

    it('allows hash anchors # in Dropdown.Item href', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="#section">Section</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Section' });
      expect(link).toHaveAttribute('href', '#section');
    });
  });

  // ===========================================================================
  // External Link Protection
  // ===========================================================================
  describe('external link protection', () => {
    it('adds rel="noopener noreferrer" to target="_blank" links', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="https://external.com" target="_blank">
              External
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'External' });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('allows custom rel to be specified', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="https://example.com" rel="author">
              Author
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Author' });
      expect(link).toHaveAttribute('rel', 'author');
    });

    it('does not add rel when target is not _blank', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="/internal">Internal</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = screen.getByRole('menuitem', { name: 'Internal' });
      expect(link).not.toHaveAttribute('rel');
    });
  });

  // ===========================================================================
  // Button Fallback for Invalid/Missing href
  // ===========================================================================
  describe('button fallback behavior', () => {
    it('renders as button when href is undefined', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item onClick={() => {}}>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const button = screen.getByRole('menuitem', { name: 'Action' });
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders as button when dangerous href is blocked', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="javascript:alert('XSS')">Blocked</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      // When href is blocked (returns undefined), component falls back to button
      const item = screen.getByRole('menuitem', { name: 'Blocked' });
      // It should either be a button or a link without href
      expect(item.tagName).toBe('BUTTON');
    });
  });

  // ===========================================================================
  // Protocol Case Insensitivity
  // ===========================================================================
  describe('protocol case insensitivity', () => {
    it('blocks mixed case javascript protocol', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="JaVaScRiPt:alert('XSS')">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks mixed case data protocol', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="DaTa:text/html,<script>alert('XSS')</script>">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks mixed case vbscript protocol', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="VbScRiPt:msgbox('XSS')">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });

    it('blocks mixed case file protocol', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item href="FiLe:///etc/passwd">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      const link = container.querySelector('a.dropdown-item');
      expect(link?.getAttribute('href')).toBeUndefined();
    });
  });

  // ===========================================================================
  // No Dangerous Attributes
  // ===========================================================================
  describe('no dangerous attributes', () => {
    it('does not render onLoad attribute', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item data-testid="item">Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      expect(container.innerHTML).not.toContain('onload');
      expect(container.innerHTML).not.toContain('onLoad');
    });

    it('does not render onError attribute', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item data-testid="item">Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      expect(container.innerHTML).not.toContain('onerror');
      expect(container.innerHTML).not.toContain('onError');
    });

    it('does not use dangerouslySetInnerHTML', () => {
      const { container } = render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.Item>Action</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      expect(container.innerHTML).not.toContain('dangerouslySetInnerHTML');
    });
  });

  // ===========================================================================
  // Toggle Button Type
  // ===========================================================================
  describe('toggle button security', () => {
    it('toggle button has type="button" to prevent form submission', () => {
      render(
        <form>
          <Dropdown>
            <Dropdown.Toggle>Menu</Dropdown.Toggle>
            <Dropdown.Menu portal={false}>
              <Dropdown.Item>Action</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </form>
      );
      const toggle = screen.getByRole('button', { name: 'Menu' });
      expect(toggle).toHaveAttribute('type', 'button');
    });
  });

  // ===========================================================================
  // CheckboxItem Security
  // ===========================================================================
  describe('CheckboxItem security', () => {
    it('CheckboxItem renders as button with type="button"', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.CheckboxItem>Bold</Dropdown.CheckboxItem>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitemcheckbox', { name: 'Bold' });
      expect(item.tagName).toBe('BUTTON');
      expect(item).toHaveAttribute('type', 'button');
    });
  });

  // ===========================================================================
  // RadioItem Security
  // ===========================================================================
  describe('RadioItem security', () => {
    it('RadioItem renders as button with type="button"', () => {
      render(
        <Dropdown isOpen>
          <Dropdown.Toggle>Menu</Dropdown.Toggle>
          <Dropdown.Menu portal={false}>
            <Dropdown.RadioGroup>
              <Dropdown.RadioItem value="a">Option A</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Menu>
        </Dropdown>
      );

      const item = screen.getByRole('menuitemradio', { name: 'Option A' });
      expect(item.tagName).toBe('BUTTON');
      expect(item).toHaveAttribute('type', 'button');
    });
  });
});
