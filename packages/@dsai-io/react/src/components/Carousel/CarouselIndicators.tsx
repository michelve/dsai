import { forwardRef, useCallback, useId, useMemo } from 'react';

import { cn } from '../../utils';

import type { CarouselIndicatorsProps } from './Carousel.types';

/**
 * Generate indicator data with stable keys
 */
function generateIndicatorData(
  count: number,
  baseId: string
): Array<{ key: string; index: number }> {
  return Array.from({ length: count }, (_, i) => ({
    key: `${baseId}-indicator-${i}`,
    index: i,
  }));
}

/**
 * Generate default slide labels
 */
function generateDefaultLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Slide ${i + 1}`);
}

/**
 * CarouselIndicators Component
 *
 * Dot indicators showing the current slide position and allowing direct navigation.
 *
 * ACCESSIBILITY:
 * - Each indicator is a button with aria-label
 * - Active indicator has aria-current="true"
 * - Uses list semantics for grouping
 * - Supports keyboard navigation
 *
 * SECURITY: No unrestricted prop spreading. Only whitelisted attributes are passed to DOM.
 *
 * @example
 * ```tsx
 * <CarouselIndicators
 *   count={5}
 *   activeIndex={0}
 *   onSelect={(index) => setActiveIndex(index)}
 *   labels={['Intro', 'Features', 'Pricing', 'FAQ', 'Contact']}
 * />
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/#with-indicators
 */
export const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  (
    {
      count,
      activeIndex,
      onSelect,
      className = '',
      style,
      labels,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Generate stable base ID for this component instance
    const baseId = useId();

    // Generate indicator data with stable keys
    const indicatorData = useMemo(() => generateIndicatorData(count, baseId), [count, baseId]);

    // Memoize class name computation
    const containerClassName = useMemo(() => cn('carousel-indicators', className), [className]);

    // Memoize labels
    const slideLabels = useMemo(() => {
      if (labels && labels.length >= count) {
        return labels;
      }
      return generateDefaultLabels(count);
    }, [labels, count]);

    // Memoize click handler factory
    const createClickHandler = useCallback(
      (index: number) => (): void => {
        onSelect(index);
      },
      [onSelect]
    );

    // Get label for a specific index with bounds checking
    const getLabelAtIndex = useCallback(
      (index: number): string => {
        if (index >= 0 && index < slideLabels.length) {
          const label = slideLabels.find((_, i) => i === index);
          return label ?? `Slide ${index + 1}`;
        }
        return `Slide ${index + 1}`;
      },
      [slideLabels]
    );

    // Memoize indicators array using pre-generated stable keys
    const indicators = useMemo(() => {
      return indicatorData.map(({ key, index }) => {
        const isActive = index === activeIndex;
        const label = getLabelAtIndex(index);

        return (
          <button
            key={key}
            type="button"
            className={isActive ? 'active' : undefined}
            onClick={createClickHandler(index)}
            aria-label={label}
            aria-current={isActive ? 'true' : undefined}
            data-bs-slide-to={index}
          />
        );
      });
    }, [indicatorData, activeIndex, getLabelAtIndex, createClickHandler]);

    if (count <= 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={containerClassName}
        style={style}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {indicators}
      </div>
    );
  }
);

CarouselIndicators.displayName = 'CarouselIndicators';
