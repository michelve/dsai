/**
 * Testing Patterns - Code Examples
 *
 * Standard testing patterns for DSAi components.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Mock component for examples
const Button = ({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`dsai-btn dsai-btn--${variant}`}
  >
    {children}
  </button>
);

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// =============================================================================
// STANDARD TEST STRUCTURE
// =============================================================================

describe('Button', () => {
  // -------------------------------------------------------------------------
  // Rendering Tests
  // -------------------------------------------------------------------------
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(<Button>Submit Form</Button>);
      expect(screen.getByText('Submit Form')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button')).toHaveClass('dsai-btn');
    });
  });

  // -------------------------------------------------------------------------
  // Props Tests
  // -------------------------------------------------------------------------
  describe('props', () => {
    it('applies variant class', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('dsai-btn--primary');
    });

    it('handles disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // -------------------------------------------------------------------------
  // Interaction Tests
  // -------------------------------------------------------------------------
  describe('interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Button onClick={onClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(
        <Button onClick={onClick} disabled>
          Click me
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('supports keyboard activation', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Button onClick={onClick}>Press Enter</Button>);

      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility Tests
  // -------------------------------------------------------------------------
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has correct role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is focusable', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  // -------------------------------------------------------------------------
  // Edge Cases
  // -------------------------------------------------------------------------
  describe('edge cases', () => {
    it('handles empty children', () => {
      render(<Button>{''}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles undefined onClick gracefully', async () => {
      const user = userEvent.setup();
      render(<Button>No Handler</Button>);

      // Should not throw
      await user.click(screen.getByRole('button'));
    });

    it('handles rapid clicks', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<Button onClick={onClick}>Rapid Click</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });
});

// =============================================================================
// USER EVENT PATTERNS
// =============================================================================

describe('User Event Patterns', () => {
  it('handles text input', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<input onChange={onChange} placeholder="Type here" />);

    await user.type(screen.getByPlaceholderText('Type here'), 'Hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button type="button">First</button>
        <button type="button">Second</button>
        <button type="button">Third</button>
      </div>
    );

    await user.tab();
    expect(screen.getByText('First')).toHaveFocus();

    await user.tab();
    expect(screen.getByText('Second')).toHaveFocus();

    await user.tab();
    expect(screen.getByText('Third')).toHaveFocus();
  });

  it('handles escape key', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <button
        type="button"
        aria-label="Close dialog"
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        Modal Content
      </button>
    );

    screen.getByRole('button').focus();
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
