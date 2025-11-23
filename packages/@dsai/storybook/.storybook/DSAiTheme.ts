import { create } from 'storybook/theming';

// Helper to safely extract token values
// Tokens are DTCG format with $value property
const getTokenValue = (token: any): string => {
  if (!token) return '';
  if (typeof token === 'string') return token;
  if (token.$value) return token.$value;
  if (token.value) return token.value;
  return '';
};

// Import tokens dynamically to extract values safely
let colorPrimary = '#2563eb';
let colorSecondary = '#0891b2';
let fontBase = 'Inter, system-ui, -apple-system, sans-serif';
let fontCode = 'Monaco, Courier, monospace';

try {
  const tokens = require('@dsai/tokens').default;
  colorPrimary = getTokenValue(tokens.color?.['blue']?.[600]) || '#2563eb';
  colorSecondary = getTokenValue(tokens.color?.['cyan']?.[600]) || '#0891b2';
  fontBase = getTokenValue(tokens.typography?.fontFamily?.base) || fontBase;
  fontCode = getTokenValue(tokens.typography?.fontFamily?.mono) || fontCode;
} catch (e) {
  console.warn('Could not load tokens for theme, using defaults');
}

export default create({
  base: 'light',

  // Brand
  brandTitle: 'DSAi Design System',
  brandUrl: 'https://github.com/michelve/dsai',
  brandImage: '/logo.svg',
  brandTarget: '_self',

  // Typography
  fontBase,
  fontCode,

  // Primary colors
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
