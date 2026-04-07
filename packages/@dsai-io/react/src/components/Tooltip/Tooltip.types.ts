import type { SafeHTMLAttributes } from '../../types';
import type { ReactElement, ReactNode } from 'react';

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
   * @default 300
   */
  showDelay?: number;

  /**
   * Delay in milliseconds before hiding the tooltip.
   * @default 150
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

  /**
   * When true, tooltip acts as accessible description (aria-describedby).
   * When false, tooltip acts as accessible label (aria-labelledby).
   * Use false for icon-only buttons where the tooltip IS the label.
   * @default true
   */
  describeChild?: boolean;

  /**
   * Track cursor movement.
   * - true: both axes
   * - 'x': horizontal only (timelines, sliders)
   * - 'y': vertical only (data tables)
   * - false: anchored to trigger (default)
   *
   * Arrow is auto-disabled when followCursor is active.
   * @default false
   */
  followCursor?: boolean | 'x' | 'y';

  /**
   * Enable tooltip on touch devices via long-press (700ms).
   * Auto-hides after 1500ms. When false, touch interactions are suppressed.
   * @default false
   */
  touchEnabled?: boolean;
}

/**
 * Props for TooltipProvider — sets global defaults for all descendant Tooltips.
 *
 * Resolution order: instance prop > TooltipProvider > built-in defaults.
 */
export interface TooltipProviderProps {
  children: ReactNode;
  /** Default show delay in ms. @default 300 */
  showDelay?: number;
  /** Default hide delay in ms. @default 150 */
  hideDelay?: number;
  /** Default skip delay for tooltip groups in ms. @default 300 */
  skipDelay?: number;
  /** Default arrow visibility. @default true */
  arrow?: boolean;
  /** Default touch behavior. @default false */
  touchEnabled?: boolean;
  /** Default describeChild behavior. @default true */
  describeChild?: boolean;
}

/**
 * Props for TooltipGroup — coordinates delay timing across sibling tooltips.
 * When one tooltip closes, others in the group open instantly during the skip window.
 */
export interface TooltipGroupProps {
  children: ReactNode;
  /** Time window (ms) after close during which next tooltip opens instantly.
   *  @default inherits from TooltipProvider (300ms) */
  skipDelay?: number;
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

type TooltipVisibility = 'closed' | 'opening' | 'open' | 'closing';

/**
 * Internal FSM state for tooltip visibility
 */
export interface TooltipFSMState {
  /** Current visibility state */
  visibility: TooltipVisibility;
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
