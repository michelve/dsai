/**
 * Figma Code Connect - Accordion Component
 *
 * Maps the DSAi Accordion Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Accordion/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Accordion } from './Accordion';

/**
 * DSAi Accordion - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_ACCORDION>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Button uses a real button element with aria-expanded
 * - Panel uses role="region" with aria-labelledby
 * - Keyboard navigation with Tab, Enter, Space
 * - Visual states exposed via data-visual-state
 */
figma.connect(Accordion, '<FIGMA_DSAI_ACCORDION>', {
  props: {
    /**
     * Selection mode
     * Maps Figma "Selection Mode" property to React selectionMode prop
     * - Single: Only one panel can be expanded at a time (default Bootstrap behavior)
     * - Multiple: Multiple panels can be expanded simultaneously ("Always open")
     */
    selectionMode: figma.enum('Selection Mode', {
      Single: 'single',
      Multiple: 'multiple',
    }),

    /**
     * Flush variant
     * Maps Figma "Flush" boolean property
     * Removes borders and rounded corners for edge-to-edge layout
     */
    flush: figma.boolean('Flush'),

    /**
     * Accordion items
     * Maps Figma nested AccordionItem instances
     */
    items: figma.children('Items'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   */
  example: ({ selectionMode, flush, items }) => (
    <Accordion selectionMode={selectionMode} flush={flush}>
      {items}
    </Accordion>
  ),
});

/**
 * Accordion with default expanded - Code Connect Mapping
 *
 * For accordions that should have items expanded by default.
 */
figma.connect(Accordion, '<FIGMA_DSAI_ACCORDION_EXPANDED>', {
  props: {
    /**
     * Selection mode
     */
    selectionMode: figma.enum('Selection Mode', {
      Single: 'single',
      Multiple: 'multiple',
    }),

    /**
     * Flush variant
     */
    flush: figma.boolean('Flush'),

    /**
     * Default expanded keys (comma-separated in Figma)
     */
    defaultExpanded: figma.string('Default Expanded'),

    /**
     * Accordion items
     */
    items: figma.children('Items'),
  },

  example: ({ selectionMode, flush, defaultExpanded, items }) => {
    // Parse comma-separated keys
    const defaultActiveKeys = defaultExpanded
      ? defaultExpanded.split(',').map((k: string) => k.trim())
      : [];

    return (
      <Accordion selectionMode={selectionMode} flush={flush} defaultActiveKeys={defaultActiveKeys}>
        {items}
      </Accordion>
    );
  },
});

/**
 * Accordion.Item - Individual Accordion Item Mapping
 */
figma.connect(Accordion.Item, '<FIGMA_DSAI_ACCORDION_ITEM>', {
  props: {
    /**
     * Unique identifier for this item
     */
    eventKey: figma.string('Event Key'),

    /**
     * Whether this item is disabled
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Button content (header)
     */
    header: figma.string('Header'),

    /**
     * Panel content (body)
     */
    content: figma.children('Content'),
  },

  example: ({ eventKey, disabled, header, content }) => (
    <Accordion.Item eventKey={eventKey} disabled={disabled}>
      <Accordion.Button>{header}</Accordion.Button>
      <Accordion.Panel>{content}</Accordion.Panel>
    </Accordion.Item>
  ),
});

/**
 * Accordion.Button - Accordion Header Button Mapping
 *
 * The clickable trigger that expands/collapses the panel.
 */
figma.connect(Accordion.Button, '<FIGMA_DSAI_ACCORDION_BUTTON>', {
  props: {
    /**
     * Button content (typically text)
     */
    label: figma.string('Label'),

    /**
     * Optional start icon
     */
    startIcon: figma.instance('Start Icon'),
  },

  example: ({ label, startIcon }) => (
    <Accordion.Button>
      {startIcon}
      {label}
    </Accordion.Button>
  ),
});

/**
 * Accordion.Panel - Accordion Content Panel Mapping
 *
 * The collapsible content area of an accordion item.
 */
figma.connect(Accordion.Panel, '<FIGMA_DSAI_ACCORDION_PANEL>', {
  props: {
    /**
     * Panel content
     */
    content: figma.children('Content'),
  },

  example: ({ content }) => <Accordion.Panel>{content}</Accordion.Panel>,
});

/**
 * Accordion - Controlled Mode Template
 *
 * For designers who want to document controlled accordion usage.
 */
figma.connect(Accordion, '<FIGMA_DSAI_ACCORDION_CONTROLLED>', {
  props: {
    /**
     * Selection mode
     */
    selectionMode: figma.enum('Selection Mode', {
      Single: 'single',
      Multiple: 'multiple',
    }),

    /**
     * Flush variant
     */
    flush: figma.boolean('Flush'),

    /**
     * Accordion items
     */
    items: figma.children('Items'),
  },

  example: ({ selectionMode, flush, items }) => {
    // Note: This is a template showing controlled usage
    // In real code, activeKeys and onActiveKeysChange would come from useState
    return (
      <Accordion
        selectionMode={selectionMode}
        flush={flush}
        activeKeys={['0']}
        onActiveKeysChange={(keys) => console.warn('Active keys:', keys)}
      >
        {items}
      </Accordion>
    );
  },
});
