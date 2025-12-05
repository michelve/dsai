/**
 * Scrollspy Component
 *
 * Accessible scrollspy navigation component that highlights navigation links
 * based on scroll position using IntersectionObserver.
 *
 * Features:
 * - IntersectionObserver for efficient scroll tracking
 * - Configurable offset for sticky headers
 * - Smooth scroll to sections on link click
 * - Support for nested sections
 * - FSM-based state management
 * - Full keyboard accessibility
 * - WCAG 2.2 AA compliant
 *
 * @module Scrollspy
 */

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { cn, isBrowser, prefersReducedMotion } from '../../utils';
import { isEnterKey } from '../../utils/keyboard';

import {
  createInitialScrollspyFSMState,
  getScrollspyVisualState,
  scrollspyFSMReducer,
} from './Scrollspy.fsm';

import type {
  ScrollspyContextValue,
  ScrollspyItem,
  ScrollspyLinkProps,
  ScrollspyProps,
  ScrollspyProviderProps,
} from './Scrollspy.types';

// =============================================================================
// Context
// =============================================================================

const ScrollspyContext = createContext<ScrollspyContextValue | null>(null);

/**
 * Hook to access Scrollspy context
 *
 * @throws Error if used outside of Scrollspy component
 * @returns Scrollspy context value
 */
export function useScrollspy(): ScrollspyContextValue {
  const context = useContext(ScrollspyContext);
  if (!context) {
    throw new Error('useScrollspy must be used within a Scrollspy component');
  }
  return context;
}

// =============================================================================
// Security Utilities
// =============================================================================

/**
 * Dangerous URI protocols that should be blocked for security
 */
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript|file):/i;

/**
 * Sanitize a target ID to ensure it's safe for use in href
 * Blocks dangerous protocols and removes script tags
 *
 * @param target - Raw target string
 * @returns Sanitized target string
 */
function sanitizeTarget(target: string): string {
  // Empty or whitespace only - return empty
  if (!target || !target.trim()) {
    return '';
  }

  // Block dangerous protocols
  if (DANGEROUS_PROTOCOLS.test(target.trim())) {
    return '';
  }

  // Remove any script tags or HTML
  const sanitized = target
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  return sanitized;
}

function getScrollableContainer(element: HTMLElement): HTMLElement | null {
  if (!isBrowser()) {
    return null;
  }

  let node: HTMLElement | null = element.parentElement;
  while (node) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
    if (isScrollable) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function scrollElementIntoView(
  element: HTMLElement,
  behavior: ScrollBehavior,
  offset: number,
  stickyTop: number | string
): void {
  const scrollContainer = getScrollableContainer(element);

  // Scroll inside nearest scrollable container
  if (scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const offsetTop = elementRect.top - containerRect.top + scrollContainer.scrollTop - offset;
    scrollContainer.scrollTo({
      top: offsetTop,
      behavior,
    });
    return;
  }

  // Fallback to window scroll
  const topOffset = typeof stickyTop === 'number' ? stickyTop : parseInt(stickyTop, 10) || 0;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - offset - topOffset;

  if (typeof window.scrollTo === 'function') {
    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  } else {
    element.scrollIntoView({ behavior });
  }
}

// =============================================================================
// Scrollspy Link Component
// =============================================================================

/**
 * Individual scrollspy navigation link
 *
 * Uses semantic anchor element with proper ARIA attributes.
 * Automatically highlights when the target section is in view.
 *
 * @example
 * ```tsx
 * <Scrollspy.Link target="section-1">Section 1</Scrollspy.Link>
 * ```
 */
const ScrollspyLink = forwardRef<HTMLAnchorElement, ScrollspyLinkProps>(
  (
    {
      target,
      children,
      active: activeProp,
      onClick,
      className,
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const context = useContext(ScrollspyContext);

    // Sanitize target for security
    const safeTarget = useMemo(() => sanitizeTarget(target), [target]);

    // Use prop if provided, otherwise check context
    const isActive = activeProp ?? context?.activeId === target;

    // Handle click with smooth scroll
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>): void => {
        event.preventDefault();

        // Don't scroll if target was sanitized away
        if (!safeTarget) {
          return;
        }

        // Scroll to section
        if (context) {
          context.scrollToSection(safeTarget);
        } else {
          // Fallback if not in context
          const element = document.getElementById(safeTarget);
          if (element) {
            const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
            scrollElementIntoView(element, behavior, 0, 0);
          }
        }

        // Call user onClick if provided
        onClick?.(event);
      },
      [context, safeTarget, onClick]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLAnchorElement>): void => {
        if (isEnterKey(event) || event.key === ' ') {
          event.preventDefault();
          if (!safeTarget) {
            return;
          }

          const element = document.getElementById(safeTarget);
          if (element) {
            const behavior =
              context?.smoothScroll && !prefersReducedMotion() ? ('smooth' as const) : 'auto';
            scrollElementIntoView(element, behavior, 0, 0);
          }
        }
      },
      [safeTarget, context?.smoothScroll]
    );

    // Compute class names
    const linkClassName = useMemo(
      () => cn('nav-link', isActive && 'active', className),
      [isActive, className]
    );

    // Build safe href
    const safeHref = safeTarget ? `#${safeTarget}` : '#';

    return (
      <a
        ref={ref}
        id={id}
        href={safeHref}
        className={linkClassName}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={isActive ? 'location' : undefined}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </a>
    );
  }
);

