import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { Button } from './Button';
import type { ButtonProps } from './Button.types';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('renders with complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('has base Bootstrap btn class', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn');
    });
  });

  describe('Variants', () => {
    const variants: ButtonProps['variant'][] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
      'outline-primary',
      'outline-secondary',
      'outline-success',
      'outline-danger',
      'outline-warning',
      'outline-info',
      'outline-light',
      'outline-dark',
      'link',
    ];

    variants.forEach((variant) => {
      it(`renders ${variant} variant with Bootstrap class`, () => {
        render(<Button variant={variant}>{variant}</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('btn');
        expect(button).toHaveClass(`btn-${variant}`);
      });
    });

    it('defaults to primary variant', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-primary');
    });
  });

  describe('Sizes', () => {
    it('renders small size with Bootstrap btn-sm class', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-sm');
    });

    it('renders medium size without size class (Bootstrap default)', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).not.toHaveClass('btn-sm');
      expect(button).not.toHaveClass('btn-lg');
    });

    it('renders large size with Bootstrap btn-lg class', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('btn-lg');
    });

    it('defaults to medium size (no size class)', () => {
      render(<Button>Default Size</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('btn-sm');
      expect(button).not.toHaveClass('btn-lg');
    });
  });

  describe('Interaction', () => {
    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('receives event object in onClick handler', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
        })
      );
    });
  });

  describe('Disabled State', () => {
    it('applies disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Button Types', () => {
    it('renders as button type by default', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('renders as submit type', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('renders as reset type', () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('Full Width', () => {
    it('applies Bootstrap w-100 class for full width', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-100');
    });

    it('does not apply w-100 class by default', () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole('button')).not.toHaveClass('w-100');
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('btn'); // Still has base Bootstrap class
    });

    it('accepts inline styles', () => {
      render(<Button style={{ margin: '10px' }}>Styled</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveStyle({ margin: '10px' });
    });
  });

  describe('HTML Attributes', () => {
    it('accepts id attribute', () => {
      render(<Button id="test-button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('id', 'test-button');
    });

    it('accepts name attribute', () => {
      render(<Button name="test-name">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('name', 'test-name');
    });

    it('accepts value attribute', () => {
      render(<Button value="test-value">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('value', 'test-value');
    });

    it('accepts tabIndex attribute', () => {
      render(<Button tabIndex={-1}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
    });

    it('accepts autoFocus attribute', () => {
      render(<Button autoFocus>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveFocus(); // autoFocus will auto-focus the element
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no violations with all variants', async () => {
      const { container } = render(
        <>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline-primary">Outline</Button>
          <Button variant="link">Link</Button>
        </>
      );
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('accepts aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('accepts aria-describedby', () => {
      render(<Button aria-describedby="help-text">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('accepts aria-controls', () => {
      render(<Button aria-controls="menu">Toggle Menu</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-controls', 'menu');
    });

    it('accepts aria-expanded', () => {
      render(<Button aria-expanded={true}>Expand</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('accepts aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed={true}>Toggle</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('has visible focus indicator', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>With Ref</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('button'));
    });

    it('allows calling focus() on ref', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Focusable</Button>);

      ref.current?.focus();

      expect(ref.current).toHaveFocus();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });
});
