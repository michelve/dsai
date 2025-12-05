import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';

import { Popover } from './Popover';

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

describe('Popover', () => {
  // ============================================================================
  // Rendering Tests
  // ============================================================================
  describe('Rendering', () => {
    it('renders the trigger element', () => {
      render(
        <Popover content="Test content">
          <button type="button">Click me</button>
        </Popover>
      );

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('does not render popover content initially', () => {
      render(
        <Popover content="Test content">
          <button type="button">Click me</button>
        </Popover>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders popover with custom id', async () => {
      render(
        <Popover content="Test content" id="custom-popover" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveAttribute('id', 'custom-popover');
      });
    });

    it('renders popover with data-testid', async () => {
      render(
        <Popover content="Test content" data-testid="test-popover" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-popover')).toBeInTheDocument();
      });
    });

    it('renders popover with custom className', async () => {
      render(
        <Popover content="Test content" className="custom-class" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('custom-class');
      });
    });

    it('renders popover content correctly', async () => {
      render(
        <Popover content="Test popover content" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Test popover content')).toBeInTheDocument();
      });
    });

    it('renders popover with header', async () => {
      render(
        <Popover header="Popover Title" content="Test content" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Popover Title')).toBeInTheDocument();
        expect(screen.getByText('Popover Title')).toHaveClass('popover-header');
      });
    });

    it('renders complex content as popover body', async () => {
      render(
        <Popover
          content={
            <div>
              <strong>Bold text</strong>
              <span>Regular text</span>
            </div>
          }
          defaultOpen
        >
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Bold text')).toBeInTheDocument();
        expect(screen.getByText('Regular text')).toBeInTheDocument();
      });
    });

    it('renders with close button when showCloseButton is true', async () => {
      render(
        <Popover content="Test content" showCloseButton defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close popover' })).toBeInTheDocument();
      });
    });

    it('renders with custom close button label', async () => {
      render(
        <Popover content="Test content" showCloseButton closeButtonLabel="Dismiss" defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Trigger Tests
  // ============================================================================
  describe('Triggers', () => {
    describe('Click trigger (default)', () => {
      it('shows popover on click', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Click popover">
            <button type="button">Click me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });

      it('hides popover on second click', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Click popover">
            <button type="button">Click me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });

      it('closes on ESC key', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Click popover">
            <button type="button">Click me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

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

      it('respects closeOnEscape=false', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Click popover" closeOnEscape={false}>
            <button type="button">Click me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.click(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        await user.keyboard('{Escape}');

        act(() => {
          jest.advanceTimersByTime(200);
        });

        // Should still be visible
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    describe('Hover trigger', () => {
      it('shows popover on hover', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Hover popover" trigger="hover">
            <button type="button">Hover me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });

      it('hides popover on unhover', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Hover popover" trigger="hover">
            <button type="button">Hover me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        await user.unhover(button);

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });

      it('respects showDelay prop', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Delayed popover" trigger="hover" showDelay={500}>
            <button type="button">Hover me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        // Should not show immediately
        act(() => {
          jest.advanceTimersByTime(100);
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Should show after delay
        act(() => {
          jest.advanceTimersByTime(500);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });

      it('respects hideDelay prop', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Delayed hide popover" trigger="hover" hideDelay={500}>
            <button type="button">Hover me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        await user.hover(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        await user.unhover(button);

        // Should still be visible immediately after unhover
        act(() => {
          jest.advanceTimersByTime(100);
        });
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        // Should hide after delay
        act(() => {
          jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });
    });

    describe('Focus trigger', () => {
      it('shows popover on focus', async () => {
        render(
          <Popover content="Focus popover" trigger="focus">
            <button type="button">Focus me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        fireEvent.focus(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });

      it('hides popover on blur', async () => {
        render(
          <Popover content="Focus popover" trigger="focus">
            <button type="button">Focus me</button>
          </Popover>
        );

        const button = screen.getByRole('button');
        fireEvent.focus(button);

        act(() => {
          jest.advanceTimersByTime(200);
        });

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        fireEvent.blur(button);

        act(() => {
          jest.advanceTimersByTime(300);
        });

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });
    });

    describe('Multiple triggers', () => {
      it('supports multiple triggers as array', async () => {
        const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

        render(
          <Popover content="Multi trigger popover" trigger={['hover', 'focus']}>
            <button type="button">Interact with me</button>
          </Popover>
        );

        const button = screen.getByRole('button');

        // Test hover
        await user.hover(button);
        act(() => {
          jest.advanceTimersByTime(200);
        });
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        await user.unhover(button);
        act(() => {
          jest.advanceTimersByTime(300);
        });
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        // Test focus
        fireEvent.focus(button);
        act(() => {
          jest.advanceTimersByTime(200);
        });
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });
    });
  });

  // ============================================================================
  // Close Button Tests
  // ============================================================================
  describe('Close Button', () => {
    it('closes popover when close button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Closeable popover" showCloseButton defaultOpen>
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close popover' });
      await user.click(closeButton);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('calls onOpenChange when close button is clicked', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover
          content="Closeable popover"
          showCloseButton
          defaultOpen
          onOpenChange={onOpenChange}
        >
          <button type="button">Click me</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: 'Close popover' });
      await user.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // ============================================================================
  // Controlled Mode Tests
  // ============================================================================
  describe('Controlled Mode', () => {
    it('respects isOpen prop', async () => {
      const { rerender } = render(
        <Popover content="Controlled popover" isOpen={false}>
          <button type="button">Trigger</button>
        </Popover>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(
        <Popover content="Controlled popover" isOpen={true}>
          <button type="button">Trigger</button>
        </Popover>
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when popover opens', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Test popover" onOpenChange={onOpenChange}>
          <button type="button">Click me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true);
      });
    });

    it('calls onOpenChange when popover closes', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Test popover" onOpenChange={onOpenChange}>
          <button type="button">Click me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('respects defaultOpen prop', async () => {
      render(
        <Popover content="Default open popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Disabled State Tests
  // ============================================================================
  describe('Disabled State', () => {
    it('does not show popover when disabled', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Disabled popover" disabled>
          <button type="button">Click me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('does not call onOpenChange when disabled', async () => {
      const onOpenChange = jest.fn();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Disabled popover" disabled onOpenChange={onOpenChange}>
          <button type="button">Click me</button>
        </Popover>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(200);
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
      it(`renders popover with ${placement} placement`, async () => {
        render(
          <Popover content="Placement test" placement={placement} defaultOpen>
            <button type="button">Trigger</button>
          </Popover>
        );

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
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
        <Popover content="Arrow popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.querySelector('.popover-arrow')).toBeInTheDocument();
      });
    });

    it('renders without arrow when arrow={false}', async () => {
      render(
        <Popover content="No arrow popover" arrow={false} defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover.querySelector('.popover-arrow')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // MaxWidth Tests
  // ============================================================================
  describe('MaxWidth', () => {
    it('applies maxWidth as number', async () => {
      render(
        <Popover content="Long popover content" maxWidth={300} defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveStyle({ maxWidth: '300px' });
      });
    });

    it('applies maxWidth as string', async () => {
      render(
        <Popover content="Long popover content" maxWidth="25rem" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveStyle({ maxWidth: '25rem' });
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
        <Popover content="Test popover">
          <button type="button" ref={ref}>
            Trigger
          </button>
        </Popover>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ============================================================================
  // Visual State Tests
  // ============================================================================
  describe('Visual States', () => {
    it('has data-visual-state="visible" when fully open', async () => {
      render(
        <Popover content="Test popover" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).toHaveAttribute('data-visual-state', 'visible');
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
          <Popover content="Portal popover" defaultOpen>
            <button type="button">Trigger</button>
          </Popover>
        </div>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        const parent = screen.getByTestId('parent');
        expect(parent.contains(popover)).toBe(false);
      });
    });

    it('renders inline when portal={false}', async () => {
      const { container } = render(
        <div data-testid="parent">
          <Popover content="Inline popover" portal={false} defaultOpen>
            <button type="button">Trigger</button>
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
  // Click Outside Tests
  // ============================================================================
  describe('Click Outside', () => {
    it('closes on click outside by default', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <Popover content="Click outside popover" defaultOpen>
            <button type="button">Trigger</button>
          </Popover>
          <button type="button" data-testid="outside">
            Outside
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const outsideButton = screen.getByTestId('outside');
      await user.click(outsideButton);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('respects closeOnClickOutside=false', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <Popover content="No close on outside" closeOnClickOutside={false} defaultOpen>
            <button type="button">Trigger</button>
          </Popover>
          <button type="button" data-testid="outside">
            Outside
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const outsideButton = screen.getByTestId('outside');
      await user.click(outsideButton);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      // Should still be visible
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Bootstrap Classes Tests
  // ============================================================================
  describe('Bootstrap Classes', () => {
    it('applies popover class', async () => {
      render(
        <Popover content="Test content" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('popover');
      });
    });

    it('applies bs-popover-auto class', async () => {
      render(
        <Popover content="Test content" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toHaveClass('bs-popover-auto');
      });
    });

    it('header has popover-header class', async () => {
      render(
        <Popover header="Title" content="Content" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Title')).toHaveClass('popover-header');
      });
    });

    it('body has popover-body class', async () => {
      render(
        <Popover content="Body content" defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        expect(screen.getByText('Body content')).toHaveClass('popover-body');
      });
    });
  });

  // ============================================================================
  // Integration with Button Component
  // ============================================================================
  describe('Integration with Button Component', () => {
    it('works with Button component that uses forwardRef', async () => {
      const { Button } = await import('../Button');

      render(
        <Popover content="Button popover" defaultOpen>
          <Button variant="primary">Click me</Button>
        </Popover>
      );

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('forwards ref correctly when used with Button component', async () => {
      const { Button } = await import('../Button');
      const buttonRef = createRef<HTMLButtonElement>();

      render(
        <Popover content="Button popover">
          <Button ref={buttonRef} variant="primary">
            Ref Button
          </Button>
        </Popover>
      );

      expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(buttonRef.current?.tagName).toBe('BUTTON');
    });

    it('shows popover on click for Button component', async () => {
      const { Button } = await import('../Button');
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Popover content="Click popover">
          <Button variant="primary">Click me</Button>
        </Popover>
      );

      const button = screen.getByRole('button', { name: 'Click me' });
      await user.click(button);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Click popover')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // Focus Trap Tests
  // ============================================================================
  describe('Focus Trap', () => {
    it('applies aria-modal when trapFocus is true', async () => {
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

    it('does not apply aria-modal when trapFocus is false', async () => {
      render(
        <Popover content="Non-modal popover" trapFocus={false} defaultOpen>
          <button type="button">Trigger</button>
        </Popover>
      );

      await waitFor(() => {
        const popover = screen.getByRole('dialog');
        expect(popover).not.toHaveAttribute('aria-modal');
      });
    });
  });
});
