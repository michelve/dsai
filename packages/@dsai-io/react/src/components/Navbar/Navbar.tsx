/**
 * Navbar Component
 *
 * A fully accessible, responsive navigation bar following Bootstrap 5 patterns
 * with FSM-driven collapse state management.
 *
 * @module Navbar
 * @see https://getbootstrap.com/docs/5.3/components/navbar/
 */

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { useClickOutside } from '../../hooks';
import { cn, mergeRefs } from '../../utils';
import { isEscapeKey } from '../../utils/keyboard';
import { isValidHref } from '../../utils/validation';

import {
  createInitialNavbarFSMState,
  getNavbarVisualState,
  isNavbarAnimating,
  isNavbarExpanded,
  navbarFSMReducer,
} from './Navbar.fsm';

import type {
  NavbarBrandProps,
  NavbarCollapseProps,
  NavbarContextValue,
  NavbarItemProps,
  NavbarLinkProps,
  NavbarNavProps,
  NavbarProps,
  NavbarTextProps,
  NavbarToggleProps,
} from './Navbar.types';

// =============================================================================
// Context
// =============================================================================

const NavbarContext = createContext<NavbarContextValue | null>(null);

/**
 * Hook to access navbar context
 */
function useNavbarContext(): NavbarContextValue {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('Navbar components must be used within a Navbar component');
  }
  return context;
}

// =============================================================================
// Navbar Root Component
// =============================================================================

/**
 * Navbar Component
 *
 * A responsive navigation header that includes support for branding, navigation,
 * and other elements. Collapses into a hamburger menu on smaller screens.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - Uses semantic <nav> element
 * - aria-label for navigation landmark
 * - aria-expanded on toggle button
 * - aria-controls linking toggle to collapse
 * - Keyboard accessible (Tab, Enter, Space)
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Safe href validation
 * - No dangerouslySetInnerHTML
 *
 * @example
 * ```tsx
 * <Navbar>
 *   <Navbar.Brand href="/">MyApp</Navbar.Brand>
 *   <Navbar.Toggle />
 *   <Navbar.Collapse>
 *     <Navbar.Nav>
 *       <Navbar.Link href="/" active>Home</Navbar.Link>
 *       <Navbar.Link href="/about">About</Navbar.Link>
 *     </Navbar.Nav>
 *   </Navbar.Collapse>
 * </Navbar>
 * ```
 */
