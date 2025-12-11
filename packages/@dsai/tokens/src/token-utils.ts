/**
 * Token Utilities
 *
 * Type-safe utilities for accessing design tokens.
 * Provides IntelliSense support and compile-time validation.
 *
 * @packageDocumentation
 */

import * as tokens from './tokens-flat.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * All available token categories
 */
export type TokenCategory =
  | 'color'
  | 'neutral'
  | 'background'
  | 'theme'
  | 'semantic'
  | 'opacity'
  | 'typography'
  | 'spacing'
  | 'border'
  | 'shadow'
  | 'layout';

/**
 * Token value with CSS variable reference
 */
export interface TokenInfo {
  /** The token value (e.g., "#0a58ca" or "1rem") */
  value: string;
  /** CSS variable name (e.g., "--dsai-color-blue-500") */
  cssVar: string;
  /** CSS variable reference (e.g., "var(--dsai-color-blue-500)") */
  cssVarRef: string;
}

// ============================================================================
// Safe Property Access Helpers
// ============================================================================

/**
 * Type guard to check if a key exists in the tokens object
 * Uses Object.prototype.hasOwnProperty.call for safe property checking
 * (ES2020 compatible - Object.hasOwn requires ES2022)
 */
function hasToken(key: string): key is keyof typeof tokens {
  return Object.prototype.hasOwnProperty.call(tokens, key);
}

/**
 * Pre-built lookup Map for O(1) token access without bracket notation
 * This avoids security/detect-object-injection while maintaining performance
 */
const tokenLookup = new Map<string, string | number>(
  Object.entries(tokens) as [string, string | number][]
);

/**
 * Safely access a token value using Map lookup
 * This wrapper ensures we only access properties that exist
 */
function safeGetTokenValue(key: keyof typeof tokens): string | number | undefined {
  return tokenLookup.get(key);
}

// ============================================================================
// Token Lookup Functions
// ============================================================================

/**
 * Get a token value by its flat name (camelCase)
 *
 * @param name - The camelCase token name (e.g., "colorBlue500")
 * @returns The token value or undefined if not found
 *
 * @example
 * ```ts
 * const blue = getToken('colorBlue500'); // "#0a58ca"
 * const spacing = getToken('spacing4'); // "1.5rem"
 * ```
 */
export function getToken(name: keyof typeof tokens): string | number | undefined {
  if (!hasToken(name)) {
    return undefined;
  }
  return safeGetTokenValue(name);
}

/**
 * Get a token with full info including CSS variable reference
 *
 * @param name - The camelCase token name
 * @returns Token info object with value and CSS variable
 *
 * @example
 * ```ts
 * const info = getTokenInfo('colorBlue500');
 * // { value: "#0a58ca", cssVar: "--dsai-color-blue-500", cssVarRef: "var(--dsai-color-blue-500)" }
 *
 * // Use in styles
 * <div style={{ backgroundColor: info.cssVarRef }} />
 * ```
 */
export function getTokenInfo(name: keyof typeof tokens): TokenInfo | undefined {
  if (!hasToken(name)) {
    return undefined;
  }
  const value = safeGetTokenValue(name);

  // Convert camelCase to kebab-case for CSS variable
  const cssVarName = name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

  const cssVar = `--dsai-${cssVarName}`;

  return {
    value: String(value),
    cssVar,
    cssVarRef: `var(${cssVar})`,
  };
}

/**
 * Get CSS variable reference for a token
 *
 * @param name - The camelCase token name
 * @returns CSS variable reference string
 *
 * @example
 * ```ts
 * const ref = cssVar('colorBlue500');
 * // "var(--dsai-color-blue-500)"
 *
 * <div style={{ color: cssVar('themePrimary') }} />
 * ```
 */
export function cssVar(name: keyof typeof tokens): string {
  const info = getTokenInfo(name);
  return info?.cssVarRef ?? '';
}

// ============================================================================
// Category-Specific Getters
// ============================================================================

/**
 * Get a color token value
 *
 * @example
 * ```ts
 * const blue = getColorToken('blue', '500'); // "#0a58ca"
 * const red = getColorToken('red', '600'); // "#ab2346"
 * ```
 */
export function getColorToken(
  hue:
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'cyan',
  shade: '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
): string {
  const key = `color${hue.charAt(0).toUpperCase() + hue.slice(1)}${shade}`;
  if (!hasToken(key)) {
    return '';
  }
  return String(safeGetTokenValue(key as keyof typeof tokens) ?? '');
}

/**
 * Get a spacing token value
 *
 * @example
 * ```ts
 * const space = getSpacingToken('4'); // "1.5rem"
 * ```
 */
export function getSpacingToken(
  scale: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
): string {
  const key = `spacing${scale}`;
  if (!hasToken(key)) {
    return '';
  }
  return String(safeGetTokenValue(key as keyof typeof tokens) ?? '');
}

/**
 * Get a theme color token value
 *
 * @example
 * ```ts
 * const primary = getThemeToken('primary'); // "#0d6efd"
 * const danger = getThemeToken('danger'); // "#dc3545"
 * ```
 */
export function getThemeToken(
  name: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
): string {
  const key = `theme${name.charAt(0).toUpperCase() + name.slice(1)}`;
  if (!hasToken(key)) {
    return '';
  }
  return String(safeGetTokenValue(key as keyof typeof tokens) ?? '');
}

/**
 * Get a border radius token value
 *
 * @example
 * ```ts
 * const radius = getBorderRadiusToken('md'); // "0.5rem"
 * ```
 */
export function getBorderRadiusToken(
  size: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full' | 'circle' | 'pill'
): string {
  const key = `borderRadius${size.charAt(0).toUpperCase() + size.slice(1)}`;
  if (!hasToken(key)) {
    return '';
  }
  return String(safeGetTokenValue(key as keyof typeof tokens) ?? '');
}

// ============================================================================
// Token Validation
// ============================================================================

/**
 * Check if a token name exists
 *
 * @param name - The token name to check
 * @returns true if the token exists
 */
export function isValidToken(name: string): name is keyof typeof tokens {
  return name in tokens;
}

/**
 * Get all token names
 *
 * @returns Array of all token names
 */
export function getAllTokenNames(): (keyof typeof tokens)[] {
  return Object.keys(tokens) as (keyof typeof tokens)[];
}

/**
 * Get all tokens in a category
 *
 * @param category - The token category prefix
 * @returns Object with token names and values
 */
export function getTokensByCategory(category: TokenCategory): Record<string, string | number> {
  const categoryLower = category.toLowerCase();

  // Filter entries and build object with Object.fromEntries - no dynamic assignment
  const filtered = Object.entries(tokens).filter(([key]) =>
    key.toLowerCase().startsWith(categoryLower)
  ) as [string, string | number][];

  return Object.fromEntries(filtered);
}

// ============================================================================
// Re-export all tokens
// ============================================================================

export { tokens };
export default tokens;
