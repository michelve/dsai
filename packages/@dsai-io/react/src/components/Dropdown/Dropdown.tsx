import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import {
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
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useControllableState } from '../../hooks';
import { cn } from '../../utils';
import { mapPlacement } from '../../utils/misc';
import { isValidHref } from '../../utils/validation';

import {
  createInitialDropdownFSMState,
  dropdownFSMReducer,
  getDropdownVisualState,
} from './Dropdown.fsm';

import './Dropdown.css';

import type {
  DropdownCheckboxItemProps,
  DropdownContextValue,
  DropdownDividerProps,
  DropdownGroupProps,
  DropdownHeaderProps,
  DropdownItemProps,
  DropdownItemTextProps,
  DropdownMenuProps,
  DropdownProps,
  DropdownRadioGroupContextValue,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownShortcutProps,
  DropdownToggleProps,
} from './Dropdown.types';
import type { FloatingContext } from '@floating-ui/react';
import type { ReactNode } from 'react';

/** CSS class applied to dropdown menu items */
const DROPDOWN_ITEM_CLASS = 'dropdown-item';

/**
 * Dropdown context for sharing state between components
 */
const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * Hook to access dropdown context
 */
function useDropdownContext(): DropdownContextValue {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown component');
  }
  return context;
}

/**
 * RadioGroup context for sharing selection state between radio items
 */
const DropdownRadioGroupContext = createContext<DropdownRadioGroupContextValue | null>(null);

function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node).trim();
  }

  if (Array.isArray(node)) {
    return node
      .map((child) => extractTextContent(child))
      .filter(Boolean)
      .join(' ')
      .trim();
  }

  if (isValidElement(node)) {
    const elementProps = node.props as Record<string, unknown> & {
      children?: ReactNode;
      title?: string;
      'aria-label'?: string;
    };
    const ariaLabel =
      typeof elementProps['aria-label'] === 'string' ? elementProps['aria-label'].trim() : '';
    const title = typeof elementProps.title === 'string' ? elementProps.title.trim() : '';

    if (ariaLabel) {
      return ariaLabel;
    }

    if (title) {
      return title;
    }

    return extractTextContent(elementProps.children);
  }

  return '';
}

/**
 * Check indicator SVG for CheckboxItem
 */
function CheckIndicator(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.485 2.929a1 1 0 0 1 0 1.414l-7.07 7.071a1 1 0 0 1-1.415 0L2.515 8.929a1 1 0 1 1 1.414-1.414L5.707 9.293l6.364-6.364a1 1 0 0 1 1.414 0z" />
    </svg>
  );
}

/**
 * Radio indicator SVG for RadioItem
 */
function RadioIndicator(): React.JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="4" />
    </svg>
  );
}

/**
 * Map DSAi placement to Floating UI placement
 */

/**
 * Dropdown Component
 *
 * A fully accessible dropdown menu component with FSM-driven state management,
 * Floating UI positioning, and keyboard navigation.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - aria-haspopup on trigger
 * - aria-expanded state management
 * - Arrow key navigation within menu
 * - Type-ahead search
 * - ESC to close
 * - Focus trap while open
 *
 * SECURITY FEATURES:
 * - Prop whitelisting
 * - Safe href validation
 * - No unrestricted prop spreading
 *
 * @example
 * ```tsx
 * <Dropdown>
 *   <Dropdown.Toggle>Options</Dropdown.Toggle>
 *   <Dropdown.Menu>
 *     <Dropdown.Item onClick={handleAction}>Action</Dropdown.Item>
 *     <Dropdown.Divider />
 *     <Dropdown.Item href="/settings">Settings</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 * ```
 */
