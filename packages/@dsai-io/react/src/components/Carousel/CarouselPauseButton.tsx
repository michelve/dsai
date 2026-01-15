import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';
import { PauseFillIcon, PlayFillIcon } from '../Icon';

import type { CarouselPauseButtonProps } from './Carousel.types';

/**
 * CarouselPauseButton Component
 *
 * Play/Pause toggle button for carousel autoplay control.
 * REQUIRED for WCAG 2.2 AA compliance when autoplay is enabled.
 *
 * ACCESSIBILITY:
 * - Clear aria-label indicating current state and action
 * - Keyboard accessible (native button)
 * - Visual icon with aria-hidden
 * - Focus visible indicator
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <CarouselPauseButton
 *   isPaused={isPaused}
 *   onToggle={() => setIsPaused(!isPaused)}
 * />
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
 */
export const CarouselPauseButton = forwardRef<HTMLButtonElement, CarouselPauseButtonProps>(
  (
    {
      isPaused,
      onToggle,
      className = '',
      style,
      pauseLabel = 'Pause carousel',
      playLabel = 'Play carousel',
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize class name computation
    const buttonClassName = useMemo(
      () => cn('carousel-pause-button', 'btn', 'btn-sm', 'btn-light', className),
      [className]
    );

    // Current label based on state
    const currentLabel = isPaused ? playLabel : pauseLabel;

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClassName}
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          zIndex: 10,
          ...style,
        }}
        onClick={onToggle}
        aria-label={currentLabel}
        aria-pressed={!isPaused}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {isPaused ? <PlayFillIcon aria-hidden /> : <PauseFillIcon aria-hidden />}
      </button>
    );
  }
);

CarouselPauseButton.displayName = 'CarouselPauseButton';
