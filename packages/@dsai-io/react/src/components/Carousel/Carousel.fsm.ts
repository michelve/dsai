import type { CarouselFSMEvent, CarouselFSMState, CarouselVisualState } from './Carousel.types';

/**
 * Creates the initial Carousel FSM state
 *
 * @param activeIndex - Initial active slide index
 * @param slideCount - Total number of slides
 * @param autoPlay - Whether autoplay is enabled
 * @returns Initial FSM state
 *
 * @example
 * ```ts
 * const initialState = createInitialCarouselFSMState(0, 5, true);
 * ```
 */
export function createInitialCarouselFSMState(
  activeIndex = 0,
  slideCount = 0,
  autoPlay = false
): CarouselFSMState {
  return {
    visualState: autoPlay ? 'playing' : 'idle',
    activeIndex,
    prevIndex: activeIndex,
    isPlaying: autoPlay,
    isPaused: false,
    isTransitioning: false,
    isDragging: false,
    slideCount,
  };
}

/**
 * Compute next index with optional wrapping
 */
function computeNextIndex(currentIndex: number, slideCount: number, wrap: boolean): number {
  if (slideCount === 0) {
    return 0;
  }
  if (wrap) {
    return (currentIndex + 1) % slideCount;
  }
  return Math.min(currentIndex + 1, slideCount - 1);
}

/**
 * Compute previous index with optional wrapping
 */
function computePrevIndex(currentIndex: number, slideCount: number, wrap: boolean): number {
  if (slideCount === 0) {
    return 0;
  }
  if (wrap) {
    return (currentIndex - 1 + slideCount) % slideCount;
  }
  return Math.max(currentIndex - 1, 0);
}

/**
 * Derive visual state from FSM state
 */
function deriveVisualState(state: CarouselFSMState): CarouselVisualState {
  if (state.isDragging) {
    return 'dragging';
  }
  if (state.isTransitioning) {
    return 'transitioning';
  }
  if (state.isPaused) {
    return 'paused';
  }
  if (state.isPlaying) {
    return 'playing';
  }
  return 'idle';
}

/**
 * Carousel FSM reducer
 *
 * Handles all carousel state transitions including:
 * - Navigation (next, prev, go to specific slide)
 * - Autoplay control (play, pause, toggle)
 * - Transition states
 * - Drag/swipe states
 *
 * @param state - Current FSM state
 * @param event - FSM event to process
 * @param wrap - Whether to wrap around at boundaries (default: true)
 * @returns Updated FSM state
 *
 * @example
 * ```ts
 * const [state, dispatch] = useReducer(
 *   (s, e) => carouselFSMReducer(s, e, true),
 *   undefined,
 *   () => createInitialCarouselFSMState(0, 5, false)
 * );
 * dispatch({ type: 'NEXT' });
 * ```
 */
export function carouselFSMReducer(
  state: CarouselFSMState,
  event: CarouselFSMEvent,
  wrap = true
): CarouselFSMState {
  switch (event.type) {
    case 'NEXT': {
      // Don't navigate while transitioning
      if (state.isTransitioning) {
        return state;
      }

      const nextIndex = computeNextIndex(state.activeIndex, state.slideCount, wrap);
      // If not wrapping and already at end, don't change
      if (nextIndex === state.activeIndex) {
        return state;
      }

      const nextState: CarouselFSMState = {
        ...state,
        prevIndex: state.activeIndex,
        activeIndex: nextIndex,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'PREV': {
      if (state.isTransitioning) {
        return state;
      }

      const prevIndex = computePrevIndex(state.activeIndex, state.slideCount, wrap);
      if (prevIndex === state.activeIndex) {
        return state;
      }

      const nextState: CarouselFSMState = {
        ...state,
        prevIndex: state.activeIndex,
        activeIndex: prevIndex,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'GO_TO': {
      if (state.isTransitioning) {
        return state;
      }

      const targetIndex = event.payload;
      // Validate bounds
      if (targetIndex < 0 || targetIndex >= state.slideCount) {
        return state;
      }
      if (targetIndex === state.activeIndex) {
        return state;
      }

      const nextState: CarouselFSMState = {
        ...state,
        prevIndex: state.activeIndex,
        activeIndex: targetIndex,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'PLAY': {
      const nextState: CarouselFSMState = {
        ...state,
        isPlaying: true,
        isPaused: false,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'PAUSE': {
      const nextState: CarouselFSMState = {
        ...state,
        isPaused: true,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'TOGGLE_PAUSE': {
      const nextState: CarouselFSMState = {
        ...state,
        isPaused: !state.isPaused,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'TRANSITION_START': {
      const nextState: CarouselFSMState = {
        ...state,
        isTransitioning: true,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'TRANSITION_END': {
      const nextState: CarouselFSMState = {
        ...state,
        isTransitioning: false,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'DRAG_START': {
      const nextState: CarouselFSMState = {
        ...state,
        isDragging: true,
        // Pause autoplay while dragging
        isPaused: state.isPlaying ? true : state.isPaused,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'DRAG_END': {
      const nextState: CarouselFSMState = {
        ...state,
        isDragging: false,
        // Resume if was playing before drag
        isPaused: state.isPlaying ? false : state.isPaused,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'SET_SLIDE_COUNT': {
      const newCount = event.payload;
      // Clamp activeIndex if it exceeds new count
      const clampedIndex = newCount > 0 ? Math.min(state.activeIndex, newCount - 1) : 0;

      const nextState: CarouselFSMState = {
        ...state,
        slideCount: newCount,
        activeIndex: clampedIndex,
        prevIndex: clampedIndex,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    case 'RESET_FROM_PROPS': {
      const { activeIndex, slideCount } = event.payload;
      const clampedIndex = slideCount > 0 ? Math.min(activeIndex, slideCount - 1) : 0;

      const nextState: CarouselFSMState = {
        ...state,
        slideCount,
        activeIndex: clampedIndex,
        prevIndex: state.activeIndex !== clampedIndex ? state.activeIndex : state.prevIndex,
      };
      nextState.visualState = deriveVisualState(nextState);
      return nextState;
    }

    default:
      return state;
  }
}

/**
 * Get the visual state attribute value for the carousel
 *
 * @param state - Current FSM state
 * @returns Visual state string for data-visual-state attribute
 */
export function getCarouselVisualState(state: CarouselFSMState): CarouselVisualState {
  return state.visualState;
}
