/**
 * @file Layout utilities barrel export
 * @module @dsai/react/utils/layout
 *
 * Enterprise-grade layout and measurement utilities.
 * All utilities are SSR-safe and provide cleanup functions where applicable.
 */

// Element bounds and viewport measurements
export { boundsIntersect, getElementBounds, isInViewport } from './getElementBounds';
export type { ElementBounds, GetElementBoundsOptions } from './getElementBounds';

export { getDocumentSize, getScrollProgress, getViewportSize } from './getViewportSize';
export type { DocumentSize, GetViewportSizeOptions, ViewportSize } from './getViewportSize';

// ResizeObserver wrapper
export { observeResize, observeResizeMany } from './observeResize';
export type {
  ObserveResizeOptions,
  ResizeCallback,
  ResizeCleanup,
  ResizeEntry,
} from './observeResize';

// Animation frame scheduling
export { scheduleFrame, scheduleFrameAfter, startLoop } from './scheduleFrame';
export type { FrameCallback, FrameCleanup, FrameInfo, LoopCallback } from './scheduleFrame';

// Frame throttling
export { rafThrottle, throttleFrame } from './throttleFrame';
export type { ThrottleFrameOptions, ThrottledFrameFunction } from './throttleFrame';
