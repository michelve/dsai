/**
 * Token-specific type definitions
 *
 * Defines types for DTCG-compliant tokens, validation, transformation,
 * and build processes.
 *
 * @packageDocumentation
 */

// ============================================================================
// DTCG Token Types
// ============================================================================

/**
 * DTCG-compliant token value
 * @see https://www.designtokens.org/
 */
export interface DTCGToken {
  /** The resolved value of the token */
  $value: unknown;

  /** Token type (color, dimension, etc.) */
  $type?: TokenType;

  /** Human-readable description */
  $description?: string;

  /** Extension data */
  $extensions?: Record<string, unknown>;
}

/**
 * Legacy Style Dictionary token format
 */
export interface LegacyToken {
  /** The resolved value of the token */
  value: unknown;

  /** Token type */
  type?: string;

  /** Human-readable description */
  description?: string;

  /** Comment (older format) */
  comment?: string;
}

/**
 * Combined token type supporting both DTCG and legacy formats
 */
export type Token = DTCGToken | LegacyToken;

/**
 * Token collection (nested structure of tokens or groups)
 */
export interface TokenCollection {
  [key: string]: Token | TokenCollection | unknown;
}

/**
 * Figma export format (from Tokens Studio)
 */
export interface FigmaExport {
  [collectionName: string]: FigmaCollection;
}

/**
 * Single Figma collection with optional modes
 */
export interface FigmaCollection {
  /** Mode-specific token values */
  modes?: Record<string, TokenCollection>;

  /** Direct tokens if no modes */
  [key: string]: unknown;
}

// ============================================================================
// Token Type Constants
// ============================================================================

/**
 * Valid token types per DTCG specification
 */
export const VALID_TOKEN_TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'fontStyle',
  'shadow',
  'number',
  'string',
  'duration',
  'cubicBezier',
  'strokeStyle',
  'border',
  'transition',
  'gradient',
  'typography',
  'letterSpacing',
  'lineHeight',
  'paragraphSpacing',
  'textDecoration',
  'textCase',
] as const;

/**
 * Token type (DTCG specification)
 */
export type TokenType = (typeof VALID_TOKEN_TYPES)[number];

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Severity level for validation issues
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * A single validation issue
 */
export interface ValidationIssue {
  /** Token path (e.g., "color.brand.primary") */
  path: string;

  /** Human-readable message */
  message: string;

  /** Issue severity */
  severity: ValidationSeverity;

  /** The problematic value (if applicable) */
  value?: unknown;

  /** Suggested fix (if applicable) */
  suggestion?: string;
}

/**
 * Result of token validation
 */
export interface ValidationResult {
  /** Whether validation passed (no errors) */
  valid: boolean;

  /** Validation errors (blocking issues) */
  errors: ValidationIssue[];

  /** Validation warnings (non-blocking) */
  warnings: ValidationIssue[];

  /** Total number of tokens validated */
  tokenCount: number;

  /** Number of files validated */
  fileCount: number;

  /** Validation duration in milliseconds */
  duration?: number;
}

/**
 * Options for validation
 */
export interface ValidateOptions {
  /** Directory containing token files */
  collectionsDir?: string;

  /** File patterns to validate */
  patterns?: string[];

  /** Enable verbose output */
  verbose?: boolean;

  /** Suppress output */
  quiet?: boolean;

  /** Treat warnings as errors */
  strict?: boolean;
}

// ============================================================================
// Transform Types
// ============================================================================

/**
 * Options for Figma token transformation
 */
export interface TransformOptions {
  /** Source directory with Figma exports */
  sourceDir: string;

  /** Output directory for collections */
  collectionsDir: string;

  /**
   * Glob patterns for finding source files
   * @example ['theme.json', '*.tokens.json', 'figma-variables-*.json']
   */
  sourcePatterns?: string[];

  /**
   * Map of collection names to specific file paths
   * @example { 'primitives': './colors.json', 'semantic': './semantic.json' }
   */
  collectionMapping?: Record<string, string>;

  /** Preserve $codeSyntax references from Figma */
  preserveCodeSyntax?: boolean;

  /** Modes to ignore during transformation */
  ignoreModes?: string[];

  /** Default mode name */
  defaultMode?: string;

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Enable verbose output */
  verbose?: boolean;

  /** Enable strict schema validation */
  strict?: boolean;

  /** Enable incremental build (only process changed files) */
  incremental?: boolean;

  /** Force full rebuild (ignore cache) */
  force?: boolean;

  /** Cache directory for incremental builds */
  cacheDir?: string;
}

/**
 * Result of token transformation
 */
export interface TransformResult {
  /** Whether transformation succeeded */
  success: boolean;

