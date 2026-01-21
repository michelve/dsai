/**
 * Style Dictionary Type Definitions
 *
 * Types for Style Dictionary integration including tokens, transforms,
 * formats, preprocessors, and configuration.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/style-dictionary/types
 */

// ============================================================================
// Token Types
// ============================================================================

/**
 * Style Dictionary token (runtime representation)
 */
export interface SDToken {
  /** Token name (after name transforms) */
  name: string;

  /** Resolved value (after value transforms) */
  value: unknown;

  /** Original value (may contain references) */
  original: {
    value: unknown;
    $value?: unknown;
  };

  /** Token path segments */
  path: string[];

  /** DTCG $value property */
  $value?: unknown;

  /** Token type */
  type?: string;

  /** DTCG $type property */
  $type?: string;

  /** Token description */
  description?: string;

  /** DTCG $description property */
  $description?: string;

  /** Comment for documentation */
  comment?: string;

  /** DTCG $extensions */
  $extensions?: Record<string, unknown>;

  /** DTCG $scopes (from Figma Variables) */
  $scopes?: string[];

  /** CTI (Category/Type/Item) attributes */
  attributes?: {
    category?: string;
    type?: string;
    item?: string;
    subitem?: string;
    state?: string;
  };

  /** File path where token was defined */
  filePath?: string;

  /** Whether token is a reference to another token */
  isSource?: boolean;
}

/**
 * Style Dictionary dictionary containing all tokens
 */
export interface SDDictionary {
  /** Flat array of all tokens */
  allTokens: SDToken[];

  /** Nested token structure */
  tokens: Record<string, unknown>;

  /** Unfiltered tokens (before platform filtering) */
  unfilteredTokens: Record<string, unknown>;
}

// ============================================================================
// Transform Types
// ============================================================================

/**
 * Transform type - what aspect of the token is being transformed
 */
export type TransformType = 'name' | 'value' | 'attribute';

/**
 * Options passed to transform functions
 */
export interface SDTransformOptions {
  /** Base font size for rem conversion (default: 16) */
  basePxFontSize?: number;

  /** CSS variable prefix */
  prefix?: string;

  /** Additional options */
  [key: string]: unknown;
}

/**
 * Transform definition for Style Dictionary
 */
export interface TransformDefinition {
  /** Unique transform name (e.g., 'fontWeight/unitless') */
  name: string;

  /** Transform type */
  type: TransformType;

  /**
   * Filter function - return true to apply transform
   * If omitted, transform applies to all tokens
   */
  filter?: (token: SDToken) => boolean;

  /**
   * Transform function
   * @param token - The token being transformed
   * @param options - Transform options from platform config
   * @returns Transformed value
   */
  transform: (token: SDToken, options?: SDTransformOptions) => unknown;
}

/**
 * Transform group definition
 */
export interface TransformGroupDefinition {
  /** Unique group name (e.g., 'custom/css') */
  name: string;

  /** Ordered list of transform names to apply */
  transforms: string[];
}

// ============================================================================
// Format Types
// ============================================================================

/**
 * Platform configuration passed to formats
 */
export interface SDPlatform {
  /** Transform group to use */
  transformGroup?: string;

  /** Individual transforms (alternative to transformGroup) */
  transforms?: string[];

  /** Output path prefix */
  buildPath?: string;

  /** Files to generate */
  files?: SDFile[];

  /** Platform-specific options */
  options?: Record<string, unknown>;
}

/**
 * File configuration for platform output
 */
export interface SDFile {
  /** Output file name */
  destination: string;

  /** Format to use for generating content */
  format: string;

  /**
   * Filter tokens to include in this file
   * Can be a string (filter name) or function
   */
  filter?: string | ((token: SDToken) => boolean);

  /** File-specific options passed to format */
  options?: Record<string, unknown>;
}

/**
 * Arguments passed to format functions
 */
export interface SDFormatArgs {
  /** Dictionary containing all tokens */
  dictionary: SDDictionary;

  /** Options from file config */
  options: Record<string, unknown>;

  /** Platform configuration */
  platform: SDPlatform;

  /** File configuration */
  file: SDFile;
}

/**
 * Format definition for Style Dictionary
 */
export interface FormatDefinition {
  /** Unique format name (e.g., 'css/variables-with-comments') */
  name: string;

