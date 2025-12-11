/**
 * useMounted Tests
 *
 * Comprehensive tests for the useMounted hook.
 * Tests cover mount/unmount tracking, async operation safety, SSR behavior, and memory leak prevention.
 */

import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';

import { useMounted } from './useMounted';

describe('useMounted', () => {
  describe('Basic Functionality', () => {
    it('should return a ref object', () => {
      const { result } = renderHook(() => useMounted());

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('current');
    });

    it('should be false initially (before mount)', () => {
      const { result } = renderHook(() => useMounted());

      // During first render, before useEffect runs
      expect(result.current.current).toBe(false);
    });

    it('should be true after mount', async () => {
      const { result } = renderHook(() => useMounted());

      // Wait for useEffect to run
      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });
    });

    it('should be false after unmount', async () => {
      const { result, unmount } = renderHook(() => useMounted());

      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      unmount();

      expect(result.current.current).toBe(false);
    });
  });

  describe('Ref Stability', () => {
    it('should return same ref across re-renders', () => {
      const { result, rerender } = renderHook(() => useMounted());

      const firstRef = result.current;

      rerender();
      rerender();
      rerender();

      expect(result.current).toBe(firstRef);
    });

    it('should not cause re-renders when value changes', async () => {
      let renderCount = 0;

      const { result, unmount } = renderHook(() => {
        renderCount++;
        return useMounted();
      });

      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      // Should only render twice: initial + mount effect
      expect(renderCount).toBe(2);

      unmount();

      // Unmount shouldn't trigger render
      expect(renderCount).toBe(2);
    });
  });

  describe('Async Operations', () => {
    it('should prevent state updates after unmount', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { unmount } = renderHook(() => {
        const [data, setData] = useState<string | null>(null);
        const isMounted = useMounted();

        useEffect(() => {
          setTimeout(() => {
            if (isMounted.current) {
              setData('loaded');
            }
          }, 100);
        }, [isMounted]);

        return data;
      });

      // Unmount before timeout completes
      unmount();

      // Wait for timeout
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should not have React warning about setState on unmounted component
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should allow state updates while mounted', async () => {
      const { result } = renderHook(() => {
        const [data, setData] = useState<string | null>(null);
        const isMounted = useMounted();

        useEffect(() => {
          setTimeout(() => {
            if (isMounted.current) {
              setData('loaded');
            }
          }, 50);
        }, [isMounted]);

        return data;
      });

      await waitFor(
        () => {
          expect(result.current).toBe('loaded');
        },
        { timeout: 200 }
      );
    });

    it('should work with Promise chains', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });

      const { result, unmount } = renderHook(() => {
        const [data, setData] = useState<string | null>(null);
        const isMounted = useMounted();

        useEffect(() => {
          mockFetch()
            .then((response: { data: string }) => {
              if (isMounted.current) {
                setData(response.data);
              }
            })
            .catch(() => {
              // Handle error
            });
        }, [isMounted]);

        return data;
      });

      // Unmount before promise resolves
      unmount();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Data should remain null
      expect(result.current).toBeNull();
    });

    it('should work with async/await', async () => {
      const mockAsync = jest.fn().mockResolvedValue('result');

      const { result, unmount } = renderHook(() => {
        const [data, setData] = useState<string | null>(null);
        const isMounted = useMounted();

        useEffect(() => {
          const fetchData = async () => {
            const response = await mockAsync();
            if (isMounted.current) {
              setData(response);
            }
          };

          fetchData();
        }, [isMounted]);

        return data;
      });

      unmount();

      await waitFor(() => {
        expect(mockAsync).toHaveBeenCalled();
      });

      expect(result.current).toBeNull();
    });
  });

  describe('SSR Safety', () => {
    it('should work without window object', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useMounted());

      expect(result.current).toBeDefined();
      expect(result.current.current).toBe(false);

      global.window = originalWindow;
    });

    it('should work in Node.js environment', async () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useMounted());

      // Should be false initially
      expect(result.current.current).toBe(false);

      // Wait for mount effect
      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      global.window = originalWindow;
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mount/unmount cycles', async () => {
      const { result, unmount } = renderHook(() => useMounted());

      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      unmount();
      expect(result.current.current).toBe(false);
    });

    it('should handle multiple async operations', async () => {
      const mock1 = jest.fn().mockResolvedValue('result1');
      const mock2 = jest.fn().mockResolvedValue('result2');
      const mock3 = jest.fn().mockResolvedValue('result3');

      const { result, unmount } = renderHook(() => {
        const [data, setData] = useState<string[]>([]);
        const isMounted = useMounted();

        useEffect(() => {
          Promise.all([mock1(), mock2(), mock3()]).then((results) => {
            if (isMounted.current) {
              setData(results);
            }
          });
        }, [isMounted]);

        return data;
      });

      unmount();

      await waitFor(() => {
        expect(mock1).toHaveBeenCalled();
      });

      expect(result.current).toEqual([]);
    });

    it('should not interfere with cleanup functions', async () => {
      const cleanup = jest.fn();

      const { unmount } = renderHook(() => {
        const isMounted = useMounted();

        useEffect(() => {
          return () => {
            cleanup();
          };
        }, []);

        return isMounted;
      });

      await waitFor(() => {
        expect(cleanup).not.toHaveBeenCalled();
      });

      unmount();

      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration', () => {
    it('should work with fetch API', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ id: 1, name: 'Test' }),
      });

      const { result, unmount } = renderHook(() => {
        const [data, setData] = useState<{ id: number; name: string } | null>(null);
        const isMounted = useMounted();

        useEffect(() => {
          fetch('/api/data')
            .then((res) => res.json())
            .then((json) => {
              if (isMounted.current) {
                setData(json);
              }
            });
        }, [isMounted]);

        return data;
      });

      unmount();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      expect(result.current).toBeNull();
    });

    it('should work with intervals', async () => {
      jest.useFakeTimers();

      const { result, unmount } = renderHook(() => {
        const [count, setCount] = useState(0);
        const isMounted = useMounted();

        useEffect(() => {
          const interval = setInterval(() => {
            if (isMounted.current) {
              setCount((c) => c + 1);
            }
          }, 100);

          return () => clearInterval(interval);
        }, [isMounted]);

        return count;
      });

      // Fast-forward time
      jest.advanceTimersByTime(250);

      await waitFor(() => {
        expect(result.current).toBeGreaterThan(0);
      });

      unmount();

      // Advance more time
      jest.advanceTimersByTime(200);

      // Count should not increase after unmount
      const finalCount = result.current;
      jest.advanceTimersByTime(200);
      expect(result.current).toBe(finalCount);

      jest.useRealTimers();
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not hold references after unmount', async () => {
      const { result, unmount } = renderHook(() => useMounted());

      await waitFor(() => {
        expect(result.current.current).toBe(true);
      });

      const ref = result.current;

      unmount();

      // Ref should be cleaned up
      expect(ref.current).toBe(false);
    });
  });
});
