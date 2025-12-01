/**
 * Example component test demonstrating best practices
 * This shows how to test React components with user interactions
 */

import { render, screen, userEvent } from '../../../../../test/utils/test-utils';

// Example Button component for testing
// TODO: Replace with actual component from your library
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

function Button({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      data-testid="button"
    >
      {children}
    </button>
  );
}

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with text content', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should apply primary variant by default', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('btn-primary');
    });

    it('should apply secondary variant when specified', () => {
      render(<Button variant="secondary">Click me</Button>);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('btn-secondary');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText('Click me');
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByText('Click me');
      await userEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should be focusable with keyboard', async () => {
      render(<Button>Click me</Button>);

      const button = screen.getByText('Click me');
      await userEvent.tab();

      expect(button).toHaveFocus();
    });

    it('should activate on Enter key', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText('Click me');
      button.focus();
      await userEvent.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should activate on Space key', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText('Click me');
      button.focus();
      await userEvent.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Click me</Button>);

      const button = screen.getByText('Click me');
      expect(button).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByText('Click me');
      expect(button).not.toBeDisabled();
    });
  });
});
