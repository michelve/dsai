/**
 * Color utilities for CLI output
 *
 * Wraps picocolors with NO_COLOR environment variable support.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/ui/colors
 */

import pc from 'picocolors';

/**
 * Check if colors should be disabled
 *
 * Respects:
 * - NO_COLOR environment variable (https://no-color.org/)
 * - FORCE_COLOR=0
 * - Non-TTY output
 */
function colorsDisabled(): boolean {
  return (
    process.env['NO_COLOR'] !== undefined ||
    process.env['FORCE_COLOR'] === '0' ||
    !process.stdout.isTTY
  );
}

/**
 * Conditionally apply color function
 */
function maybeColor(fn: (s: string) => string, text: string): string {
  return colorsDisabled() ? text : fn(text);
}

/**
 * Color utilities with NO_COLOR support
 *
 * @example
 * ```typescript
 * import { colors } from './colors.js';
 *
 * console.log(colors.success('Build complete!'));
 * console.log(colors.error('Something went wrong'));
 * console.log(colors.path('./dist/tokens.css'));
 * ```
 */
export const colors = {
  // =========================================================================
  // Text Colors
  // =========================================================================

  /** Red text */
  red: (text: string): string => maybeColor(pc.red, text),

  /** Green text */
  green: (text: string): string => maybeColor(pc.green, text),

  /** Yellow text */
  yellow: (text: string): string => maybeColor(pc.yellow, text),

  /** Blue text */
  blue: (text: string): string => maybeColor(pc.blue, text),

  /** Magenta text */
  magenta: (text: string): string => maybeColor(pc.magenta, text),

  /** Cyan text */
  cyan: (text: string): string => maybeColor(pc.cyan, text),

  /** Gray/dim text */
  gray: (text: string): string => maybeColor(pc.gray, text),

  /** White text */
  white: (text: string): string => maybeColor(pc.white, text),

  // =========================================================================
  // Text Modifiers
  // =========================================================================

  /** Bold text */
  bold: (text: string): string => maybeColor(pc.bold, text),

  /** Dim text */
  dim: (text: string): string => maybeColor(pc.dim, text),

  /** Italic text */
  italic: (text: string): string => maybeColor(pc.italic, text),

  /** Underlined text */
  underline: (text: string): string => maybeColor(pc.underline, text),

  // =========================================================================
  // Background Colors
  // =========================================================================

  /** Red background */
  bgRed: (text: string): string => maybeColor(pc.bgRed, text),

  /** Green background */
  bgGreen: (text: string): string => maybeColor(pc.bgGreen, text),

  /** Yellow background */
  bgYellow: (text: string): string => maybeColor(pc.bgYellow, text),

  /** Blue background */
  bgBlue: (text: string): string => maybeColor(pc.bgBlue, text),

  // =========================================================================
  // Semantic Colors
  // =========================================================================

  /** Error messages - red */
  error: (text: string): string => maybeColor(pc.red, text),

  /** Success messages - green */
  success: (text: string): string => maybeColor(pc.green, text),

  /** Warning messages - yellow */
  warning: (text: string): string => maybeColor(pc.yellow, text),

  /** Info messages - blue */
  info: (text: string): string => maybeColor(pc.blue, text),

  /** Muted/secondary text - gray */
  muted: (text: string): string => maybeColor(pc.gray, text),

  // =========================================================================
  // Combined Styles
  // =========================================================================

  /** Labels - bold cyan */
  label: (text: string): string => maybeColor(pc.bold, maybeColor(pc.cyan, text)),

  /** Values - yellow */
  value: (text: string): string => maybeColor(pc.yellow, text),

  /** File paths - underlined cyan */
  path: (text: string): string => maybeColor(pc.underline, maybeColor(pc.cyan, text)),

  /** Commands - bold green */
  command: (text: string): string => maybeColor(pc.bold, maybeColor(pc.green, text)),

  /** Code snippets - dim */
  code: (text: string): string => maybeColor(pc.dim, text),

  /** Highlight - bold yellow */
  highlight: (text: string): string => maybeColor(pc.bold, maybeColor(pc.yellow, text)),
};

export default colors;
