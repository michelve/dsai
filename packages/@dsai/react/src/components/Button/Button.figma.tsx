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
 * @example Generated Code
 * ```tsx
 * import { Button } from '@dsai/react';
 *
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
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
     * Button label
     * Maps Figma "Label" text layer to children prop
     */
    children: figma.string('Label'),
  },

  /**
   * Example code template
   * This is what AI agents will generate when encountering this component
   */
  example: ({ variant, size, type, disabled, fullWidth, children }) => (
    <Button variant={variant} size={size} type={type} disabled={disabled} fullWidth={fullWidth}>
      {children}
    </Button>
  ),
});

/**
 * TODO: Icon Button mapping
 *
 * When Icon Button component is implemented, add a second figma.connect() call:
 *
 * figma.connect(Button, '<FIGMA_DSAI_ICON_BUTTON>', {
 *   props: {
 *     variant: figma.enum('Variant', { Primary: 'primary', ... }),
 *     icon: figma.instance('Icon'),
 *     iconPosition: figma.enum('Icon Position', {
 *       'Leading': 'leading',
 *       'Trailing': 'trailing',
 *       'Icon Only': 'icon-only',
 *     }),
 *     children: figma.string('Label'),
 *   },
 *   example: ({ variant, icon, iconPosition, children }) => (
 *     <Button variant={variant}>
 *       {iconPosition === 'leading' && icon}
 *       {children}
 *       {iconPosition === 'trailing' && icon}
 *     </Button>
 *   ),
 * });
 */
