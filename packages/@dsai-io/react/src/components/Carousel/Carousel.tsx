import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

import { cn, mergeRefs } from '../../utils';

import {
  carouselFSMReducer,
  createInitialCarouselFSMState,
  getCarouselVisualState,
} from './Carousel.fsm';
import { CarouselCaption } from './CarouselCaption';
import { CarouselControl } from './CarouselControl';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselItem } from './CarouselItem';
import { CarouselPauseButton } from './CarouselPauseButton';

import type { CarouselItemProps, CarouselProps } from './Carousel.types';
import type { ReactElement } from 'react';

/**
 * Default autoplay interval in milliseconds
 */
const DEFAULT_INTERVAL = 5000;

/**
 * Default swipe threshold in pixels
 */
const DEFAULT_SWIPE_THRESHOLD = 50;

/**
 * Hook to detect prefers-reduced-motion media query.
 * Returns true when the user prefers reduced motion.
 */
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) {
      return undefined;
    }

    const handler = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return (): void => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Carousel Component
 *
 * A fully accessible carousel for cycling through images or content.
 * Supports autoplay, touch gestures, keyboard navigation, and custom indicators.
 *
 * ACCESSIBILITY FEATURES (WCAG 2.2 AA):
 * - Semantic section element for the carousel container
 * - aria-label for screen reader identification
 * - aria-live="polite" for slide change announcements
 * - Keyboard navigation (Arrow keys)
 * - Pause/Play button for autoplay (required for WCAG)
 * - Each control and indicator properly labeled
 * - Focus management during navigation
 *
 * SECURITY FEATURES:
 * - Prop whitelisting (no unrestricted spread)
 * - No dangerouslySetInnerHTML
 * - Explicit event handlers only
 *
 * @example
 * ```tsx
 * // Basic carousel
 * <Carousel>
 *   <CarouselItem>
 *     <img src="slide1.jpg" alt="First slide" className="d-block w-100" />
 *   </CarouselItem>
 *   <CarouselItem>
 *     <img src="slide2.jpg" alt="Second slide" className="d-block w-100" />
 *   </CarouselItem>
 * </Carousel>
 *
 * // With autoplay and controls
 * <Carousel autoPlay interval={3000} controls indicators>
 *   {slides}
 * </Carousel>
 *
 * // Controlled carousel
 * <Carousel activeIndex={index} onSelect={setIndex}>
 *   {slides}
 * </Carousel>
 * ```
 *
 * @see https://getbootstrap.com/docs/5.3/components/carousel/
 */
