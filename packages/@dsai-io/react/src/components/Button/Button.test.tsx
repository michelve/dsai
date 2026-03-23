import '@testing-library/jest-dom';
import { randomUUID } from 'node:crypto';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createElement, createRef } from 'react';

import { Button } from './Button';

expect.extend(toHaveNoViolations);

import type { ButtonProps } from './Button.types';
import type { ComponentType } from 'react';

// Type-level guard: ButtonProps must not expose onMouseOver in its public API.
type ButtonPropsShouldOmitOnMouseOver = ButtonProps extends { onMouseOver: unknown } ? false : true;
// If ButtonProps ever includes onMouseOver, the following assignment will fail.
const assertButtonOmitsOnMouseOver: ButtonPropsShouldOmitOnMouseOver = true;
void assertButtonOmitsOnMouseOver;

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
      const testId = `test-button-${randomUUID()}`;
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
      // Use createElement to avoid linted autoFocus JSX while still validating behavior
      const Component = Button as ComponentType<Partial<ButtonProps>>;
      render(createElement(Component, { autoFocus: true }, 'Button'));
      const button = screen.getByRole('button');
      expect(button).toHaveFocus(); // autoFocus will auto-focus the element
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
      // Runtime check: even if an unsafe prop is forced in, it should not wire up.
      const unsafeProps = { onMouseOver: handleMouseOver } as unknown as ButtonProps;
      render(<Button {...unsafeProps}>Test</Button>);

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

      const announcement = screen.getByRole('status', { hidden: true });
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('aria-live', 'polite');
      expect(announcement).toHaveAttribute('aria-atomic', 'true');
      expect(announcement).toHaveTextContent('Saving...');
    });

    it('does not render aria-live region when announceText is not provided', () => {
      const { container } = render(<Button>Save</Button>);

      const liveRegions = container.querySelectorAll('[aria-live="polite"]');
      expect(liveRegions).toHaveLength(0);
    });

    it('hides aria-live region from visual display using sr-only technique', () => {
      const { container } = render(<Button announceText="Changes saved">Save</Button>);

      const announcement = screen.getByRole('status', { hidden: true });

      // Announcement region should be hidden visually (off-screen)
      // The announcement element has aria-live and implicit status role
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveAttribute('aria-live', 'polite');

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

  describe('Ghost Variant', () => {
    it('renders ghost variant with transparent background', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).not.toHaveClass('btn-ghost');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      // Ghost renders with inline transparent bg style
      expect(button.style.backgroundColor).toBe('transparent');
    });

    it('applies hover background when FSM is in hovered state', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);
      expect(button).toHaveStyle({ backgroundColor: 'var(--bs-tertiary-bg, rgba(0,0,0,0.05))' });
    });

    it('returns to transparent background after mouse leave', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');

      fireEvent.mouseEnter(button);
      expect(button).toHaveAttribute('data-visual-state', 'hovered');

      fireEvent.mouseLeave(button);
      expect(button).toHaveAttribute('data-visual-state', 'idle');
      expect(button.style.backgroundColor).toBe('transparent');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(<Button variant="ghost">Ghost Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Subtle Variants', () => {
    it('renders subtle-primary with Bootstrap subtle utilities', () => {
      render(<Button variant="subtle-primary">Subtle</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
      expect(button).toHaveClass('bg-primary-subtle');
      expect(button).toHaveClass('text-primary-emphasis');
      expect(button).toHaveClass('border-0');
      expect(button).toHaveAttribute('data-variant', 'subtle-primary');
    });

    it('renders subtle-danger with correct classes', () => {
      render(<Button variant="subtle-danger">Subtle Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-danger-subtle');
      expect(button).toHaveClass('text-danger-emphasis');
    });

    it('does not use btn-subtle class', () => {
      render(<Button variant="subtle-success">Subtle</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('btn-subtle-success');
    });

    it('has no accessibility violations', async () => {
      const { container } = render(
        <Button variant="subtle-primary">Subtle Primary</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Icon Size', () => {
    it('renders icon size with square dimensions', () => {
      render(
        <Button size="icon" aria-label="Settings" startIcon={<span>⚙</span>}>
          {''}
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '2.5rem', height: '2.5rem' });
    });

    it('centers content in icon size', () => {
      render(
        <Button size="icon" aria-label="Close" startIcon={<span>×</span>}>
          {''}
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
    });

    it('has no accessibility violations with aria-label', async () => {
      const { container } = render(
        <Button size="icon" aria-label="Close">
          ×
        </Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Loading Position', () => {
    it('renders spinner at start position by default', () => {
      const { container } = render(<Button loading>Loading</Button>);
      const button = container.querySelector('button');
      const children = Array.from(button?.children || []);
      // First child should be the spinner wrapper
      expect(children[0]).toHaveAttribute('aria-hidden', 'true');
      expect(children[0].querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('renders spinner at end position', () => {
      const { container } = render(
        <Button loading loadingPosition="end">
          Loading
        </Button>
      );
      const button = container.querySelector('button');
      const children = Array.from(button?.children || []);
      const lastChild = children[children.length - 1];
      expect(lastChild).toHaveAttribute('aria-hidden', 'true');
      expect(lastChild.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('renders spinner at center position with hidden text', () => {
      const { container } = render(
        <Button loading loadingPosition="center">
          Save
        </Button>
      );
      const button = container.querySelector('button');
      // Text should be invisible but present (for layout)
      const hiddenText = button?.querySelector('span[style*="visibility: hidden"]');
      expect(hiddenText).toBeInTheDocument();
      expect(hiddenText?.textContent).toBe('Save');
      // Spinner should be present
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('hides icons when loading regardless of position', () => {
      render(
        <Button
          loading
          loadingPosition="end"
          startIcon={<span data-testid="start-icon">→</span>}
        >
          Loading
        </Button>
      );
      expect(screen.queryByTestId('start-icon')).not.toBeInTheDocument();
    });
  });

  describe('Custom Loading Indicator', () => {
    it('renders custom loading indicator instead of default spinner', () => {
      const { container } = render(
        <Button loading loadingIndicator={<span data-testid="custom-loader">...</span>}>
          Loading
        </Button>
      );
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      // Default Spinner component should not be present (it has class 'spinner-border')
      expect(container.querySelector('.spinner-border')).not.toBeInTheDocument();
    });

    it('renders custom loading indicator at end position', () => {
      const { container } = render(
        <Button
          loading
          loadingPosition="end"
          loadingIndicator={<span data-testid="custom-loader">⏳</span>}
        >
          Saving
        </Button>
      );
      const button = container.querySelector('button');
      const children = Array.from(button?.children || []);
      const lastChild = children[children.length - 1];
      expect(lastChild.querySelector('[data-testid="custom-loader"]')).toBeInTheDocument();
    });

    it('renders custom loading indicator at center position', () => {
      render(
        <Button
          loading
          loadingPosition="center"
          loadingIndicator={<span data-testid="custom-loader">●●●</span>}
        >
          Save
        </Button>
      );
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });
  });
});
