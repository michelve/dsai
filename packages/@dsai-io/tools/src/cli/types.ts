/**
 * CLI type definitions
 *
 * @packageDocumentation
 * @module @dsai-io/tools/cli/types
 */

// ============================================================================
// Exit Codes
// ============================================================================

/**
 * Exit codes for CLI commands
 *
 * Follows common conventions:
 * - 0: Success
 * - 1: General error
 * - 2+: Specific error types
 */
export const ExitCode = {
  /** Successful execution */
  Success: 0,
  /** General/unknown error */
  GeneralError: 1,
  /** Configuration loading or validation error */
  ConfigError: 2,
  /** Token or schema validation error */
  ValidationError: 3,
  /** Build process error */
  BuildError: 4,
  /** File system I/O error */
  IOError: 5,
} as const;

export type ExitCodeType = (typeof ExitCode)[keyof typeof ExitCode];

// ============================================================================
// Global Options
// ============================================================================

/**
 * Global CLI options available to all commands
 */
export interface GlobalOptions {
  /** Custom config file path */
  config?: string;

  /** Working directory */
  cwd?: string;

  /** Enable debug mode - verbose output and stack traces */
  debug?: boolean;

  /** Quiet mode - no spinners or colors */
  quiet?: boolean;

  /** Dry run - preview changes without writing files */
  dryRun?: boolean;
}

// ============================================================================
// Command-Specific Options
// ============================================================================

/**
 * Token build command options
 */
export interface TokensBuildOptions extends GlobalOptions {
  /** Platforms to build (comma-separated or 'all') */
  platforms?: string;

  /** Watch mode - rebuild on file changes */
  watch?: boolean;

  /** Clean output directory before build */
  clean?: boolean;
}

/**
 * Token validate command options
 */
export interface TokensValidateOptions extends GlobalOptions {
  /** Attempt to fix issues automatically */
  fix?: boolean;

  /** Strict validation mode */
  strict?: boolean;
}

/**
 * Token sync command options
 */
export interface TokensSyncOptions extends GlobalOptions {
  /** Output format for sync */
  format?: 'flat' | 'nested';
}

/**
 * Token transform command options
 */
export interface TokensTransformOptions extends GlobalOptions {
  /** Dry run - show what would be transformed without writing files */
  dryRun?: boolean;

  /** Default mode for mode-aware collections */
  defaultMode?: string;

  /** Comma-separated list of modes to ignore */
  ignoreModes?: string;
}

/**
 * Icons build command options
 */
export interface IconsBuildOptions extends GlobalOptions {
  /** Output format for icons */
  format?: 'svg' | 'react' | 'vue';

  /** Optimize SVGs */
  optimize?: boolean;
}

/**
 * Init command options
 */
export interface InitOptions extends GlobalOptions {
  /** Skip prompts, use defaults */
  yes?: boolean;

  /** Template to use */
  template?: 'minimal' | 'full' | 'enterprise';
}

/**
 * Config display command options
 */
export interface ConfigOptions extends GlobalOptions {
  /** Output as JSON */
  json?: boolean;
}

// ============================================================================
// Logger and Spinner Interfaces
// ============================================================================

/**
 * Logger interface for CLI output
 */
export interface Logger {
  /** Log a general message */
  log(message: string): void;

  /** Log an info message with icon */
  info(message: string): void;

  /** Log a success message with icon */
  success(message: string): void;

  /** Log a warning message with icon */
  warn(message: string): void;

  /** Log an error message with icon */
  error(message: string): void;

  /** Log a debug message (only in debug mode) */
  debug(message: string): void;
}

/**
 * Spinner interface for progress indication
 */
export interface Spinner {
  /** Start spinner with text */
  start(text: string): void;

  /** Stop spinner (optionally update text) */
  stop(text?: string): void;

  /** Stop with success state */
  succeed(text?: string): void;

  /** Stop with failure state */
  fail(text?: string): void;

  /** Stop with warning state */
  warn(text?: string): void;

  /** Stop with info state */
  info(text?: string): void;
}

// ============================================================================
// CLI Context
// ============================================================================

/**
 * CLI context passed to commands
 *
 * Contains resolved values and utility instances
 */
export interface CLIContext {
  /** Resolved working directory (absolute path) */
  cwd: string;

  /** Package version */
  version: string;

  /** Debug mode enabled */
  debug: boolean;

  /** Quiet mode enabled */
  quiet: boolean;

  /** Logger instance */
  logger: Logger;

  /** Spinner instance */
  spinner: Spinner;
}

// ============================================================================
// Command Handler Types
// ============================================================================

/**
 * Generic command handler function
 */
export type CommandHandler<T extends GlobalOptions = GlobalOptions> = (
  options: T,
  context: CLIContext
) => Promise<void>;

/**
 * Build result from token operations
 */
export interface BuildResult {
  /** Whether build succeeded */
  success: boolean;

  /** Number of files written */
  filesWritten: number;

  /** List of output files */
  files?: Array<{
    path: string;
    size?: number;
  }>;

  /** Any errors encountered */
  errors?: Array<{
    message: string;
    file?: string;
  }>;
}

/**
 * Validation result from token validation
 */
export interface ValidationResult {
  /** Total number of tokens validated */
  totalTokens: number;

  /** Validation errors */
  errors: Array<{
    path: string;
    message: string;
  }>;

  /** Validation warnings */
  warnings: Array<{
    path: string;
    message: string;
  }>;

  /** Issues that were automatically fixed */
  fixed: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Sync result from token sync
 */
export interface SyncResult {
  /** Whether sync succeeded */
  success: boolean;

  /** Number of tokens synced */
  tokenCount: number;

  /** Output file path */
  outputPath: string;

  /** Error message if failed */
  error?: string;
}
