import { renderHook } from '@testing-library/react';

import { useTabsScroll } from '../useTabsScroll';

describe('useTabsScroll', () => {
  it('returns scroll state and handlers', () => {
    const { result } = renderHook(() =>
      useTabsScroll({ enabled: true, orientation: 'horizontal' })
    );

    expect(result.current.canScrollStart).toBe(false);
    expect(result.current.canScrollEnd).toBe(false);
    expect(typeof result.current.scrollToStart).toBe('function');
    expect(typeof result.current.scrollToEnd).toBe('function');
    expect(result.current.containerRef).toBeDefined();
  });

  it('returns disabled state when not enabled', () => {
    const { result } = renderHook(() =>
      useTabsScroll({ enabled: false, orientation: 'horizontal' })
    );

    expect(result.current.canScrollStart).toBe(false);
    expect(result.current.canScrollEnd).toBe(false);
  });
});
