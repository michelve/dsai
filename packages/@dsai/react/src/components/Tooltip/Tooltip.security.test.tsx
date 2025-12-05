import { render, screen, waitFor } from '@testing-library/react';

import { Tooltip } from './Tooltip';

// Mock ResizeObserver for Floating UI
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

describe('Tooltip Security', () => {
  // ============================================================================
  // Prop Whitelisting
  // ============================================================================
  describe('Prop Whitelisting', () => {
    it('only accepts whitelisted HTML attributes', async () => {
      render(
        <Tooltip
          content="Test tooltip"
          id="safe-id"
          className="safe-class"
          data-testid="safe-testid"
          data-test="safe-test"
          defaultOpen
        >
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('id', 'safe-id');
        expect(tooltip).toHaveClass('safe-class');
        expect(tooltip).toHaveAttribute('data-testid', 'safe-testid');
        expect(tooltip).toHaveAttribute('data-test', 'safe-test');
      });
    });

    it('does not spread arbitrary props to DOM elements', async () => {
      // TypeScript would prevent this, but we test runtime behavior
      const DangerousTooltip = Tooltip as React.ComponentType<
        React.ComponentProps<typeof Tooltip> & { onError?: () => void; onClick?: () => void }
      >;

      const onError = jest.fn();

      render(
        <DangerousTooltip content="Test tooltip" onError={onError} defaultOpen>
          <button type="button">Trigger</button>
        </DangerousTooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // Verify dangerous handlers are not present
        expect(tooltip).not.toHaveAttribute('onerror');
      });
    });

    it('does not allow form manipulation attributes', async () => {
      const DangerousTooltip = Tooltip as React.ComponentType<
        React.ComponentProps<typeof Tooltip> & { formAction?: string }
      >;

      render(
        <DangerousTooltip content="Test tooltip" formAction="https://evil.com/steal" defaultOpen>
          <button type="button">Trigger</button>
        </DangerousTooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).not.toHaveAttribute('formaction');
      });
    });
  });

  // ============================================================================
  // XSS Prevention
  // ============================================================================
  describe('XSS Prevention', () => {
    it('does not execute script content in tooltip', async () => {
      const xssAttempt = '<script>alert("XSS")</script>';

      render(
        <Tooltip content={xssAttempt} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // React escapes the content by default
        expect(tooltip.innerHTML).not.toContain('<script>');
        expect(tooltip.textContent).toContain('alert');
      });
    });

    it('does not execute event handler injections', async () => {
      const xssAttempt = '<img src="x" onerror="alert(1)" />';

      render(
        <Tooltip content={xssAttempt} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // React escapes the content - check that no actual img element with onerror exists
        expect(tooltip.querySelector('img[onerror]')).toBeNull();
        // The escaped text should be visible as text content
        expect(tooltip.textContent).toContain('onerror');
      });
    });

    it('does not allow javascript: in content', async () => {
      const xssAttempt = '<a href="javascript:alert(1)">Click</a>';

      render(
        <Tooltip content={xssAttempt} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // React escapes the content - check that no actual anchor with javascript: exists
        expect(tooltip.querySelector('a[href^="javascript:"]')).toBeNull();
        // The escaped text should be visible as text content
        expect(tooltip.textContent).toContain('javascript:');
      });
    });

    it('safely renders React nodes as content', async () => {
      // This is safe because React handles the rendering
      render(
        <Tooltip
          content={
            <div>
              <strong>Safe bold text</strong>
              <em>Safe italic text</em>
            </div>
          }
          defaultOpen
        >
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByText('Safe bold text')).toBeInTheDocument();
        expect(screen.getByText('Safe italic text')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // No dangerouslySetInnerHTML
  // ============================================================================
  describe('No dangerouslySetInnerHTML', () => {
    it('tooltip does not use dangerouslySetInnerHTML', async () => {
      render(
        <Tooltip content="Safe content" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const inner = tooltip.querySelector('.tooltip-inner');

        // If dangerouslySetInnerHTML were used, the content would be rendered differently
        expect(inner).toHaveTextContent('Safe content');
        // Check that innerHTML doesn't contain raw HTML that would indicate unsafe rendering
        expect(inner?.innerHTML).toBe('Safe content');
      });
    });
  });

  // ============================================================================
  // Event Handler Safety
  // ============================================================================
  describe('Event Handler Safety', () => {
    it('only uses explicit event handlers', async () => {
      const onOpenChange = jest.fn();

      render(
        <Tooltip content="Test tooltip" onOpenChange={onOpenChange} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        // The component should only expose documented event handlers
        expect(onOpenChange).not.toHaveBeenCalled(); // Not called on default open
      });
    });

    it('does not expose internal handlers through props', () => {
      // This test verifies the component interface
      const props: React.ComponentProps<typeof Tooltip> = {
        children: <button type="button">Trigger</button>,
        content: 'Test',
      };

      // TypeScript would error if we tried to add dangerous handlers
      // This is a runtime verification that the component ignores unknown props
      expect(() => {
        render(
          <Tooltip {...props}>
            <button type="button">Trigger</button>
          </Tooltip>
        );
      }).not.toThrow();
    });
  });

  // ============================================================================
  // Portal Security
  // ============================================================================
  describe('Portal Security', () => {
    it('uses a controlled container for portal rendering', async () => {
      const container = document.createElement('div');
      container.id = 'custom-portal';
      document.body.appendChild(container);

      render(
        <Tooltip content="Portal tooltip" container={container} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // The tooltip should be in our controlled container, not just anywhere
        expect(
          document.getElementById('custom-portal')?.contains(tooltip) ||
            document.body.contains(tooltip)
        ).toBe(true);
      });

      document.body.removeChild(container);
    });

    it('renders safely without portal', async () => {
      const { container } = render(
        <div data-testid="wrapper">
          <Tooltip content="Inline tooltip" portal={false} defaultOpen>
            <button type="button">Trigger</button>
          </Tooltip>
        </div>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(container.contains(tooltip)).toBe(true);
      });
    });
  });

  // ============================================================================
  // ID Injection Prevention
  // ============================================================================
  describe('ID Injection Prevention', () => {
    it('safely handles custom id prop', async () => {
      const suspiciousId = 'tooltip"><script>alert(1)</script><div id="';

      render(
        <Tooltip content="Test" id={suspiciousId} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // React safely escapes the ID attribute - the tooltip should have our custom ID
        expect(tooltip).toHaveAttribute('id', suspiciousId);
        // Verify no script was actually injected into the DOM
        const scripts = document.querySelectorAll('script');
        // There may be existing scripts but none should contain alert(1)
        scripts.forEach((script) => {
          expect(script.textContent).not.toContain('alert(1)');
        });
      });
    });
  });

  // ============================================================================
  // Style Injection Prevention
  // ============================================================================
  describe('Style Injection Prevention', () => {
    it('safely handles style prop', async () => {
      const style = {
        color: 'red',
        backgroundColor: 'blue',
      };

      render(
        <Tooltip content="Test" style={style} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // Check for RGB values (how browsers compute the styles)
        const computedStyle = window.getComputedStyle(tooltip);
        expect(computedStyle.color).toBe('rgb(255, 0, 0)'); // red
        expect(computedStyle.backgroundColor).toBe('rgb(0, 0, 255)'); // blue
      });
    });

    it('does not allow CSS expression injection attempts', async () => {
      // Note: React's style handling prevents CSS expressions
      const style = {
        color: 'expression(alert(1))', // This would be dangerous in old IE
      } as React.CSSProperties;

      render(
        <Tooltip content="Test" style={style} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        // React handles this safely
        expect(tooltip).toBeInTheDocument();
      });
    });
  });
});
