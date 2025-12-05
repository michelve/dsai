import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';

import type { PopoverCloseButtonProps } from './Popover.types';

/**
 * PopoverCloseButton Component
 *
 * Close button for the Popover header area.
 * Uses Bootstrap's native btn-close styling (background-image based icon).
 *
 * ACCESSIBILITY:
 * - Semantic button element
 * - Clear aria-label for screen readers
 * - Bootstrap btn-close handles the visual icon
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <PopoverCloseButton onClick={handleClose} aria-label="Close settings" />
 * ```
 */
export const PopoverCloseButton = forwardRef<HTMLButtonElement, PopoverCloseButtonProps>(
  (
    {
      onClick,
      className = '',
      style,
      'aria-label': ariaLabel = 'Close',
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize class name computation
    const buttonClassName = useMemo(() => cn('btn-close', className), [className]);

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClassName}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          ...style,
        }}
        onClick={onClick}
        aria-label={ariaLabel}
        data-testid={dataTestId}
        data-test={dataTest}
      />
    );
  }
);

PopoverCloseButton.displayName = 'PopoverCloseButton';