const NavbarRoot = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      children,
      expand = 'lg',
      variant = 'light',
      bg = 'body-tertiary',
      placement = 'static',
      fluid = true,
      container,
      expanded: controlledExpanded,
      onExpandedChange,
      defaultExpanded = false,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'aria-label': ariaLabel = 'Main navigation',
      role,
      orientation = 'horizontal',
    },
    ref
  ) => {
    // Determine if controlled
    const isControlled = controlledExpanded !== undefined;

    // Generate ID for collapse element
    const generatedId = useId();
    const collapseId = `navbar-collapse-${id ?? generatedId}`;

    // FSM state management
    const [fsmState, dispatch] = useReducer(
      navbarFSMReducer,
      isControlled ? controlledExpanded : defaultExpanded,
      createInitialNavbarFSMState
    );

    // Ref for toggle button (for focus management)
    const toggleRef = useRef<HTMLButtonElement | null>(null);

    // Sync controlled state with FSM
    useEffect(() => {
      if (isControlled) {
        dispatch({ type: 'RESET_FROM_PROPS', expanded: controlledExpanded });
      }
    }, [isControlled, controlledExpanded]);

    // Handle animation end for CSS transitions
    useEffect(() => {
      if (fsmState.visibility === 'expanding' || fsmState.visibility === 'collapsing') {
        // Use requestAnimationFrame for smooth transitions
        const frameId = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_END' });
        });
        return () => cancelAnimationFrame(frameId);
      }
      return undefined;
    }, [fsmState.visibility]);

    // Context actions
    const toggle = useCallback(() => {
      const willBeExpanded = !isNavbarExpanded(fsmState);
      // In controlled mode, only call callback - parent will update prop
      // In uncontrolled mode, dispatch to FSM
      if (!isControlled) {
        dispatch({ type: 'TOGGLE' });
      }
      if (onExpandedChange) {
        onExpandedChange(willBeExpanded);
      }
    }, [fsmState, isControlled, onExpandedChange]);

    const open = useCallback(() => {
      if (!isControlled) {
        dispatch({ type: 'OPEN' });
      }
      if (onExpandedChange) {
        onExpandedChange(true);
      }
    }, [isControlled, onExpandedChange]);

    const close = useCallback(() => {
      if (!isControlled) {
        dispatch({ type: 'CLOSE' });
      }
      if (onExpandedChange) {
        onExpandedChange(false);
      }
    }, [isControlled, onExpandedChange]);

    const registerToggleRef = useCallback((buttonRef: HTMLButtonElement | null) => {
      toggleRef.current = buttonRef;
    }, []);

    // Handle Escape key - closes menu and returns focus to toggle
    const handleEscapeKey = useCallback(
      (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        if (isEscapeKey(event) && isNavbarExpanded(fsmState)) {
          close();
          toggleRef.current?.focus();
        }
      },
      [fsmState, close]
    );

    // Ref for navbar element (for click outside detection)
    const navbarRef = useRef<HTMLElement>(null);

    // Close navbar when clicking outside (only when expanded)
    useClickOutside(
      navbarRef,
      () => {
        if (isNavbarExpanded(fsmState)) {
          close();
        }
      },
      { enabled: isNavbarExpanded(fsmState) }
    );

    // Memoize context value
    const contextValue = useMemo<NavbarContextValue>(
      () => ({
        isExpanded: isNavbarExpanded(fsmState),
        isAnimating: isNavbarAnimating(fsmState),
        toggle,
        open,
        close,
        handleEscapeKey,
        variant,
        expand,
        collapseId,
        registerToggleRef,
        orientation,
      }),
      [
        fsmState,
        toggle,
        open,
        close,
        handleEscapeKey,
        variant,
        expand,
        collapseId,
        registerToggleRef,
        orientation,
      ]
    );

    // Compute navbar classes
    const navbarClasses = useMemo(() => {
      // Expand breakpoint
      let expandClass: string | undefined;
      if (expand === true) {
        expandClass = 'navbar-expand';
      } else if (expand !== false) {
        expandClass = `navbar-expand-${expand}`;
      }
      // If expand === false, no expand class (always collapsed)

      return cn(
        'navbar',
        expandClass,
        variant === 'dark' && 'navbar-dark',
        bg && `bg-${bg}`,
        placement !== 'static' && placement,
        className
      );
    }, [expand, variant, bg, placement, className]);

    // Container class
    const containerClass = useMemo(() => {
      if (fluid) {
        return 'container-fluid';
      }
      if (container) {
        return `container-${container}`;
      }
      return 'container';
    }, [fluid, container]);

    // Data theme attribute for dark variant
    const dataTheme = variant === 'dark' ? 'dark' : undefined;

    // Compute role - 'none' removes the role, undefined uses implicit nav role
    const computedRole = role === 'none' ? undefined : role;

    return (
      <NavbarContext.Provider value={contextValue}>
        <nav
          ref={mergeRefs([ref, navbarRef])}
          id={id}
          className={navbarClasses}
          style={style}
          role={computedRole}
          aria-label={ariaLabel}
          data-bs-theme={dataTheme}
          data-visual-state={getNavbarVisualState(fsmState)}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          <div className={containerClass}>{children}</div>
        </nav>
      </NavbarContext.Provider>
    );
  }
);

NavbarRoot.displayName = 'Navbar';

// =============================================================================
// Navbar.Brand Component
// =============================================================================

/**
 * Navbar.Brand Component
 *
 * The brand/logo element of the navbar. Can be a link or static text.
 *
 * @example
 * ```tsx
 * <Navbar.Brand href="/">
 *   <img src="/logo.svg" alt="Logo" width="30" height="24" />
 *   MyApp
 * </Navbar.Brand>
 * ```
 */
