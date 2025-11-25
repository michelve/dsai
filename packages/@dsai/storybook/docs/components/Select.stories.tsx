import { useState } from 'react';

import { Select } from '@dsai/react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SelectOption } from '@dsai/react';

// Sample options
const fruitOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const countryOptions: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
];

const groupedOptions = [
  {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
  {
    label: 'Vegetables',
    options: [
      { value: 'carrot', label: 'Carrot' },
      { value: 'broccoli', label: 'Broccoli' },
      { value: 'spinach', label: 'Spinach' },
    ],
  },
];

/**
 * Select component for dropdown selection.
 * Built with Bootstrap 5 design tokens and WCAG 2.2 AA compliance.
 *
 * @see https://getbootstrap.com/docs/5.3/forms/select/
 */
const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible dropdown select component built with Bootstrap 5 classes. ' +
          'Supports single/multiple selection, search, custom rendering, and keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
      table: {
        type: { summary: 'SelectSize' },
        defaultValue: { summary: 'md' },
      },
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multiple selection',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search/filter',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: 'boolean',
      description: 'Error state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    success: {
      control: 'boolean',
      description: 'Success state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description: 'Show clear button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Required field',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// =============================================================================
// Basic Examples
// =============================================================================

/**
 * Default select with label
 */
export const Default: Story = {
  args: {
    label: 'Fruit',
    options: fruitOptions,
    placeholder: 'Select a fruit',
  },
};

/**
 * Select without label (uses aria-label)
 */
export const WithoutLabel: Story = {
  args: {
    'aria-label': 'Select fruit',
    options: fruitOptions,
    placeholder: 'Select a fruit',
  },
};

// =============================================================================
// Sizes
// =============================================================================

/**
 * Select sizes
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select size="sm" label="Small" options={fruitOptions} placeholder="Select..." />
      <Select size="md" label="Medium (default)" options={fruitOptions} placeholder="Select..." />
      <Select size="lg" label="Large" options={fruitOptions} placeholder="Select..." />
    </div>
  ),
};

// =============================================================================
// States
// =============================================================================

/**
 * Validation states
 */
export const ValidationStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Select label="Default" options={fruitOptions} placeholder="Select..." />
      <Select label="Error" options={fruitOptions} error helperText="Please select an option" />
      <Select label="Success" options={fruitOptions} success value="apple" />
      <Select label="Disabled" options={fruitOptions} disabled placeholder="Disabled" />
      <Select label="Loading" options={fruitOptions} loading />
    </div>
  ),
};

/**
 * Error state
 */
export const Error: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    error: true,
    helperText: 'Please select your country',
  },
};

/**
 * Success state
 */
export const Success: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    success: true,
    value: 'us',
  },
};

// =============================================================================
// Selection Modes
// =============================================================================

/**
 * Single selection (default)
 */
export const SingleSelection: Story = {
  render: function SingleSelect() {
    const [value, setValue] = useState<string | undefined>();

    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          label="Favorite Fruit"
          options={fruitOptions}
          value={value}
          onChange={(val) => setValue(val as string)}
          placeholder="Choose one..."
        />
        <p className="mt-2 text-muted small">Selected: {value || '(none)'}</p>
      </div>
    );
  },
};

/**
 * Multiple selection
 */
export const MultipleSelection: Story = {
  render: function MultiSelect() {
    const [values, setValues] = useState<string[]>([]);

    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          label="Favorite Fruits"
          options={fruitOptions}
          multiple
          value={values}
          onChange={(val) => setValues(val as string[])}
          placeholder="Choose multiple..."
        />
        <p className="mt-2 text-muted small">Selected: {values.join(', ') || '(none)'}</p>
      </div>
    );
  },
};

// =============================================================================
// Searchable
// =============================================================================

/**
 * Searchable select
 */
export const Searchable: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    searchable: true,
    placeholder: 'Search countries...',
  },
};

/**
 * Searchable with multiple selection
 */
export const SearchableMultiple: Story = {
  render: function SearchableMultiSelect() {
    const [values, setValues] = useState<string[]>([]);

    return (
      <Select
        label="Countries"
        options={countryOptions}
        multiple
        searchable
        value={values}
        onChange={(val) => setValues(val as string[])}
        placeholder="Search and select..."
      />
    );
  },
};

// =============================================================================
// Grouped Options
// =============================================================================

/**
 * Options with groups
 */
export const GroupedOptions: Story = {
  args: {
    label: 'Food',
    options: groupedOptions,
    placeholder: 'Select food...',
  },
};

// =============================================================================
// Disabled Options
// =============================================================================

/**
 * Select with disabled options
 */
