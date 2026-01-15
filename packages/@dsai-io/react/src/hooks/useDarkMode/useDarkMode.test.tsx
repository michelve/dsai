/**
 * useDarkMode Tests
 *
 * Comprehensive tests for the useDarkMode hook.
 * Tests cover system preference detection, localStorage persistence, and manual control.
 */

import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';

import { useLocalStorage } from '../useLocalStorage';
import { useMediaQuery } from '../useMediaQuery';

import { useDarkMode } from './useDarkMode';

// Mock useMediaQuery and useLocalStorage
jest.mock('../useMediaQuery', () => ({
  useMediaQuery: jest.fn(),
}));

jest.mock('../useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
const mockUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>;

describe('useDarkMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
    mockUseLocalStorage.mockReturnValue([null, jest.fn(), jest.fn()]);
  });

  describe('Basic Functionality', () => {
    it('should return dark mode state and control functions', () => {
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current).toHaveProperty('isDarkMode');
      expect(result.current).toHaveProperty('enable');
      expect(result.current).toHaveProperty('disable');
      expect(result.current).toHaveProperty('toggle');
      expect(result.current).toHaveProperty('setDarkMode');
      expect(result.current).toHaveProperty('systemPreference');
    });

    it('should use default value when no stored value or system preference', () => {
      mockUseLocalStorage.mockReturnValue([null, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(false);

      const { result } = renderHook(() =>
        useDarkMode({ defaultValue: true, syncWithSystem: false })
      );

      expect(result.current.isDarkMode).toBe(true);
    });

    it('should enable dark mode', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.enable();
      });

      expect(setStoredValue).toHaveBeenCalledWith(true);
    });

    it('should disable dark mode', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([true, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.disable();
      });

      expect(setStoredValue).toHaveBeenCalledWith(false);
    });

    it('should toggle dark mode', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggle();
      });

      expect(setStoredValue).toHaveBeenCalledWith(true);
    });
  });

  describe('System Preference Sync', () => {
    it('should sync with system preference when enabled', () => {
      mockUseLocalStorage.mockReturnValue([null, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(true);

      const { result } = renderHook(() => useDarkMode({ syncWithSystem: true }));

      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.systemPreference).toBe(true);
    });

    it('should not sync with system preference when disabled', () => {
      mockUseLocalStorage.mockReturnValue([null, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(true);

      const { result } = renderHook(() =>
        useDarkMode({ syncWithSystem: false, defaultValue: false })
      );

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should prioritize stored value over system preference', () => {
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(true);

      const { result } = renderHook(() => useDarkMode({ syncWithSystem: true }));

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should report system preference independently', () => {
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(true);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.systemPreference).toBe(true);
    });
  });

  describe('Storage Persistence', () => {
    it('should use custom storage key', () => {
      renderHook(() => useDarkMode({ storageKey: 'custom-theme-key' }));

      expect(mockUseLocalStorage).toHaveBeenCalledWith('custom-theme-key', null);
    });

    it('should use default storage key', () => {
      renderHook(() => useDarkMode());

      expect(mockUseLocalStorage).toHaveBeenCalledWith('darkMode', null);
    });

    it('should read stored value on mount', () => {
      mockUseLocalStorage.mockReturnValue([true, jest.fn(), jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(true);
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when dark mode changes', () => {
      const onChange = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);

      renderHook(() => useDarkMode({ onChange }));

      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should call onChange with new value when toggled', () => {
      const onChange = jest.fn();
      const setStoredValue = jest.fn();

      mockUseLocalStorage.mockReturnValueOnce([false, setStoredValue, jest.fn()]);

      const { rerender } = renderHook(() => useDarkMode({ onChange }));

      onChange.mockClear();

      mockUseLocalStorage.mockReturnValue([true, setStoredValue, jest.fn()]);
      rerender();

      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Function Stability', () => {
    it('should maintain stable function references', () => {
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);

      const { result, rerender } = renderHook(() => useDarkMode());

      const firstEnable = result.current.enable;
      const firstDisable = result.current.disable;
      const firstToggle = result.current.toggle;
      const firstSetDarkMode = result.current.setDarkMode;

      rerender();

      expect(result.current.enable).toBe(firstEnable);
      expect(result.current.disable).toBe(firstDisable);
      expect(result.current.toggle).toBe(firstToggle);
      expect(result.current.setDarkMode).toBe(firstSetDarkMode);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null stored value', () => {
      mockUseLocalStorage.mockReturnValue([null, jest.fn(), jest.fn()]);
      mockUseMediaQuery.mockReturnValue(false);

      const { result } = renderHook(() => useDarkMode({ defaultValue: false }));

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should handle false stored value', () => {
      mockUseLocalStorage.mockReturnValue([false, jest.fn(), jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should handle true stored value', () => {
      mockUseLocalStorage.mockReturnValue([true, jest.fn(), jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(true);
    });
  });

  describe('Integration Patterns', () => {
    it('should work with theme toggle pattern', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggle();
      });

      expect(setStoredValue).toHaveBeenCalledWith(true);
    });

    it('should work with explicit enable/disable pattern', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.enable();
      });

      expect(setStoredValue).toHaveBeenCalledWith(true);

      act(() => {
        result.current.disable();
      });

      expect(setStoredValue).toHaveBeenCalledWith(false);
    });

    it('should work with setDarkMode pattern', () => {
      const setStoredValue = jest.fn();
      mockUseLocalStorage.mockReturnValue([false, setStoredValue, jest.fn()]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(setStoredValue).toHaveBeenCalledWith(true);
    });
  });
});
