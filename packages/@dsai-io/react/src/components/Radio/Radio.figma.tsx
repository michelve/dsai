/**
 * Figma Code Connect - Radio Component
 *
 * Maps the DSAi Radio Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Radio/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

/**
 * DSAi Radio - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_RADIO>` substitution variable defined in figma.config.json.
 *
 * Accessibility goals:
 * - Native input type="radio" for keyboard support
 * - Proper label association
 * - Arrow key navigation within RadioGroup
 * - Minimum 44×44px touch target
 */
figma.connect(Radio, '<FIGMA_DSAI_RADIO>', {
  props: {
    /**
     * Radio label text
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Checked state
     * Maps Figma "Checked" boolean property
     */
    checked: figma.boolean('Checked'),

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
     * Inline display
     * Maps Figma "Inline" boolean property
     */
    inline: figma.boolean('Inline'),

    /**
     * Reverse label position
     * Maps Figma "Reverse" boolean property
     */
    reverse: figma.boolean('Reverse'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),
  },

  example: ({ label, checked, disabled, error, inline, reverse, required }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : 'Option';

    return (
      <Radio
        value="option-value"
        label={normalizedLabel}
        checked={checked}
        disabled={disabled}
        error={error}
        inline={inline}
        reverse={reverse}
        required={required}
        name="radio-group"
        onChange={() => {}}
      />
    );
  },
});

/**
 * DSAi RadioGroup - Code Connect Mapping
 *
 * Container for managing a group of Radio buttons.
 */
figma.connect(RadioGroup, '<FIGMA_DSAI_RADIO_GROUP>', {
  props: {
    /**
     * Group label
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Number of options
     * Maps Figma "Option Count" property
     */
    optionCount: figma.enum('Option Count', {
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
    }),

    /**
     * Display inline
     * Maps Figma "Inline" boolean property
     */
    inline: figma.boolean('Inline'),

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
     * Helper text
     * Maps Figma "Helper Text" text property
     */
    helperText: figma.string('Helper Text'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),
  },

  example: ({ label, optionCount, inline, disabled, error, helperText, required }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;
    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;

    const count = optionCount || 3;
    const options = Array.from({ length: count }, (_, i) => ({
      value: `option-${i + 1}`,
      label: `Option ${i + 1}`,
    }));

    return (
      <RadioGroup
        name="example-group"
        label={normalizedLabel}
        helperText={normalizedHelperText}
        inline={inline}
        disabled={disabled}
        error={error}
        required={required}
        defaultValue={options[0]?.value}
      >
        {options.map((opt) => (
          <Radio key={opt.value} value={opt.value} label={opt.label} />
        ))}
      </RadioGroup>
    );
  },
});

/**
 * Radio Usage Patterns
 *
 * 1. Single Radio (within group context):
 *    <Radio value="option1" label="Option 1" name="options" />
 *
 * 2. RadioGroup (recommended):
 *    <RadioGroup name="size" value={size} onChange={setSize} label="Select Size">
 *      <Radio value="sm" label="Small" />
 *      <Radio value="md" label="Medium" />
 *      <Radio value="lg" label="Large" />
 *    </RadioGroup>
 *
 * 3. Inline Layout:
 *    <RadioGroup name="color" inline label="Color">
 *      <Radio value="red" label="Red" />
 *      <Radio value="blue" label="Blue" />
 *      <Radio value="green" label="Green" />
 *    </RadioGroup>
 *
 * 4. With Helper Text:
 *    <RadioGroup
 *      name="plan"
 *      label="Select Plan"
 *      helperText="Choose the plan that fits your needs"
 *    >
 *      <Radio value="free" label="Free" />
 *      <Radio value="pro" label="Pro" />
 *    </RadioGroup>
 *
 * 5. With Error State:
 *    <RadioGroup name="required" error helperText="Please select an option">
 *      <Radio value="yes" label="Yes" />
 *      <Radio value="no" label="No" />
 *    </RadioGroup>
 *
 * Accessibility Notes:
 * - Native input type="radio" for full keyboard support
 * - Arrow keys navigate between options in group
 * - Tab moves focus to/from the group
 * - Labels properly associated with inputs
 */