const NavbarBrand = forwardRef<HTMLAnchorElement | HTMLSpanElement, NavbarBrandProps>(
  (
    {
      children,
      href,
      target,
      rel,
      onClick,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Validate href for security
    const safeHref = isValidHref(href) ? href : undefined;

    // Compute classes
    const brandClasses = useMemo(() => cn('navbar-brand', className), [className]);

    // Compute rel for security
    const computedRel = useMemo(() => {
      if (!safeHref) {
        return undefined;
      }
      if (rel) {
        return rel;
      }
      if (target === '_blank') {
        return 'noopener noreferrer';
      }
      return undefined;
    }, [safeHref, rel, target]);

    // Render as link if href provided
    if (safeHref) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          id={id}
          className={brandClasses}
          style={style}
          href={safeHref}
          target={target}
          rel={computedRel}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </a>
      );
    }

    // Render as button when interactive (has onClick), span otherwise
    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          id={id}
          className={`${brandClasses} mb-0 h1 btn-unstyled`}
          style={style}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </button>
      );
    }

    // Non-interactive brand as span
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        id={id}
        className={`${brandClasses} mb-0 h1`}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </span>
    );
  }
);

NavbarBrand.displayName = 'Navbar.Brand';

// =============================================================================
// Navbar.Toggle Component
// =============================================================================

/**
 * Navbar.Toggle Component
 *
 * The hamburger menu button that toggles the collapse menu on mobile.
 *
 * @example
 * ```tsx
 * <Navbar.Toggle aria-label="Toggle navigation" />
 * ```
 */
const NavbarToggle = forwardRef<HTMLButtonElement, NavbarToggleProps>(
  (
    {
      children,
      onClick,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'aria-label': ariaLabel = 'Toggle navigation',
    },
    ref
  ) => {
    const { isExpanded, toggle, collapseId, registerToggleRef } = useNavbarContext();

    // Merge refs - combine forwarded ref with context registration
    const internalRef = useRef<HTMLButtonElement | null>(null);
    const mergedRef = mergeRefs(ref, internalRef, registerToggleRef);

    // Handle click
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        toggle();
        onClick?.(event);
      },
      [toggle, onClick]
    );

    // Compute classes
    const toggleClasses = useMemo(() => cn('navbar-toggler', className), [className]);

    return (
      <button
        ref={mergedRef}
        type="button"
        id={id}
        className={toggleClasses}
        style={style}
        aria-controls={collapseId}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
        onClick={handleClick}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children ?? <span className="navbar-toggler-icon" aria-hidden="true" />}
      </button>
    );
  }
);

NavbarToggle.displayName = 'Navbar.Toggle';

// =============================================================================
// Navbar.Collapse Component
// =============================================================================

/**
 * Navbar.Collapse Component
 *
 * The collapsible container for navigation items on mobile.
 *
 * @example
 * ```tsx
 * <Navbar.Collapse>
 *   <Navbar.Nav>
 *     <Navbar.Link href="/">Home</Navbar.Link>
 *   </Navbar.Nav>
 * </Navbar.Collapse>
 * ```
 */
const NavbarCollapse = forwardRef<HTMLDivElement, NavbarCollapseProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    const { isExpanded, isAnimating, collapseId } = useNavbarContext();

    // Compute classes
    const collapseClasses = useMemo(
      () => cn('collapse', 'navbar-collapse', isExpanded && 'show', className),
      [isExpanded, className]
    );

    return (
      <div
        ref={ref}
        id={id ?? collapseId}
        className={collapseClasses}
        style={style}
        aria-busy={isAnimating || undefined}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );
  }
);

NavbarCollapse.displayName = 'Navbar.Collapse';

// =============================================================================
// Navbar.Nav Component
// =============================================================================

/**
 * Navbar.Nav Component
 *
 * Container for navigation links with keyboard navigation support.
 *
 * KEYBOARD NAVIGATION (enhanced a11y):
 * - Arrow Down/Right: Move focus to next link
 * - Arrow Up/Left: Move focus to previous link
 * - Home: Move focus to first link
 * - End: Move focus to last link
 *
 * @example
 * ```tsx
 * <Navbar.Nav>
 *   <Navbar.Link href="/" active>Home</Navbar.Link>
 *   <Navbar.Link href="/about">About</Navbar.Link>
 * </Navbar.Nav>
 * ```
 */
