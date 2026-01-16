/**
 * Figma Code Connect - Sheet Component
 *
 * Maps the DSAi Sheet Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Sheet/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Sheet } from './Sheet';

/**
 * DSAi Sheet - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_SHEET>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Encourage proper use of Sheet.Header with title for aria-labelledby.
 * - Support closeOnEscape for keyboard accessibility.
 * - Make it clear that focus trap is automatic in modal mode.
 */
figma.connect(Sheet, '<FIGMA_DSAI_SHEET>', {
  props: {
    /**
     * Sheet placement
     * Maps Figma "Placement" property to React placement prop
     * Determines which edge the sheet slides in from
     */
    placement: figma.enum('Placement', {
      Left: 'left',
      Right: 'right',
      Top: 'top',
      Bottom: 'bottom',
    }),

    /**
     * Sheet size
     * Maps Figma "Size" property to React size prop
     * Controls width (left/right) or height (top/bottom)
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
      'Extra Large': 'xl',
      Full: 'full',
      Auto: 'auto',
    }),

    /**
     * Surface variant
     * Maps Figma "Surface" property to React surface prop
     * Controls the visual appearance
     */
    surface: figma.enum('Surface', {
      Default: 'default',
      Elevated: 'elevated',
      Inverse: 'inverse',
      Transparent: 'transparent',
    }),

    /**
     * Sheet mode
     * Maps Figma "Mode" property to React mode prop
     * - Modal: with backdrop, blocks interaction
     * - Non-Modal: no backdrop, can interact with background
     */
    mode: figma.enum('Mode', {
      Modal: 'modal',
      'Non-Modal': 'non-modal',
    }),

    /**
     * Show backdrop
     * Maps Figma "Backdrop" boolean property
     * Only applies in modal mode
     */
    backdrop: figma.boolean('Backdrop'),

    /**
     * Static backdrop
     * Maps Figma "Static Backdrop" boolean property
     * When true, clicking backdrop doesn't close but shows visual feedback
     */
    staticBackdrop: figma.boolean('Static Backdrop'),

    /**
     * Close on backdrop click
     * Maps Figma "Close On Backdrop" boolean property
     */
    closeOnBackdropClick: figma.boolean('Close On Backdrop'),

    /**
     * Close on escape key
     * Maps Figma "Close On Escape" boolean property
     */
    closeOnEscape: figma.boolean('Close On Escape'),

    /**
     * Animated transitions
     * Maps Figma "Animated" boolean property
     * Note: Automatically disabled when user prefers reduced motion
     */
    animated: figma.boolean('Animated'),

    /**
     * Sheet title
     * Maps Figma "Title" text layer for header content
     */
    title: figma.string('Title'),

    /**
     * Sheet content
     * Maps Figma "Content" text layer for body content
     */
    content: figma.string('Content'),

    /**
     * Show close button
     * Maps Figma "Close Button" boolean property in header
     */
    closeButton: figma.boolean('Close Button'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - Demonstrates compound component pattern (Sheet.Header, Sheet.Body, Sheet.Footer)
   * - Includes controlled state pattern with isOpen/onClose
   * - Shows proper accessibility setup with title in header
   */
  example: ({
    placement,
    size,
    surface,
    mode,
    backdrop,
    staticBackdrop,
    closeOnBackdropClick,
    closeOnEscape,
    animated,
    title,
    content,
    closeButton,
  }) => {
    // Normalize optional string props
    const normalizedTitle = title && title.trim().length > 0 ? title.trim() : 'Sheet Title';
    const normalizedContent =
      content && content.trim().length > 0 ? content.trim() : 'Sheet content goes here.';

    return (
      <Sheet
        isOpen
        onClose={() => {}}
        placement={placement}
        size={size}
        surface={surface}
        mode={mode}
        backdrop={backdrop}
        staticBackdrop={staticBackdrop}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
        animated={animated}
      >
        <Sheet.Header closeButton={closeButton}>{normalizedTitle}</Sheet.Header>
        <Sheet.Body>{normalizedContent}</Sheet.Body>
        <Sheet.Footer>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            Save
          </button>
        </Sheet.Footer>
      </Sheet>
    );
  },
});

/**
 * Sheet.Header - Code Connect Mapping
 *
 * Maps the Sheet header sub-component with title and close button.
 */
figma.connect(Sheet.Header, '<FIGMA_DSAI_SHEET_HEADER>', {
  props: {
    /**
     * Header title text
     */
    title: figma.string('Title'),

    /**
     * Show close button
     */
    closeButton: figma.boolean('Close Button'),
  },

  example: ({ title, closeButton }) => {
    const normalizedTitle = title && title.trim().length > 0 ? title.trim() : 'Sheet Title';

    return <Sheet.Header closeButton={closeButton}>{normalizedTitle}</Sheet.Header>;
  },
});

/**
 * Sheet.Body - Code Connect Mapping
 *
 * Maps the Sheet body sub-component for scrollable content area.
 */
figma.connect(Sheet.Body, '<FIGMA_DSAI_SHEET_BODY>', {
  props: {
    /**
     * Body content
     */
    content: figma.string('Content'),
  },

  example: ({ content }) => {
    const normalizedContent =
      content && content.trim().length > 0 ? content.trim() : 'Sheet content goes here.';

    return <Sheet.Body>{normalizedContent}</Sheet.Body>;
  },
});

/**
 * Sheet.Footer - Code Connect Mapping
 *
 * Maps the Sheet footer sub-component for action buttons.
 */
figma.connect(Sheet.Footer, '<FIGMA_DSAI_SHEET_FOOTER>', {
  props: {
    /**
     * Primary action label
     */
    primaryLabel: figma.string('Primary Label'),

    /**
     * Secondary action label
     */
    secondaryLabel: figma.string('Secondary Label'),

    /**
     * Show primary button
     */
    showPrimary: figma.boolean('Show Primary'),

    /**
     * Show secondary button
     */
    showSecondary: figma.boolean('Show Secondary'),
  },

  example: ({ primaryLabel, secondaryLabel, showPrimary, showSecondary }) => {
    const normalizedPrimary =
      primaryLabel && primaryLabel.trim().length > 0 ? primaryLabel.trim() : 'Save';
    const normalizedSecondary =
      secondaryLabel && secondaryLabel.trim().length > 0 ? secondaryLabel.trim() : 'Cancel';

    return (
      <Sheet.Footer>
        {showSecondary && (
          <button type="button" className="btn btn-secondary">
            {normalizedSecondary}
          </button>
        )}
        {showPrimary && (
          <button type="button" className="btn btn-primary">
            {normalizedPrimary}
          </button>
        )}
      </Sheet.Footer>
    );
  },
});