export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled: SelectOption[] = [
      { value: 'available1', label: 'Available Option 1' },
      { value: 'available2', label: 'Available Option 2' },
      { value: 'unavailable', label: 'Unavailable Option', disabled: true },
      { value: 'available3', label: 'Available Option 3' },
    ];

    return <Select label="Status" options={optionsWithDisabled} placeholder="Select status..." />;
  },
};

// =============================================================================
// Clearable
// =============================================================================

/**
 * Clearable select
 */
export const Clearable: Story = {
  render: function ClearableSelect() {
    const [value, setValue] = useState<string | undefined>('apple');

    return (
      <Select
        label="Fruit"
        options={fruitOptions}
        value={value}
        onChange={(val) => setValue(val as string | undefined)}
        clearable
        onClear={() => setValue(undefined)}
      />
    );
  },
};

// =============================================================================
// Loading State
// =============================================================================

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    label: 'Data',
    options: [],
    loading: true,
    placeholder: 'Loading data...',
  },
};

// =============================================================================
// Required Field
// =============================================================================

/**
 * Required field
 */
export const Required: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    required: true,
    placeholder: 'Select your country',
  },
};

// =============================================================================
// Helper Text
// =============================================================================

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    helperText: 'Select the country where you currently reside',
  },
};

// =============================================================================
// Custom Rendering
// =============================================================================

/**
 * Custom option rendering
 */
export const CustomOptionRendering: Story = {
  render: () => {
    const colorOptions: SelectOption[] = [
      { value: '#ff0000', label: 'Red' },
      { value: '#00ff00', label: 'Green' },
      { value: '#0000ff', label: 'Blue' },
      { value: '#ffff00', label: 'Yellow' },
      { value: '#ff00ff', label: 'Magenta' },
    ];

    return (
      <Select
        label="Color"
        options={colorOptions}
        placeholder="Select a color..."
        renderOption={(option) => (
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: 16,
                height: 16,
                backgroundColor: option.value,
                borderRadius: '50%',
                border: '1px solid var(--bs-border-color)',
              }}
            />
            {option.label}
          </div>
        )}
        renderValue={(selected) => {
          const opt = selected as SelectOption;
          return (
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: opt.value,
                  borderRadius: '50%',
                  border: '1px solid var(--bs-border-color)',
                }}
              />
              {opt.label}
            </div>
          );
        }}
      />
    );
  },
};

// =============================================================================
// Form Example
// =============================================================================

/**
 * Form with multiple selects
 */
export const FormExample: Story = {
  render: function FormSelects() {
    const [formData, setFormData] = useState({
      country: '',
      language: '',
      interests: [] as string[],
    });

    const languageOptions: SelectOption[] = [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
    ];

    const interestOptions: SelectOption[] = [
      { value: 'tech', label: 'Technology' },
      { value: 'sports', label: 'Sports' },
      { value: 'music', label: 'Music' },
      { value: 'art', label: 'Art' },
      { value: 'travel', label: 'Travel' },
    ];

    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      alert(JSON.stringify(formData, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select
            label="Country"
            name="country"
            options={countryOptions}
            value={formData.country}
            onChange={(val) => setFormData({ ...formData, country: val as string })}
            required
            searchable
            placeholder="Search countries..."
          />

          <Select
            label="Preferred Language"
            name="language"
            options={languageOptions}
            value={formData.language}
            onChange={(val) => setFormData({ ...formData, language: val as string })}
            required
          />

          <Select
            label="Interests"
            name="interests"
            options={interestOptions}
            value={formData.interests}
            onChange={(val) => setFormData({ ...formData, interests: val as string[] })}
            multiple
            placeholder="Select your interests..."
          />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    );
  },
};

// =============================================================================
// Complete Showcase
// =============================================================================

/**
 * Complete select showcase
 */
export const CompleteShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      {/* Basic */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Basic Select</h4>
        <Select label="Fruit" options={fruitOptions} placeholder="Select..." />
      </div>

      {/* Sizes */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Sizes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select size="sm" aria-label="Small" options={fruitOptions} placeholder="Small" />
          <Select size="md" aria-label="Medium" options={fruitOptions} placeholder="Medium" />
          <Select size="lg" aria-label="Large" options={fruitOptions} placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>States</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select label="Error" options={fruitOptions} error helperText="Selection required" />
          <Select label="Success" options={fruitOptions} success value="apple" />
          <Select label="Disabled" options={fruitOptions} disabled placeholder="Disabled" />
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Features</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select label="Searchable" options={countryOptions} searchable placeholder="Search..." />
          <Select label="Clearable" options={fruitOptions} clearable defaultValue="apple" />
          <Select label="Multiple" options={fruitOptions} multiple placeholder="Select many..." />
          <Select label="Required" options={fruitOptions} required placeholder="Required" />
        </div>
      </div>

      {/* Grouped */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Grouped Options</h4>
        <Select label="Food" options={groupedOptions} placeholder="Select food..." />
      </div>
    </div>
  ),
};
