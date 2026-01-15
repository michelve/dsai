/**
 * UI utilities for CLI
 *
 * @packageDocumentation
 * @module @dsai/tools/cli/ui
 */

export { colors, default as colorsDefault } from './colors.js';
export { createSpinner } from './spinner.js';
export { createLogger, formatDuration, formatBytes, formatCount } from './logger.js';

export type { LoggerOptions } from './logger.js';
