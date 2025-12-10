/**
 * @file memoize - General-purpose function memoization
 * @module @dsai/react/utils/collections
 *
 * Enterprise-grade memoization utility for caching function results.
 * Supports custom cache keys, cache size limits, and TTL.
 *
 * Features:
 * - Configurable cache key generation
 * - LRU cache with size limits
 * - Optional TTL (time-to-live)
 * - Cache inspection and clearing
 * - SSR-safe (no DOM dependencies)
 * - TypeScript-friendly with preserved signatures
 */

/**
 * Options for memoization
 */
export interface MemoizeOptions<Args extends unknown[]> {
  /**
   * Custom function to generate cache key from arguments.
   * Default uses JSON.stringify for all arguments.
   */
  cacheKeyFn?: (...args: Args) => string;

  /**
   * Maximum number of cached results (LRU eviction).
   * @default Infinity (no limit)
   */
  maxSize?: number;

  /**
   * Time-to-live in milliseconds for cached results.
   * @default Infinity (no expiration)
   */
  ttl?: number;

  /**
   * Whether to use WeakMap for object arguments.
   * Only works when first argument is an object.
   * @default false
   */
  weakMap?: boolean;
}

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

/**
 * Memoized function with cache control methods
 */
export interface MemoizedFunction<T extends (...args: unknown[]) => unknown> {
  /**
   * Call the memoized function
   */
  (...args: Parameters<T>): ReturnType<T>;

  /**
   * Clear all cached results
   */
  clear(): void;

  /**
   * Delete a specific cached result by arguments
   */
  delete(...args: Parameters<T>): boolean;

  /**
   * Check if a result is cached for the given arguments
   */
  has(...args: Parameters<T>): boolean;

  /**
   * Get the current cache size
   */
  readonly size: number;

  /**
   * Get cache statistics
   */
  readonly stats: {
    readonly hits: number;
    readonly misses: number;
    readonly hitRate: number;
  };
}

/**
 * Memoizes a function by caching its results based on arguments.
 * Subsequent calls with the same arguments return cached results.
 *
 * @param fn - The function to memoize
 * @param options - Memoization configuration
 * @returns Memoized function with cache control methods
 *
 * @example
 * ```tsx
 * // Basic usage
 * const expensiveCalculation = (n: number) => {
 *   console.log('Computing...');
 *   return n * 2;
 * };
 *
 * const memoized = memoize(expensiveCalculation);
 *
 * memoized(5); // Logs 'Computing...', returns 10
 * memoized(5); // Returns 10 (cached, no log)
 * memoized(3); // Logs 'Computing...', returns 6
 *
 * // With custom cache key
 * const fetchUser = memoize(
 *   (id: string, options?: { refresh?: boolean }) => fetchUserApi(id),
 *   { cacheKeyFn: (id) => id } // Only cache by ID, ignore options
 * );
 *
 * // With size limit (LRU eviction)
 * const limitedCache = memoize(expensiveFn, { maxSize: 100 });
 *
 * // With TTL
 * const timedCache = memoize(fetchData, { ttl: 60000 }); // 1 minute
 *
 * // Cache management
 * const cached = memoize(fn);
 * cached.clear();        // Clear all cache
 * cached.has(arg);       // Check if cached
 * cached.delete(arg);    // Delete specific entry
 * cached.size;           // Get cache size
 * cached.stats;          // Get hit/miss statistics
 * ```
 *
 * @throws {TypeError} If fn is not a function
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: MemoizeOptions<Parameters<T>> = {}
): MemoizedFunction<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('memoize: Expected a function');
  }

  const { cacheKeyFn = defaultCacheKey, maxSize = Infinity, ttl = Infinity } = options;

  // Use Map for cache (maintains insertion order for LRU)
  const cache = new Map<string, CacheEntry<ReturnType<T>>>();

  // Statistics
  let hits = 0;
  let misses = 0;

  /**
   * Check if entry is expired
   */
  function isExpired(entry: CacheEntry<ReturnType<T>>): boolean {
    if (ttl === Infinity) {
      return false;
    }
    return Date.now() - entry.timestamp > ttl;
  }

  /**
   * Evict oldest entries if over size limit
   */
  function enforceMaxSize(): void {
    while (cache.size > maxSize) {
      // Delete oldest entry (first key in Map iteration order)
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) {
        cache.delete(oldestKey);
      }
    }
  }

  /**
   * Move entry to end (most recently used) for LRU
   */
  function touchEntry(key: string, entry: CacheEntry<ReturnType<T>>): void {
    cache.delete(key);
    cache.set(key, entry);
  }

  const memoized = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = cacheKeyFn(...args);

    // Check cache
    if (cache.has(key)) {
      const entry = cache.get(key)!;

      // Check expiration
      if (!isExpired(entry)) {
        hits++;
        // Update access order for LRU
        touchEntry(key, entry);
        return entry.value;
      }

      // Remove expired entry
      cache.delete(key);
    }

    // Cache miss - compute value
    misses++;
    const value = fn.apply(this, args) as ReturnType<T>;

    // Store in cache
    cache.set(key, {
      value,
      timestamp: Date.now(),
    });

    // Enforce size limit
    if (cache.size > maxSize) {
      enforceMaxSize();
    }

    return value;
  } as MemoizedFunction<T>;

  // Add cache control methods
  memoized.clear = () => {
    cache.clear();
    hits = 0;
    misses = 0;
  };

  memoized.delete = (...args: Parameters<T>): boolean => {
    const key = cacheKeyFn(...args);
    return cache.delete(key);
  };

  memoized.has = (...args: Parameters<T>): boolean => {
    const key = cacheKeyFn(...args);
    const entry = cache.get(key);
    if (!entry) {
      return false;
    }
    if (isExpired(entry)) {
      cache.delete(key);
      return false;
    }
    return true;
  };

  Object.defineProperty(memoized, 'size', {
    get: () => cache.size,
  });

  Object.defineProperty(memoized, 'stats', {
    get: () => {
      const total = hits + misses;
      return {
        hits,
        misses,
        hitRate: total === 0 ? 0 : hits / total,
      };
    },
  });

  return memoized;
}

