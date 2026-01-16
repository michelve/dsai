/**
 * Cache for platform detection functions.
 */
interface PlatformCache {
  _cached?: boolean | string;
}

/**
 * Cached function type.
 */
export type CachedFunction<T> = (() => T) & PlatformCache;
