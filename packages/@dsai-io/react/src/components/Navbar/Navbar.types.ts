/**
 * Navbar Types
 *
 * TypeScript interfaces for the Navbar component and its subcomponents.
 * Follows Bootstrap 5 navbar structure with FSM-driven collapse state.
 *
 * @module Navbar
 */

import type { SafeHTMLAttributes } from '../../types';
import type { ReactNode } from 'react';

// =============================================================================
// Common Safe Attribute Interface
// =============================================================================

/**
 * Safe HTML attributes allowed on Navbar components.
 * Security: Explicit whitelist prevents dangerous prop injection.
 * @see {@link SafeHTMLAttributes}
 */
export type SafeNavbarHTMLAttributes = SafeHTMLAttributes;

// =============================================================================
// Navbar Expand Breakpoints
// =============================================================================

/**
 * Breakpoints at which the navbar expands from collapsed to horizontal.
 * - 'sm': ≥576px
 * - 'md': ≥768px
 * - 'lg': ≥992px (default)
 * - 'xl': ≥1200px
 * - 'xxl': ≥1400px
 * - false: Always collapsed (never expands)
 * - true: Never collapses (always expanded)
 */
export type NavbarExpandBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | boolean;

/**
 * Navbar color scheme variants
 */
export type NavbarVariant = 'light' | 'dark';

/**
 * Navbar positioning options
 */
export type NavbarPlacement =
  | 'static'
  | 'fixed-top'
  | 'fixed-bottom'
  | 'sticky-top'
  | 'sticky-bottom';

/**
 * Navbar orientation for ARIA
 * - 'horizontal': Standard navbar layout (default)
 * - 'vertical': Sidebar-style navigation
 */
export type NavbarOrientation = 'horizontal' | 'vertical';

/**
 * Container breakpoint options
 */
export type NavbarContainerBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Link target attribute values
 */
export type NavbarLinkTarget = '_self' | '_blank' | '_parent' | '_top';

/**
 * Navbar background colors (Bootstrap background utilities)
 */
export type NavbarBackground =
  | 'body-tertiary'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'white'
  | 'transparent';

// =============================================================================
// Context Types
// =============================================================================

/**
 * Context value shared between Navbar components
 */
export interface NavbarContextValue {
  /** Whether the collapse menu is currently expanded */
  isExpanded: boolean;
  /** Toggle the collapse menu */
  toggle: () => void;
  /** Open the collapse menu */
  open: () => void;
  /** Close the collapse menu */
  close: () => void;
  /** Handle Escape key - closes menu and returns focus to toggle */
  handleEscapeKey: (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => void;
  /** Current variant for theming */
  variant: NavbarVariant;
  /** Expand breakpoint */
  expand: NavbarExpandBreakpoint;
  /** Generated ID for the collapse element */
  collapseId: string;
  /** Register a toggle button ref for keyboard navigation */
  registerToggleRef: (ref: HTMLButtonElement | null) => void;
  /** Orientation for keyboard navigation */
  orientation: NavbarOrientation;
  /** Whether the navbar is currently animating (expanding or collapsing) */
  isAnimating: boolean;
}

// =============================================================================
// Component Props
// =============================================================================

/**
 * Props for the main Navbar component
 */
export interface NavbarProps extends SafeNavbarHTMLAttributes {
  /** Navbar content (Brand, Toggle, Collapse, etc.) */
  children: ReactNode;

  /**
   * Breakpoint at which navbar expands to horizontal layout.
   * @default 'lg'
   */
  expand?: NavbarExpandBreakpoint;

  /**
   * Color scheme variant
   * @default 'light'
   */
  variant?: NavbarVariant;

  /**
   * Background color
   * @default 'body-tertiary'
   */
  bg?: NavbarBackground;

  /**
   * Navbar positioning
   * @default 'static'
   */
  placement?: NavbarPlacement;

  /**
   * Use container-fluid (full-width) instead of container
   * @default true
   */
  fluid?: boolean;

  /**
   * Container breakpoint (when fluid is false)
   * @default undefined (uses default .container)
   */
  container?: NavbarContainerBreakpoint;

