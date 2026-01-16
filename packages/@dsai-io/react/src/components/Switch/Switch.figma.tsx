/**
 * Figma Code Connect - Switch Component
 *
 * Maps the DSAi Switch Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Switch/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Switch } from './Switch';

/**
 * DSAi Switch - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_SWITCH>` substitution variable defined in figma.config.json.
 *
 * Toggle switch for binary on/off states.
 *
 * Accessibility goals:
 * - role="switch" with aria-checked
 * - Native button element for keyboard support
 * - Label click toggles the switch
 * - aria-busy for loading state
 */
figma.connect(Switch, '<FIGMA_DSAI_SWITCH>', {
  props: {
    /**
     * Switch size
     * Maps Figma "Size" property
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Checked/on state
     * Maps Figma "Checked" boolean property
     */
    checked: figma.boolean('Checked'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Loading state
     * Maps Figma "Loading" boolean property
     */
    loading: figma.boolean('Loading'),

    /**
     * Error state
     * Maps Figma "Error" boolean property
     */
    error: figma.boolean('Error'),

    /**
     * Required field
     * Maps Figma "Required" boolean property
     */
    required: figma.boolean('Required'),

    /**
     * Label text
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Label position
     * Maps Figma "Label Position" property
     */
    labelPosition: figma.enum('Label Position', {
      Start: 'start',
      End: 'end',
    }),

    /**
     * Helper text
     * Maps Figma "Helper Text" text property
     */
    helperText: figma.string('Helper Text'),

    /**
     * Show on/off text
     * Maps Figma "Show Text" boolean property
     */
    showText: figma.boolean('Show Text'),

    /**
     * On text
     * Maps Figma "On Text" text property
     */
    onText: figma.string('On Text'),

    /**
     * Off text
     * Maps Figma "Off Text" text property
     */
    offText: figma.string('Off Text'),
  },

  example: ({
    size,
    checked,
    disabled,
    loading,
    error,
    required,
    label,
    labelPosition,
    helperText,
    showText,
    onText,
    offText,
  }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;
    const normalizedHelperText =
      helperText && helperText.trim().length > 0 ? helperText.trim() : undefined;
    const normalizedOnText =
      showText && onText && onText.trim().length > 0 ? onText.trim() : undefined;
    const normalizedOffText =
      showText && offText && offText.trim().length > 0 ? offText.trim() : undefined;

    return (
      <Switch
        size={size}
        checked={checked}
        disabled={disabled}
        loading={loading}
        error={error}
        required={required}
        label={normalizedLabel}
        labelPosition={labelPosition}
        helperText={normalizedHelperText}
        onText={normalizedOnText}
        offText={normalizedOffText}
        onChange={() => {}}
      />
    );
  },
});

/**
 * Switch Usage Patterns
 *
 * 1. Basic Switch:
 *    <Switch label="Enable notifications" />
 *
 * 2. Controlled Switch:
 *    <Switch
 *      checked={darkMode}
 *      onChange={setDarkMode}
 *      label="Dark mode"
 *    />
 *
 * 3. With Loading State:
 *    <Switch
 *      checked={isSaving}
 *      loading={isSaving}
 *      label="Auto-save"
 *    />
 *
 * 4. Different Sizes:
 *    <Switch size="sm" label="Small" />
 *    <Switch size="md" label="Medium" />
 *    <Switch size="lg" label="Large" />
 *
 * 5. With On/Off Text:
 *    <Switch
 *      label="Feature toggle"
 *      onText="ON"
 *      offText="OFF"
 *    />
 *
 * 6. Label at Start:
 *    <Switch
 *      label="Setting name"
 *      labelPosition="start"
 *    />
 *
 * 7. With Helper Text:
 *    <Switch
 *      label="Marketing emails"
 *      helperText="Receive updates about new features and promotions"
 *    />
 *
 * 8. With Icons:
 *    <Switch
 *      label="Theme"
 *      onIcon={<SunIcon />}
 *      offIcon={<MoonIcon />}
 *    />
 *
 * Accessibility Notes:
 * - role="switch" with aria-checked state
 * - Native button provides keyboard support (Space, Enter)
 * - Label click toggles the switch
 * - aria-busy="true" during loading
 * - aria-describedby links to helper text
 */
