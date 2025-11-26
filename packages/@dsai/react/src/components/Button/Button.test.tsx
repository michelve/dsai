import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

    it('does not trigger onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Loading
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

  describe('Loading State', () => {
    it('shows spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('disables button when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('has aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('has aria-disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    it('shows loading text when provided', () => {
      render(
        <Button loading loadingText="Saving...">
          Save
        </Button>
      );
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });

    it('shows original children when no loadingText', () => {
      render(<Button loading>Save</Button>);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('hides icons when loading', () => {
      render(
        <Button loading startIcon={<span data-testid="start-icon">→</span>}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
    });
  });

  describe('Icon Support', () => {
    it('renders start icon', () => {
      render(<Button startIcon={<span data-testid="start-icon">→</span>}>With Icon</Button>);
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      render(<Button endIcon={<span data-testid="end-icon">←</span>}>With Icon</Button>);
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('renders both icons', () => {
      render(
        <Button
          startIcon={<span data-testid="start-icon">→</span>}
          endIcon={<span data-testid="end-icon">←</span>}
        >
          With Both Icons
        </Button>
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('positions start icon before text', () => {
      const { container } = render(
        <Button startIcon={<span data-testid="start-icon">→</span>}>Text</Button>
      );
      const button = container.querySelector('button');
      const children = Array.from(button?.children || []);
      const iconIndex = children.findIndex((child) =>
        child.querySelector('[data-testid="start-icon"]')
      );
      const textIndex = children.findIndex((child) => child.textContent === 'Text');
      expect(iconIndex).toBeLessThan(textIndex);
    });

    it('positions end icon after text', () => {
      const { container } = render(
        <Button endIcon={<span data-testid="end-icon">←</span>}>Text</Button>
      );
      const button = container.querySelector('button');
      const children = Array.from(button?.children || []);
      const iconIndex = children.findIndex((child) =>
        child.querySelector('[data-testid="end-icon"]')
      );
      const textIndex = children.findIndex((child) => child.textContent === 'Text');
      expect(iconIndex).toBeGreaterThan(textIndex);
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
      const testId = `test-button-${Math.random().toString(36).substr(2, 9)}`;
      render(<Button id={testId}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('id', testId);
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
      // eslint-disable-next-line jsx-a11y/no-autofocus -- Testing autoFocus functionality
      render(<Button autoFocus>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveFocus(); // autoFocus will auto-focus the element
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('marks start icon as aria-hidden for decorative use', () => {
      render(<Button startIcon={<span data-testid="start-icon">→</span>}>With Icon</Button>);
      const iconSpan = screen.getByTestId('start-icon').parentElement;

      expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
    });

    it('marks end icon as aria-hidden for decorative use', () => {
      render(<Button endIcon={<span data-testid="end-icon">←</span>}>With Icon</Button>);
      const iconSpan = screen.getByTestId('end-icon').parentElement;

      expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
    });

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

    it('has no violations when loading', async () => {
      const { container } = render(<Button loading>Loading</Button>);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('has no violations with icons', async () => {
      const { container } = render(
        <Button startIcon={<span>→</span>} endIcon={<span>←</span>}>
          With Icons
        </Button>
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
      render(<Button aria-expanded>Expand</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('accepts aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed>Toggle</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('has visible focus indicator', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');

      act(() => {
        button.focus();
      });

      expect(button).toHaveFocus();
    });
  });

  describe('Security (Prop Spreading Whitelist)', () => {
    it('allows data-testid attribute through whitelisted props', () => {
      render(<Button data-testid="test-button">Button</Button>);
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('allows form-related attributes', () => {
      render(
        <Button
          type="submit"
          form="my-form"
          formAction="/submit"
          formMethod="post"
          formTarget="_blank"
        >
          Submit
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('form', 'my-form');
      expect(button).toHaveAttribute('formAction', '/submit');
      expect(button).toHaveAttribute('formMethod', 'post');
      expect(button).toHaveAttribute('formTarget', '_blank');
    });

    it('allows title attribute', () => {
      render(<Button title="Click to submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('title', 'Click to submit');
    });

    it('does not accept arbitrary event handler props', () => {
      const handleMouseOver = jest.fn();
      // @ts-expect-error - intentionally testing that onMouseOver is not accepted
      render(<Button onMouseOver={handleMouseOver}>Test</Button>);

      fireEvent.mouseOver(screen.getByRole('button'));

      // Event handler should not be called since it's not in the props interface
      expect(handleMouseOver).not.toHaveBeenCalled();
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

      act(() => {
        ref.current?.focus();
      });

      expect(ref.current).toHaveFocus();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Aria-Live Announcements (Dynamic State Changes)', () => {
    it('renders aria-live region when announceText is provided', () => {
      render(<Button announceText="Saving...">Save</Button>);

      const announcement = screen.getByText('Saving...');
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('role', 'status');
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveAttribute('aria-atomic', 'true');
    });

    it('does not render aria-live region when announceText is not provided', () => {
      const { container } = render(<Button>Save</Button>);

      const liveRegions = container.querySelectorAll('[aria-live="polite"]');
      expect(liveRegions).toHaveLength(0);
    });

    it('hides aria-live region from visual display using sr-only technique', () => {
      const { container } = render(<Button announceText="Changes saved">Save</Button>);

      const announcement = screen.getByText('Changes saved');

      // Announcement region should be hidden visually (off-screen)
      // The announcement div itself has aria-live and role
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveAttribute('role', 'status');

      // Check for sr-only positioning styles
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toHaveStyle({
        position: 'absolute',
      });
    });

    it('allows disabling announcements with announce={false}', () => {
      const { container } = render(
        <Button announceText="Saving..." announce={false}>
          Save
        </Button>
      );

      const liveRegions = container.querySelectorAll('[aria-live="polite"]');
      expect(liveRegions).toHaveLength(0);
    });

    it('announces state changes during loading transition', () => {
      const { rerender } = render(
        <Button loading={false} announceText="Ready">
          Save
        </Button>
      );

      expect(screen.getByText('Ready')).toBeInTheDocument();

      rerender(
        <Button loading={true} announceText="Saving...">
          Save
        </Button>
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('announces different messages for success and error states', () => {
      const { rerender } = render(<Button announceText="Processing request...">Submit</Button>);

      expect(screen.getByText('Processing request...')).toBeInTheDocument();

      rerender(<Button announceText="Request completed successfully">Submit</Button>);

      expect(screen.getByText('Request completed successfully')).toBeInTheDocument();
    });
  });
});
