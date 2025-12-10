import type { ReactElement, ReactNode } from 'react';
import type { SafeHTMLAttributes } from '../../types';

/**
 * Tooltip placement options
 * Maps to Floating UI placement values
 */
export type TooltipPlacement =
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
 * Tooltip trigger types
 */
export type TooltipTrigger = 'hover' | 'focus' | 'click';

/**
 * Safe HTML attributes that can be spread onto tooltip elements
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 * @see {@link SafeHTMLAttributes}
 */
export type SafeTooltipHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Tooltip component props
 *
 * A fully accessible tooltip component that provides contextual information
 * on hover, focus, or click. Uses Floating UI for intelligent positioning.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="tooltip" on the tooltip content
 * - aria-describedby linking trigger to tooltip
 * - Keyboard accessible (visible on focus)
 * - ESC key to dismiss (for click trigger)
 * - Proper focus management
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic tooltip
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * // Tooltip with custom placement
 * <Tooltip content="Right side tooltip" placement="right">
 *   <span>Target element</span>
 * </Tooltip>
 *
 * // Click-triggered tooltip
 * <Tooltip content="Click to dismiss" trigger="click">
 *   <button>Click me</button>
 * </Tooltip>
 *
 * // Tooltip with delay
 * <Tooltip content="Delayed tooltip" showDelay={500} hideDelay={200}>
 *   <button>Hover with delay</button>
 * </Tooltip>
 * ```
 */
export interface TooltipProps extends SafeTooltipHTMLAttributes {
  /**
   * The element that triggers the tooltip.
   * Must be a single React element that accepts ref forwarding.
   */
  children: ReactElement;

  /**
   * Tooltip content to display.
   * Can be text or any React node.
   */
  content: ReactNode;

  /**
   * Placement of the tooltip relative to the trigger element.
   * Uses Floating UI for positioning with auto-flip on viewport edges.
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * How to trigger the tooltip visibility.
   * - 'hover': Show on mouse hover (default)
   * - 'focus': Show on keyboard focus
   * - 'click': Show/hide on click
   *
   * Note: Multiple triggers can be combined using an array.
   * @default ['hover', 'focus']
   */
  trigger?: TooltipTrigger | TooltipTrigger[];

  /**
   * Delay in milliseconds before showing the tooltip.
   * @default 0
   */
  showDelay?: number;

  /**
   * Delay in milliseconds before hiding the tooltip.
   * @default 0
   */
  hideDelay?: number;

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
   * Maximum width of the tooltip content.
   * Use for long text that should wrap.
   * @default undefined (no max-width)
   */
  maxWidth?: number | string;

  /**
   * Controlled open state.
   * If provided, tooltip becomes controlled.
   */
  isOpen?: boolean;

  /**
   * Callback when open state changes.
   * Called when tooltip opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Default open state for uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether the tooltip is disabled.
   * When disabled, the tooltip will not show.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to render the tooltip in a portal.
   * @default true
   */
  portal?: boolean;

  /**
   * Container element for the portal.
   * @default document.body
   */
  container?: HTMLElement | null;

  /**
   * ARIA label for accessibility.
   * Used when content is complex (not a simple string).
   */
  'aria-label'?: string;
}

/**
 * Tooltip context value for sharing state between components
 */
export interface TooltipContextValue {
  /** Whether the tooltip is currently visible */
  isOpen: boolean;
  /** Open the tooltip */
  open: () => void;
  /** Close the tooltip */
  close: () => void;
  /** Toggle the tooltip */
  toggle: () => void;
  /** Whether the tooltip is disabled */
  disabled: boolean;
  /** Tooltip ID for aria-describedby */
  tooltipId: string;
  /** Current placement of the tooltip */
  placement: TooltipPlacement;
}

/**
 * Internal FSM state for tooltip visibility
 */
export interface TooltipFSMState {
  /** Current visibility state */
  visibility: 'closed' | 'opening' | 'open' | 'closing';
  /** Whether the tooltip should be rendered in DOM */
  shouldRender: boolean;
}

/**
 * FSM events for tooltip state transitions
 */
export type TooltipFSMEvent = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'ANIMATION_END' };

/**
 * Visual state for data attribute (for CSS styling and testing)
 */
export type TooltipVisualState = 'hidden' | 'showing' | 'visible' | 'hiding';
