/**
 * Figma Code Connect - Select Component
 *
 * Maps the DSAi Select Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Select/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Select } from './Select';

/**
 * DSAi Select - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_SELECT>` substitution variable defined in figma.config.json.
 *
 * Accessibility goals:
 * - role="combobox" on trigger button
 * - aria-expanded, aria-haspopup="listbox"
 * - aria-activedescendant tracks focused option
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Screen reader announces selection changes
 */
figma.connect(Select, '<FIGMA_DSAI_SELECT>', {
  props: {
    /**
     * Select size
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Label text
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Placeholder text
     * Maps Figma "Placeholder" text property
     */
    placeholder: figma.string('Placeholder'),

    /**
     * Helper text
     * Maps Figma "Helper Text" text property
     */
    helperText: figma.string('Helper Text'),

    /**
     * Multiple selection mode
     * Maps Figma "Multiple" boolean property
     */
    multiple: figma.boolean('Multiple'),

    /**
     * Searchable/filterable
     * Maps Figma "Searchable" boolean property
     */
    searchable: figma.boolean('Searchable'),

    /**
     * Clearable
     * Maps Figma "Clearable" boolean property
     */
    clearable: figma.boolean('Clearable'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Error state
     * Maps Figma "Error" boolean property
     */
    error: figma.boolean('Error'),

    /**
     * Success state
     * Maps Figma "Success" boolean property
     */
    success: figma.boolean('Success'),

    /**
     * Loading state
     * Maps Figma "Loading" boolean property
     */
    loading: figma.boolean('Loading'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),

    /**
     * Dropdown is open
     * Maps Figma "Open" boolean property
     */
    isOpen: figma.boolean('Open'),

    /**
     * Number of options to show in example
     * Maps Figma "Option Count" property
     */
    optionCount: figma.enum('Option Count', {
      '3': 3,
      '5': 5,
      '10': 10,
    }),
  },

  example: ({
    size,
    label,
    placeholder,
    helperText,
    multiple,
    searchable,
    clearable,
    disabled,
    error,
    success,
    loading,
    required,
    optionCount,
  }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;
    const normalizedPlaceholder =
      placeholder && placeholder.trim().length > 0 ? placeholder.trim() : 'Select...';
    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;

    const count = optionCount || 5;
    const options = Array.from({ length: count }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
      disabled: i === count - 1, // Last option disabled as example
    }));

    return (
      <Select
        options={options}
        size={size}
        label={normalizedLabel}
        placeholder={normalizedPlaceholder}
        helperText={normalizedHelperText}
        multiple={multiple}
        searchable={searchable}
        clearable={clearable}
        disabled={disabled}
        error={error}
        success={success}
        loading={loading}
        required={required}
        onChange={() => {}}
      />
    );
  },
});

/**
 * Select Usage Patterns
 *
 * 1. Basic Select:
 *    <Select
 *      label="Country"
 *      options={[
 *        { value: 'us', label: 'United States' },
 *        { value: 'uk', label: 'United Kingdom' },
 *        { value: 'ca', label: 'Canada' },
 *      ]}
 *      onChange={(value) => console.log(value)}
 *    />
 *
 * 2. Multiple Selection:
 *    <Select
 *      label="Skills"
 *      multiple
 *      options={skills}
 *      value={selectedSkills}
 *      onChange={setSelectedSkills}
 *    />
 *
 * 3. Searchable:
 *    <Select
 *      label="Search countries"
 *      searchable
 *      options={countries}
 *      placeholder="Type to search..."
 *    />
 *
 * 4. With Grouped Options:
 *    <Select
 *      label="Select fruit"
 *      options={[
 *        { label: 'Citrus', options: [
 *          { value: 'orange', label: 'Orange' },
 *          { value: 'lemon', label: 'Lemon' },
 *        ]},
 *        { label: 'Berries', options: [
 *          { value: 'strawberry', label: 'Strawberry' },
 *          { value: 'blueberry', label: 'Blueberry' },
 *        ]},
 *      ]}
 *    />
 *
 * 5. With Custom Rendering:
 *    <Select
 *      options={users}
 *      renderOption={(option) => (
 *        <div className="d-flex align-items-center gap-2">
 *          <Avatar src={option.avatar} />
 *          {option.label}
 *        </div>
 *      )}
 *    />
 *
 * 6. Clearable with Validation:
 *    <Select
 *      label="Priority"
 *      clearable
 *      required
 *      error={!value}
 *      helperText={!value ? "Please select a priority" : undefined}
 *      options={priorities}
 *    />
 *
 * Accessibility Notes:
 * - role="combobox" on trigger with aria-haspopup="listbox"
 * - aria-expanded indicates dropdown state
 * - aria-activedescendant tracks keyboard focus
 * - role="listbox" on options container
 * - role="option" with aria-selected on each option
 * - Full keyboard navigation (arrows, enter, escape, home, end)
 */
