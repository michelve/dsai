/**
 * Bootstrap Framework Mapper
 *
 * Maps Figma/DTCG token names to Bootstrap 5.x variable names.
 * This is the complete mapping list extracted from the playground's
 * _variables.scss compatibility layer.
 *
 * @packageDocumentation
 */

import type { FrameworkMappingConfig, FrameworkMappingPattern } from '../../config/types.js';

// ============================================================================
// Bootstrap Name Mappings
// ============================================================================

/**
 * Complete token name → Bootstrap variable name mappings
 *
 * These mappings handle cases where Figma/DTCG token naming conventions
 * differ from Bootstrap 5.x variable naming conventions.
 *
 * The mappings are extracted from the playground's manual _variables.scss
 * compatibility layer to ensure complete parity.
 *
 * CATEGORIES:
 * - Typography: Font sizes, weights, headings, display, line heights, letter spacing
 * - Colors: Pass through (no mapping needed - names match)
 * - Spacing: Pass through (no mapping needed - names match)
 * - Layout: Pass through (no mapping needed - names match)
 * - Shadows: Custom mappings to Bootstrap shadow variable names
 * - Border Radius: Custom mappings to Bootstrap radius variable names
 */
export const BOOTSTRAP_MAPPINGS: Record<string, string> = {
  // ==========================================================================
  // TYPOGRAPHY - Font Sizes
  // ==========================================================================
  // Figma uses "text" prefix, Bootstrap uses "font-size" prefix
  'typography-text-base': 'font-size-base',
  'typography-text-sm': 'font-size-sm',
  'typography-text-lead': 'font-size-lg',

  // ==========================================================================
  // TYPOGRAPHY - Font Weights
  // ==========================================================================
  // Figma uses descriptive names, Bootstrap uses semantic names
  'typography-font-weight-thin': 'font-weight-lighter',
  'typography-font-weight-extra-light': 'font-weight-lighter',
  'typography-font-weight-light': 'font-weight-light',
  'typography-font-weight-regular': 'font-weight-normal',
  'typography-font-weight-medium': 'font-weight-medium',
  'typography-font-weight-semi-bold': 'font-weight-semibold',
  'typography-font-weight-bold': 'font-weight-bold',
  'typography-font-weight-extra-bold': 'font-weight-bold',
  'typography-font-weight-black': 'font-weight-bolder',

  // ==========================================================================
  // TYPOGRAPHY - Font Families
  // ==========================================================================
  'typography-font-family-base': 'font-family-base',
  'typography-font-family-monospace': 'font-family-monospace',

  // ==========================================================================
  // TYPOGRAPHY - Headings (h1-h6)
  // ==========================================================================
  // Figma: heading-h1 → Bootstrap: h1-font-size
  'typography-heading-h1': 'h1-font-size',
  'typography-heading-h2': 'h2-font-size',
  'typography-heading-h3': 'h3-font-size',
  'typography-heading-h4': 'h4-font-size',
  'typography-heading-h5': 'h5-font-size',
  'typography-heading-h6': 'h6-font-size',

  // ==========================================================================
  // TYPOGRAPHY - Display Headings (d1-d6)
  // ==========================================================================
  // Figma: display-d1 → Bootstrap: display1-size (part of $display-font-sizes map)
  'typography-display-d1': 'display1-size',
  'typography-display-d2': 'display2-size',
  'typography-display-d3': 'display3-size',
  'typography-display-d4': 'display4-size',
  'typography-display-d5': 'display5-size',
  'typography-display-d6': 'display6-size',
  // Alternative naming: display-h1 → display1-size
  'typography-display-h1': 'display1-size',
  'typography-display-h2': 'display2-size',
  'typography-display-h3': 'display3-size',
  'typography-display-h4': 'display4-size',
  'typography-display-h5': 'display5-size',
  'typography-display-h6': 'display6-size',

  // ==========================================================================
  // TYPOGRAPHY - Line Heights
  // ==========================================================================
  'typography-line-height-xs': 'line-height-xs',
  'typography-line-height-sm': 'line-height-sm',
  'typography-line-height-tight': 'headings-line-height',
  'typography-line-height-base': 'line-height-base',
  'typography-line-height-relaxed': 'line-height-relaxed',
  'typography-line-height-lg': 'line-height-lg',
  'typography-line-height-display-sm': 'display-line-height',
  'typography-line-height-display-md': 'display-line-height-md',
  'typography-line-height-display-lg': 'display-line-height-lg',

  // ==========================================================================
  // TYPOGRAPHY - Letter Spacing
  // ==========================================================================
  'typography-letter-spacing-tighter': 'letter-spacing-tighter',
  'typography-letter-spacing-tightest': 'letter-spacing-tighter',
  'typography-letter-spacing-tight': 'letter-spacing-tight',
  'typography-letter-spacing-normal': 'letter-spacing-normal',
  'typography-letter-spacing-wide': 'letter-spacing-wide',
  'typography-letter-spacing-wider': 'letter-spacing-wider',
  'typography-letter-spacing-widest': 'letter-spacing-widest',

  // ==========================================================================
  // TYPOGRAPHY - Lead
  // ==========================================================================
  'typography-lead-font-size': 'lead-font-size',

  // ==========================================================================
  // SHADOWS
  // ==========================================================================
  // Figma: shadow-default → Bootstrap: box-shadow
  'shadow-default': 'box-shadow',
  'shadow-sm': 'box-shadow-sm',
  'shadow-lg': 'box-shadow-lg',
  'shadow-inset': 'box-shadow-inset',

  // ==========================================================================
  // BORDER WIDTH
  // ==========================================================================
  // Figma: border-width-0 → Bootstrap: border-width-0
  'border-width-0': 'border-width-0',
  'border-width-1': 'border-width-1',
  'border-width-2': 'border-width-2',
  'border-width-3': 'border-width-3',
  'border-width-4': 'border-width-4',
  'border-width-5': 'border-width-5',

  // ==========================================================================
  // BORDER RADIUS
  // ==========================================================================
  // Figma: border-radius-default → Bootstrap: border-radius
  'border-radius-0': 'border-radius-0',
  'border-radius-default': 'border-radius',
  'border-radius-sm': 'border-radius-sm',
  'border-radius-lg': 'border-radius-lg',
  'border-radius-xl': 'border-radius-xl',
  'border-radius-xxl': 'border-radius-xxl',
  'border-radius-pill': 'border-radius-pill',
  'border-radius-circle': 'border-radius-circle',

  // ==========================================================================
  // SEMANTIC / THEME COLORS
  // ==========================================================================
  // Figma: theme-primary → Bootstrap uses these directly
  'theme-primary': 'primary',
  'theme-secondary': 'secondary',
  'theme-success': 'success',
  'theme-danger': 'danger',
  'theme-warning': 'warning',
  'theme-info': 'info',
  'theme-light': 'light',
  'theme-dark': 'dark',

  // ==========================================================================
  // LAYOUT - Grid
  // ==========================================================================
  'layout-grid-columns': 'grid-columns',
  'layout-grid-gutter-width': 'grid-gutter-width',
  'layout-grid-row-columns': 'grid-row-columns',

  // ==========================================================================
  // LAYOUT - Container
  // ==========================================================================
  'layout-container-padding-x': 'container-padding-x',
  'layout-container-max-width-sm': 'container-max-width-sm',
  'layout-container-max-width-md': 'container-max-width-md',
  'layout-container-max-width-lg': 'container-max-width-lg',
  'layout-container-max-width-xl': 'container-max-width-xl',
  'layout-container-max-width-xxl': 'container-max-width-xxl',

  // ==========================================================================
  // LAYOUT - Breakpoints (for reference, typically used in maps)
  // ==========================================================================
  'layout-breakpoints-xs': 'breakpoint-xs',
  'layout-breakpoints-sm': 'breakpoint-sm',
  'layout-breakpoints-md': 'breakpoint-md',
  'layout-breakpoints-lg': 'breakpoint-lg',
  'layout-breakpoints-xl': 'breakpoint-xl',
  'layout-breakpoints-xxl': 'breakpoint-xxl',

  // ==========================================================================
  // LAYOUT - Gutters
  // ==========================================================================
  'layout-gutters-0': 'gutters-0',
  'layout-gutters-1': 'gutters-1',
  'layout-gutters-2': 'gutters-2',
  'layout-gutters-3': 'gutters-3',
  'layout-gutters-4': 'gutters-4',
  'layout-gutters-5': 'gutters-5',
};

