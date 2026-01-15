/**
 * Spinner utilities for CLI progress indication
 *
 * Wraps ora for consistent spinner behavior with quiet mode support.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/ui/spinner
 */

import ora from 'ora';

import type { Spinner } from '../types.js';
import type { Ora } from 'ora';

/**
 * Create a spinner instance
 *
 * In quiet mode, returns a no-op spinner that does nothing.
 *
 * @param quiet - If true, spinner is disabled (no-op)
 * @returns Spinner instance
 *
 * @example
 * ```typescript
 * const spinner = createSpinner(false);
 * spinner.start('Loading configuration...');
 * // ... do work
 * spinner.succeed('Configuration loaded!');
 * ```
 */
export function createSpinner(quiet = false): Spinner {
  // In quiet mode, return a no-op spinner
  if (quiet) {
    return {
      start: (): void => {},
      stop: (): void => {},
      succeed: (): void => {},
      fail: (): void => {},
      warn: (): void => {},
      info: (): void => {},
    };
  }

  let instance: Ora | null = null;

  return {
    /**
     * Start spinner with text
     */
    start(text: string): void {
      instance = ora(text).start();
    },

    /**
     * Stop spinner (optionally update text)
     */
    stop(text?: string): void {
      if (instance) {
        if (text) {
          instance.text = text;
        }
        instance.stop();
        instance = null;
      }
    },

    /**
     * Stop with success state (green checkmark)
     */
    succeed(text?: string): void {
      if (instance) {
        instance.succeed(text);
        instance = null;
      }
    },

    /**
     * Stop with failure state (red X)
     */
    fail(text?: string): void {
      if (instance) {
        instance.fail(text);
        instance = null;
      }
    },

    /**
     * Stop with warning state (yellow triangle)
     */
    warn(text?: string): void {
      if (instance) {
        instance.warn(text);
        instance = null;
      }
    },

    /**
     * Stop with info state (blue i)
     */
    info(text?: string): void {
      if (instance) {
        instance.info(text);
        instance = null;
      }
    },
  };
}