ScrollspyLink.displayName = 'Scrollspy.Link';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract all target IDs from items (including nested)
 */
function getAllTargets(itemList: ScrollspyItem[]): string[] {
  const targets: string[] = [];
  for (const item of itemList) {
    targets.push(item.target);
    if (item.children) {
      targets.push(...getAllTargets(item.children));
    }
  }
  return targets;
}

// =============================================================================
// Recursive Item Renderer
// =============================================================================

/**
 * Render a scrollspy item and its children recursively
 */
function renderScrollspyItem(item: ScrollspyItem, activeId: string | null): React.ReactNode {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeId === item.target;

  return (
    <li key={item.id} className="nav-item">
      <ScrollspyLink target={item.target} active={isActive}>
        {item.label}
      </ScrollspyLink>
      {hasChildren && (
        <nav className="nav nav-pills flex-column ms-3" aria-label={`${item.label} subsections`}>
          <ul className="list-unstyled">
            {item.children?.map((child) => renderScrollspyItem(child, activeId))}
          </ul>
        </nav>
      )}
    </li>
  );
}

// =============================================================================
// Main Scrollspy Component
// =============================================================================

/**
 * Scrollspy Component
 *
 * Accessible scrollspy navigation component that highlights navigation links
 * based on scroll position using IntersectionObserver for efficient tracking.
 *
 * ACCESSIBILITY:
 * - Uses semantic `<nav>` element
 * - `aria-label` for navigation context
 * - `aria-current="location"` on active link
 * - Full keyboard navigation (Tab, Enter)
 * - Links are semantic `<a>` elements with href to section IDs
 *
 * SECURITY:
 * - No prop spreading (explicit whitelist only)
 * - Target IDs are validated and sanitized
 * - No dangerouslySetInnerHTML
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Introduction', target: 'intro' },
 *   { id: '2', label: 'Features', target: 'features' },
 *   { id: '3', label: 'API', target: 'api' },
 * ];
 *
 * <Scrollspy items={items} aria-label="Page navigation" />
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/scrollspy/
 */
