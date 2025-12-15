import { act, renderHook, waitFor } from '@testing-library/react';

import { useResizeObserver } from './useResizeObserver';

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor(
    public callback: ResizeObserverCallback,
    public options?: ResizeObserverOptions
  ) {}

  observe = jest.fn((_target: Element, _options?: ResizeObserverOptions) => {});

  unobserve = jest.fn();
  disconnect = jest.fn();
}

// Store original ResizeObserver
let originalResizeObserver: typeof ResizeObserver;
let originalWindowResizeObserver: typeof ResizeObserver | undefined;
let mockObserverInstance: MockResizeObserver;

beforeAll(() => {
  originalResizeObserver = global.ResizeObserver;
  originalWindowResizeObserver = window.ResizeObserver;
});

beforeEach(() => {
  mockObserverInstance = undefined as unknown as MockResizeObserver;

  const observerFactory = jest.fn((callback) => {
    mockObserverInstance = new MockResizeObserver(callback);
    return mockObserverInstance;
  }) as unknown as typeof ResizeObserver;

  global.ResizeObserver = observerFactory;
  (window as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = observerFactory;
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
  (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver =
    originalWindowResizeObserver;
});

describe('useResizeObserver', () => {
  describe('Basic Functionality', () => {
    it('should return ref, width, height, and entry', () => {
      const { result } = renderHook(() => useResizeObserver());

      expect(result.current).toHaveProperty('ref');
      expect(result.current).toHaveProperty('width');
      expect(result.current).toHaveProperty('height');
      expect(result.current).toHaveProperty('entry');
    });

    it('should initialize with undefined width and height', () => {
      const { result } = renderHook(() => useResizeObserver());

      expect(result.current.width).toBeUndefined();
      expect(result.current.height).toBeUndefined();
      expect(result.current.entry).toBeUndefined();
    });

    it('should create ResizeObserver when element is attached', async () => {
      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.ResizeObserver).toHaveBeenCalled());

      expect(global.ResizeObserver).toHaveBeenCalled();
      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(
        element,
        expect.objectContaining({ box: 'content-box' })
      );
    });

    it('should update width and height when resize occurs', async () => {
      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      // Manually trigger resize
      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 200,
          height: 150,
          top: 0,
          right: 200,
          bottom: 150,
          left: 0,
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });

      await waitFor(() => {
        expect(result.current.width).toBe(200);
        expect(result.current.height).toBe(150);
        expect(result.current.entry).toBeDefined();
      });
    });
  });

  describe('Box Model Option', () => {
    it('should default to content-box', () => {
      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(
        element,
        expect.objectContaining({ box: 'content-box' })
      );
    });

    it('should use border-box when specified', () => {
      const { result, rerender } = renderHook(() => useResizeObserver({ box: 'border-box' }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(
        element,
        expect.objectContaining({ box: 'border-box' })
      );
    });

    it('should use device-pixel-content-box when specified', () => {
      const { result, rerender } = renderHook(() =>
        useResizeObserver({ box: 'device-pixel-content-box' })
      );

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(
        element,
        expect.objectContaining({ box: 'device-pixel-content-box' })
      );
    });
  });

  describe('onResize Callback', () => {
    it('should call onResize when resize occurs', async () => {
      const onResize = jest.fn();
      const { result, rerender } = renderHook(() => useResizeObserver({ onResize }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.ResizeObserver).toHaveBeenCalled());
      await waitFor(() => expect(mockObserverInstance).toBeDefined());
      onResize.mockClear();

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 300,
          height: 200,
          top: 0,
          right: 300,
          bottom: 200,
          left: 0,
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });

      expect(onResize).toHaveBeenCalledWith(mockEntry);
      expect(onResize).toHaveBeenCalledTimes(1);
    });

    it('should call onResize multiple times for multiple resizes', async () => {
      const onResize = jest.fn();
      const { result, rerender } = renderHook(() => useResizeObserver({ onResize }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await waitFor(() => expect(global.ResizeObserver).toHaveBeenCalled());
      await waitFor(() => expect(mockObserverInstance).toBeDefined());
      onResize.mockClear();

      // First resize
      const mockEntry1: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          top: 0,
          right: 100,
          bottom: 100,
          left: 0,
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry1], mockObserverInstance);
      });

      // Second resize
      const mockEntry2: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 200,
          height: 200,
          top: 0,
          right: 200,
          bottom: 200,
          left: 0,
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry2], mockObserverInstance);
      });

      expect(onResize).toHaveBeenCalledTimes(2);
      expect(onResize).toHaveBeenNthCalledWith(1, mockEntry1);
      expect(onResize).toHaveBeenNthCalledWith(2, mockEntry2);
    });
  });

  describe('Enabled Option', () => {
    it('should not create observer when enabled is false', () => {
      const { result, rerender } = renderHook(() => useResizeObserver({ enabled: false }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.ResizeObserver).not.toHaveBeenCalled();
    });

    it('should create observer when enabled is true', () => {
      const { result, rerender } = renderHook(() => useResizeObserver({ enabled: true }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.ResizeObserver).toHaveBeenCalled();
    });

    it('should be enabled by default', () => {
      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(global.ResizeObserver).toHaveBeenCalled();
    });

    it('should disconnect and recreate observer when enabled changes', () => {
      const { result, rerender } = renderHook(({ enabled }) => useResizeObserver({ enabled }), {
        initialProps: { enabled: true },
      });

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender({ enabled: true });
      });

      expect(global.ResizeObserver).toHaveBeenCalled();
      const firstObserver = mockObserverInstance;

      // Disable
      act(() => {
        rerender({ enabled: false });
      });
      expect(firstObserver?.disconnect).toHaveBeenCalled();

      // Re-enable
      act(() => {
        rerender({ enabled: true });
      });
      expect(global.ResizeObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const { result, unmount, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      unmount();

      expect(mockObserverInstance?.disconnect).toHaveBeenCalled();
    });

    it('should disconnect and recreate observer when options change', () => {
      const { result, rerender } = renderHook(({ box }) => useResizeObserver({ box }), {
        initialProps: { box: 'content-box' as ResizeObserverBoxOptions },
      });

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender({ box: 'content-box' as ResizeObserverBoxOptions });
      });

      const firstObserver = mockObserverInstance;

      // Change box option
      act(() => {
        rerender({ box: 'border-box' as ResizeObserverBoxOptions });
      });

      expect(firstObserver?.disconnect).toHaveBeenCalled();
      expect(global.ResizeObserver).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null element ref gracefully', () => {
      expect(() => {
        renderHook(() => useResizeObserver());
      }).not.toThrow();

      expect(global.ResizeObserver).not.toHaveBeenCalled();
    });

    it('should not create observer without element', () => {
      renderHook(() => useResizeObserver());

      expect(global.ResizeObserver).not.toHaveBeenCalled();
    });

    it('should handle empty entries array', async () => {
      const onResize = jest.fn();
      const { result, rerender } = renderHook(() => useResizeObserver({ onResize }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await act(async () => {
        mockObserverInstance?.callback([], mockObserverInstance);
      });

      expect(onResize).not.toHaveBeenCalled();
    });

    it('should handle zero width and height', async () => {
      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      const mockEntry: ResizeObserverEntry = {
        target: element,
        contentRect: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        } as DOMRectReadOnly,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };

      await act(async () => {
        mockObserverInstance?.callback([mockEntry], mockObserverInstance);
      });

      await waitFor(() => {
        expect(result.current.width).toBe(0);
        expect(result.current.height).toBe(0);
      });
    });

    it('should handle rapid resize changes', async () => {
      const onResize = jest.fn();
      const { result, rerender } = renderHook(() => useResizeObserver({ onResize }));

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      await act(async () => {
        for (let i = 0; i < 10; i++) {
          const mockEntry: ResizeObserverEntry = {
            target: element,
            contentRect: {
              x: 0,
              y: 0,
              width: 100 + i * 10,
              height: 100 + i * 10,
              top: 0,
              right: 100 + i * 10,
              bottom: 100 + i * 10,
              left: 0,
            } as DOMRectReadOnly,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          };

          mockObserverInstance?.callback([mockEntry], mockObserverInstance);
        }
      });

      expect(onResize).toHaveBeenCalledTimes(10);
    });
  });

  describe('SSR Safety', () => {
    it('should not throw in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulating SSR
      delete global.window;

      expect(() => {
        renderHook(() => useResizeObserver());
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should warn when ResizeObserver is not supported', () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation();
      // @ts-expect-error - Removing ResizeObserver
      delete global.ResizeObserver;
      // @ts-expect-error - Removing ResizeObserver on window
      delete (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;

      const { result, rerender } = renderHook(() => useResizeObserver());

      const element = document.createElement('div');
      act(() => {
        result.current.ref.current = element;
        rerender();
      });

      expect(consoleWarn).toHaveBeenCalledWith('ResizeObserver is not supported in this browser');

      consoleWarn.mockRestore();
      global.ResizeObserver = originalResizeObserver;
      (window as unknown as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver =
        originalWindowResizeObserver;
    });
  });

  describe('Type Safety', () => {
    it('should accept generic element type', () => {
      const { result } = renderHook(() => useResizeObserver<HTMLDivElement>());

      expect(result.current.ref).toHaveProperty('current');
    });

    it('should work with HTMLCanvasElement', () => {
      const { result, rerender } = renderHook(() => useResizeObserver<HTMLCanvasElement>());

      const canvas = document.createElement('canvas');
      act(() => {
        result.current.ref.current = canvas;
        rerender();
      });

      expect(mockObserverInstance?.observe).toHaveBeenCalledWith(
        canvas,
        expect.objectContaining({ box: 'content-box' })
      );
    });

    it('should accept all valid options', () => {
      expect(() => {
        renderHook(() =>
          useResizeObserver({
            box: 'border-box',
            onResize: jest.fn(),
            enabled: true,
          })
        );
      }).not.toThrow();
    });

    it('should return correct types', () => {
      const { result } = renderHook(() => useResizeObserver());

      expect(result.current.ref).toHaveProperty('current');
      expect(result.current.width === undefined || typeof result.current.width === 'number').toBe(
        true
      );
      expect(result.current.height === undefined || typeof result.current.height === 'number').toBe(
        true
      );
      expect(result.current.entry === undefined || typeof result.current.entry === 'object').toBe(
        true
      );
    });
  });
});
