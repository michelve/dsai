/**
 * Figma Code Connect - Spinner Component
 *
 * Maps the DSAi Spinner Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Spinner/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Spinner } from './Spinner';

/**
 * DSAi Spinner - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_SPINNER>` substitution variable defined in figma.config.json.
 *
 * Accessibility goals:
 * - role="status" for screen reader announcement
 * - Visually hidden text for screen readers
 * - Respects prefers-reduced-motion via Bootstrap CSS
 */
figma.connect(Spinner, '<FIGMA_DSAI_SPINNER>', {
  props: {
    /**
     * Animation type
     * Maps Figma "Animation" property
     */
    animation: figma.enum('Animation', {
      Border: 'border',
      Grow: 'grow',
    }),

    /**
     * Spinner size
     * Maps Figma "Size" property
     */
    size: figma.enum('Size', {
      'Extra Small': 'xs',
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
    }),

    /**
     * Color variant
     * Maps Figma "Variant" property
     */
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
    }),

    /**
     * Center in container
     * Maps Figma "Centered" boolean property
     */
    centered: figma.boolean('Centered'),

    /**
     * Accessible label
     * Maps Figma "Label" text property
     */
    label: figma.string('Label'),

    /**
     * Render as span (for inline use)
     * Maps Figma "Inline" boolean property
     */
    inline: figma.boolean('Inline'),
  },

  example: ({ animation, size, variant, centered, label, inline }) => {
    const normalizedLabel = label && label.trim().length > 0 ? label.trim() : 'Loading...';

    return (
      <Spinner
        animation={animation}
        size={size}
        variant={variant}
        centered={centered}
        label={normalizedLabel}
        as={inline ? 'span' : 'div'}
      />
    );
  },
});

/**
 * Spinner Usage Patterns
 *
 * 1. Basic Border Spinner:
 *    <Spinner />
 *
 * 2. Growing Spinner:
 *    <Spinner animation="grow" />
 *
 * 3. With Color Variant:
 *    <Spinner variant="primary" />
 *    <Spinner variant="success" />
 *    <Spinner variant="danger" />
 *
 * 4. Different Sizes:
 *    <Spinner size="xs" />
 *    <Spinner size="sm" />
 *    <Spinner size="md" />
 *    <Spinner size="lg" />
 *    <Spinner size="xl" />
 *
 * 5. Centered:
 *    <div style={{ height: 200 }}>
 *      <Spinner centered variant="primary" />
 *    </div>
 *
 * 6. In a Button:
 *    <Button disabled>
 *      <Spinner size="sm" as="span" className="me-2" />
 *      Loading...
 *    </Button>
 *
 * 7. With Custom Label:
 *    <Spinner label="Processing your request..." />
 *
 * 8. Full Page Loading:
 *    <div className="vh-100">
 *      <Spinner centered size="lg" variant="primary" label="Loading application..." />
 *    </div>
 *
 * Accessibility Notes:
 * - role="status" announces loading to screen readers
 * - Visually hidden text describes the loading state
 * - Bootstrap respects prefers-reduced-motion
 * - Use meaningful labels for context (not just "Loading...")
 */
