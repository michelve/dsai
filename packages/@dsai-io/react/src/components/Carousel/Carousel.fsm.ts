import type { CarouselFSMEvent, CarouselFSMState, CarouselVisualState } from './Carousel.types';

type CarouselNavigationEvent = Extract<CarouselFSMEvent, { type: 'NEXT' | 'PREV' | 'GO_TO' }>;
type CarouselPlaybackEvent = Extract<CarouselFSMEvent, { type: 'PLAY' | 'PAUSE' | 'TOGGLE_PAUSE' }>;
type CarouselTransitionOrDragEvent = Extract<
  CarouselFSMEvent,
  { type: 'TRANSITION_START' | 'TRANSITION_END' | 'DRAG_START' | 'DRAG_END' }
>;
type CarouselConfigEvent = Extract<CarouselFSMEvent, { type: 'SET_SLIDE_COUNT' | 'RESET_FROM_PROPS' }>;

const NAVIGATION_EVENT_TYPES: ReadonlySet<string> = new Set(['NEXT', 'PREV', 'GO_TO']);
const PLAYBACK_EVENT_TYPES: ReadonlySet<string> = new Set(['PLAY', 'PAUSE', 'TOGGLE_PAUSE']);
const TRANSITION_EVENT_TYPES: ReadonlySet<string> = new Set(['TRANSITION_START', 'TRANSITION_END', 'DRAG_START', 'DRAG_END']);
const CONFIG_EVENT_TYPES: ReadonlySet<string> = new Set(['SET_SLIDE_COUNT', 'RESET_FROM_PROPS']);

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
/**
 * Handle navigation events (NEXT, PREV, GO_TO)
 */
function handleCarouselNavigation(
  state: CarouselFSMState,
  event: CarouselNavigationEvent,
  wrap: boolean
): CarouselFSMState {
  if (state.isTransitioning) {
    return state;
  }

  let targetIndex: number;

  switch (event.type) {
    case 'NEXT':
      targetIndex = computeNextIndex(state.activeIndex, state.slideCount, wrap);
      break;
    case 'PREV':
      targetIndex = computePrevIndex(state.activeIndex, state.slideCount, wrap);
      break;
    case 'GO_TO': {
      targetIndex = event.payload;
      if (targetIndex < 0 || targetIndex >= state.slideCount) {
        return state;
      }
      break;
    }
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

/**
 * Handle playback events (PLAY, PAUSE, TOGGLE_PAUSE)
 */
function handleCarouselPlayback(
  state: CarouselFSMState,
  event: CarouselPlaybackEvent
): CarouselFSMState {
  let nextState: CarouselFSMState;

  switch (event.type) {
    case 'PLAY':
      nextState = { ...state, isPlaying: true, isPaused: false };
      break;
    case 'PAUSE':
      nextState = { ...state, isPaused: true };
      break;
    case 'TOGGLE_PAUSE':
      nextState = { ...state, isPaused: !state.isPaused };
      break;
  }

  nextState.visualState = deriveVisualState(nextState);
  return nextState;
}

/**
 * Handle transition and drag events
 */
function handleCarouselTransitionOrDrag(
  state: CarouselFSMState,
  event: CarouselTransitionOrDragEvent
): CarouselFSMState {
  let nextState: CarouselFSMState;

  switch (event.type) {
    case 'TRANSITION_START':
      nextState = { ...state, isTransitioning: true };
      break;
    case 'TRANSITION_END':
      nextState = { ...state, isTransitioning: false };
      break;
    case 'DRAG_START':
      nextState = {
        ...state,
        isDragging: true,
        isPaused: state.isPlaying ? true : state.isPaused,
      };
      break;
    case 'DRAG_END':
      nextState = {
        ...state,
        isDragging: false,
        isPaused: state.isPlaying ? false : state.isPaused,
      };
      break;
  }

  nextState.visualState = deriveVisualState(nextState);
  return nextState;
}

/**
 * Handle configuration events (SET_SLIDE_COUNT, RESET_FROM_PROPS)
 */
function handleCarouselConfig(
  state: CarouselFSMState,
  event: CarouselConfigEvent
): CarouselFSMState {
  let nextState: CarouselFSMState;

  if (event.type === 'SET_SLIDE_COUNT') {
    const newCount = event.payload;
    const clampedIndex = newCount > 0 ? Math.min(state.activeIndex, newCount - 1) : 0;
    nextState = { ...state, slideCount: newCount, activeIndex: clampedIndex, prevIndex: clampedIndex };
  } else {
    const { activeIndex, slideCount } = event.payload;
    const clampedIndex = slideCount > 0 ? Math.min(activeIndex, slideCount - 1) : 0;
    nextState = {
      ...state,
      slideCount,
      activeIndex: clampedIndex,
      prevIndex: state.activeIndex === clampedIndex ? state.prevIndex : state.activeIndex,
    };
  }

  nextState.visualState = deriveVisualState(nextState);
  return nextState;
}

export function carouselFSMReducer(
  state: CarouselFSMState,
  event: CarouselFSMEvent,
  wrap = true
): CarouselFSMState {
  if (NAVIGATION_EVENT_TYPES.has(event.type)) {
    return handleCarouselNavigation(state, event as CarouselNavigationEvent, wrap);
  }
  if (PLAYBACK_EVENT_TYPES.has(event.type)) {
    return handleCarouselPlayback(state, event as CarouselPlaybackEvent);
  }
  if (TRANSITION_EVENT_TYPES.has(event.type)) {
    return handleCarouselTransitionOrDrag(state, event as CarouselTransitionOrDragEvent);
  }
  if (CONFIG_EVENT_TYPES.has(event.type)) {
    return handleCarouselConfig(state, event as CarouselConfigEvent);
  }
  return state;
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
