/**
 * Figma Code Connect - Popover Component
 *
 * Maps the DSAi Popover Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Popover/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Button } from '../Button';

import { Popover } from './Popover';

/**
 * DSAi Popover - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_POPOVER>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Popover uses role="dialog" for rich interactive content.
 * - Trigger element gets aria-haspopup="dialog" and aria-expanded.
 * - Focus management supports optional focus trapping.
 * - Header provides accessible labelling.
 */
figma.connect(Popover, '<FIGMA_DSAI_POPOVER>', {
  props: {
    /**
     * Popover header
     * Maps Figma "Header" property to React header prop
     */
    header: figma.string('Header'),

    /**
     * Popover body content
     * Maps Figma "Content" text layer to content prop
     */
    content: figma.string('Content'),

    /**
     * Placement position
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
     * Trigger type
     * Maps Figma "Trigger" property to React trigger prop
     */
    trigger: figma.enum('Trigger', {
      Click: 'click',
      Hover: 'hover',
      Focus: 'focus',
    }),

    /**
     * Show arrow pointer
     * Maps Figma "Arrow" boolean property
     */
    arrow: figma.boolean('Arrow'),

    /**
     * Show close button in header
     * Maps Figma "Close Button" boolean property
     */
    showCloseButton: figma.boolean('Close Button'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Trap focus within popover
     * Maps Figma "Focus Trap" boolean property
     * Use for modal-like behavior or interactive form content.
     */
    trapFocus: figma.boolean('Focus Trap'),

    /**
     * Open state
     * Maps Figma "Open" boolean property
     * Shows popover in open state for design previews.
     */
    isOpen: figma.boolean('Open'),

    /**
     * Accessible label
     * Maps Figma "Aria Label" property.
     * Use when no visible header is present.
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Trigger button label
     * Maps Figma "Trigger Label" text layer
     */
    triggerLabel: figma.string('Trigger Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - aria-label is only passed when no header is present and ariaLabel is set.
   * - Header is only rendered when non-empty.
   * - Delays are only relevant for hover/focus triggers.
   */
  example: ({
    header,
    content,
    placement,
    trigger,
    arrow,
    showCloseButton,
    disabled,
    trapFocus,
    isOpen,
    ariaLabel,
    triggerLabel,
  }) => {
    // Only use aria-label when no visible header exists
    const normalizedAriaLabel =
      !header && ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    // Only include header if non-empty
    const normalizedHeader = header && header.trim().length > 0 ? header.trim() : undefined;

    // Normalize content
    const normalizedContent =
      content && content.trim().length > 0 ? content.trim() : 'Popover content';

    return (
      <Popover
        header={normalizedHeader}
        content={normalizedContent}
        placement={placement}
        trigger={trigger}
        arrow={arrow}
        showCloseButton={showCloseButton}
        disabled={disabled}
        trapFocus={trapFocus}
        isOpen={isOpen}
        aria-label={normalizedAriaLabel}
      >
        <Button variant="primary">{triggerLabel || 'Toggle Popover'}</Button>
      </Popover>
    );
  },
});

/**
 * Popover with rich content variant
 *
 * For popovers with interactive form elements,
 * trapFocus should be enabled and a close button provided.
 */
figma.connect(Popover, '<FIGMA_DSAI_POPOVER_INTERACTIVE>', {
  variant: { 'Content Type': 'Interactive' },
  props: {
    header: figma.string('Header'),
    placement: figma.enum('Placement', {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    }),
    triggerLabel: figma.string('Trigger Label'),
  },
  example: ({ header, placement, triggerLabel }) => (
    <Popover
      header={header || 'Interactive Popover'}
      content={
        <div>
          <input type="text" placeholder="Enter value" />
          <Button variant="primary" size="sm">
            Submit
          </Button>
        </div>
      }
      placement={placement}
      trapFocus
      showCloseButton
    >
      <Button variant="primary">{triggerLabel || 'Open Form'}</Button>
    </Popover>
  ),
});
