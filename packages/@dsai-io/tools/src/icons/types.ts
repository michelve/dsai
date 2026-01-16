/**
 * Icon system type definitions
 *
 * @packageDocumentation
 */

/**
 * Raw SVG data from file
 */
export interface RawSVGData {
  /** File path (absolute) */
  filePath: string;

  /** File name without extension */
  fileName: string;

  /** SVG content string */
  content: string;

  /** Original file size in bytes */
  originalSize: number;
}

/**
 * Parsed SVG data
 */
export interface ParsedSVG {
  /** Icon name (normalized) */
  name: string;

  /** Component name (PascalCase) */
  componentName: string;

  /** Original file name */
  fileName: string;

  /** SVG viewBox */
  viewBox: string;

  /** SVG width */
  width?: string | number;

  /** SVG height */
  height?: string | number;

  /** SVG inner content (without <svg> wrapper) */
  innerContent: string;

  /** Full SVG content */
  fullContent: string;

  /** SVG attributes */
  attributes: Record<string, string>;

  /** Title for accessibility */
  title?: string;

  /** Description for accessibility */
  description?: string;
}

/**
 * Optimized SVG data
 */
export interface OptimizedSVG extends ParsedSVG {
  /** Optimized file size in bytes */
  optimizedSize: number;

  /** Size reduction percentage */
  sizeReduction: number;
}

/**
 * Generated icon component
 */
export interface GeneratedIcon {
  /** Icon name */
  name: string;

  /** Component name */
  componentName: string;

  /** Generated code */
  code: string;

  /** Output file path */
  outputPath: string;

  /** Format (react, vue, svg) */
  format: IconFormat;
}

/**
 * Icon format
 */
export type IconFormat = 'react' | 'vue' | 'svg' | 'svg-sprite';

/**
 * Icon build options
 */
export interface IconBuildOptions {
  /** Formats to generate */
  formats?: IconFormat[];

  /** Watch for changes */
  watch?: boolean;

  /** Specific icons to build (file names) */
  icons?: string[];

  /** Dry run - don't write files */
  dryRun?: boolean;
}

/**
 * Icon build result
 */
export interface IconBuildResult {
  /** Build successful */
  success: boolean;

  /** Generated icons */
  icons: GeneratedIcon[];

  /** Total icons processed */
  totalIcons: number;

  /** Files written */
  filesWritten: number;

  /** Total size reduction percentage */
  totalSizeReduction: number;

  /** Build errors */
  errors: IconError[];

  /** Build warnings */
  warnings: IconWarning[];

  /** Build duration in milliseconds */
  duration: number;
}

/**
 * Icon error
 */
export interface IconError {
  /** Icon name */
  icon: string;

  /** Error message */
  message: string;

  /** Error code */
  code: IconErrorCode;
}

/**
 * Icon error codes
 */
export type IconErrorCode =
  | 'SCAN_ERROR'
  | 'PARSE_ERROR'
  | 'OPTIMIZE_ERROR'
  | 'GENERATE_ERROR'
  | 'WRITE_ERROR'
  | 'BUILD_ERROR';

/**
 * Icon warning
 */
export interface IconWarning {
  /** Icon name */
  icon: string;

  /** Warning message */
  message: string;
}

/**
 * SVGO configuration
 */
export interface SVGOConfig {
  /** Enable multipass optimization */
  multipass?: boolean;

  /** Plugins to use */
  plugins?: SVGOPlugin[];
}

/**
 * SVGO plugin configuration
 */
export interface SVGOPlugin {
  /** Plugin name */
  name: string;

  /** Plugin parameters */
  params?: Record<string, unknown>;
}

/**
 * Icon template function
 */
export type IconTemplate = (icon: OptimizedSVG) => string;

/**
 * Index template function
 */
export type IndexTemplate = (icons: OptimizedSVG[]) => string;

/**
 * Types template function
 */
export type TypesTemplate = (icons: OptimizedSVG[]) => string;

/**
 * Scanner options
 */
export interface ScannerOptions {
  /** Source directory */
  sourceDir: string;

  /** Glob patterns to include */
  include?: string[];

  /** Glob patterns to exclude */
  exclude?: string[];
}

/**
 * Generator options
 */
export interface GeneratorOptions {
  /** Custom icon template */
  template?: IconTemplate;

  /** Custom index template */
  indexTemplate?: IndexTemplate;

  /** Custom types template */
  typesTemplate?: TypesTemplate;

  /** Dry run - don't write files */
  dryRun?: boolean;
}
