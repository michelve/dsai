import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import {
  carouselFSMReducer,
  createInitialCarouselFSMState,
  getCarouselVisualState,
} from './Carousel.fsm';
import { CarouselControl } from './CarouselControl';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselPauseButton } from './CarouselPauseButton';

import type { CarouselItemProps, CarouselProps } from './Carousel.types';
import type { ReactElement, TouchEvent as ReactTouchEvent } from 'react';

/**
 * Default autoplay interval in milliseconds
 */
const DEFAULT_INTERVAL = 5000;

/**
 * Default swipe threshold in pixels
 */
const DEFAULT_SWIPE_THRESHOLD = 50;

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
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
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
      'data-testid': dataTestId,
      'data-test': dataTest,
    },
    ref
  ) => {
    // Determine if controlled
    const isControlled = controlledActiveIndex !== undefined;

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

    // Navigation handlers
    const handleNext = useCallback((): void => {
      const nextIndex = wrap
        ? (fsmState.activeIndex + 1) % slideCount
        : Math.min(fsmState.activeIndex + 1, slideCount - 1);

      if (nextIndex !== fsmState.activeIndex) {
        dispatch({ type: 'NEXT' });
        onSelect?.(nextIndex);
      }
    }, [fsmState.activeIndex, slideCount, wrap, onSelect]);

    const handlePrev = useCallback((): void => {
      const prevIndex = wrap
        ? (fsmState.activeIndex - 1 + slideCount) % slideCount
        : Math.max(fsmState.activeIndex - 1, 0);

      if (prevIndex !== fsmState.activeIndex) {
        dispatch({ type: 'PREV' });
        onSelect?.(prevIndex);
      }
    }, [fsmState.activeIndex, slideCount, wrap, onSelect]);

    const handleSelect = useCallback(
      (index: number): void => {
        if (index !== fsmState.activeIndex && index >= 0 && index < slideCount) {
          dispatch({ type: 'GO_TO', payload: index });
          onSelect?.(index);
        }
      },
      [fsmState.activeIndex, slideCount, onSelect]
    );

    const handleTogglePause = useCallback((): void => {
      // Track that user explicitly paused
      userPausedRef.current = !fsmState.isPaused;
      dispatch({ type: 'TOGGLE_PAUSE' });
    }, [fsmState.isPaused]);

    // Autoplay timer
    useEffect(() => {
      if (!autoPlay || fsmState.isPaused || fsmState.isTransitioning || slideCount <= 1) {
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
    ]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>): void => {
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
      (e: ReactTouchEvent<HTMLDivElement>): void => {
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
      (e: ReactTouchEvent<HTMLDivElement>): void => {
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
      (e: ReactTouchEvent<HTMLDivElement>): void => {
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
    const carouselClassName = useMemo(() => {
      const classes = ['carousel', animation === 'fade' ? 'carousel-fade' : 'slide'];
      if (dark) {
        classes.push('carousel-dark');
      }
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    }, [animation, dark, className]);

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

    // Render slides with active state
    const renderedSlides = useMemo(() => {
      return items.map((item, index) => {
        const isActive = index === fsmState.activeIndex;
        const itemClassName = [
          'carousel-item',
          isActive ? 'active' : '',
          item.props.className ?? '',
        ]
          .filter(Boolean)
          .join(' ');

        // Use the item's existing key if provided, otherwise use index
        // Carousel items are static and don't reorder, so index is acceptable
        const itemKey = item.key ?? `carousel-slide-${index}`;

        return cloneElement(item, {
          key: itemKey,
          className: itemClassName,
        });
      });
    }, [items, fsmState.activeIndex]);

    // Determine if pause button should show
    const shouldShowPauseButton = showPauseButton ?? autoPlay;

    // Combine refs
    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Carousel with section element requires keyboard navigation per WCAG for slide control
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
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- tabIndex required for keyboard navigation on carousel section
        tabIndex={keyboard ? 0 : undefined}
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
        {/* Pause/Play button for autoplay (WCAG requirement) */}
        {shouldShowPauseButton && (
          <CarouselPauseButton isPaused={fsmState.isPaused} onToggle={handleTogglePause} />
        )}
      </section>
    );
  }
);
Carousel.displayName = 'Carousel';