/**
 * Default cache key generator using JSON.stringify
 */
function defaultCacheKey(...args: unknown[]): string {
  if (args.length === 0) {
    return '[]';
  }
  if (args.length === 1) {
    const arg = args[0];
    // Fast path for primitives
    if (arg === null) {
      return 'null';
    }
    if (arg === undefined) {
      return 'undefined';
    }
    if (typeof arg === 'string') {
      return `"${arg}"`;
    }
    if (typeof arg === 'number' || typeof arg === 'boolean') {
      return String(arg);
    }
  }

  try {
    return JSON.stringify(args);
  } catch {
    // Fallback for circular references or non-serializable values
    return args
      .map((arg) => {
        if (arg === null) {
          return 'null';
        }
        if (arg === undefined) {
          return 'undefined';
        }
        if (typeof arg === 'object') {
          return `[object]${Object.keys(arg as object).join(',')}`;
        }
        return String(arg);
      })
      .join(',');
  }
}

/**
 * Creates a memoization decorator for class methods
 *
 * @param options - Memoization options
 * @returns Method decorator
 *
 * @example
 * ```tsx
 * class Calculator {
 *   @memoizeMethod({ maxSize: 100 })
 *   fibonacci(n: number): number {
 *     if (n <= 1) return n;
 *     return this.fibonacci(n - 1) + this.fibonacci(n - 2);
 *   }
 * }
 * ```
 */
export function memoizeMethod<Args extends unknown[]>(
  options: MemoizeOptions<Args> = {}
): MethodDecorator {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    if (typeof originalMethod !== 'function') {
      throw new TypeError('memoizeMethod can only decorate methods');
    }

    // Use WeakMap to store per-instance caches
    type MemoizedFn = MemoizedFunction<(...args: unknown[]) => unknown>;
    const instanceCaches = new WeakMap<object, MemoizedFn>();

    descriptor.value = function (this: object, ...args: unknown[]) {
      let memoized = instanceCaches.get(this);

      if (!memoized) {
        memoized = memoize(
          originalMethod.bind(this) as (...args: unknown[]) => unknown,
          options as MemoizeOptions<unknown[]>
        );
        instanceCaches.set(this, memoized);
      }

      return memoized(...args);
    };

    return descriptor;
  };
}
