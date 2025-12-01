/**
 * Figma Code Connect - CardList Component
 *
 * Maps the DSAi CardList Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module CardList/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { CardList } from './CardList';

/**
 * DSAi CardList - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_CARDLIST>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Proper fieldset/legend structure for screen readers
 * - Require label or aria-label for accessibility
 * - FSM-based selection for predictable behavior
 */
figma.connect(CardList, '<FIGMA_DSAI_CARDLIST>', {
  props: {
    /**
     * Selection mode
     * Maps Figma "Selection Mode" property to React selectionMode prop
     * - none: Display only (no selection)
     * - single: Radio-like (one selection)
     * - multiple: Checkbox-like (multiple selections)
     */
    selectionMode: figma.enum('Selection Mode', {
      None: 'none',
      Single: 'single',
      Multiple: 'multiple',
    }),

    /**
     * Card variant for all cards in the list
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Elevated: 'elevated',
      Outlined: 'outlined',
      Ghost: 'ghost',
    }),

    /**
     * Selected color when card is selected
     * Maps Figma "Selected Color" property to React selectedColor prop
     */
    selectedColor: figma.enum('Selected Color', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      None: undefined,
    }),

    /**
     * Layout orientation
     * Maps Figma "Orientation" property to React orientation prop
     */
    orientation: figma.enum('Orientation', {
      Vertical: 'vertical',
      Horizontal: 'horizontal',
    }),

    /**
     * Number of columns for grid layout
     * Maps Figma "Columns" property to React columns prop
     */
    columns: figma.enum('Columns', {
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      Auto: undefined,
    }),

    /**
     * Gap between cards
     * Maps Figma "Gap" property to React gap prop
     */
    gap: figma.enum('Gap', {
      Small: '0.25rem',
      Medium: '0.5rem',
      Large: '1rem',
    }),

    /**
     * Horizontal card layout (image on side)
     * Maps Figma "Horizontal Cards" boolean property
     */
    horizontal: figma.boolean('Horizontal Cards'),

    /**
     * Disabled state for all cards
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Error state
     * Maps Figma "Error" boolean property
     */
    error: figma.boolean('Error'),

    /**
     * Error message
     * Maps Figma "Error Message" text property
     */
    errorMessage: figma.string('Error Message'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),

    /**
     * Visible label (renders as legend)
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Helper text
     * Maps Figma "Helper Text" text property
     */
    helperText: figma.string('Helper Text'),

    /**
     * Number of items to show in example
     * Maps Figma "Item Count" property
     */
    itemCount: figma.enum('Item Count', {
      '2': 2,
      '3': 3,
      '4': 4,
    }),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - selectionMode determines value/onChange types
   * - FSM manages selection state internally
   * - Fieldset/legend pattern for group accessibility
   */
  example: ({
    selectionMode,
    variant,
    selectedColor,
    orientation,
    columns,
    gap,
    horizontal,
    disabled,
    error,
    errorMessage,
    required,
    label,
    helperText,
    itemCount,
  }) => {
    // Normalize optional strings
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : 'Select an option';
    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;
    const normalizedErrorMessage =
      errorMessage && errorMessage.trim().length > 0 ? errorMessage.trim() : undefined;

    // Generate sample items based on count
    const count = itemCount || 3;
    const sampleItems = Array.from({ length: count }, (_, i) => ({
      value: `option-${i + 1}`,
      title: `Option ${i + 1}`,
      description: `Description for option ${i + 1}`,
    }));

    // For single mode
    if (selectionMode === 'single') {
      return (
        <CardList
          label={normalizedLabel}
          helperText={normalizedHelperText}
          selectionMode="single"
          items={sampleItems}
          variant={variant}
          selectedColor={selectedColor}
          orientation={orientation}
          columns={columns}
          gap={gap}
          horizontal={horizontal}
          disabled={disabled}
          error={error}
          errorMessage={normalizedErrorMessage}
          required={required}
          onChange={(value) => console.warn('CardList selection changed:', value)}
        />
      );
    }

    // For multiple mode
    if (selectionMode === 'multiple') {
      return (
        <CardList
          label={normalizedLabel}
          helperText={normalizedHelperText}
          selectionMode="multiple"
          items={sampleItems}
          variant={variant}
          selectedColor={selectedColor}
          orientation={orientation}
          columns={columns}
          gap={gap}
          horizontal={horizontal}
          disabled={disabled}
          error={error}
          errorMessage={normalizedErrorMessage}
          required={required}
          onChange={(values) => console.warn('CardList selection changed:', values)}
        />
      );
    }

    // For none mode (display only)
    return (
      <CardList
        label={normalizedLabel}
        helperText={normalizedHelperText}
        selectionMode="none"
        items={sampleItems}
        variant={variant}
        orientation={orientation}
        columns={columns}
        gap={gap}
        horizontal={horizontal}
        disabled={disabled}
      />
    );
  },
});

/**
 * CardList Usage Patterns
 *
 * 1. Display Only (no selection):
 *    <CardList
 *      label="Available plans"
 *      selectionMode="none"
 *      items={[
 *        { value: 'basic', title: 'Basic', description: '$9/month' },
 *        { value: 'pro', title: 'Pro', description: '$29/month' },
 *      ]}
 *    />
 *
 * 2. Single Selection (radio-like):
 *    const [selected, setSelected] = useState<string>();
 *
 *    <CardList
 *      label="Select a plan"
 *      selectionMode="single"
 *      items={plans}
 *      value={selected}
 *      onChange={setSelected}
 *    />
 *
 * 3. Multiple Selection (checkbox-like):
 *    const [selected, setSelected] = useState<string[]>([]);
 *
 *    <CardList
 *      label="Select features"
 *      selectionMode="multiple"
 *      items={features}
 *      value={selected}
 *      onChange={setSelected}
 *    />
 *
 * 4. Grid Layout:
 *    <CardList
 *      label="Select options"
 *      selectionMode="single"
 *      items={options}
 *      columns={3}
 *      gap="1rem"
 *    />
 *
 * 5. With Validation:
 *    <CardList
 *      label="Required selection"
 *      selectionMode="single"
 *      items={items}
 *      required
 *      error={!selected}
 *      errorMessage="Please select an option"
 *    />
 *
 * Accessibility Notes:
 * - Renders as fieldset with legend for proper group semantics
 * - Required label or aria-label for screen readers
 * - FSM ensures predictable selection behavior
 * - Individual cards have proper radio/checkbox semantics
 */
