/**
 * Options for useDarkMode hook.
 */
export interface UseDarkModeOptions {
  /** Default value when no preference is stored (default: false) */
  defaultValue?: boolean;
  /** Local storage key for persisting preference (default: 'darkMode') */
  storageKey?: string;
  /** Whether to sync with system preference (default: true) */
  syncWithSystem?: boolean;
  /** Callback when dark mode changes */
  onChange?: (isDark: boolean) => void;
}

/**
 * Return value of useDarkMode hook.
 */
export interface UseDarkModeReturn {
  /** Whether dark mode is enabled */
  isDarkMode: boolean;
  /** Enable dark mode */
  enable: () => void;
  /** Disable dark mode */
  disable: () => void;
  /** Toggle dark mode */
  toggle: () => void;
  /** Set dark mode to specific value */
  setDarkMode: (value: boolean) => void;
  /** Whether system prefers dark mode */
  systemPreference: boolean;
}
