import { fireEvent, render } from '@testing-library/react';

import { Button } from './Button';

describe('Button FSM Integration Tests', () => {
  describe('State Visualization', () => {
    it('applies data-visual-state attribute based on FSM state', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.querySelector('button');

      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });

    it('transitions from idle to pressed state on mouse down', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseDown(button, { button: 0 });

      expect(button).toHaveAttribute('data-visual-state', 'pressed');
    });

    it('transitions from pressed back to hovered on mouse up', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseDown(button, { button: 0 });
      expect(button).toHaveAttribute('data-visual-state', 'pressed');

      fireEvent.mouseUp(button);
      expect(button).toHaveAttribute('data-visual-state', 'hovered');
    });

    it('transitions through hover states correctly', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'idle');

      fireEvent.mouseEnter(button);
      expect(button).toHaveAttribute('data-visual-state', 'hovered');

      fireEvent.mouseLeave(button);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });

    it('transitions through focus states correctly', () => {
      const { container } = render(<Button>Click me</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'idle');

      fireEvent.focus(button);
      expect(button).toHaveAttribute('data-visual-state', 'focused');

      fireEvent.blur(button);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });
  });

  describe('State Priority', () => {
    it('disables state takes priority over interactive states', () => {
      const { container } = render(<Button disabled>Click me</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseEnter(button);
      fireEvent.focus(button);

      expect(button).toHaveAttribute('data-visual-state', 'disabled');
      expect(button).toBeDisabled();
    });

    it('loading state takes priority over interactive states', () => {
      const { container } = render(<Button loading>Processing</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseEnter(button);
      fireEvent.focus(button);
      fireEvent.mouseDown(button, { button: 0 });

      expect(button).toHaveAttribute('data-visual-state', 'loading');
    });

    it('error state takes priority over idle states', () => {
      const { container } = render(<Button error>Error</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseLeave(button);

      expect(button).toHaveAttribute('data-visual-state', 'error');
    });

    it('disabled state takes priority over error and loading', () => {
      const { container } = render(
        <Button disabled loading error>
          Complex
        </Button>
      );
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'disabled');
    });
  });

  describe('Override State Handling', () => {
    it('transitions from interactive to loading state', () => {
      const { container, rerender } = render(<Button>Save</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseEnter(button);
      expect(button).toHaveAttribute('data-visual-state', 'hovered');

      rerender(<Button loading>Saving...</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'loading');
    });

    it('transitions from loading to error state', () => {
      const { container, rerender } = render(<Button loading>Processing</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'loading');

      rerender(<Button error>Error occurred</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'error');
    });

    it('recovers from error to idle state', () => {
      const { container, rerender } = render(<Button error>Error</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'error');

      rerender(<Button>Recovered</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });

    it('handles transition from disabled to enabled', () => {
      const { container, rerender } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'disabled');
      expect(button).toBeDisabled();

      rerender(<Button>Enabled</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Complex State Sequences', () => {
    it('handles realistic async operation flow', () => {
      const handleClick = jest.fn();
      const { container, rerender } = render(<Button onClick={handleClick}>Submit</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      // User hovers and focuses
      fireEvent.mouseEnter(button);
      expect(button).toHaveAttribute('data-visual-state', 'hovered');

      fireEvent.focus(button);
      expect(button).toHaveAttribute('data-visual-state', 'focused');

      // User clicks
      fireEvent.mouseDown(button, { button: 0 });
      expect(button).toHaveAttribute('data-visual-state', 'pressed');

      fireEvent.click(button);
      fireEvent.mouseUp(button);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Async operation starts
      rerender(
        <Button loading onClick={handleClick}>
          Submitting...
        </Button>
      );
      expect(button).toHaveAttribute('data-visual-state', 'loading');

      // Operation completes successfully
      rerender(<Button onClick={handleClick}>Submitted</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'focused');
    });

    it('handles error recovery flow', () => {
      const { container, rerender } = render(<Button>Save</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      // Start operation
      rerender(<Button loading>Saving...</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'loading');

      // Operation fails
      rerender(<Button error>Failed to save</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'error');

      // User can interact again
      fireEvent.mouseEnter(button);
      // Still shows error state (override)
      expect(button).toHaveAttribute('data-visual-state', 'error');

      // User dismisses or resets
      rerender(<Button>Save</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'idle');

      // Normal interaction resumes
      fireEvent.focus(button);
      expect(button).toHaveAttribute('data-visual-state', 'focused');
    });

    it('respects disabled state even after error', () => {
      const { container, rerender } = render(<Button error>Error</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'error');

      rerender(
        <Button disabled error>
          Disabled Error
        </Button>
      );
      expect(button).toHaveAttribute('data-visual-state', 'disabled');
      expect(button).toBeDisabled();
    });

    it('maintains focus state during error', () => {
      const { container, rerender } = render(<Button>Button</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.focus(button);
      expect(button).toHaveAttribute('data-visual-state', 'focused');

      rerender(<Button error>Error</Button>);
      expect(button).toHaveAttribute('data-visual-state', 'error');

      fireEvent.blur(button);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });
  });

  describe('Event Handling in FSM', () => {
    it('ignores non-left mouse button clicks', () => {
      const handleClick = jest.fn();
      const { container } = render(<Button onClick={handleClick}>Button</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseDown(button, { button: 1 }); // Middle button
      fireEvent.mouseDown(button, { button: 2 }); // Right button

      // Should not transition to pressed
      expect(button).toHaveAttribute('data-visual-state', 'idle');
    });

    it('left mouse button click transitions to pressed', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseDown(button, { button: 0 }); // Left button
      expect(button).toHaveAttribute('data-visual-state', 'pressed');
    });

    it('fires click handler only once per interaction', () => {
      const handleClick = jest.fn();
      const { container } = render(<Button onClick={handleClick}>Button</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.mouseDown(button, { button: 0 });
      fireEvent.click(button);
      fireEvent.mouseUp(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility with FSM', () => {
    it('exposes FSM state via data attribute for testing', () => {
      const { container } = render(<Button>Button</Button>);
      const button = container.querySelector('[data-visual-state="idle"]');

      expect(button).toBeInTheDocument();
    });

    it('maintains disabled state in FSM', () => {
      const { container } = render(<Button disabled>Disabled</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('data-visual-state', 'disabled');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('preserves aria-label through state transitions', () => {
      const { container, rerender } = render(<Button aria-label="Save document">Save</Button>);
      const button = container.querySelector('button') as HTMLButtonElement;

      expect(button).toHaveAttribute('aria-label', 'Save document');

      fireEvent.focus(button);
      expect(button).toHaveAttribute('aria-label', 'Save document');

      rerender(
        <Button loading aria-label="Save document">
          Saving...
        </Button>
      );
      expect(button).toHaveAttribute('aria-label', 'Save document');
    });
  });
});