  /**
   * Controlled expanded state
   */
  expanded?: boolean;

  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Default expanded state (uncontrolled)
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Accessible label for the navigation
   * @default 'Main navigation'
   */
  'aria-label'?: string;

  /**
   * Override the default role of the navigation element.
   * Use 'none' to remove the role entirely.
   * @default undefined (uses implicit 'navigation' role from <nav>)
   */
  role?: 'navigation' | 'menubar' | 'none';

  /**
   * ARIA orientation for the navigation.
   * Useful for vertical sidebars or advanced nav structures.
   * @default 'horizontal'
   */
  orientation?: NavbarOrientation;
}

/**
 * Props for Navbar.Brand component
 */
export interface NavbarBrandProps extends SafeNavbarHTMLAttributes {
  /** Brand content (text, logo, or both) */
  children: ReactNode;

  /**
   * URL to navigate to when clicked (renders as anchor)
   * If not provided, renders as span
   */
  href?: string;

  /**
   * Link target attribute
   */
  target?: NavbarLinkTarget;

  /**
   * Link rel attribute (defaults to 'noopener noreferrer' for _blank)
   */
  rel?: string;

  /**
   * Click handler (for non-link brands or custom navigation)
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => void;
}

/**
 * Props for Navbar.Toggle component (hamburger button)
 */
export interface NavbarToggleProps extends SafeNavbarHTMLAttributes {
  /**
   * Custom content for toggle button (replaces icon)
   */
  children?: ReactNode;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Accessible label for the toggle button
   * @default 'Toggle navigation'
   */
  'aria-label'?: string;
}

/**
 * Props for Navbar.Collapse component (collapsible container)
 */
export interface NavbarCollapseProps extends SafeNavbarHTMLAttributes {
  /** Content to collapse (Nav, forms, etc.) */
  children: ReactNode;
}

/**
 * Props for Navbar.Nav component (navigation links container)
 */
export interface NavbarNavProps extends SafeNavbarHTMLAttributes {
  /** Navigation items */
  children: ReactNode;

  /**
   * Use scroll container with max height (for long menus)
   */
  scroll?: boolean;

  /**
   * Max height for scroll container
   * @default '100px'
   */
  scrollHeight?: string;
}

/**
 * Props for Navbar.Link component (individual nav link)
 */
export interface NavbarLinkProps extends SafeNavbarHTMLAttributes {
  /** Link content */
  children: ReactNode;

  /**
   * URL to navigate to
   */
  href?: string;

  /**
   * Whether this link represents the current page
   * @default false
   */
  active?: boolean;

  /**
   * Whether the link is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Link target attribute
   */
  target?: NavbarLinkTarget;

  /**
   * Link rel attribute
   */
  rel?: string;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Custom component to render as (for router integration)
   * Must accept href, className, and children props
   */
  as?: React.ElementType;
}

/**
 * Props for Navbar.Text component (inline text)
 */
export interface NavbarTextProps extends SafeNavbarHTMLAttributes {
  /** Text content */
  children: ReactNode;
}

/**
 * Props for Navbar.Item component (nav item wrapper for dropdowns)
 */
export interface NavbarItemProps extends SafeNavbarHTMLAttributes {
  /** Item content (link or dropdown) */
  children: ReactNode;

  /**
   * Whether this is a dropdown item
   * Adds 'dropdown' class for Bootstrap styling
   */
  dropdown?: boolean;
}

// =============================================================================
// FSM Types
// =============================================================================

/**
 * FSM states for navbar collapse visibility
 */
export type NavbarVisibility = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';

/**
 * FSM state for navbar collapse
 */
export interface NavbarFSMState {
  /** Current visibility state */
  visibility: NavbarVisibility;
  /** Whether the menu should be rendered in DOM */
  shouldRender: boolean;
}

/**
 * FSM events for navbar collapse transitions
 */
export type NavbarFSMEvent =
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'ANIMATION_END' }
  | { type: 'RESET_FROM_PROPS'; expanded: boolean };

/**
 * Visual state for data-visual-state attribute
 */
export type NavbarVisualState = 'collapsed' | 'expanding' | 'expanded' | 'collapsing';
