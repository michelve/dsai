/**
 * Figma Code Connect - Checkbox Component
 *
 * Maps the DSAi Checkbox Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Checkbox/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Checkbox } from './Checkbox';

/**
 * DSAi Checkbox - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_CHECKBOX>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Prefer visible label when present
 * - Fallback to aria-label when there is no visible label
 * - Support indeterminate ("mixed") state from Figma
 * - Surface error + helper text directly from Figma properties
 */
figma.connect(Checkbox, '<FIGMA_DSAI_CHECKBOX>', {
  props: {
    /**
     * Visible label next to the checkbox
     * Maps Figma "Label" text property to Checkbox label prop
     */
    label: figma.string('Label'),

    /**
     * Accessible name when there is no visible label.
     * Maps Figma "Aria Label" text property to aria-label.
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Visual/semantic state
     * - Unchecked
     * - Checked
     * - Indeterminate (mixed)
     */
    state: figma.enum('State', {
      Unchecked: 'unchecked',
      Checked: 'checked',
      Indeterminate: 'indeterminate',
    }),

    /**
     * Disabled state
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Error state
     * Drives error styling + aria-invalid
     */
    error: figma.boolean('Error'),

    /**
     * Helper / description text
     * Maps to helperText and aria-describedby.
     */
    helperText: figma.string('Helper Text'),

    /**
     * Layout variant
     * - Default (stacked)
     * - Inline (form-check-inline)
     * - Reverse (form-check-reverse)
     * - Switch (form-switch)
     */
    layout: figma.enum('Layout', {
      Default: 'default',
      Inline: 'inline',
      Reverse: 'reverse',
      Switch: 'switch',
    }),

    /**
     * Required field indicator
     */
    required: figma.boolean('Required'),

    /**
     * Optional form wiring
     */
    name: figma.string('Name'),
    value: figma.string('Value'),
  },

  /**
   * Example code template
   * This is what Code Connect (and AI agents) will generate by default.
   */
  example: ({
    label,
    ariaLabel,
    state,
    disabled,
    error,
    helperText,
    layout,
    required,
    name,
    value,
  }) => {
    // Normalise label & aria-label according to your implementation:
    // - Prefer visible label when present
    // - Only send aria-label when there is no visible label
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;

    const normalizedAriaLabel =
      !normalizedLabel && ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    // Map state to checked + indeterminate props
    const isChecked = state === 'checked' || state === 'indeterminate';
    const isIndeterminate = state === 'indeterminate';

    // Map layout to the three layout props
    const inline = layout === 'inline';
    const reverse = layout === 'reverse';
    const isSwitch = layout === 'switch';

    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;

    const normalizedName = name && name.trim().length > 0 ? name.trim() : undefined;

    const normalizedValue = value && value.trim().length > 0 ? value.trim() : undefined;

    return (
      <Checkbox
        label={normalizedLabel}
        // For design examples we treat state as "visual" only:
        // - checked/indeterminate drive appearance
        // - apps can still choose controlled/uncontrolled patterns
        checked={isChecked ? true : undefined}
        indeterminate={isIndeterminate}
        disabled={disabled}
        error={error}
        helperText={normalizedHelperText}
        required={required}
        name={normalizedName}
        value={normalizedValue}
        inline={inline}
        reverse={reverse}
        switch={isSwitch}
        aria-label={normalizedAriaLabel}
      />
    );
  },
});
