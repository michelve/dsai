/**
 * @file tokenToCssVar - Convert design token to CSS variable
 * @module @dsai-io/react/utils/color
 *
 * Enterprise-grade token to CSS variable converter with:
 * - Dot notation support (colors.primary.500)
 * - Kebab-case conversion
 * - Prefix support
 * - Validation
 */

/**
 * Options for token to CSS variable conversion
 */
export interface TokenToCssVarOptions {
  /** Prefix for CSS variable (default: '') */
  prefix?: string;
  /** Whether to include --var() wrapper (default: false) */
  withVar?: boolean;
}

/**
 * Convert design token path to CSS variable name
 *
 * @param token - Design token path (e.g., 'colors.primary.500')
 * @param options - Conversion options
 * @returns CSS variable name (e.g., '--colors-primary-500' or 'var(--colors-primary-500)')
 *
 * @example
 * ```tsx
 * // Basic conversion
 * tokenToCssVar('colors.primary.500'); // '--colors-primary-500'
 *
 * // With prefix
 * tokenToCssVar('primary.500', { prefix: 'color' }); // '--color-primary-500'
 *
 * // With var() wrapper
 * tokenToCssVar('spacing.xl', { withVar: true }); // 'var(--spacing-xl)'
 *
 * // Both prefix and var()
 * tokenToCssVar('blue.500', {
 *   prefix: 'color',
 *   withVar: true
 * }); // 'var(--color-blue-500)'
 *
 * // Component usage
 * const theme = {
 *   primary: 'colors.primary.500',
 *   secondary: 'colors.secondary.500'
 * };
 *
 * <div
 *   style={{
 *     color: tokenToCssVar(theme.primary, { withVar: true }),
 *     backgroundColor: tokenToCssVar(theme.secondary, { withVar: true })
 *   }}
 * >
 *   Themed content
 * </div>
 * ```
 */
export function tokenToCssVar(token: string, options: TokenToCssVarOptions = {}): string {
  const { prefix = '', withVar = false } = options;

  // Validate input
  if (typeof token !== 'string' || token.trim() === '') {
    console.warn('[tokenToCssVar] Token must be a non-empty string');
    return '';
  }

  // Convert dot notation to kebab-case
  let varName = token
    .trim()
    .split('.')
    .map((part) => part.toLowerCase())
    .join('-');

  // Add prefix if provided
  if (prefix) {
    varName = `${prefix.toLowerCase()}-${varName}`;
  }

  // Add CSS variable prefix
  varName = `--${varName}`;

  // Wrap in var() if requested
  if (withVar) {
    return `var(${varName})`;
  }

  return varName;
}
