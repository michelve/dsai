/**
 * Carousel Component
 *
 * A fully accessible carousel for cycling through images or content.
 *
 * @packageDocumentation
 */

// Main component exports
export { Carousel } from './Carousel';
export { CarouselCaption } from './CarouselCaption';
export { CarouselControl } from './CarouselControl';
export { CarouselIndicators } from './CarouselIndicators';
export { CarouselItem } from './CarouselItem';
export { CarouselPauseButton } from './CarouselPauseButton';

// FSM exports
export {
  carouselFSMReducer,
  createInitialCarouselFSMState,
  getCarouselVisualState,
} from './Carousel.fsm';

// Type exports
export type {
  CarouselAnimation,
  CarouselCaptionProps,
  CarouselControlDirection,
  CarouselControlProps,
  CarouselFSMEvent,
  CarouselFSMState,
  CarouselIndicatorsProps,
  CarouselItemProps,
  CarouselPauseButtonProps,
  CarouselProps,
  CarouselVisualState,
} from './Carousel.types';
