import { useCallback, useEffect, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseStorageOptions, UseStorageReturn } from './useLocalStorage.types';

/**
 * Persistent state in localStorage with SSR safety and cross-tab synchronization.
 *
 * This hook provides a simple API for storing state in localStorage that persists
 * across page reloads and synchronizes across browser tabs. It handles serialization,
 * SSR safety, quota errors, and cleanup automatically.
 *
 * **Key Features**:
 * - Automatic JSON serialization/deserialization
 * - Custom serializer support
 * - SSR-safe (no localStorage access on server)
 * - Cross-tab synchronization (storage event)
 * - Quota exceeded error handling
 * - Parse error recovery
 * - Remove value function
 * - Type-safe with generic inference
 *
 * @template T - The type of the stored value
 * @param key - The localStorage key
 * @param defaultValue - The default value if key doesn't exist
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, remove]
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
 *         Toggle Theme
 *       </button>
 *       <button onClick={removeTheme}>Reset to Default</button>
 *     </div>
 *   );
 * }\n * ```
 *
 * @example
 * ```tsx
 * // Custom serializer for complex objects
 * interface User {
 *   id: number;
 *   name: string;
 *   lastSeen: Date;
 * }
 *
 * function UserProfile() {
 *   const [user, setUser] = useLocalStorage<User>('user', {\n *     id: 1,
 *     name: 'Anonymous',
 *     lastSeen: new Date(),
 *   }, {
 *     serializer: (value) => JSON.stringify({
 *       ...value,
 *       lastSeen: value.lastSeen.toISOString(),
 *     }),
 *     deserializer: (value) => {
 *       const parsed = JSON.parse(value);
 *       return {
 *         ...parsed,
 *         lastSeen: new Date(parsed.lastSeen),
 *       };
 *     },
 *   });
 *
 *   return <div>Welcome, {user.name}!</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // SSR-safe initialization
 * function Counter() {
 *   const [count, setCount] = useLocalStorage('count', 0, {
 *     initializeWithValue: false, // Don't read from storage on server
 *   });
 *
 *   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseStorageOptions<T> = {}
): UseStorageReturn<T> {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true,
  } = options;

  // Read initial value from localStorage (SSR-safe)
  const readValue = useCallback((): T => {
    if (!isBrowser()) {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return defaultValue;
  });

  // Update localStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!isBrowser()) {
        console.warn(
          `Tried to set localStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        window.localStorage.setItem(key, serializer(newValue));
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab synchronization
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  // Remove value from localStorage
  const remove = useCallback(() => {
    if (!isBrowser()) {
      console.warn(
        `Tried to remove localStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(defaultValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Sync across tabs
  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const handleStorageChange = (e: StorageEvent | Event): void => {
      if (e instanceof StorageEvent) {
        if (e.key && e.key !== key) {
          return;
        }
      }

      setStoredValue(readValue());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, remove];
}
