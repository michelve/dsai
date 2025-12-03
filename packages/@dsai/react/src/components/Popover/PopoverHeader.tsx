import { forwardRef, useMemo } from 'react';

import type { PopoverHeaderProps } from './Popover.types';

/**
 * PopoverHeader Component
 *
 * Header section of the Popover with title styling and optional border.
 *
 * ACCESSIBILITY:
 * - Uses semantic heading structure
 * - Provides aria-labelledby target for the popover dialog
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <PopoverHeader>Settings</PopoverHeader>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/popovers/
 */
export const PopoverHeader = forwardRef<HTMLHeadingElement, PopoverHeaderProps>(
  (
    { children, className = '', style, id, 'data-testid': dataTestId, 'data-test': dataTest },
    ref
  ) => {
    // Memoize class name computation
    const headerClassName = useMemo(() => {
      const classes = ['popover-header'];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [className]);

    return (
      <h3
        ref={ref}
        id={id}
        className={headerClassName}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </h3>
    );
  }
);

PopoverHeader.displayName = 'PopoverHeader';
