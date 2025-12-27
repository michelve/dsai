/**
 * Logger utilities for CLI output
 *
 * Provides consistent logging with icons, colors, and quiet/debug mode support.
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/ui/logger
 */

/* eslint-disable no-console */

import colors from './colors.js';

import type { Logger } from '../types.js';

/**
 * Logger creation options
 */
export interface LoggerOptions {
  /** Quiet mode - minimal output */
  quiet?: boolean;

  /** Debug mode - verbose output */
  debug?: boolean;

  /** Custom prefix for messages */
  prefix?: string;
}

/**
 * Create a logger instance
 *
 * @param options - Logger options
 * @returns Logger instance
 *
 * @example
 * ```typescript
 * const logger = createLogger({ debug: true });
 * logger.info('Starting build...');
 * logger.success('Build complete!');
 * logger.debug('Token count: 123'); // Only shown in debug mode
 * ```
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  const { quiet = false, debug = false, prefix = '' } = options;

  const prefixStr = prefix ? `${colors.muted(`[${prefix}]`)} ` : '';

  return {
    /**
     * Log a general message
     */
    log(message: string): void {
      if (!quiet) {
        console.log(`${prefixStr}${message}`);
      }
    },

    /**
     * Log an info message with icon
     */
    info(message: string): void {
      if (!quiet) {
        console.log(`${prefixStr}${colors.info('ℹ')} ${message}`);
      }
    },

    /**
     * Log a success message with icon
     */
    success(message: string): void {
      // Success always shows, even in quiet mode
      console.log(`${prefixStr}${colors.success('✔')} ${message}`);
    },

    /**
     * Log a warning message with icon
     */
    warn(message: string): void {
      console.warn(`${prefixStr}${colors.warning('⚠')} ${message}`);
    },

    /**
     * Log an error message with icon
     */
    error(message: string): void {
      console.error(`${prefixStr}${colors.error('✖')} ${message}`);
    },

    /**
     * Log a debug message (only in debug mode)
     */
    debug(message: string): void {
      if (debug) {
        console.log(`${prefixStr}${colors.muted('DEBUG')} ${colors.dim(message)}`);
      }
    },
  };
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format a duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 *
 * @example
 * ```typescript
 * formatDuration(500);   // '500ms'
 * formatDuration(2500);  // '2.50s'
 * formatDuration(65000); // '1m 5s'
 * ```
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format bytes to human-readable string
 *
 * @param bytes - Number of bytes
 * @returns Formatted size string
 *
 * @example
 * ```typescript
 * formatBytes(0);       // '0 B'
 * formatBytes(1024);    // '1 KB'
 * formatBytes(1536000); // '1.46 MB'
 * ```
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizeIndex = Math.min(i, 3); // Clamp to valid index (0-3)

  let sizeLabel: string;
  switch (sizeIndex) {
    case 0:
      sizeLabel = 'B';
      break;
    case 1:
      sizeLabel = 'KB';
      break;
    case 2:
      sizeLabel = 'MB';
      break;
    default:
      sizeLabel = 'GB';
  }

  return `${Number.parseFloat((bytes / k ** sizeIndex).toFixed(2))} ${sizeLabel}`;
}

/**
 * Format a count with singular/plural label
 *
 * @param count - The count
 * @param singular - Singular form
 * @param plural - Plural form (defaults to singular + 's')
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatCount(1, 'file');    // '1 file'
 * formatCount(5, 'file');    // '5 files'
 * formatCount(1, 'entry', 'entries'); // '1 entry'
 * ```
 */
export function formatCount(count: number, singular: string, plural?: string): string {
  const label = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${label}`;
}
