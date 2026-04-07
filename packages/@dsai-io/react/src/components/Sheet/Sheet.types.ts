import type { ComponentSize, HeadingTag, SafeHTMLAttributes } from '../../types';
import type { ReactNode, RefObject } from 'react';

/**
 * Sheet placement variants
 * Determines which edge of the viewport the sheet slides in from
 */
export type SheetPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * Sheet size variants
 * Controls the width (for left/right) or height (for top/bottom) of the sheet
 * - sm: 320px (typical mobile nav width)
 * - md: 400px (standard sheet width)
 * - lg: 540px (wider content)
 * - xl: 720px (extra wide)
 * - full: 100% of viewport dimension
 * - auto: fit content
 */
export type SheetSize = ComponentSize | 'xl' | 'full' | 'auto';

/**
 * Sheet surface variants
 * Controls the visual appearance of the sheet
 */
export type SheetSurface = 'default' | 'elevated' | 'inverse' | 'transparent';

/**
 * Sheet mode variants
 * - modal: with backdrop, blocking (default)
 * - non-modal: no backdrop, non-blocking (can interact with background)
 */
export type SheetMode = 'modal' | 'non-modal';

/**
 * Whitelisted HTML attributes for safe prop spreading in Sheet component
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeSheetHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Sheet component props
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="dialog" for screen readers
 * - aria-modal="true" for blocking overlays
 * - aria-labelledby pointing to header
 * - aria-describedby pointing to body (optional)
 * - Focus trap within sheet
 * - ESC key to close
 * - Scroll lock when open (modal mode)
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic sheet
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Sheet.Header>Sheet Title</Sheet.Header>
 *   <Sheet.Body>Sheet content goes here.</Sheet.Body>
 *   <Sheet.Footer>
 *     <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="primary" onClick={handleSave}>
 *       Save
 *     </Button>
 *   </Sheet.Footer>
 * </Sheet>
 *
 * // Right-side sheet (drawer style)
 * <Sheet isOpen={isOpen} onClose={handleClose} placement="right" size="md">
 *   <Sheet.Header>Settings</Sheet.Header>
 *   <Sheet.Body>Settings content...</Sheet.Body>
 * </Sheet>
 *
 * // Bottom sheet (mobile style)
 * <Sheet isOpen={isOpen} onClose={handleClose} placement="bottom" size="auto">
 *   <Sheet.Header>Actions</Sheet.Header>
 *   <Sheet.Body>
 *     <ActionList />
 *   </Sheet.Body>
 * </Sheet>
 * ```
 */
export interface SheetProps extends SafeSheetHTMLAttributes {
  /**
   * Sheet content (typically Sheet.Header, Sheet.Body, Sheet.Footer)
   */
  children: ReactNode;

  /**
   * Whether the sheet is open (controlled)
   */
  isOpen: boolean;

  /**
   * Callback when the sheet should close
   * Called on:
   * - Close button click
   * - Backdrop click (if closeOnBackdropClick is true)
   * - ESC key press (if closeOnEscape is true)
   */
  onClose: () => void;

  /**
   * Which edge of the viewport the sheet slides in from
   * @default 'right'
   */
  placement?: SheetPlacement;

  /**
   * Sheet size variant
   * @default 'md'
   */
  size?: SheetSize;

  /**
   * Sheet surface variant
   * @default 'default'
   */
  surface?: SheetSurface;

  /**
   * Sheet mode
   * - 'modal': with backdrop, blocking (default)
   * - 'non-modal': no backdrop, non-blocking
   * @default 'modal'
   */
  mode?: SheetMode;

  /**
   * Whether clicking the backdrop closes the sheet (modal mode only)
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing ESC key closes the sheet
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to show the backdrop (modal mode only)
   * @default true
   */
  backdrop?: boolean;

  /**
   * Whether backdrop should be static (doesn't close on click but highlights)
   * @default false
   */
  staticBackdrop?: boolean;

  /**
   * ID for the sheet title element (for aria-labelledby)
   * Auto-generated if not provided
   */
  titleId?: string;

  /**
   * ID for the sheet body element (for aria-describedby)
   * Auto-generated if not provided
   */
  bodyId?: string;

  /**
   * Container element for the portal
   * @default document.body
   */
  container?: HTMLElement | null;

