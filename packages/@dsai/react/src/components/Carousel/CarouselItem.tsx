import { forwardRef, useMemo } from 'react';

import type { CarouselItemProps } from './Carousel.types';

/**
 * CarouselItem Component
 *
 * Represents a single slide within the Carousel. Must be used as a direct child
 * of the Carousel component.
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <CarouselItem>
 *     <img src="slide1.jpg" alt="First slide" className="d-block w-100" />
 *   </CarouselItem>
 *   <CarouselItem interval={3000}>
 *     <img src="slide2.jpg" alt="Second slide" className="d-block w-100" />
 *   </CarouselItem>
 * </Carousel>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/#slides-only
 */
export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (
    {
      children,
      className = '',
      style,
      id,
      interval,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Memoize class name computation
    const itemClassName = useMemo(() => {
      const classes = ['carousel-item'];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [className]);

    return (
      <div
        ref={ref}
        className={itemClassName}
        style={style}
        id={id}
        data-bs-interval={interval}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {children}
      </div>
    );
  }
);

CarouselItem.displayName = 'CarouselItem';
