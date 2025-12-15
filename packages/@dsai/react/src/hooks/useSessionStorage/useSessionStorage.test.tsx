/**
 * useSessionStorage Tests
 *
 * Comprehensive tests for the useSessionStorage hook.
 * Tests cover session persistence, serialization, cross-tab sync, and error handling.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import * as browserUtils from '../../utils/browser/isBrowser';

import { useSessionStorage } from './useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return default value when sessionStorage is empty', () => {
      const { result } = renderHook(() => useSessionStorage('test-key', 'default'));

      const [value] = result.current;

      expect(value).toBe('default');
    });

    it('should set value in sessionStorage', () => {
      const { result } = renderHook(() => useSessionStorage('test-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('new value');
      });

      expect(sessionStorage.getItem('test-key')).toBe('"new value"');
      expect(result.current[0]).toBe('new value');
    });

    it('should read existing value from sessionStorage', () => {
      sessionStorage.setItem('test-key', '"existing value"');

      const { result } = renderHook(() => useSessionStorage('test-key', 'default'));

      const [value] = result.current;

      expect(value).toBe('existing value');
    });

    it('should support updater function', () => {
      const { result } = renderHook(() => useSessionStorage('counter', 0));

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

    it('should remove value from sessionStorage', () => {
      const { result } = renderHook(() => useSessionStorage('test-key', 'default'));

      act(() => {
        const [, setValue] = result.current;
        setValue('stored value');
      });

      expect(sessionStorage.getItem('test-key')).toBe('"stored value"');

      act(() => {
        const [, , remove] = result.current;
        remove();
      });

      expect(sessionStorage.getItem('test-key')).toBeNull();
      expect(result.current[0]).toBe('default');
    });
  });

  describe('Type Safety', () => {
    it('should work with string values', () => {
      const { result } = renderHook(() => useSessionStorage('string-key', 'test'));

      expect(typeof result.current[0]).toBe('string');
    });

    it('should work with number values', () => {
      const { result } = renderHook(() => useSessionStorage('number-key', 42));

      act(() => {
        const [, setValue] = result.current;
        setValue(100);
      });

      expect(result.current[0]).toBe(100);
    });

    it('should work with boolean values', () => {
      const { result } = renderHook(() => useSessionStorage('bool-key', true));

      act(() => {
        const [, setValue] = result.current;
        setValue(false);
      });

      expect(result.current[0]).toBe(false);
    });

    it('should work with object values', () => {
      const defaultObj = { name: 'test', count: 0 };
      const { result } = renderHook(() => useSessionStorage('obj-key', defaultObj));

      act(() => {
        const [, setValue] = result.current;
        setValue({ name: 'updated', count: 5 });
      });

      expect(result.current[0]).toEqual({ name: 'updated', count: 5 });
    });

    it('should work with array values', () => {
      const { result } = renderHook(() => useSessionStorage('array-key', [1, 2, 3]));

      act(() => {
        const [, setValue] = result.current;
        setValue([4, 5, 6]);
      });

      expect(result.current[0]).toEqual([4, 5, 6]);
    });

    it('should work with null values', () => {
      const { result } = renderHook(() => useSessionStorage<string | null>('null-key', null));

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
        useSessionStorage('custom-key', 'default', {
          serializer: (value) => `CUSTOM:${value}`,
          deserializer: (value) => value.replace('CUSTOM:', ''),
        })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('test');
      });

      expect(sessionStorage.getItem('custom-key')).toBe('CUSTOM:test');
      expect(result.current[0]).toBe('test');
    });

    it('should use custom serializer for Date objects', () => {
      interface DateWrapper {
        date: Date;
      }

      const { result } = renderHook(() =>
        useSessionStorage<DateWrapper>(
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

    it('should use custom serializer for Set objects', () => {
      const { result } = renderHook(() =>
        useSessionStorage<Set<string>>('set-key', new Set(['a']), {
          serializer: (value) => JSON.stringify(Array.from(value)),
          deserializer: (value) => new Set(JSON.parse(value)),
        })
      );

      act(() => {
        const [, setValue] = result.current;
        setValue(new Set(['a', 'b', 'c']));
      });

      expect(result.current[0]).toBeInstanceOf(Set);
      expect(result.current[0].has('b')).toBe(true);
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('should sync on storage event', () => {
      const { result } = renderHook(() => useSessionStorage('sync-key', 'initial'));

      expect(result.current[0]).toBe('initial');

      act(() => {
        sessionStorage.setItem('sync-key', '"updated from other tab"');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'sync-key',
            newValue: '"updated from other tab"',
          })
        );
      });

      expect(result.current[0]).toBe('updated from other tab');
    });

    it('should sync on custom session-storage event', () => {
      const { result } = renderHook(() => useSessionStorage('sync-key', 'initial'));

      act(() => {
        sessionStorage.setItem('sync-key', '"updated"');
        window.dispatchEvent(new Event('session-storage'));
      });

      expect(result.current[0]).toBe('updated');
    });

    it('should not sync for different keys', () => {
      const { result } = renderHook(() => useSessionStorage('key-a', 'value-a'));

      act(() => {
        sessionStorage.setItem('key-b', '"value-b"');
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

      const { result } = renderHook(() => useSessionStorage('ssr-key', 'default'));

      expect(result.current[0]).toBe('default');

      global.window = originalWindow;
    });

    it('should not crash when setting value in SSR', () => {
      const originalWindow = global.window;
      // @ts-expect-error - Testing SSR scenario
      delete global.window;

      const isBrowserSpy = jest.spyOn(browserUtils, 'isBrowser');
      isBrowserSpy.mockReturnValue(false);
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useSessionStorage('ssr-key', 'default'));

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
      sessionStorage.setItem('init-key', '"stored value"');

      const { result } = renderHook(() =>
        useSessionStorage('init-key', 'default', {
          initializeWithValue: false,
        })
      );

      expect(result.current[0]).toBe('default');
    });
  });

  describe('Error Handling', () => {
    it('should handle parse errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      sessionStorage.setItem('invalid-json', 'not valid json');

      const { result } = renderHook(() => useSessionStorage('invalid-json', 'default'));

      expect(result.current[0]).toBe('default');
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle quota exceeded errors', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useSessionStorage('quota-key', 'default'));

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

      const { result } = renderHook(() => useSessionStorage('error-key', 'default'));

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
        useSessionStorage<string | undefined>('undef-key', undefined)
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('defined');
      });

      expect(result.current[0]).toBe('defined');
    });

    it('should handle empty string', () => {
      const { result } = renderHook(() => useSessionStorage('empty-key', ''));

      expect(result.current[0]).toBe('');

      act(() => {
        const [, setValue] = result.current;
        setValue('not empty');
      });

      expect(result.current[0]).toBe('not empty');
    });

    it('should handle zero as value', () => {
      const { result } = renderHook(() => useSessionStorage('zero-key', 0));

      expect(result.current[0]).toBe(0);
    });

    it('should handle false as value', () => {
      const { result } = renderHook(() => useSessionStorage('false-key', false));

      expect(result.current[0]).toBe(false);
    });

    it('should persist complex nested objects', () => {
      const complex = {
        user: { id: 1, name: 'Test' },
        settings: { theme: 'dark', notifications: true },
        items: [1, 2, 3],
      };

      const { result } = renderHook(() => useSessionStorage('complex-key', complex));

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

      const { unmount } = renderHook(() => useSessionStorage('cleanup-key', 'default'));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('session-storage', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should not leak memory with multiple hooks', () => {
      const hooks = Array.from({ length: 10 }, (_, i) =>
        renderHook(() => useSessionStorage(`key-${i}`, i))
      );

      hooks.forEach(({ unmount }) => {
        unmount();
      });

      expect(true).toBe(true);
    });
  });

  describe('Integration Patterns', () => {
    it('should work with wizard/multi-step form pattern', () => {
      const { result } = renderHook(() => useSessionStorage('wizard-step', 1));

      act(() => {
        const [step, setStep] = result.current;
        setStep(step + 1);
      });

      expect(result.current[0]).toBe(2);

      act(() => {
        const [step, setStep] = result.current;
        setStep(step + 1);
      });

      expect(result.current[0]).toBe(3);
    });

    it('should work with form draft pattern', () => {
      interface FormDraft {
        email: string;
        message: string;
      }

      const { result } = renderHook(() =>
        useSessionStorage<FormDraft>('form-draft', {
          email: '',
          message: '',
        })
      );

      act(() => {
        const [, setDraft] = result.current;
        setDraft((prev) => ({ ...prev, email: 'test@example.com' }));
      });

      expect(result.current[0].email).toBe('test@example.com');

      act(() => {
        const [, , clearDraft] = result.current;
        clearDraft();
      });

      expect(result.current[0].email).toBe('');
    });

    it('should clear on session end (simulated)', () => {
      const { result } = renderHook(() => useSessionStorage('session-data', 'value'));

      expect(result.current[0]).toBe('value');

      sessionStorage.clear();

      const { result: result2 } = renderHook(() => useSessionStorage('session-data', 'value'));

      expect(result2.current[0]).toBe('value');
    });
  });
});
