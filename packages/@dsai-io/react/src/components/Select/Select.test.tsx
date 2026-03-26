import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import { Select } from './Select';

import type { SelectOption } from './Select.types';

expect.extend(toHaveNoViolations);

// Sample options
const options: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
    ],
  },
];

describe('Select', () => {
  // ===========================================================================
  // Rendering
  // ===========================================================================
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Select options={options} aria-label="Test select" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Select options={options} label="Fruit" />);
      expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('renders placeholder when no selection', () => {
      render(<Select options={options} aria-label="Test" placeholder="Choose a fruit" />);
      expect(screen.getByText('Choose a fruit')).toBeInTheDocument();
    });

    it('renders helper text', () => {
      render(<Select options={options} label="Fruit" helperText="Select your favorite" />);
      expect(screen.getByText('Select your favorite')).toBeInTheDocument();
    });

    it('has Bootstrap form-select class', () => {
      render(<Select options={options} aria-label="Test" />);
      expect(screen.getByRole('combobox')).toHaveClass('form-select');
    });
  });

  // ===========================================================================
  // Sizes
  // ===========================================================================
  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');
      expect(button).not.toHaveClass('form-select-sm');
      expect(button).not.toHaveClass('form-select-lg');
    });

    it('renders small size', () => {
      render(<Select options={options} size="sm" aria-label="Test" />);
      expect(screen.getByRole('combobox')).toHaveClass('form-select-sm');
    });

    it('renders large size', () => {
      render(<Select options={options} size="lg" aria-label="Test" />);
      expect(screen.getByRole('combobox')).toHaveClass('form-select-lg');
    });
  });

  // ===========================================================================
  // States
  // ===========================================================================
  describe('States', () => {
    it('renders disabled state', () => {
      render(<Select options={options} label="Test" disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('renders error state', () => {
      render(<Select options={options} label="Test" error />);
      expect(screen.getByRole('combobox')).toHaveClass('is-invalid');
    });

    it('renders success state', () => {
      render(<Select options={options} label="Test" success />);
      expect(screen.getByRole('combobox')).toHaveClass('is-valid');
    });

    it('error takes precedence over success', () => {
      render(<Select options={options} label="Test" error success />);
      const button = screen.getByRole('combobox');
      expect(button).toHaveClass('is-invalid');
      expect(button).not.toHaveClass('is-valid');
    });

    it('does not open dropdown when loading', () => {
      render(<Select options={options} label="Test" loading />);

      const button = screen.getByRole('combobox');
      fireEvent.click(button);

      // Dropdown should not open when loading
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ===========================================================================
  // Dropdown Behavior
  // ===========================================================================
  describe('Dropdown Behavior', () => {
    it('opens dropdown on click', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      expect(button).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown on second click', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes dropdown on outside click', async () => {
      render(
        <div>
          <Select options={options} aria-label="Test" />
          <button type="button">Outside</button>
        </div>
      );

      await userEvent.click(screen.getByRole('combobox', { name: /test/i }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('displays all options when open', async () => {
      render(<Select options={options} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      options.forEach((opt) => {
        expect(screen.getByText(opt.label)).toBeInTheDocument();
      });
    });

    it('calls onOpen when dropdown opens', async () => {
      const handleOpen = jest.fn();
      render(<Select options={options} aria-label="Test" onOpen={handleOpen} />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(handleOpen).toHaveBeenCalled();
    });

    it('calls onClose when dropdown closes', async () => {
      const handleClose = jest.fn();
      render(<Select options={options} aria-label="Test" onClose={handleClose} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByRole('combobox'));

      expect(handleClose).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Single Selection
  // ===========================================================================
  describe('Single Selection', () => {
    it('selects option on click', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} aria-label="Test" onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Apple'));

      expect(handleChange).toHaveBeenCalledWith('apple');
    });

    it('displays selected value', async () => {
      render(<Select options={options} aria-label="Test" value="banana" />);

      expect(screen.getByText('Banana')).toBeInTheDocument();
    });

    it('closes dropdown after selection in single mode', async () => {
      render(<Select options={options} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Apple'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Multiple Selection
  // ===========================================================================
  describe('Multiple Selection', () => {
    it('allows multiple selections', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} aria-label="Test" multiple onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Apple'));

      expect(handleChange).toHaveBeenCalledWith(['apple']);
    });

    it('displays multiple selected values', async () => {
      render(<Select options={options} aria-label="Test" multiple value={['apple', 'banana']} />);

      expect(screen.getByText('Apple, Banana')).toBeInTheDocument();
    });

    it('keeps dropdown open after selection in multiple mode', async () => {
      render(<Select options={options} aria-label="Test" multiple />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Apple'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('toggles selection on click', async () => {
      const handleChange = jest.fn();
      render(
        <Select
          options={options}
          aria-label="Test"
          multiple
          value={['apple']}
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByRole('combobox'));
      // Find the Apple option in the listbox (not the display value)
      const optionElements = screen.getAllByRole('option');
      const appleOption = optionElements.find((el) => el.textContent?.includes('Apple'));
      expect(appleOption).toBeDefined();
      if (appleOption) {
        await userEvent.click(appleOption);
      }

      expect(handleChange).toHaveBeenCalledWith([]);
    });
  });

  // ===========================================================================
  // Searchable
  // ===========================================================================
  describe('Searchable', () => {
    it('shows search input when searchable', async () => {
      render(<Select options={options} aria-label="Test" searchable />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('filters options based on search', async () => {
      render(<Select options={options} aria-label="Test" searchable />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByPlaceholderText('Search...'), 'app');

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.queryByText('Banana')).not.toBeInTheDocument();
    });

    it('shows no options message when search has no results', async () => {
      render(<Select options={options} aria-label="Test" searchable />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByPlaceholderText('Search...'), 'xyz');

      expect(screen.getByText('No options')).toBeInTheDocument();
    });

    it('calls onSearchChange when search value changes', async () => {
      const handleSearchChange = jest.fn();
      render(
        <Select
          options={options}
          aria-label="Test"
          searchable
          onSearchChange={handleSearchChange}
        />
      );

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.type(screen.getByPlaceholderText('Search...'), 'app');

      expect(handleSearchChange).toHaveBeenCalledWith('a');
      expect(handleSearchChange).toHaveBeenCalledWith('ap');
      expect(handleSearchChange).toHaveBeenCalledWith('app');
    });
  });

  // ===========================================================================
  // Grouped Options
  // ===========================================================================
  describe('Grouped Options', () => {
    it('renders option groups', async () => {
      render(<Select options={groupedOptions} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
    });

    it('renders options within groups', async () => {
      render(<Select options={groupedOptions} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Carrot')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Disabled Options
  // ===========================================================================
  describe('Disabled Options', () => {
    it('renders disabled options', async () => {
      const optionsWithDisabled: SelectOption[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      const disabledOption = screen.getByRole('option', { name: 'Banana' });
      expect(disabledOption).toHaveClass('disabled');
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not select disabled options', async () => {
      const handleChange = jest.fn();
      const optionsWithDisabled: SelectOption[] = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana', disabled: true },
      ];

      render(<Select options={optionsWithDisabled} aria-label="Test" onChange={handleChange} />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Banana'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Clear Button
  // ===========================================================================
  describe('Clear Button', () => {
    it('shows clear button when clearable and has value', async () => {
      render(<Select options={options} aria-label="Test" clearable value="apple" />);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('does not show clear button when no value', () => {
      render(<Select options={options} aria-label="Test" clearable />);

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('clears value when clear button clicked', async () => {
      const handleChange = jest.fn();
      render(
        <Select
          options={options}
          aria-label="Test"
          clearable
          value="apple"
          onChange={handleChange}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /clear/i }));

      expect(handleChange).toHaveBeenCalledWith(undefined);
    });

    it('calls onClear when clear button clicked', async () => {
      const handleClear = jest.fn();
      render(
        <Select options={options} aria-label="Test" clearable value="apple" onClear={handleClear} />
      );

      await userEvent.click(screen.getByRole('button', { name: /clear/i }));

      expect(handleClear).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Keyboard Navigation
  // ===========================================================================
  describe('Keyboard Navigation', () => {
    it('opens dropdown on Enter', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('opens dropdown on Space', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      button.focus();
      fireEvent.keyDown(button, { key: ' ' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('opens dropdown on ArrowDown', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      button.focus();
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes dropdown on Escape', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(button, { key: 'Escape' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('navigates options with ArrowDown', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);

      fireEvent.keyDown(button, { key: 'ArrowDown' });
      // First option should be focused (index 1 after initial 0)
      const optionItems = screen.getAllByRole('option');
      expect(optionItems[1]).toHaveClass('bg-light');
    });

    it('navigates options with ArrowUp', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);

      // Move down first
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      // Then up
      fireEvent.keyDown(button, { key: 'ArrowUp' });

      const optionItems = screen.getAllByRole('option');
      expect(optionItems[1]).toHaveClass('bg-light');
    });

    it('selects focused option on Enter', async () => {
      const handleChange = jest.fn();
      render(<Select options={options} aria-label="Test" onChange={handleChange} />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(handleChange).toHaveBeenCalledWith('banana');
    });

    it('jumps to first option on Home', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);

      // Move down
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      fireEvent.keyDown(button, { key: 'ArrowDown' });

      // Jump to start
      fireEvent.keyDown(button, { key: 'Home' });

      const optionItems = screen.getAllByRole('option');
      expect(optionItems[0]).toHaveClass('bg-light');
    });

    it('jumps to last option on End', async () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);
      fireEvent.keyDown(button, { key: 'End' });

      const optionItems = screen.getAllByRole('option');
      expect(optionItems[optionItems.length - 1]).toHaveClass('bg-light');
    });
  });

  // ===========================================================================
  // Controlled Mode
  // ===========================================================================
  describe('Controlled Mode', () => {
    it('reflects controlled value', () => {
      render(<Select options={options} aria-label="Test" value="cherry" />);
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('updates when value prop changes', () => {
      const { rerender } = render(<Select options={options} aria-label="Test" value="apple" />);
      expect(screen.getByText('Apple')).toBeInTheDocument();

      rerender(<Select options={options} aria-label="Test" value="banana" />);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Uncontrolled Mode
  // ===========================================================================
  describe('Uncontrolled Mode', () => {
    it('uses defaultValue for initial selection', () => {
      render(<Select options={options} aria-label="Test" defaultValue="date" />);
      expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('updates selection internally', async () => {
      render(<Select options={options} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));
      await userEvent.click(screen.getByText('Cherry'));

      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Required Field
  // ===========================================================================
  describe('Required Field', () => {
    it('shows required indicator in label', () => {
      render(<Select options={options} label="Fruit" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('sets aria-required attribute', () => {
      render(<Select options={options} label="Fruit" required />);
      expect(screen.getByRole('button', { name: /fruit/i })).toHaveAttribute(
        'aria-required',
        'true'
      );
    });
  });

  // ===========================================================================
  // Custom Rendering
  // ===========================================================================
  describe('Custom Rendering', () => {
    it('uses custom renderOption', async () => {
      render(
        <Select
          options={options}
          aria-label="Test"
          renderOption={(option) => <span data-testid="custom">{option.label} - Custom</span>}
        />
      );

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getAllByTestId('custom')).toHaveLength(options.length);
      expect(screen.getByText('Apple - Custom')).toBeInTheDocument();
    });

    it('uses custom renderValue', () => {
      render(
        <Select
          options={options}
          aria-label="Test"
          value="apple"
          renderValue={(selected) => (
            <span data-testid="custom-value">Selected: {(selected as SelectOption).label}</span>
          )}
        />
      );

      expect(screen.getByTestId('custom-value')).toBeInTheDocument();
      expect(screen.getByText('Selected: Apple')).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // Ref Forwarding
  // ===========================================================================
  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Select options={options} aria-label="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('ref can be used to focus', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Select options={options} aria-label="Test" ref={ref} />);

      ref.current?.focus();
      expect(document.activeElement).toBe(ref.current);
    });
  });

  // ===========================================================================
  // Accessibility (WCAG 2.2 AA)
  // ===========================================================================
  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Select options={options} label="Fruit" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when open', async () => {
      const { container } = render(<Select options={options} label="Fruit" />);

      await userEvent.click(screen.getByRole('combobox'));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations with error state', async () => {
      const { container } = render(
        <Select options={options} label="Fruit" error helperText="Required" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no violations when disabled', async () => {
      const { container } = render(<Select options={options} label="Fruit" disabled />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="combobox" on trigger', () => {
      render(<Select options={options} aria-label="Test" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has aria-haspopup="listbox"', () => {
      render(<Select options={options} aria-label="Test" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('has aria-expanded attribute', () => {
      render(<Select options={options} aria-label="Test" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded');
    });

    it('has role="listbox" on dropdown', async () => {
      render(<Select options={options} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('has role="option" on options', async () => {
      render(<Select options={options} aria-label="Test" />);

      await userEvent.click(screen.getByRole('combobox'));

      expect(screen.getAllByRole('option')).toHaveLength(options.length);
    });

    it('sets aria-selected on selected option', async () => {
      render(<Select options={options} aria-label="Test" value="apple" />);

      await userEvent.click(screen.getByRole('combobox'));

      const optionElements = screen.getAllByRole('option');
      const selectedOption = optionElements.find((el) => el.textContent?.includes('Apple'));
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-invalid when error', () => {
      render(<Select options={options} label="Test" error />);
      expect(screen.getByRole('button', { name: /test/i })).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });

    it('has aria-describedby for helper text', () => {
      render(<Select options={options} label="Test" helperText="Help" />);
      const button = screen.getByRole('combobox');
      const helper = screen.getByText('Help');

      expect(button).toHaveAttribute('aria-describedby', helper.id);
    });

    it('has no aria-activedescendant when closed', () => {
      render(<Select options={options} aria-label="Test" />);
      const button = screen.getByRole('combobox');

      expect(button).not.toHaveAttribute('aria-activedescendant');
    });

    it('has aria-activedescendant when open and option is focused', async () => {
      render(<Select options={options} aria-label="Test" id="test-select" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);

      // First option should be focused by default (index 0)
      expect(button).toHaveAttribute('aria-activedescendant', 'test-select-option-0');
    });

    it('aria-activedescendant updates with keyboard navigation', async () => {
      render(<Select options={options} aria-label="Test" id="test-select" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-activedescendant', 'test-select-option-0');

      // Navigate down
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      expect(button).toHaveAttribute('aria-activedescendant', 'test-select-option-1');

      // Navigate down again
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      expect(button).toHaveAttribute('aria-activedescendant', 'test-select-option-2');

      // Navigate up
      fireEvent.keyDown(button, { key: 'ArrowUp' });
      expect(button).toHaveAttribute('aria-activedescendant', 'test-select-option-1');
    });

    it('aria-activedescendant matches focused option id', async () => {
      render(<Select options={options} aria-label="Test" id="test-select" />);
      const button = screen.getByRole('combobox');

      await userEvent.click(button);

      // Get the activedescendant id from button
      const activeDescendantId = button.getAttribute('aria-activedescendant');
      expect(activeDescendantId).toBeTruthy();

      // Verify the option with that id exists and has bg-light (focused) class
      const focusedOption = document.getElementById(activeDescendantId as string);
      expect(focusedOption).toBeInTheDocument();
      expect(focusedOption).toHaveClass('bg-light');
    });

    it('options have unique ids', async () => {
      render(<Select options={options} aria-label="Test" id="test-select" />);

      await userEvent.click(screen.getByRole('combobox'));

      const optionElements = screen.getAllByRole('option');
      const ids = optionElements.map((el) => el.id);

      // All ids should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);

      // All ids should follow the pattern
      ids.forEach((id, index) => {
        expect(id).toBe(`test-select-option-${index}`);
      });
    });

    it('aria-activedescendant clears when dropdown closes', async () => {
      render(<Select options={options} aria-label="Test" id="test-select" />);
      const button = screen.getByRole('combobox');

      // Open dropdown
      await userEvent.click(button);
      expect(button).toHaveAttribute('aria-activedescendant');

      // Close dropdown
      fireEvent.keyDown(button, { key: 'Escape' });
      expect(button).not.toHaveAttribute('aria-activedescendant');
    });
  });

  // ===========================================================================
  // ARIA Pattern (Non-Searchable)
  // ===========================================================================
  describe('ARIA Pattern (Non-Searchable)', () => {
    it('trigger has no role="combobox" when not searchable', () => {
      render(<Select options={options} label="Fruit" />);
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fruit/i })).toHaveAttribute(
        'aria-haspopup',
        'listbox'
      );
    });

    it('options do not have tabIndex', async () => {
      render(<Select options={options} aria-label="Test" />);
      await userEvent.click(screen.getByRole('button', { name: /test/i }));

      const optionElements = screen.getAllByRole('option');
      for (const opt of optionElements) {
        expect(opt).not.toHaveAttribute('tabindex', '0');
      }
    });

    it('option groups use role="group" not fieldset', async () => {
      render(<Select options={groupedOptions} aria-label="Test" />);
      await userEvent.click(screen.getByRole('button', { name: /test/i }));

      expect(screen.queryByRole('group')).toBeInTheDocument();
      expect(document.querySelector('fieldset')).not.toBeInTheDocument();
    });

    it('sets aria-busy when loading', () => {
      render(<Select options={options} label="Test" loading />);
      expect(screen.getByRole('button', { name: /test/i })).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-required when required', () => {
      render(<Select options={options} label="Fruit" required />);
      expect(screen.getByRole('button', { name: /fruit/i })).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('sets aria-invalid when error', () => {
      render(<Select options={options} label="Test" error />);
      expect(screen.getByRole('button', { name: /test/i })).toHaveAttribute(
        'aria-invalid',
        'true'
      );
    });
  });

  // ===========================================================================
  // ARIA Pattern (Searchable)
  // ===========================================================================
  describe('ARIA Pattern (Searchable)', () => {
    it('search input has role="combobox" when searchable', async () => {
      render(<Select options={options} aria-label="Test" searchable />);
      await userEvent.click(screen.getByRole('button', { name: /test/i }));

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('combobox').tagName).toBe('INPUT');
    });

    it('search input has aria-autocomplete="list"', async () => {
      render(<Select options={options} aria-label="Test" searchable />);
      await userEvent.click(screen.getByRole('button', { name: /test/i }));

      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('search input has aria-controls pointing to listbox', async () => {
      render(<Select options={options} aria-label="Test" searchable id="test-select" />);
      await userEvent.click(screen.getByRole('button', { name: /test/i }));

      const searchInput = screen.getByRole('combobox');
      const listbox = screen.getByRole('listbox');
      expect(searchInput).toHaveAttribute('aria-controls', listbox.id);
    });
  });

  // ===========================================================================
  // Form Integration
  // ===========================================================================
  describe('Form Integration', () => {
    it('includes hidden native select for form submission', () => {
      const { container } = render(
        <Select options={options} aria-label="Test" name="fruit" value="apple" />
      );

      const nativeSelect = container.querySelector('select[name="fruit"]');
      expect(nativeSelect).toBeInTheDocument();
    });

    it('native select has correct value', () => {
      const { container } = render(
        <Select options={options} aria-label="Test" name="fruit" value="apple" />
      );

      const nativeSelect = container.querySelector('select[name="fruit"]') as HTMLSelectElement;
      expect(nativeSelect.value).toBe('apple');
    });
  });

  // ===========================================================================
  // Display Name
  // ===========================================================================
  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Select.displayName).toBe('Select');
    });
  });
});
