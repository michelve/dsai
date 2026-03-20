/**
 * Accordion Component
 *
 * A fully accessible accordion component following Bootstrap 5 patterns
 * with FSM-driven state management for expand/collapse behavior.
 *
 * @module Accordion
 * @see https://getbootstrap.com/docs/5.3/components/accordion/
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

import { cn } from '../../utils';
import { mergeRefs } from '../../utils/dom/mergeRefs';

import {
  accordionFSMReducer,
  createInitialAccordionFSMState,
  getActiveKeysArray,
} from './Accordion.fsm';

import type {
  AccordionButtonProps,
  AccordionContextValue,
  AccordionHeaderProps,
  AccordionItemContextValue,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
} from './Accordion.types';

// =============================================================================
// Contexts
// =============================================================================

/**
 * Accordion context for sharing state between components
 */
const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * AccordionItem context for sharing item-level state
 */
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

/**
 * Hook to access accordion context
 */
function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
}

/**
 * Hook to access accordion item context
 */
function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionButton and AccordionPanel must be used within an Accordion.Item');
  }
  return context;
}

// =============================================================================
// Accordion Root Component
// =============================================================================

/**
 * Accordion Component
 *
 * A container for accordion items that manages expansion state.
 * Supports single (one at a time) or multiple (many open) selection modes.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - Semantic structure with proper heading hierarchy
 * - Keyboard navigation (Tab, Enter, Space)
 * - ARIA attributes on buttons and panels
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <Accordion.Item eventKey="0">
 *     <Accordion.Button>Section 1</Accordion.Button>
 *     <Accordion.Panel>Content 1</Accordion.Panel>
 *   </Accordion.Item>
 *   <Accordion.Item eventKey="1">
 *     <Accordion.Button>Section 2</Accordion.Button>
 *     <Accordion.Panel>Content 2</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      selectionMode = 'single',
      activeKeys: controlledActiveKeys,
      onActiveKeysChange,
      defaultActiveKeys = [],
      flush = false,
      onItemExpand,
      onItemCollapse,
      onItemToggle,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Determine if controlled
    const isControlled = controlledActiveKeys !== undefined;

    // Initialize FSM state
    const [fsmState, dispatch] = useReducer(
      accordionFSMReducer,
      { activeKeys: isControlled ? controlledActiveKeys : defaultActiveKeys, selectionMode },
      ({ activeKeys, selectionMode: mode }) => createInitialAccordionFSMState(activeKeys, mode)
    );

    // Track previous active keys for expand/collapse callbacks
    const prevActiveKeysRef = useRef<Set<string>>(new Set(fsmState.activeKeys));

    // Track button refs for arrow-key navigation
    const buttonRefsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

    // Register button ref for arrow-key navigation
    const registerButtonRef = useCallback(
      (eventKey: string, buttonRef: HTMLButtonElement | null) => {
        if (buttonRef) {
          buttonRefsRef.current.set(eventKey, buttonRef);
        } else {
          buttonRefsRef.current.delete(eventKey);
        }
      },
      []
    );

    // Get button keys sorted by DOM position
    const getSortedButtonKeys = useCallback((): string[] => {
      const entries = [...buttonRefsRef.current.entries()];
      entries.sort(([, a], [, b]) => {
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      });
      return entries.map(([key]) => key);
    }, []);

    // Navigate to next/previous button using arrow keys
    const navigateToButton = useCallback(
      (eventKey: string, direction: 'next' | 'prev') => {
        const order = getSortedButtonKeys();
        const currentIndex = order.indexOf(eventKey);
        if (currentIndex === -1 || order.length === 0) {
          return;
        }

        // Build a rotated list starting from next/prev position to enable wrapping
        const rotatedKeys =
          direction === 'next'
            ? [...order.slice(currentIndex + 1), ...order.slice(0, currentIndex)]
            : [
                ...order.slice(0, currentIndex).reverse(),
                ...order.slice(currentIndex + 1).reverse(),
              ];

        // Find the first focusable (non-disabled) button
        for (const key of rotatedKeys) {
          const button = buttonRefsRef.current.get(key);
          if (button && !button.disabled) {
            button.focus();
            return;
          }
        }
      },
      [getSortedButtonKeys]
    );

    // Navigate to first/last focusable button (for Home/End keys)
    const navigateToEdge = useCallback(
      (position: 'first' | 'last') => {
        const order = getSortedButtonKeys();
        if (order.length === 0) return;

        const keys = position === 'first' ? order : [...order].reverse();

        for (const key of keys) {
          const button = buttonRefsRef.current.get(key);
          if (button && !button.disabled) {
            button.focus();
            return;
          }
        }
      },
      [getSortedButtonKeys]
    );

    // Sync with controlled props when they change
    useEffect(() => {
      if (isControlled) {
        dispatch({ type: 'RESET_FROM_PROPS', activeKeys: controlledActiveKeys });
      }
    }, [isControlled, controlledActiveKeys]);

    // Fire expand/collapse callbacks when activeKeys change
    useEffect(() => {
      const prevKeys = prevActiveKeysRef.current;
      const currentKeys = fsmState.activeKeys;

      // Find newly expanded items
      currentKeys.forEach((key) => {
        if (!prevKeys.has(key)) {
          onItemExpand?.(key);
          onItemToggle?.(key, { expanded: true });
        }
      });

      // Find newly collapsed items
      prevKeys.forEach((key) => {
        if (!currentKeys.has(key)) {
          onItemCollapse?.(key);
          onItemToggle?.(key, { expanded: false });
        }
      });

      prevActiveKeysRef.current = new Set(currentKeys);
    }, [fsmState.activeKeys, onItemExpand, onItemCollapse, onItemToggle]);

    // Toggle item handler
    const toggleItem = useCallback(
      (eventKey: string) => {
        if (isControlled) {
          // In controlled mode, compute next state and call callback
          const wasExpanded = fsmState.activeKeys.has(eventKey);
          let newKeys: string[];

          if (wasExpanded) {
            newKeys = getActiveKeysArray(fsmState).filter((k) => k !== eventKey);
          } else {
            if (selectionMode === 'single') {
              newKeys = [eventKey];
            } else {
              newKeys = [...getActiveKeysArray(fsmState), eventKey];
            }
          }

          onActiveKeysChange?.(newKeys);
        } else {
          // In uncontrolled mode, update internal state
          dispatch({ type: 'TOGGLE', eventKey });
        }
      },
      [isControlled, fsmState, selectionMode, onActiveKeysChange]
    );

    // Memoize context value
    const contextValue = useMemo<AccordionContextValue>(
      () => ({
        activeKeys: getActiveKeysArray(fsmState),
        toggleItem,
        selectionMode,
        flush,
        registerButtonRef,
        navigateToButton,
        navigateToEdge,
      }),
      [
        fsmState,
        toggleItem,
        selectionMode,
        flush,
        registerButtonRef,
        navigateToButton,
        navigateToEdge,
      ]
    );

    // Compute classes
    const accordionClasses = useMemo(
      () => cn('accordion', flush && 'accordion-flush', className),
      [flush, className]
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={id}
          className={accordionClasses}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

AccordionRoot.displayName = 'Accordion';

// =============================================================================
// Accordion.Item Component
// =============================================================================

/**
 * Accordion.Item Component
 *
 * Container for a single accordion section including button and panel.
 *
 * @example
 * ```tsx
 * <Accordion.Item eventKey="0">
 *   <Accordion.Button>Section Title</Accordion.Button>
 *   <Accordion.Panel>Section Content</Accordion.Panel>
 * </Accordion.Item>
 * ```
 */
