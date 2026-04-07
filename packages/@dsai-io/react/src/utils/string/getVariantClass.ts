/**
 * getVariantClass - Generates CSS class for component variant
 *
 * Creates a Bootstrap-style CSS class string based on component variant.
 *
 * @module utils/string/getVariantClass
 *
 * Consolidated from:
 * - packages/@dsai-io/react/src/components/Card/Card.tsx
 * - packages/@dsai-io/react/src/components/Toast/Toast.tsx
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
  | 'default'
  | 'outlined'
  | 'elevated';

/**
 * Known Bootstrap variants for runtime validation
 */
const KNOWN_VARIANTS = new Set<string>([
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'error',
  'default',
  'outlined',
  'elevated',
]);

export interface VariantClassOptions {
  /**
   * Optional prefix to apply (e.g., 'card', 'text-bg', 'btn')
   * Defaults to 'text-bg' when no prefix is provided.
   */
  readonly prefix?: string;
  /**
   * Optional mapping to normalize variants (e.g., error -> danger)
   */
  readonly map?: Readonly<Record<string, string>>;
  /**
   * Whether to skip validation warnings for unknown variants
   * @default false
   */
  readonly skipValidation?: boolean;
}

/**
 * Generates a CSS class string for a component variant.
 *
 * @param variant - The variant key
 * @param options - Optional prefix, variant mapping, and validation settings
 * @returns The CSS class string
 *
 * @example
 * getVariantClass('success');                           // 'text-bg-success'
 * getVariantClass('error', { map: { error: 'danger' } }); // 'text-bg-danger'
 * getVariantClass('primary', { prefix: 'btn' });         // 'btn-primary'
 * getVariantClass('ghost', { prefix: 'card' });          // 'card-ghost' (with dev warning)
 * getVariantClass('custom', { skipValidation: true });   // 'text-bg-custom' (no warning)
 */
export function getVariantClass(
  variant: string,
  options: VariantClassOptions = {}
): string {
  const { prefix = 'text-bg', map, skipValidation = false } = options;

  // Input validation
  if (!variant || typeof variant !== 'string') {
    if (process.env['NODE_ENV'] !== 'production') {
      console.warn('[getVariantClass] Invalid variant provided:', variant);
    }
    return '';
  }

  const normalizedVariant = map ? (new Map(Object.entries(map)).get(variant) ?? variant) : variant;

  if (!normalizedVariant) {
    return '';
  }

  // Runtime validation: warn if variant is not in known set
  if (!skipValidation && process.env['NODE_ENV'] !== 'production') {
    if (!KNOWN_VARIANTS.has(normalizedVariant)) {
      console.warn(
        `[getVariantClass] Unknown variant '${normalizedVariant}'. Known variants:`,
        Array.from(KNOWN_VARIANTS).join(', ')
      );
    }
  }

  return `${prefix}-${normalizedVariant}`;
}

export default getVariantClass;
