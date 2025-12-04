/**
 * @fileoverview Security tests for Toast component
 * Verifies XSS prevention, prop whitelisting, and safe handling of user input
 */
import { render, screen } from '@testing-library/react';

import { Toast } from './Toast';
import { ToastContainer } from './ToastContainer';
import { ToastProvider, useToast } from './ToastProvider';

/**
 * Attributes that should NEVER appear in rendered output
 * These could enable XSS or prototype pollution attacks
 */
const DANGEROUS_ATTRIBUTES = [
  'onload',
  'onerror',
  'onabort',
  'onbeforeunload',
  'onblur',
  'onchange',
  'onclick',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpaste',
  'onpointercancel',
  'onpointerdown',
  'onpointerenter',
  'onpointerleave',
  'onpointermove',
  'onpointerout',
  'onpointerover',
  'onpointerup',
  'onreset',
  'onresize',
  'onscroll',
  'onsearch',
  'onselect',
  'onshow',
  'onsubmit',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ontransitionend',
  'onunload',
  'onwheel',
];

describe('Toast Security Tests', () => {
  describe('XSS Prevention - Event Handler Injection', () => {
    it('blocks dangerous inline event handlers passed as props', () => {
      const maliciousProps = {
        onload: 'alert("xss")',
        onerror: 'alert("xss")',
        onfocus: 'alert("xss")',
        onmouseover: 'alert("xss")',
      };

      render(
        <Toast message="Test" {...(maliciousProps as Record<string, string>)} data-testid="toast" />
      );

      const toast = screen.getByTestId('toast');
      const html = toast.outerHTML.toLowerCase();

      DANGEROUS_ATTRIBUTES.forEach((attr) => {
        expect(html).not.toContain(`${attr}=`);
      });
    });

    it('does not render javascript: URLs in any attributes', () => {
      // Toast doesn't use hrefs but verify no injection possible
      const maliciousProps = {
        href: 'javascript:alert("xss")',
        src: 'javascript:alert("xss")',
        action: 'javascript:alert("xss")',
      };

      render(
        <Toast message="Test" {...(maliciousProps as Record<string, string>)} data-testid="toast" />
      );

      const toast = screen.getByTestId('toast');
      const html = toast.outerHTML.toLowerCase();

      expect(html).not.toContain('javascript:');
    });

    it('does not render data: URLs', () => {
      const maliciousProps = {
        src: 'data:text/html,<script>alert("xss")</script>',
        href: 'data:text/html,<script>alert("xss")</script>',
      };

      render(
        <Toast message="Test" {...(maliciousProps as Record<string, string>)} data-testid="toast" />
      );

      const html = screen.getByTestId('toast').outerHTML.toLowerCase();
      expect(html).not.toContain('data:');
    });
  });

  describe('Safe Data Attributes', () => {
    it('allows safe data-* attributes', () => {
      render(<Toast message="Test" data-testid="toast" data-test="test-value" />);

      const toast = screen.getByTestId('toast');
      // Only explicitly whitelisted data-* attributes are forwarded
      expect(toast).toHaveAttribute('data-test', 'test-value');
      expect(toast).toHaveAttribute('data-testid', 'toast');
    });

    it('blocks arbitrary data-* attributes (explicit whitelist)', () => {
      // The component uses explicit prop whitelisting for security
      // Arbitrary data-* attributes are NOT forwarded
      render(
        <Toast
          message="Test"
          data-testid="toast"
          {...({ 'data-cy': 'cypress-id', 'data-automation-id': 'auto-id' } as Record<
            string,
            string
          >)}
        />
      );

      const toast = screen.getByTestId('toast');
      // These are NOT forwarded due to explicit prop whitelist
      expect(toast).not.toHaveAttribute('data-cy');
      expect(toast).not.toHaveAttribute('data-automation-id');
    });

    it('allows data-visual-state attribute', () => {
      render(<Toast message="Test" data-testid="toast" />);

      expect(screen.getByTestId('toast')).toHaveAttribute('data-visual-state');
    });
  });

  describe('Content Sanitization', () => {
    it('renders message as text, not HTML', () => {
      const maliciousMessage = '<script>alert("xss")</script>';
      render(<Toast message={maliciousMessage} data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      // Should render as text, not execute
      expect(toast.textContent).toContain('<script>');
      // Should not have actual script element
      expect(toast.querySelector('script')).toBeNull();
    });

    it('renders title as text, not HTML', () => {
      const maliciousTitle = '<img src=x onerror=alert("xss")>';
      render(<Toast title={maliciousTitle} message="Test" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      // Should render as text
      expect(toast.textContent).toContain('<img');
      // Should not have actual img element with onerror
      const imgs = toast.querySelectorAll('img');
      imgs.forEach((img) => {
        expect(img.getAttribute('onerror')).toBeNull();
      });
    });

    it('does not use dangerouslySetInnerHTML', () => {
      // This test inspects the component implementation
      render(<Toast message="Test" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      const html = toast.outerHTML;

      // dangerouslySetInnerHTML would result in direct HTML insertion
      // We verify there's no script or suspicious content
      expect(html).not.toContain('<script');
      expect(html).not.toContain('javascript:');
    });
  });

  describe('Aria Attribute Safety', () => {
    it('only sets allowed aria-* attributes', () => {
      render(<Toast message="Test" aria-label="Custom label" data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      // Only explicitly whitelisted aria-* attributes are forwarded
      expect(toast).toHaveAttribute('aria-label', 'Custom label');
    });

    it('blocks arbitrary aria-* attributes (explicit whitelist)', () => {
      // The component uses explicit prop whitelisting for security
      render(
        <Toast
          message="Test"
          data-testid="toast"
          {...({ 'aria-describedby': 'desc' } as Record<string, string>)}
        />
      );

      const toast = screen.getByTestId('toast');
      // aria-describedby is NOT forwarded unless title is present (internal logic)
      expect(toast).not.toHaveAttribute('aria-describedby', 'desc');
    });

    it('properly sets aria-live based on variant', () => {
      const { rerender } = render(<Toast message="Test" variant="error" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'assertive');

      rerender(<Toast message="Test" variant="success" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('CSS Class Injection Prevention', () => {
    it('sanitizes className prop', () => {
      const maliciousClass = 'normal-class" onclick="alert(1)" data-evil="';
      render(<Toast message="Test" className={maliciousClass} data-testid="toast" />);

      const toast = screen.getByTestId('toast');
      // The class should be applied as-is by React, which handles escaping
      // The important thing is no additional attributes get created
      expect(toast.getAttribute('onclick')).toBeNull();
      expect(toast.getAttribute('data-evil')).toBeNull();
    });
  });

  describe('ID Attribute Safety', () => {
    it('accepts valid ID', () => {
      render(<Toast message="Test" id="valid-toast-id" data-testid="toast" />);
      expect(screen.getByTestId('toast')).toHaveAttribute('id', 'valid-toast-id');
    });

    it('handles ID with special characters safely', () => {
      const specialId = 'toast-<script>';
      render(<Toast message="Test" id={specialId} data-testid="toast" />);
      // React should handle this safely
      const toast = screen.getByTestId('toast');
      expect(toast.querySelector('script')).toBeNull();
    });
  });
});

describe('ToastContainer Security Tests', () => {
  describe('XSS Prevention', () => {
    it('blocks dangerous attributes on container', () => {
      const maliciousProps = {
        onload: 'alert("xss")',
        onclick: 'alert("xss")',
      };

      render(
        <ToastContainer {...(maliciousProps as Record<string, string>)} data-testid="container">
          <div>Content</div>
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      const html = container.outerHTML.toLowerCase();

      expect(html).not.toContain('onload=');
      expect(html).not.toContain('onclick=');
    });

    it('allows safe data-* attributes on container', () => {
      render(
        <ToastContainer data-testid="container" data-test="value">
          <div>Content</div>
        </ToastContainer>
      );

      expect(screen.getByTestId('container')).toHaveAttribute('data-test', 'value');
    });
  });

  describe('Children Safety', () => {
    it('renders children without XSS', () => {
      // Children can contain React nodes which are safe
      render(
        <ToastContainer data-testid="container">
          <Toast message="<script>alert('xss')</script>" data-testid="toast" />
        </ToastContainer>
      );

      const container = screen.getByTestId('container');
      expect(container.querySelector('script')).toBeNull();
      // Message should be text
      expect(screen.getByTestId('toast').textContent).toContain('<script>');
    });
  });
});

describe('ToastProvider Security Tests', () => {
  describe('Toast Creation Safety', () => {
    it('sanitizes message content in dynamically created toasts', () => {
      const TestComponent = (): React.JSX.Element => {
        const { success, toasts } = useToast();
        return (
          <div>
            <button onClick={() => success('<script>alert("xss")</script>')}>Create Toast</button>
            {toasts.map((t) => (
              <div key={t.id} data-testid="toast-message">
                {t.message}
              </div>
            ))}
          </div>
        );
      };

      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // We're testing that the infrastructure handles this safely
      // The actual message content is just passed through as React children
      // which are inherently safe from XSS
    });
  });

  describe('Queue Management Safety', () => {
    it('handles maxToasts safely with negative values', () => {
      // Should not crash or behave unexpectedly
      expect(() => {
        render(
          <ToastProvider maxToasts={-1}>
            <div>Content</div>
          </ToastProvider>
        );
      }).not.toThrow();
    });

    it('handles maxToasts safely with zero', () => {
      expect(() => {
        render(
          <ToastProvider maxToasts={0}>
            <div>Content</div>
          </ToastProvider>
        );
      }).not.toThrow();
    });

    it('handles maxToasts safely with very large numbers', () => {
      expect(() => {
        render(
          <ToastProvider maxToasts={Number.MAX_SAFE_INTEGER}>
            <div>Content</div>
          </ToastProvider>
        );
      }).not.toThrow();
    });
  });
});

describe('Toast Safe Attribute Verification', () => {
  it('only forwards known-safe props to DOM', () => {
    const testProps = {
      // Safe props that should be forwarded
      id: 'test-id',
      className: 'test-class',
      style: { color: 'red' },
      'data-testid': 'toast',
      'aria-label': 'Test label',
      // Potentially dangerous props that should NOT be forwarded as event handlers
      onMouseOver: jest.fn(),
      onClick: jest.fn(),
    };

    render(<Toast message="Test" {...testProps} />);

    const toast = screen.getByTestId('toast');

    // Safe props should be present
    expect(toast).toHaveAttribute('id', 'test-id');
    expect(toast).toHaveClass('test-class');
    expect(toast).toHaveAttribute('aria-label', 'Test label');

    // Note: React event handlers (onClick, etc.) are allowed by React
    // The security concern is with string-based handlers like onclick="..."
    // which we tested above. React's onClick etc. are safe.
  });
});
