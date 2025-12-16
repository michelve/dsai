import { act, renderHook } from '@testing-library/react';

import * as browserUtils from '../../utils/browser/isBrowser';

import { useMediaQuery } from './useMediaQuery';
import { useIsDesktop, useIsLargeDesktop, useIsMobile, useIsTablet } from './useMediaQuery.helpers';

/**
 * Mock MediaQueryList for testing
 */
class MockMediaQueryList {
  private listeners: Array<(event: MediaQueryListEvent) => void> = [];
  public matches: boolean;
  public media: string;

  constructor(query: string, matches = false) {
    this.media = query;
    this.matches = matches;
  }

  addEventListener(_event: string, listener: (event: MediaQueryListEvent) => void): void {
    this.listeners.push(listener);
  }

  removeEventListener(_event: string, listener: (event: MediaQueryListEvent) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Helper to simulate media query changes
  triggerChange(matches: boolean): void {
    this.matches = matches;
    const event = { matches, media: this.media } as MediaQueryListEvent;
    act(() => {
      for (const listener of this.listeners) {
        listener(event);
      }
    });
  }

  // For legacy support (not used in our implementation)
  addListener(): void {}
  removeListener(): void {}
  dispatchEvent(): boolean {
    return true;
  }
  onchange = null;
}

const originalMatchMedia = window.matchMedia;

// Setup matchMedia mock globally before all tests
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => {
      return new MockMediaQueryList(query, false) as unknown as MediaQueryList;
    }),
  });
});

describe('useMediaQuery', () => {
  let matchMediaSpy: ReturnType<typeof jest.spyOn>;
  let mockMediaQueryList: MockMediaQueryList;

  beforeEach(() => {
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = originalMatchMedia ?? jest.fn();
    }

    // Create a fresh mock for each test
    mockMediaQueryList = new MockMediaQueryList('(max-width: 768px)', false);

    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      mockMediaQueryList.media = query;
      return mockMediaQueryList as unknown as MediaQueryList;
    });
  });

  afterEach(() => {
    matchMediaSpy?.mockRestore();
    window.matchMedia = originalMatchMedia;
  });

  describe('Basic Functionality', () => {
    it('should return true when media query matches', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true);
    });

    it('should return false when media query does not match', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);
    });

    it('should accept any valid CSS media query string', () => {
      const queries = [
        '(max-width: 768px)',
        '(min-width: 992px)',
        '(prefers-color-scheme: dark)',
        '(orientation: portrait)',
        '(hover: hover)',
      ];

      for (const query of queries) {
        mockMediaQueryList.matches = true;
        const { result } = renderHook(() => useMediaQuery(query));
        expect(result.current).toBe(true);
      }
    });
  });

  describe('Reactive Updates', () => {
    it('should update when media query match status changes', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      // Simulate viewport resize that makes the query match
      mockMediaQueryList.triggerChange(true);

      expect(result.current).toBe(true);
    });

    it('should update when match status changes from true to false', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true);

      // Simulate viewport resize that makes the query not match
      mockMediaQueryList.triggerChange(false);

      expect(result.current).toBe(false);
    });

    it('should handle multiple updates', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      mockMediaQueryList.triggerChange(true);
      expect(result.current).toBe(true);

      mockMediaQueryList.triggerChange(false);
      expect(result.current).toBe(false);

      mockMediaQueryList.triggerChange(true);
      expect(result.current).toBe(true);
    });
  });

  describe('SSR Safety', () => {
    it('should return default value (false) during SSR', () => {
      const isBrowserSpy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      isBrowserSpy.mockRestore();
    });

    it('should return custom default value during SSR', () => {
      const isBrowserSpy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);

      const { result } = renderHook(() =>
        useMediaQuery('(prefers-color-scheme: dark)', { defaultValue: true })
      );

      expect(result.current).toBe(true);

      isBrowserSpy.mockRestore();
    });

    it('should not crash when window.matchMedia is unavailable', () => {
      matchMediaSpy.mockRestore();
      const isBrowserSpy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(true);
      const originalMatch = window.matchMedia;
      // @ts-expect-error - simulate missing API
      window.matchMedia = undefined;

      expect(() => {
        renderHook(() => useMediaQuery('(max-width: 768px)'));
      }).not.toThrow();

      window.matchMedia = originalMatch;
      isBrowserSpy.mockRestore();
    });
  });

  describe('Cleanup', () => {
    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(mockMediaQueryList.listeners.length).toBe(1);

      unmount();

      expect(mockMediaQueryList.listeners.length).toBe(0);
    });

    it('should not update after unmount', () => {
      const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      const initialValue = result.current;

      unmount();

      // Try to trigger change after unmount
      mockMediaQueryList.triggerChange(!initialValue);

      // Value should not have changed since component is unmounted
      expect(result.current).toBe(initialValue);
    });

    it('should handle rapid mount/unmount cycles', () => {
      const { unmount: unmount1 } = renderHook(() => useMediaQuery('(max-width: 768px)'));
      unmount1();

      const { result: result2, unmount: unmount2 } = renderHook(() =>
        useMediaQuery('(max-width: 768px)')
      );

      mockMediaQueryList.triggerChange(true);
      expect(result2.current).toBe(true);

      unmount2();
    });
  });

  describe('Query Changes', () => {
    it('should update when query prop changes', () => {
      let currentQuery = '(max-width: 768px)';

      const { result, rerender } = renderHook(() => useMediaQuery(currentQuery));

      mockMediaQueryList.matches = true;
      mockMediaQueryList.triggerChange(true);
      expect(result.current).toBe(true);

      // Change the query
      currentQuery = '(min-width: 992px)';
      mockMediaQueryList.matches = false;
      rerender();

      expect(result.current).toBe(false);
    });
  });

  describe('Multiple Instances', () => {
    it('should handle multiple hook instances with same query', () => {
      mockMediaQueryList.matches = false;

      const { result: result1 } = renderHook(() => useMediaQuery('(max-width: 768px)'));
      const { result: result2 } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(false);

      mockMediaQueryList.triggerChange(true);

      expect(result1.current).toBe(true);
      expect(result2.current).toBe(true);
    });

    it('should handle multiple hook instances with different queries', () => {
      const { result: result1 } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      // Mock different query
      const mockMediaQueryList2 = new MockMediaQueryList('(min-width: 992px)', true);
      matchMediaSpy.mockImplementation((query: string) => {
        if (query === '(min-width: 992px)') {
          return mockMediaQueryList2 as unknown as MediaQueryList;
        }
        return mockMediaQueryList as unknown as MediaQueryList;
      });

      const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 992px)'));

      expect(result1.current).toBe(false);
      expect(result2.current).toBe(true);
    });
  });
});

