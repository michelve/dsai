/**
 * Figma Code Connect - Dropdown Component
 *
 * Maps the DSAi Dropdown Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Dropdown/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Dropdown } from './Dropdown';

/**
 * DSAi Dropdown - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_DROPDOWN>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Toggle uses a real button with aria-haspopup="menu"
 * - Menu uses role="menu" with proper focus management
 * - Items use role="menuitem" with keyboard navigation
 * - Split toggles should have explicit aria-label
 */
figma.connect(Dropdown, '<FIGMA_DSAI_DROPDOWN>', {
  props: {
    /**
     * Dropdown placement
     * Maps Figma "Placement" property to React placement prop
     */
    placement: figma.enum('Placement', {
      'Bottom Start': 'bottom-start',
      'Bottom End': 'bottom-end',
      Bottom: 'bottom',
      'Top Start': 'top-start',
      'Top End': 'top-end',
      Top: 'top',
      'Left Start': 'left-start',
      'Left End': 'left-end',
      Left: 'left',
      'Right Start': 'right-start',
      'Right End': 'right-end',
      Right: 'right',
    }),

    /**
     * Auto-close behavior
     * Maps Figma "Auto Close" property to React autoClose prop
     */
    autoClose: figma.enum('Auto Close', {
      True: true,
      False: false,
      Inside: 'inside',
      Outside: 'outside',
    }),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Toggle button variant
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
      'Outline Primary': 'outline-primary',
      'Outline Secondary': 'outline-secondary',
      'Outline Success': 'outline-success',
      'Outline Danger': 'outline-danger',
      'Outline Warning': 'outline-warning',
      'Outline Info': 'outline-info',
      'Outline Light': 'outline-light',
      'Outline Dark': 'outline-dark',
      Link: 'link',
    }),

    /**
     * Toggle button size
     * Maps Figma "Size" property
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Whether to show the dropdown caret
     * Maps Figma "Show Caret" property
     */
    showCaret: figma.boolean('Show Caret'),

    /**
     * Toggle button label
     * Maps Figma "Label" property
     */
    label: figma.string('Label'),

    /**
     * Menu items
     * Maps Figma "Items" property (nested instances)
     */
    items: figma.children('Items'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   */
  example: ({ placement, autoClose, disabled, variant, size, showCaret, label, items }) => (
    <Dropdown placement={placement} autoClose={autoClose} disabled={disabled}>
      <Dropdown.Toggle variant={variant} size={size} caret={showCaret}>
        {label}
      </Dropdown.Toggle>
      <Dropdown.Menu>{items}</Dropdown.Menu>
    </Dropdown>
  ),
});

/**
 * Dropdown.Toggle - Split Button Mapping
 *
 * For split button dropdowns where the caret is a separate button.
 */
figma.connect(Dropdown, '<FIGMA_DSAI_DROPDOWN_SPLIT>', {
  props: {
    /**
     * Toggle button variant
     */
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
    }),

    /**
     * Toggle button size
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Primary button label
     */
    label: figma.string('Label'),

    /**
     * Accessible label for split toggle (required)
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Menu items
     */
    items: figma.children('Items'),
  },

  example: ({ variant, size, label, ariaLabel, items }) => {
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : 'Toggle dropdown';

    return (
      <Dropdown>
        <Dropdown.Toggle variant={variant} size={size}>
          {label}
        </Dropdown.Toggle>
        <Dropdown.Toggle split variant={variant} size={size} aria-label={normalizedAriaLabel} />
        <Dropdown.Menu>{items}</Dropdown.Menu>
      </Dropdown>
    );
  },
});

/**
 * Dropdown.Item - Standard Menu Item Mapping
 */
figma.connect(Dropdown.Item, '<FIGMA_DSAI_DROPDOWN_ITEM>', {
  props: {
    /**
     * Item label
     */
    label: figma.string('Label'),

    /**
     * Item href for link items
     */
    href: figma.string('Href'),

    /**
     * Whether item is active/selected
     */
    active: figma.boolean('Active'),

    /**
     * Whether item is disabled
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Start icon
     */
    startIcon: figma.instance('Start Icon'),

    /**
     * End icon
     */
    endIcon: figma.instance('End Icon'),
  },

  example: ({ label, href, active, disabled, startIcon, endIcon }) => (
    <Dropdown.Item
      href={href}
      active={active}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {label}
    </Dropdown.Item>
  ),
});

/**
 * Dropdown.Divider - Menu Divider Mapping
 */
figma.connect(Dropdown.Divider, '<FIGMA_DSAI_DROPDOWN_DIVIDER>', {
  example: () => <Dropdown.Divider />,
});

/**
 * Dropdown.Header - Menu Header Mapping
 */
figma.connect(Dropdown.Header, '<FIGMA_DSAI_DROPDOWN_HEADER>', {
  props: {
    /**
     * Header text
     */
    text: figma.string('Text'),
  },

  example: ({ text }) => <Dropdown.Header>{text}</Dropdown.Header>,
});

/**
 * Dropdown.ItemText - Non-interactive Text Mapping
 */
figma.connect(Dropdown.ItemText, '<FIGMA_DSAI_DROPDOWN_ITEM_TEXT>', {
  props: {
    /**
     * Text content
     */
    text: figma.string('Text'),
  },

  example: ({ text }) => <Dropdown.ItemText>{text}</Dropdown.ItemText>,
});
