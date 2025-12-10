import type { ReactNode } from 'react';
import type { SafeHTMLAttributes } from '../../types';

/**
 * Carousel animation types
 * slide: Default Bootstrap slide animation
 * fade: Crossfade animation between slides
 */
export type CarouselAnimation = 'slide' | 'fade';

/**
 * Carousel control direction
 */
export type CarouselControlDirection = 'prev' | 'next';

/**
 * Safe HTML attributes that can be spread onto carousel elements
 * SECURITY: This whitelist prevents injection of dangerous attributes or event handlers
 * @see SafeHTMLAttributes
 */
export type SafeCarouselHTMLAttributes = SafeHTMLAttributes<HTMLDivElement>;

/**
 * CarouselItem component props
 *
 * @example
 * ```tsx
 * <CarouselItem>
 *   <img src="slide1.jpg" alt="Slide 1" />
 *   <CarouselCaption title="First slide" description="Description" />
 * </CarouselItem>
 * ```
 */
export interface CarouselItemProps extends SafeCarouselHTMLAttributes {
  /**
   * Slide content
   */
  children: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute for the slide
   */
  id?: string;

  /**
   * Duration for this slide when autoplay is enabled (overrides carousel interval)
   * Value in milliseconds
   */
  interval?: number;
}

/**
 * CarouselControl component props (prev/next buttons)
 *
 * @example
 * ```tsx
 * <CarouselControl direction="prev" onClick={handlePrev} />
 * <CarouselControl direction="next" onClick={handleNext} />
 * ```
 */
export interface CarouselControlProps extends SafeCarouselHTMLAttributes {
  /**
   * Control direction
   */
  direction: CarouselControlDirection;

  /**
   * Click handler to navigate slides
   */
  onClick: () => void;

  /**
   * Disabled state - prevents navigation
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Custom aria-label (overrides default)
   * @default "Previous slide" or "Next slide"
   */
  'aria-label'?: string;
}

/**
 * CarouselIndicators component props
 *
 * @example
 * ```tsx
 * <CarouselIndicators
 *   count={5}
 *   activeIndex={0}
 *   onSelect={(index) => setActiveIndex(index)}
 * />
 * ```
 */
export interface CarouselIndicatorsProps extends SafeCarouselHTMLAttributes {
  /**
   * Total number of slides
   */
  count: number;

  /**
   * Currently active slide index (0-based)
   */
  activeIndex: number;

  /**
   * Callback when an indicator is clicked
   */
  onSelect: (index: number) => void;

  /**
   * Additional CSS class names for the container
   */
  className?: string;

  /**
   * Inline styles for the container
   */
  style?: CSSProperties;

  /**
   * Labels for each slide (used for aria-label on indicators)
   * @default ["Slide 1", "Slide 2", ...]
   */
  labels?: string[];
}

/**
 * CarouselCaption component props
 *
 * @example
 * ```tsx
 * <CarouselCaption heading="Slide title" description="Slide description" />
 * ```
 */
export interface CarouselCaptionProps extends SafeCarouselHTMLAttributes {
  /**
   * Caption heading
   */
  heading?: ReactNode;

  /**
   * Caption description
   */
  description?: ReactNode;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;
}

/**
 * CarouselPauseButton component props
 * Required for WCAG compliance when autoplay is enabled
 *
 * @example
 * ```tsx
 * <CarouselPauseButton
 *   isPaused={paused}
 *   onToggle={() => setPaused(!paused)}
 * />
 * ```
 */
export interface CarouselPauseButtonProps extends SafeCarouselHTMLAttributes {
  /**
   * Current pause state
   */
  isPaused: boolean;

  /**
   * Toggle pause/play callback
   */
  onToggle: () => void;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Custom aria-label for pause state
   * @default "Pause carousel"
   */
  pauseLabel?: string;

  /**
   * Custom aria-label for play state
   * @default "Play carousel"
   */
  playLabel?: string;
}