const DropdownRoot = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      children,
      isOpen: controlledIsOpen,
      onOpenChange,
      defaultOpen = false,
      placement = 'bottom-start',
      autoClose = true,
      offset: offsetValue = [0, 2],
      disabled = false,
      loop = true,
      onOpened,
      onClosed,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Determine if controlled
    const isControlled = controlledIsOpen !== undefined;

    // Generate IDs for accessibility
    const generatedId = useId();
    const toggleId = `dropdown-toggle-${id ?? generatedId}`;
    const menuId = `dropdown-menu-${id ?? generatedId}`;

    // FSM for state management
    const [fsmState, dispatch] = useReducer(
      dropdownFSMReducer,
      isControlled ? controlledIsOpen : defaultOpen,
      createInitialDropdownFSMState
    );

    // For animated transitions
    const [animatedShowClass, setAnimatedShowClass] = useState(
      () => (isControlled ? controlledIsOpen : defaultOpen) === true
    );

    // List navigation state
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const listRef = useRef<(HTMLElement | null)[]>([]);
    const listContentRef = useRef<(string | null)[]>([]);

    // Compute isOpen from FSM
    const isOpen = fsmState.visibility === 'open' || fsmState.visibility === 'opening';

    // Floating UI setup
    const { refs, floatingStyles, context } = useFloating({
      open: fsmState.shouldRender,
      onOpenChange: (open) => {
        if (disabled) {
          return;
        }
        if (open) {
          dispatch({ type: 'OPEN' });
          // Always call onOpenChange callback if provided
          onOpenChange?.(true);
        } else {
          dispatch({ type: 'CLOSE' });
          // Always call onOpenChange callback if provided
          onOpenChange?.(false);
        }
      },
      placement: mapPlacement(placement),
      middleware: [
        offset({ mainAxis: offsetValue[1], crossAxis: offsetValue[0] }),
        flip({ fallbackAxisSideDirection: 'end' }),
        shift({ padding: 5 }),
      ],
      whileElementsMounted: autoUpdate,
    });

    // Interaction hooks
    const click = useClick(context, {
      enabled: !disabled && !isControlled,
      toggle: true,
    });

    const dismiss = useDismiss(context, {
      enabled: autoClose !== false,
      // Disable outsidePress in controlled mode to prevent race condition
      // with external toggle buttons. ESC key still works and calls onOpenChange.
      outsidePress: !isControlled && (autoClose === true || autoClose === 'outside'),
      escapeKey: true,
    });

    const role = useRole(context, { role: 'menu' });

    const listNavigation = useListNavigation(context, {
      listRef,
      activeIndex,
      onNavigate: setActiveIndex,
      loop,
    });

    const typeahead = useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: setActiveIndex,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
      click,
      dismiss,
      role,
      listNavigation,
      typeahead,
    ]);

    // Sync controlled state with FSM
    useEffect(() => {
      if (!isControlled) {
        return;
      }

      if (controlledIsOpen && fsmState.visibility === 'closed') {
        dispatch({ type: 'OPEN' });
      } else if (
        !controlledIsOpen &&
        (fsmState.visibility === 'open' || fsmState.visibility === 'opening')
      ) {
        dispatch({ type: 'CLOSE' });
      }
    }, [isControlled, controlledIsOpen, fsmState.visibility]);

    // Handle animation transitions - dropdowns have minimal/no animations
    // so we dispatch ANIMATION_END immediately to complete the state transition
    useEffect(() => {
      if (fsmState.visibility === 'opening') {
        // Use rAF to allow the DOM to render first, then complete the transition
        const frameId = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_END' });
        });
        return () => cancelAnimationFrame(frameId);
      }

      if (fsmState.visibility === 'closing') {
        // Use rAF to allow closing animations if any
        const frameId = requestAnimationFrame(() => {
          dispatch({ type: 'ANIMATION_END' });
        });
        return () => cancelAnimationFrame(frameId);
      }

      return undefined;
    }, [fsmState.visibility]);

    // Handle animation class for CSS transitions
    useEffect(() => {
      if (fsmState.visibility === 'opening' && !animatedShowClass) {
        // Use rAF for smooth animation trigger
        let innerFrameId: number | undefined;
        const frameId = requestAnimationFrame(() => {
          innerFrameId = requestAnimationFrame(() => {
            setAnimatedShowClass(true);
          });
        });
        return () => {
          cancelAnimationFrame(frameId);
          if (innerFrameId !== undefined) {
            cancelAnimationFrame(innerFrameId);
          }
        };
      }

      if (fsmState.visibility === 'closed' && animatedShowClass) {
        const timeoutId = setTimeout(() => {
          setAnimatedShowClass(false);
        }, 0);
        return () => clearTimeout(timeoutId);
      }

      return undefined;
    }, [fsmState.visibility, animatedShowClass]);

    // Track mount state to prevent onClosed firing on initial render
    const hasMountedRef = useRef(false);

    // Handle callbacks
    useEffect(() => {
      if (fsmState.visibility === 'open' && onOpened) {
        onOpened();
      }
    }, [fsmState.visibility, onOpened]);

    useEffect(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }
      if (fsmState.visibility === 'closed' && onClosed) {
        onClosed();
      }
    }, [fsmState.visibility, onClosed]);

    // Context actions
    const toggle = (): void => {
      if (disabled) {
        return;
      }
      dispatch({ type: 'TOGGLE' });
      if (isControlled && onOpenChange) {
        onOpenChange(!isOpen);
      }
    };

    const open = (): void => {
      if (disabled) {
        return;
      }
      dispatch({ type: 'OPEN' });
      if (isControlled && onOpenChange) {
        onOpenChange(true);
      }
    };

    const close = (): void => {
      dispatch({ type: 'CLOSE' });
      if (isControlled && onOpenChange) {
        onOpenChange(false);
      }
    };

    // Context value - React Compiler handles memoization
    const contextValue: DropdownContextValue = {
      isOpen,
      toggle,
      open,
      close,
      disabled,
      placement,
      autoClose,
      toggleId,
      menuId,
      activeIndex,
      setActiveIndex,
      listRef,
      getItemProps,
      refs: {
        setReference: refs.setReference,
        setFloating: refs.setFloating,
      },
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
      floatingContext: context as FloatingContext,
    };

    // Compute direction class for Bootstrap
    const directionClass = useMemo(() => {
      if (placement.startsWith('top')) {
        return 'dropup';
      }
      if (placement.startsWith('left')) {
        return 'dropstart';
      }
      if (placement.startsWith('right')) {
        return 'dropend';
      }
      if (placement === 'bottom' || placement === 'bottom-end') {
        return 'dropdown';
      }
      return 'dropdown';
    }, [placement]);

    const containerClassName = useMemo(
      () => cn('btn-group', directionClass, className),
      [directionClass, className]
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <FloatingList elementsRef={listRef} labelsRef={listContentRef}>
          <div
            ref={ref}
            className={containerClassName}
            style={style}
            id={id}
            data-testid={dataTestId}
            data-test={dataTest}
            data-visual-state={getDropdownVisualState(fsmState)}
          >
            {children}
          </div>
        </FloatingList>
      </DropdownContext.Provider>
    );
  }
);

