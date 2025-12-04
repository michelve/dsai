import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Popover } from './Popover';

expect.extend(toHaveNoViolations);

// Mock ResizeObserver for Floating UI
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

// Mock requestAnimationFrame
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('Popover Accessibility', () => {
  // ============================================================================
  // WCAG 2.2 AA - ARIA Attributes
  // ============================================================================
  describe('ARIA Attributes', () => {
    it('has role="dialog" when visible', async () => {
      render(
        <Popover content="Accessible popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('sets aria-haspopup="dialog" on trigger', async () => {
      render(
        <Popover content="Test popover">
          <button type="button">Trigger</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('sets aria-expanded on trigger when popover is visible', async () => {
      render(
        <Popover content="Accessible popover" id="test-popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('sets aria-expanded=false when popover is hidden', () => {
      render(
        <Popover content="Test popover">
          <button type="button">Trigger</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-controls on trigger when popover is visible', async () => {
      render(
        <Popover content="Accessible popover" id="test-popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-controls', 'test-popover');
      });
    });

    it('sets aria-labelledby when header is present', async () => {
      render(
        <Popover header="Popover Title" content="Content" id="test-popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('aria-labelledby', 'test-popover-header');
      });
    });

    it('sets aria-label when no header is present', async () => {
      render(
        <Popover content="Content" aria-label="Popover description" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('aria-label', 'Popover description');
      });
    });

    it('sets aria-describedby to body id', async () => {
      render(
        <Popover content="Body content" id="test-popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('aria-describedby', 'test-popover-body');
      });
    });

    it('sets aria-modal when trapFocus is true', async () => {
      render(
        <Popover content="Modal popover" trapFocus defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('aria-modal', 'true');
      });
    });
  });

  // ============================================================================
  // WCAG 2.2 AA - Keyboard Accessibility
  // ============================================================================
  describe('Keyboard Accessibility', () => {
    it('shows popover on focus trigger', async () => {
      render(
        <Popover content="Focus popover" trigger="focus">
          <button type="button">Focus me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      button.focus();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('shows popover on Tab key navigation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <button type="button">First button</button>
          <Popover content="Second button popover" trigger="focus">
            <button type="button">Second button</button>
          </Popover>
        </div>
      );

      await user.tab();
      await user.tab();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('ESC key dismisses popover', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Click popover" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('close button is keyboard accessible', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Closeable popover" showCloseButton defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close popover' });
      closeButton.focus();
      await user.keyboard('{Enter}');

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('close button can be activated with Space key', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Closeable popover" showCloseButton defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close popover' });
      closeButton.focus();
      await user.keyboard(' ');

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Close Button Accessibility
  // ============================================================================
  describe('Close Button Accessibility', () => {
    it('close button has accessible name', async () => {
      render(
        <Popover content="Test content" showCloseButton defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close popover' });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('close button has custom accessible name when closeButtonLabel is provided', async () => {
      render(
        <Popover
          content="Test content"
          showCloseButton
          closeButtonLabel="Dismiss notification"
          defaultOpen
        >
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Dismiss notification' });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('close button is type="button"', async () => {
      render(
        <Popover content="Test content" showCloseButton defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: 'Close popover' });
        expect(closeButton).toHaveAttribute('type', 'button');
      });
    });
  });

  // ============================================================================
  // jest-axe Tests
  // ============================================================================
  describe('jest-axe Validation', () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.useFakeTimers();
    });

    it('has no accessibility violations when hidden', async () => {
      const { container } = render(
        <Popover content="Test popover">
          <button type="button">Trigger</button>
        </Popover>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when visible with header', async () => {
      const { container } = render(
        <Popover header="Title" content="Visible popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when visible without header (uses aria-label)', async () => {
      const { container } = render(
        <Popover content="Visible popover" aria-label="Information" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with close button', async () => {
      const { container } = render(
        <Popover header="Title" content="Content" showCloseButton defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different placements', async () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;

      for (const placement of placements) {
        const { container, unmount } = render(
          <Popover
            header="Placement"
            content={`${placement} popover`}
            placement={placement}
            defaultOpen
          >
            <button type="button">Trigger</button>
          </Popover>
        );

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const results = await axe(container);
        expect(results).toHaveNoViolations();

        unmount();
      }
    });

    it('has no accessibility violations with disabled popover', async () => {
      const { container } = render(
        <Popover content="Disabled popover" disabled>
          <button type="button">Trigger</button>
        </Popover>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with complex content', async () => {
      const { container } = render(
        <Popover
          header="Settings"
          content={
            <div>
              <p>Configure your preferences:</p>
              <button type="button">Save</button>
              <button type="button">Cancel</button>
            </div>
          }
          defaultOpen
        >
          <button type="button">Open Settings</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with click trigger', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Popover header="Info" content="Click popover" trigger="click">
          <button type="button">Click me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with hover trigger', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Popover header="Info" content="Hover popover" trigger="hover">
          <button type="button">Hover me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with focus trigger', async () => {
      const { container } = render(
        <Popover header="Info" content="Focus popover" trigger="focus">
          <button type="button">Focus me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      button.focus();

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations without arrow', async () => {
      const { container } = render(
        <Popover header="No Arrow" content="No arrow popover" arrow={false} defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with trapFocus', async () => {
      const { container } = render(
        <Popover header="Modal" content="Focus trapped" trapFocus defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================================================
  // Screen Reader Behavior
  // ============================================================================
  describe('Screen Reader Behavior', () => {
    it('popover header is accessible via aria-labelledby', async () => {
      render(
        <Popover header="Important Info" content="Details here" id="sr-popover" defaultOpen>
          <button type="button">Learn more</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        const header = screen.getByText('Important Info');

        expect(popover).toHaveAttribute('aria-labelledby', 'sr-popover-header');
        expect(header).toHaveAttribute('id', 'sr-popover-header');
      });
    });

    it('popover body is accessible via aria-describedby', async () => {
      render(
        <Popover content="Detailed description" id="sr-popover" defaultOpen>
          <button type="button">Learn more</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        const body = screen.getByText('Detailed description');

        expect(popover).toHaveAttribute('aria-describedby', 'sr-popover-body');
        expect(body.closest('.popover-body')).toHaveAttribute('id', 'sr-popover-body');
      });
    });

    it('maintains proper ID relationships', async () => {
      render(
        <Popover header="Title" content="Content" id="test-popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        const popoverId = popover.getAttribute('id');
        const labelledbyId = popover.getAttribute('aria-labelledby');
        const describedbyId = popover.getAttribute('aria-describedby');

        // IDs should be based on the provided id prop
        expect(popoverId).toBe('test-popover');
        expect(labelledbyId).toBe('test-popover-header');
        expect(describedbyId).toBe('test-popover-body');

        // Type guard: ensure IDs exist before querying
        if (!labelledbyId || !describedbyId) {
          throw new Error('Expected aria-labelledby and aria-describedby IDs to be present');
        }

        const header = document.getElementById(labelledbyId);
        const body = document.getElementById(describedbyId);

        expect(header).toHaveTextContent('Title');
        expect(body).toHaveTextContent('Content');
      });
    });
  });

  // ============================================================================
  // Focus Management
  // ============================================================================
  describe('Focus Management', () => {
    it('does not trap focus by default', async () => {
      render(
        <Popover content="Non-modal popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).not.toHaveAttribute('aria-modal');
      });
    });

    it('indicates modal behavior when trapFocus is enabled', async () => {
      render(
        <Popover content="Modal popover" trapFocus defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('aria-modal', 'true');
      });
    });
  });
});
