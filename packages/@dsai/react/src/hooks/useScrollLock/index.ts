/**
 * useScrollLock Hook
 *
 * A React hook that locks/unlocks scrolling on the document body or a custom element.
 * Supports multiple overlays (stacking), scrollbar width compensation, and SSR.
 *
 * @module hooks/useScrollLock
 */

export { useScrollLock } from './useScrollLock';
export type {
  UseScrollLockOptions,
  UseScrollLockReturn,
  UseScrollLockTarget,
} from './useScrollLock.types';
