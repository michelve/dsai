/**
 * Framework Mapper Utilities
 *
 * Core utilities for applying framework-specific name mappings to tokens.
 *
 * @packageDocumentation
 */

import { bootstrapMapper, mapToBootstrapName } from './bootstrap.js';
import { mapToShadcnName, shadcnMapper } from './shadcn.js';

import type {
  FrameworkMappingConfig,
  FrameworkMappingPattern,
  FrameworkTarget,
} from '../../config/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Framework mapper function type
 */
export type FrameworkMapper = (tokenName: string) => string;

/**
 * Framework mapper with configuration
 */
export interface FrameworkMapperWithConfig {
  /** The mapping function */
  map: FrameworkMapper;
  /** The framework configuration */
  config: FrameworkMappingConfig;
}

// ============================================================================
// Framework Registry
// ============================================================================

/**
 * Built-in framework mappers
 */
const FRAMEWORK_MAPPERS: Record<FrameworkTarget, FrameworkMapperWithConfig> = {
  bootstrap: {
    map: mapToBootstrapName,
    config: bootstrapMapper,
  },
  shadcn: {
    map: mapToShadcnName,
    config: shadcnMapper,
  },
  tailwind: {
    // Tailwind uses config.js format, not SCSS variables
    // Pass through names as-is for now
    map: (name) => name,
    config: {
      framework: 'tailwind',
      mappings: {},
      patterns: [],
      variablePrefix: '',
      header: '// Tailwind config - use tokens.js instead\n',
    },
  },
  mui: {
    // MUI uses JavaScript theme objects
    // Pass through names as-is for now
    map: (name) => name,
    config: {
      framework: 'mui',
      mappings: {},
      patterns: [],
      variablePrefix: '',
      header: '// MUI theme - use tokens.js instead\n',
    },
  },
  custom: {
    // Custom uses user-provided mappings only
    map: (name) => name,
    config: {
      framework: 'custom',
      mappings: {},
      patterns: [],
      variablePrefix: '$',
      header: '// Custom token mappings\n',
    },
  },
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Valid framework targets for safe lookup
 */
const VALID_FRAMEWORKS = new Set<FrameworkTarget>([
  'bootstrap',
  'shadcn',
  'tailwind',
  'mui',
  'custom',
]);

/**
 * Get the framework mapper for a specific target
 *
 * @param framework - Target framework
 * @returns Framework mapper with config
 */
export function getFrameworkMapper(framework: FrameworkTarget): FrameworkMapperWithConfig {
  // Use safe lookup with validated key
  if (VALID_FRAMEWORKS.has(framework)) {
    switch (framework) {
      case 'bootstrap':
        return FRAMEWORK_MAPPERS.bootstrap;
      case 'shadcn':
        return FRAMEWORK_MAPPERS.shadcn;
      case 'tailwind':
        return FRAMEWORK_MAPPERS.tailwind;
      case 'mui':
        return FRAMEWORK_MAPPERS.mui;
      case 'custom':
        return FRAMEWORK_MAPPERS.custom;
    }
  }
  return FRAMEWORK_MAPPERS.custom;
}

/**
 * Create a custom framework mapper with user-provided mappings
 *
 * @param baseFramework - Base framework to extend (or 'custom' for empty)
 * @param customMappings - Additional name mappings
 * @param customPatterns - Additional pattern mappings
 * @returns Combined framework mapper
 */
export function createFrameworkMapper(
  baseFramework: FrameworkTarget,
  customMappings?: Record<string, string>,
  customPatterns?: FrameworkMappingPattern[]
): FrameworkMapperWithConfig {
  const base = getFrameworkMapper(baseFramework);

  // Merge custom mappings (custom takes precedence)
  const mergedMappings = {
    ...base.config.mappings,
    ...customMappings,
  };

  // Merge patterns (custom patterns applied after base patterns)
  const mergedPatterns = [...(base.config.patterns ?? []), ...(customPatterns ?? [])];

  // Create the combined mapper function
  const map: FrameworkMapper = (tokenName: string) => {
    // Check custom mappings first
    const mappingsMap = new Map(Object.entries(mergedMappings));
    if (mappingsMap.has(tokenName)) {
      return mappingsMap.get(tokenName) ?? tokenName;
    }

    // Apply pattern-based mappings
    for (const pattern of mergedPatterns) {
      if (pattern.pattern instanceof RegExp && pattern.pattern.test(tokenName)) {
        return tokenName.replace(pattern.pattern, pattern.replacement);
      }
    }

    // No mapping found - return original name
    return tokenName;
  };

  return {
    map,
    config: {
      ...base.config,
      mappings: mergedMappings,
      patterns: mergedPatterns,
    },
  };
}

/**
 * Apply name mapping to a token name using specified framework
 *
 * @param tokenName - Original token name
 * @param framework - Target framework
 * @param customMappings - Optional custom mappings to merge
 * @returns Mapped token name
 */
export function applyNameMapping(
  tokenName: string,
  framework: FrameworkTarget = 'bootstrap',
  customMappings?: Record<string, string>
): string {
  if (customMappings) {
    const mapper = createFrameworkMapper(framework, customMappings);
    return mapper.map(tokenName);
  }

  const mapper = getFrameworkMapper(framework);
  return mapper.map(tokenName);
}

/**
 * Apply name mappings to all tokens in a collection
 *
 * @param tokens - Map of token names to values
 * @param framework - Target framework
 * @param customMappings - Optional custom mappings
 * @returns New map with mapped token names
 */
export function applyNameMappingsToTokens<T>(
  tokens: Map<string, T>,
  framework: FrameworkTarget = 'bootstrap',
  customMappings?: Record<string, string>
): Map<string, T> {
  const mapper = customMappings
    ? createFrameworkMapper(framework, customMappings)
    : getFrameworkMapper(framework);

  const result = new Map<string, T>();

  for (const [name, value] of tokens) {
    const mappedName = mapper.map(name);
    result.set(mappedName, value);
  }

  return result;
}