  /** Files written during transformation */
  filesWritten: string[];

  /** Number of tokens processed */
  tokensProcessed: number;

  /** Modes detected in Figma export */
  modesDetected: string[];

  /** Errors encountered */
  errors: string[];

  /** Warnings generated */
  warnings: string[];

  /** Duration in milliseconds */
  duration?: number;
}

// ============================================================================
// Build Types
// ============================================================================

/**
 * A single build step
 */
export interface BuildStep {
  /** Step name for display */
  name: string;

  /** Executable to run (if external) — used with execFileSync to avoid shell injection */
  command?: string;

  /** Arguments for the command (used with execFileSync) */
  args?: string[];

  /** Function to execute (if internal). Returns boolean for success/failure, or undefined */
  fn?: () => boolean | undefined | Promise<boolean | undefined>;

  /** Whether to skip this step */
  skip?: boolean;

  /** Working directory for command */
  cwd?: string;
}

/**
 * Options for token build
 */
export interface BuildOptions {
  /** Skip validation step */
  skipValidate?: boolean;

  /** Skip transformation step */
  skipTransform?: boolean;

  /** Only build theme CSS */
  onlyTheme?: boolean;

  /** Source directory for Figma exports */
  sourceDir?: string;

  /** Enable watch mode */
  watch?: boolean;

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Enable verbose output */
  verbose?: boolean;

  /** Suppress output */
  quiet?: boolean;

  /** Enable strict schema validation */
  strict?: boolean;

  /** Enable incremental build (only process changed files) */
  incremental?: boolean;

  /** Force full rebuild (ignore cache) */
  force?: boolean;

  /** Cache directory for incremental builds */
  cacheDir?: string;

  /** Output directory for all formats */
  outputDir?: string;

  /** Output formats to generate (default: ['css', 'scss', 'json']) */
  formats?: Array<'css' | 'scss' | 'js' | 'ts' | 'json' | 'android' | 'ios'>;

  /** CSS custom property prefix (default: '--dsai-') */
  prefix?: string;

  /** Per-format output directories */
  outputDirs?: Partial<Record<string, string>>;

  /** Per-format output file names */
  outputFileNames?: Partial<Record<string, string>>;

  /** Additional SCSS directories to merge */
  additionalScssDirectories?: string[];

  /** Additional CSS directories to merge */
  additionalCssDirectories?: string[];

  /** Merge order for additional styles */
  mergeOrder?: 'before' | 'after';

  /** Create combined bundle files */
  createBundle?: boolean;

  /** Custom SCSS import header */
  scssImportHeader?: string;

  /** Additional directories to watch */
  watchDirectories?: string[];

  /** Build pipeline configuration */
  pipeline?: {
    /** Steps to include in the build */
    steps?: Array<
      | 'validate'
      | 'transform'
      | 'style-dictionary'
      | 'sync'
      | 'sass-theme'
      | 'sass-theme-minified'
      | 'postprocess'
      | 'sass-utilities'
      | 'sass-utilities-minified'
      | 'bundle'
    >;
    /** Paths configuration for build steps */
    paths?: {
      syncSource?: string;
      syncTarget?: string;
      sassThemeInput?: string;
      sassThemeOutput?: string;
      sassThemeMinifiedOutput?: string;
      sassUtilitiesInput?: string;
      sassUtilitiesOutput?: string;
      sassUtilitiesMinifiedOutput?: string;
    };
    /** Style Dictionary config file name */
    styleDictionaryConfig?: string;
  };

  /**
   * Themes configuration for multi-theme builds.
   * When provided with enabled: true, the 'multi-theme' step will
   * use config-driven theme definitions instead of hardcoded themes.
   */
  themesConfig?: {
    /** Whether theme building is enabled */
    enabled?: boolean;
    /** Theme definitions by name */
    definitions?: Record<
      string,
      {
        isDefault?: boolean;
        suffix?: string | null;
        selector: string;
        mediaQuery?: string;
        dataAttribute?: string;
        outputFiles?: Partial<Record<string, string>>;
      }
    >;
  };

  /**
   * Post-process configuration for CSS files
   */
  postprocessConfig?: {
    /** Whether postprocessing is enabled */
    enabled?: boolean;
    /** CSS output directory */
    cssDir?: string;
    /** CSS files to process */
    files?: string[];
    /** Text replacements to apply */
    replacements?: Array<{
      description?: string;
      from: string | RegExp;
      to: string;
    }>;
  };

  /**
   * CSS output directory (from SCSS config)
   */
  cssOutputDir?: string;
}

/**
 * Result of token build
 */
export interface BuildResult {
  /** Whether build succeeded */
  success: boolean;