  /**
   * Format function - generates file content
   * @param args - Format arguments
   * @returns File content as string
   */
  format: (args: SDFormatArgs) => string;
}

// ============================================================================
// Preprocessor Types
// ============================================================================

/**
 * Preprocessor definition for Style Dictionary
 */
export interface PreprocessorDefinition {
  /** Unique preprocessor name */
  name: string;

  /**
   * Preprocessor function - modifies token dictionary before processing
   * @param dictionary - Raw token dictionary
   * @returns Modified dictionary
   */
  preprocessor: (dictionary: Record<string, unknown>) => Record<string, unknown>;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Style Dictionary log configuration
 */
export interface SDLogConfig {
  /** Logging verbosity */
  verbosity?: 'default' | 'silent' | 'verbose';

  /** How to handle warnings */
  warnings?: 'warn' | 'error' | 'disabled';

  /** How to handle errors */
  errors?: 'error' | 'throw';
}

/**
 * Expand configuration for composite tokens
 */
export interface SDExpandConfig {
  /** Optional type mapping for composite token properties */
  typesMap?: Record<string, string | string[] | Record<string, string | string[]>>;
  /** Include specific token types */
  include?: string[] | ((token: SDToken, config: SDConfig) => boolean);
  /** Exclude specific token types */
  exclude?: string[] | ((token: SDToken, config: SDConfig) => boolean);
}

/**
 * Full Style Dictionary configuration
 */
export interface SDConfig {
  /** Logging configuration */
  log?: SDLogConfig;

  /** Preprocessors to run on source tokens */
  preprocessors?: string[];

  /** Configures whether and how composite tokens will be expanded */
  expand?: boolean | SDExpandConfig | ((token: SDToken, config: SDConfig) => boolean);

  /** Source token file patterns */
  source?: string[];

  /** Additional files to include */
  include?: string[];

  /** Platform configurations */
  platforms?: Record<string, SDPlatform>;
}

/**
 * Options for creating Style Dictionary configuration
 */
export interface CreateSDConfigOptions {
  /** Token source files (glob patterns) */
  source?: string[];

  /** CSS variable prefix (default: '--dsai-') */
  prefix?: string;

  /** Output directory base path */
  buildPath?: string;

  /** Base font size for rem conversion (default: 16) */
  baseFontSize?: number;

  /** Whether to output references in generated files */
  outputReferences?: boolean;

  /** Additional transforms to register */
  customTransforms?: TransformDefinition[];

  /** Additional formats to register */
  customFormats?: FormatDefinition[];

  /** Additional preprocessors to register */
  customPreprocessors?: PreprocessorDefinition[];

  /** Platforms to include (default: all) */
  platforms?: SDPlatformType[];

  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Available platform types
 */
export type SDPlatformType = 'css' | 'js' | 'ts' | 'scss' | 'scss-dist' | 'json';

// ============================================================================
// Registration Types
// ============================================================================

/**
 * Style Dictionary instance type (for registration functions)
 * This is a minimal interface - actual SD has more methods
 */
export interface StyleDictionaryInstance {
  registerTransform: (transform: {
    name: string;
    type: TransformType;
    filter?: (token: SDToken) => boolean;
    transform: (token: SDToken, options?: SDTransformOptions) => unknown;
  }) => void;

  registerTransformGroup: (group: { name: string; transforms: string[] }) => void;

  registerFormat: (format: { name: string; format: (args: SDFormatArgs) => string }) => void;

  registerPreprocessor: (preprocessor: {
    name: string;
    preprocessor: (dictionary: Record<string, unknown>) => Record<string, unknown>;
  }) => void;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is an SD token
 */
export function isSDToken(obj: unknown): obj is SDToken {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const token = obj as Record<string, unknown>;

  // Must have name and path
  if (typeof token['name'] !== 'string') {
    return false;
  }

  if (!Array.isArray(token['path'])) {
    return false;
  }

  return true;
}

/**
 * Check if token has a DTCG $value
 */
export function hasDTCGValue(token: SDToken): boolean {
  return token.$value !== undefined;
}

/**
 * Get token value (DTCG or legacy format)
 */
export function getSDTokenValue(token: SDToken): unknown {
  return token.$value ?? token.value;
}

/**
 * Get token type (DTCG or legacy format)
 */
export function getSDTokenType(token: SDToken): string | undefined {
  return token.$type ?? token.type;
}
