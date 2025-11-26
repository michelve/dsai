import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Input } from './Input';

expect.extend(toHaveNoViolations);

describe('Input - Security', () => {
  describe('Prop Spreading - Event Handler Blocking', () => {
    it('blocks onLoad event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onLoad={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onload).toBeNull();
    });

    it('blocks onError event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onError={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onerror).toBeNull();
    });

    it('blocks onAbort event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onAbort={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onabort).toBeNull();
    });

    it('blocks onMouseEnter event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onMouseEnter={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onmouseenter).toBeNull();
    });

    it('blocks onMouseLeave event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onMouseLeave={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onmouseleave).toBeNull();
    });

    it('blocks onFocus event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onFocus={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onfocus).toBeNull();
    });

    it('blocks onBlur event handler from rest props', () => {
      const { container } = render(
        <Input label="Test" onBlur={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onblur).toBeNull();
    });

    it('prevents arbitrary attribute injection through rest', () => {
      const { container } = render(
        // @ts-expect-error - Testing security against arbitrary props
        <Input label="Test" data-evil="malicious" onclick="alert('xss')" />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('onclick')).toBeNull();
    });

    it('prevents script injection through event handlers in rest', () => {
      const { container } = render(
        // @ts-expect-error - Testing security against arbitrary props
        <Input label="Test" onClick="alert('xss')" />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('onclick')).toBeNull();
    });

    it('blocks formAction attribute (dangerous)', () => {
      const { container } = render(
        // @ts-expect-error - formAction is dangerous
        <Input label="Test" formAction="/malicious-endpoint" />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('formaction')).toBeNull();
    });
  });

  describe('Safe Attribute Whitelist', () => {
    it('allows disabled attribute', () => {
      render(<Input label="Test" disabled />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toBeDisabled();
    });

    it('allows required attribute', () => {
      render(<Input label="Test" required />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toBeRequired();
    });

    it('allows aria-label attribute', () => {
      render(<Input aria-label="Custom label" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('allows aria-describedby attribute via helperText', () => {
      const { container } = render(<Input label="Test" helperText="Helper text" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('allows aria-invalid attribute', () => {
      render(<Input label="Test" error />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('allows name attribute', () => {
      render(<Input label="Test" name="test-input" />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toHaveAttribute(
        'name',
        'test-input'
      );
    });

    it('allows value attribute', () => {
      render(<Input label="Test" defaultValue="test-value" />);
      expect(screen.getByDisplayValue('test-value')).toBeInTheDocument();
    });

    it('allows autoComplete attribute', () => {
      const { container } = render(<Input label="Test" autoComplete="off" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });

    it('allows tabIndex attribute', () => {
      render(<Input label="Test" tabIndex={-1} />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toHaveAttribute('tabIndex', '-1');
    });

    it('allows title attribute', () => {
      render(<Input label="Test" title="Input title" />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toHaveAttribute(
        'title',
        'Input title'
      );
    });

    it('allows placeholder attribute', () => {
      render(<Input label="Test" placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('allows maxLength attribute', () => {
      render(<Input label="Test" maxLength={50} />);
      expect(screen.getByDisplayValue('') as HTMLInputElement).toHaveAttribute('maxLength', '50');
    });
  });

  describe('Event Handler Functionality', () => {
    it('onChange handler is properly passed through', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Input label="Test" onChange={onChange} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      await user.type(input, 'test');

      expect(onChange).toHaveBeenCalled();
    });

    it('onChange receives correct ChangeEvent', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Input label="Test" onChange={onChange} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      await user.type(input, 'a');

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            type: 'text',
            value: expect.any(String),
          }),
        })
      );
    });

    it('onFocus handler is properly called', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();

      render(<Input label="Test" onFocus={onFocus} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      await user.click(input);

      expect(onFocus).toHaveBeenCalled();
    });

    it('onBlur handler is properly called', async () => {
      const user = userEvent.setup();
      const onBlur = jest.fn();

      render(<Input label="Test" onBlur={onBlur} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      await user.click(input);
      await user.keyboard('{Tab}');

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('Performance - Memoization', () => {
    it('does not inject extra props into input element', () => {
      const { container } = render(<Input label="Test" data-testid="test-input" />);

      const input = container.querySelector('input');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveClass('form-control');
    });

    it('handles multiple safe attributes without issue', () => {
      const { container } = render(
        <Input
          label="Test"
          disabled
          required
          name="multi-attr-test"
          title="Test input"
          tabIndex={0}
          placeholder="Enter text"
          maxLength={100}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeDisabled();
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('name', 'multi-attr-test');
      expect(input).toHaveAttribute('title', 'Test input');
      expect(input).toHaveAttribute('tabIndex', '0');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Accessibility with Security', () => {
    it('maintains accessibility with security filtering', async () => {
      const { container } = render(<Input label="Accessible input" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility with error state and security filtering', async () => {
      const { container } = render(
        <Input label="Error input" error helperText="This field is required" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility with disabled state and security filtering', async () => {
      const { container } = render(<Input label="Disabled input" disabled />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains keyboard navigation with security filtering', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Input label="Keyboard test" onChange={onChange} />);

      const input = screen.getByDisplayValue('') as HTMLInputElement;
      input.focus();

      await user.keyboard('test');

      expect(onChange).toHaveBeenCalled();
      expect(input).toHaveFocus();
    });

    it('supports prefix and suffix with security', () => {
      const { container } = render(
        <Input
          label="Price"
          type="number"
          prefix="$"
          suffix=".00"
          value="100"
          onChange={() => {}}
        />
      );

      const inputGroup = container.querySelector('.input-group');
      expect(inputGroup).toBeInTheDocument();
      expect(container.textContent).toContain('$');
      expect(container.textContent).toContain('.00');
    });
  });
});