DropdownRoot.displayName = 'Dropdown';

/**
 * Dropdown.Toggle Component
 *
 * The trigger button that opens/closes the dropdown menu.
 */
const DropdownToggle = forwardRef<HTMLButtonElement, DropdownToggleProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      split = false,
      caret = true,
      disabled: toggleDisabled = false,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const {
      isOpen,
      disabled: contextDisabled,
      toggleId,
      menuId,
      refs,
      getReferenceProps,
    } = useDropdownContext();

    const isDisabled = toggleDisabled || contextDisabled;
    const derivedLabel = useMemo(() => extractTextContent(children), [children]);
    const computedAriaLabel = useMemo(() => {
      const normalizedAriaLabel = ariaLabel?.trim();
      if (normalizedAriaLabel) {
        return normalizedAriaLabel;
      }
      if (derivedLabel) {
        return derivedLabel;
      }
      return 'Toggle Dropdown';
    }, [ariaLabel, derivedLabel]);

    // Development warning for split toggles without explicit aria-label
    useEffect(() => {
      if (
        typeof process !== 'undefined' &&
        process.env?.['NODE_ENV'] !== 'production' &&
        split &&
        !ariaLabel
      ) {
        console.warn(
          'Dropdown.Toggle: Split toggles should have an explicit aria-label for accessibility. ' +
            'Falling back to "Toggle Dropdown".'
        );
      }
    }, [split, ariaLabel]);

    // Compute Bootstrap button classes
    const buttonClassName = useMemo(
      () =>
        cn(
          'btn',
          `btn-${variant}`,
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          caret && 'dropdown-toggle',
          split && 'dropdown-toggle-split',
          className
        ),
      [variant, size, caret, split, className]
    );

    const mergedRef = useMergeRefs([ref, refs.setReference]);

    return (
      <button
        ref={mergedRef}
        type="button"
        {...getReferenceProps()}
        id={id ?? toggleId}
        className={buttonClassName}
        style={style}
        disabled={isDisabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={computedAriaLabel}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {split ? <span className="visually-hidden">{computedAriaLabel}</span> : children}
      </button>
    );
  }
);

