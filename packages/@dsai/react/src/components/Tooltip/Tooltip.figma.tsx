/**
 * Figma Code Connect - Tooltip Component
 *
 * Maps the DSAi Tooltip Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Tooltip/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Tooltip } from './Tooltip';

/**
 * DSAi Tooltip - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_TOOLTIP>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Tooltip uses role="tooltip" for screen readers
 * - Trigger element gets aria-describedby when tooltip is visible
 * - Tooltip is visible on keyboard focus (trigger includes 'focus')
 * - ESC key dismisses click-triggered tooltips
 */
figma.connect(Tooltip, '<FIGMA_DSAI_TOOLTIP>', {
  props: {
    /**
     * Tooltip placement
     * Maps Figma "Placement" property to React placement prop
     */
    placement: figma.enum('Placement', {
      Top: 'top',
      'Top Start': 'top-start',
      'Top End': 'top-end',
      Bottom: 'bottom',
      'Bottom Start': 'bottom-start',
      'Bottom End': 'bottom-end',
      Left: 'left',
      'Left Start': 'left-start',
      'Left End': 'left-end',
      Right: 'right',
      'Right Start': 'right-start',
      'Right End': 'right-end',
    }),

    /**
     * Tooltip trigger behavior
     * Maps Figma "Trigger" property to React trigger prop
     */
    trigger: figma.enum('Trigger', {
      Hover: 'hover',
      Focus: 'focus',
      Click: 'click',
      'Hover & Focus': ['hover', 'focus'],
    }),

    /**
     * Show arrow pointer
     * Maps Figma "Arrow" boolean property
     */
    arrow: figma.boolean('Arrow'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Tooltip content text
     * Maps Figma "Content" string property
     */
    content: figma.string('Content'),

    /**
     * Show delay in milliseconds
     * Maps Figma "Show Delay" property
     */
    showDelay: figma.enum('Show Delay', {
      None: 0,
      Short: 200,
      Medium: 500,
      Long: 1000,
    }),

    /**
     * Hide delay in milliseconds
     * Maps Figma "Hide Delay" property
     */
    hideDelay: figma.enum('Hide Delay', {
      None: 0,
      Short: 100,
      Medium: 200,
      Long: 500,
    }),

    /**
     * Max width for wrapping
     * Maps Figma "Max Width" property
     */
    maxWidth: figma.enum('Max Width', {
      Auto: undefined,
      Small: 150,
      Medium: 250,
      Large: 350,
    }),

    /**
     * Trigger element (child instance)
     * Maps Figma nested trigger component
     */
    triggerElement: figma.children('Trigger'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   */
  example: ({
    placement,
    trigger,
    arrow,
    disabled,
    content,
    showDelay,
    hideDelay,
    maxWidth,
    triggerElement,
  }) => (
    <Tooltip
      content={content}
      placement={placement}
      trigger={trigger}
      arrow={arrow}
      disabled={disabled}
      showDelay={showDelay}
      hideDelay={hideDelay}
      maxWidth={maxWidth}
    >
      {triggerElement}
    </Tooltip>
  ),
});

/**
 * Tooltip with Button Trigger - Common Pattern Mapping
 *
 * This maps the most common use case: tooltip on a button.
 */
figma.connect(Tooltip, '<FIGMA_DSAI_TOOLTIP_BUTTON>', {
  props: {
    /**
     * Tooltip placement
     */
    placement: figma.enum('Placement', {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    }),

    /**
     * Tooltip content text
     */
    content: figma.string('Content'),

    /**
     * Show arrow pointer
     */
    arrow: figma.boolean('Arrow'),

    /**
     * Button label text
     */
    buttonLabel: figma.string('Button Label'),

    /**
     * Button variant
     */
    buttonVariant: figma.enum('Button Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
    }),
  },

  example: ({ placement, content, arrow, buttonLabel, buttonVariant }) => (
    <Tooltip content={content} placement={placement} arrow={arrow}>
      <button className={`btn btn-${buttonVariant}`}>{buttonLabel}</button>
    </Tooltip>
  ),
});

/**
 * Tooltip with Icon Trigger - Common Pattern Mapping
 *
 * This maps tooltips on icon buttons (help icons, info icons, etc.).
 */
figma.connect(Tooltip, '<FIGMA_DSAI_TOOLTIP_ICON>', {
  props: {
    /**
     * Tooltip placement
     */
    placement: figma.enum('Placement', {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    }),

    /**
     * Tooltip content text
     */
    content: figma.string('Content'),

    /**
     * Accessible label for icon button (required)
     * When using an icon-only button, aria-label is required
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Icon component
     */
    icon: figma.instance('Icon'),
  },

  example: ({ placement, content, ariaLabel, icon }) => {
    // Normalize aria-label: use provided value or fallback to content
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : content;

    return (
      <Tooltip content={content} placement={placement}>
        <button type="button" className="btn btn-link p-0" aria-label={normalizedAriaLabel}>
          {icon}
        </button>
      </Tooltip>
    );
  },
});

/**
 * Tooltip with Link Trigger - Common Pattern Mapping
 *
 * This maps tooltips on text links.
 */
figma.connect(Tooltip, '<FIGMA_DSAI_TOOLTIP_LINK>', {
  props: {
    /**
     * Tooltip placement
     */
    placement: figma.enum('Placement', {
      Top: 'top',
      Bottom: 'bottom',
    }),

    /**
     * Tooltip content text
     */
    content: figma.string('Content'),

    /**
     * Link text
     */
    linkText: figma.string('Link Text'),

    /**
     * Link href
     */
    href: figma.string('Href'),
  },

  example: ({ placement, content, linkText, href }) => (
    <Tooltip content={content} placement={placement}>
      <a href={href}>{linkText}</a>
    </Tooltip>
  ),
});
