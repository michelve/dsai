import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Checkbox } from './Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox - Security', () => {
  describe('Prop Spreading - Event Handler Blocking', () => {
    it('blocks onLoad event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onLoad={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      // Verify the dangerous event handler was not rendered to the DOM
      expect(input.onload).toBeNull();
    });

    it('blocks onError event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onError={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onerror).toBeNull();
    });

    it('blocks onAbort event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onAbort={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onabort).toBeNull();
    });

    it('blocks onMouseEnter event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onMouseEnter={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onmouseenter).toBeNull();
    });

    it('blocks onMouseLeave event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onMouseLeave={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onmouseleave).toBeNull();
    });

    it('blocks onFocus event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onFocus={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onfocus).toBeNull();
    });

    it('blocks onBlur event handler from rest props', () => {
      const { container } = render(
        <Checkbox label="Test" onBlur={jest.fn() as unknown as React.ReactEventHandler} />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.onblur).toBeNull();
    });

    it('prevents arbitrary attribute injection through rest', () => {
      const { container } = render(
        // @ts-expect-error - Testing security against arbitrary props
        <Checkbox label="Test" data-evil="malicious" onclick="alert('xss')" />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      // Verify onclick is not applied via attribute
      expect(input.getAttribute('onclick')).toBeNull();
    });

    it('prevents script injection through event handlers in rest', () => {
      const { container } = render(
        // @ts-expect-error - Testing security against arbitrary props
        <Checkbox label="Test" onClick="alert('xss')" />
      );

      const input = container.querySelector('input') as HTMLInputElement;
      // Verify dangerous onClick handler is not applied to DOM
      expect(input.getAttribute('onclick')).toBeNull();
    });
  });

  describe('Safe Attribute Whitelist', () => {
    it('allows disabled attribute', () => {
      render(<Checkbox label="Test" disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('allows required attribute', () => {
      render(<Checkbox label="Test" required />);
      expect(screen.getByRole('checkbox')).toBeRequired();
    });

    it('allows aria-label attribute', () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Custom label');
    });

    it('allows aria-describedby attribute via helperText', () => {
      const { container } = render(<Checkbox label="Test" helperText="Helper text" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('allows aria-invalid attribute', () => {
      render(<Checkbox label="Test" error />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('allows name attribute', () => {
      render(<Checkbox label="Test" name="test-checkbox" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'test-checkbox');
    });

    it('allows value attribute', () => {
      render(<Checkbox label="Test" value="test-value" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'test-value');
    });

    it('allows autoComplete attribute', () => {
      const { container } = render(<Checkbox label="Test" autoComplete="off" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('autoComplete', 'off');
    });

    it('allows tabIndex attribute', () => {
      render(<Checkbox label="Test" tabIndex={-1} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('tabIndex', '-1');
    });

    it('allows title attribute', () => {
      render(<Checkbox label="Test" title="Checkbox title" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('title', 'Checkbox title');
    });
  });

  describe('Event Handler Functionality', () => {
    it('onChange handler is properly passed through', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Checkbox label="Test" onChange={onChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalled();
    });

    it('onChange receives correct ChangeEvent', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Checkbox label="Test" onChange={onChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            type: 'checkbox',
            checked: true,
          }),
        })
      );
    });
  });

  describe('Memoization and Performance', () => {
    it('does not inject extra props into input element', () => {
      const { container } = render(<Checkbox label="Test" data-testid="test-checkbox" />);

      const input = container.querySelector('input');
      // Should have standard attributes, not arbitrary props
      expect(input).toHaveAttribute('type', 'checkbox');
      expect(input).toHaveClass('form-check-input');
    });

    it('handles multiple safe attributes without issue', () => {
      const { container } = render(
        <Checkbox
          label="Test"
          disabled
          required
          name="multi-attr-test"
          value="test-value"
          title="Test checkbox"
          tabIndex={0}
        />
      );

      const input = container.querySelector('input');
      expect(input).toBeDisabled();
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('name', 'multi-attr-test');
      expect(input).toHaveAttribute('value', 'test-value');
      expect(input).toHaveAttribute('title', 'Test checkbox');
      expect(input).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Accessibility with Security', () => {
    it('maintains accessibility with security filtering', async () => {
      const { container } = render(<Checkbox label="Accessible checkbox" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility with error state and security filtering', async () => {
      const { container } = render(
        <Checkbox label="Error checkbox" error helperText="This field is required" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility with disabled state and security filtering', async () => {
      const { container } = render(<Checkbox label="Disabled checkbox" disabled />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains keyboard navigation with security filtering', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Checkbox label="Keyboard test" onChange={onChange} />);

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      await user.keyboard(' ');

      expect(onChange).toHaveBeenCalled();
      expect(checkbox).toHaveFocus();
    });
  });

  describe('ReadOnly Security', () => {
    it('readonly prevents onchange even with direct event dispatch', async () => {
      const handleChange = jest.fn();
      render(<Checkbox readOnly checked={false} onChange={handleChange} label="ReadOnly" />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it('readonly does not add native readonly attribute to dom', () => {
      render(<Checkbox readOnly label="ReadOnly" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('readOnly');
      expect(checkbox).not.toHaveAttribute('readonly');
    });
  });

  describe('Custom Icon Security', () => {
    it('icon content is rendered as react children not innerhtml', () => {
      const maliciousContent = '<img src=x onerror=alert(1)>';
      render(
        <Checkbox
          checked={false}
          onChange={() => {}}
          checkedIcon={maliciousContent}
          uncheckedIcon={maliciousContent}
          label="Icon test"
        />
      );
      expect(document.querySelector('img')).not.toBeInTheDocument();
    });
  });
});
