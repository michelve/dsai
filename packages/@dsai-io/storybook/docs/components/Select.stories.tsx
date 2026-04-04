import { Button, Heading, Select } from '@dsai-io/react';
import { useState } from 'react';

import type { SelectOption } from '@dsai-io/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
export const ErrorState: Story = {
  name: 'Error',
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
  render: function Render() {
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
  render: function Render() {
    const colorOptions: SelectOption[] = [
      { value: 'var(--bs-danger)', label: 'Red' },
      { value: 'var(--bs-success)', label: 'Green' },
      { value: 'var(--bs-primary)', label: 'Blue' },
      { value: 'var(--bs-warning)', label: 'Yellow' },
      { value: 'var(--bs-purple)', label: 'Magenta' },
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

          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </form>
    );
  },
};

// =============================================================================
// Type-ahead
// =============================================================================

/**
 * Type-ahead navigation — press a character key to jump to matching option.
 * Works in non-searchable mode. Try pressing 'b' to jump to Banana.
 */
export const TypeAhead: Story = {
  args: {
    label: 'Fruit (try pressing a letter key)',
    options: fruitOptions,
    placeholder: 'Focus and type a letter...',
  },
};

// =============================================================================
// Large Option List with Limit
// =============================================================================

/**
 * Large option list demonstrating the `limit` prop.
 * Only the first 20 options are rendered; search to find more.
 */
export const LargeOptionList: Story = {
  render: function LargeList() {
    const largeOptions: SelectOption[] = Array.from({ length: 500 }, (_, i) => ({
      value: `item-${i}`,
      label: `Item ${i + 1} — ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i % 5]}`,
    }));

    return (
      <Select
        label="Large List (500 items, limit=20)"
        options={largeOptions}
        limit={20}
        searchable
        placeholder="Search items..."
      />
    );
  },
};

// =============================================================================
// Async-like Pattern
// =============================================================================

/**
 * Simulated async loading using onSearchChange + loading state.
 * Type at least 2 characters to trigger a simulated search.
 */
export const AsyncPattern: Story = {
  render: function AsyncSelect() {
    const [value, setValue] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [asyncOptions, setAsyncOptions] = useState<SelectOption[]>([]);

    const allOptions: SelectOption[] = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'solid', label: 'SolidJS' },
      { value: 'preact', label: 'Preact' },
      { value: 'lit', label: 'Lit' },
      { value: 'qwik', label: 'Qwik' },
    ];

    const handleSearchChange = (search: string): void => {
      if (search.length < 2) {
        setAsyncOptions([]);
        return;
      }

      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const filtered = allOptions.filter((opt) =>
          opt.label.toLowerCase().includes(search.toLowerCase())
        );
        setAsyncOptions(filtered);
        setIsLoading(false);
      }, 500);
    };

    return (
      <div style={{ maxWidth: '400px' }}>
        <Select
          label="Framework (type 2+ chars)"
          options={asyncOptions}
          value={value}
          onChange={(val) => setValue(val as string | undefined)}
          searchable
          loading={isLoading}
          onSearchChange={handleSearchChange}
          placeholder="Search frameworks..."
          noOptionsMessage="Type at least 2 characters to search"
        />
        <p className="mt-2 text-muted small">Selected: {value || '(none)'}</p>
      </div>
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
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Basic Select
        </Heading>
        <Select label="Fruit" options={fruitOptions} placeholder="Select..." />
      </div>

      {/* Sizes */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Sizes
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select size="sm" aria-label="Small" options={fruitOptions} placeholder="Small" />
          <Select size="md" aria-label="Medium" options={fruitOptions} placeholder="Medium" />
          <Select size="lg" aria-label="Large" options={fruitOptions} placeholder="Large" />
        </div>
      </div>

      {/* States */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          States
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select label="Error" options={fruitOptions} error helperText="Selection required" />
          <Select label="Success" options={fruitOptions} success value="apple" />
          <Select label="Disabled" options={fruitOptions} disabled placeholder="Disabled" />
        </div>
      </div>

      {/* Features */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Features
        </Heading>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Select label="Searchable" options={countryOptions} searchable placeholder="Search..." />
          <Select label="Clearable" options={fruitOptions} clearable defaultValue="apple" />
          <Select label="Multiple" options={fruitOptions} multiple placeholder="Select many..." />
          <Select label="Required" options={fruitOptions} required placeholder="Required" />
        </div>
      </div>

      {/* Grouped */}
      <div>
        <Heading level={4} style={{ marginBottom: '0.5rem' }}>
          Grouped Options
        </Heading>
        <Select label="Food" options={groupedOptions} placeholder="Select food..." />
      </div>
    </div>
  ),
};
