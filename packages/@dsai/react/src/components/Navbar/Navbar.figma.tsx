/**
 * Figma Code Connect - Navbar Component
 *
 * Maps the DSAi Navbar Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Navbar/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Navbar } from './Navbar';

/**
 * DSAi Navbar - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_NAVBAR>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Uses semantic <nav> element with aria-label
 * - Toggle button has aria-expanded and aria-controls
 * - Active links have aria-current="page"
 * - Keyboard navigation with Tab, Enter, Space
 * - Visual states exposed via data-visual-state
 */
figma.connect(Navbar, '<FIGMA_DSAI_NAVBAR>', {
  props: {
    /**
     * Color scheme variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Light: 'light',
      Dark: 'dark',
    }),

    /**
     * Background color
     * Maps Figma "Background" property to React bg prop
     */
    bg: figma.enum('Background', {
      'Body Tertiary': 'body-tertiary',
      Primary: 'primary',
      Secondary: 'secondary',
      Success: 'success',
      Danger: 'danger',
      Warning: 'warning',
      Info: 'info',
      Light: 'light',
      Dark: 'dark',
      White: 'white',
      Transparent: 'transparent',
    }),

    /**
     * Expand breakpoint
     * Maps Figma "Expand" property to React expand prop
     */
    expand: figma.enum('Expand', {
      'Small (≥576px)': 'sm',
      'Medium (≥768px)': 'md',
      'Large (≥992px)': 'lg',
      'Extra Large (≥1200px)': 'xl',
      'XXL (≥1400px)': 'xxl',
      'Always Expanded': true,
      'Always Collapsed': false,
    }),

    /**
     * Navbar content
     */
    children: figma.children('*'),
  },

  /**
   * Example code template
   */
  example: ({ variant, bg, expand, children }) => (
    <Navbar variant={variant} bg={bg} expand={expand}>
      {children}
    </Navbar>
  ),
});

/**
 * Navbar with placement - Code Connect Mapping
 */
figma.connect(Navbar, '<FIGMA_DSAI_NAVBAR_PLACEMENT>', {
  props: {
    variant: figma.enum('Variant', {
      Light: 'light',
      Dark: 'dark',
    }),

    bg: figma.enum('Background', {
      'Body Tertiary': 'body-tertiary',
      Primary: 'primary',
      Dark: 'dark',
    }),

    placement: figma.enum('Placement', {
      Static: 'static',
      'Fixed Top': 'fixed-top',
      'Fixed Bottom': 'fixed-bottom',
      'Sticky Top': 'sticky-top',
      'Sticky Bottom': 'sticky-bottom',
    }),

    children: figma.children('*'),
  },

  example: ({ variant, bg, placement, children }) => (
    <Navbar variant={variant} bg={bg} placement={placement}>
      {children}
    </Navbar>
  ),
});

/**
 * Navbar.Brand - Brand/Logo Mapping
 */
figma.connect(Navbar.Brand, '<FIGMA_DSAI_NAVBAR_BRAND>', {
  props: {
    /**
     * Brand text or content
     */
    label: figma.string('Label'),

    /**
     * Optional logo/icon
     */
    logo: figma.instance('Logo'),

    /**
     * Link URL
     */
    href: figma.string('Href'),
  },

  example: ({ label, logo, href }) => (
    <Navbar.Brand href={href}>
      {logo}
      {label}
    </Navbar.Brand>
  ),
});

/**
 * Navbar.Toggle - Hamburger Toggle Button Mapping
 */
figma.connect(Navbar.Toggle, '<FIGMA_DSAI_NAVBAR_TOGGLE>', {
  props: {
    /**
     * Custom toggle content (replaces hamburger icon)
     */
    customIcon: figma.instance('Custom Icon'),

    /**
     * Accessible label
     */
    ariaLabel: figma.string('Aria Label'),
  },

  example: ({ customIcon, ariaLabel }) => (
    <Navbar.Toggle aria-label={ariaLabel || 'Toggle navigation'}>{customIcon}</Navbar.Toggle>
  ),
});

/**
 * Navbar.Collapse - Collapsible Content Container Mapping
 */
figma.connect(Navbar.Collapse, '<FIGMA_DSAI_NAVBAR_COLLAPSE>', {
  props: {
    /**
     * Collapse content (Nav, forms, etc.)
     */
    children: figma.children('*'),
  },

  example: ({ children }) => <Navbar.Collapse>{children}</Navbar.Collapse>,
});

