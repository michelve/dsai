import { create, type ThemeVars } from 'storybook/theming';

// Import tokens directly - these are the flat exports with correct values
import {
  // Teal colors (primary brand)
  colorTeal400,
  colorTeal500,
  colorTeal600,
  colorTeal950,
  // Gray colors
  colorGray50,
  colorGray200,
  colorGray300,
  colorGray400,
  colorGray600,
  colorGray700,
  colorGray800,
  colorGray900,
  // Background colors
  backgroundWhite,
  backgroundBody,
  // Semantic colors
  semanticBorderColor,
  // Typography
  typographyFontFamilyBase,
  typographyFontFamilyMonospace,
} from '@dsai/tokens';

/**
 * DSAi Storybook Theme
 *
 * Uses design tokens from @dsai/tokens for consistent branding.
 * Fonts are loaded dynamically via preview-head.html based on token values.
 *
 * Color scheme based on Teal as primary brand color per TASK-020 spec.
 */

// Get fonts from tokens (with fallbacks)
const fontBase = typographyFontFamilyBase || 'Inter, system-ui, -apple-system, sans-serif';
const fontCode = typographyFontFamilyMonospace || 'Roboto Mono, Monaco, Courier, monospace';

/**
 * Light Theme
 * Primary: Teal 500
 * Used for manager (sidebar) and docs pages
 */
export const lightTheme: ThemeVars = create({
  base: 'light',

  // Brand
  brandTitle: 'DSAi Component Library',
  brandUrl: 'https://github.com/michelve/dsai',
  brandImage: '/logo.svg',
  brandTarget: '_self',

  // Typography (from tokens)
  fontBase,
  fontCode,

  // Primary colors - Teal based per task spec
  colorPrimary: colorTeal500 || '#20c997',
  colorSecondary: colorTeal600 || '#1aa179',

  // UI - Using semantic tokens
  appBg: colorGray50 || '#fafbfc',
  appContentBg: backgroundWhite || '#ffffff',
  appPreviewBg: backgroundWhite || '#ffffff',
  appBorderColor: semanticBorderColor || colorGray200 || '#e8eaed',
  appBorderRadius: 4,

  // Text colors - Using teal-950 for main text per task spec
  textColor: colorTeal950 || '#06281e',
  textInverseColor: backgroundWhite || '#ffffff',
  textMutedColor: colorGray700 || '#495057',

  // Toolbar colors
  barTextColor: colorGray700 || '#495057',
  barSelectedColor: colorTeal500 || '#20c997',
  barHoverColor: colorTeal600 || '#1aa179',
  barBg: backgroundWhite || '#ffffff',

  // Form colors
  inputBg: backgroundWhite || '#ffffff',
  inputBorder: colorGray300 || '#dfe1e5',
  inputTextColor: colorTeal950 || '#06281e',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: colorGray50 || '#fafbfc',
  buttonBorder: colorGray200 || '#e8eaed',

  // Boolean (toggle) colors
  booleanBg: colorGray50 || '#fafbfc',
  booleanSelectedBg: colorTeal500 || '#20c997',
});

/**
 * Dark Theme
 * Primary: Teal 400 (lighter for dark backgrounds)
 * Used for manager (sidebar) and docs pages in dark mode
 */
export const darkTheme: ThemeVars = create({
  base: 'dark',

  // Brand
  brandTitle: 'DSAi Component Library',
  brandUrl: 'https://github.com/michelve/dsai',
  brandImage: '/logo-white.svg',
  brandTarget: '_self',

  // Typography (from tokens)
  fontBase,
  fontCode,

  // Primary colors - Teal 400 for better visibility on dark
  colorPrimary: colorTeal400 || '#4dd4ac',
  colorSecondary: colorTeal500 || '#20c997',

  // UI - Dark backgrounds
  appBg: colorGray900 || '#212529',
  appContentBg: colorGray800 || '#343a40',
  appPreviewBg: colorGray800 || '#343a40',
  appBorderColor: colorGray700 || '#495057',
  appBorderRadius: 4,

  // Text colors - Light text for dark backgrounds
  textColor: colorGray50 || '#fafbfc',
  textInverseColor: colorGray900 || '#212529',
  textMutedColor: colorGray400 || '#cbced3',

  // Toolbar colors
  barTextColor: colorGray300 || '#dfe1e5',
  barSelectedColor: colorTeal400 || '#4dd4ac',
  barHoverColor: colorTeal500 || '#20c997',
  barBg: colorGray800 || '#343a40',

  // Form colors
  inputBg: colorGray700 || '#495057',
  inputBorder: colorGray600 || '#7a7f87',
  inputTextColor: colorGray50 || '#fafbfc',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: colorGray700 || '#495057',
  buttonBorder: colorGray600 || '#7a7f87',

  // Boolean (toggle) colors
  booleanBg: colorGray700 || '#495057',
  booleanSelectedBg: colorTeal400 || '#4dd4ac',
});

// Export light theme as default
export default lightTheme;
