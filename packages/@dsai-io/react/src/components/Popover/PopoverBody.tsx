import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';

import type { PopoverBodyProps } from './Popover.types';

/**
 * PopoverBody Component
 *
 * Body section of the Popover containing the main content.
 *
 * ACCESSIBILITY:
 * - Provides aria-describedby target for the popover dialog
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <PopoverBody>
 *   <p>Configure your preferences here.</p>
 * </PopoverBody>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/popovers/
 */
export const PopoverBody = forwardRef<HTMLDivElement, PopoverBodyProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    // Memoize class name computation
    const bodyClassName = useMemo(() => cn('popover-body', className), [className]);

    return (
      <div
        ref={ref}
        id={id}
        className={bodyClassName}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );
  }
);

PopoverBody.displayName = 'PopoverBody';
