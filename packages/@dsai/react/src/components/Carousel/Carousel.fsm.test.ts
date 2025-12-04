import { carouselFSMReducer, createInitialCarouselFSMState } from './Carousel.fsm';

import type { CarouselFSMEvent, CarouselFSMState } from './Carousel.types';

describe('Carousel FSM', () => {
  describe('createInitialCarouselFSMState', () => {
    it('creates initial state with defaults', () => {
      const state = createInitialCarouselFSMState();

      expect(state).toEqual({
        visualState: 'idle',
        activeIndex: 0,
        prevIndex: 0,
        isPlaying: false,
        isPaused: false,
        isTransitioning: false,
        isDragging: false,
        slideCount: 0,
      });
    });

    it('creates initial state with custom values', () => {
      const state = createInitialCarouselFSMState(2, 5, true);

      expect(state).toEqual({
        visualState: 'playing',
        activeIndex: 2,
        prevIndex: 2,
        isPlaying: true,
        isPaused: false,
        isTransitioning: false,
        isDragging: false,
        slideCount: 5,
      });
    });
  });

  describe('carouselFSMReducer', () => {
    let initialState: CarouselFSMState;

    beforeEach(() => {
      initialState = createInitialCarouselFSMState(0, 5, false);
    });

    describe('NEXT event', () => {
      it('advances to next slide', () => {
        const state = carouselFSMReducer(initialState, { type: 'NEXT' });

        expect(state.activeIndex).toBe(1);
        expect(state.prevIndex).toBe(0);
      });

      it('wraps from last to first when wrap is true', () => {
        const stateAtLast = { ...initialState, activeIndex: 4 };
        const state = carouselFSMReducer(stateAtLast, { type: 'NEXT' }, true);

        expect(state.activeIndex).toBe(0);
      });

      it('stays at last when wrap is false', () => {
        const stateAtLast = { ...initialState, activeIndex: 4 };
        const state = carouselFSMReducer(stateAtLast, { type: 'NEXT' }, false);

        expect(state.activeIndex).toBe(4);
      });

      it('does not navigate while transitioning', () => {
        const transitioning = { ...initialState, isTransitioning: true };
        const state = carouselFSMReducer(transitioning, { type: 'NEXT' });

        expect(state.activeIndex).toBe(0);
      });
    });

    describe('PREV event', () => {
      it('goes to previous slide', () => {
        const stateAt2 = { ...initialState, activeIndex: 2 };
        const state = carouselFSMReducer(stateAt2, { type: 'PREV' });

        expect(state.activeIndex).toBe(1);
        expect(state.prevIndex).toBe(2);
      });

      it('wraps from first to last when wrap is true', () => {
        const state = carouselFSMReducer(initialState, { type: 'PREV' }, true);

        expect(state.activeIndex).toBe(4);
      });

      it('stays at first when wrap is false', () => {
        const state = carouselFSMReducer(initialState, { type: 'PREV' }, false);

        expect(state.activeIndex).toBe(0);
      });

      it('does not navigate while transitioning', () => {
        const transitioning = { ...initialState, isTransitioning: true, activeIndex: 2 };
        const state = carouselFSMReducer(transitioning, { type: 'PREV' });

        expect(state.activeIndex).toBe(2);
      });
    });

    describe('GO_TO event', () => {
      it('goes to specific slide', () => {
        const state = carouselFSMReducer(initialState, { type: 'GO_TO', payload: 3 });

        expect(state.activeIndex).toBe(3);
        expect(state.prevIndex).toBe(0);
      });

      it('ignores invalid index (negative)', () => {
        const state = carouselFSMReducer(initialState, { type: 'GO_TO', payload: -1 });

        expect(state.activeIndex).toBe(0);
      });

      it('ignores invalid index (out of bounds)', () => {
        const state = carouselFSMReducer(initialState, { type: 'GO_TO', payload: 10 });

        expect(state.activeIndex).toBe(0);
      });

      it('ignores same index', () => {
        const state = carouselFSMReducer(initialState, { type: 'GO_TO', payload: 0 });

        expect(state).toBe(initialState);
      });

      it('does not navigate while transitioning', () => {
        const transitioning = { ...initialState, isTransitioning: true };
        const state = carouselFSMReducer(transitioning, { type: 'GO_TO', payload: 3 });

        expect(state.activeIndex).toBe(0);
      });
    });

    describe('PLAY event', () => {
      it('starts autoplay', () => {
        const state = carouselFSMReducer(initialState, { type: 'PLAY' });

        expect(state.isPlaying).toBe(true);
        expect(state.isPaused).toBe(false);
        expect(state.visualState).toBe('playing');
      });
    });

    describe('PAUSE event', () => {
      it('pauses autoplay', () => {
        const playing = { ...initialState, isPlaying: true, visualState: 'playing' as const };
        const state = carouselFSMReducer(playing, { type: 'PAUSE' });

        expect(state.isPaused).toBe(true);
        expect(state.visualState).toBe('paused');
      });
    });

    describe('TOGGLE_PAUSE event', () => {
      it('toggles pause state', () => {
        const playing = { ...initialState, isPlaying: true, isPaused: false };
        const paused = carouselFSMReducer(playing, { type: 'TOGGLE_PAUSE' });

        expect(paused.isPaused).toBe(true);

        const resumed = carouselFSMReducer(paused, { type: 'TOGGLE_PAUSE' });
        expect(resumed.isPaused).toBe(false);
      });
    });

    describe('TRANSITION_START event', () => {
      it('sets transitioning state', () => {
        const state = carouselFSMReducer(initialState, { type: 'TRANSITION_START' });

        expect(state.isTransitioning).toBe(true);
        expect(state.visualState).toBe('transitioning');
      });
    });

    describe('TRANSITION_END event', () => {
      it('clears transitioning state', () => {
        const transitioning = {
          ...initialState,
          isTransitioning: true,
          visualState: 'transitioning' as const,
        };
        const state = carouselFSMReducer(transitioning, { type: 'TRANSITION_END' });

        expect(state.isTransitioning).toBe(false);
        expect(state.visualState).toBe('idle');
      });
    });

    describe('DRAG_START event', () => {
      it('sets dragging state and pauses if playing', () => {
        const playing = { ...initialState, isPlaying: true, isPaused: false };
        const state = carouselFSMReducer(playing, { type: 'DRAG_START' });

        expect(state.isDragging).toBe(true);
        expect(state.isPaused).toBe(true);
        expect(state.visualState).toBe('dragging');
      });
    });

    describe('DRAG_END event', () => {
      it('clears dragging state and resumes if was playing', () => {
        const dragging = { ...initialState, isPlaying: true, isDragging: true, isPaused: true };
        const state = carouselFSMReducer(dragging, { type: 'DRAG_END' });

        expect(state.isDragging).toBe(false);
        expect(state.isPaused).toBe(false);
      });
    });

    describe('SET_SLIDE_COUNT event', () => {
      it('updates slide count', () => {
        const state = carouselFSMReducer(initialState, { type: 'SET_SLIDE_COUNT', payload: 10 });

        expect(state.slideCount).toBe(10);
      });

      it('clamps activeIndex if it exceeds new count', () => {
        const atIndex4 = { ...initialState, activeIndex: 4 };
        const state = carouselFSMReducer(atIndex4, { type: 'SET_SLIDE_COUNT', payload: 3 });

        expect(state.slideCount).toBe(3);
        expect(state.activeIndex).toBe(2);
      });
    });

    describe('RESET_FROM_PROPS event', () => {
      it('resets state from controlled props', () => {
        const state = carouselFSMReducer(initialState, {
          type: 'RESET_FROM_PROPS',
          payload: { activeIndex: 3, slideCount: 8 },
        });

        expect(state.activeIndex).toBe(3);
        expect(state.slideCount).toBe(8);
        expect(state.prevIndex).toBe(0);
      });
    });

    describe('unknown event', () => {
      it('returns current state for unknown events', () => {
        const state = carouselFSMReducer(initialState, {
          type: 'UNKNOWN',
        } as unknown as CarouselFSMEvent);

        expect(state).toBe(initialState);
      });
    });
  });
});