/**
 * Pattern-based mappings for Bootstrap
 *
 * Applied after explicit mappings for tokens that follow
 * predictable naming patterns. These handle bulk transformations
 * for categories with consistent naming.
 */
export const BOOTSTRAP_PATTERNS: FrameworkMappingPattern[] = [
  // ==========================================================================
  // COLOR SCALES - Pass through unchanged
  // ==========================================================================
  // color-blue-500 → color-blue-500 (no transformation needed)
  // These tokens keep their original names as Bootstrap color scales
  // match the DSAi/Figma naming convention.
  // ==========================================================================
  // SPACING SCALE - Strip "spacing-" prefix for Bootstrap $spacer map
  // ==========================================================================
  // spacing-1 → spacer-1 (Bootstrap uses $spacers map)
  // Note: Not applied by default since playground keeps spacing- prefix
  // ==========================================================================
  // LAYOUT BREAKPOINTS - Already handled in explicit mappings
  // ==========================================================================
];

/**
 * Bootstrap framework mapping configuration
 */
export const bootstrapMapper: FrameworkMappingConfig = {
  framework: 'bootstrap',
  mappings: BOOTSTRAP_MAPPINGS,
  patterns: BOOTSTRAP_PATTERNS,
  variablePrefix: '$',
  header: `// ============================================================================
// DSAi Design Tokens for Bootstrap 5.x
// ============================================================================
// Auto-generated from Figma design tokens via @dsai-io/tools
// DO NOT EDIT DIRECTLY - Regenerate with: pnpm tokens:build
//
// These variables are mapped to Bootstrap 5.x naming conventions.
// Use with Bootstrap's SCSS customization workflow:
//
//   @use './_variables' as dsai;
//   @use 'bootstrap/scss/bootstrap' with (
//     $primary: dsai.$primary,
//     $font-size-base: dsai.$font-size-base,
//   );
//
// @see https://getbootstrap.com/docs/5.3/customize/sass/
// ============================================================================

`,
};

