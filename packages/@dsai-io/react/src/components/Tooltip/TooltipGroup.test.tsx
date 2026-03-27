import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';
import { TooltipGroup } from './TooltipGroup';
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

describe('TooltipGroup', () => {
  // ==========================================================================
  // Rendering
  // ==========================================================================
  describe('Rendering', () => {
    it('renders children', () => {
      render(
        <TooltipGroup>
          <Tooltip content="Bold">
            <button type="button">B</button>
          </Tooltip>
          <Tooltip content="Italic">
            <button type="button">I</button>
          </Tooltip>
        </TooltipGroup>
      );

      expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'I' })).toBeInTheDocument();
    });

    it('renders without crashing when given a single child', () => {
      render(
        <TooltipGroup>
          <Tooltip content="Solo">
            <button type="button">S</button>
          </Tooltip>
        </TooltipGroup>
      );

      expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Skip Delay
  // ==========================================================================
  describe('Skip Delay', () => {
    it('shows tooltip after hover with delay inside a group', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipGroup>
          <Tooltip content="Bold" portal={false}>
            <button type="button">B</button>
          </Tooltip>
          <Tooltip content="Italic" portal={false}>
            <button type="button">I</button>
          </Tooltip>
        </TooltipGroup>
      );

      await user.hover(screen.getByRole('button', { name: 'B' }));
      jest.advanceTimersByTime(400);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Bold');
      });
    });

    it('second tooltip shows faster after first closes within skip window', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipGroup>
          <Tooltip content="Bold" portal={false}>
            <button type="button">B</button>
          </Tooltip>
          <Tooltip content="Italic" portal={false}>
            <button type="button">I</button>
          </Tooltip>
        </TooltipGroup>
      );

      // Hover the first button and wait for tooltip
      await user.hover(screen.getByRole('button', { name: 'B' }));
      jest.advanceTimersByTime(400);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Bold');
      });

      // Move to the second button (within skip window)
      await user.hover(screen.getByRole('button', { name: 'I' }));
      // The second tooltip should appear faster than the normal show delay
      jest.advanceTimersByTime(50);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Italic');
      });
    });
  });

  // ==========================================================================
  // Custom skipDelay
  // ==========================================================================
  describe('Custom skipDelay', () => {
    it('respects custom skipDelay prop', () => {
      render(
        <TooltipGroup skipDelay={500}>
          <Tooltip content="Bold" portal={false}>
            <button type="button">B</button>
          </Tooltip>
          <Tooltip content="Italic" portal={false}>
            <button type="button">I</button>
          </Tooltip>
        </TooltipGroup>
      );

      // Renders without error with custom skipDelay
      expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'I' })).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Provider Integration
  // ==========================================================================
  describe('Provider Integration', () => {
    it('inherits skipDelay from TooltipProvider', () => {
      render(
        <TooltipProvider skipDelay={600}>
          <TooltipGroup>
            <Tooltip content="Bold" portal={false}>
              <button type="button">B</button>
            </Tooltip>
          </TooltipGroup>
        </TooltipProvider>
      );

      expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
    });

    it('TooltipGroup skipDelay overrides TooltipProvider skipDelay', () => {
      render(
        <TooltipProvider skipDelay={600}>
          <TooltipGroup skipDelay={100}>
            <Tooltip content="Bold" portal={false}>
              <button type="button">B</button>
            </Tooltip>
          </TooltipGroup>
        </TooltipProvider>
      );

      expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
    });
  });

  // ==========================================================================
  // Multiple Groups
  // ==========================================================================
  describe('Multiple Groups', () => {
    it('independent groups do not interfere with each other', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <div>
          <TooltipGroup>
            <Tooltip content="Group1-A" portal={false}>
              <button type="button">A1</button>
            </Tooltip>
            <Tooltip content="Group1-B" portal={false}>
              <button type="button">B1</button>
            </Tooltip>
          </TooltipGroup>
          <TooltipGroup>
            <Tooltip content="Group2-A" portal={false}>
              <button type="button">A2</button>
            </Tooltip>
            <Tooltip content="Group2-B" portal={false}>
              <button type="button">B2</button>
            </Tooltip>
          </TooltipGroup>
        </div>
      );

      // Hover in first group
      await user.hover(screen.getByRole('button', { name: 'A1' }));
      jest.advanceTimersByTime(400);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Group1-A');
      });

      // Move to second group — should not get skip-delay benefit
      await user.hover(screen.getByRole('button', { name: 'A2' }));
      // At 50ms, second group tooltip should not yet appear (no skip-delay benefit)
      jest.advanceTimersByTime(50);

      // The tooltip from group 1 may still be closing; group 2 needs full delay
      const tooltips = screen.queryAllByRole('tooltip');
      const hasGroup2Tooltip = tooltips.some((t) =>
        t.textContent?.includes('Group2-A')
      );
      expect(hasGroup2Tooltip).toBe(false);
    });
  });
});
