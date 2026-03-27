import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';
import { TooltipProvider } from './TooltipProvider';

// Mock ResizeObserver for Floating UI
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('TooltipProvider', () => {
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <TooltipProvider>
          <span data-testid="child">Hello</span>
        </TooltipProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('provides 300ms showDelay by default (tooltip does not appear immediately)', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <TooltipProvider>
          <Tooltip content="Provider tooltip">
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'Hover me' }));

      // After 100ms, tooltip should NOT be visible yet (default is 300ms)
      jest.advanceTimersByTime(100);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // After 300ms total, tooltip should appear
      jest.advanceTimersByTime(200);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('provides 150ms hideDelay by default', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <TooltipProvider>
          <Tooltip content="Provider tooltip">
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>
      );

      // Show tooltip
      await user.hover(screen.getByRole('button', { name: 'Hover me' }));
      jest.advanceTimersByTime(300);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Unhover
      await user.unhover(screen.getByRole('button', { name: 'Hover me' }));

      // After 50ms, tooltip should still be visible (hideDelay is 150ms)
      jest.advanceTimersByTime(50);
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  describe('Custom Values', () => {
    it('overrides showDelay', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <TooltipProvider showDelay={500}>
          <Tooltip content="Slow tooltip">
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'Hover me' }));

      // After 300ms, tooltip should NOT be visible (provider set 500ms)
      jest.advanceTimersByTime(300);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

      // After 500ms total, tooltip should appear
      jest.advanceTimersByTime(200);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('overrides arrow default', () => {
      render(
        <TooltipProvider arrow={false}>
          <Tooltip content="No arrow" isOpen>
            <button>Target</button>
          </Tooltip>
        </TooltipProvider>
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      // When arrow is false, FloatingArrow should not be rendered
      expect(tooltip.querySelector('.dsai-tooltip-arrow')).toBeNull();
    });
  });

  describe('Instance Override', () => {
    it('instance prop takes precedence over provider', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <TooltipProvider showDelay={500}>
          <Tooltip content="Fast tooltip" showDelay={0}>
            <button>Hover me</button>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'Hover me' }));

      // Instance showDelay=0 overrides provider's 500ms
      jest.advanceTimersByTime(1);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('instance arrow prop takes precedence over provider', () => {
      render(
        <TooltipProvider arrow={false}>
          <Tooltip content="With arrow" arrow={true} isOpen>
            <button>Target</button>
          </Tooltip>
        </TooltipProvider>
      );

      const tooltip = screen.getByRole('tooltip');
      expect(tooltip.querySelector('.dsai-tooltip-arrow')).not.toBeNull();
    });
  });

  describe('Nesting', () => {
    it('inner provider overrides outer provider', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <TooltipProvider showDelay={500}>
          <TooltipProvider showDelay={100}>
            <Tooltip content="Inner tooltip">
              <button>Hover me</button>
            </Tooltip>
          </TooltipProvider>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'Hover me' }));

      // Inner provider set 100ms, so after 100ms tooltip should appear
      jest.advanceTimersByTime(100);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });
    });

    it('inner provider inherits unset values from outer', () => {
      render(
        <TooltipProvider arrow={false}>
          <TooltipProvider showDelay={100}>
            <Tooltip content="Inherited" isOpen>
              <button>Target</button>
            </Tooltip>
          </TooltipProvider>
        </TooltipProvider>
      );

      const tooltip = screen.getByRole('tooltip');
      // arrow=false from outer should be inherited since inner didn't set it
      expect(tooltip.querySelector('.dsai-tooltip-arrow')).toBeNull();
    });
  });
});
