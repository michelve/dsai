import { act, renderHook, waitFor } from '@testing-library/react';

import { useIntersectionObserver } from './useIntersectionObserver';

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    this.root = options?.root instanceof Element ? options.root : null;
    this.rootMargin = options?.rootMargin ?? '';
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold ?? 0];
  }

  observe = jest.fn((target: Element) => {
    // Automatically trigger callback after a short delay
    setTimeout(() => {
      const entry: IntersectionObserverEntry = {
        target,
        isIntersecting: false,
        intersectionRatio: 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };
      this.callback([entry], this);
    }, 0);
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

// Store original IntersectionObserver
let originalIntersectionObserver: typeof IntersectionObserver;
let mockObserverInstance: MockIntersectionObserver;

beforeAll(() => {
  originalIntersectionObserver = global.IntersectionObserver;
});

beforeEach(() => {
  mockObserverInstance = undefined as unknown as MockIntersectionObserver;

  const observerFactory = jest.fn((callback, options) => {
    mockObserverInstance = new MockIntersectionObserver(callback, options);
    return mockObserverInstance;
  }) as unknown as typeof IntersectionObserver;

  global.IntersectionObserver = observerFactory;
  // Ensure window has the mock so the hook's feature detection passes
  (
    window as unknown as { IntersectionObserver: typeof IntersectionObserver }
  ).IntersectionObserver = observerFactory;
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  global.IntersectionObserver = originalIntersectionObserver;
});

describe('useIntersectionObserver', () => {
  describe('Basic Functionality', () => {
    it('should return ref, entry, and isIntersecting', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current).toHaveProperty('ref');
      expect(result.current).toHaveProperty('entry');
      expect(result.current).toHaveProperty('isIntersecting');
      expect(typeof result.current.isIntersecting).toBe('boolean');
    });

    it('should initialize with isIntersecting as false', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.isIntersecting).toBe(false);
      expect(result.current.entry).toBeUndefined();
    });

    it('should create IntersectionObserver when element is attached', async () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());
      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(element);
    });

    it('should update entry when intersection occurs', async () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      // Manually trigger intersection
      const mockEntry: IntersectionObserverEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1.0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });
      rerender();

      expect(result.current.entry).toBeDefined();
      expect(result.current.isIntersecting).toBe(true);
    });
  });

  describe('Threshold Option', () => {
    it('should pass threshold to IntersectionObserver', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver({ threshold: 0.5 }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0.5 })
      );
    });

    it('should support array of thresholds', () => {
      const { result, rerender } = renderHook(() =>
        useIntersectionObserver({ threshold: [0, 0.5, 1.0] })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: [0, 0.5, 1.0] })
      );
    });

    it('should default threshold to 0', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0 })
      );
    });
  });

  describe('Root and RootMargin Options', () => {
    it('should pass root to IntersectionObserver', () => {
      const rootElement = document.createElement('div');
      const { result, rerender } = renderHook(() => useIntersectionObserver({ root: rootElement }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ root: rootElement })
      );
    });

    it('should pass rootMargin to IntersectionObserver', () => {
      const { result, rerender } = renderHook(() =>
        useIntersectionObserver({ rootMargin: '100px' })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ rootMargin: '100px' })
      );
    });

    it('should default rootMargin to 0px', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ rootMargin: '0px' })
      );
    });
  });

  describe('Freeze Once Visible', () => {
    it('should disconnect observer once element becomes visible when freezeOnceVisible is true', async () => {
      const { result, rerender } = renderHook(() =>
        useIntersectionObserver({ freezeOnceVisible: true })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      // Simulate element becoming visible
      const mockEntry: IntersectionObserverEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1.0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });
      rerender();

      expect(mockObserverInstance?.disconnect).toHaveBeenCalled();
    });

    it('should not disconnect observer when element is not intersecting', async () => {
      const { result, rerender } = renderHook(() =>
        useIntersectionObserver({ freezeOnceVisible: true })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      // Simulate element not visible
      const mockEntry: IntersectionObserverEntry = {
        target: element,
        isIntersecting: false,
        intersectionRatio: 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });
      rerender();

      expect(mockObserverInstance?.disconnect).not.toHaveBeenCalled();
    });

    it('should continue observing when freezeOnceVisible is false', async () => {
      const { result, rerender } = renderHook(() =>
        useIntersectionObserver({ freezeOnceVisible: false })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      // Simulate element becoming visible
      const mockEntry: IntersectionObserverEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1.0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      mockObserverInstance?.disconnect.mockClear();
      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });
      rerender();

      // Should not disconnect when freezeOnceVisible is false
      expect(mockObserverInstance?.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when intersection occurs', async () => {
      const onChange = jest.fn();
      const { result, rerender } = renderHook(() => useIntersectionObserver({ onChange }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      await waitFor(() => expect(onChange).toHaveBeenCalled());
      onChange.mockClear();

      const mockEntry: IntersectionObserverEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 0.75,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });

      expect(onChange).toHaveBeenCalledWith(mockEntry);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange multiple times without freezeOnceVisible', async () => {
      const onChange = jest.fn();
      const { result, rerender } = renderHook(() => useIntersectionObserver({ onChange }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.IntersectionObserver).toHaveBeenCalled());

      await waitFor(() => expect(onChange).toHaveBeenCalled());
      onChange.mockClear();

      // First intersection
      const mockEntry1: IntersectionObserverEntry = {
        target: element,
        isIntersecting: true,
        intersectionRatio: 1.0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry1], mockObserverInstance);
      });

      // Second intersection
      const mockEntry2: IntersectionObserverEntry = {
        target: element,
        isIntersecting: false,
        intersectionRatio: 0,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now() + 100,
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry2], mockObserverInstance);
      });

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(1, mockEntry1);
      expect(onChange).toHaveBeenNthCalledWith(2, mockEntry2);
    });
  });

  describe('Enabled Option', () => {
    it('should not create observer when enabled is false', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver({ enabled: false }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    it('should create observer when enabled is true', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver({ enabled: true }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('should be enabled by default', () => {
      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const { result, unmount, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.IntersectionObserver).toHaveBeenCalled();

      unmount();

      expect(mockObserverInstance?.disconnect).toHaveBeenCalled();
    });

    it('should disconnect and recreate observer when options change', () => {
      const { result, rerender } = renderHook(
        ({ threshold }) => useIntersectionObserver({ threshold }),
        { initialProps: { threshold: 0 } }
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender({ threshold: 0 });
      });

      const firstObserver = mockObserverInstance;

      // Change threshold
      rerender({ threshold: 0.5 });

      expect(firstObserver?.disconnect).toHaveBeenCalled();
      expect(global.IntersectionObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null element ref gracefully', () => {
      expect(() => {
        renderHook(() => useIntersectionObserver());
      }).not.toThrow();

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    it('should not create observer without element', () => {
      renderHook(() => useIntersectionObserver());

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });

    it('should handle empty entries array', async () => {
      const onChange = jest.fn();
      const { result, rerender } = renderHook(() => useIntersectionObserver({ onChange }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await act(async () => {
        mockObserverInstance?.callback([], mockObserverInstance);
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('SSR Safety', () => {
    it('should not throw in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulating SSR
      delete global.window;

      expect(() => {
        renderHook(() => useIntersectionObserver());
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should warn when IntersectionObserver is not supported', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
      // @ts-expect-error - Removing IntersectionObserver
      delete global.IntersectionObserver;

      const { result, rerender } = renderHook(() => useIntersectionObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(consoleWarn).toHaveBeenCalledWith(
        'IntersectionObserver is not supported in this browser'
      );

      consoleWarn.mockRestore();
      global.IntersectionObserver = originalIntersectionObserver;
    });
  });

  describe('Type Safety', () => {
    it('should accept all valid options', () => {
      const rootElement = document.createElement('div');

      expect(() => {
        renderHook(() =>
          useIntersectionObserver({
            threshold: 0.5,
            root: rootElement,
            rootMargin: '10px',
            freezeOnceVisible: true,
            onChange: jest.fn(),
            enabled: true,
          })
        );
      }).not.toThrow();
    });

    it('should return correct types', () => {
      const { result } = renderHook(() => useIntersectionObserver());

      expect(result.current.ref).toHaveProperty('current');
      expect(typeof result.current.isIntersecting).toBe('boolean');
      expect(result.current.entry === undefined || typeof result.current.entry === 'object').toBe(
        true
      );
    });
  });
});
