import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import { Tooltip } from './Tooltip';

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

describe('Tooltip', () => {
  // ============================================================================
  // Rendering Tests
  // ============================================================================
  describe('Rendering', () => {
    it('renders the trigger element', () => {
      render(
        <Tooltip content="Test tooltip">
          <button type="button">Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });

    it('does not render tooltip content initially', () => {
      render(
        <Tooltip content="Test tooltip">
          <button type="button">Hover me</button>
        </Tooltip>
      );

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders tooltip with custom id', async () => {
      render(
        <Tooltip content="Test tooltip" id="custom-tooltip" defaultOpen>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'custom-tooltip');
      });
    });

    it('renders tooltip with data-testid', async () => {
      render(
        <Tooltip content="Test tooltip" data-testid="test-tooltip" defaultOpen>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-tooltip')).toBeInTheDocument();
      });
    });

    it('renders tooltip with custom className', async () => {
      render(
        <Tooltip content="Test tooltip" className="custom-class" defaultOpen>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveClass('custom-class');
      });
    });

    it('renders tooltip content correctly', async () => {
      render(
        <Tooltip content="Test tooltip content" defaultOpen>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByText('Test tooltip content')).toBeInTheDocument();
      });
    });

    it('renders complex content as tooltip', async () => {
      render(
        <Tooltip
          content={
            <div>
              <strong>Bold text</strong>
              <span>Regular text</span>
            </div>
          }
          defaultOpen
        >
          <button type="button">Hover me</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByText('Bold text')).toBeInTheDocument();
        expect(screen.getByText('Regular text')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Trigger Tests
  // ============================================================================
  describe('Triggers', () => {
    describe('Hover trigger', () => {
      it('shows tooltip on hover', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Tooltip content="Hover tooltip" trigger="hover">
            <button type="button">Hover me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('hides tooltip on unhover', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Tooltip content="Hover tooltip" trigger="hover">
            <button type="button">Hover me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await user.unhover(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });

      it('respects showDelay prop', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Tooltip content="Delayed tooltip" trigger="hover" showDelay={500}>
            <button type="button">Hover me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        // Should not show immediately
        act(() => {
          jest.advanceTimersByTime(100);
        });
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        // Should show after delay
        act(() => {
          jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('respects hideDelay prop', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Tooltip content="Delayed hide tooltip" trigger="hover" hideDelay={500}>
            <button type="button">Hover me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await user.unhover(button);

        // Should still be visible immediately after unhover
        act(() => {
          jest.advanceTimersByTime(100);
        });
        expect(screen.getByRole('tooltip')).toBeInTheDocument();

        // Should hide after delay
        act(() => {
          jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });

    describe('Focus trigger', () => {
      it('shows tooltip on focus', async () => {
        render(
          <Tooltip content="Focus tooltip" trigger="focus">
            <button type="button">Focus me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        fireEvent.focus(button);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });

      it('hides tooltip on blur', async () => {
        render(
          <Tooltip content="Focus tooltip" trigger="focus">
            <button type="button">Focus me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');
        fireEvent.focus(button);

        act(() => {
          jest.advanceTimersByTime(100);
        });

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        fireEvent.blur(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });
    });

    describe('Click trigger', () => {
      it('shows tooltip on click', async () => {
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
      });

      it('hides tooltip on second click', async () => {
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

        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });
      });

      it('closes on ESC key for click trigger', async () => {
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

    describe('Multiple triggers', () => {
      it('supports multiple triggers as array', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Tooltip content="Multi trigger tooltip" trigger={['hover', 'focus']}>
            <button type="button">Interact with me</button>
          </Tooltip>
        );

        const button = screen.getByRole('button');

        // Test hover
        await user.hover(button);
        act(() => {
          jest.advanceTimersByTime(100);
        });
        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });

        await user.unhover(button);
        act(() => {
          jest.advanceTimersByTime(200);
        });
        await waitFor(() => {
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        });

        // Test focus
        fireEvent.focus(button);
        act(() => {
          jest.advanceTimersByTime(100);
        });
        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });
    });
  });

  // ============================================================================
  // Controlled Mode Tests
  // ============================================================================
  describe('Controlled Mode', () => {
    it('respects isOpen prop', async () => {
      const { rerender } = render(
        <Tooltip content="Controlled tooltip" isOpen={false}>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      rerender(
        <Tooltip content="Controlled tooltip" isOpen={true}>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when tooltip opens', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Test tooltip" onOpenChange={onOpenChange}>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it('calls onOpenChange when tooltip closes', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Test tooltip" onOpenChange={onOpenChange}>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await user.unhover(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('respects defaultOpen prop', async () => {
      render(
        <Tooltip content="Default open tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Disabled State Tests
  // ============================================================================
  describe('Disabled State', () => {
    it('does not show tooltip when disabled', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Disabled tooltip" disabled>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('does not call onOpenChange when disabled', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Disabled tooltip" disabled onOpenChange={onOpenChange}>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Placement Tests
  // ============================================================================
  describe('Placement', () => {
    const placements = [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ] as const;

    placements.forEach((placement) => {
      it(`renders tooltip with ${placement} placement`, async () => {
        render(
          <Tooltip content="Placement test" placement={placement} defaultOpen>
            <button type="button">Trigger</button>
          </Tooltip>
        );

        await waitFor(() => {
          expect(screen.getByRole('tooltip')).toBeInTheDocument();
        });
      });
    });
  });

  // ============================================================================
  // Arrow Tests
  // ============================================================================
  describe('Arrow', () => {
    it('renders with arrow by default', async () => {
      render(
        <Tooltip content="Arrow tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.querySelector('.dsai-tooltip-arrow')).toBeInTheDocument();
      });
    });

    it('renders without arrow when arrow={false}', async () => {
      render(
        <Tooltip content="No arrow tooltip" arrow={false} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip.querySelector('.dsai-tooltip-arrow')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // MaxWidth Tests
  // ============================================================================
  describe('MaxWidth', () => {
    it('applies maxWidth as number', async () => {
      render(
        <Tooltip content="Long tooltip content" maxWidth={200} defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({ maxWidth: '200px' });
      });
    });

    it('applies maxWidth as string', async () => {
      render(
        <Tooltip content="Long tooltip content" maxWidth="20rem" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveStyle({ maxWidth: '20rem' });
      });
    });
  });

  // ============================================================================
  // Ref Forwarding Tests
  // ============================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to trigger element', () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Tooltip content="Test tooltip">
          <button type="button" ref={ref}>
            Trigger
          </button>
        </Tooltip>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ============================================================================
  // Visual State Tests
  // ============================================================================
  describe('Visual States', () => {
    it('has data-visual-state="visible" when open', async () => {
      render(
        <Tooltip content="Test tooltip" defaultOpen>
          <button type="button">Trigger</button>
        </Tooltip>
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('data-visual-state', 'visible');
      });
    });
  });

  // ============================================================================
  // Portal Tests
  // ============================================================================
  describe('Portal', () => {
    it('renders in portal by default', async () => {
      render(
        <div data-testid="parent">
          <Tooltip content="Portal tooltip" defaultOpen>
            <button type="button">Trigger</button>
          </Tooltip>
        </div>
      );

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        const parent = screen.getByTestId('parent');
        expect(parent.contains(tooltip)).toBe(false);
      });
    });

    it('renders inline when portal={false}', async () => {
      const { container } = render(
        <div data-testid="parent">
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
  // describeChild Tests
  // ============================================================================
  describe('describeChild', () => {
    it('defaults to true (aria-describedby)', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Test tooltip">
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-describedby');
      });
    });

    it('uses aria-labelledby when describeChild is false', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Test tooltip" describeChild={false}>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      await user.hover(button);

      act(() => {
        jest.advanceTimersByTime(400);
      });

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-labelledby');
        expect(button).not.toHaveAttribute('aria-describedby');
      });
    });

    it('removes aria-labelledby when tooltip is hidden', () => {
      render(
        <Tooltip content="Test tooltip" describeChild={false}>
          <button type="button">Hover me</button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-labelledby');
    });
  });

  // ============================================================================
  // Integration with Button Component
  // ============================================================================
  describe('Integration with Button Component', () => {
    it('works with Button component that uses forwardRef', async () => {
      const { Button } = await import('../Button');

      render(
        <Tooltip content="Button tooltip" defaultOpen>
          <Button variant="primary">Click me</Button>
        </Tooltip>
      );

      // Advance timers for animation
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Verify tooltip is rendered
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Verify button has aria-describedby
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toHaveAttribute('aria-describedby');

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.style.position).toBe('absolute');
    });

    it('forwards ref correctly when used with Button component', async () => {
      const { Button } = await import('../Button');
      const buttonRef = createRef<HTMLButtonElement>();

      render(
        <Tooltip content="Button tooltip">
          <Button ref={buttonRef} variant="primary">
            Ref Button
          </Button>
        </Tooltip>
      );

      // The ref should be set to the button element
      expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(buttonRef.current?.tagName).toBe('BUTTON');
    });

    it('shows tooltip on hover for Button component', async () => {
      const { Button } = await import('../Button');
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Hover tooltip">
          <Button variant="primary">Hover me</Button>
        </Tooltip>
      );

      const button = screen.getByRole('button', { name: 'Hover me' });

      // Hover over the button
      await user.hover(button);

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Tooltip should appear
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('Hover tooltip')).toBeInTheDocument();
      });
    });
  });
});
