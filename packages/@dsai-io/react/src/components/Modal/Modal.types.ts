import type { ComponentSize, HeadingTag, SafeHTMLAttributes } from '../../types';
import type React from 'react';
import type { ReactNode } from 'react';

/**
 * Modal size variants
 * Maps to Bootstrap 5 modal size classes
 * Combines ComponentSize (sm/md/lg) with modal-specific sizes (xl/fullscreen)
 *
 * @see https://getbootstrap.com/docs/5.3/components/modal/#optional-sizes
 * @see ComponentSize
 */
export type ModalSize = ComponentSize | 'xl' | 'fullscreen';

/**
 * Modal fullscreen breakpoint variants
 * Only applies when size is 'fullscreen'
 *
 * @see https://getbootstrap.com/docs/5.3/components/modal/#fullscreen-modal
 */
export type ModalFullscreenBreakpoint =
  | 'always'
  | 'sm-down'
  | 'md-down'
  | 'lg-down'
  | 'xl-down'
  | 'xxl-down';

/**
 * Whitelisted HTML attributes for safe prop spreading in Modal component
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeModalHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Modal component props
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - role="dialog" for screen readers
 * - aria-modal="true" to indicate modal context
 * - aria-labelledby pointing to header
 * - aria-describedby pointing to body
 * - Focus trap within modal
 * - ESC key to close
 * - Scroll lock when open
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic modal
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <Modal.Header>Modal Title</Modal.Header>
 *   <Modal.Body>Modal content goes here.</Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *       Cancel
 *     </Button>
 *     <Button variant="primary" onClick={handleSave}>
 *       Save
 *     </Button>
 *   </Modal.Footer>
 * </Modal>
 *
 * // Large modal with custom title ID
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   size="lg"
 *   titleId="custom-title"
 * >
 *   <Modal.Header>Large Modal</Modal.Header>
 *   <Modal.Body>Content here...</Modal.Body>
 * </Modal>
 *
 * // Fullscreen modal
 * <Modal isOpen={isOpen} onClose={handleClose} size="fullscreen">
 *   <Modal.Header>Fullscreen Modal</Modal.Header>
 *   <Modal.Body>Full screen content...</Modal.Body>
 * </Modal>
 *
 * // Modal without backdrop close
 * <Modal isOpen={isOpen} onClose={handleClose} closeOnBackdropClick={false}>
 *   <Modal.Header>Click backdrop won't close</Modal.Header>
 *   <Modal.Body>Must use close button or ESC key.</Modal.Body>
 * </Modal>
 * ```
 */
export interface ModalProps extends SafeModalHTMLAttributes {
  /**
   * Modal content (typically Modal.Header, Modal.Body, Modal.Footer)
   */
  children: ReactNode;

  /**
   * Whether the modal is open (controlled)
   */
  isOpen: boolean;

  /**
   * Callback when the modal should close
   * Called on:
   * - Close button click
   * - Backdrop click (if closeOnBackdropClick is true)
   * - ESC key press (if closeOnEscape is true)
   */
  onClose: () => void;

  /**
   * Modal size variant
   * @default 'md'
   */
  size?: ModalSize;

  /**
   * Fullscreen breakpoint (only applies when size is 'fullscreen')
   * @default 'always'
   */
  fullscreenBreakpoint?: ModalFullscreenBreakpoint;

  /**
   * Whether to center the modal vertically
   * @default false
   */
  centered?: boolean;

  /**
   * Whether to enable scrollable body when content overflows
   * @default false
   */
  scrollable?: boolean;

  /**
   * Whether clicking the backdrop closes the modal
   * @default true
   */
  closeOnBackdropClick?: boolean;

  /**
   * Whether pressing ESC key closes the modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to show the backdrop
   * @default true
   */
  backdrop?: boolean;

  /**
   * Whether backdrop should be static (doesn't close on click but highlights)
   * @default false
   */
  staticBackdrop?: boolean;

  /**
   * ID for the modal title element (for aria-labelledby)
   * Auto-generated if not provided
   */
  titleId?: string;

  /**
   * ID for the modal body element (for aria-describedby)
   * Auto-generated if not provided
   */
  bodyId?: string;

  /**
   * Container element for the portal
   * @default document.body
   */
  container?: HTMLElement | null;

  /**
   * Callback when the modal has fully opened (after animation)
   */
  onOpened?: () => void;

  /**
   * Callback when the modal has fully closed (after animation)
   */
  onClosed?: () => void;

