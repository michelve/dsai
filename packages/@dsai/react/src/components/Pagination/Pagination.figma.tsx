/**
 * Figma Code Connect - Pagination Component
 *
 * Maps the DSAi Pagination Figma component to the React implementation.
 * Uses URL substitution for maintainability across environments.
 *
 * @see https://www.figma.com/developers/api/code-connect
 * @module Pagination/FigmaCodeConnect
 */

import figma from '@figma/code-connect';

import { Pagination } from './Pagination';

/**
 * DSAi Pagination - Code Connect Mapping
 *
 * Uses `<FIGMA_DSAI_PAGINATION>` substitution variable defined in figma.config.json.
 * This allows changing the Figma URL in one place instead of updating every mapping file.
 *
 * Accessibility goals:
 * - Always include an aria-label for the navigation region.
 * - Active page announces "page X" via aria-current="page".
 * - Disabled buttons are properly marked and non-interactive.
 */
figma.connect(Pagination, '<FIGMA_DSAI_PAGINATION>', {
  props: {
    /**
     * Total number of pages
     * Maps Figma "Total Pages" property to React totalPages prop
     */
    totalPages: figma.number('Total Pages'),

    /**
     * Current active page (1-indexed)
     * Maps Figma "Current Page" property to React page prop
     */
    page: figma.number('Current Page'),

    /**
     * Pagination size variant
     * Maps Figma "Size" property to React size prop
     */
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),

    /**
     * Horizontal alignment
     * Maps Figma "Alignment" property to React alignment prop
     */
    alignment: figma.enum('Alignment', {
      Start: 'start',
      Center: 'center',
      End: 'end',
    }),

    /**
     * Show "First" button
     * Maps Figma "Show First" boolean property
     */
    showFirst: figma.boolean('Show First'),

    /**
     * Show "Last" button
     * Maps Figma "Show Last" boolean property
     */
    showLast: figma.boolean('Show Last'),

    /**
     * Show "Previous" button
     * Maps Figma "Show Previous" boolean property
     */
    showPrevious: figma.boolean('Show Previous'),

    /**
     * Show "Next" button
     * Maps Figma "Show Next" boolean property
     */
    showNext: figma.boolean('Show Next'),

    /**
     * Number of pages at boundaries
     * Maps Figma "Boundary Count" property to React boundaryCount prop
     */
    boundaryCount: figma.number('Boundary Count'),

    /**
     * Number of pages around current page
     * Maps Figma "Sibling Count" property to React siblingCount prop
     */
    siblingCount: figma.number('Sibling Count'),

    /**
     * Disabled state
     * Maps Figma "Disabled" boolean property
     */
    disabled: figma.boolean('Disabled'),

    /**
     * Accessible label for the navigation
     * Maps Figma "Aria Label" property
     *
     * Use this to provide context for screen reader users,
     * e.g., "Product list pagination" or "Search results navigation"
     */
    ariaLabel: figma.string('Aria Label'),

    /**
     * Custom "First" button content
     * Maps Figma "First Label" property
     */
    firstContent: figma.string('First Label'),

    /**
     * Custom "Last" button content
     * Maps Figma "Last Label" property
     */
    lastContent: figma.string('Last Label'),

    /**
     * Custom "Previous" button content
     * Maps Figma "Previous Label" property
     */
    previousContent: figma.string('Previous Label'),

    /**
     * Custom "Next" button content
     * Maps Figma "Next Label" property
     */
    nextContent: figma.string('Next Label'),
  },

  /**
   * Example code template
   * This is what AI agents and Code Connect will generate by default.
   *
   * Notes:
   * - aria-label is always required for accessibility.
   * - Custom navigation content is only passed when non-empty.
   * - Default values are omitted for cleaner generated code.
   */
  example: ({
    totalPages,
    page,
    size,
    alignment,
    showFirst,
    showLast,
    showPrevious,
    showNext,
    boundaryCount,
    siblingCount,
    disabled,
    ariaLabel,
    firstContent,
    lastContent,
    previousContent,
    nextContent,
  }) => {
    // Normalize aria-label - always provide a meaningful label
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : 'Pagination';

    // Normalize custom content - only pass when non-empty
    const normalizedFirstContent =
      firstContent && firstContent.trim().length > 0 ? firstContent.trim() : undefined;

    const normalizedLastContent =
      lastContent && lastContent.trim().length > 0 ? lastContent.trim() : undefined;

    const normalizedPreviousContent =
      previousContent && previousContent.trim().length > 0 ? previousContent.trim() : undefined;

    const normalizedNextContent =
      nextContent && nextContent.trim().length > 0 ? nextContent.trim() : undefined;

    return (
      <Pagination
        totalPages={totalPages}
        page={page}
        size={size}
        alignment={alignment}
        showFirst={showFirst}
        showLast={showLast}
        showPrevious={showPrevious}
        showNext={showNext}
        boundaryCount={boundaryCount}
        siblingCount={siblingCount}
        disabled={disabled}
        aria-label={normalizedAriaLabel}
        firstContent={normalizedFirstContent}
        lastContent={normalizedLastContent}
        previousContent={normalizedPreviousContent}
        nextContent={normalizedNextContent}
        onPageChange={(newPage) => console.log('Page changed to:', newPage)}
      />
    );
  },
});

/**
 * Controlled Pagination - Code Connect Mapping
 *
 * Shows how to use Pagination in controlled mode with React state.
 * This is useful for demonstrating integration with data fetching.
 */
figma.connect(Pagination, '<FIGMA_DSAI_PAGINATION_CONTROLLED>', {
  variant: { Mode: 'Controlled' },

  props: {
    totalPages: figma.number('Total Pages'),
    size: figma.enum('Size', {
      Small: 'sm',
      Medium: 'md',
      Large: 'lg',
    }),
    ariaLabel: figma.string('Aria Label'),
  },

  example: ({ totalPages, size, ariaLabel }) => {
    const normalizedAriaLabel =
      ariaLabel && ariaLabel.trim().length > 0 ? ariaLabel.trim() : 'Pagination';

    // Note: In actual use, currentPage would come from React.useState
    // and handlePageChange would update state and potentially fetch data
    const currentPage = 1;
    const handlePageChange = (page: number) => {
      // Update state and fetch data for new page
      console.log('Navigating to page:', page);
    };

    return (
      <Pagination
        totalPages={totalPages}
        page={currentPage}
        size={size}
        aria-label={normalizedAriaLabel}
        onPageChange={handlePageChange}
      />
    );
  },
});

/**
 * TODO: Compact Pagination mapping
 *
 * When a compact variant is designed in Figma (e.g., "Page X of Y" with prev/next only),
 * add a third figma.connect() for that variant.
 *
 * That mapping should:
 * - Hide page number buttons.
 * - Show only prev/next navigation.
 * - Display current page indicator text.
 */
