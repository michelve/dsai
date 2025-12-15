import { useEffect, useRef, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from './useIntersectionObserver.types';

/**
 * Observes element visibility in viewport using IntersectionObserver API.
 *
 * This hook provides a declarative way to detect when an element enters or exits
 * the viewport, perfect for lazy loading, infinite scroll, analytics tracking,
 * and performance optimizations.
 *
 * **Key Features**:
 * - Lazy loading support (freeze once visible)
 * - Custom intersection thresholds
 * - Root margin configuration
 * - Custom root element support
 * - SSR-safe (no IntersectionObserver on server)
 * - Automatic cleanup
 * - Change callback support
 *
 * **Use Cases**:
 * - Image lazy loading
 * - Infinite scroll pagination
 * - Analytics tracking (viewport visibility)
 * - Animating elements on scroll
 * - Performance optimizations (render only visible content)
 *
 * @param options - Configuration options
 * @returns Object with ref, entry, and isIntersecting
 *
 * @example
 * ```tsx
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     freezeOnceVisible: true,
 *     rootMargin: '100px', // Start loading 100px before visible
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting ? (
 *         <img src={src} alt={alt} />
 *       ) : (
 *         <div className="placeholder" />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Infinite scroll pagination
 * function InfiniteList() {
 *   const [items, setItems] = useState(initialItems);
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     threshold: 1.0, // Fully visible
 *   });
 *
 *   useEffect(() => {
 *     if (isIntersecting) {
 *       loadMore().then(newItems => setItems([...items, ...newItems]));
 *     }
 *   }, [isIntersecting]);
 *
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={ref}>Loading...</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Analytics tracking
 * function TrackedSection({ id, children }: { id: string; children: ReactNode }) {
 *   const { ref, entry } = useIntersectionObserver({
 *     threshold: 0.5, // 50% visible
 *     onChange: (entry) => {
 *       if (entry.isIntersecting) {
 *         analytics.track('section_viewed', { id });
 *       }
 *     },
 *   });
 *
 *   return <section ref={ref}>{children}</section>;
 * }
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    onChange,
    enabled = true,
  } = options;

  const ref = useRef<Element | null>(null);
  const internalRef = useRef<Element | null>(null);
  const isMounted = useRef(true);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozen = useRef(false);
  const lastObservedElement = useRef<Element | null>(null);
  const [target, setTarget] = useState<Element | null>(null);

  const isIntersecting = entry?.isIntersecting ?? false;

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  useEffect(() => {
    internalRef.current = ref.current;
    setTarget(ref.current);

    Object.defineProperty(ref, 'current', {
      get: () => internalRef.current,
      set: (value: Element | null) => {
        internalRef.current = value;
        if (isMounted.current) {
          setTarget(value);
        }
      },
      configurable: true,
    });

    return () => {
      Object.defineProperty(ref, 'current', {
        value: internalRef.current,
        writable: true,
        configurable: true,
      });
    };
  }, [ref, setTarget]);

  useEffect(() => {
    if (!isBrowser() || !enabled) {
      return;
    }

    if (!target) {
      lastObservedElement.current = null;
      return;
    }

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    // Reset freeze state when observing a new element
    if (lastObservedElement.current !== target) {
      lastObservedElement.current = target;
      frozen.current = false;
    } else if (frozen.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entryData = entries[0];
        if (!entryData) {
          return;
        }

        setEntry(entryData);
        onChange?.(entryData);

        // Freeze if visible and freezeOnceVisible is true
        if (entryData.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, threshold, root, rootMargin, freezeOnceVisible, onChange, enabled]);

  return { ref, entry, isIntersecting };
}
