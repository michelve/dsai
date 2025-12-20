// Import tokens directly - these are the flat exports with correct values
import {
  // Blue colors (primary brand - matches component theme)
  colorBlue400,
  colorBlue500,
  colorBlue600,
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
  // Semantic colors
  semanticBorderColor,
  // Typography
  typographyFontFamilyBase,
  typographyFontFamilyMonospace,
} from '@dsai/tokens';
import { create, type ThemeVars } from 'storybook/theming';

/**
 * DSAi Storybook Theme
 *
 * Uses design tokens from @dsai/tokens for consistent branding.
 * Fonts are loaded dynamically via preview-head.html based on token values.
 *
 * Color scheme uses Blue as primary to match component theme colors.
 */

// Get fonts from tokens (with fallbacks)
const fontBase = typographyFontFamilyBase || 'Inter, system-ui, -apple-system, sans-serif';
const fontCode = typographyFontFamilyMonospace || 'Roboto Mono, Monaco, Courier, monospace';

/**
 * Light Theme
 * Primary: Blue 500 (matches --bs-primary)
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

  // Primary colors - Blue to match component theme
  colorPrimary: colorBlue500 || '#0a58ca',
  colorSecondary: colorBlue600 || '#084298',

  // UI - Using semantic tokens
  appBg: colorGray50 || '#fafbfc',
  appContentBg: backgroundWhite || '#ffffff',
  appPreviewBg: backgroundWhite || '#ffffff',
  appBorderColor: semanticBorderColor || colorGray200 || '#e8eaed',
  appBorderRadius: 4,

  // Text colors
  textColor: colorGray900 || '#212529',
  textInverseColor: backgroundWhite || '#ffffff',
  textMutedColor: colorGray700 || '#495057',

  // Toolbar colors
  barTextColor: colorGray700 || '#495057',
  barSelectedColor: colorBlue500 || '#0a58ca',
  barHoverColor: colorBlue600 || '#084298',
  barBg: backgroundWhite || '#ffffff',

  // Form colors
  inputBg: backgroundWhite || '#ffffff',
  inputBorder: colorGray300 || '#dfe1e5',
  inputTextColor: colorGray900 || '#212529',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: colorGray50 || '#fafbfc',
  buttonBorder: colorGray200 || '#e8eaed',

  // Boolean (toggle) colors
  booleanBg: colorGray50 || '#fafbfc',
  booleanSelectedBg: colorBlue500 || '#0a58ca',
});

/**
 * Dark Theme
 * Primary: Blue 400 (lighter for dark backgrounds)
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

  // Primary colors - Blue 400 for better visibility on dark backgrounds
  colorPrimary: colorBlue400 || '#3d8bfd',
  colorSecondary: colorBlue500 || '#0a58ca',

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
  barSelectedColor: colorBlue400 || '#3d8bfd',
  barHoverColor: colorBlue500 || '#0a58ca',
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
  booleanSelectedBg: colorBlue400 || '#3d8bfd',
});

// Export light theme as default
export default lightTheme;
