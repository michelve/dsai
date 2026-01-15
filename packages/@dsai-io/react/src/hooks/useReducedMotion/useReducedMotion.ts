/**
 * useReducedMotion Hook
 *
 * Detects if the user prefers reduced motion based on their system settings.
 * Respects WCAG 2.1 Success Criterion 2.3.3 (AAA) - Animation from Interactions.
 *
 * Features:
 * - Detects prefers-reduced-motion media query
 * - Updates reactively when user changes system preference
 * - SSR-safe with configurable default value
 * - Automatic cleanup of event listeners
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';

import { isBrowser } from '../../utils/browser/isBrowser';

import type { UseReducedMotionOptions } from './useReducedMotion.types';

/**
 * Media query string for detecting reduced motion preference
 */
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Detects if the user prefers reduced motion based on their system settings.
 *
 * This hook listens to the `prefers-reduced-motion` media query and returns
 * `true` when the user has enabled reduced motion in their system preferences.
 *
 * Components should use this to conditionally disable or simplify animations
 * to respect user preferences and improve accessibility.
 *
 * @param options - Configuration options
 * @returns `true` if the user prefers reduced motion, `false` otherwise
 */
export function useReducedMotion(options: UseReducedMotionOptions = {}): boolean {
  const { defaultValue = false } = options;

  // Initialize state with current media query match or SSR default
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (!isBrowser() || !window.matchMedia) {
      return defaultValue;
    }

    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  });

  useEffect(() => {
    // Skip if not in browser environment or matchMedia not available
    if (!isBrowser() || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    /**
     * Handle media query change events
     */
    const handleChange = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener for media query changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: remove event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []); // Empty dependency array - only run once on mount

  return prefersReducedMotion;
}