/**
 * Carousel FSM visual states
 */
export type CarouselVisualState = 'idle' | 'playing' | 'paused' | 'transitioning' | 'dragging';

/**
 * Carousel FSM state shape
 */
export interface CarouselFSMState {
  /**
   * Current visual state
   */
  visualState: CarouselVisualState;

  /**
   * Current active slide index
   */
  activeIndex: number;

  /**
   * Previous slide index (for transition direction)
   */
  prevIndex: number;

  /**
   * Whether autoplay is enabled and running
   */
  isPlaying: boolean;

  /**
   * Whether user has paused autoplay
   */
  isPaused: boolean;

  /**
   * Whether a transition is in progress
   */
  isTransitioning: boolean;

  /**
   * Whether user is dragging/swiping
   */
  isDragging: boolean;

  /**
   * Total number of slides
   */
  slideCount: number;
}

/**
 * Carousel FSM events
 */
export type CarouselFSMEvent =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GO_TO'; payload: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TRANSITION_START' }
  | { type: 'TRANSITION_END' }
  | { type: 'DRAG_START' }
  | { type: 'DRAG_END' }
  | { type: 'SET_SLIDE_COUNT'; payload: number }
  | { type: 'RESET_FROM_PROPS'; payload: { activeIndex: number; slideCount: number } };

/**
 * Main Carousel component props
 *
 * @example
 * ```tsx
 * // Basic carousel
 * <Carousel>
 *   <CarouselItem><img src="1.jpg" alt="Slide 1" /></CarouselItem>
 *   <CarouselItem><img src="2.jpg" alt="Slide 2" /></CarouselItem>
 * </Carousel>
 *
 * // Controlled carousel with autoplay
 * <Carousel
 *   activeIndex={index}
 *   onSelect={setIndex}
 *   autoPlay
 *   interval={5000}
 *   pauseOnHover
 * >
 *   {slides}
 * </Carousel>
 * ```
 */
export interface CarouselProps extends SafeCarouselHTMLAttributes {
  /**
   * Carousel slides (should be CarouselItem components)
   */
  children: ReactNode;

  /**
   * Controlled active slide index (0-based)
   * When provided, carousel becomes controlled
   */
  activeIndex?: number;

  /**
   * Default active slide for uncontrolled mode
   * @default 0
   */
  defaultActiveIndex?: number;

  /**
   * Callback when active slide changes
   */
  onSelect?: (index: number) => void;

  /**
   * Animation type
   * @default 'slide'
   */
  animation?: CarouselAnimation;

  /**
   * Enable autoplay
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Autoplay interval in milliseconds
   * @default 5000
   */
  interval?: number;

  /**
   * Pause autoplay on hover
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Pause autoplay on focus (keyboard users)
   * @default true
   */
  pauseOnFocus?: boolean;

  /**
   * Enable keyboard navigation (Arrow keys)
   * @default true
   */
  keyboard?: boolean;

  /**
   * Enable touch/swipe gestures
   * @default true
   */
  touch?: boolean;

  /**
   * Wrap around from last to first slide
   * @default true
   */
  wrap?: boolean;

  /**
   * Show prev/next controls
   * @default true
   */
  controls?: boolean;

  /**
   * Show slide indicators
   * @default true
   */
  indicators?: boolean;

  /**
   * Dark variant for light backgrounds
   * @default false
   */
  dark?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessible label for the carousel region
   * @default "Carousel"
   */
  'aria-label'?: string;

  /**
   * ID of element providing accessible label
   */
  'aria-labelledby'?: string;

  /**
   * Minimum swipe distance to trigger slide change (in pixels)
   * @default 50
   */
  swipeThreshold?: number;

  /**
   * Slide labels for screen readers (used in indicators and announcements)
   */
  slideLabels?: string[];

  /**
   * Show pause/play button when autoPlay is enabled (required for WCAG)
   * @default true when autoPlay is true
   */
  showPauseButton?: boolean;
}
