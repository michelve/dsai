import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

expect.extend(toHaveNoViolations);

describe('Radio', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Radio value="test" name="test" aria-label="Test radio" />);
      expect(screen.getByRole('radio')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Radio value="test" name="test" label="Test Label" />);
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('renders without label when aria-label is provided', () => {
      render(<Radio value="test" name="test" aria-label="Hidden label" />);
      expect(screen.getByRole('radio')).toHaveAttribute('aria-label', 'Hidden label');
    });

    it('has Bootstrap form-check class on wrapper', () => {
      const { container } = render(<Radio value="test" name="test" label="Test" />);
      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });

    it('has form-check-input class on input', () => {
      render(<Radio value="test" name="test" label="Test" />);
      expect(screen.getByRole('radio')).toHaveClass('form-check-input');
    });
  });

  describe('Checked State', () => {
    it('reflects checked state', () => {
      render(<Radio value="test" name="test" checked onChange={() => {}} label="Test" />);
      expect(screen.getByRole('radio')).toBeChecked();
    });

    it('reflects unchecked state', () => {
      render(<Radio value="test" name="test" checked={false} onChange={() => {}} label="Test" />);
      expect(screen.getByRole('radio')).not.toBeChecked();
    });

    it('calls onChange when clicked', async () => {
      const handleChange = jest.fn();
      render(<Radio value="test" name="test" onChange={handleChange} label="Test" />);

      await userEvent.click(screen.getByRole('radio'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled State', () => {
    it('renders disabled radio', () => {
      render(<Radio value="test" name="test" disabled label="Disabled" />);
      expect(screen.getByRole('radio')).toBeDisabled();
    });

    it('does not call onChange when disabled', async () => {
      const handleChange = jest.fn();
      render(<Radio value="test" name="test" disabled onChange={handleChange} label="Disabled" />);

      await userEvent.click(screen.getByRole('radio'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    it('applies is-invalid class when error is true', () => {
      render(<Radio value="test" name="test" error label="Error" />);
      expect(screen.getByRole('radio')).toHaveClass('is-invalid');
    });

    it('does not have is-invalid class when error is false', () => {
      render(<Radio value="test" name="test" label="No error" />);
      expect(screen.getByRole('radio')).not.toHaveClass('is-invalid');
    });
  });

  describe('Inline Layout', () => {
    it('applies form-check-inline class when inline is true', () => {
      const { container } = render(<Radio value="test" name="test" inline label="Inline" />);
      expect(container.querySelector('.form-check-inline')).toBeInTheDocument();
    });
  });

  describe('Reverse Layout', () => {
    it('applies form-check-reverse class when reverse is true', () => {
      const { container } = render(<Radio value="test" name="test" reverse label="Reverse" />);
      expect(container.querySelector('.form-check-reverse')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('sets required attribute on input', () => {
      render(<Radio value="test" name="test" required label="Required" />);
      expect(screen.getByRole('radio')).toBeRequired();
    });

    it('shows required indicator in label', () => {
      const { container } = render(<Radio value="test" name="test" required label="Required" />);
      expect(container.querySelector('.text-danger')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <Radio value="test" name="test" className="custom-class" label="Test" />
      );
      expect(container.querySelector('.form-check')).toHaveClass('custom-class');
    });

    it('accepts inline styles', () => {
      const { container } = render(
        <Radio value="test" name="test" style={{ marginTop: '20px' }} label="Test" />
      );
      expect(container.querySelector('.form-check')).toHaveStyle({ marginTop: '20px' });
    });

    it('accepts custom id', () => {
      render(<Radio value="test" name="test" id="custom-id" label="Test" />);
      expect(screen.getByRole('radio')).toHaveAttribute('id', 'custom-id');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Radio ref={ref} value="test" name="test" label="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('ref can be used to focus input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Radio ref={ref} value="test" name="test" label="Test" />);
      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Radio value="test" name="test" label="Accessible" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when checked', async () => {
      const { container } = render(
        <Radio value="test" name="test" checked onChange={() => {}} label="Checked" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Radio value="test" name="test" disabled label="Disabled" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('label is clickable to select radio', async () => {
      render(<Radio value="test" name="test" label="Click me" />);
      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();
      await userEvent.click(screen.getByText('Click me'));
      expect(radio).toBeChecked();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Radio.displayName).toBe('Radio');
    });
  });
});

describe('RadioGroup', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(
        <RadioGroup name="test" label="Test Group">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders all radio children', () => {
      render(
        <RadioGroup name="test" label="Test Group">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>
      );
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders label as legend', () => {
      render(
        <RadioGroup name="test" label="Select an option">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(
        <RadioGroup name="test" label="Test" helperText="Please select one">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByText('Please select one')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('reflects controlled value', () => {
      render(
        <RadioGroup name="test" value="2" onChange={() => {}} label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 2')).toBeChecked();
      expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    });

    it('calls onChange when radio is selected', async () => {
      const handleChange = jest.fn();
      render(
        <RadioGroup name="test" value="1" onChange={handleChange} label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );

      await userEvent.click(screen.getByLabelText('Option 2'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial selection', () => {
      render(
        <RadioGroup name="test" defaultValue="2" label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });

    it('updates selection when clicked in uncontrolled mode', async () => {
      render(
        <RadioGroup name="test" defaultValue="1" label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );

      expect(screen.getByLabelText('Option 1')).toBeChecked();
      await userEvent.click(screen.getByLabelText('Option 2'));
      expect(screen.getByLabelText('Option 2')).toBeChecked();
      expect(screen.getByLabelText('Option 1')).not.toBeChecked();
    });
  });

  describe('Disabled State', () => {
    it('disables all radios when group is disabled', () => {
      render(
        <RadioGroup name="test" disabled label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
    });

    it('allows individual radio to be disabled', () => {
      render(
        <RadioGroup name="test" label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" disabled />
        </RadioGroup>
      );
      expect(screen.getByLabelText('Option 1')).not.toBeDisabled();
      expect(screen.getByLabelText('Option 2')).toBeDisabled();
    });
  });

  describe('Error State', () => {
    it('sets aria-invalid on radiogroup when error is true', () => {
      render(
        <RadioGroup name="test" error label="Test">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    });

    it('applies invalid-feedback class to helper text when error', () => {
      const { container } = render(
        <RadioGroup name="test" error helperText="Error message" label="Test">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(container.querySelector('.invalid-feedback')).toBeInTheDocument();
    });
  });

  describe('Inline Layout', () => {
    it('applies inline classes when inline is true', () => {
      const { container } = render(
        <RadioGroup name="test" inline label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      expect(container.querySelector('.d-flex')).toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('shows required indicator in label', () => {
      const { container } = render(
        <RadioGroup name="test" required label="Required Group">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(container.querySelector('.text-danger')).toBeInTheDocument();
    });

    it('sets aria-required on radiogroup', () => {
      render(
        <RadioGroup name="test" required label="Test">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Form Integration', () => {
    it('all radios share the same name', () => {
      render(
        <RadioGroup name="shared-name" label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'shared-name');
      });
    });

    it('works in a form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <RadioGroup name="choice" defaultValue="a" label="Choose">
            <Radio value="a" label="A" />
            <Radio value="b" label="B" />
          </RadioGroup>
          <button type="submit">Submit</button>
        </form>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('can navigate with arrow keys', async () => {
      render(
        <RadioGroup name="test" defaultValue="1" label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>
      );

      const radio1 = screen.getByLabelText('Option 1');
      radio1.focus();

      // Arrow down should move to next radio
      await userEvent.keyboard('{ArrowDown}');
      expect(screen.getByLabelText('Option 2')).toBeChecked();
    });

    it('is focusable with Tab', async () => {
      render(
        <>
          <button>Before</button>
          <RadioGroup name="test" defaultValue="1" label="Test">
            <Radio value="1" label="Option 1" />
            <Radio value="2" label="Option 2" />
          </RadioGroup>
          <button>After</button>
        </>
      );

      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByLabelText('Option 1')).toHaveFocus();
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <RadioGroup name="test" label="Select an option">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with selection', async () => {
      const { container } = render(
        <RadioGroup name="test" value="2" onChange={() => {}} label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(
        <RadioGroup name="test" disabled label="Test">
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <RadioGroup name="test" error helperText="Error" label="Test">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="radiogroup"', () => {
      render(
        <RadioGroup name="test" label="Test">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has aria-labelledby pointing to label', () => {
      render(
        <RadioGroup name="test" label="Test Label" id="test-group">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-labelledby', 'test-group-label');
    });

    it('has aria-describedby pointing to helper text', () => {
      render(
        <RadioGroup name="test" label="Test" helperText="Helper" id="test-group">
          <Radio value="1" label="Option 1" />
        </RadioGroup>
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute(
        'aria-describedby',
        'test-group-helper'
      );
    });
  });

  describe('Integration with React state', () => {
    function ControlledRadioGroup(): React.JSX.Element {
      const [value, setValue] = useState('1');
      return (
        <RadioGroup
          name="test"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label={`Selected: ${value}`}
        >
          <Radio value="1" label="Option 1" />
          <Radio value="2" label="Option 2" />
          <Radio value="3" label="Option 3" />
        </RadioGroup>
      );
    }

    it('updates label based on selection', async () => {
      render(<ControlledRadioGroup />);

      expect(screen.getByText('Selected: 1')).toBeInTheDocument();
      await userEvent.click(screen.getByLabelText('Option 2'));
      expect(screen.getByText('Selected: 2')).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(RadioGroup.displayName).toBe('RadioGroup');
    });
  });
});
