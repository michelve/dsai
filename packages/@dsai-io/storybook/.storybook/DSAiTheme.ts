// Import tokens from locally generated files
import {
  // Blue colors (primary brand - matches component theme)
  ColorBlue_400,
  ColorBlue_500,
  ColorBlue_600,
  // Gray colors
  ColorGray_50,
  ColorGray_200,
  ColorGray_300,
  ColorGray_400,
  ColorGray_600,
  ColorGray_700,
  ColorGray_800,
  ColorGray_900,
  // Background colors
  BackgroundWhite,
  // Semantic colors
  SemanticBorderColor,
  // Theme colors
  ThemeDark,
  // Typography
  TypographyFontfamilyBase,
  TypographyFontfamilyMonospace,
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
const fontBase = TypographyFontfamilyBase;
const fontCode = TypographyFontfamilyMonospace;

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
  colorPrimary: ColorBlue_500,
  colorSecondary: ColorBlue_600,

  // UI - Using semantic tokens
  appBg: ColorGray_50,
  appContentBg: BackgroundWhite,
  appPreviewBg: BackgroundWhite,
  appBorderColor: SemanticBorderColor ?? ColorGray_200,
  appBorderRadius: 4,

  // Text colors
  textColor: ColorGray_900,
  textInverseColor: BackgroundWhite,
  textMutedColor: ColorGray_700,

  // Toolbar colors
  barTextColor: ColorGray_700,
  barSelectedColor: ColorBlue_500,
  barHoverColor: ColorBlue_600,
  barBg: BackgroundWhite,

  // Form colors
  inputBg: BackgroundWhite,
  inputBorder: ColorGray_300,
  inputTextColor: ColorGray_900,
  inputBorderRadius: 4,

  // Button colors
  buttonBg: ColorGray_50,
  buttonBorder: ColorGray_200,

  // Boolean (toggle) colors
  booleanBg: ColorGray_50,
  booleanSelectedBg: ColorBlue_500,
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
  colorPrimary: ColorBlue_400,
  colorSecondary: ColorBlue_500,

  // UI - Dark backgrounds
  appBg: ThemeDark,
  appContentBg: ColorGray_800,
  appPreviewBg: ColorGray_800,
  appBorderColor: ColorGray_700,
  appBorderRadius: 4,

  // Text colors - Light text for dark backgrounds
  textColor: ColorGray_50,
  textInverseColor: ThemeDark,
  textMutedColor: ColorGray_400,

  // Toolbar colors
  barTextColor: ColorGray_300,
  barSelectedColor: ColorBlue_400,
  barHoverColor: ColorBlue_500,
  barBg: ColorGray_800,

  // Form colors
  inputBg: ColorGray_700,
  inputBorder: ColorGray_600,
  inputTextColor: ColorGray_50,
  inputBorderRadius: 4,

  // Button colors
  buttonBg: ColorGray_700,
  buttonBorder: ColorGray_600,

  // Boolean (toggle) colors
  booleanBg: ColorGray_700,
  booleanSelectedBg: ColorBlue_400,
});

// Export light theme as default
export default lightTheme;
