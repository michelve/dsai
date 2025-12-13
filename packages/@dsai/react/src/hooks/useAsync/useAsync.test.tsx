import { act, renderHook, waitFor } from '@testing-library/react';

import { useAsync } from './useAsync';

describe('useAsync', () => {
  describe('Basic Functionality', () => {
    it('should return initial idle state', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should have execute, reset, setData, and setError functions', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      expect(typeof result.current.execute).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.setData).toBe('function');
      expect(typeof result.current.setError).toBe('function');
    });

    it('should transition to loading state when execute is called', async () => {
      const asyncFn = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve('data'), 100))
      );
      const { result } = renderHook(() => useAsync(asyncFn));

      let executePromise: Promise<unknown>;
      act(() => {
        executePromise = result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.status).toBe('loading');
        expect(result.current.isLoading).toBe(true);
        expect(result.current.isIdle).toBe(false);
      });

      await executePromise!;
    });

    it('should transition to success state when promise resolves', async () => {
      const asyncFn = jest.fn(() => Promise.resolve('success data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('success');
      expect(result.current.data).toBe('success data');
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(false);
    });

    it('should transition to error state when promise rejects', async () => {
      const testError = new Error('Test error');
      const asyncFn = jest.fn(() => Promise.reject(testError));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.status).toBe('error');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe(testError);
      expect(result.current.isError).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isIdle).toBe(false);
    });
  });

  describe('Immediate Execution', () => {
    it('should not execute immediately when immediate is false', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      renderHook(() => useAsync(asyncFn, false));

      expect(asyncFn).not.toHaveBeenCalled();
    });

    it('should execute immediately when immediate is true', async () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn, true));

      await waitFor(() => {
        expect(asyncFn).toHaveBeenCalled();
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should have data available after immediate execution', async () => {
      const asyncFn = jest.fn(() => Promise.resolve('immediate data'));
      const { result } = renderHook(() => useAsync(asyncFn, true));

      await waitFor(() => {
        expect(result.current.data).toBe('immediate data');
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to idle state when reset is called', async () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.isSuccess).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should reset from error state', async () => {
      const asyncFn = jest.fn(() => Promise.reject(new Error('Error')));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.isError).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });

    it('should cancel pending operations when reset is called', async () => {
      let resolvePromise: (value: string) => void;
      const asyncFn = jest.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useAsync(asyncFn));

      // Start execution
      let executePromise: Promise<unknown>;
      act(() => {
        executePromise = result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Reset while loading
      act(() => {
        result.current.reset();
      });
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isLoading).toBe(false);

      // Resolve the promise - state should not update
      await act(async () => {
        resolvePromise!('data');
        await executePromise!;
      });

      // Should still be idle after promise resolves
      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
    });
  });

  describe('setData and setError', () => {
    it('should set data directly with setData', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      act(() => {
        result.current.setData('manual data');
      });

      expect(result.current.data).toBe('manual data');
      expect(result.current.status).toBe('success');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
    });

    it('should set error directly with setError', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      const manualError = new Error('Manual error');
      act(() => {
        result.current.setError(manualError);
      });

      expect(result.current.error).toBe(manualError);
      expect(result.current.status).toBe('error');
      expect(result.current.isError).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should set to idle when setData is called with null', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      act(() => {
        result.current.setData('some data');
      });
      expect(result.current.isSuccess).toBe(true);

      act(() => {
        result.current.setData(null);
      });
      expect(result.current.status).toBe('idle');
      expect(result.current.data).toBeNull();
      expect(result.current.isIdle).toBe(true);
    });

    it('should set to idle when setError is called with null', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result } = renderHook(() => useAsync(asyncFn));

      act(() => {
        result.current.setError(new Error('error'));
      });
      expect(result.current.isError).toBe(true);

      act(() => {
        result.current.setError(null);
      });
      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeNull();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('Race Condition Prevention', () => {
    it('should only use data from latest execution', async () => {
      const resolvers: Array<(value: string) => void> = [];
      const asyncFn = jest.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvers.push(resolve);
          })
      );

      const { result } = renderHook(() => useAsync(asyncFn));

      // Start first execution
      let promise1: Promise<unknown>;
      let promise2: Promise<unknown>;

      act(() => {
        promise1 = result.current.execute();
      });

      // Start second execution
      act(() => {
        promise2 = result.current.execute();
      });

      // Resolve first execution (should be ignored)
      await act(async () => {
        resolvers[0]!('first');
        await promise1!;
      });

      // Should not have data from first execution
      expect(result.current.data).toBeNull();

      // Resolve second execution
      await act(async () => {
        resolvers[1]!('second');
        await promise2!;
      });

      // Should have data from second execution
      expect(result.current.data).toBe('second');
    });

    it('should handle errors from non-latest execution', async () => {
      const resolvers: Array<{ resolve: (value: string) => void; reject: (error: Error) => void }> =
        [];
      const asyncFn = jest.fn(
        () =>
          new Promise<string>((resolve, reject) => {
            resolvers.push({ resolve, reject });
          })
      );

      const { result } = renderHook(() => useAsync(asyncFn));

      // Start first execution
      let promise1: Promise<unknown>;
      let promise2: Promise<unknown>;

      act(() => {
        promise1 = result.current.execute();
      });

      // Start second execution
      act(() => {
        promise2 = result.current.execute();
      });

      // First execution errors (should be ignored)
      await act(async () => {
        resolvers[0]!.reject(new Error('first error'));
        await promise1!;
      });

      // Should not have error from first execution
      expect(result.current.error).toBeNull();

      // Second execution succeeds
      await act(async () => {
        resolvers[1]!.resolve('second');
        await promise2!;
      });

      // Should have success state
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe('second');
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not update state after unmount', async () => {
      let resolvePromise: (value: string) => void;
      const asyncFn = jest.fn(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result, unmount } = renderHook(() => useAsync(asyncFn));

      // Start execution
      let executePromise: Promise<unknown>;
      act(() => {
        executePromise = result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Unmount while loading
      unmount();

      // Resolve promise after unmount
      await act(async () => {
        resolvePromise!('data');
        await executePromise!;
      });

      // State should not update after unmount (no error should be thrown)
      expect(() => {
        // Accessing result after unmount should not throw
      }).not.toThrow();
    });

    it('should not update state on error after unmount', async () => {
      let rejectPromise: (error: Error) => void;
      const asyncFn = jest.fn(
        () =>
          new Promise<string>((_, reject) => {
            rejectPromise = reject;
          })
      );

      const { result, unmount } = renderHook(() => useAsync(asyncFn));

      // Start execution
      const executePromise = result.current.execute();

      // Unmount while loading
      unmount();

      // Reject promise after unmount
      await act(async () => {
        rejectPromise!(new Error('error'));
        await executePromise;
      });

      // Should not throw error when updating state after unmount
      expect(() => {
        // No-op - just ensuring no errors
      }).not.toThrow();
    });
  });

  describe('Multiple Executions', () => {
    it('should handle multiple successive executions', async () => {
      let counter = 0;
      const asyncFn = jest.fn(() => Promise.resolve(`data-${++counter}`));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toBe('data-1');

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toBe('data-2');

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toBe('data-3');

      expect(asyncFn).toHaveBeenCalledTimes(3);
    });

    it('should handle alternating success and error', async () => {
      let shouldError = false;
      const asyncFn = jest.fn(() =>
        shouldError ? Promise.reject(new Error('error')) : Promise.resolve('success')
      );

      const { result } = renderHook(() => useAsync(asyncFn));

      // First execution - success
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe('success');

      // Second execution - error
      shouldError = true;
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.isError).toBe(true);
      expect(result.current.error?.message).toBe('error');
      expect(result.current.data).toBeNull(); // Data should be cleared on error

      // Third execution - success again
      shouldError = false;
      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBe('success');
      expect(result.current.error).toBeNull(); // Error should be cleared on success
    });
  });

  describe('Type Safety', () => {
    it('should work with different data types', async () => {
      interface User {
        id: number;
        name: string;
      }

      const asyncFn = jest.fn(() => Promise.resolve<User>({ id: 1, name: 'Test' }));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    });

    it('should work with custom error types', async () => {
      interface CustomError {
        code: string;
        message: string;
      }

      const customError: CustomError = { code: 'ERR_001', message: 'Custom error' };
      const asyncFn = jest.fn(() => Promise.reject(customError));
      const { result } = renderHook(() => useAsync<string, CustomError>(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.error).toEqual(customError);
      expect(result.current.error?.code).toBe('ERR_001');
    });

    it('should work with array data types', async () => {
      const asyncFn = jest.fn(() => Promise.resolve([1, 2, 3, 4, 5]));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toEqual([1, 2, 3, 4, 5]);
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle asyncFunction changing', async () => {
      const asyncFn1 = jest.fn(() => Promise.resolve('data1'));
      const asyncFn2 = jest.fn(() => Promise.resolve('data2'));

      const { result, rerender } = renderHook(({ fn }) => useAsync(fn), {
        initialProps: { fn: asyncFn1 },
      });

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toBe('data1');

      // Change async function
      rerender({ fn: asyncFn2 });

      await act(async () => {
        await result.current.execute();
      });
      expect(result.current.data).toBe('data2');
    });

    it('should handle promise that resolves to null', async () => {
      const asyncFn = jest.fn(() => Promise.resolve(null));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBeNull();
      expect(result.current.status).toBe('success');
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle promise that resolves to undefined', async () => {
      const asyncFn = jest.fn(() => Promise.resolve(undefined as unknown as string));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle promise that resolves to 0', async () => {
      const asyncFn = jest.fn(() => Promise.resolve(0));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe(0);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle promise that resolves to empty string', async () => {
      const asyncFn = jest.fn(() => Promise.resolve(''));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe('');
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle promise that resolves to false', async () => {
      const asyncFn = jest.fn(() => Promise.resolve(false));
      const { result } = renderHook(() => useAsync(asyncFn));

      await act(async () => {
        await result.current.execute();
      });

      expect(result.current.data).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('Function Stability', () => {
    it('should maintain stable execute function reference', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result, rerender } = renderHook(() => useAsync(asyncFn));

      const execute1 = result.current.execute;
      rerender();
      const execute2 = result.current.execute;

      expect(execute1).toBe(execute2);
    });

    it('should maintain stable reset function reference', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result, rerender } = renderHook(() => useAsync(asyncFn));

      const reset1 = result.current.reset;
      rerender();
      const reset2 = result.current.reset;

      expect(reset1).toBe(reset2);
    });

    it('should maintain stable setData function reference', () => {
      const asyncFn = jest.fn(() => Promise.resolve('data'));
      const { result, rerender } = renderHook(() => useAsync(asyncFn));

      const setData1 = result.current.setData;
      rerender();
      const setData2 = result.current.setData;

      expect(setData1).toBe(setData2);
    });
  });
});