  /** Steps that completed successfully */
  stepsCompleted: string[];

  /** Steps that failed */
  stepsFailed: string[];

  /** Total duration in milliseconds */
  duration: number;

  /** Errors encountered */
  errors: string[];

  /** Warnings generated */
  warnings: string[];

  /** Generated output files */
  outputFiles?: string[];
}

// ============================================================================
// Sync Types
// ============================================================================

/**
 * Options for token sync
 */
export interface SyncOptions {
  /** Source file (Style Dictionary output) */
  sourceFile: string;

  /** Target file (TypeScript source) */
  targetFile: string;

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Result of token sync
 */
export interface SyncResult {
  /** Whether sync succeeded */
  success: boolean;

  /** Number of tokens synced */
  tokensCount: number;

  /** Whether file was changed */
  changed: boolean;

  /** Errors encountered */
  errors?: string[];
}

// ============================================================================
// Postprocess Types
// ============================================================================

/**
 * A text replacement rule
 */
export interface ReplacementRule {
  /** Pattern to search for (string or regex) */
  from: string | RegExp;

  /** Replacement string */
  to: string;

  /** Optional description */
  description?: string;
}

/**
 * Options for CSS post-processing
 */
export interface PostprocessOptions {
  /** Input CSS file */
  inputFile: string;

  /** Output CSS file (defaults to input) */
  outputFile?: string;

  /** Replacements to make */
  replacements?: ReplacementRule[];

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Result of post-processing
 */
export interface PostprocessResult {
  /** Whether post-processing succeeded */
  success: boolean;

  /** Number of replacements made */
  replacementsMade: number;

  /** Output file path */
  outputFile: string;

  /** Errors encountered */
  errors?: string[];
}

// ============================================================================
// Merge Types
// ============================================================================

/**
 * Options for merging collections
 */
export interface MergeOptions {
  /** Source files to merge */
  sourceFiles: string[];

  /** Output file path */
  outputFile: string;

  /** Merge strategy for conflicts */
  strategy?: 'first' | 'last' | 'error';

  /** Dry run (don't write files) */
  dryRun?: boolean;

  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Result of collection merge
 */
export interface MergeResult {
  /** Whether merge succeeded */
  success: boolean;

  /** Number of collections merged */
  collectionsCount: number;

  /** Number of tokens in result */
  tokensCount: number;

  /** Output file path */
  outputFile: string;

  /** Conflicts detected */
  conflicts?: string[];

  /** Errors encountered */
  errors?: string[];
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if an object is a DTCG token
 */
export function isDTCGToken(obj: unknown): obj is DTCGToken {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return '$value' in obj;
}

/**
 * Check if an object is a legacy token
 */
export function isLegacyToken(obj: unknown): obj is LegacyToken {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return 'value' in obj && !('$value' in obj);
}

/**
 * Check if an object is any token type
 */
export function isToken(obj: unknown): obj is Token {
  return isDTCGToken(obj) || isLegacyToken(obj);
}

/**
 * Check if a string is a valid token type
 */
export function isValidTokenType(type: string): type is TokenType {
  return VALID_TOKEN_TYPES.includes(type as TokenType);
}

/**
 * Check if a value is a token reference
 */
export function isTokenReference(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the value from a token regardless of format
 */
export function getTokenValue(token: Token): unknown {
  return isDTCGToken(token) ? token.$value : token.value;
}

/**
 * Get the type from a token regardless of format
 */
export function getTokenType(token: Token): string | undefined {
  if (isDTCGToken(token)) {
    return token.$type;
  }
  return (token as LegacyToken).type;
}

/**
 * Get the description from a token regardless of format
 */
export function getTokenDescription(token: Token): string | undefined {
  if (isDTCGToken(token)) {
    return token.$description;
  }
  const legacy = token as LegacyToken;
  return legacy.description ?? legacy.comment;
}

/**
 * Convert a legacy token to DTCG format
 */
export function toDTCGToken(token: LegacyToken): DTCGToken {
  const dtcg: DTCGToken = {
    $value: token.value,
  };

  if (token.type && isValidTokenType(token.type)) {
    dtcg.$type = token.type;
  }

  const desc = token.description ?? token.comment;
  if (desc) {
    dtcg.$description = desc;
  }

  return dtcg;
}

/**
 * Parse a token reference string
 * @param ref - Reference string like "{color.brand.primary}"
 * @returns Path segments like ["color", "brand", "primary"]
 */
export function parseTokenReference(ref: string): string[] | null {
  if (!isTokenReference(ref)) {
    return null;
  }
  const inner = ref.slice(1, -1);
  return inner.split('.');
}