const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      children,
      eventKey,
      disabled = false,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { activeKeys } = useAccordionContext();
    const generatedId = useId();
    const itemId = id ?? `accordion-item-${generatedId}`;
    const buttonId = `${itemId}-button`;
    const panelId = `${itemId}-panel`;

    const isExpanded = activeKeys.includes(eventKey);
    const visualState = isExpanded ? 'expanded' : 'collapsed';

    // Memoize context value
    const itemContextValue = useMemo<AccordionItemContextValue>(
      () => ({
        eventKey,
        isExpanded,
        disabled,
        buttonId,
        panelId,
      }),
      [eventKey, isExpanded, disabled, buttonId, panelId]
    );

    // Compute classes
    const itemClasses = useMemo(() => cn('accordion-item', className), [className]);

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <div
          ref={ref}
          id={itemId}
          className={itemClasses}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
          data-visual-state={visualState}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = 'Accordion.Item';

// =============================================================================
// Accordion.Button Component
// =============================================================================

/**
 * Accordion.Button Component
 *
 * The clickable button that triggers expand/collapse.
 * Renders as a semantic `<button>` element with proper ARIA attributes.
 *
 * @example
 * ```tsx
 * <Accordion.Button>Section Title</Accordion.Button>
 * ```
 */
const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>(
  (
    {
      children,
      onClick,
      onKeyDown,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { toggleItem, registerButtonRef, navigateToButton, navigateToEdge } =
      useAccordionContext();
    const { eventKey, isExpanded, disabled, buttonId, panelId } = useAccordionItemContext();

    // Internal ref for arrow-key navigation
    const internalRef = useRef<HTMLButtonElement>(null);

    // Stable merged ref: combines forwarded ref, internal ref, and registration callback
    const combinedRef = useMemo(
      () =>
        mergeRefs([
          ref,
          internalRef,
          (node: HTMLButtonElement | null) => registerButtonRef(eventKey, node),
        ]),
      [ref, eventKey, registerButtonRef]
    );

    // Handle click
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          return;
        }
        toggleItem(eventKey);
        onClick?.(event);
      },
      [disabled, toggleItem, eventKey, onClick]
    );

    // Handle keyboard
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) {
          return;
        }

        // Arrow-key navigation between accordion buttons
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            navigateToButton(eventKey, 'next');
            break;
          case 'ArrowUp':
            event.preventDefault();
            navigateToButton(eventKey, 'prev');
            break;
          case 'Home':
            event.preventDefault();
            navigateToEdge('first');
            break;
          case 'End':
            event.preventDefault();
            navigateToEdge('last');
            break;
        }

        // Enter and Space are handled natively by button
        onKeyDown?.(event);
      },
      [disabled, onKeyDown, navigateToButton, navigateToEdge, eventKey]
    );

    // Compute classes
    const buttonClasses = useMemo(
      () => cn('accordion-button', !isExpanded && 'collapsed', className),
      [isExpanded, className]
    );

    return (
      <button
        ref={combinedRef}
        type="button"
        id={id ?? buttonId}
        className={buttonClasses}
        style={style}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </button>
    );
  }
);