  /**
   * Initial element to focus when modal opens
   * If not provided, focuses first focusable element
   */
  initialFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Element to return focus to when modal closes
   * If not provided, returns focus to element that triggered the modal
   */
  returnFocusRef?: React.RefObject<HTMLElement>;

  /**
   * Z-index for the modal (useful for nested modals)
   * @default 1055 (Bootstrap default)
   */
  zIndex?: number;

  /**
   * Whether to enable animations
   * @default true
   */
  animated?: boolean;

  /**
   * ARIA role for the modal dialog.
   * Use 'alertdialog' for confirmation/destructive dialogs that require
   * user acknowledgment (WCAG: alerts the user).
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Modal.Header
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeModalHeaderHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Modal.Header component props
 *
 * @example
 * ```tsx
 * // Basic header with close button
 * <Modal.Header onClose={handleClose}>
 *   Modal Title
 * </Modal.Header>
 *
 * // Header without close button
 * <Modal.Header closeButton={false}>
 *   Modal Title (no close button)
 * </Modal.Header>
 *
 * // Header with custom title element
 * <Modal.Header>
 *   <h4 id="custom-title">Custom Title</h4>
 * </Modal.Header>
 * ```
 */
export interface ModalHeaderProps extends SafeModalHeaderHTMLAttributes {
  /**
   * Header content (typically the modal title)
   */
  children: ReactNode;

  /**
   * Whether to show the close button
   * @default true
   */
  closeButton?: boolean;

  /**
   * Close button click handler
   * Inherited from Modal context if not provided
   */
  onClose?: () => void;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Modal.Body
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeModalBodyHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Modal.Body component props
 *
 * @example
 * ```tsx
 * // Basic body
 * <Modal.Body>
 *   <p>Modal content goes here.</p>
 * </Modal.Body>
 *
 * // Body with custom styling
 * <Modal.Body className="p-4">
 *   <form>
 *     <input type="text" />
 *   </form>
 * </Modal.Body>
 * ```
 */
export interface ModalBodyProps extends SafeModalBodyHTMLAttributes {
  /**
   * Body content
   */
  children: ReactNode;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Modal.Footer
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeModalFooterHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Modal.Footer component props
 *
 * @example
 * ```tsx
 * // Basic footer with buttons
 * <Modal.Footer>
 *   <Button variant="secondary" onClick={handleCancel}>
 *     Cancel
 *   </Button>
 *   <Button variant="primary" onClick={handleSave}>
 *     Save
 *   </Button>
 * </Modal.Footer>
 *
 * // Footer with custom alignment
 * <Modal.Footer className="justify-content-start">
 *   <Button variant="primary">Left-aligned button</Button>
 * </Modal.Footer>
 * ```
 */
export interface ModalFooterProps extends SafeModalFooterHTMLAttributes {
  /**
   * Footer content (typically action buttons)
   */
  children: ReactNode;
}

/**
 * Modal.Title component props
 *
 * @example
 * ```tsx
 * <Modal.Header>
 *   <Modal.Title>Modal Title</Modal.Title>
 * </Modal.Header>
 * ```
 */
export interface ModalTitleProps {
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
   * Auto-generated from Modal context if not provided
   */
  id?: string;
}

/**
 * Whitelisted HTML attributes for safe prop spreading in Modal.Description
 * SECURITY: Restricts arbitrary props to prevent injection attacks
 * @see {@link SafeHTMLAttributes}
 */
export type SafeModalDescriptionHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * Modal.Description component props
 *
 * Provides an explicit element for aria-describedby, giving screen readers
 * a concise description separate from the full body content.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose} role="alertdialog">
 *   <Modal.Header>Confirm Delete</Modal.Header>
 *   <Modal.Body>
 *     <Modal.Description>
 *       This action will permanently delete the item.
 *     </Modal.Description>
 *     <p>Additional details here...</p>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>Cancel</Button>
 *     <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *   </Modal.Footer>
 * </Modal>
 * ```
 */
export interface ModalDescriptionProps extends SafeModalDescriptionHTMLAttributes {
  /**
   * Description content
   */
  children: ReactNode;
}

/**
 * Modal context value for sharing state between Modal and subcomponents
 */
export interface ModalContextValue {
  /**
   * Close handler from Modal
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
   * Description ID for aria-describedby when Modal.Description is used
   */
  descriptionId: string;

  /**
   * Whether a Modal.Description has been rendered
   */
  hasDescription: boolean;

  /**
   * Register that a Modal.Description has been rendered
   */
  setHasDescription: (value: boolean) => void;

  /**
   * Whether the modal content is scrollable
   */
  scrollable: boolean;
}
