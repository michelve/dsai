/**
 * Figma Code Connect - CheckboxGroup Component
 *
 * Maps the DSAi CheckboxGroup Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module CheckboxGroup/FigmaCodeConnect
 */

import figma from '@figma/code-connect';
import { CheckboxGroup } from './CheckboxGroup';

/**
 * DSAi CheckboxGroup - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_CHECKBOX_GROUP>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * The CheckboxGroup component manages:
 * - Tri-state selection (none/some/all)
 * - Optional "select all" master checkbox
 * - Group-level accessibility (fieldset/legend)
 *
 * Accessibility goals:
 * - Semantic fieldset/legend grouping
 * - aria-describedby for helper/error text
 * - Native required attribute on checkbox inputs
 * - aria-invalid for error state on fieldset
 * - Indeterminate state on select all checkbox
 */
figma.connect(CheckboxGroup, '<FIGMA_DSAI_CHECKBOX_GROUP>', {
  props: {
    /**
     * Group label (rendered as legend)
     * Maps Figma "Label" text property to CheckboxGroup label prop
     */
    label: figma.string('Label'),

    /**
     * Accessible name when there is no visible label.
     * Maps Figma "Aria Label" text property to aria-label.
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Helper / description text
     * Maps to helperText and aria-describedby.
     */
    helperText: figma.string('Helper Text'),

    /**
     * Error state
     * Drives error styling + aria-invalid
     */
    error: figma.boolean('Error'),

    /**
     * Error message text
     * Displayed when error is true
     */
    errorMessage: figma.string('Error Message'),

    /**
     * Disabled state for entire group
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Required field indicator
     */
    required: figma.boolean('Required'),

    /**
     * Whether to show select all checkbox
     */
    showSelectAll: figma.boolean('Show Select All'),

    /**
     * Label for the select all checkbox
     */
    selectAllLabel: figma.string('Select All Label'),

    /**
     * Selection state for visual representation
     * - None: No items selected
     * - Some: Some items selected (indeterminate)
     * - All: All items selected
     */
    selectionState: figma.enum('Selection State', {
      None: 'none',
      Some: 'some',
      All: 'all',
    }),

    /**
     * Layout orientation
     * - Vertical: Stacked checkboxes
     * - Horizontal: Inline checkboxes
     */
    orientation: figma.enum('Orientation', {
      Vertical: 'vertical',
      Horizontal: 'horizontal',
    }),

    /**
     * Option items from nested instances
     * Maps to options array with checkbox children
     */
    options: figma.children('Option*'),

    /**
     * Optional form name
     */
    name: figma.string('Name'),
  },

  /**
   * Example code template
   * This is what Code Connect (and AI agents) will generate by default.
   */
  example: ({
    label,
    ariaLabel,
    helperText,
    error,
    errorMessage,
    disabled,
    required,
    showSelectAll,
    selectAllLabel,
    selectionState,
    orientation,
    name,
  }) => {
    // Normalize label & aria-label:
    // - Prefer visible label when present
    // - Only send aria-label when there is no visible label
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;

    const normalizedAriaLabel =
      !normalizedLabel && ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;

    const normalizedErrorMessage =
      errorMessage && errorMessage.trim().length > 0 ? errorMessage.trim() : undefined;

    const normalizedSelectAllLabel =
      selectAllLabel && selectAllLabel.trim().length > 0 ? selectAllLabel.trim() : undefined;

    const normalizedName = name && name.trim().length > 0 ? name.trim() : undefined;

    // Create example options for generated code
    // In real usage, these would come from props/state
    const exampleOptions = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];

    // Derive example default value from selection state
    // This helps show the visual state in the generated example
    const defaultValue =
      selectionState === 'all'
        ? ['option1', 'option2', 'option3']
        : selectionState === 'some'
          ? ['option1']
          : [];

    return (
      <CheckboxGroup
        label={normalizedLabel}
        aria-label={normalizedAriaLabel}
        options={exampleOptions}
        defaultValue={defaultValue}
        helperText={normalizedHelperText}
        error={error}
        errorMessage={normalizedErrorMessage}
        disabled={disabled}
        required={required}
        showSelectAll={showSelectAll}
        selectAllLabel={normalizedSelectAllLabel}
        orientation={orientation}
        name={normalizedName}
      />
    );
  },
});
