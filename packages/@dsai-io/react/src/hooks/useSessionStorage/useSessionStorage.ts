import { useCallback, useEffect, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseStorageOptions, UseStorageReturn } from './useSessionStorage.types';

/**
 * Session state in sessionStorage with SSR safety and cross-tab synchronization.
 *
 * This hook provides a simple API for storing state in sessionStorage that persists
 * within a browser session (until the tab is closed). It handles serialization,
 * SSR safety, quota errors, and cleanup automatically.
 *
 * **Key Features**:
 * - Automatic JSON serialization/deserialization
 * - Custom serializer support
 * - SSR-safe (no sessionStorage access on server)
 * - Cross-tab synchronization (storage event)
 * - Quota exceeded error handling
 * - Parse error recovery
 * - Remove value function
 * - Type-safe with generic inference
 *
 * @template T - The type of the stored value
 * @param key - The sessionStorage key
 * @param defaultValue - The default value if key doesn't exist
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, remove]
 *
 * @example
 * ```tsx
 * function WizardForm() {
 *   const [step, setStep] = useSessionStorage('wizard-step', 1);
 *
 *   return (
 *     <div>
 *       <p>Current step: {step}</p>
 *       <button onClick={() => setStep(s => s + 1)}>Next Step</button>
 *       <button onClick={() => setStep(1)}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Form data persistence during session
 * interface FormData {
 *   email: string;
 *   message: string;
 * }
 *
 * function ContactForm() {
 *   const [formData, setFormData, clearForm] = useSessionStorage<FormData>(
 *     'contact-form-draft',
 *     { email: '', message: '' }
 *   );
 *
 *   return (
 *     <form>
 *       <input
 *         value={formData.email}
 *         onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
 *       />
 *       <textarea
 *         value={formData.message}
 *         onChange={(e) => setFormData(d => ({ ...d, message: e.target.value }))}
 *       />
 *       <button type="button" onClick={clearForm}>Clear Draft</button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // SSR-safe with custom serialization
 * function FilterState() {
 *   const [filters, setFilters] = useSessionStorage(
 *     'table-filters',
 *     new Set<string>(),
 *     {
 *       serializer: (value) => JSON.stringify(Array.from(value)),
 *       deserializer: (value) => new Set(JSON.parse(value)),
 *       initializeWithValue: false, // Don't read on server
 *     }
 *   );
 *
 *   return <div>Active filters: {filters.size}</div>;
 * }
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  options: UseStorageOptions<T> = {}
): UseStorageReturn<T> {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true,
  } = options;

  // Read initial value from sessionStorage (SSR-safe)
  const readValue = useCallback((): T => {
    if (!isBrowser()) {
      return defaultValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? deserializer(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (initializeWithValue) {
      return readValue();
    }
    return defaultValue;
  });

  // Update sessionStorage when value changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!isBrowser()) {
        console.warn(
          `Tried to set sessionStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        window.sessionStorage.setItem(key, serializer(newValue));
        setStoredValue(newValue);

        // Dispatch custom event for cross-tab synchronization
        window.dispatchEvent(new Event('session-storage'));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  // Remove value from sessionStorage
  const remove = useCallback(() => {
    if (!isBrowser()) {
      console.warn(
        `Tried to remove sessionStorage key "${key}" even though environment is not a client`
      );
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
      window.dispatchEvent(new Event('session-storage'));
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
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
    window.addEventListener('session-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('session-storage', handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, remove];
}
