/**
 * Figma Code Connect - Breadcrumb Component
 *
 * Maps the DSAi Breadcrumb Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Breadcrumb/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

import type { BreadcrumbItemProps } from './Breadcrumb.types';

/**
 * DSAi Breadcrumb - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_BREADCRUMB>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * The component handles accessibility internally:
 * - nav element with aria-label (customizable via ariaLabel prop)
 * - aria-current="page" on active item
 * - Semantic ol/li list structure
 * - Ellipsis button with aria-expanded state
 *
 * FSM State Machine:
 * - States: collapsed | expanded
 * - data-visual-state attribute for testing/styling
 * - Controlled via expanded prop, fires onExpand callback
 */
figma.connect(Breadcrumb, '<FIGMA_DSAI_BREADCRUMB>', {
  props: {
    /** Custom separator character */
    separator: figma.enum('Separator', {
      Slash: '/',
      Chevron: '›',
      Arrow: '>',
      Bullet: '•',
      Pipe: '|',
    }),

    /** Maximum items before collapse (0 = no collapse) */
    maxItemsChoice: figma.enum('Max Items', {
      None: 0,
      '3': 3,
      '4': 4,
      '5': 5,
    }),

    /** Items before ellipsis when collapsed */
    itemsBeforeCollapse: figma.enum('Items Before', {
      '1': 1,
      '2': 2,
    }),

    /** Items after ellipsis when collapsed */
    itemsAfterCollapse: figma.enum('Items After', {
      '1': 1,
      '2': 2,
    }),

    /** Controlled expanded state */
    expanded: figma.boolean('Expanded'),

    /** Custom aria-label for the nav element */
    ariaLabel: figma.string('Aria Label'),
  },

  example: ({
    separator,
    maxItemsChoice,
    itemsBeforeCollapse,
    itemsAfterCollapse,
    expanded,
    ariaLabel,
  }) => {
    // Convert 0 to undefined for "no collapse" behavior
    const maxItems = maxItemsChoice || undefined;
    // Normalize empty strings to undefined
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : undefined;

    return (
      <Breadcrumb
        items={[
          { id: 'home', label: 'Home', href: '/' },
          { id: 'category', label: 'Category', href: '/category' },
          { id: 'subcategory', label: 'Subcategory', href: '/subcategory' },
          { id: 'current', label: 'Current Page', active: true },
        ]}
        separator={separator}
        maxItems={maxItems}
        itemsBeforeCollapse={itemsBeforeCollapse}
        itemsAfterCollapse={itemsAfterCollapse}
        expanded={expanded}
        aria-label={normalizedAriaLabel}
      />
    );
  },
});

/**
 * DSAi BreadcrumbItem - Code Connect Mapping
 *
 * For compound component usage pattern.
 * Maps individual breadcrumb item from Figma.
 * Icons are mapped via figma.instance to preserve the actual icon chosen in Figma.
 */
figma.connect(BreadcrumbItem, '<FIGMA_DSAI_BREADCRUMB_ITEM>', {
  props: {
    /** Item label/content */
    children: figma.string('Label'),

    /** Link URL */
    href: figma.string('Href'),

    /** Current/active page indicator */
    active: figma.boolean('Active'),

    /** Icon instance from Figma - maps to actual icon component */
    icon: figma.instance('Icon'),
  },

  example: ({ children, href, active, icon }) => {
    // Normalize empty href to undefined (component treats '' as no link)
    const normalizedHref = href && href.trim().length > 0 ? href.trim() : undefined;

    return active ? (
      <BreadcrumbItem active icon={icon as BreadcrumbItemProps['icon']}>
        {children}
      </BreadcrumbItem>
    ) : (
      <BreadcrumbItem href={normalizedHref} icon={icon as BreadcrumbItemProps['icon']}>
        {children}
      </BreadcrumbItem>
    );
  },
});

/**
 * Breadcrumb Usage Patterns
 *
 * 1. Items Array (recommended):
 *    import { HouseIcon, FolderIcon } from '@dsai-io/react';
 *
 *    <Breadcrumb
 *      items={[
 *        { id: 'home', label: 'Home', href: '/', icon: <HouseIcon /> },
 *        { id: 'category', label: 'Category', href: '/category', icon: <FolderIcon /> },
 *        { id: 'current', label: 'Current', active: true },
 *      ]}
 *    />
 *
 * 2. Compound Components:
 *    <Breadcrumb>
 *      <BreadcrumbItem href="/" icon={<HouseIcon />}>Home</BreadcrumbItem>
 *      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 *      <BreadcrumbItem active>Current</BreadcrumbItem>
 *    </Breadcrumb>
 *
 * 3. Collapsible (long paths):
 *    <Breadcrumb
 *      items={longPathItems}
 *      maxItems={4}
 *      itemsBeforeCollapse={1}
 *      itemsAfterCollapse={2}
 *    />
 *
 * 4. Controlled Expand (FSM):
 *    // FSM states: collapsed | expanded
 *    // data-visual-state attribute reflects current state
 *    <Breadcrumb
 *      items={items}
 *      maxItems={4}
 *      expanded={isExpanded}
 *      onExpand={() => setIsExpanded(true)}
 *    />
 *
 * 5. Custom Accessibility Label:
 *    <Breadcrumb
 *      items={items}
 *      aria-label="Product navigation"
 *    />
 *
 * 6. Router Integration:
 *    import { Link } from 'react-router-dom';
 *    <Breadcrumb
 *      linkAs={Link}
 *      items={[
 *        { id: 'home', label: 'Home', href: '/' },
 *        { id: 'current', label: 'Page', active: true },
 *      ]}
 *    />
 */