describe('Convenience Hooks', () => {
  let matchMediaSpy: ReturnType<typeof jest.spyOn>;
  let mockMediaQueryList: MockMediaQueryList;

  beforeEach(() => {
    if (typeof window.matchMedia !== 'function') {
      window.matchMedia = originalMatchMedia ?? jest.fn();
    }

    mockMediaQueryList = new MockMediaQueryList('', false);
    matchMediaSpy = jest.spyOn(window, 'matchMedia').mockImplementation(() => {
      return mockMediaQueryList as unknown as MediaQueryList;
    });
  });

  afterEach(() => {
    matchMediaSpy?.mockRestore();
    window.matchMedia = originalMatchMedia;
  });

  describe('useIsMobile', () => {
    it('should return true when viewport is mobile (< 768px)', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767.98px)');
    });

    it('should return false when viewport is not mobile', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsMobile());

      expect(result.current).toBe(false);
    });
  });

  describe('useIsTablet', () => {
    it('should return true when viewport is tablet or larger (>= 768px)', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsTablet());

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    });

    it('should return false when viewport is not tablet', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsTablet());

      expect(result.current).toBe(false);
    });
  });

  describe('useIsDesktop', () => {
    it('should return true when viewport is desktop or larger (>= 992px)', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsDesktop());

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 992px)');
    });

    it('should return false when viewport is not desktop', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsDesktop());

      expect(result.current).toBe(false);
    });
  });

  describe('useIsLargeDesktop', () => {
    it('should return true when viewport is large desktop or larger (>= 1200px)', () => {
      mockMediaQueryList.matches = true;

      const { result } = renderHook(() => useIsLargeDesktop());

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1200px)');
    });

    it('should return false when viewport is not large desktop', () => {
      mockMediaQueryList.matches = false;

      const { result } = renderHook(() => useIsLargeDesktop());

      expect(result.current).toBe(false);
    });
  });

  describe('Convenience hooks with options', () => {
    it('should accept and pass through options', () => {
      const isBrowserSpy = jest.spyOn(browserUtils, 'isBrowser').mockReturnValue(false);

      const { result } = renderHook(() => useIsMobile({ defaultValue: true }));

      expect(result.current).toBe(true);

      isBrowserSpy.mockRestore();
    });
  });
});
