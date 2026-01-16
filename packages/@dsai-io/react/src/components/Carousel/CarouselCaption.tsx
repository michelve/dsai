import { forwardRef, useMemo } from 'react';

import { cn } from '../../utils';

import type { CarouselCaptionProps } from './Carousel.types';

/**
 * CarouselCaption Component
 *
 * Caption overlay for carousel slides with heading and description.
 *
 * ACCESSIBILITY:
 * - Uses semantic heading elements
 * - Caption content is accessible to screen readers
 * - Positioned for visibility without blocking main content
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <CarouselItem>
 *   <img src="slide.jpg" alt="" className="d-block w-100" />
 *   <CarouselCaption
 *     heading="First slide label"
 *     description="Some representative placeholder content for the first slide."
 *   />
 * </CarouselItem>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/#with-captions
 */
export const CarouselCaption = forwardRef<HTMLDivElement, CarouselCaptionProps>(
  (
    {
      heading,
      description,
      className = '',
      style,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize class name computation
    const captionClassName = useMemo(
      () => cn('carousel-caption', 'd-none', 'd-md-block', className),
      [className]
    );

    // Don't render if no content
    if (!heading && !description) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={captionClassName}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {heading && <h5>{heading}</h5>}
        {description && <p>{description}</p>}
      </div>
    );
  }
);

CarouselCaption.displayName = 'CarouselCaption';
