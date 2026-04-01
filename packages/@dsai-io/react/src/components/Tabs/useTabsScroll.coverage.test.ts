/**
 * useTabsScroll Coverage Tests
 *
 * Tests horizontal/vertical orientation, ResizeObserver, scroll state
 * calculation, scrollToStart/scrollToEnd, and null container handling.
 */

import { act, renderHook } from '@testing-library/react';

import { useTabsScroll } from './useTabsScroll';

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;
  static instances: MockResizeObserver[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

beforeAll(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  MockResizeObserver.instances = [];
  jest.restoreAllMocks();
});

describe('useTabsScroll', () => {
  describe('When disabled', () => {
    it('returns false for both canScrollStart and canScrollEnd', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: false, orientation: 'horizontal' })
      );

      expect(result.current.canScrollStart).toBe(false);
      expect(result.current.canScrollEnd).toBe(false);
    });

    it('does not attach scroll listeners or ResizeObserver', () => {
      renderHook(() => useTabsScroll({ enabled: false, orientation: 'horizontal' }));

      expect(MockResizeObserver.instances).toHaveLength(0);
    });
  });

  describe('When container ref is null', () => {
    it('scrollToStart does nothing when container is null', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'horizontal' })
      );

      // Should not throw
      act(() => {
        result.current.scrollToStart();
      });
    });

    it('scrollToEnd does nothing when container is null', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'horizontal' })
      );

      // Should not throw
      act(() => {
        result.current.scrollToEnd();
      });
    });
  });

  describe('Horizontal orientation', () => {
    it('calls scrollBy with left for scrollToStart', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'horizontal' })
      );

      const mockContainer = {
        scrollLeft: 100,
        scrollWidth: 500,
        clientWidth: 200,
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 100,
        scrollBy: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      // Manually set the ref
      Object.defineProperty(result.current.containerRef, 'current', {
        value: mockContainer,
        writable: true,
      });

      act(() => {
        result.current.scrollToStart();
      });

      expect(mockContainer.scrollBy).toHaveBeenCalledWith({
        left: -200,
        behavior: 'smooth',
      });
    });

    it('calls scrollBy with left for scrollToEnd', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'horizontal' })
      );

      const mockContainer = {
        scrollLeft: 0,
        scrollWidth: 500,
        clientWidth: 200,
        scrollBy: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      Object.defineProperty(result.current.containerRef, 'current', {
        value: mockContainer,
        writable: true,
      });

      act(() => {
        result.current.scrollToEnd();
      });

      expect(mockContainer.scrollBy).toHaveBeenCalledWith({
        left: 200,
        behavior: 'smooth',
      });
    });
  });

  describe('Vertical orientation', () => {
    it('calls scrollBy with top for scrollToStart', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'vertical' })
      );

      const mockContainer = {
        scrollTop: 100,
        scrollHeight: 500,
        clientHeight: 200,
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        scrollBy: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      Object.defineProperty(result.current.containerRef, 'current', {
        value: mockContainer,
        writable: true,
      });

      act(() => {
        result.current.scrollToStart();
      });

      expect(mockContainer.scrollBy).toHaveBeenCalledWith({
        top: -200,
        behavior: 'smooth',
      });
    });

    it('calls scrollBy with top for scrollToEnd', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'vertical' })
      );

      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 500,
        clientHeight: 200,
        scrollBy: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      Object.defineProperty(result.current.containerRef, 'current', {
        value: mockContainer,
        writable: true,
      });

      act(() => {
        result.current.scrollToEnd();
      });

      expect(mockContainer.scrollBy).toHaveBeenCalledWith({
        top: 200,
        behavior: 'smooth',
      });
    });
  });

  describe('Return value structure', () => {
    it('returns containerRef, canScrollStart, canScrollEnd, scrollToStart, scrollToEnd', () => {
      const { result } = renderHook(() =>
        useTabsScroll({ enabled: true, orientation: 'horizontal' })
      );

      expect(result.current).toHaveProperty('containerRef');
      expect(result.current).toHaveProperty('canScrollStart');
      expect(result.current).toHaveProperty('canScrollEnd');
      expect(typeof result.current.scrollToStart).toBe('function');
      expect(typeof result.current.scrollToEnd).toBe('function');
    });
  });
});