DropdownToggle.displayName = 'Dropdown.Toggle';

/**
 * Dropdown.Menu Component
 *
 * The container for dropdown items, rendered in a portal.
 */
const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  (
    {
      children,
      align = 'start',
      portal = true,
      container = typeof document === 'undefined' ? null : document.body,
      maxHeight,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { isOpen, menuId, toggleId, refs, floatingStyles, getFloatingProps, floatingContext } =
      useDropdownContext();

    // Compute menu classes
    const menuClassName = useMemo(
      () =>
        cn('dropdown-menu', isOpen && 'show', align === 'end' && 'dropdown-menu-end', className),
      [isOpen, align, className]
    );

    const mergedRef = useMergeRefs([ref, refs.setFloating]);

    // Combine floating styles with user styles and maxHeight
    const combinedStyle = useMemo(
      () => ({
        ...floatingStyles,
        ...(maxHeight === undefined
          ? {}
          : {
              maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
              overflowY: 'auto' as const,
            }),
        ...style,
      }),
      [floatingStyles, maxHeight, style]
    );

    if (!isOpen) {
      return null;
    }

    const menuContent = (
      <FloatingFocusManager
        context={floatingContext}
        modal={false}
        // @ts-expect-error floating-ui typings may not include inert yet
        inert={false}
      >
        <ul
          ref={mergedRef}
          id={id ?? menuId}
          className={menuClassName}
          style={combinedStyle}
          aria-labelledby={toggleId}
          data-testid={dataTestId}
          data-test={dataTest}
          {...getFloatingProps()}
        >
          {children}
        </ul>
      </FloatingFocusManager>
    );

    if (portal && container) {
      return createPortal(menuContent, container);
    }

    return menuContent;
  }
);

DropdownMenu.displayName = 'Dropdown.Menu';

/**
 * Render dropdown item content with optional start/end icons.
 */
