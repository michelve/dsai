/**
 * Figma Code Connect - Progress Component
 *
 * Maps the DSAi Progress Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Progress/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Progress } from './Progress';

/**
 * DSAi Progress - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_PROGRESS>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - role="progressbar" for screen readers
 * - aria-valuenow, aria-valuemin, aria-valuemax for progress state
 * - aria-valuetext for custom descriptions
 * - aria-busy="true" for indeterminate loading state
 */
figma.connect(Progress, '<FIGMA_DSAI_PROGRESS>', {
  props: {
    /**
     * Progress value (0-100)
     * Maps Figma "Value" property to React value prop
     */
    value: figma.enum('Value', {
      '0': 0,
      '25': 25,
      '50': 50,
      '75': 75,
      '100': 100,
    }),

    /**
     * Color variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Dark: 'dark',
    }),

    /**
     * Progress bar size
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Indeterminate loading state
     * Maps Figma "Indeterminate" boolean property
     */
    indeterminate: figma.boolean('Indeterminate'),

    /**
     * Striped pattern
     * Maps Figma "Striped" boolean property
     */
    striped: figma.boolean('Striped'),

    /**
     * Animated stripes
     * Maps Figma "Animated" boolean property
     */
    animated: figma.boolean('Animated'),

    /**
     * Show value inside bar
     * Maps Figma "Show Value" boolean property
     */
    showValue: figma.boolean('Show Value'),

    /**
     * Label text above progress bar
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Custom value text
     * Maps Figma "Value Text" text property
     */
    valueText: figma.string('Value Text'),

    /**
     * Accessible label
     * Maps Figma "Aria Label" text property
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Is stacked (multiple bars)
     * Maps Figma "Stacked" boolean property
     */
    stacked: figma.boolean('Stacked'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   */
  example: ({
    value,
    variant,
    size,
    indeterminate,
    striped,
    animated,
    showValue,
    label,
    valueText,
    ariaLabel,
    stacked,
  }) => {
    // Normalize optional strings
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : undefined;
    const normalizedValueText =
      valueText && valueText.trim().length > 0 ? valueText.trim() : undefined;
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    // Stacked progress bars
    if (stacked) {
      return (
        <Progress aria-label={normalizedAriaLabel || 'Stacked progress'}>
          <Progress.Bar value={25} variant="success" />
          <Progress.Bar value={35} variant="warning" />
          <Progress.Bar value={15} variant="danger" />
        </Progress>
      );
    }

    // Indeterminate loading state
    if (indeterminate) {
      return (
        <Progress
          indeterminate
          variant={variant}
          size={size}
          label={normalizedLabel}
          striped={striped}
          animated
          aria-label={normalizedAriaLabel || 'Loading'}
        />
      );
    }

    // Standard progress bar
    return (
      <Progress
        value={value}
        variant={variant}
        size={size}
        label={normalizedLabel}
        showValue={showValue}
        valueText={normalizedValueText}
        striped={striped}
        animated={animated}
        aria-label={normalizedAriaLabel}
      />
    );
  },
});

/**
 * Progress Usage Patterns
 *
 * 1. Basic Progress Bar:
 *    <Progress value={75} />
 *
 * 2. With Label and Value Display:
 *    <Progress value={50} label="Uploading files..." showValue />
 *
 * 3. Indeterminate Loading State:
 *    <Progress indeterminate variant="info" aria-label="Loading content" />
 *
 * 4. Striped and Animated:
 *    <Progress value={60} striped animated variant="success" />
 *
 * 5. Different Sizes:
 *    <Progress value={40} size="sm" />
 *    <Progress value={40} size="md" />
 *    <Progress value={40} size="lg" />
 *
 * 6. Color Variants:
 *    <Progress value={25} variant="success" />
 *    <Progress value={50} variant="warning" />
 *    <Progress value={75} variant="danger" />
 *
 * 7. With Custom Value Text:
 *    <Progress value={33} valueText="1 of 3 steps" showValue />
 *
 * 8. Stacked Progress Bars:
 *    <Progress aria-label="Disk usage breakdown">
 *      <Progress.Bar value={15} variant="success" aria-label="Free space: 15%" />
 *      <Progress.Bar value={30} variant="warning" aria-label="Documents: 30%" />
 *      <Progress.Bar value={20} variant="danger" aria-label="System: 20%" />
 *    </Progress>
 *
 * Accessibility Notes:
 * - role="progressbar" applied automatically
 * - aria-valuenow, aria-valuemin, aria-valuemax set for determinate progress
 * - aria-valuetext provides readable progress description
 * - aria-busy="true" for indeterminate state
 * - Stacked bars use role="group" on container
 * - Individual stacked bars can be aria-hidden if container has label
 */
