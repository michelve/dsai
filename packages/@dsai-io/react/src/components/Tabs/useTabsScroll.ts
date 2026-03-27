import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

import type { TabsOrientation } from './Tabs.types';

const SCROLL_AMOUNT = 200;

export interface UseTabsScrollOptions {
  enabled: boolean;
  orientation: TabsOrientation;
}

export interface UseTabsScrollReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  canScrollStart: boolean;
  canScrollEnd: boolean;
  scrollToStart: () => void;
  scrollToEnd: () => void;
}

export function useTabsScroll({
  enabled,
  orientation,
}: UseTabsScrollOptions): UseTabsScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd] = useState(false);

  const isHorizontal = orientation === 'horizontal';

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      setCanScrollStart(false);
      setCanScrollEnd(false);
      return;
    }

    if (isHorizontal) {
      setCanScrollStart(container.scrollLeft > 0);
      setCanScrollEnd(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    } else {
      setCanScrollStart(container.scrollTop > 0);
      setCanScrollEnd(
        container.scrollTop < container.scrollHeight - container.clientHeight - 1
      );
    }
  }, [enabled, isHorizontal]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      return;
    }

    // Defer initial measurement to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(updateScrollState);

    container.addEventListener('scroll', updateScrollState, { passive: true });

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
    };
  }, [enabled, updateScrollState]);

  const scrollToStart = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (isHorizontal) {
      container.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    } else {
      container.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' });
    }
  }, [isHorizontal]);

  const scrollToEnd = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (isHorizontal) {
      container.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    } else {
      container.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' });
    }
  }, [isHorizontal]);

  return {
    containerRef,
    canScrollStart,
    canScrollEnd,
    scrollToStart,
    scrollToEnd,
  };
}
