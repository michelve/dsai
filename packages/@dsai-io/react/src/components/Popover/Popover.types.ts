import type { SafeHTMLAttributes } from '../../types';
import type { ReactElement, ReactNode } from 'react';

/**
 * Popover placement options
 * Maps to Floating UI placement values
 */
export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Popover trigger types
 */
export type PopoverTrigger = 'click' | 'hover' | 'focus';

/**
 * Safe HTML attributes that can be spread onto popover elements
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 * @see {@link SafeHTMLAttributes}
 */
export type SafePopoverHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * PopoverHeader component props
 *
 * @example
 * ```tsx
 * <PopoverHeader>Settings</PopoverHeader>
 * ```
 */
export interface PopoverHeaderProps extends SafePopoverHTMLAttributes {
  /**
   * Header content
   */
  children: ReactNode;
}

/**
 * PopoverBody component props
 *
 * @example
 * ```tsx
 * <PopoverBody>
 *   <p>Popover content goes here</p>
 * </PopoverBody>
 * ```
 */
export interface PopoverBodyProps extends SafePopoverHTMLAttributes {
  /**
   * Body content
   */
  children: ReactNode;
}

/**
 * PopoverCloseButton component props
 *
 * @example
 * ```tsx
 * <PopoverCloseButton onClick={handleClose} />
 * ```
 */
export interface PopoverCloseButtonProps extends SafePopoverHTMLAttributes {
  /**
   * Click handler to close the popover
   */
  onClick: () => void;

  /**
   * Accessible label for the close button
   * @default 'Close'
   */
  'aria-label'?: string;
}

/**
 * Popover component props
 *
 * A fully accessible popover component that provides richer interactive content
 * compared to tooltips. Uses Floating UI for intelligent positioning.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="dialog" on the popover content
 * - aria-labelledby linking to popover header
 * - aria-haspopup="dialog" on trigger
 * - aria-expanded on trigger
 * - ESC key to dismiss
 * - Click outside to dismiss
 * - Optional focus trap for complex content
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic popover
 * <Popover
 *   header="Settings"
 *   content={<p>Configure your preferences here.</p>}
 * >
 *   <button>Open Settings</button>
 * </Popover>
 *
 * // Popover with custom placement
 * <Popover
 *   header="Help"
 *   content="Click here for more info"
 *   placement="right"
 * >
 *   <button>?</button>
 * </Popover>
 *
 * // Popover with close button
 * <Popover
 *   header="Notification"
 *   content="You have new messages"
 *   showCloseButton
 * >
 *   <button>Notifications</button>
 * </Popover>
 * ```
 */
export interface PopoverProps extends SafePopoverHTMLAttributes {
  /**
   * The element that triggers the popover.
   * Must be a single React element that accepts ref forwarding.
   */
  children: ReactElement;

  /**
   * Popover content to display in the body.
   * Can be text or any React node.
   */
  content: ReactNode;

  /**
   * Optional header content.
   * Provides the aria-labelledby target for accessibility.
   */
  header?: ReactNode;

  /**
   * Placement of the popover relative to the trigger element.
   * Uses Floating UI for positioning with auto-flip on viewport edges.
   * @default 'top'
   */
  placement?: PopoverPlacement;

  /**
   * How to trigger the popover visibility.
   * - 'click': Show/hide on click (default)
   * - 'hover': Show on mouse hover
   * - 'focus': Show on keyboard focus
   *
   * Note: Multiple triggers can be combined using an array.
   * @default 'click'
   */
  trigger?: PopoverTrigger | PopoverTrigger[];

  /**
   * Whether to show the close button in the header.
   * @default false
   */
  showCloseButton?: boolean;

  /**
   * Custom close button aria-label.
   * @default 'Close popover'
   */
  closeButtonLabel?: string;

  /**
   * Whether to show the arrow pointer.
   * @default true
   */
  arrow?: boolean;

  /**
   * Offset from the trigger element in pixels.
   * @default 8
   */
  offset?: number;

  /**
   * Maximum width of the popover content.
   * @default 276 (Bootstrap default)
   */
  maxWidth?: number | string;

  /**
   * Controlled open state.
   * If provided, popover becomes controlled.
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes.
   * Called when popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether the popover is disabled.
   * When disabled, the popover will not show.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to render the popover in a portal.
   * @default true
   */
  portal?: boolean;

  /**
   * Container element for the portal.
   * @default document.body
   */
  container?: HTMLElement | null;

  /**
   * Whether to trap focus within the popover when open.
   * Recommended for popovers with interactive content.
   * @default false
   */
  trapFocus?: boolean;

  /**
   * Delay in milliseconds before showing (for hover trigger).
   * @default 0
   */
  showDelay?: number;

  /**
   * Delay in milliseconds before hiding (for hover trigger).
   * @default 0
   */
  hideDelay?: number;

  /**
   * Whether clicking outside closes the popover.
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Whether pressing ESC closes the popover.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * ARIA label for the popover.
   * Used when header is not provided or is not a string.
   */
  'aria-label'?: string;
}

/**
 * Popover context value for sharing state between components
 */
export interface PopoverContextValue {
  /** Whether the popover is currently visible */
  isOpen: boolean;
  /** Open the popover */
  open: () => void;
  /** Close the popover */
  close: () => void;
  /** Toggle the popover */
  toggle: () => void;
  /** Whether the popover is disabled */
  disabled: boolean;
  /** Popover ID for aria attributes */
  popoverId: string;
  /** Header ID for aria-labelledby */
  headerId: string;
  /** Body ID for aria-describedby */
  bodyId: string;
  /** Current placement of the popover */
  placement: PopoverPlacement;
}

/**
 * Internal FSM state for popover visibility
 */
export interface PopoverFSMState {
  /** Current visibility state */
  visibility: 'closed' | 'opening' | 'open' | 'closing';
  /** Whether the popover should be rendered in DOM */
  shouldRender: boolean;
}

/**
 * FSM events for popover state transitions
 */
export type PopoverFSMEvent = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'ANIMATION_END' };

/**
 * Visual state for data attribute (for CSS styling and testing)
 */
export type PopoverVisualState = 'hidden' | 'showing' | 'visible' | 'hiding';
