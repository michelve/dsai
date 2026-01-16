import { useEffect, useRef, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseResizeObserverOptions, UseResizeObserverReturn } from './useResizeObserver.types';

/**
 * Observes element size changes using ResizeObserver API.
 *
 * This hook provides a performant way to track element dimensions, essential
 * for responsive components, canvas sizing, virtualization, and layout calculations.
 *
 * **Key Features**:
 * - Observes width and height changes
 * - Supports different box models (content-box, border-box)
 * - SSR-safe (no ResizeObserver on server)
 * - Automatic cleanup
 * - Change callback support
 * - Generic element type support
 *
 * **Use Cases**:
 * - Responsive component layouts
 * - Canvas/chart sizing
 * - Virtual scrolling dimensions
 * - Container queries polyfill
 * - Text truncation based on size
 *
 * @template T - The type of HTML element (defaults to HTMLElement)
 * @param options - Configuration options
 * @returns Object with ref, width, height, and entry
 *
 * @example
 * ```tsx
 * function ResponsiveCard() {
 *   const { ref, width } = useResizeObserver<HTMLDivElement>();
 *
 *   return (
 *     <div ref={ref}>
 *       {width && width < 300 ? (
 *         <CompactView />
 *       ) : (
 *         <ExpandedView />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Canvas that resizes with container
 * function ResponsiveCanvas() {
 *   const { ref, width, height } = useResizeObserver<HTMLDivElement>();
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   useEffect(() => {
 *     if (!canvasRef.current || !width || !height) return;
 *     const ctx = canvasRef.current.getContext('2d');
 *     // Redraw with new dimensions
 *     draw(ctx, width, height);
 *   }, [width, height]);
 *
 *   return (
 *     <div ref={ref} style={{ width: '100%', height: '100%' }}>
 *       <canvas ref={canvasRef} width={width} height={height} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With callback for analytics
 * function TrackedContainer() {
 *   const { ref, width, height } = useResizeObserver({
 *     onResize: (entry) => {
 *       const { width, height } = entry.contentRect;
 *       analytics.track('container_resized', { width, height });
 *     },
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       Container size: {width} x {height}
 *     </div>
 *   );
 * }
 * ```
 */
export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  options: UseResizeObserverOptions = {}
): UseResizeObserverReturn<T> {
  const { box = 'content-box', onResize, enabled = true } = options;

  const ref = useRef<T | null>(null);
  const internalRef = useRef<T | null>(null);
  const isMounted = useRef(true);
  const [entry, setEntry] = useState<ResizeObserverEntry>();
  const [target, setTarget] = useState<T | null>(null);

  const width = entry?.contentRect.width;
  const height = entry?.contentRect.height;

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
      set: (value: T | null) => {
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
  }, []);

  useEffect(() => {
    if (!isBrowser() || !enabled) {
      return;
    }

    if (!target) {
      return;
    }

    // Check if ResizeObserver is supported
    if (!('ResizeObserver' in window)) {
      console.warn('ResizeObserver is not supported in this browser');
      return;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entryData = entries[0];
      if (!entryData) {
        return;
      }

      setEntry(entryData);
      onResize?.(entryData);
    });

    observer.observe(target, { box });

    return () => {
      observer.disconnect();
    };
  }, [target, box, onResize, enabled]);

  return { ref, width, height, entry };
}
