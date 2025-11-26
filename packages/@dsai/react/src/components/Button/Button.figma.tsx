/**
 * Figma Code Connect - Button Component
 *
 * Maps the DSAi Button Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Button/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Button } from './Button';

/**
 * DSAi Button - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_BUTTON>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Make it easy to wire loading state correctly.
 * - Encourage aria-label for icon-only buttons.
 * - Support live announcements via announceText.
 */
figma.connect(Button, '<FIGMA_DSAI_BUTTON>', {
  props: {
    /**
     * Visual style variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      // Solid variants
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      // Outline variants
      'Outline Primary': 'outline-primary',
      'Outline Secondary': 'outline-secondary',
      'Outline Success': 'outline-success',
      'Outline Danger': 'outline-danger',
      'Outline Warning': 'outline-warning',
      'Outline Info': 'outline-info',
      'Outline Light': 'outline-light',
      'Outline Dark': 'outline-dark',
      // Link variant
      Link: 'link',
    }),

    /**
     * Button size
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * HTML button type
     * Maps Figma "Type" property to React type prop
     */
    type: figma.enum('Type', {
      Button: 'button',
      Submit: 'submit',
      Reset: 'reset',
    }),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Full width
     * Maps Figma "Full Width" boolean property
     */
    fullWidth: figma.boolean('Full Width'),

    /**
     * Loading state
     * Maps Figma "Loading" boolean property to React loading prop
     * This will trigger the spinner, aria-busy, and aria-disabled in the Button.
     */
    loading: figma.boolean('Loading'),

    /**
     * Loading text
     * Optional text announced and shown while loading
     * Maps Figma "Loading Text" property to loadingText prop
     */
    loadingText: figma.string('Loading Text'),

    /**
     * Accessible label
     * Maps Figma "Aria Label" property.
     *
     * Use this when:
     * - The button is icon-only, or
     * - The visible label is not enough for screen readers.
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Announcement text
     * Optional text announced via aria-live when state changes
     * Maps Figma "Announce Text" property.
     */
    announceText: figma.string('Announce Text'),

    /**
     * Button label
     * Maps Figma "Label" text layer to children prop
     */
    children: figma.string('Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - aria-label is only passed when it is non-empty.
   * - loadingText and announceText are only passed when non-empty.
   */
  example: ({
    variant,
    size,
    type,
    disabled,
    fullWidth,
    loading,
    loadingText,
    ariaLabel,
    announceText,
    children,
  }) => {
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    const normalizedLoadingText =
      loadingText && loadingText.trim().length > 0 ? loadingText.trim() : undefined;

    const normalizedAnnounceText =
      announceText && announceText.trim().length > 0 ? announceText.trim() : undefined;

    return (
      <Button
        variant={variant}
        size={size}
        type={type}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        loadingText={normalizedLoadingText}
        aria-label={normalizedAriaLabel}
        announceText={normalizedAnnounceText}
      >
        {children}
      </Button>
    );
  },
});

/**
 * TODO: Icon Button mapping
 *
 * When the Icon Button component is implemented in Figma,
 * add a second figma.connect() for the icon-only / icon-leading / icon-trailing cases.
 *
 * That mapping should:
 * - Require an "Aria Label" when "Icon Only" is selected.
 * - Map the icon instance to startIcon / endIcon props.
 */
