/**
 * Scrollspy Component Types
 *
 * TypeScript interfaces for the Scrollspy navigation component.
 * Uses IntersectionObserver for efficient scroll position tracking.
 *
 * @module Scrollspy
 */

import type { ReactNode } from 'react';
import type { SafeHTMLAttributes } from '../../types';

// =============================================================================
// Safe HTML Attributes
// =============================================================================

/**
 * Safe HTML attributes allowed on Scrollspy components.
 * Security: Explicit whitelist prevents dangerous prop injection.
 * @see {@link SafeHTMLAttributes}
 */
export type SafeScrollspyHTMLAttributes = SafeHTMLAttributes<HTMLElement>;

// =============================================================================
// Scrollspy Item Types
// =============================================================================

/**
 * Individual scrollspy navigation item
 */
export interface ScrollspyItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Display label for the navigation link
   */
  label: string;

  /**
   * Target section ID (without the #)
   * Links to an element with this ID in the document
   */
  target: string;

  /**
   * Nested items for hierarchical navigation
   */
  children?: ScrollspyItem[];
}

// =============================================================================
// FSM Types
// =============================================================================

/**
 * Scrollspy FSM state
 */
export interface ScrollspyFSMState {
  /**
   * ID of the currently active section
   */
  readonly activeId: string | null;

  /**
   * IDs of all visible sections (for nested support)
   */
  readonly visibleIds: readonly string[];

  /**
   * Whether scrollspy is currently observing
   */
  readonly isObserving: boolean;
}

/**
 * Scrollspy FSM events
 */
export type ScrollspyFSMEvent =
  | { readonly type: 'SECTION_ENTER'; readonly sectionId: string }
  | { readonly type: 'SECTION_LEAVE'; readonly sectionId: string }
  | { readonly type: 'SET_ACTIVE'; readonly sectionId: string | null }
  | { readonly type: 'START_OBSERVING' }
  | { readonly type: 'STOP_OBSERVING' }
  | { readonly type: 'RESET' };

/**
 * Visual state for data-visual-state attribute
 */
export type ScrollspyVisualState = 'idle' | 'tracking' | 'scrolling';

// =============================================================================
// Component Props
// =============================================================================

/**
 * Scrollspy variant styles
 */
export type ScrollspyVariant = 'pills' | 'underline' | 'minimal';

/**
 * Scrollspy orientation
 */
export type ScrollspyOrientation = 'vertical' | 'horizontal';

/**
 * Scrollspy position (for sticky positioning context)
 */
export type ScrollspyPosition = 'start' | 'end';

/**
 * Scrollspy component props
 */
export interface ScrollspyProps extends SafeScrollspyHTMLAttributes {
  /**
   * Navigation items with target section IDs
   */
  items: ScrollspyItem[];

  /**
   * Visual variant of the navigation
   * @default 'pills'
   */
  variant?: ScrollspyVariant;

  /**
   * Orientation of the navigation
   * @default 'vertical'
   */
  orientation?: ScrollspyOrientation;

  /**
   * Offset from top of viewport for activation (pixels)
   * Useful for sticky headers
   * @default 0
   */
  offset?: number;

  /**
   * Root margin for IntersectionObserver
   * Can be used to adjust when sections become "active"
   * @default "0px 0px -50% 0px"
   */
  rootMargin?: string;

  /**
   * Threshold for IntersectionObserver (0-1)
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Enable smooth scrolling when clicking links
   * @default true
   */
  smoothScroll?: boolean;

  /**
   * Make the nav sticky
   * @default false
   */
  sticky?: boolean;

  /**
   * Top offset when sticky (in pixels or CSS value)
   * @default 0
   */
  stickyTop?: number | string;

  /**
   * Callback when active section changes
   */
  onActiveChange?: (activeId: string | null) => void;

  /**
   * Accessible label for the navigation
   */
  'aria-label'?: string;

  /**
   * ID of element that labels this navigation
   */
  'aria-labelledby'?: string;

  /**
   * Controlled active section ID
   * When provided, component becomes controlled
   */
  activeId?: string | null;

  /**
   * Default active section ID (uncontrolled)
   */
  defaultActiveId?: string | null;

  /**
   * Children (alternative to items prop for custom rendering)
   */
  children?: ReactNode;
}

/**
 * Scrollspy Link props
 */
export interface ScrollspyLinkProps extends SafeScrollspyHTMLAttributes {
  /**
   * Target section ID (without the #)
   */
  target: string;

  /**
   * Link content
   */
  children: ReactNode;

  /**
   * Whether this link is currently active
   */
  active?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Scrollspy context value
 */
export interface ScrollspyContextValue {
  /**
   * Currently active section ID
   */
  activeId: string | null;

  /**
   * All visible section IDs
   */
  visibleIds: readonly string[];

  /**
   * Set active section (for controlled behavior)
   */
  setActive: (id: string | null) => void;

  /**
   * Smooth scroll to a section
   */
  scrollToSection: (id: string) => void;

  /**
   * Whether smooth scrolling is enabled
   */
  smoothScroll: boolean;
}

/**
 * Scrollspy Provider props
 */
export interface ScrollspyProviderProps {
  /**
   * Navigation items
   */
  items: ScrollspyItem[];

  /**
   * Controlled active section ID
   */
  activeId?: string | null;

  /**
   * Default active section ID
   */
  defaultActiveId?: string | null;

  /**
   * Callback when active changes
   */
  onActiveChange?: (activeId: string | null) => void;

  /**
   * Enable smooth scrolling
   * @default true
   */
  smoothScroll?: boolean;

  /**
   * Offset for scroll position
   * @default 0
   */
  offset?: number;

  /**
   * Children
   */
  children: ReactNode;
}
