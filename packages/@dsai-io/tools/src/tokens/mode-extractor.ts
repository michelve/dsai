/**
 * Mode Extractor Module
 *
 * Extracts specific modes from nested Figma token structures.
 * Handles the conversion from Figma's nested mode structure to flat token files.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/mode-extractor
 */

/* eslint-disable security/detect-object-injection */

// ============================================================================
// Types
// ============================================================================

/**
 * Mode extraction options
 */
export interface ModeExtractionOptions {
  /** Mode name to extract (e.g., 'Light', 'Dark') */
  modeName: string;
  /** Path to the modes in the token structure (e.g., ['Foundation', 'modes']) */
  modesPath?: string[];
  /** Whether to preserve non-mode tokens */
  preserveNonModeTokens?: boolean;
}

/**
 * Mode extraction result
 */
export interface ModeExtractionResult {
  /** Extracted tokens for the specified mode */
  tokens: Record<string, unknown>;
  /** Mode name that was extracted */
  modeName: string;
  /** Whether any tokens were found */
  hasTokens: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Deep clone an object
 */
function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

/**
 * Get nested value from object using path array
 * Uses hasOwn.call() to prevent prototype pollution attacks
 */
function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
  const hasOwn = Object.prototype.hasOwnProperty;
  let current: unknown = obj;

  for (const key of path) {
    if (
      current &&
      typeof current === 'object' &&
      !Array.isArray(current) &&
      hasOwn.call(current, key)
    ) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

// ============================================================================
// Main Extraction Functions
// ============================================================================

/**
 * Extract a specific mode from token structure
 *
 * @param tokens - Source token object
 * @param options - Extraction options
 * @returns Extracted tokens for the specified mode
 *
 * @example
 * ```typescript
 * const tokens = {
 *   Foundation: {
 *     modes: {
 *       Light: { colors: { primary: { $value: '#0000ff' } } },
 *       Dark: { colors: { primary: { $value: '#ffffff' } } }
 *     }
 *   }
 * };
 *
 * const result = extractMode(tokens, {
 *   modeName: 'Light',
 *   modesPath: ['Foundation', 'modes']
 * });
 * // result.tokens = { colors: { primary: { $value: '#0000ff' } } }
 * ```
 */
export function extractMode(
  tokens: Record<string, unknown>,
  options: ModeExtractionOptions
): ModeExtractionResult {
  const { modeName, modesPath = ['Foundation', 'modes'], preserveNonModeTokens = true } = options;

  // Clone to avoid mutations
  const clonedTokens = deepClone(tokens);

  // Get the modes object
  const modesObj = getNestedValue(clonedTokens, modesPath);

  if (!modesObj || typeof modesObj !== 'object') {
    return {
      tokens: preserveNonModeTokens ? clonedTokens : {},
      modeName,
      hasTokens: Object.keys(clonedTokens).length > 0,
    };
  }

  // Get the specific mode
  const modeTokens = (modesObj as Record<string, unknown>)[modeName];

  if (!modeTokens || typeof modeTokens !== 'object') {
    return {
      tokens: preserveNonModeTokens ? clonedTokens : {},
      modeName,
      hasTokens: false,
    };
  }

  // Build result: preserve structure but replace mode content
  const result = preserveNonModeTokens ? deepClone(clonedTokens) : {};

  // Navigate to the modes parent and replace with mode-specific tokens
  let current: Record<string, unknown> = result;
  for (let i = 0; i < modesPath.length - 1; i++) {
    const key = modesPath[i];
    if (!key) {
      continue;
    }

    if (!(key in current)) {
      current[key] = {};
    }
    const next = current[key];
    if (next && typeof next === 'object') {
      current = next as Record<string, unknown>;
    }
  }

  // Replace the modes object with the specific mode content
  const lastKey = modesPath[modesPath.length - 1];
  if (lastKey) {
    current[lastKey] = modeTokens;
  }

  return {
    tokens: result,
    modeName,
    hasTokens: true,
  };
}

/**
 * Extract multiple modes from token structure
 *
 * @param tokens - Source token object
 * @param modeNames - Array of mode names to extract
 * @param modesPath - Path to modes in structure
 * @returns Map of mode name to extracted tokens
 *
 * @example
 * ```typescript
 * const results = extractModes(tokens, ['Light', 'Dark']);
 * // results.get('Light') = light mode tokens
 * // results.get('Dark') = dark mode tokens
 * ```
 */
export function extractModes(
  tokens: Record<string, unknown>,
  modeNames: string[],
  modesPath: string[] = ['Foundation', 'modes']
): Map<string, ModeExtractionResult> {
  const results = new Map<string, ModeExtractionResult>();

  for (const modeName of modeNames) {
    const result = extractMode(tokens, { modeName, modesPath });
    results.set(modeName, result);
  }

  return results;
}

/**
 * Auto-detect available modes in token structure
 *
 * @param tokens - Source token object
 * @param modesPath - Path to modes in structure
 * @returns Array of detected mode names
 *
 * @example
 * ```typescript
 * const modes = detectModes(tokens);
 * // modes = ['Light', 'Dark']
 * ```
 */
export function detectModes(
  tokens: Record<string, unknown>,
  modesPath: string[] = ['Foundation', 'modes']
): string[] {
  const modesObj = getNestedValue(tokens, modesPath);

  if (!modesObj || typeof modesObj !== 'object') {
    return [];
  }

  const modes: string[] = [];
  for (const [key, value] of Object.entries(modesObj as Record<string, unknown>)) {
    if (value && typeof value === 'object') {
      modes.push(key);
    }
  }

  return modes;
}

/**
 * Flatten mode structure by hoisting mode tokens to top level
 *
 * Useful when you want to completely flatten the structure instead of preserving nesting
 *
 * @param tokens - Source token object
 * @param modeName - Mode to extract
 * @param modesPath - Path to modes
 * @returns Flattened token structure
 *
 * @example
 * ```typescript
 * const flattened = flattenModeStructure(tokens, 'Light');
 * // { colors: { primary: { $value: '#0000ff' } } }
 * ```
 */
export function flattenModeStructure(
  tokens: Record<string, unknown>,
  modeName: string,
  modesPath: string[] = ['Foundation', 'modes']
): Record<string, unknown> {
  const result = extractMode(tokens, {
    modeName,
    modesPath,
    preserveNonModeTokens: false,
  });

  // Get just the mode content
  const modesObj = getNestedValue(result.tokens, modesPath);

  if (modesObj && typeof modesObj === 'object') {
    return modesObj as Record<string, unknown>;
  }

  return result.tokens;
}
