import { forwardRef, useMemo } from 'react';
import { createPortal } from 'react-dom';

import type { ToastContainerProps, ToastPosition } from './Toast.types';

/**
 * Default gap between stacked toasts in pixels
 */
const DEFAULT_GAP_PX = 12;

/**
 * Map position to Bootstrap positioning classes
 *
 * @param position - Toast container position
 * @returns Bootstrap position classes
 */
function getPositionClasses(position: ToastPosition): string {
  const baseClasses = 'position-fixed p-3';

  switch (position) {
    case 'top-start':
      return `${baseClasses} top-0 start-0`;
    case 'top-center':
      return `${baseClasses} top-0 start-50 translate-middle-x`;
    case 'top-end':
      return `${baseClasses} top-0 end-0`;
    case 'middle-start':
      return `${baseClasses} top-50 start-0 translate-middle-y`;
    case 'middle-center':
      return `${baseClasses} top-50 start-50 translate-middle`;
    case 'middle-end':
      return `${baseClasses} top-50 end-0 translate-middle-y`;
    case 'bottom-start':
      return `${baseClasses} bottom-0 start-0`;
    case 'bottom-center':
      return `${baseClasses} bottom-0 start-50 translate-middle-x`;
    case 'bottom-end':
      return `${baseClasses} bottom-0 end-0`;
    default:
      return `${baseClasses} top-0 end-0`;
  }
}

/**
 * ToastContainer Component
 *
 * A container for positioning and stacking multiple Toast notifications.
 * Uses Bootstrap 5 positioning utilities with portal rendering.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - aria-live region wrapper for screen reader announcements
 * - aria-atomic for complete announcements
 * - Proper stacking order for assistive technologies
 *
 * SECURITY FEATURES:
 * - No prop spreading (explicit whitelist only)
 * - No dangerouslySetInnerHTML
 *
 * @example
 * ```tsx
 * // Container at top-right
 * <ToastContainer position="top-end">
 *   <Toast message="Notification 1" />
 *   <Toast message="Notification 2" />
 * </ToastContainer>
 *
 * // Container at bottom-center
 * <ToastContainer position="bottom-center" gap={16}>
 *   {toasts.map(t => <Toast key={t.id} {...t} />)}
 * </ToastContainer>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/toasts/#placement
 */
export const ToastContainer = forwardRef<HTMLDivElement, ToastContainerProps>(
  (
    {
      children,
      position = 'top-end',
      className,
      style,
      id,
      gap = DEFAULT_GAP_PX,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize container class names
    const containerClassName = useMemo(() => {
      const classes = ['toast-container', getPositionClasses(position)];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [position, className]);

    // Memoize container styles
    const containerStyles = useMemo((): React.CSSProperties => {
      return {
        ...style,
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        zIndex: 1055, // Bootstrap toast z-index
      };
    }, [style, gap]);

    const container = (
      <div
        ref={ref}
        id={id}
        className={containerClassName}
        style={containerStyles}
        aria-live="polite"
        aria-atomic="true"
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );

    // Render in portal to body
    if (typeof document !== 'undefined') {
      return createPortal(container, document.body);
    }

    return container;
  }
);

ToastContainer.displayName = 'ToastContainer';
