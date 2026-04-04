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
  ScrollspyFSMState,
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
 * Sanitize a target ID to ensure it's safe for use in href.
 * Blocks dangerous protocols and removes script tags.
 *
 * @param target - Raw target string
 * @returns Sanitized target string
 */
function sanitizeTarget(target: string): string {
  if (!target || !target.trim()) {
    return '';
  }

  if (DANGEROUS_PROTOCOLS.test(target.trim())) {
    return '';
  }

  const sanitized = target
    .replaceAll(/<script[\s\S]*?<\/script>/gi, '')
    .replaceAll(/<[^>]*>/g, '')
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
  const topOffset = typeof stickyTop === 'number' ? stickyTop : Number.parseInt(stickyTop, 10) || 0;
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
// Shared Scrollspy Engine Hook
// =============================================================================

interface UseScrollspyEngineOptions {
  items: ScrollspyItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveChange?: (activeId: string | null) => void;
  smoothScroll?: boolean;
  offset?: number;
  stickyTop?: number | string;
  rootMargin?: string;
  threshold?: number | number[];
}

function useScrollspyEngine(options: UseScrollspyEngineOptions): {
  activeId: string | null;
  fsmState: ScrollspyFSMState;
  contextValue: ScrollspyContextValue;
} {
  const {
    items,
    activeId: controlledActiveId,
    defaultActiveId = null,
    onActiveChange,
    smoothScroll = true,
    offset = 0,
    stickyTop = 0,
    rootMargin,
    threshold = 0,
  } = options;

  const isControlled = controlledActiveId !== undefined;

  const [fsmState, dispatch] = useReducer(
    scrollspyFSMReducer,
    defaultActiveId,
    createInitialScrollspyFSMState
  );

  const activeId = isControlled ? controlledActiveId : fsmState.activeId;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionOrderRef = useRef<string[]>([]);

  // Store latest state in refs so the IO callback never captures stale closures
  const fsmStateRef = useRef(fsmState);
  const onActiveChangeRef = useRef(onActiveChange);
  const isControlledRef = useRef(isControlled);

  useEffect(() => {
    fsmStateRef.current = fsmState;
  });

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  });

  useEffect(() => {
    isControlledRef.current = isControlled;
  });

  const computedRootMargin = useMemo(() => {
    if (rootMargin) {
      return rootMargin;
    }
    const topOffset = -offset;
    return `${topOffset}px 0px -50% 0px`;
  }, [rootMargin, offset]);

  const setActive = useCallback(
    (sectionId: string | null): void => {
      if (!isControlled) {
        dispatch({ type: 'SET_ACTIVE', sectionId });
      }
      onActiveChange?.(sectionId);
    },
    [isControlled, onActiveChange]
  );

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

  // Stable IO callback that reads from refs instead of capturing state
  const handleIntersectionRef = useRef<IntersectionObserverCallback>(
    (entries: IntersectionObserverEntry[]): void => {
      const currentState = fsmStateRef.current;
      const nextVisibleIds = new Set<string>(currentState.visibleIds);

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

      if (visibleInOrder.length > 0 && topVisible !== currentState.activeId) {
        if (!isControlledRef.current) {
          dispatch({ type: 'SET_ACTIVE', sectionId: topVisible });
        }
        onActiveChangeRef.current?.(topVisible);
      } else if (visibleInOrder.length === 0 && currentState.activeId !== null) {
        if (!isControlledRef.current) {
          dispatch({ type: 'SET_ACTIVE', sectionId: null });
        }
        onActiveChangeRef.current?.(null);
      }
    }
  );

  // Set up IntersectionObserver
  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const targets = getAllTargets(items);
    sectionOrderRef.current = targets;

    const observer = new IntersectionObserver(handleIntersectionRef.current, {
      rootMargin: computedRootMargin,
      threshold,
    });
    observerRef.current = observer;

    dispatch({ type: 'START_OBSERVING' });

    if (typeof observer.observe === 'function') {
      for (const target of targets) {
        const element = document.getElementById(target);
        if (element) {
          observer.observe(element);
        }
      }
    }

    return () => {
      if (observerRef.current && typeof observerRef.current.disconnect === 'function') {
        observerRef.current.disconnect();
      }
      observerRef.current = null;
    };
  }, [items, computedRootMargin, threshold]);

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

  return { activeId, fsmState, contextValue };
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
    const generatedId = useId();
    const scrollspyId = id ?? `scrollspy-${generatedId}`;

    const { activeId, fsmState, contextValue } = useScrollspyEngine({
      items,
      activeId: controlledActiveId,
      defaultActiveId,
      onActiveChange,
      smoothScroll,
      offset,
      stickyTop,
      rootMargin,
      threshold,
    });

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
  const { contextValue } = useScrollspyEngine({
    items,
    activeId: controlledActiveId,
    defaultActiveId,
    onActiveChange,
    smoothScroll,
    offset,
  });

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
