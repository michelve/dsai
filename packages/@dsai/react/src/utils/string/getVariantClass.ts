/**
 * getVariantClass - Generates CSS class for component variant
 *
 * Creates a Bootstrap-style CSS class string based on component variant.
 *
 * @module utils/string/getVariantClass
 *
 * Consolidated from:
 * - packages/@dsai/react/src/components/Card/Card.tsx
 * - packages/@dsai/react/src/components/Toast/Toast.tsx
 */

/** Standard Bootstrap variant types plus common aliases */
export type BootstrapVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'error'
  | 'default';

export interface VariantClassOptions {
  /**
   * Optional prefix to apply (e.g., 'card', 'text-bg', 'btn')
   * Defaults to 'text-bg' when no prefix is provided.
   */
  prefix?: string;
  /**
   * Optional mapping to normalize variants (e.g., error -> danger)
   */
  map?: Record<string, string>;
}

/**
 * Generates a CSS class string for a component variant.
 *
 * @param variant - The variant key
 * @param options - Optional prefix and variant mapping
 * @returns The CSS class string
 *
 * @example
 * getVariantClass('success');                           // 'text-bg-success'
 * getVariantClass('error', { map: { error: 'danger' } }); // 'text-bg-danger'
 * getVariantClass('primary', { prefix: 'btn' });         // 'btn-primary'
 * getVariantClass('ghost', { prefix: 'card' });          // 'card-ghost'
 */
export function getVariantClass(
  variant: BootstrapVariant | string,
  options: VariantClassOptions = {}
): string {
  const { prefix = 'text-bg', map } = options;
  const normalizedVariant = map ? (new Map(Object.entries(map)).get(variant) ?? variant) : variant;

  if (!normalizedVariant) {
    return '';
  }

  return `${prefix}-${normalizedVariant}`;
}

export default getVariantClass;