function renderDropdownItemContent(
  children: React.ReactNode,
  startIcon: React.ReactNode | undefined,
  endIcon: React.ReactNode | undefined
): React.JSX.Element {
  return (
    <>
      {startIcon && (
        <span className="dropdown-item-icon me-2" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className="dropdown-item-icon ms-2" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </>
  );
}

/**
 * Dropdown.Item Component
 *
 * A clickable item within the dropdown menu.
 */
const DropdownItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, DropdownItemProps>(
  (
    {
      children,
      onClick,
      onKeyDown,
      onSelect,
      href,
      target,
      rel,
      active = false,
      disabled = false,
      startIcon,
      endIcon,
      as,
      closeOnSelect,
      variant = 'default',
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { close, autoClose, getItemProps, activeIndex } = useDropdownContext();
    const { ref: itemRef, index } = useListItem();

    // Validate href for security
    const safeHref = isValidHref(href) ? href : undefined;

    // Determine element type
    const ElementType = as ?? (safeHref ? 'a' : 'button');

    // Compute item classes
    const itemClassName = useMemo(
      () =>
        cn(
          DROPDOWN_ITEM_CLASS,
          active && 'active',
          disabled && 'disabled',
          variant === 'destructive' && 'text-danger',
          className
        ),
      [active, disabled, variant, className]
    );

    // Determine if the dropdown should close after a click
    const shouldCloseAfterClick = useCallback((): boolean => {
      if (closeOnSelect !== undefined) {
        return closeOnSelect;
      }
      return autoClose === true || autoClose === 'inside';
    }, [closeOnSelect, autoClose]);

    // Handle click
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        onClick?.(event);

        // Fire onSelect and check if default was prevented
        if (onSelect) {
          const selectEvent = new Event('select', { cancelable: true });
          onSelect(selectEvent);
          if (selectEvent.defaultPrevented) {
            return;
          }
        }

        if (shouldCloseAfterClick()) {
          close();
        }
      },
      [disabled, onClick, onSelect, shouldCloseAfterClick, close]
    );

    // Compute rel for links
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

    const mergedRef = useMergeRefs([ref, itemRef]);

    const itemProps = getItemProps({
      onClick: handleClick,
      onKeyDown,
    });

    const isActive = index === activeIndex;

    const itemContent = renderDropdownItemContent(children, startIcon, endIcon);

    if (ElementType === 'a') {
      return (
        <li role="none">
          <a
            ref={mergedRef as React.Ref<HTMLAnchorElement>}
            id={id}
            className={itemClassName}
            style={style}
            href={safeHref}
            target={target}
            rel={computedRel}
            role="menuitem"
            aria-disabled={disabled}
            aria-current={active ? 'true' : undefined}
            tabIndex={isActive ? 0 : -1}
            data-testid={dataTestId}
            data-test={dataTest}
            {...itemProps}
          >
            {itemContent}
          </a>
        </li>
      );
    }

    return (
      <li role="none">
        <button
          ref={mergedRef as React.Ref<HTMLButtonElement>}
          type="button"
          id={id}
          className={itemClassName}
          style={style}
          disabled={disabled}
          role="menuitem"
          aria-disabled={disabled}
          aria-current={active ? 'true' : undefined}
          tabIndex={isActive ? 0 : -1}
          data-testid={dataTestId}
          data-test={dataTest}
          {...itemProps}
        >
          {itemContent}
        </button>
      </li>
    );
  }
);

DropdownItem.displayName = 'Dropdown.Item';

/**
 * Dropdown.CheckboxItem Component
 *
 * A menu item that acts as a checkbox with menuitemcheckbox role.
 */
const DropdownCheckboxItem = forwardRef<HTMLButtonElement, DropdownCheckboxItemProps>(
  (
    {
      children,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      onSelect,
      closeOnSelect = false,
      disabled = false,
      startIcon,
      endIcon,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { close, autoClose, getItemProps, activeIndex } = useDropdownContext();
    const { ref: itemRef, index } = useListItem();

    const [checked, setChecked] = useControllableState({
      value: controlledChecked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const itemClassName = useMemo(
      () => cn(DROPDOWN_ITEM_CLASS, disabled && 'disabled', className),
      [disabled, className]
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        const newChecked = !checked;
        setChecked(newChecked);

        let defaultPrevented = false;
        if (onSelect) {
          const selectEvent = new Event('select', { cancelable: true });
          onSelect(selectEvent);
          defaultPrevented = selectEvent.defaultPrevented;
        }

        if (
          !defaultPrevented &&
          (closeOnSelect ||
            (closeOnSelect === undefined && (autoClose === true || autoClose === 'inside')))
        ) {
          close();
        }
      },
      [disabled, checked, setChecked, onSelect, closeOnSelect, autoClose, close]
    );

    const mergedRef = useMergeRefs([ref, itemRef]);
    const itemProps = getItemProps({ onClick: handleClick });
    const isActive = index === activeIndex;

    return (
      <li role="none">
        <button
          ref={mergedRef}
          type="button"
          id={id}
          className={itemClassName}
          style={style}
          disabled={disabled}
          role="menuitemcheckbox"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={isActive ? 0 : -1}
          data-testid={dataTestId}
          data-test={dataTest}
          {...itemProps}
        >
          <span className="dropdown-item-indicator me-2">{checked && <CheckIndicator />}</span>
          {startIcon && (
            <span className="dropdown-item-icon me-2" aria-hidden="true">
              {startIcon}
            </span>
          )}
          {children}
          {endIcon && (
            <span className="dropdown-item-icon ms-2" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </button>
      </li>
    );
  }
);

DropdownCheckboxItem.displayName = 'Dropdown.CheckboxItem';

/**
 * Dropdown.RadioGroup Component
 *
 * Groups radio items and manages single-selection state.
 */
const DropdownRadioGroup = forwardRef<HTMLDivElement, DropdownRadioGroupProps>(
  (
    {
      children,
      value: controlledValue,
      defaultValue,
      onValueChange,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const [value, setValue] = useControllableState({
      value: controlledValue,
      defaultValue,
      onChange: onValueChange,
    });

    const contextValue = useMemo(() => ({ value, onValueChange: setValue }), [value, setValue]);

    return (
      <DropdownRadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          id={id}
          className={className || undefined}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </div>
      </DropdownRadioGroupContext.Provider>
    );
  }
);

DropdownRadioGroup.displayName = 'Dropdown.RadioGroup';

/**
 * Dropdown.RadioItem Component
 *
 * A menu item that acts as a radio button within a RadioGroup.
 */
const DropdownRadioItem = forwardRef<HTMLButtonElement, DropdownRadioItemProps>(
  (
    {
      children,
      value,
      onSelect,
      closeOnSelect = true,
      disabled = false,
      startIcon,
      endIcon,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const { close, autoClose, getItemProps, activeIndex } = useDropdownContext();
    const radioGroupContext = useContext(DropdownRadioGroupContext);
    const { ref: itemRef, index } = useListItem();

    if (!radioGroupContext) {
      throw new Error('Dropdown.RadioItem must be used within a Dropdown.RadioGroup');
    }

    const checked = radioGroupContext.value === value;

    const itemClassName = useMemo(
      () => cn(DROPDOWN_ITEM_CLASS, disabled && 'disabled', className),
      [disabled, className]
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }

        radioGroupContext.onValueChange(value);

        let defaultPrevented = false;
        if (onSelect) {
          const selectEvent = new Event('select', { cancelable: true });
          onSelect(selectEvent);
          defaultPrevented = selectEvent.defaultPrevented;
        }

        if (!defaultPrevented) {
          if (closeOnSelect !== undefined) {
            if (closeOnSelect) {
              close();
            }
          } else if (autoClose === true || autoClose === 'inside') {
            close();
          }
        }
      },
      [disabled, value, radioGroupContext, onSelect, closeOnSelect, autoClose, close]
    );

    const mergedRef = useMergeRefs([ref, itemRef]);
    const itemProps = getItemProps({ onClick: handleClick });
    const isActive = index === activeIndex;

    return (
      <li role="none">
        <button
          ref={mergedRef}
          type="button"
          id={id}
          className={itemClassName}
          style={style}
          disabled={disabled}
          role="menuitemradio"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={isActive ? 0 : -1}
          data-testid={dataTestId}
          data-test={dataTest}
          {...itemProps}
        >
          <span className="dropdown-item-indicator me-2">{checked && <RadioIndicator />}</span>
          {startIcon && (
            <span className="dropdown-item-icon me-2" aria-hidden="true">
              {startIcon}
            </span>
          )}
          {children}
          {endIcon && (
            <span className="dropdown-item-icon ms-2" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </button>
      </li>
    );
  }
);

DropdownRadioItem.displayName = 'Dropdown.RadioItem';

/**
 * Dropdown.Group Component
 *
 * Semantic grouping wrapper for related menu items.
 */
const DropdownGroup = forwardRef<HTMLLIElement, DropdownGroupProps>(
  (
    {
      children,
      label,
      className = '',
      style,
      id,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    const labelId = useId();

    // Render as a semantic group using role="group" on a list item.
    // Children are rendered inside a nested <ul> to maintain valid HTML nesting.
    return (
      <li
        ref={ref}
        role="none"
        id={id}
        className={className || undefined}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {label && (
          <span id={labelId} className="dropdown-header">
            {label}
          </span>
        )}
        <ul
          role="group"
          aria-labelledby={label ? labelId : undefined}
          style={{ listStyle: 'none', padding: 0, margin: 0 }}
        >
          {children}
        </ul>
      </li>
    );
  }
);

DropdownGroup.displayName = 'Dropdown.Group';

/**
 * Dropdown.Shortcut Component
 *
 * Displays a keyboard shortcut hint aligned to the right of a menu item.
 * Purely visual — does not register any actual keyboard shortcuts.
 */
const DropdownShortcut = forwardRef<HTMLSpanElement, DropdownShortcutProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    const shortcutClassName = useMemo(
      () => cn('dropdown-item-shortcut', 'ms-auto', 'text-body-tertiary', className),
      [className]
    );

    return (
      <span
        ref={ref}
        id={id}
        className={shortcutClassName}
        style={style}
        aria-hidden="true"
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </span>
    );
  }
);

DropdownShortcut.displayName = 'Dropdown.Shortcut';

/**
 * Dropdown.Divider Component
 *
 * A horizontal separator between groups of items.
 */
const DropdownDivider = forwardRef<HTMLHRElement, DropdownDividerProps>(
  ({ className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest }, ref) => {
    const dividerClassName = useMemo(() => cn('dropdown-divider', className), [className]);

    return (
      <li role="none">
        <hr
          ref={ref}
          id={id}
          className={dividerClassName}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
        />
      </li>
    );
  }
);

DropdownDivider.displayName = 'Dropdown.Divider';

/**
 * Dropdown.Header Component
 *
 * A non-interactive header to label sections within the menu.
 */
const DropdownHeader = forwardRef<HTMLSpanElement, DropdownHeaderProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    const headerClassName = useMemo(() => cn('dropdown-header', className), [className]);

    return (
      <li role="none">
        <span
          ref={ref}
          id={id}
          className={headerClassName}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </span>
      </li>
    );
  }
);

DropdownHeader.displayName = 'Dropdown.Header';

/**
 * Dropdown.ItemText Component
 *
 * Non-interactive text content within the menu.
 */
const DropdownItemText = forwardRef<HTMLSpanElement, DropdownItemTextProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    const textClassName = useMemo(() => cn('dropdown-item-text', className), [className]);

    return (
      <li role="none">
        <span
          ref={ref}
          id={id}
          className={textClassName}
          style={style}
          data-testid={dataTestId}
          data-test={dataTest}
        >
          {children}
        </span>
      </li>
    );
  }
);

DropdownItemText.displayName = 'Dropdown.ItemText';

/**
 * Dropdown component with subcomponents attached
 */
export const Dropdown = Object.assign(DropdownRoot, {
  Toggle: DropdownToggle,
  Menu: DropdownMenu,
  Item: DropdownItem,
  CheckboxItem: DropdownCheckboxItem,
  RadioGroup: DropdownRadioGroup,
  RadioItem: DropdownRadioItem,
  Group: DropdownGroup,
  Shortcut: DropdownShortcut,
  Divider: DropdownDivider,
  Header: DropdownHeader,
  ItemText: DropdownItemText,
});

export type {
  DropdownAutoClose,
  DropdownCheckboxItemProps,
  DropdownContextValue,
  DropdownDividerProps,
  DropdownGroupProps,
  DropdownHeaderProps,
  DropdownItemProps,
  DropdownItemTextProps,
  DropdownMenuProps,
  DropdownPlacement,
  DropdownProps,
  DropdownRadioGroupContextValue,
  DropdownRadioGroupProps,
  DropdownRadioItemProps,
  DropdownShortcutProps,
  DropdownToggleProps,
} from './Dropdown.types';