const NavbarNav = forwardRef<HTMLUListElement, NavbarNavProps>(
  (
    {
      children,
      scroll = false,
      scrollHeight = '100px',
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { orientation, handleEscapeKey } = useNavbarContext();
    const navRef = useRef<HTMLUListElement | null>(null);

    // Merge refs
    const mergedRef = mergeRefs(ref, navRef);

    // Get focusable nav links
    const getFocusableLinks = useCallback((): HTMLAnchorElement[] => {
      if (!navRef.current) {
        return [];
      }
      return Array.from(
        navRef.current.querySelectorAll<HTMLAnchorElement>(
          '.nav-link:not([disabled]):not([aria-disabled="true"]):not([tabindex="-1"])'
        )
      );
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLElement> | KeyboardEvent) => {
        // Handle Escape to close menu
        if (isEscapeKey(event)) {
          handleEscapeKey(event);
          return;
        }

        const links = getFocusableLinks();
        if (links.length === 0) {
          return;
        }

        const activeElement = document.activeElement;
        const currentIndex =
          activeElement instanceof HTMLAnchorElement ? links.indexOf(activeElement) : -1;
        let nextIndex = -1;

        // Determine navigation keys based on orientation
        // Horizontal: ArrowLeft/ArrowRight per WAI-ARIA navigation patterns
        // Vertical: ArrowUp/ArrowDown
        const isVertical = orientation === 'vertical';
        const nextKeys = isVertical ? ['ArrowDown'] : ['ArrowRight'];
        const prevKeys = isVertical ? ['ArrowUp'] : ['ArrowLeft'];

        if (nextKeys.includes(event.key)) {
          event.preventDefault();
          nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
        } else if (prevKeys.includes(event.key)) {
          event.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
        } else if (event.key === 'Home') {
          event.preventDefault();
          nextIndex = 0;
        } else if (event.key === 'End') {
          event.preventDefault();
          nextIndex = links.length - 1;
        }

        if (nextIndex >= 0 && nextIndex < links.length) {
          links[nextIndex]?.focus();
        }
      },
      [getFocusableLinks, orientation, handleEscapeKey]
    );

    // Attach native keydown listener to avoid lint issues on non-interactive elements
    useEffect(() => {
      const node = navRef.current;
      if (!node) {
        return undefined;
      }

      const listener = (event: KeyboardEvent): void => {
        handleKeyDown(event);
      };

      node.addEventListener('keydown', listener);
      return () => {
        node.removeEventListener('keydown', listener);
      };
    }, [handleKeyDown]);

    // Compute classes
    const navClasses = useMemo(
      () => cn('navbar-nav', scroll && 'navbar-nav-scroll', className),
      [scroll, className]
    );

    // Compute scroll style
    const computedStyle = useMemo(() => {
      if (scroll) {
        return {
          ...style,
          '--bs-scroll-height': scrollHeight,
        } as React.CSSProperties;
      }
      return style;
    }, [scroll, scrollHeight, style]);

    // Normalize children so that ul only contains li elements
    const normalizedChildren = useMemo(() => {
      return Children.map(children, (child, index) => {
        if (!isValidElement(child)) {
          return child;
        }
        const childType = (child.type as { displayName?: string }) || {};
        const isNavItem = childType.displayName === NavbarItem.displayName;
        if (isNavItem) {
          return child;
        }
        const key = child.key ?? `navbar-item-${index}`;
        return <NavbarItem key={key}>{child}</NavbarItem>;
      });
    }, [children]);

    return (
      <ul
        ref={mergedRef}
        id={id}
        className={navClasses}
        style={computedStyle}
        data-testid={dataTestId}
        data-test={dataTest}
        data-orientation={orientation}
      >
        {normalizedChildren}
      </ul>
    );
  }
);

NavbarNav.displayName = 'Navbar.Nav';

// =============================================================================
// Navbar.Item Component
// =============================================================================

/**
 * Navbar.Item Component
 *
 * Wrapper for nav items (links or dropdowns).
 *
 * @example
 * ```tsx
 * <Navbar.Item>
 *   <Navbar.Link href="/">Home</Navbar.Link>
 * </Navbar.Item>
 * ```
 */
const NavbarItem = forwardRef<HTMLLIElement, NavbarItemProps>(
  (
    {
      children,
      dropdown = false,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Compute classes
    const itemClasses = useMemo(
      () => cn('nav-item', dropdown && 'dropdown', className),
      [dropdown, className]
    );

    return (
      <li
        ref={ref}
        id={id}
        className={itemClasses}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </li>
    );
  }
);

NavbarItem.displayName = 'Navbar.Item';

// =============================================================================
// Navbar.Link Component
// =============================================================================

/**
 * Navbar.Link Component
 *
 * A navigation link within the navbar.
 *
 * @example
 * ```tsx
 * <Navbar.Link href="/" active>Home</Navbar.Link>
 * <Navbar.Link href="/about">About</Navbar.Link>
 * <Navbar.Link href="/disabled" disabled>Disabled</Navbar.Link>
 * ```
 */
const NavbarLink = forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  (
    {
      children,
      href = '#',
      active = false,
      disabled = false,
      target,
      rel,
      onClick,
      as: Component,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Validate href for security
    const safeHref = isValidHref(href) ? href : '#';

    // Compute classes
    const linkClasses = useMemo(
      () => cn('nav-link', active && 'active', disabled && 'disabled', className),
      [active, disabled, className]
    );

    // Compute rel for security
    const computedRel = useMemo(() => {
      if (rel) {
        return rel;
      }
      if (target === '_blank') {
        return 'noopener noreferrer';
      }
      return undefined;
    }, [rel, target]);

    // Handle click for disabled state
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [disabled, onClick]
    );

    // Common props
    const linkProps = {
      ref,
      id,
      className: linkClasses,
      style,
      href: safeHref,
      target,
      rel: computedRel,
      'aria-current': active ? ('page' as const) : undefined,
      'aria-disabled': disabled || undefined,
      tabIndex: disabled ? -1 : undefined,
      onClick: handleClick,
      'data-testid': dataTestId,
      'data-test': dataTest,
    };

    // Use custom component if provided (e.g., React Router Link)
    if (Component) {
      return <Component {...linkProps}>{children}</Component>;
    }

    return <a {...linkProps}>{children}</a>;
  }
);

NavbarLink.displayName = 'Navbar.Link';

// =============================================================================
// Navbar.Text Component
// =============================================================================

/**
 * Navbar.Text Component
 *
 * Inline text content within the navbar.
 *
 * @example
 * ```tsx
 * <Navbar.Text>Signed in as: Jane Doe</Navbar.Text>
 * ```
 */
const NavbarText = forwardRef<HTMLSpanElement, NavbarTextProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    // Compute classes
    const textClasses = useMemo(() => cn('navbar-text', className), [className]);

    return (
      <span
        ref={ref}
        id={id}
        className={textClasses}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </span>
    );
  }
);

NavbarText.displayName = 'Navbar.Text';

// =============================================================================
// Compound Component Export
// =============================================================================

/**
 * Navbar compound component with subcomponents
 */
export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Toggle: NavbarToggle,
  Collapse: NavbarCollapse,
  Nav: NavbarNav,
  Item: NavbarItem,
  Link: NavbarLink,
  Text: NavbarText,
});

// Export context hook for custom subcomponents
export { useNavbarContext };

// Re-export FSM utilities
export {
  createInitialNavbarFSMState,
  getNavbarVisualState,
  isNavbarAnimating,
  isNavbarExpanded,
  navbarFSMReducer,
} from './Navbar.fsm';
// Re-export types
export type {
  NavbarBackground,
  NavbarBrandProps,
  NavbarCollapseProps,
  NavbarContextValue,
  NavbarExpandBreakpoint,
  NavbarFSMEvent,
  NavbarFSMState,
  NavbarItemProps,
  NavbarLinkProps,
  NavbarNavProps,
  NavbarOrientation,
  NavbarPlacement,
  NavbarProps,
  NavbarTextProps,
  NavbarToggleProps,
  NavbarVariant,
  NavbarVisibility,
  NavbarVisualState,
} from './Navbar.types';