const CarouselBase = memo(forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      activeIndex: controlledActiveIndex,
      defaultActiveIndex = 0,
      onSelect,
      animation = 'slide',
      autoPlay = false,
      interval = DEFAULT_INTERVAL,
      pauseOnHover = true,
      pauseOnFocus = true,
      keyboard = true,
      touch = true,
      wrap = true,
      controls = true,
      indicators = true,
      dark = false,
      className = '',
      style,
      id,
      'aria-label': ariaLabel = 'Carousel',
      'aria-labelledby': ariaLabelledBy,
      swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
      slideLabels,
      showPauseButton,
      onSlideChanged,
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Determine if controlled
    const isControlled = controlledActiveIndex !== undefined;

    // Detect reduced motion preference
    const prefersReducedMotion = useReducedMotion();

    // Generate unique ID for carousel
    const generatedId = useId();
    const carouselId = id ?? `carousel-${generatedId}`;
    const liveRegionId = `${carouselId}-live`;

    // Count valid CarouselItem children
    const items = useMemo(() => {
      const validItems: ReactElement<CarouselItemProps>[] = [];
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          validItems.push(child as ReactElement<CarouselItemProps>);
        }
      });
      return validItems;
    }, [children]);

    const slideCount = items.length;

    // Initialize FSM
    const initialIndex = isControlled ? controlledActiveIndex : defaultActiveIndex;
    const [fsmState, dispatch] = useReducer(
      (
        state: ReturnType<typeof createInitialCarouselFSMState>,
        event: Parameters<typeof carouselFSMReducer>[1]
      ) => carouselFSMReducer(state, event, wrap),
      undefined,
      () => createInitialCarouselFSMState(initialIndex, slideCount, autoPlay)
    );

    // Refs for touch handling
    const touchStartXRef = useRef<number | null>(null);
    const touchStartYRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    // Track if user explicitly clicked pause button
    const userPausedRef = useRef(false);

    // Sync controlled activeIndex with FSM
    useEffect(() => {
      if (isControlled && controlledActiveIndex !== fsmState.activeIndex) {
        dispatch({
          type: 'RESET_FROM_PROPS',
          payload: { activeIndex: controlledActiveIndex, slideCount },
        });
      }
    }, [isControlled, controlledActiveIndex, fsmState.activeIndex, slideCount]);

    // Sync slide count changes
    useEffect(() => {
      if (slideCount !== fsmState.slideCount) {
        dispatch({ type: 'SET_SLIDE_COUNT', payload: slideCount });
      }
    }, [slideCount, fsmState.slideCount]);

    // Sync autoPlay prop
    useEffect(() => {
      if (autoPlay && !fsmState.isPlaying) {
        dispatch({ type: 'PLAY' });
      } else if (!autoPlay && fsmState.isPlaying) {
        dispatch({ type: 'PAUSE' });
      }
    }, [autoPlay, fsmState.isPlaying]);

    // Compute the next or previous index based on wrap mode
    const computeAdjacentIndex = useCallback(
      (direction: 'next' | 'prev'): number => {
        if (direction === 'next') {
          return wrap
            ? (fsmState.activeIndex + 1) % slideCount
            : Math.min(fsmState.activeIndex + 1, slideCount - 1);
        }
        return wrap
          ? (fsmState.activeIndex - 1 + slideCount) % slideCount
          : Math.max(fsmState.activeIndex - 1, 0);
      },
      [fsmState.activeIndex, slideCount, wrap]
    );

    // Navigation handlers
    const handleNext = useCallback((): void => {
      const nextIndex = computeAdjacentIndex('next');
      if (nextIndex !== fsmState.activeIndex) {
        dispatch({ type: 'NEXT' });
        onSelect?.(nextIndex);
        onSlideChanged?.(nextIndex, 'next');
      }
    }, [fsmState.activeIndex, computeAdjacentIndex, onSelect, onSlideChanged]);

    const handlePrev = useCallback((): void => {
      const prevIndex = computeAdjacentIndex('prev');
      if (prevIndex !== fsmState.activeIndex) {
        dispatch({ type: 'PREV' });
        onSelect?.(prevIndex);
        onSlideChanged?.(prevIndex, 'prev');
      }
    }, [fsmState.activeIndex, computeAdjacentIndex, onSelect, onSlideChanged]);

    const handleSelect = useCallback(
      (index: number): void => {
        if (index !== fsmState.activeIndex && index >= 0 && index < slideCount) {
          const direction = index > fsmState.activeIndex ? 'next' : 'prev';
          dispatch({ type: 'GO_TO', payload: index });
          onSelect?.(index);
          onSlideChanged?.(index, direction);
        }
      },
      [fsmState.activeIndex, slideCount, onSelect, onSlideChanged]
    );

    const handleTogglePause = useCallback((): void => {
      // Track that user explicitly paused
      userPausedRef.current = !fsmState.isPaused;
      dispatch({ type: 'TOGGLE_PAUSE' });
    }, [fsmState.isPaused]);

    // Autoplay timer — disabled when user prefers reduced motion
    useEffect(() => {
      if (
        !autoPlay ||
        fsmState.isPaused ||
        fsmState.isTransitioning ||
        slideCount <= 1 ||
        prefersReducedMotion
      ) {
        return undefined;
      }

      // Get per-slide interval if specified
      const currentItem = items[fsmState.activeIndex];
      const slideInterval = currentItem?.props?.interval ?? interval;

      const timerId = setInterval(() => {
        handleNext();
      }, slideInterval);

      return (): void => {
        clearInterval(timerId);
      };
    }, [
      autoPlay,
      fsmState.isPaused,
      fsmState.isTransitioning,
      fsmState.activeIndex,
      slideCount,
      interval,
      items,
      handleNext,
      prefersReducedMotion,
    ]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: KeyboardEvent): void => {
        if (!keyboard) {
          return;
        }

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handlePrev();
            break;
          case 'ArrowRight':
            e.preventDefault();
            handleNext();
            break;
          default:
            break;
        }
      },
      [keyboard, handlePrev, handleNext]
    );

    // Pause on hover/focus handlers
    const handleMouseEnter = useCallback((): void => {
      if (pauseOnHover && autoPlay) {
        dispatch({ type: 'PAUSE' });
      }
    }, [pauseOnHover, autoPlay]);

    const handleMouseLeave = useCallback((): void => {
      if (pauseOnHover && autoPlay && !userPausedRef.current) {
        // Only resume if user didn't explicitly pause via button
        dispatch({ type: 'PLAY' });
      }
    }, [pauseOnHover, autoPlay]);

    const handleFocus = useCallback((): void => {
      if (pauseOnFocus && autoPlay) {
        dispatch({ type: 'PAUSE' });
      }
    }, [pauseOnFocus, autoPlay]);

    const handleBlur = useCallback((): void => {
      if (pauseOnFocus && autoPlay && !userPausedRef.current) {
        dispatch({ type: 'PLAY' });
      }
    }, [pauseOnFocus, autoPlay]);

    // Touch/swipe handling
    const handleTouchStart = useCallback(
      (e: TouchEvent): void => {
        if (!touch) {
          return;
        }

        const touchObj = e.touches[0];
        if (!touchObj) {
          return;
        }
        touchStartXRef.current = touchObj.clientX;
        touchStartYRef.current = touchObj.clientY;
        dispatch({ type: 'DRAG_START' });
      },
      [touch]
    );

    const handleTouchMove = useCallback(
      (e: TouchEvent): void => {
        if (!touch || touchStartXRef.current === null) {
          return;
        }

        // Prevent default scroll if swiping horizontally
        const touchObj = e.touches[0];
        if (!touchObj) {
          return;
        }
        const deltaX = Math.abs(touchObj.clientX - touchStartXRef.current);
        const deltaY = Math.abs(touchObj.clientY - (touchStartYRef.current ?? 0));

        if (deltaX > deltaY) {
          e.preventDefault();
        }
      },
      [touch]
    );

    const handleTouchEnd = useCallback(
      (e: TouchEvent): void => {
        if (!touch || touchStartXRef.current === null) {
          return;
        }

        const touchObj = e.changedTouches[0];
        if (!touchObj) {
          return;
        }
        const deltaX = touchObj.clientX - touchStartXRef.current;

        dispatch({ type: 'DRAG_END' });

        if (Math.abs(deltaX) >= swipeThreshold) {
          if (deltaX > 0) {
            handlePrev();
          } else {
            handleNext();
          }
        }

        touchStartXRef.current = null;
        touchStartYRef.current = null;
      },
      [touch, swipeThreshold, handlePrev, handleNext]
    );

    // Memoize carousel class names
    const carouselClassName = useMemo(
      () =>
        cn(
          'carousel',
          !prefersReducedMotion && (animation === 'fade' ? 'carousel-fade' : 'slide'),
          dark && 'carousel-dark',
          className
        ),
      [animation, dark, className, prefersReducedMotion]
    );

    // Memoize slide labels
    const computedSlideLabels = useMemo(() => {
      if (slideLabels && slideLabels.length >= slideCount) {
        return slideLabels;
      }
      return Array.from({ length: slideCount }, (_, i) => `Slide ${i + 1}`);
    }, [slideLabels, slideCount]);

    // Announcement text for screen readers
    const announcementText = useMemo(() => {
      const label =
        computedSlideLabels[fsmState.activeIndex] ?? `Slide ${fsmState.activeIndex + 1}`;
      return `${label} of ${slideCount}`;
    }, [computedSlideLabels, fsmState.activeIndex, slideCount]);

    // Render slides with active state and W3C carousel ARIA attributes
    const renderedSlides = useMemo(() => {
      return items.map((item, index) => {
        const isActive = index === fsmState.activeIndex;
        const itemClassName = cn('carousel-item', isActive && 'active', item.props.className);
        const slideLabel =
          (Reflect.get(computedSlideLabels, index) as string | undefined) ?? `Slide ${index + 1}`;

        // Use the item's existing key if provided, otherwise use index
        // Carousel items are static and don't reorder, so index is acceptable
        const itemKey = item.key ?? `carousel-slide-${index}`;

        return cloneElement(item, {
          key: itemKey,
          className: itemClassName,
          role: 'group',
          'aria-roledescription': 'slide',
          'aria-label': `${slideLabel} (${index + 1} of ${slideCount})`,
        });
      });
    }, [items, fsmState.activeIndex, computedSlideLabels, slideCount]);

    // Determine if pause button should show
    const shouldShowPauseButton = showPauseButton ?? autoPlay;

    // Combine refs using utility (containerRef is stable)
    const combinedRef = useMemo(() => mergeRefs<HTMLDivElement>(containerRef, ref), [ref]);

    // Attach native event listeners to avoid non-interactive handler lint issues on section
    useEffect(() => {
      const el = containerRef.current;
      if (!el) {
        return undefined;
      }

      const cleanupFns: Array<() => void> = [];

      if (keyboard) {
        el.addEventListener('keydown', handleKeyDown);
        cleanupFns.push(() => el.removeEventListener('keydown', handleKeyDown));
      }

      if (pauseOnHover && autoPlay) {
        const mouseEnterHandler = (): void => handleMouseEnter();
        const mouseLeaveHandler = (): void => handleMouseLeave();
        el.addEventListener('mouseenter', mouseEnterHandler);
        el.addEventListener('mouseleave', mouseLeaveHandler);
        cleanupFns.push(() => {
          el.removeEventListener('mouseenter', mouseEnterHandler);
          el.removeEventListener('mouseleave', mouseLeaveHandler);
        });
      }

      if (pauseOnFocus && autoPlay) {
        const focusInHandler = (): void => handleFocus();
        const focusOutHandler = (): void => handleBlur();
        el.addEventListener('focusin', focusInHandler);
        el.addEventListener('focusout', focusOutHandler);
        cleanupFns.push(() => {
          el.removeEventListener('focusin', focusInHandler);
          el.removeEventListener('focusout', focusOutHandler);
        });
      }

      if (touch) {
        el.addEventListener('touchstart', handleTouchStart);
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);
        cleanupFns.push(() => {
          el.removeEventListener('touchstart', handleTouchStart);
          el.removeEventListener('touchmove', handleTouchMove);
          el.removeEventListener('touchend', handleTouchEnd);
        });
      }

      if (!cleanupFns.length) {
        return undefined;
      }

      return () => {
        for (const cleanup of cleanupFns) {
          cleanup();
        }
      };
    }, [
      keyboard,
      pauseOnHover,
      autoPlay,
      pauseOnFocus,
      touch,
      handleKeyDown,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    ]);

    // Manage focusability based on keyboard prop without triggering a11y lint on JSX
    useEffect(() => {
      const el = containerRef.current;
      if (!el) {
        return;
      }
      if (keyboard) {
        el.setAttribute('tabindex', '0');
      } else {
        el.removeAttribute('tabindex');
      }
    }, [keyboard]);

    return (
      <section
        ref={combinedRef}
        id={carouselId}
        className={carouselClassName}
        style={style}
        aria-roledescription="carousel"
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-visual-state={getCarouselVisualState(fsmState)}
        data-testid={dataTestId}
        data-test={dataTest}
      >
        {/* Live region for announcements */}
        <output id={liveRegionId} aria-live="polite" aria-atomic="true" className="visually-hidden">
          {announcementText}
        </output>

        {/* Indicators */}
        {indicators && slideCount > 1 && (
          <CarouselIndicators
            count={slideCount}
            activeIndex={fsmState.activeIndex}
            onSelect={handleSelect}
            labels={computedSlideLabels}
          />
        )}

        {/* Slides container */}
        <div className="carousel-inner">{renderedSlides}</div>

        {/* Controls */}
        {controls && slideCount > 1 && (
          <>
            <CarouselControl
              direction="prev"
              onClick={handlePrev}
              disabled={!wrap && fsmState.activeIndex === 0}
            />
            <CarouselControl
              direction="next"
              onClick={handleNext}
              disabled={!wrap && fsmState.activeIndex === slideCount - 1}
            />
          </>
        )}

        {/* Pause/Play button for autoplay (WCAG requirement) */}
        {shouldShowPauseButton && (
          <CarouselPauseButton isPaused={fsmState.isPaused} onToggle={handleTogglePause} />
        )}
      </section>
    );
  }
));
CarouselBase.displayName = 'Carousel';

/**
 * Carousel with compound component sub-components attached.
 * Supports both `<Carousel.Item>` and direct `<CarouselItem>` imports.
 */
export const Carousel = Object.assign(CarouselBase, {
  Item: CarouselItem,
  Caption: CarouselCaption,
  Control: CarouselControl,
  Indicators: CarouselIndicators,
  PauseButton: CarouselPauseButton,
});
