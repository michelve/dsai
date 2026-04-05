import { useCallback, useEffect } from 'react';

import { useLocalStorage } from '../useLocalStorage';
import { useMediaQuery } from '../useMediaQuery';

import type { UseDarkModeOptions, UseDarkModeReturn } from './useDarkMode.types';

/**
 * Manages dark mode state with system preference sync and localStorage persistence.
 *
 * This hook provides comprehensive dark mode support, including automatic
 * detection of system preference, persistence across sessions, and manual
 * override capabilities.
 *
 * **Key Features**:
 * - System preference detection
 * - localStorage persistence
 * - Manual override
 * - SSR-safe
 * - Change callbacks
 * - Type-safe
 *
 * **Use Cases**:
 * - Theme switching
 * - Dark mode toggle
 * - Respecting user preferences
 * - Persistent theme settings
 *
 * @param options - Configuration options
 * @returns Dark mode state and control functions
 *
 * @example
 * ```tsx
 * // Basic usage with system preference sync
 * function ThemeSwitcher() {
 *   const { isDarkMode, toggle } = useDarkMode();
 *
 *   useEffect(() => {
 *     // Apply theme to document
 *     document.documentElement.classList.toggle('dark', isDarkMode);
 *   }, [isDarkMode]);
 *
 *   return (
 *     <button onClick={toggle}>
 *       {isDarkMode ? '🌙 Dark' : '☀️ Light'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom storage key and callback
 * function App() {
 *   const { isDarkMode, enable, disable, systemPreference } = useDarkMode({
 *     storageKey: 'app-theme',
 *     onChange: (isDark) => {
 *       console.log('Theme changed:', isDark ? 'dark' : 'light');
 *       // Update analytics, etc.
 *     },
 *   });
 *
 *   return (
 *     <div className={isDarkMode ? 'dark-theme' : 'light-theme'}>
 *       <nav>
 *         <button onClick={enable}>Dark</button>
 *         <button onClick={disable}>Light</button>
 *         {systemPreference && (
 *           <span>System prefers: {systemPreference ? 'dark' : 'light'}</span>
 *         )}
 *       </nav>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Manual control without system sync
 * function ManualThemeSelector() {
 *   const { isDarkMode, setDarkMode } = useDarkMode({
 *     syncWithSystem: false,
 *     defaultValue: false,
 *   });
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={isDarkMode}
 *           onChange={(e) => setDarkMode(e.target.checked)}
 *         />
 *         Enable dark mode
 *       </label>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDarkMode(options: UseDarkModeOptions = {}): UseDarkModeReturn {
  const {
    defaultValue = false,
    storageKey = 'darkMode',
    syncWithSystem = true,
    onChange,
  } = options;

  // Detect system preference
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Get stored preference
  const [storedValue, setStoredValue] = useLocalStorage<boolean | null>(storageKey, null);

  // Derive isDarkMode from stored value, system preference, or default
  let isDarkMode: boolean;
  if (storedValue !== null) {
    isDarkMode = storedValue;
  } else if (syncWithSystem) {
    isDarkMode = systemPrefersDark;
  } else {
    isDarkMode = defaultValue;
  }

  // Call onChange callback when dark mode changes
  useEffect(() => {
    if (onChange) {
      onChange(isDarkMode);
    }
  }, [isDarkMode, onChange]);

  const setDarkMode = useCallback(
    (value: boolean) => {
      setStoredValue(value);
    },
    [setStoredValue]
  );

  const enable = useCallback(() => {
    setDarkMode(true);
  }, [setDarkMode]);

  const disable = useCallback(() => {
    setDarkMode(false);
  }, [setDarkMode]);

  const toggle = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  return {
    isDarkMode,
    enable,
    disable,
    toggle,
    setDarkMode,
    systemPreference: systemPrefersDark,
  };
}