/**
 * Navbar.Nav - Navigation Links Container Mapping
 */
figma.connect(Navbar.Nav, '<FIGMA_DSAI_NAVBAR_NAV>', {
  props: {
    /**
     * Enable scrolling for long menus
     */
    scroll: figma.boolean('Scroll'),

    /**
     * Max height for scroll container
     */
    scrollHeight: figma.string('Scroll Height'),

    /**
     * Navigation items
     */
    children: figma.children('*'),
  },

  example: ({ scroll, scrollHeight, children }) => (
    <Navbar.Nav scroll={scroll} scrollHeight={scrollHeight}>
      {children}
    </Navbar.Nav>
  ),
});

/**
 * Navbar.Link - Navigation Link Mapping
 */
figma.connect(Navbar.Link, '<FIGMA_DSAI_NAVBAR_LINK>', {
  props: {
    /**
     * Link text
     */
    label: figma.string('Label'),

    /**
     * Link URL
     */
    href: figma.string('Href'),

    /**
     * Whether this is the current page
     */
    active: figma.boolean('Active'),

    /**
     * Whether the link is disabled
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Link target
     */
    target: figma.enum('Target', {
      Self: '_self',
      Blank: '_blank',
      Parent: '_parent',
      Top: '_top',
    }),
  },

  example: ({ label, href, active, disabled, target }) => (
    <Navbar.Link href={href} active={active} disabled={disabled} target={target}>
      {label}
    </Navbar.Link>
  ),
});

/**
 * Navbar.Item - Nav Item Wrapper Mapping (for dropdowns)
 */
figma.connect(Navbar.Item, '<FIGMA_DSAI_NAVBAR_ITEM>', {
  props: {
    /**
     * Whether this is a dropdown item
     */
    dropdown: figma.boolean('Dropdown'),

    /**
     * Item content
     */
    children: figma.children('*'),
  },

  example: ({ dropdown, children }) => <Navbar.Item dropdown={dropdown}>{children}</Navbar.Item>,
});

/**
 * Navbar.Text - Inline Text Mapping
 */
figma.connect(Navbar.Text, '<FIGMA_DSAI_NAVBAR_TEXT>', {
  props: {
    /**
     * Text content
     */
    text: figma.string('Text'),
  },

  example: ({ text }) => <Navbar.Text>{text}</Navbar.Text>,
});

/**
 * Navbar - Complete Example Template
 *
 * Shows a typical navbar structure with brand, toggle, collapse, and links.
 */
figma.connect(Navbar, '<FIGMA_DSAI_NAVBAR_COMPLETE>', {
  props: {
    variant: figma.enum('Variant', {
      Light: 'light',
      Dark: 'dark',
    }),

    bg: figma.enum('Background', {
      'Body Tertiary': 'body-tertiary',
      Dark: 'dark',
      Primary: 'primary',
    }),

    expand: figma.enum('Expand', {
      'Large (≥992px)': 'lg',
      'Medium (≥768px)': 'md',
    }),

    brandLabel: figma.string('Brand Label'),
    brandHref: figma.string('Brand Href'),
    links: figma.children('Links'),
  },

  example: ({ variant, bg, expand, brandLabel, brandHref, links }) => (
    <Navbar variant={variant} bg={bg} expand={expand}>
      <Navbar.Brand href={brandHref}>{brandLabel}</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Nav>{links}</Navbar.Nav>
      </Navbar.Collapse>
    </Navbar>
  ),
});

/**
 * Navbar - Controlled Mode Template
 *
 * For designers who want to document controlled navbar usage.
 */
figma.connect(Navbar, '<FIGMA_DSAI_NAVBAR_CONTROLLED>', {
  props: {
    variant: figma.enum('Variant', {
      Light: 'light',
      Dark: 'dark',
    }),

    bg: figma.enum('Background', {
      'Body Tertiary': 'body-tertiary',
      Dark: 'dark',
    }),

    children: figma.children('*'),
  },

  example: ({ variant, bg, children }) => {
    // Note: This is a template showing controlled usage
    // In real code, expanded and onExpandedChange would come from useState
    return (
      <Navbar
        variant={variant}
        bg={bg}
        expanded={false}
        onExpandedChange={(expanded) => console.warn('Expanded:', expanded)}
      >
        {children}
      </Navbar>
    );
  },
});