AccordionButton.displayName = 'Accordion.Button';

// =============================================================================
// Accordion.Panel Component
// =============================================================================

/**
 * Accordion.Panel Component
 *
 * The collapsible content panel of an accordion item.
 * Uses CSS transitions for smooth expand/collapse animations.
 *
 * @example
 * ```tsx
 * <Accordion.Panel>
 *   <p>This content will be shown when expanded.</p>
 * </Accordion.Panel>
 * ```
 */
const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    const { isExpanded, buttonId, panelId } = useAccordionItemContext();

    // Compute collapse classes based on current expansion state
    // Bootstrap CSS handles the collapse animation
    const collapseClasses = useMemo(
      () => cn('accordion-collapse', 'collapse', isExpanded && 'show', className),
      [isExpanded, className]
    );

    return (
      <section
        ref={ref}
        id={id ?? panelId}
        className={collapseClasses}
        style={style}
        aria-labelledby={buttonId}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        <div className="accordion-body">{children}</div>
      </section>
    );
  }
);

AccordionPanel.displayName = 'Accordion.Panel';

// =============================================================================
// Accordion.Header Component
// =============================================================================

/**
 * Accordion.Header Component
 *
 * An optional heading wrapper for Accordion.Button that provides
 * proper semantic heading structure per WAI-ARIA Accordion Pattern.
 *
 * @example
 * ```tsx
 * <Accordion.Item eventKey="0">
 *   <Accordion.Header as="h3">
 *     <Accordion.Button>Section Title</Accordion.Button>
 *   </Accordion.Header>
 *   <Accordion.Panel>Content</Accordion.Panel>
 * </Accordion.Item>
 * ```
 */
const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  (
    {
      children,
      as: Component = 'h2',
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const headerClasses = useMemo(() => cn('accordion-header', className), [className]);

    return (
      <Component
        ref={ref}
        id={id}
        className={headerClasses}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </Component>
    );
  }
);

AccordionHeader.displayName = 'Accordion.Header';

// =============================================================================
// Compound Component Export
// =============================================================================

/**
 * Accordion compound component with subcomponents
 */
export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Button: AccordionButton,
  Panel: AccordionPanel,
});

export type { AccordionFSMEvent, AccordionFSMState } from './Accordion.fsm';

// Re-export FSM utilities
export {
  accordionFSMReducer,
  createInitialAccordionFSMState,
  getAccordionItemVisualState,
  getActiveKeysArray,
  isItemExpanded,
} from './Accordion.fsm';
// Re-export types
export type {
  AccordionButtonProps,
  AccordionContextValue,
  AccordionHeaderProps,
  AccordionItemContextValue,
  AccordionItemProps,
  AccordionItemVisualState,
  AccordionPanelProps,
  AccordionProps,
  AccordionSelectionMode,
} from './Accordion.types';
