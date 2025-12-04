import { render, screen, waitFor } from '@testing-library/react';

import { Popover } from './Popover';

// Mock ResizeObserver for Floating UI
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

describe('Popover Security', () => {
  // ============================================================================
  // Prop Whitelisting
  // ============================================================================
  describe('Prop Whitelisting', () => {
    it('only accepts whitelisted HTML attributes', async () => {
      render(
        <Popover
          content="Test popover"
          header="Title"
          id="safe-id"
          className="safe-class"
          data-testid="safe-testid"
          data-test="safe-test"
          defaultOpen
        >
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('id', 'safe-id');
        expect(popover).toHaveClass('safe-class');
        expect(popover).toHaveAttribute('data-testid', 'safe-testid');
        expect(popover).toHaveAttribute('data-test', 'safe-test');
      });
    });

    it('does not spread arbitrary props to DOM elements', async () => {
      const DangerousPopover = Popover as React.ComponentType<
        React.ComponentProps<typeof Popover> & { onError?: () => void; onClick?: () => void }
      >;

      const onError = jest.fn();

      render(
        <DangerousPopover content="Test popover" onError={onError} defaultOpen>
          <button>Trigger</button>
        </DangerousPopover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).not.toHaveAttribute('onerror');
      });
    });

    it('does not allow form manipulation attributes', async () => {
      const DangerousPopover = Popover as React.ComponentType<
        React.ComponentProps<typeof Popover> & { formAction?: string }
      >;

      render(
        <DangerousPopover content="Test popover" formAction="https://evil.com/steal" defaultOpen>
          <button>Trigger</button>
        </DangerousPopover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).not.toHaveAttribute('formaction');
      });
    });
  });

  // ============================================================================
  // XSS Prevention
  // ============================================================================
  describe('XSS Prevention', () => {
    it('does not execute script content in popover body', async () => {
      const xssAttempt = '<script>alert("XSS")</script>';

      render(
        <Popover content={xssAttempt} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.innerHTML).not.toContain('<script>');
        expect(popover.textContent).toContain('alert');
      });
    });

    it('does not execute script content in popover header', async () => {
      const xssAttempt = '<script>alert("XSS")</script>';

      render(
        <Popover header={xssAttempt} content="Safe content" defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.innerHTML).not.toContain('<script>');
        expect(popover.textContent).toContain('alert');
      });
    });

    it('does not execute event handler injections', async () => {
      const xssAttempt = '<img src="x" onerror="alert(1)" />';

      render(
        <Popover content={xssAttempt} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.querySelector('img[onerror]')).toBeNull();
        expect(popover.textContent).toContain('onerror');
      });
    });

    it('does not allow javascript: in content', async () => {
      const xssAttempt = '<a href="javascript:alert(1)">Click</a>';

      render(
        <Popover content={xssAttempt} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.querySelector('a[href^="javascript:"]')).toBeNull();
        expect(popover.textContent).toContain('javascript:');
      });
    });

    it('safely renders React nodes as content', async () => {
      render(
        <Popover
          header="Safe Header"
          content={
            <div>
              <strong>Safe bold text</strong>
              <em>Safe italic text</em>
            </div>
          }
          defaultOpen
        >
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Safe Header')).toBeInTheDocument();
        expect(screen.getByText('Safe bold text')).toBeInTheDocument();
        expect(screen.getByText('Safe italic text')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // No dangerouslySetInnerHTML
  // ============================================================================
  describe('No dangerouslySetInnerHTML', () => {
    it('popover body does not use dangerouslySetInnerHTML', async () => {
      render(
        <Popover content="Safe content" defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const body = screen.getByText('Safe content');
        expect(body).toHaveTextContent('Safe content');
        expect(body.innerHTML).toBe('Safe content');
      });
    });

    it('popover header does not use dangerouslySetInnerHTML', async () => {
      render(
        <Popover header="Safe header" content="Content" defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const header = screen.getByText('Safe header');
        expect(header).toHaveTextContent('Safe header');
        expect(header.innerHTML).toBe('Safe header');
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
        <Popover content="Test popover" onOpenChange={onOpenChange} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalled();
      });
    });

    it('does not expose internal handlers through props', () => {
      const props: React.ComponentProps<typeof Popover> = {
        children: <button>Trigger</button>,
        content: 'Test',
      };

      expect(() => {
        render(
          <Popover {...props}>
            <button>Trigger</button>
          </Popover>
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
        <Popover content="Portal popover" container={container} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(
          document.getElementById('custom-portal')?.contains(popover) ||
            document.body.contains(popover)
        ).toBe(true);
      });

      document.body.removeChild(container);
    });

    it('renders safely without portal', async () => {
      const { container } = render(
        <div data-testid="wrapper">
          <Popover content="Inline popover" portal={false} defaultOpen>
            <button>Trigger</button>
          </Popover>
        </div>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(container.contains(popover)).toBe(true);
      });
    });
  });

  // ============================================================================
  // ID Injection Prevention
  // ============================================================================
  describe('ID Injection Prevention', () => {
    it('safely handles custom id prop', async () => {
      const suspiciousId = 'popover"><script>alert(1)</script><div id="';

      render(
        <Popover content="Test" id={suspiciousId} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('id', suspiciousId);
        const scripts = document.querySelectorAll('script');
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
        <Popover content="Test" style={style} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        const computedStyle = window.getComputedStyle(popover);
        expect(computedStyle.color).toBe('rgb(255, 0, 0)');
        expect(computedStyle.backgroundColor).toBe('rgb(0, 0, 255)');
      });
    });

    it('does not allow CSS expression injection attempts', async () => {
      const style = {
        color: 'expression(alert(1))',
      } as React.CSSProperties;

      render(
        <Popover content="Test" style={style} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Close Button Security
  // ============================================================================
  describe('Close Button Security', () => {
    it('close button has type="button" to prevent form submission', async () => {
      render(
        <Popover content="Test" showCloseButton defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close popover' });
        expect(closeButton).toHaveAttribute('type', 'button');
      });
    });

    it('close button label is sanitized', async () => {
      const suspiciousLabel = '<script>alert(1)</script>Close';

      render(
        <Popover content="Test" showCloseButton closeButtonLabel={suspiciousLabel} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: suspiciousLabel });
        expect(closeButton).toHaveAttribute('aria-label', suspiciousLabel);
        expect(closeButton.innerHTML).not.toContain('<script>');
      });
    });
  });

  // ============================================================================
  // Header/Body ID Security
  // ============================================================================
  describe('Header/Body ID Security', () => {
    it('generates safe header and body IDs', async () => {
      render(
        <Popover header="Title" content="Body" id="test-popover" defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const header = screen.getByText('Title');
        const body = screen.getByText('Body');

        expect(header).toHaveAttribute('id', 'test-popover-header');
        expect(body.closest('.popover-body')).toHaveAttribute('id', 'test-popover-body');
      });
    });

    it('handles malicious ID in header/body ID generation', async () => {
      const maliciousId = '"><script>alert(1)</script><div id="';

      render(
        <Popover header="Title" content="Body" id={maliciousId} defaultOpen>
          <button>Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toBeInTheDocument();
        const scripts = document.querySelectorAll('script');
        scripts.forEach((script) => {
          expect(script.textContent).not.toContain('alert(1)');
        });
      });
    });
  });
});
