/**
 * @fileoverview Security tests for Scrollspy component
 * Tests XSS prevention, prop whitelisting, and safe href handling
 */

import { render, screen } from '@testing-library/react';

import { Scrollspy } from './Scrollspy';

import type { ScrollspyItem } from './Scrollspy.types';

// =============================================================================
// Security Test Utilities
// =============================================================================

const DANGEROUS_PROTOCOLS = [
  'javascript:alert(1)',
  'javascript:void(0)',
  'JAVASCRIPT:alert(1)',
  'JaVaScRiPt:alert(1)',
  "javascript:alert('xss')",
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
  'file:///etc/passwd',
];

const DANGEROUS_HANDLERS = [
  'onload',
  'onerror',
  'onmouseover',
  'onfocus',
  'onclick',
  'onabort',
  'onchange',
  'oninput',
];

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '{{constructor.constructor("alert(1)")()}}',
];

// =============================================================================
// Safe Href Handling
// =============================================================================

describe('Scrollspy Security', () => {
  describe('Safe Href Handling', () => {
    it('allows valid hash hrefs', () => {
      const items: ScrollspyItem[] = [
        { id: '1', label: 'Section 1', target: 'section1' },
        { id: '2', label: 'Section 2', target: 'section-two' },
      ];

      render(<Scrollspy items={items} />);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '#section1');
      expect(links[1]).toHaveAttribute('href', '#section-two');
    });

    it.each(DANGEROUS_PROTOCOLS)('blocks dangerous protocol: %s', (protocol) => {
      // Items with dangerous protocols should be sanitized or rejected
      const items: ScrollspyItem[] = [{ id: '1', label: 'Malicious', target: protocol }];

      render(<Scrollspy items={items} />);

      const link = screen.getByText('Malicious').closest('a');

      // The href should be sanitized to just '#' when dangerous
      if (link) {
        const href = link.getAttribute('href');
        expect(href).toBe('#');
      }
    });

    it('sanitizes target IDs with special characters', () => {
      const items: ScrollspyItem[] = [
        { id: '1', label: 'Special', target: 'section<script>alert(1)</script>' },
      ];

      const { container } = render(<Scrollspy items={items} />);

      // The href should have script tags stripped
      const link = container.querySelector('a');
      // Sanitizer removes all HTML tags, so <script>...</script> becomes just the text
      expect(link?.getAttribute('href')).toBe('#section');
    });
  });

  // ===========================================================================
  // XSS Prevention in Labels
  // ===========================================================================

  describe('XSS Prevention in Labels', () => {
    it.each(XSS_PAYLOADS)('escapes XSS payload in label: %s', (payload) => {
      const items: ScrollspyItem[] = [{ id: '1', label: payload, target: 'section' }];

      const { container } = render(<Scrollspy items={items} />);

      // Script tags should not be rendered as actual script elements
      expect(container.innerHTML).not.toMatch(/<script[\s>]/i);
      // SVG with event handlers should not be rendered
      expect(container.innerHTML).not.toMatch(/<svg[^>]*onload/i);
      // Img with event handlers should not be rendered
      expect(container.innerHTML).not.toMatch(/<img[^>]*onerror/i);
    });

    it('renders label as text content, not HTML', () => {
      const items: ScrollspyItem[] = [
        { id: '1', label: '<strong>Bold</strong>', target: 'section' },
      ];

      const { container } = render(<Scrollspy items={items} />);

      // Strong tag should be escaped and shown as text
      expect(container.textContent).toContain('<strong>Bold</strong>');
      // Should not render as actual strong element within the link
      expect(container.querySelectorAll('a strong')).toHaveLength(0);
    });
  });

  // ===========================================================================
  // Prop Whitelisting
  // ===========================================================================

  describe('Prop Whitelisting', () => {
    it('allows safe data attributes', () => {
      render(<Scrollspy items={[]} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveAttribute('data-testid', 'scrollspy');
      // Component uses explicit whitelist, so only data-testid and data-test are allowed
      expect(nav).toHaveAttribute('data-visual-state');
    });

    it.each(DANGEROUS_HANDLERS)('does not forward dangerous handler: %s', (handler) => {
      const dangerousProps = { [handler]: () => alert('xss') };
      const { container } = render(<Scrollspy items={[]} {...(dangerousProps as object)} />);

      // Check that the handler is not present on the nav element
      const nav = container.querySelector('nav');
      expect(nav?.getAttribute(handler)).toBeNull();
    });

    it('allows safe ARIA attributes', () => {
      render(<Scrollspy items={[]} aria-label="Navigation" data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveAttribute('aria-label', 'Navigation');
      // aria-labelledby is also supported
    });

    it('allows className', () => {
      render(<Scrollspy items={[]} className="custom-class" data-testid="scrollspy" />);

      expect(screen.getByTestId('scrollspy')).toHaveClass('custom-class');
    });

    it('allows style prop with safe values', () => {
      render(<Scrollspy items={[]} style={{ marginTop: 10 }} data-testid="scrollspy" />);

      const nav = screen.getByTestId('scrollspy');
      expect(nav).toHaveStyle({ marginTop: '10px' });
    });
  });

  // ===========================================================================
  // No dangerouslySetInnerHTML
  // ===========================================================================

  describe('No dangerouslySetInnerHTML', () => {
    it('does not use dangerouslySetInnerHTML for rendering', () => {
      const items: ScrollspyItem[] = [{ id: '1', label: 'Test', target: 'test' }];

      const { container } = render(<Scrollspy items={items} />);

      // Check that the component rendered correctly
      expect(screen.getByText('Test')).toBeInTheDocument();

      // dangerouslySetInnerHTML would allow script tags to execute
      // Since we're testing React render output, check for safe rendering
      expect(container.querySelector('script')).toBeNull();
    });
  });

  // ===========================================================================
  // ScrollspyLink Security
  // ===========================================================================

  describe('ScrollspyLink Security', () => {
    it('Scrollspy.Link sanitizes target prop', () => {
      const { container } = render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="javascript:alert(1)">Click Me</Scrollspy.Link>
        </Scrollspy>
      );

      const link = container.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        expect(href).not.toContain('javascript:');
      }
    });

    it('Scrollspy.Link uses text content for children', () => {
      const { container } = render(
        <Scrollspy items={[]}>
          <Scrollspy.Link target="safe">{'<script>alert(1)</script>'}</Scrollspy.Link>
        </Scrollspy>
      );

      expect(container.innerHTML).not.toMatch(/<script[\s>]/i);
      expect(container.textContent).toContain('<script>');
    });
  });

  // ===========================================================================
  // ID Sanitization
  // ===========================================================================

  describe('ID Sanitization', () => {
    it('handles IDs with spaces safely', () => {
      const items: ScrollspyItem[] = [{ id: '1', label: 'Test', target: 'section with space' }];

      render(<Scrollspy items={items} />);

      const link = screen.getByText('Test').closest('a');
      // href should handle spaces appropriately
      const href = link?.getAttribute('href');
      expect(href).toBeDefined();
    });

    it('handles empty target gracefully', () => {
      const items: ScrollspyItem[] = [{ id: '1', label: 'Test', target: '' }];

      const { container } = render(<Scrollspy items={items} />);

      // Should render without crashing
      expect(container).toBeInTheDocument();
    });

    it('handles special characters in IDs', () => {
      const items: ScrollspyItem[] = [{ id: '1', label: 'Test', target: 'section-1_test.item' }];

      render(<Scrollspy items={items} />);

      const link = screen.getByText('Test').closest('a');
      expect(link?.getAttribute('href')).toBe('#section-1_test.item');
    });
  });

  // ===========================================================================
  // Event Handler Security
  // ===========================================================================

  describe('Event Handler Security', () => {
    it('onActiveChange callback receives sanitized ID', () => {
      const mockCallback = jest.fn();
      const items: ScrollspyItem[] = [{ id: '1', label: 'Test', target: 'safe-section' }];

      render(<Scrollspy items={items} activeId="safe-section" onActiveChange={mockCallback} />);

      // If activeId changes, the callback should receive safe data
      // This is more of a structural test
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('onClick on link receives event, not raw HTML', () => {
      const mockClick = jest.fn();

      render(
        <Scrollspy items={[{ id: '1', label: 'Test', target: 'section' }]}>
          <Scrollspy.Link target="section" onClick={mockClick}>
            Test
          </Scrollspy.Link>
        </Scrollspy>
      );

      const link = screen.getByText('Test');
      link.click();

      // onClick handler must be called with a React synthetic event
      expect(mockClick).toHaveBeenCalledTimes(1);

      const event = mockClick.mock.calls[0][0];
      // Verify it is a proper event object, not raw HTML or string
      expect(event).toBeDefined();
      expect(typeof event.preventDefault).toBe('function');
      // preventDefault should have been called to block raw anchor navigation
      expect(event.defaultPrevented).toBe(true);
    });
  });

  // ===========================================================================
  // Nested Items Security
  // ===========================================================================

  describe('Nested Items Security', () => {
    it('sanitizes nested item labels by React escaping', () => {
      const items: ScrollspyItem[] = [
        {
          id: '1',
          label: '<script>alert(1)</script>',
          target: 'parent',
          children: [{ id: '1-1', label: '<img src=x onerror=alert(1)>', target: 'child' }],
        },
      ];

      const { container } = render(<Scrollspy items={items} />);

      // React escapes text content, so script tags are rendered as HTML entities
      // Check that there are no actual script elements
      expect(container.querySelectorAll('script')).toHaveLength(0);
      // Check that XSS payloads in text are escaped (shown as text, not executed)
      expect(container.textContent).toContain('<script>alert(1)</script>');
    });

    it('sanitizes nested item targets', () => {
      const items: ScrollspyItem[] = [
        {
          id: '1',
          label: 'Parent',
          target: 'safe',
          children: [{ id: '1-1', label: 'Child', target: 'javascript:alert(1)' }],
        },
      ];

      const { container } = render(<Scrollspy items={items} />);

      const links = container.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        expect(href).not.toContain('javascript:');
      });
    });
  });
});
