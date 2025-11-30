/**
 * Figma Code Connect - ListGroup Component
 *
 * Maps the DSAi ListGroup Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module ListGroup/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { ListGroup, ListGroupItem } from './ListGroup';

/**
 * DSAi ListGroup - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_LISTGROUP>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Security Features:
 * - Safe href validation (blocks javascript:, data:, vbscript:)
 * - External links get rel="noopener noreferrer"
 *
 * Accessibility goals:
 * - Proper list semantics (ul/ol with li)
 * - Interactive items wrapped appropriately (a/button inside li)
 * - aria-current for active items
 */
figma.connect(ListGroup, '<FIGMA_DSAI_LISTGROUP>', {
  props: {
    /**
     * List variant
     * Maps Figma "Variant" property to React variant prop
     */
    variant: figma.enum('Variant', {
      Default: 'default',
      Flush: 'flush',
      Numbered: 'numbered',
    }),

    /**
     * Horizontal layout
     * Maps Figma "Horizontal" property to React horizontal prop
     */
    horizontal: figma.enum('Horizontal', {
      None: false,
      Always: true,
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
    }),

    /**
     * Ordered list (ol vs ul)
     * Maps Figma "Ordered" boolean property
     */
    ordered: figma.boolean('Ordered'),

    /**
     * Number of items to show in example
     * Maps Figma "Item Count" property
     */
    itemCount: figma.enum('Item Count', {
      '3': 3,
      '4': 4,
      '5': 5,
    }),

    /**
     * Items are interactive (links or buttons)
     * Maps Figma "Interactive" boolean property
     */
    interactive: figma.boolean('Interactive'),

    /**
     * Show badges on items
     * Maps Figma "Show Badges" boolean property
     */
    showBadges: figma.boolean('Show Badges'),

    /**
     * Show icons on items
     * Maps Figma "Show Icons" boolean property
     */
    showIcons: figma.boolean('Show Icons'),

    /**
     * Accessible label
     * Maps Figma "Aria Label" text property
     */
    ariaLabel: figma.string('Aria Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   */
  example: ({
    variant,
    horizontal,
    ordered,
    itemCount,
    interactive,
    showBadges,
    showIcons,
    ariaLabel,
  }) => {
    // Normalize aria-label
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    // Generate sample items
    const count = itemCount || 3;
    const items = Array.from({ length: count }, (_, i) => ({
      id: `item-${i + 1}`,
      content: `List item ${i + 1}`,
      active: i === 0,
      disabled: i === count - 1,
      badge: showBadges ? i + 1 : undefined,
      icon: showIcons ? '•' : undefined,
      onClick: interactive ? () => {} : undefined,
    }));

    return (
      <ListGroup
        variant={variant}
        horizontal={horizontal}
        ordered={ordered}
        items={items}
        aria-label={normalizedAriaLabel}
      />
    );
  },
});

/**
 * DSAi ListGroupItem - Code Connect Mapping
 *
 * Individual list item for compound component usage.
 */
figma.connect(ListGroupItem, '<FIGMA_DSAI_LISTGROUP_ITEM>', {
  props: {
    /**
     * Item color variant
     * Maps Figma "Color" property to React variant prop
     */
    variant: figma.enum('Color', {
      None: undefined,
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
     * Active/selected state
     * Maps Figma "Active" boolean property
     */
    active: figma.boolean('Active'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Item content
     * Maps Figma "Content" text property
     */
    content: figma.string('Content'),

    /**
     * Has badge
     * Maps Figma "Has Badge" boolean property
     */
    hasBadge: figma.boolean('Has Badge'),

    /**
     * Badge text
     * Maps Figma "Badge" text property
     */
    badge: figma.string('Badge'),

    /**
     * Has icon
     * Maps Figma "Has Icon" boolean property
     */
    hasIcon: figma.boolean('Has Icon'),

    /**
     * Is link
     * Maps Figma "Is Link" boolean property
     */
    isLink: figma.boolean('Is Link'),

    /**
     * Link href
     * Maps Figma "Href" text property
     */
    href: figma.string('Href'),
  },

  example: ({ variant, active, disabled, content, hasBadge, badge, hasIcon, isLink, href }) => {
    const normalizedContent = content && content.trim().length > 0 ? content.trim() : 'List item';
    const normalizedBadge = hasBadge && badge && badge.trim().length > 0 ? badge.trim() : undefined;
    const normalizedHref = isLink && href && href.trim().length > 0 ? href.trim() : undefined;

    return (
      <ListGroupItem
        variant={variant}
        active={active}
        disabled={disabled}
        badge={normalizedBadge}
        icon={hasIcon ? '•' : undefined}
        href={normalizedHref}
      >
        {normalizedContent}
      </ListGroupItem>
    );
  },
});

/**
 * ListGroup Usage Patterns
 *
 * 1. Basic List:
 *    <ListGroup>
 *      <ListGroupItem>Item 1</ListGroupItem>
 *      <ListGroupItem>Item 2</ListGroupItem>
 *      <ListGroupItem>Item 3</ListGroupItem>
 *    </ListGroup>
 *
 * 2. Using items prop:
 *    <ListGroup
 *      items={[
 *        { content: 'Item 1' },
 *        { content: 'Item 2', active: true },
 *        { content: 'Item 3', disabled: true },
 *      ]}
 *    />
 *
 * 3. Interactive List (links):
 *    <ListGroup>
 *      <ListGroupItem href="/page1">Page 1</ListGroupItem>
 *      <ListGroupItem href="/page2" active>Page 2</ListGroupItem>
 *      <ListGroupItem href="/page3">Page 3</ListGroupItem>
 *    </ListGroup>
 *
 * 4. Interactive List (buttons):
 *    <ListGroup>
 *      <ListGroupItem onClick={() => console.log('1')}>Action 1</ListGroupItem>
 *      <ListGroupItem onClick={() => console.log('2')}>Action 2</ListGroupItem>
 *    </ListGroup>
 *
 * 5. With Badges:
 *    <ListGroup>
 *      <ListGroupItem badge={<Badge>14</Badge>}>Messages</ListGroupItem>
 *      <ListGroupItem badge={<Badge>2</Badge>}>Notifications</ListGroupItem>
 *    </ListGroup>
 *
 * 6. Colored Items:
 *    <ListGroup>
 *      <ListGroupItem variant="success">Success item</ListGroupItem>
 *      <ListGroupItem variant="warning">Warning item</ListGroupItem>
 *      <ListGroupItem variant="danger">Danger item</ListGroupItem>
 *    </ListGroup>
 *
 * 7. Flush Variant (no borders):
 *    <ListGroup variant="flush">
 *      <ListGroupItem>Item 1</ListGroupItem>
 *      <ListGroupItem>Item 2</ListGroupItem>
 *    </ListGroup>
 *
 * 8. Horizontal Layout:
 *    <ListGroup horizontal>
 *      <ListGroupItem>Item 1</ListGroupItem>
 *      <ListGroupItem>Item 2</ListGroupItem>
 *    </ListGroup>
 *
 * Accessibility Notes:
 * - Uses proper ul/ol > li structure
 * - Interactive items (links/buttons) wrapped in li for semantics
 * - Active items get aria-current="true"
 * - Disabled items get aria-disabled="true"
 */
