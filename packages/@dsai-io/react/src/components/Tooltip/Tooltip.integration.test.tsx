// Tooltip.integration.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from './Tooltip';
import { TooltipGroup } from './TooltipGroup';
import { TooltipProvider } from './TooltipProvider';

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

describe('Tooltip Integration', () => {
  // ============================================================================
  // Provider + Instance Override
  // ============================================================================
  describe('Provider + Instance Override', () => {
    it('instance showDelay=0 overrides provider showDelay=500', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipProvider showDelay={500}>
          <Tooltip content="Instant" showDelay={0}>
            <button>Fast</button>
          </Tooltip>
          <Tooltip content="Slow">
            <button>Slow</button>
          </Tooltip>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'Fast' }));
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Instant');
      });
    });

    it('instance arrow=true overrides provider arrow=false', () => {
      render(
        <TooltipProvider arrow={false}>
          <Tooltip content="Has arrow" arrow isOpen>
            <button>With arrow</button>
          </Tooltip>
        </TooltipProvider>
      );

      expect(document.querySelector('.dsai-tooltip-arrow')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // Provider Nesting
  // ============================================================================
  describe('Provider Nesting', () => {
    it('inner provider overrides outer', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipProvider showDelay={700}>
          <TooltipProvider showDelay={100}>
            <Tooltip content="Inner">
              <button>Test</button>
            </Tooltip>
          </TooltipProvider>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button'));
      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Inner');
      });
    });
  });

  // ============================================================================
  // Group + Provider
  // ============================================================================
  describe('Group + Provider', () => {
    it('group inherits delay from provider', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipProvider showDelay={200}>
          <TooltipGroup>
            <Tooltip content="A">
              <button>A</button>
            </Tooltip>
            <Tooltip content="B">
              <button>B</button>
            </Tooltip>
          </TooltipGroup>
        </TooltipProvider>
      );

      await user.hover(screen.getByRole('button', { name: 'A' }));
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('A');
      });
    });
  });

  // ============================================================================
  // describeChild + Controlled Mode
  // ============================================================================
  describe('describeChild + Controlled Mode', () => {
    it('uses aria-labelledby in controlled open state', () => {
      render(
        <Tooltip content="Label text" describeChild={false} isOpen>
          <button>
            <span aria-hidden="true">icon</span>
          </button>
        </Tooltip>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-labelledby');
      expect(button).not.toHaveAttribute('aria-describedby');
    });
  });

  // ============================================================================
  // followCursor + Group
  // ============================================================================
  describe('followCursor + Group', () => {
    it('followCursor tooltip works inside a group', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TooltipGroup>
          <Tooltip content="Follows" followCursor>
            <button>A</button>
          </Tooltip>
          <Tooltip content="Static">
            <button>B</button>
          </Tooltip>
        </TooltipGroup>
      );

      await user.hover(screen.getByRole('button', { name: 'A' }));
      jest.advanceTimersByTime(400);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Follows');
      });

      expect(document.querySelector('.dsai-tooltip-arrow')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // Disabled Suppresses All Features
  // ============================================================================
  describe('Disabled Suppresses All', () => {
    it('disabled prevents touch interaction', () => {
      render(
        <Tooltip content="Touch" touchEnabled disabled>
          <button>Touch me</button>
        </Tooltip>
      );

      fireEvent.touchStart(screen.getByRole('button'), {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      jest.advanceTimersByTime(1000);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('disabled prevents followCursor interaction', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <Tooltip content="Cursor" followCursor disabled>
          <button>Hover</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));
      jest.advanceTimersByTime(400);

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // touchEnabled + Group
  // ============================================================================
  describe('touchEnabled + Group', () => {
    it('touch interaction works inside a group', async () => {
      render(
        <TooltipGroup>
          <Tooltip content="Touch A" touchEnabled>
            <button>A</button>
          </Tooltip>
          <Tooltip content="Touch B" touchEnabled>
            <button>B</button>
          </Tooltip>
        </TooltipGroup>
      );

      fireEvent.touchStart(screen.getByRole('button', { name: 'A' }), {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      jest.advanceTimersByTime(800);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Touch A');
      });
    });
  });

  // ============================================================================
  // Multiple Independent Groups
  // ============================================================================
  describe('Multiple Independent Groups', () => {
    it('renders groups independently', () => {
      render(
        <>
          <TooltipGroup>
            <Tooltip content="Group 1" isOpen>
              <button>G1</button>
            </Tooltip>
          </TooltipGroup>
          <TooltipGroup>
            <Tooltip content="Group 2" isOpen>
              <button>G2</button>
            </Tooltip>
          </TooltipGroup>
        </>
      );

      const tooltips = screen.getAllByRole('tooltip');
      expect(tooltips).toHaveLength(2);
      expect(tooltips[0]).toHaveTextContent('Group 1');
      expect(tooltips[1]).toHaveTextContent('Group 2');
    });
  });
});
