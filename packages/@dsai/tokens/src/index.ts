/**
 * DSAi Design Tokens
 *
 * Enterprise-grade design tokens with full TypeScript support.
 *
 * @packageDocumentation
 *
 * @example Flat token access
 * ```ts
 * import { colorBlue500, spacing4, themePrimary } from '@dsai/tokens';
 *
 * const styles = {
 *   color: colorBlue500,
 *   padding: spacing4,
 * };
 * ```
 *
 * @example Grouped token access
 * ```ts
 * import { tokens } from '@dsai/tokens';
 *
 * const blue = tokens.color.blue['500'].value;
 * const primary = tokens.theme.primary.value;
 * ```
 *
 * @example Type-safe utilities
 * ```ts
 * import { getToken, cssVar, getColorToken } from '@dsai/tokens';
 *
 * const blue = getToken('colorBlue500');
 * const ref = cssVar('themePrimary'); // "var(--dsai-theme-primary)"
 * const red = getColorToken('red', '500');
 * ```
 */

// ============================================================================
// Flat Token Exports (camelCase)
// ============================================================================
export * from './tokens-flat.js';

// ============================================================================
// Grouped Token Structure (for Storybook/React)
// ============================================================================
export { default, tokens } from './tokens-grouped.js';

// ============================================================================
// Type-Safe Utilities
// ============================================================================
export {
  getToken,
  getTokenInfo,
  cssVar,
  getColorToken,
  getSpacingToken,
  getThemeToken,
  getBorderRadiusToken,
  isValidToken,
  getAllTokenNames,
  getTokensByCategory,
} from './token-utils.js';

export type { TokenCategory, TokenInfo } from './token-utils.js';
