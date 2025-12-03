import { forwardRef, useMemo } from 'react';

import type { CarouselControlDirection, CarouselControlProps } from './Carousel.types';

/**
 * Get the default label for a control direction
 * Uses explicit conditionals to avoid object injection patterns
 */
function getDefaultLabel(direction: CarouselControlDirection): string {
  switch (direction) {
    case 'prev':
      return 'Previous slide';
    case 'next':
      return 'Next slide';
  }
}

/**
 * CarouselControl Component
 *
 * Previous/Next navigation buttons for the Carousel.
 *
 * ACCESSIBILITY:
 * - Uses semantic button element
 * - Provides aria-label for screen readers
 * - Supports keyboard activation (Enter/Space)
 * - Decorative icon hidden from screen readers
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <CarouselControl direction="prev" onClick={handlePrev} />
 * <CarouselControl direction="next" onClick={handleNext} />
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/#with-controls
 */
export const CarouselControl = forwardRef<HTMLButtonElement, CarouselControlProps>(
  (
    {
      direction,
      onClick,
      disabled = false,
      className = '',
      style,
      'aria-label': ariaLabel,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize class name computation
    const controlClassName = useMemo(() => {
      const classes = [`carousel-control-${direction}`];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [direction, className]);

    // Memoize icon class
    const iconClassName = useMemo(() => `carousel-control-${direction}-icon`, [direction]);

    // Use custom label or default
    const label = ariaLabel ?? getDefaultLabel(direction);

    const handleClick = (): void => {
      if (!disabled) {
        onClick();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      // Native button handles Enter/Space, but we ensure consistency
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={controlClassName}
        style={style}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={label}
        aria-disabled={disabled}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {/* Icon is decorative - hidden from screen readers */}
        <span className={iconClassName} aria-hidden="true" />
      </button>
    );
  }
);

CarouselControl.displayName = 'CarouselControl';