  /**
   * Callback when the sheet has fully opened (after animation)
   */
  onOpened?: () => void;

  /**
   * Callback when the sheet has fully closed (after animation)
   */
  onClosed?: () => void;

  /**
   * Initial element to focus when sheet opens
   * If not provided, focuses first focusable element
   */
  initialFocusRef?: RefObject<HTMLElement | null>;

  /**
   * Element to return focus to when sheet closes
   * If not provided, returns focus to element that triggered the sheet
   */
  returnFocusRef?: RefObject<HTMLElement | null>;

  /**
   * Z-index for the sheet (useful for nested overlays)
   * @default 1055 (Bootstrap default)
   */
  zIndex?: number;

  /**
   * Whether to enable animations
   * @default true
   */
  animated?: boolean;

  /**
   * Whether content should be scrollable
   * @default true
   */
  scrollable?: boolean;

  /**
   * Custom width for the sheet (overrides size)
   * Only applies to left/right placement
   */
  width?: string | number;

  /**
   * Custom height for the sheet (overrides size)
   * Only applies to top/bottom placement
   */
  height?: string | number;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Sheet.Header
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeSheetHeaderHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Sheet.Header component props
 *
 * @example
 * ```tsx
 * // Basic header with close button
 * <Sheet.Header onClose={handleClose}>
 *   Sheet Title
 * </Sheet.Header>
 *
 * // Header without close button
 * <Sheet.Header closeButton={false}>
 *   Sheet Title (no close button)
 * </Sheet.Header>
 *
 * // Header with custom title element
 * <Sheet.Header>
 *   <h4 id="custom-title">Custom Title</h4>
 * </Sheet.Header>
 * ```
 */
export interface SheetHeaderProps extends SafeSheetHeaderHTMLAttributes {
  /**
   * Header content (typically the sheet title)
   */
  children: ReactNode;

  /**
   * Whether to show the close button
   * @default true
   */
  closeButton?: boolean;

  /**
   * Close button click handler
   * Inherited from Sheet context if not provided
   */
  onClose?: () => void;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Sheet.Body
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeSheetBodyHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Sheet.Body component props
 *
 * @example
 * ```tsx
 * // Basic body
 * <Sheet.Body>
 *   <p>Sheet content goes here.</p>
 * </Sheet.Body>
 *
 * // Body with custom styling
 * <Sheet.Body className="p-4">
 *   <form>
 *     <input type="text" />
 *   </form>
 * </Sheet.Body>
 * ```
 */
export interface SheetBodyProps extends SafeSheetBodyHTMLAttributes {
  /**
   * Body content
   */
  children: ReactNode;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Sheet.Footer
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeSheetFooterHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Sheet.Footer component props
 *
 * @example
 * ```tsx
 * // Basic footer with buttons
 * <Sheet.Footer>
 *   <Button variant="secondary" onClick={handleCancel}>
 *     Cancel
 *   </Button>
 *   <Button variant="primary" onClick={handleSave}>
 *     Save
 *   </Button>
 * </Sheet.Footer>
 *
 * // Footer with custom alignment
 * <Sheet.Footer className="justify-content-start">
 *   <Button variant="primary">Left-aligned button</Button>
 * </Sheet.Footer>
 * ```
 */
export interface SheetFooterProps extends SafeSheetFooterHTMLAttributes {
  /**
   * Footer content (typically action buttons)
   */
  children: ReactNode;
}

/**
 * Sheet.Title component props
 *
 * @example
 * ```tsx
 * <Sheet.Header>
 *   <Sheet.Title>Sheet Title</Sheet.Title>
 * </Sheet.Header>
 * ```
 */
export interface SheetTitleProps {
  /**
   * Title content
   */
  children: ReactNode;

  /**
   * HTML heading element to render
   * @default 'h5'
   */
  as?: HeadingTag;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * ID for the title (used by aria-labelledby)
   * Auto-generated from Sheet context if not provided
   */
  id?: string;
}

/**
 * Sheet context value for sharing state between Sheet and subcomponents
 */
export interface SheetContextValue {
  /**
   * Close handler from Sheet
   */
  onClose: () => void;

  /**
   * Title ID for aria-labelledby
   */
  titleId: string;

  /**
   * Body ID for aria-describedby
   */
  bodyId: string;

  /**
   * Sheet placement
   */
  placement: SheetPlacement;
}