export const Scrollspy = forwardRef<HTMLElement, ScrollspyProps>(
  (
    {
      items,
      offset = 0,
      rootMargin,
      threshold = 0,
      smoothScroll = true,
      sticky = false,
      stickyTop = 0,
      onActiveChange,
      'aria-label': ariaLabel = 'Page navigation',
      'aria-labelledby': ariaLabelledBy,
      activeId: controlledActiveId,
      defaultActiveId = null,
      children,
      className,
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Generate unique ID
    const generatedId = useId();
    const scrollspyId = id ?? `scrollspy-${generatedId}`;

    // Controlled vs uncontrolled
    const isControlled = controlledActiveId !== undefined;

    // FSM state
    const [fsmState, dispatch] = useReducer(
      scrollspyFSMReducer,
      defaultActiveId,
      createInitialScrollspyFSMState
    );

    // Effective active ID (controlled or uncontrolled)
    const activeId = isControlled ? controlledActiveId : fsmState.activeId;

    // Refs for tracking
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sectionOrderRef = useRef<string[]>([]);

    // Compute root margin with offset
    const computedRootMargin = useMemo(() => {
      if (rootMargin) {
        return rootMargin;
      }
      // Default: offset from top, 50% from bottom to activate when section is in upper half
      const topOffset = -offset;
      return `${topOffset}px 0px -50% 0px`;
    }, [rootMargin, offset]);

    // Set active section
    const setActive = useCallback(
      (sectionId: string | null): void => {
        if (!isControlled) {
          dispatch({ type: 'SET_ACTIVE', sectionId });
        }
        onActiveChange?.(sectionId);
      },
      [isControlled, onActiveChange]
    );

    // Scroll to section
    const scrollToSection = useCallback(
      (sectionId: string): void => {
        if (!isBrowser()) {
          return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
          const behavior =
            smoothScroll && !prefersReducedMotion() ? ('smooth' as const) : ('auto' as const);
          scrollElementIntoView(element, behavior, offset, stickyTop);
        }
      },
      [smoothScroll, offset, stickyTop]
    );

    // IntersectionObserver callback
    const handleIntersection = useCallback(
      (entries: IntersectionObserverEntry[]): void => {
        // Clone current visible IDs so we can compute the next state synchronously
        const nextVisibleIds = new Set<string>(fsmState.visibleIds);

        for (const entry of entries) {
          const sectionId = entry.target.id;

          if (entry.isIntersecting) {
            nextVisibleIds.add(sectionId);
            dispatch({ type: 'SECTION_ENTER', sectionId });
          } else {
            nextVisibleIds.delete(sectionId);
            dispatch({ type: 'SECTION_LEAVE', sectionId });
          }
        }

        const visibleInOrder = sectionOrderRef.current.filter((id) => nextVisibleIds.has(id));
        const topVisible = visibleInOrder[0] ?? null;

        if (visibleInOrder.length > 0 && topVisible !== fsmState.activeId) {
          if (!isControlled) {
            dispatch({ type: 'SET_ACTIVE', sectionId: topVisible });
          }
          onActiveChange?.(topVisible);
        } else if (visibleInOrder.length === 0 && fsmState.activeId !== null) {
          if (!isControlled) {
            dispatch({ type: 'SET_ACTIVE', sectionId: null });
          }
          onActiveChange?.(null);
        }
      },
      [fsmState.visibleIds, fsmState.activeId, isControlled, onActiveChange]
    );

    // Set up IntersectionObserver
    useEffect(() => {
      if (!isBrowser()) {
        return;
      }

      // Get all target IDs
      const targets = getAllTargets(items);
      sectionOrderRef.current = targets;

      // Create observer
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: computedRootMargin,
        threshold,
      });
      observerRef.current = observer;

      dispatch({ type: 'START_OBSERVING' });

      // Observe all target sections
      if (typeof observer.observe === 'function') {
        for (const target of targets) {
          const element = document.getElementById(target);
          if (element) {
            observer.observe(element);
          }
        }
      }

      // Cleanup
      return () => {
        if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
          observerRef.current.disconnect();
        }
        observerRef.current = null;
        // Don't dispatch STOP_OBSERVING during cleanup to avoid infinite loops
        // The state will be reset when the component unmounts anyway
      };
    }, [items, computedRootMargin, threshold, handleIntersection]);

    // Context value
    const contextValue = useMemo<ScrollspyContextValue>(
      () => ({
        activeId,
        visibleIds: fsmState.visibleIds,
        setActive,
        scrollToSection,
        smoothScroll,
      }),
      [activeId, fsmState.visibleIds, setActive, scrollToSection, smoothScroll]
    );

    // Compute nav classes
    const navClassName = useMemo(
      () => cn('nav', 'nav-pills', 'flex-column', sticky && 'position-sticky', className),
      [sticky, className]
    );

    // Compute nav styles
    const navStyle = useMemo(() => {
      const styles: React.CSSProperties = { ...style };
      if (sticky) {
        styles.top = typeof stickyTop === 'number' ? `${stickyTop}px` : stickyTop;
      }
      return styles;
    }, [style, sticky, stickyTop]);

    // Visual state for testing
    const visualState = getScrollspyVisualState(fsmState);

    return (
      <ScrollspyContext.Provider value={contextValue}>
        <nav
          ref={ref}
          id={scrollspyId}
          className={navClassName}
          style={navStyle}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-visual-state={visualState}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children ?? (
            <ul className="nav nav-pills flex-column list-unstyled">
              {items.map((item) => renderScrollspyItem(item, activeId))}
            </ul>
          )}
        </nav>
      </ScrollspyContext.Provider>
    );
  }
) as React.ForwardRefExoticComponent<ScrollspyProps & React.RefAttributes<HTMLElement>> & {
  Link: typeof ScrollspyLink;
};

Scrollspy.displayName = 'Scrollspy';

// Attach subcomponents
Scrollspy.Link = ScrollspyLink;

// =============================================================================
// ScrollspyProvider Component
// =============================================================================

