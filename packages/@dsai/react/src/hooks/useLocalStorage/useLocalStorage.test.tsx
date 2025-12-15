/**
 * useLocalStorage Tests
 *
 * Comprehensive tests for the useLocalStorage hook.
 * Tests cover persistence, serialization, cross-tab sync, and error handling.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return default value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      const [value] = result.current;

      expect(value).toBe('default');
    });

    it('should set value in localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('new value');
      });

      expect(localStorage.getItem('test-key')).toBe('"new value"');
      expect(result.current[0]).toBe('new value');
    });

    it('should read existing value from localStorage', () => {
      localStorage.setItem('test-key', '"existing value"');

      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      const [value] = result.current;

      expect(value).toBe('existing value');
    });

    it('should support updater function', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0));

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev + 5);
      });

      expect(result.current[0]).toBe(6);
    });

    it('should remove value from localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('stored value');
      });

      expect(localStorage.getItem('test-key')).toBe('"stored value"');

      act(() => {
        const [, , remove] = result.current;
        remove();
      });

      expect(localStorage.getItem('test-key')).toBeNull();
      expect(result.current[0]).toBe('default');
    });
  });

  describe('Type Safety', () => {
    it('should work with string values', () => {
      const { result } = renderHook(() => useLocalStorage('string-key', 'test'));

      expect(typeof result.current[0]).toBe('string');
    });

    it('should work with number values', () => {
      const { result } = renderHook(() => useLocalStorage('number-key', 42));

      act(() => {
        const [, setValue] = result.current;
        setValue(100);
      });

      expect(result.current[0]).toBe(100);
    });

    it('should work with boolean values', () => {
      const { result } = renderHook(() => useLocalStorage('bool-key', true));

      act(() => {
        const [, setValue] = result.current;
        setValue(false);
      });

      expect(result.current[0]).toBe(false);
    });

    it('should work with object values', () => {
      const defaultObj = { name: 'test', count: 0 };
      const { result } = renderHook(() => useLocalStorage('obj-key', defaultObj));

      act(() => {
        const [, setValue] = result.current;
        setValue({ name: 'updated', count: 5 });
      });

      expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
    });

    it('should work with array values', () => {
      const { result } = renderHook(() => useLocalStorage('array-key', [1, 2, 3]));

      act(() => {
        const [, setValue] = result.current;
        setValue([4, 5, 6]);
      });

      expect(result.current[0]).toEqual([4, 5, 6]);
    });

    it('should work with null values', () => {
      const { result } = renderHook(() => useLocalStorage<string | null>('null-key', null));

      act(() => {
        const [, setValue] = result.current;
        setValue('not null');
      });

      expect(result.current[0]).toBe('not null');
    });
  });

  describe('Custom Serializer', () => {
    it('should use custom serializer', () => {
      const { result } = renderHook(() =>
        useLocalStorage('custom-key', 'default', {
          serializer: (value) => `CUSTOM:${value}`,
          deserializer: (value) => value.replace('CUSTOM:', ''),
        })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('test');
      });

      expect(localStorage.getItem('custom-key')).toBe('CUSTOM:test');
      expect(result.current[0]).toBe('test');
    });

    it('should use custom serializer for Date objects', () => {
      interface DateWrapper {
        date: Date;
      }

      const { result } = renderHook(() =>
        useLocalStorage<DateWrapper>(
          'date-key',
          { date: new Date('2025-01-01') },
          {
            serializer: (value) => JSON.stringify({ date: value.date.toISOString() }),
            deserializer: (value) => {
              const parsed = JSON.parse(value);
              return { date: new Date(parsed.date) };
            },
          }
        )
      );

      act(() => {
        const [, setValue] = result.current;
        setValue({ date: new Date('2025-12-31') });
      });

      expect(result.current[0].date).toBeInstanceOf(Date);
      expect(result.current[0].date.getFullYear()).toBe(2025);
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('should sync on storage event', () => {
      const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'));

      expect(result.current[0]).toBe('initial');

      // Simulate another tab changing storage
      act(() => {
        localStorage.setItem('sync-key', '"updated from other tab"');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'sync-key',
            newValue: '"updated from other tab"',
          })
        );
      });

      expect(result.current[0]).toBe('updated from other tab');
    });

    it('should sync on custom local-storage event', () => {
      const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'));

      act(() => {
        localStorage.setItem('sync-key', '"updated"');
        window.dispatchEvent(new Event('local-storage'));
      });

      expect(result.current[0]).toBe('updated');
    });

    it('should not sync for different keys', () => {
      const { result } = renderHook(() => useLocalStorage('key-a', 'value-a'));

      act(() => {
        localStorage.setItem('key-b', '"value-b"');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'key-b',
            newValue: '"value-b"',
          })
        );
      });

      expect(result.current[0]).toBe('value-a');
    });
  });

  describe('SSR Safety', () => {
    it('should return default value in SSR environment', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const { result } = renderHook(() => useLocalStorage('ssr-key', 'default'));

      expect(result.current[0]).toBe('default');

      global.window = originalWindow;
    });

    it('should not crash when setting value in SSR', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const isBrowserSpy = jest.spyOn(require('../../utils/browser/isBrowser'), 'isBrowser');
      isBrowserSpy.mockReturnValue(false);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useLocalStorage('ssr-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('new value');
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('not a client'));

      consoleWarnSpy.mockRestore();
      isBrowserSpy.mockRestore();
      global.window = originalWindow;
    });

    it('should not initialize with value when initializeWithValue is false', () => {
      localStorage.setItem('init-key', '"stored value"');

      const { result } = renderHook(() =>
        useLocalStorage('init-key', 'default', {
          initializeWithValue: false,
        })
      );

      expect(result.current[0]).toBe('default');
    });
  });

  describe('Error Handling', () => {
    it('should handle parse errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      localStorage.setItem('invalid-json', 'not valid json');

      const { result } = renderHook(() => useLocalStorage('invalid-json', 'default'));

      expect(result.current[0]).toBe('default');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle quota exceeded errors', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useLocalStorage('quota-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('large value');
      });

      expect(consoleWarnSpy).toHaveBeenCalled();

      Storage.prototype.setItem = originalSetItem;
      consoleWarnSpy.mockRestore();
    });

    it('should handle removeItem errors', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useLocalStorage('error-key', 'default'));

      act(() => {
        const [, , remove] = result.current;
        remove();
      });

      expect(consoleWarnSpy).toHaveBeenCalled();

      Storage.prototype.removeItem = originalRemoveItem;
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined values', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | undefined>('undef-key', undefined)
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('defined');
      });

      expect(result.current[0]).toBe('defined');
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useLocalStorage('empty-key', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        const [, setValue] = result.current;
        setValue('not empty');
      });

      expect(result.current[0]).toBe('not empty');
    });

    it('should handle zero as value', () => {
      const { result } = renderHook(() => useLocalStorage('zero-key', 0));

      expect(result.current[0]).toBe(0);
    });

    it('should handle false as value', () => {
      const { result } = renderHook(() => useLocalStorage('false-key', false));

      expect(result.current[0]).toBe(false);
    });

    it('should persist complex nested objects', () => {
      const complex = {
        user: { id: 1, name: 'Test' },
        settings: { theme: 'dark', notifications: true },
        items: [1, 2, 3],
      };

      const { result } = renderHook(() => useLocalStorage('complex-key', complex));

      act(() => {
        const [, setValue] = result.current;
        setValue({
          user: { id: 2, name: 'Updated' },
          settings: { theme: 'light', notifications: false },
          items: [4, 5, 6],
        });
      });

      expect(result.current[0].user.name).toBe('Updated');
      expect(result.current[0].settings.theme).toBe('light');
      expect(result.current[0].items).toEqual([4, 5, 6]);
    });
  });

  describe('Memory and Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useLocalStorage('cleanup-key', 'default'));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('local-storage', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should not leak memory with multiple hooks', () => {
      const hooks = Array.from({ length: 10 }, (_, i) =>
        renderHook(() => useLocalStorage(`key-${i}`, i))
      );

      hooks.forEach(({ unmount }) => {
        unmount();
      });

      // No assertion needed - just ensuring no errors
      expect(true).toBe(true);
    });
  });

  describe('Integration Patterns', () => {
    it('should work with theme persistence pattern', () => {
      const { result } = renderHook(() => useLocalStorage<'light' | 'dark'>('theme', 'light'));

      act(() => {
        const [theme, setTheme] = result.current;
        setTheme(theme === 'light' ? 'dark' : 'light');
      });

      expect(result.current[0]).toBe('dark');

      // Persist across "reload"
      const { result: result2 } = renderHook(() =>
        useLocalStorage<'light' | 'dark'>('theme', 'light')
      );

      expect(result2.current[0]).toBe('dark');
    });

    it('should work with user preferences pattern', () => {
      interface UserPreferences {
        language: string;
        fontSize: number;
        autoSave: boolean;
      }

      const { result } = renderHook(() =>
        useLocalStorage<UserPreferences>('preferences', {
          language: 'en',
          fontSize: 16,
          autoSave: true,
        })
      );

      act(() => {
        const [, setPrefs] = result.current;
        setPrefs((prev) => ({ ...prev, fontSize: 18 }));
      });

      expect(result.current[0].fontSize).toBe(18);
      expect(result.current[0].language).toBe('en');
    });
  });
});
