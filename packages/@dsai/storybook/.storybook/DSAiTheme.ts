import tokens from '@dsai/tokens';
import { create } from 'storybook/theming/create';

export default create({
  base: 'light',

  // Brand
  brandTitle: 'DSAi Design System',
  brandUrl: 'https://github.com/michelve/dsai',
  brandImage: '/logo.svg', // Served from /packages/@dsai/storybook/public/
  brandTarget: '_self',

  // Typography
  fontBase: tokens.typography?.fontFamily?.base || 'Inter, system-ui, -apple-system, sans-serif',
  fontCode: tokens.typography?.fontFamily?.mono || 'Monaco, Courier, monospace',

  // Primary colors
  colorPrimary: tokens.color?.['blue']?.[600] || '#2563eb',
  colorSecondary: tokens.color?.['cyan']?.[600] || '#0891b2',

  // UI - Background colors from tokens
  appBg: tokens.background?.secondary || '#f9fafb',
  appContentBg: tokens.background?.primary || '#ffffff',
  appPreviewBg: tokens.background?.primary || '#ffffff',
  appBorderColor: tokens.border?.color?.default || '#e5e7eb',
  appBorderRadius: parseInt(tokens.border?.radius?.md || '8', 10),

  // Text colors
  textColor: tokens.color?.['gray']?.[900] || '#111827',
  textInverseColor: tokens.neutral?.white || '#ffffff',
  textMutedColor: tokens.color?.['gray']?.[600] || '#4b5563',

  // Toolbar colors
  barTextColor: tokens.color?.['gray']?.[600] || '#4b5563',
  barSelectedColor: tokens.color?.['blue']?.[600] || '#2563eb',
  barHoverColor: tokens.color?.['blue']?.[700] || '#1d4ed8',
  barBg: tokens.background?.primary || '#ffffff',

  // Form colors
  inputBg: tokens.background?.primary || '#ffffff',
  inputBorder: tokens.border?.color?.default || '#e5e7eb',
  inputTextColor: tokens.color?.['gray']?.[900] || '#111827',
  inputBorderRadius: parseInt(tokens.border?.radius?.sm || '4', 10),

  // Button colors
  buttonBg: tokens.background?.secondary || '#f9fafb',
  buttonBorder: tokens.border?.color?.default || '#e5e7eb',

  // Boolean (toggle) colors
  booleanBg: tokens.background?.secondary || '#f9fafb',
  booleanSelectedBg: tokens.color?.['blue']?.[600] || '#2563eb',
});