/**
 * Provider component for using Scrollspy context without rendering the nav
 *
 * Useful when you need access to scrollspy state in other components.
 *
 * @example
 * ```tsx
 * function ActiveIndicator() {
 *   const { activeId, scrollTo } = useScrollspy();
 *   return <div>Currently viewing: {activeId}</div>;
 * }
 *
 * <ScrollspyProvider items={items}>
 *   <ActiveIndicator />
 *   <Scrollspy items={items} />
 * </ScrollspyProvider>
 * ```
 */
export function ScrollspyProvider({
  items,
  activeId: controlledActiveId,
  defaultActiveId = null,
  onActiveChange,
  smoothScroll = true,
  offset = 0,
  children,
}: ScrollspyProviderProps): React.ReactElement {
  // Controlled vs uncontrolled
  const isControlled = controlledActiveId !== undefined;

  // FSM state
  const [fsmState, dispatch] = useReducer(
    scrollspyFSMReducer,
    defaultActiveId,
    createInitialScrollspyFSMState
  );

  // Effective active ID (controlled or uncontrolled)
  const activeId = isControlled ? controlledActiveId : fsmState.activeId;

  // Refs for tracking
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionOrderRef = useRef<string[]>([]);

  // Set active section
  const setActive = useCallback(
    (sectionId: string | null): void => {
      if (!isControlled) {
        dispatch({ type: 'SET_ACTIVE', sectionId });
      }
      onActiveChange?.(sectionId);
    },
    [isControlled, onActiveChange]
  );

  // Scroll to section
  const scrollToSection = useCallback(
    (sectionId: string): void => {
      const element = document.getElementById(sectionId);
      if (element) {
        const behavior = smoothScroll ? 'smooth' : 'auto';

        // Calculate position with offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior,
        });
      }
    },
    [smoothScroll, offset]
  );

  // IntersectionObserver callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]): void => {
      // Process all entries
      for (const entry of entries) {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          dispatch({ type: 'SECTION_ENTER', sectionId });
        } else {
          dispatch({ type: 'SECTION_LEAVE', sectionId });
        }
      }

      // Find the topmost visible section based on DOM order
      const visibleInOrder = sectionOrderRef.current.filter((id) =>
        fsmState.visibleIds.includes(id)
      );

      const topVisible = visibleInOrder[0] ?? null;
      if (visibleInOrder.length > 0 && topVisible !== fsmState.activeId) {
        if (!isControlled) {
          dispatch({ type: 'SET_ACTIVE', sectionId: topVisible });
        }
        onActiveChange?.(topVisible);
      }
    },
    [fsmState.visibleIds, fsmState.activeId, isControlled, onActiveChange]
  );

  // Set up IntersectionObserver
  useEffect(() => {
    // Get all target IDs
    const targets = getAllTargets(items);
    sectionOrderRef.current = targets;

    // Create observer
    const rootMargin = `${-offset}px 0px -50% 0px`;
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: 0,
    });
    observerRef.current = observer;

    dispatch({ type: 'START_OBSERVING' });

    // Observe all target sections
    if (typeof observer.observe === 'function') {
      for (const target of targets) {
        const element = document.getElementById(target);
        if (element) {
          observer.observe(element);
        }
      }
    }

    // Cleanup
    return () => {
      if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
        observerRef.current.disconnect();
      }
      observerRef.current = null;
      dispatch({ type: 'STOP_OBSERVING' });
    };
  }, [items, offset, handleIntersection]);

  // Context value
  const contextValue = useMemo<ScrollspyContextValue>(
    () => ({
      activeId,
      visibleIds: fsmState.visibleIds,
      setActive,
      scrollToSection,
      smoothScroll,
    }),
    [activeId, fsmState.visibleIds, setActive, scrollToSection, smoothScroll]
  );

  return <ScrollspyContext.Provider value={contextValue}>{children}</ScrollspyContext.Provider>;
}

// =============================================================================
// Exports
// =============================================================================

export {
  createInitialScrollspyFSMState,
  getScrollspyVisualState,
  isScrollspySectionActive,
  isScrollspySectionVisible,
  scrollspyFSMReducer,
} from './Scrollspy.fsm';
export type {
  SafeScrollspyHTMLAttributes,
  ScrollspyContextValue,
  ScrollspyFSMEvent,
  ScrollspyFSMState,
  ScrollspyItem,
  ScrollspyLinkProps,
  ScrollspyProps,
  ScrollspyVisualState,
} from './Scrollspy.types';
