/**
 * A curated list of selectors that are typically focusable by keyboard.
 * Source: WCAG patterns and common component libraries.
 */
export const focusableSelectors = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
] as const;

/** Convenience string for querySelectorAll */
export const focusableSelectorString = focusableSelectors.join(',');

export default focusableSelectors;