/**
 * Apply Bootstrap-specific name mapping to a token name
 *
 * @param tokenName - Original token name (e.g., 'typography-heading-h1')
 * @returns Mapped name (e.g., 'h1-font-size')
 *
 * @example
 * ```typescript
 * mapToBootstrapName('typography-text-base')
 * // Returns: 'font-size-base'
 *
 * mapToBootstrapName('typography-heading-h1')
 * // Returns: 'h1-font-size'
 *
 * mapToBootstrapName('color-blue-500')
 * // Returns: 'color-blue-500' (pass through)
 * ```
 */
export function mapToBootstrapName(tokenName: string): string {
  // Check explicit mappings first using Map for safe access
  const mappingsMap = new Map(Object.entries(BOOTSTRAP_MAPPINGS));
  if (mappingsMap.has(tokenName)) {
    return mappingsMap.get(tokenName) ?? tokenName;
  }

  // Apply pattern-based mappings
  for (const pattern of BOOTSTRAP_PATTERNS) {
    // Pre-compiled regex patterns only - no dynamic construction from untrusted input
    if (pattern.pattern instanceof RegExp && pattern.pattern.test(tokenName)) {
      return tokenName.replaceAll(pattern.pattern, pattern.replacement);
    }
  }

  // No mapping found - return original name
  return tokenName;
}
