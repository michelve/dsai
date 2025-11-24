import { create } from 'storybook/theming';

// Import tokens directly - these are the flat exports with correct values
import {
  colorBlue600,
  colorCyan600,
  themePrimary,
  themeInfo,
  typographyFontFamilyBase,
  typographyFontFamilyMonospace,
} from '@dsai/tokens';

/**
 * DSAi Storybook Theme
 *
 * Uses design tokens from @dsai/tokens for consistent branding.
 * Fonts are loaded dynamically via preview-head.html based on token values.
 */

// Get colors from tokens (with fallbacks)
const colorPrimary = colorBlue600 || themePrimary || '#2563eb';
const colorSecondary = colorCyan600 || themeInfo || '#0891b2';

// Get fonts from tokens (with fallbacks)
// Note: These come from the flat token exports
const fontBase = typographyFontFamilyBase || 'Inter, system-ui, -apple-system, sans-serif';
const fontCode = typographyFontFamilyMonospace || 'Roboto Mono, Monaco, Courier, monospace';

console.log('[DSAi Theme] Loaded tokens');
console.log('[DSAi Theme] Font base:', fontBase?.substring?.(0, 50) || fontBase);

export default create({
  base: 'light',

  // Brand
  brandTitle: 'DSAi Design System',
  brandUrl: 'https://github.com/michelve/dsai',
  brandImage: '/logo.svg',
  brandTarget: '_self',

  // Typography (from tokens)
  fontBase,
  fontCode,

  // Primary colors (from tokens)
  colorPrimary,
  colorSecondary,

  // UI - Using hardcoded values that match your tokens
  appBg: '#f9fafb', // background.secondary
  appContentBg: '#ffffff', // background.primary
  appPreviewBg: '#ffffff',
  appBorderColor: '#e5e7eb', // border.color.default
  appBorderRadius: 8,

  // Text colors
  textColor: '#111827', // gray.900
  textInverseColor: '#ffffff',
  textMutedColor: '#4b5563', // gray.600

  // Toolbar colors
  barTextColor: '#4b5563',
  barSelectedColor: colorPrimary,
  barHoverColor: '#1d4ed8', // blue.700
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e5e7eb',
  inputTextColor: '#111827',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: '#f9fafb',
  buttonBorder: '#e5e7eb',

  // Boolean (toggle) colors
  booleanBg: '#f9fafb',
  booleanSelectedBg: colorPrimary,
});
