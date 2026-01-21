/**
 * shadcn/ui Framework Mapper
 *
 * Maps Figma/DTCG token names to shadcn/ui CSS variable names.
 *
 * @packageDocumentation
 */

import type { FrameworkMappingConfig, FrameworkMappingPattern } from '../../config/types.js';

// ============================================================================
// shadcn/ui Name Mappings
// ============================================================================

/**
 * Explicit token name → shadcn/ui variable name mappings
 *
 * shadcn/ui uses a simplified naming convention with CSS custom properties.
 * @see https://ui.shadcn.com/docs/theming
 */
export const SHADCN_MAPPINGS: Record<string, string> = {
  // Semantic Colors → shadcn theme colors
  'semantic-primary': 'primary',
  'semantic-secondary': 'secondary',
  'semantic-success': 'success',
  'semantic-danger': 'destructive',
  'semantic-warning': 'warning',
  'semantic-info': 'info',
  'semantic-body-bg': 'background',
  'semantic-body-color': 'foreground',
  'theme-primary': 'primary',
  'theme-secondary': 'secondary',

  // Neutral colors
  'neutral-white': 'background',
  'neutral-black': 'foreground',
  'color-gray-100': 'muted',
  'color-gray-600': 'muted-foreground',

  // Card colors
  'semantic-light': 'card',
  'color-gray-900': 'card-foreground',

  // Border
  'semantic-border-color': 'border',
  'color-gray-200': 'input',

  // Focus ring
  'color-blue-500': 'ring',

  // Border radius
  'border-radius': 'radius',
  'border-radius-sm': 'radius-sm',
  'border-radius-lg': 'radius-lg',

  // Typography
  'typography-font-family-base': 'font-sans',
  'typography-font-family-monospace': 'font-mono',
};

/**
 * Pattern-based mappings for shadcn/ui
 */
export const SHADCN_PATTERNS: FrameworkMappingPattern[] = [
  // Accent colors from color scales
  {
    pattern: /^color-blue-500$/,
    replacement: 'accent',
    description: 'Primary accent color',
  },
  {
    pattern: /^color-blue-100$/,
    replacement: 'accent-foreground',
    description: 'Accent foreground color',
  },
];

/**
 * shadcn/ui framework mapping configuration
 */
export const shadcnMapper: FrameworkMappingConfig = {
  framework: 'shadcn',
  mappings: SHADCN_MAPPINGS,
  patterns: SHADCN_PATTERNS,
  variablePrefix: '--',
  header: `/* ============================================================================
 * DSAi Design Tokens for shadcn/ui
 * ============================================================================
 * Auto-generated from Figma design tokens via @dsai-io/tools
 * DO NOT EDIT DIRECTLY - Regenerate with: pnpm tokens:build
 *
 * Usage in CSS:
 *   background-color: hsl(var(--background));
 *   color: hsl(var(--foreground));
 *
 * @see https://ui.shadcn.com/docs/theming
 * ============================================================================ */
`,
};

/**
 * Apply shadcn-specific name mapping to a token name
 *
 * @param tokenName - Original token name (e.g., 'semantic-primary')
 * @returns Mapped name (e.g., 'primary')
 */
export function mapToShadcnName(tokenName: string): string {
  // Check explicit mappings first using Map for safe access
  const mappingsMap = new Map(Object.entries(SHADCN_MAPPINGS));
  if (mappingsMap.has(tokenName)) {
    return mappingsMap.get(tokenName) ?? tokenName;
  }

  // Apply pattern-based mappings
  for (const pattern of SHADCN_PATTERNS) {
    if (pattern.pattern instanceof RegExp && pattern.pattern.test(tokenName)) {
      return tokenName.replace(pattern.pattern, pattern.replacement);
    }
  }

  // No mapping found - return original name
  return tokenName;
}
