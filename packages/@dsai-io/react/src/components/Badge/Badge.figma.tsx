/**
 * Figma Code Connect - Badge Component
 *
 * Maps the DSAi Badge Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Badge/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Badge } from './Badge';

/**
 * DSAi Badge - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_BADGE>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Ensure dot-only badges always have aria-label.
 * - Make it clear when badge is status indicator vs decorative.
 */
figma.connect(Badge, '<FIGMA_DSAI_BADGE>', {
  props: {
    /**
     * Visual style variant
     * Maps Figma "Variant" property to React variant prop
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
     * Pill shape (fully rounded)
     * Maps Figma "Pill" boolean property
     */
    pill: figma.boolean('Pill'),

    /**
     * Dot indicator
     * Maps Figma "Dot" boolean property
     * When true without label, requires aria-label for accessibility
     */
    dot: figma.boolean('Dot'),

    /**
     * Badge label/content
     * Maps Figma "Label" text layer to children prop
     */
    children: figma.string('Label'),

    /**
     * Accessible label (required for dot-only badges)
     * Maps Figma "Aria Label" property
     *
     * Use this when:
     * - The badge is dot-only (no visible text)
     * - The badge is a status indicator
     */
    ariaLabel: figma.string('Aria Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - aria-label is required when dot is true and children is empty
   * - role="status" is automatically applied for dot-only badges
   */
  example: ({ variant, pill, dot, children, ariaLabel }) => {
    // Normalize aria-label: only include if non-empty
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    // Normalize children: treat empty string as undefined
    const normalizedChildren = children && children.trim().length > 0 ? children : undefined;

    // Dot-only badge: must have aria-label
    if (dot && !normalizedChildren) {
      return (
        <Badge
          variant={variant}
          pill={pill}
          dot={dot}
          aria-label={normalizedAriaLabel || 'Status indicator'}
        />
      );
    }

    // Badge with content
    return (
      <Badge variant={variant} pill={pill} dot={dot} aria-label={normalizedAriaLabel}>
        {normalizedChildren}
      </Badge>
    );
  },
});

/**
 * Badge Usage Patterns
 *
 * 1. Decorative Badge (with text):
 *    <Badge variant="primary">New</Badge>
 *    - No special role needed
 *    - Screen readers read the text content
 *
 * 2. Status Badge (dot-only):
 *    <Badge variant="success" dot aria-label="Online" />
 *    - role="status" is auto-applied
 *    - aria-label is required for accessibility
 *    - Screen readers announce the aria-label
 *
 * 3. Status Badge with text:
 *    <Badge variant="success" dot>Online</Badge>
 *    - Dot is decorative (aria-hidden)
 *    - Screen readers read the text content
 */
