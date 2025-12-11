/**
 * useFocusTrap Tests
 *
 * Comprehensive tests for the useFocusTrap hook.
 * Tests cover all options, edge cases, and accessibility behaviors.
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { useRef } from 'react';

import { useFocusTrap } from './useFocusTrap';

import type { UseFocusTrapOptions } from './useFocusTrap.types';

// Test component that uses the hook
function TestContainer({
  options = {},
  children,
}: {
  options?: UseFocusTrapOptions;
  children?: React.ReactNode;
}) {
  const { containerRef, isActive } = useFocusTrap<HTMLDivElement>(options);

  return (
    <div ref={containerRef} data-testid="container" data-active={isActive}>
      {children}
    </div>
  );
}

// Test component with ref for initial focus
function TestContainerWithInitialFocus({
  enabled = true,
  onEscape,
}: {
  enabled?: boolean;
  onEscape?: () => void;
}) {
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const { containerRef, isActive } = useFocusTrap<HTMLDivElement>({
    enabled,
    initialFocusRef,
    onEscape,
  });

  return (
    <div ref={containerRef} data-testid="container" data-active={isActive}>
      <button data-testid="first">First</button>
      <button ref={initialFocusRef} data-testid="initial">
        Initial Focus
      </button>
      <button data-testid="last">Last</button>
    </div>
  );
}

// Test component with ref for final focus
function TestContainerWithFinalFocus({ enabled = true }: { enabled?: boolean }) {
  const finalFocusRef = useRef<HTMLButtonElement>(null);
  const { containerRef, isActive } = useFocusTrap<HTMLDivElement>({
    enabled,
    finalFocusRef,
  });

  return (
    <>
      <button ref={finalFocusRef} data-testid="final-focus-target">
        Final Target
      </button>
      <div ref={containerRef} data-testid="container" data-active={isActive}>
        <button data-testid="inside">Inside</button>
      </div>
    </>
  );
}

// Test component for manual control
function TestContainerWithManualControl() {
  const { containerRef, activate, deactivate, isActive } = useFocusTrap<HTMLDivElement>({
    enabled: false,
  });

  return (
    <div>
      <button onClick={activate} data-testid="activate">
        Activate
      </button>
      <button onClick={deactivate} data-testid="deactivate">
        Deactivate
      </button>
      <div ref={containerRef} data-testid="container" data-active={isActive}>
        <button data-testid="inside">Inside</button>
      </div>
    </div>
  );
}

describe('useFocusTrap', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should return containerRef, activate, deactivate, and isActive', () => {
      const { result } = renderHook(() => useFocusTrap());

      expect(result.current.containerRef).toBeDefined();
      expect(typeof result.current.activate).toBe('function');
      expect(typeof result.current.deactivate).toBe('function');
      expect(typeof result.current.isActive).toBe('boolean');
    });

    it('should be active by default when enabled is true', () => {
      const { result } = renderHook(() => useFocusTrap({ enabled: true }));

      expect(result.current.isActive).toBe(true);
    });

    it('should be inactive when enabled is false', () => {
      const { result } = renderHook(() => useFocusTrap({ enabled: false }));

      expect(result.current.isActive).toBe(false);
    });
  });

  describe('autoFocus option', () => {
    it('should focus first focusable element by default', () => {
      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('should not auto-focus when autoFocus is false', () => {
      render(
        <TestContainer options={{ enabled: true, autoFocus: false }}>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('first')).not.toHaveFocus();
    });

    it('should focus container when no focusable elements exist', () => {
      render(
        <TestContainer options={{ enabled: true }}>
          <span>No focusable elements</span>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('container')).toHaveFocus();
      expect(screen.getByTestId('container')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('initialFocusRef option', () => {
    it('should focus initialFocusRef element instead of first focusable', () => {
      render(<TestContainerWithInitialFocus enabled={true} />);

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('initial')).toHaveFocus();
    });
  });

  describe('initialFocusDelay option', () => {
    it('should delay initial focus by specified amount', () => {
      render(
        <TestContainer options={{ enabled: true, initialFocusDelay: 100 }}>
          <button data-testid="first">First</button>
        </TestContainer>
      );

      // Focus should not be set immediately
      expect(screen.getByTestId('first')).not.toHaveFocus();

      // Advance timers by less than delay
      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(screen.getByTestId('first')).not.toHaveFocus();

      // Advance timers past delay
      act(() => {
        jest.advanceTimersByTime(60);
      });
      expect(screen.getByTestId('first')).toHaveFocus();
    });
  });

  describe('restoreFocus option', () => {
    it('should restore focus to previously focused element on deactivate', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const { rerender } = render(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: false }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      // Focus the outside button
      await user.click(screen.getByTestId('outside'));
      expect(screen.getByTestId('outside')).toHaveFocus();

      // Enable the trap
      rerender(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: true }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('inside')).toHaveFocus();

      // Disable the trap
      rerender(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: false }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      // Focus should be restored to the outside button
      expect(screen.getByTestId('outside')).toHaveFocus();
    });

    it('should not restore focus when restoreFocus is false', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const { rerender } = render(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: false, restoreFocus: false }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      // Focus the outside button
      await user.click(screen.getByTestId('outside'));

      // Enable the trap
      rerender(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: true, restoreFocus: false }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      act(() => {
        jest.runAllTimers();
      });

      // Disable the trap
      rerender(
        <>
          <button data-testid="outside">Outside</button>
          <TestContainer options={{ enabled: false, restoreFocus: false }}>
            <button data-testid="inside">Inside</button>
          </TestContainer>
        </>
      );

      // Focus should NOT be restored
      expect(screen.getByTestId('outside')).not.toHaveFocus();
    });
  });

  describe('finalFocusRef option', () => {
    it('should focus finalFocusRef element instead of previous element on deactivate', () => {
      const { rerender } = render(<TestContainerWithFinalFocus enabled={true} />);

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('inside')).toHaveFocus();

      // Disable the trap
      rerender(<TestContainerWithFinalFocus enabled={false} />);

      // Focus should go to finalFocusRef target
      expect(screen.getByTestId('final-focus-target')).toHaveFocus();
    });
  });

  describe('onEscape option', () => {
    it('should call onEscape when Escape key is pressed', () => {
      const onEscape = jest.fn();

      render(<TestContainerWithInitialFocus enabled={true} onEscape={onEscape} />);

      act(() => {
        jest.runAllTimers();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('should not call onEscape when trap is disabled', () => {
      const onEscape = jest.fn();

      render(<TestContainerWithInitialFocus enabled={false} onEscape={onEscape} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onEscape).not.toHaveBeenCalled();
    });

    it('should prevent default and stop propagation on Escape', () => {
      const onEscape = jest.fn();
      const parentHandler = jest.fn();

      render(
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div onKeyDown={parentHandler}>
          <TestContainerWithInitialFocus enabled={true} onEscape={onEscape} />
        </div>
      );

      act(() => {
        jest.runAllTimers();
      });

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('Tab key trapping', () => {
    it('should cycle focus forwards on Tab', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="third">Third</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('first')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('second')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('third')).toHaveFocus();

      // Should wrap to first
      await user.tab();
      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('should cycle focus backwards on Shift+Tab', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="first">First</button>
          <button data-testid="second">Second</button>
          <button data-testid="third">Third</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('first')).toHaveFocus();

      // Should wrap to last
      await user.tab({ shift: true });
      expect(screen.getByTestId('third')).toHaveFocus();

      await user.tab({ shift: true });
      expect(screen.getByTestId('second')).toHaveFocus();
    });
  });

  describe('manual activate/deactivate', () => {
    it('should activate manually when calling activate()', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<TestContainerWithManualControl />);

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'false');

      await user.click(screen.getByTestId('activate'));

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'true');
      expect(screen.getByTestId('inside')).toHaveFocus();
    });

    it('should deactivate manually when calling deactivate()', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<TestContainerWithManualControl />);

      // First activate
      await user.click(screen.getByTestId('activate'));

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'true');

      // Then deactivate
      await user.click(screen.getByTestId('deactivate'));

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'false');
    });
  });

  describe('enabled prop changes', () => {
    it('should activate when enabled changes from false to true', () => {
      const { rerender } = render(
        <TestContainer options={{ enabled: false }}>
          <button data-testid="button">Button</button>
        </TestContainer>
      );

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'false');

      rerender(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="button">Button</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'true');
      expect(screen.getByTestId('button')).toHaveFocus();
    });

    it('should deactivate when enabled changes from true to false', () => {
      const { rerender } = render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="button">Button</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'true');

      rerender(
        <TestContainer options={{ enabled: false }}>
          <button data-testid="button">Button</button>
        </TestContainer>
      );

      expect(screen.getByTestId('container')).toHaveAttribute('data-active', 'false');
    });
  });

  describe('edge cases', () => {
    it('should handle single focusable element', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="only">Only Button</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('only')).toHaveFocus();

      // Tab should keep focus on the same element
      await user.tab();
      expect(screen.getByTestId('only')).toHaveFocus();
    });

    it('should cleanup on unmount', () => {
      const { unmount } = render(
        <TestContainer options={{ enabled: true }}>
          <button>Button</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow();
    });

    it('should filter out hidden elements from focusable list', () => {
      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="visible">Visible</button>
          <button data-testid="hidden" style={{ display: 'none' }}>
            Hidden
          </button>
          <button data-testid="visible2">Visible 2</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('visible')).toHaveFocus();
    });

    it('should filter out visibility:hidden elements from focusable list', () => {
      render(
        <TestContainer options={{ enabled: true }}>
          <button data-testid="visible">Visible</button>
          <button data-testid="invisible" style={{ visibility: 'hidden' }}>
            Invisible
          </button>
          <button data-testid="visible2">Visible 2</button>
        </TestContainer>
      );

      act(() => {
        jest.runAllTimers();
      });

      expect(screen.getByTestId('visible')).toHaveFocus();
    });
  });

  describe('SSR safety', () => {
    it('should not throw when rendered in SSR environment', () => {
      // Mock isBrowser to return false
      const originalWindow = global.window;
      // @ts-expect-error - Simulating SSR
      delete global.window;

      expect(() => {
        renderHook(() => useFocusTrap({ enabled: true }));
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });
});
