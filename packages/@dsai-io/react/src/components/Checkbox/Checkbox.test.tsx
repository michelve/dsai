import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';

import { Checkbox } from './Checkbox';

expect.extend(toHaveNoViolations);

describe('Checkbox', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Checkbox aria-label="Test checkbox" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('renders without label when aria-label is provided', () => {
      render(<Checkbox aria-label="Hidden label" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Hidden label');
    });

    it('has Bootstrap form-check class on wrapper', () => {
      const { container } = render(<Checkbox label="Test" />);
      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });

    it('has form-check-input class on input', () => {
      render(<Checkbox label="Test" />);
      expect(screen.getByRole('checkbox')).toHaveClass('form-check-input');
    });

    it('has form-check-label class on label', () => {
      const { container } = render(<Checkbox label="Test" />);
      expect(container.querySelector('.form-check-label')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('reflects controlled checked state', () => {
      render(<Checkbox checked onChange={() => {}} label="Controlled" />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('reflects controlled unchecked state', () => {
      render(<Checkbox checked={false} onChange={() => {}} label="Controlled" />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
      const handleChange = jest.fn();
      render(<Checkbox checked={false} onChange={handleChange} label="Controlled" />);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('passes event to onChange handler', async () => {
      const handleChange = jest.fn();
      render(<Checkbox checked={false} onChange={handleChange} label="Controlled" />);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
      // The event target is the checkbox input
      const event = handleChange.mock.calls[0][0];
      expect(event.target).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Uncontrolled Mode', () => {
    it('uses defaultChecked for initial state', () => {
      render(<Checkbox defaultChecked label="Uncontrolled" />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('toggles when clicked in uncontrolled mode', async () => {
      render(<Checkbox defaultChecked={false} label="Uncontrolled" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Indeterminate State', () => {
    it('sets indeterminate property on input', () => {
      render(<Checkbox indeterminate label="Indeterminate" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('sets aria-checked="mixed" when indeterminate', () => {
      render(<Checkbox indeterminate label="Indeterminate" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    });

    it('does not set aria-checked when not indeterminate', () => {
      render(<Checkbox label="Normal" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('aria-checked');
    });

    it('updates indeterminate when prop changes', () => {
      const { rerender } = render(<Checkbox indeterminate={false} label="Test" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(false);

      rerender(<Checkbox indeterminate label="Test" />);
      expect(checkbox.indeterminate).toBe(true);
    });

    it('indeterminate can be combined with checked', () => {
      render(<Checkbox indeterminate checked onChange={() => {}} label="Both" />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('renders disabled checkbox', () => {
      render(<Checkbox disabled label="Disabled" />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = jest.fn();
      render(<Checkbox disabled onChange={handleChange} label="Disabled" />);

      await userEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('applies is-invalid class when error is true', () => {
      render(<Checkbox error label="Error" />);
      expect(screen.getByRole('checkbox')).toHaveClass('is-invalid');
    });

    it('sets aria-invalid when error is true', () => {
      render(<Checkbox error label="Error" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not have is-invalid class when error is false', () => {
      render(<Checkbox label="No error" />);
      expect(screen.getByRole('checkbox')).not.toHaveClass('is-invalid');
    });
  });

  describe('Helper Text', () => {
    it('renders helper text', () => {
      render(<Checkbox helperText="This is helper text" label="Test" />);
      expect(screen.getByText('This is helper text')).toBeInTheDocument();
    });

    it('associates helper text with input via aria-describedby', () => {
      render(<Checkbox helperText="Helper" label="Test" />);
      const checkbox = screen.getByRole('checkbox');
      // aria-describedby should be set and reference the helper text element
      const describedBy = checkbox.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();
      if (describedBy) {
        expect(document.getElementById(describedBy)).toHaveTextContent('Helper');
      }
    });

    it('applies invalid-feedback class when error with helper text', () => {
      const { container } = render(<Checkbox error helperText="Error message" label="Test" />);
      expect(container.querySelector('.invalid-feedback')).toBeInTheDocument();
    });

    it('applies form-text class when no error with helper text', () => {
      const { container } = render(<Checkbox helperText="Help text" label="Test" />);
      expect(container.querySelector('.form-text')).toBeInTheDocument();
    });

    it('renders ReactNode helperText', () => {
      render(<Checkbox helperText={<span data-testid="rich-helper">Bold text</span>} label="Test" />);
      expect(screen.getByTestId('rich-helper')).toBeInTheDocument();
    });
  });

  describe('Switch Style', () => {
    it('applies form-switch class when switch prop is true', () => {
      const { container } = render(<Checkbox switch label="Switch" />);
      expect(container.querySelector('.form-switch')).toBeInTheDocument();
    });

    it('still functions as checkbox when switch style', async () => {
      render(<Checkbox switch defaultChecked={false} label="Switch" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Inline Layout', () => {
    it('applies form-check-inline class when inline is true', () => {
      const { container } = render(<Checkbox inline label="Inline" />);
      expect(container.querySelector('.form-check-inline')).toBeInTheDocument();
    });
  });

  describe('Reverse Layout', () => {
    it('applies form-check-reverse class when reverse is true', () => {
      const { container } = render(<Checkbox reverse label="Reverse" />);
      expect(container.querySelector('.form-check-reverse')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('sets required attribute on input', () => {
      render(<Checkbox required label="Required" />);
      expect(screen.getByRole('checkbox')).toBeRequired();
    });

    it('shows required indicator in label', () => {
      const { container } = render(<Checkbox required label="Required" />);
      expect(container.querySelector('.text-danger')).toBeInTheDocument();
      expect(container.querySelector('.text-danger')).toHaveTextContent('*');
    });
  });

  describe('Form Integration', () => {
    it('accepts name attribute', () => {
      render(<Checkbox name="terms" label="Terms" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'terms');
    });

    it('accepts value attribute', () => {
      render(<Checkbox value="accepted" label="Accept" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'accepted');
    });

    it('works in a form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="agree" value="yes" defaultChecked label="I agree" />
          <button type="submit">Submit</button>
        </form>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(<Checkbox className="custom-class" label="Test" />);
      expect(container.querySelector('.form-check')).toHaveClass('custom-class');
    });

    it('accepts inline styles', () => {
      const { container } = render(<Checkbox style={{ marginTop: '20px' }} label="Test" />);
      expect(container.querySelector('.form-check')).toHaveStyle({ marginTop: '20px' });
    });

    it('accepts custom id', () => {
      const testId = `test-id-${Date.now()}`;
      render(<Checkbox id={testId} label="Test" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('id', testId);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} label="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref can be used to focus input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Checkbox ref={ref} label="Test" />);
      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe('Keyboard Navigation', () => {
    it('toggles with Space key', async () => {
      render(<Checkbox defaultChecked={false} label="Test" />);
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await userEvent.keyboard(' ');
      expect(checkbox).toBeChecked();
    });

    it('is focusable with Tab', async () => {
      render(
        <>
          <button type="button">Before</button>
          <Checkbox label="Test" />
          <button type="button">After</button>
        </>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByRole('checkbox')).toHaveFocus();
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Checkbox label="Accessible checkbox" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(<Checkbox checked onChange={() => {}} label="Checked" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Checkbox disabled label="Disabled" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(<Checkbox error helperText="Error message" label="Error" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with switch style', async () => {
      const { container } = render(<Checkbox switch label="Switch" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations without visible label', async () => {
      const { container } = render(<Checkbox aria-label="Hidden label checkbox" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label is clickable to toggle checkbox', async () => {
      render(<Checkbox defaultChecked={false} label="Click me" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await userEvent.click(screen.getByText('Click me'));
      expect(checkbox).toBeChecked();
    });

    it('warns in development when no accessible name is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Render without label or aria-label
      render(<Checkbox data-testid="no-label-checkbox" />);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DSAi Checkbox] Missing accessible name')
      );

      consoleSpy.mockRestore();
    });

    it('does not warn when label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<Checkbox label="Has label" />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('does not warn when aria-label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<Checkbox aria-label="Has aria-label" />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Integration with React state', () => {
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          label={checked ? 'Checked' : 'Unchecked'}
        />
      );
    }

    it('updates label based on checked state', async () => {
      render(<ControlledCheckbox />);

      expect(screen.getByText('Unchecked')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('checkbox'));
      expect(screen.getByText('Checked')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies dsai-checkbox-sm class for size="sm"', () => {
      const { container } = render(<Checkbox size="sm" label="Small" />);
      expect(container.querySelector('.form-check')).toHaveClass('dsai-checkbox-sm');
    });

    it('does not apply size class for size="md"', () => {
      const { container } = render(<Checkbox size="md" label="Medium" />);
      const wrapper = container.querySelector('.form-check');
      expect(wrapper).not.toHaveClass('dsai-checkbox-sm');
      expect(wrapper).not.toHaveClass('dsai-checkbox-lg');
    });

    it('does not apply size class when size is omitted', () => {
      const { container } = render(<Checkbox label="Default" />);
      const wrapper = container.querySelector('.form-check');
      expect(wrapper).not.toHaveClass('dsai-checkbox-sm');
      expect(wrapper).not.toHaveClass('dsai-checkbox-lg');
    });

    it('applies dsai-checkbox-lg class for size="lg"', () => {
      const { container } = render(<Checkbox size="lg" label="Large" />);
      expect(container.querySelector('.form-check')).toHaveClass('dsai-checkbox-lg');
    });

    it('sets data-size attribute', () => {
      const { container } = render(<Checkbox size="sm" label="Small" />);
      expect(container.querySelector('.form-check')).toHaveAttribute('data-size', 'sm');
    });

    it('applies size class with switch mode', () => {
      const { container } = render(<Checkbox size="lg" switch label="Large Switch" />);
      const wrapper = container.querySelector('.form-check');
      expect(wrapper).toHaveClass('dsai-checkbox-lg');
      expect(wrapper).toHaveClass('form-switch');
    });

    it('has no a11y violations with size variants', async () => {
      const { container } = render(
        <>
          <Checkbox size="sm" label="Small" />
          <Checkbox size="md" label="Medium" />
          <Checkbox size="lg" label="Large" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Checkbox.displayName).toBe('Checkbox');
    });
  });
});
