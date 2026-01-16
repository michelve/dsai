// Import tokens from locally generated files
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
  // Theme colors
  themeDark,
  // Typography
  typographyFontFamilyBase,
  typographyFontFamilyMonospace,
} from '../src/generated/tokens.js';
import { create, type ThemeVars } from 'storybook/theming';

/**
 * DSAi Storybook Theme
 *
 * Uses design tokens from @dsai-io/figma-tokens and @dsai-io/tools for consistent branding.
 * Fonts are loaded dynamically via preview-head.html based on token values.
 *
 * Color scheme uses Blue as primary to match component theme colors.
 */

// Get fonts from tokens
const fontBase = typographyFontFamilyBase;
const fontCode = typographyFontFamilyMonospace;

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
  colorPrimary: colorBlue500,
  colorSecondary: colorBlue600,

  // UI - Using semantic tokens
  appBg: colorGray50,
  appContentBg: backgroundWhite,
  appPreviewBg: backgroundWhite,
  appBorderColor: semanticBorderColor ?? colorGray200,
  appBorderRadius: 4,

  // Text colors
  textColor: colorGray900,
  textInverseColor: backgroundWhite,
  textMutedColor: colorGray700,

  // Toolbar colors
  barTextColor: colorGray700,
  barSelectedColor: colorBlue500,
  barHoverColor: colorBlue600,
  barBg: backgroundWhite,

  // Form colors
  inputBg: backgroundWhite,
  inputBorder: colorGray300,
  inputTextColor: colorGray900,
  inputBorderRadius: 4,

  // Button colors
  buttonBg: colorGray50,
  buttonBorder: colorGray200,

  // Boolean (toggle) colors
  booleanBg: colorGray50,
  booleanSelectedBg: colorBlue500,
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
  colorPrimary: colorBlue400,
  colorSecondary: colorBlue500,

  // UI - Dark backgrounds
  appBg: themeDark,
  appContentBg: colorGray800,
  appPreviewBg: colorGray800,
  appBorderColor: colorGray700,
  appBorderRadius: 4,

  // Text colors - Light text for dark backgrounds
  textColor: colorGray50,
  textInverseColor: themeDark,
  textMutedColor: colorGray400,

  // Toolbar colors
  barTextColor: colorGray300,
  barSelectedColor: colorBlue400,
  barHoverColor: colorBlue500,
  barBg: colorGray800,

  // Form colors
  inputBg: colorGray700,
  inputBorder: colorGray600,
  inputTextColor: colorGray50,
  inputBorderRadius: 4,

  // Button colors
  buttonBg: colorGray700,
  buttonBorder: colorGray600,

  // Boolean (toggle) colors
  booleanBg: colorGray700,
  booleanSelectedBg: colorBlue400,
});

// Export light theme as default
export default lightTheme;
