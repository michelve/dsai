/**
 * useFocusTrap - Focus trap hook for accessible modals and overlays
 *
 * @example
 * ```tsx
 * import { useFocusTrap } from '@dsai/react';
 *
 * function Modal({ isOpen, onClose, children }) {
 *   const { containerRef } = useFocusTrap({
 *     enabled: isOpen,
 *     onEscape: onClose,
 *   });
 *
 *   return isOpen ? (
 *     <div ref={containerRef} role="dialog">
 *       {children}
 *     </div>
 *   ) : null;
 * }
 * ```
 *
 * @packageDocumentation
 */

export { default, useFocusTrap } from './useFocusTrap';
export type { UseFocusTrapOptions, UseFocusTrapReturn } from './useFocusTrap.types';
