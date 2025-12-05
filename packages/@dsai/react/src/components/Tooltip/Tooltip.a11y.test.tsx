import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Tooltip } from './Tooltip';

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

describe('Tooltip Accessibility', () => {
  // ============================================================================
  // WCAG 2.2 AA - ARIA Attributes
  // ============================================================================
  describe('ARIA Attributes', () => {
    it('has role="tooltip" when visible', async () => {
      render(
        <Tooltip content="Accessible tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('sets aria-describedby on trigger when tooltip is visible', async () => {
      render(
        <Tooltip content="Accessible tooltip" id="test-tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-describedby', 'test-tooltip');
      });
    });

    it('removes aria-describedby when tooltip is hidden', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Test tooltip" id="test-tooltip">
          <button type="button">Trigger</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');

      // Initially no aria-describedby
      expect(button).not.toHaveAttribute('aria-describedby');

      // Show tooltip
      await user.hover(button);
      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-describedby', 'test-tooltip');
      });

      // Hide tooltip
      await user.unhover(button);
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(button).not.toHaveAttribute('aria-describedby');
      });
    });

    it('supports aria-label for complex content', async () => {
      render(
        <Tooltip
          content={
            <div>
              <strong>Complex</strong> content
            </div>
          }
          aria-label="Complex tooltip description"
          defaultOpen
        >
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-label', 'Complex tooltip description');
      });
    });
  });

  // ============================================================================
  // WCAG 2.2 AA - Keyboard Accessibility
  // ============================================================================
  describe('Keyboard Accessibility', () => {
    it('shows tooltip on focus', async () => {
      render(
        <Tooltip content="Focus tooltip" trigger="focus">
          <button type="button">Focus me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      button.focus();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('shows tooltip on Tab key navigation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <button type="button">First button</button>
          <Tooltip content="Second button tooltip" trigger="focus">
            <button type="button">Second button</button>
          </Tooltip>
        </div>
      );

      await user.tab();
      await user.tab();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('hides tooltip when focus leaves trigger', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <Tooltip content="Tooltip" trigger="focus">
            <button type="button">First button</button>
          </Tooltip>
          <button type="button">Second button</button>
        </div>
      );

      await user.tab();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.tab();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });

    it('ESC key dismisses click-triggered tooltip', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Click tooltip" trigger="click">
          <button type="button">Click me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // jest-axe Tests
  // ============================================================================
  describe('jest-axe Validation', () => {
    // Disable fake timers for axe tests to avoid interference
    beforeEach(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.useFakeTimers();
    });

    it('has no accessibility violations when hidden', async () => {
      const { container } = render(
        <Tooltip content="Test tooltip">
          <button type="button">Trigger</button>
        </Tooltip>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when visible', async () => {
      const { container } = render(
        <Tooltip content="Visible tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different placements', async () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;

      for (const placement of placements) {
        const { container, unmount } = render(
          <Tooltip content={`${placement} tooltip`} placement={placement} defaultOpen>
            <button type="button">Trigger</button>
          </Tooltip>
        );

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        const results = await axe(container);
        expect(results).toHaveNoViolations();

        unmount();
      }
    });

    it('has no accessibility violations with disabled tooltip', async () => {
      const { container } = render(
        <Tooltip content="Disabled tooltip" disabled>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with complex content', async () => {
      const { container } = render(
        <Tooltip
          content={
            <div>
              <strong>Bold text</strong>
              <p>Paragraph text</p>
            </div>
          }
          defaultOpen
        >
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with hover trigger', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Tooltip content="Hover tooltip" trigger="hover">
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with focus trigger', async () => {
      const { container } = render(
        <Tooltip content="Focus tooltip" trigger="focus">
          <button type="button">Focus me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      button.focus();

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with click trigger', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <Tooltip content="Click tooltip" trigger="click">
          <button type="button">Click me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations without arrow', async () => {
      const { container } = render(
        <Tooltip content="No arrow tooltip" arrow={false} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================================================
  // Screen Reader Behavior
  // ============================================================================
  describe('Screen Reader Behavior', () => {
    it('tooltip content is accessible to screen readers via aria-describedby', async () => {
      render(
        <Tooltip content="Helpful description" id="sr-tooltip" defaultOpen>
          <button type="button">Learn more</button>
        </Tooltip>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        const tooltip = screen.getByRole('tooltip');

        expect(button).toHaveAttribute('aria-describedby', 'sr-tooltip');
        expect(tooltip).toHaveAttribute('id', 'sr-tooltip');
        expect(tooltip).toHaveTextContent('Helpful description');
      });
    });

    it('maintains proper ID relationship between trigger and tooltip', async () => {
      render(
        <Tooltip content="Related content" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const button = screen.getByRole('button');
        const tooltip = screen.getByRole('tooltip');
        const tooltipId = tooltip.getAttribute('id');

        expect(button).toHaveAttribute('aria-describedby', tooltipId);
      });
    });
  });
});
