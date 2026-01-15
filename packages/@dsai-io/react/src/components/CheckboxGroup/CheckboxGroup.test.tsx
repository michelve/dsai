/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';

import { CheckboxGroup } from './CheckboxGroup';

import type { CheckboxGroupOption } from './CheckboxGroup.types';

expect.extend(toHaveNoViolations);

// Test data
const defaultOptions: CheckboxGroupOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notifications' },
];

const optionsWithDisabled: CheckboxGroupOption[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS', disabled: true },
  { value: 'push', label: 'Push notifications' },
];

describe('CheckboxGroup', () => {
  // ===========================================================================
  // Basic Rendering
  // ===========================================================================

  describe('Basic Rendering', () => {
    it('renders with label and options', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} />);

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('SMS')).toBeInTheDocument();
      expect(screen.getByLabelText('Push notifications')).toBeInTheDocument();
    });

    it('renders as fieldset by default', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} />
      );

      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          helperText="Choose your preferences"
          options={defaultOptions}
        />
      );

      expect(screen.getByText('Choose your preferences')).toBeInTheDocument();
    });

    it('renders required indicator', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} required />);

      // Multiple * indicators appear: one in legend, one per checkbox label
      const indicators = screen.getAllByText('*');
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('renders error message', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          error
          errorMessage="Please select at least one option"
        />
      );

      expect(screen.getByText('Please select at least one option')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} className="custom-class" />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('applies custom style', () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          style={{ marginTop: '20px' }}
        />
      );

      expect(container.querySelector('fieldset')).toHaveStyle({ marginTop: '20px' });
    });

    it('renders horizontal layout', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} orientation="horizontal" />
      );

      expect(container.querySelector('.d-flex')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Select All
  // ===========================================================================

  describe('Select All', () => {
    it('renders select all checkbox when showSelectAll is true', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} showSelectAll />);

      expect(screen.getByLabelText('Select all')).toBeInTheDocument();
    });

    it('uses custom select all label', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          selectAllLabel="Check all options"
        />
      );

      expect(screen.getByLabelText('Check all options')).toBeInTheDocument();
    });

    it('select all is unchecked when no items selected', () => {
      render(
        <CheckboxGroup label="Notifications" options={defaultOptions} showSelectAll value={[]} />
      );

      const selectAll = screen.getByLabelText('Select all') as HTMLInputElement;
      expect(selectAll.checked).toBe(false);
      expect(selectAll.indeterminate).toBe(false);
    });

    it('select all is indeterminate when some items selected', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={['email']}
        />
      );

      const selectAll = screen.getByLabelText('Select all') as HTMLInputElement;
      expect(selectAll.checked).toBe(false);
      expect(selectAll.indeterminate).toBe(true);
    });

    it('select all is checked when all items selected', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={['email', 'sms', 'push']}
        />
      );

      const selectAll = screen.getByLabelText('Select all') as HTMLInputElement;
      expect(selectAll.checked).toBe(true);
      expect(selectAll.indeterminate).toBe(false);
    });

    it('clicking select all selects all enabled items', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={[]}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Select all'));

      expect(handleChange).toHaveBeenCalledWith(['email', 'sms', 'push']);
    });

    it('clicking select all clears all when all are selected', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={['email', 'sms', 'push']}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Select all'));

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('clicking select all selects all when some are selected', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={['email']}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Select all'));

      expect(handleChange).toHaveBeenCalledWith(['email', 'sms', 'push']);
    });

    it('select all only selects enabled items', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={optionsWithDisabled}
          showSelectAll
          value={[]}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Select all'));

      // SMS is disabled, so should not be included
      expect(handleChange).toHaveBeenCalledWith(['email', 'push']);
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================

  describe('Controlled Mode', () => {
    it('reflects controlled value', () => {
      render(
        <CheckboxGroup label="Notifications" options={defaultOptions} value={['email', 'sms']} />
      );

      expect(screen.getByLabelText('Email')).toBeChecked();
      expect(screen.getByLabelText('SMS')).toBeChecked();
      expect(screen.getByLabelText('Push notifications')).not.toBeChecked();
    });

    it('calls onChange when item is toggled', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          value={['email']}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('SMS'));

      expect(handleChange).toHaveBeenCalledWith(['email', 'sms']);
    });

    it('calls onChange when item is unchecked', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          value={['email', 'sms']}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Email'));

      expect(handleChange).toHaveBeenCalledWith(['sms']);
    });

    it('updates when value prop changes', () => {
      const { rerender } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} value={['email']} />
      );

      expect(screen.getByLabelText('Email')).toBeChecked();
      expect(screen.getByLabelText('SMS')).not.toBeChecked();

      rerender(<CheckboxGroup label="Notifications" options={defaultOptions} value={['sms']} />);

      expect(screen.getByLabelText('Email')).not.toBeChecked();
      expect(screen.getByLabelText('SMS')).toBeChecked();
    });

    it('works with useState', async () => {
      function ControlledGroup() {
        const [selected, setSelected] = useState<string[]>([]);
        return (
          <CheckboxGroup
            label="Notifications"
            options={defaultOptions}
            value={selected}
            onChange={setSelected}
          />
        );
      }

      render(<ControlledGroup />);

      expect(screen.getByLabelText('Email')).not.toBeChecked();

      await userEvent.click(screen.getByLabelText('Email'));
      expect(screen.getByLabelText('Email')).toBeChecked();

      await userEvent.click(screen.getByLabelText('SMS'));
      expect(screen.getByLabelText('SMS')).toBeChecked();

      await userEvent.click(screen.getByLabelText('Email'));
      expect(screen.getByLabelText('Email')).not.toBeChecked();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================

  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial state', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          defaultValue={['email', 'push']}
        />
      );

      expect(screen.getByLabelText('Email')).toBeChecked();
      expect(screen.getByLabelText('SMS')).not.toBeChecked();
      expect(screen.getByLabelText('Push notifications')).toBeChecked();
    });

    it('toggles items in uncontrolled mode', async () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} defaultValue={[]} />);

      expect(screen.getByLabelText('Email')).not.toBeChecked();

      await userEvent.click(screen.getByLabelText('Email'));
      expect(screen.getByLabelText('Email')).toBeChecked();

      await userEvent.click(screen.getByLabelText('Email'));
      expect(screen.getByLabelText('Email')).not.toBeChecked();
    });

    it('calls onChange in uncontrolled mode', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          defaultValue={[]}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('Email'));

      expect(handleChange).toHaveBeenCalledWith(['email']);
    });
  });

  // ===========================================================================
  // Disabled State
  // ===========================================================================

  describe('Disabled State', () => {
    it('disables all checkboxes when disabled prop is true', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} disabled />);

      expect(screen.getByLabelText('Email')).toBeDisabled();
      expect(screen.getByLabelText('SMS')).toBeDisabled();
      expect(screen.getByLabelText('Push notifications')).toBeDisabled();
    });

    it('disables individual options', () => {
      render(<CheckboxGroup label="Notifications" options={optionsWithDisabled} />);

      expect(screen.getByLabelText('Email')).not.toBeDisabled();
      expect(screen.getByLabelText('SMS')).toBeDisabled();
      expect(screen.getByLabelText('Push notifications')).not.toBeDisabled();
    });

    it('disables select all when all options are disabled', () => {
      const allDisabled: CheckboxGroupOption[] = [
        { value: 'email', label: 'Email', disabled: true },
        { value: 'sms', label: 'SMS', disabled: true },
      ];

      render(<CheckboxGroup label="Notifications" options={allDisabled} showSelectAll />);

      expect(screen.getByLabelText('Select all')).toBeDisabled();
    });

    it('does not call onChange for disabled options', async () => {
      const handleChange = jest.fn();
      render(
        <CheckboxGroup
          label="Notifications"
          options={optionsWithDisabled}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByLabelText('SMS'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // FSM Integration
  // ===========================================================================

  describe('FSM Integration', () => {
    it('exposes data-visual-state attribute', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} value={['email']} />
      );

      const optionsDiv = container.querySelector('[data-visual-state]');
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'some');
    });

    it('data-visual-state is "none" when nothing selected', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} value={[]} />
      );

      const optionsDiv = container.querySelector('[data-visual-state]');
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'none');
    });

    it('data-visual-state is "all" when all selected', () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          value={['email', 'sms', 'push']}
        />
      );

      const optionsDiv = container.querySelector('[data-visual-state]');
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'all');
    });

    it('transitions from none to some to all', async () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} defaultValue={[]} />
      );

      const optionsDiv = container.querySelector('[data-visual-state]');

      expect(optionsDiv).toHaveAttribute('data-visual-state', 'none');

      await userEvent.click(screen.getByLabelText('Email'));
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'some');

      await userEvent.click(screen.getByLabelText('SMS'));
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'some');

      await userEvent.click(screen.getByLabelText('Push notifications'));
      expect(optionsDiv).toHaveAttribute('data-visual-state', 'all');
    });
  });

  // ===========================================================================
  // Name Attribute
  // ===========================================================================

  describe('Name Attribute', () => {
    it('applies name to all checkboxes', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} name="notifications" />);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('name', 'notifications');
      });
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with select all', async () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          showSelectAll
          value={['email']}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          error
          errorMessage="Please select at least one"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with disabled options', async () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={optionsWithDisabled} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with aria-label only', async () => {
      const { container } = render(
        <CheckboxGroup aria-label="Notification preferences" options={defaultOptions} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('shows required indicator when required', () => {
      render(<CheckboxGroup label="Notifications" options={defaultOptions} required />);

      // Required indicator (*) should be shown - multiple appear (legend + each checkbox)
      const indicators = screen.getAllByText('*');
      expect(indicators.length).toBeGreaterThan(0);
    });

    it('passes required to child checkboxes when required', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} required />
      );

      // All checkbox inputs should have required attribute for native validation
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAttribute('required');
      });
    });

    it('sets aria-invalid when error', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" options={defaultOptions} error />
      );

      expect(container.querySelector('fieldset')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links helper text via aria-describedby', () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          options={defaultOptions}
          helperText="Choose your preferences"
        />
      );

      const fieldset = container.querySelector('fieldset');
      const helperId = fieldset?.getAttribute('aria-describedby');
      expect(helperId).toBeTruthy();
      const helperElement = helperId ? document.getElementById(helperId) : null;
      expect(helperElement).toHaveTextContent('Choose your preferences');
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================

  describe('Ref Forwarding', () => {
    it('forwards ref to fieldset element', () => {
      const ref = createRef<HTMLFieldSetElement>();
      render(<CheckboxGroup ref={ref} label="Notifications" options={defaultOptions} />);

      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(CheckboxGroup.displayName).toBe('CheckboxGroup');
    });
  });

  // ===========================================================================
  // Dev Warnings
  // ===========================================================================

  describe('Dev Warnings', () => {
    it('warns when no accessible label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CheckboxGroup options={defaultOptions} />);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DSAi CheckboxGroup] Missing accessible label')
      );

      consoleSpy.mockRestore();
    });

    it('does not warn when label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CheckboxGroup label="Notifications" options={defaultOptions} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('does not warn when aria-label is provided', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<CheckboxGroup aria-label="Notifications" options={defaultOptions} />);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
