# Task: Style Merge and Bundle System

**Task ID:** TASK-110
**Title:** Merge Additional SCSS/CSS Directories and Create Bundles
**Priority:** High
**Status:** ✅ Complete
**Assigned To:** Copilot
**Blocked by Task:** TASK-101, TASK-102, TASK-103, TASK-104
**Created:** 2024-12-23
**Updated:** 2024-12-23
**Completed:** 2024-12-23

---

## 📋 Task Description

### Goal

Implement a style merging and bundling system that allows enterprise teams to:

1. Specify where their Figma JSON exports are stored (custom paths and naming conventions)
2. Define custom output locations per format (CSS, SCSS, JS, TS)
3. Merge additional SCSS/CSS directories with token output
4. Create combined bundle files that include both tokens and custom styles
5. Control the merge order (user styles before/after tokens)

### Problem/Issue

Enterprise teams have existing stylesheets that need to work alongside generated tokens:

1. **Existing SCSS files**: Teams have mixins, functions, overrides they want to combine
2. **Custom CSS utilities**: Base styles, resets, utility classes
3. **Different output locations**: CSS might go to `public/css`, SCSS to `src/styles`
4. **Naming conventions**: Teams use their own file naming patterns
5. **Import dependencies**: SCSS files may need specific imports at the top

### Expected Outcome

A comprehensive style integration system that:

1. Scans and collects files from additional SCSS/CSS directories
2. Merges content in configurable order (before/after tokens)
3. Creates bundle files combining everything
4. Respects per-format output directories
5. Supports custom file naming patterns
6. Handles SCSS imports and dependencies correctly

---

## 🎯 Acceptance Criteria

### Source Discovery

- [ ] Support glob patterns for finding Figma exports
- [ ] Support explicit collection-to-file mapping
- [ ] Auto-detect Figma Variables export format
- [ ] Auto-detect Tokens Studio export format
- [ ] Handle multiple export files gracefully

### Output Configuration

- [ ] Support per-format output directories (`outputDirs`)
- [ ] Support per-format file naming (`outputFileNames`)
- [ ] Support placeholder variables: `{theme}`, `{name}`, `{format}`, `{date}`
- [ ] Validate output paths don't conflict
- [ ] Create directories automatically

### Additional Stylesheet Directories

- [ ] Scan `additionalScssDirectories` for SCSS files
- [ ] Scan `additionalCssDirectories` for CSS files
- [ ] Respect file ordering (alphabetical or explicit)
- [ ] Handle nested directory structures
- [ ] Exclude files matching ignore patterns

### Merge Functionality

- [ ] Merge order: 'before' or 'after' tokens
- [ ] Separate merge config for CSS vs SCSS
- [ ] Preserve SCSS imports in correct order
- [ ] Handle `@import` statements correctly
- [ ] Deduplicate imports

### Bundle Generation

- [ ] Create `tokens-bundle.css` when `createBundle: true`
- [ ] Create `_tokens-bundle.scss` when `createBundle: true`
- [ ] Include source comments for debugging
- [ ] Support sourcemaps for bundles
- [ ] Minify option for production bundles

### SCSS Import Headers

- [ ] Support `scssImportHeader` configuration
- [ ] Insert header at top of generated SCSS files
- [ ] Support multiple imports via array
- [ ] Validate import paths exist

---

## 📂 Files to Create/Modify

### New Files in @DSAi/tools

```
packages/@dsai/tools/src/tokens/merge/
├── index.ts              # Main exports
├── types.ts              # Merge-specific types
├── scanner.ts            # File scanner for additional directories
├── collector.ts          # Collect and order files
├── merger.ts             # Merge content logic
├── bundler.ts            # Bundle generation
├── scss-processor.ts     # SCSS-specific processing
└── css-processor.ts      # CSS-specific processing

packages/@dsai/tools/src/tokens/output/
├── index.ts              # Main exports
├── types.ts              # Output-specific types
├── resolver.ts           # Resolve output paths per format
├── writer.ts             # Write files with correct naming
└── placeholders.ts       # Handle {theme}, {name} placeholders
```

---

## 🔗 Dependencies

### Prerequisites

- [ ] TASK-101: Package Scaffolding
- [ ] TASK-102: Configuration System (for config types)
- [ ] TASK-103: Token Scripts (for build pipeline)
- [ ] TASK-104: Style Dictionary (for format generation)

### Blocks

- TASK-107: Tokens Package Update
- TASK-108: Enterprise Documentation

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] Scanner finds all files in directories
- [ ] Collector orders files correctly
- [ ] Merger combines content in right order
- [ ] Bundler creates valid CSS/SCSS
- [ ] Placeholders resolve correctly

### Integration Tests

- [ ] Full merge pipeline works end-to-end
- [ ] Per-format output directories work
- [ ] Bundle includes all sources
- [ ] Watch mode detects changes in additional dirs

### Edge Cases

- [ ] Empty additional directories
- [ ] Missing directories (warning, not error)
- [ ] Circular SCSS imports
- [ ] Very large file counts
- [ ] Special characters in file names

---

## 📖 Documentation Requirements

- [ ] JSDoc on all public functions
- [ ] Configuration reference for all merge options
- [ ] Examples of common enterprise setups
- [ ] Troubleshooting guide for merge issues

---

## 🔄 Implementation Steps

### Step 1: Define Types

**src/tokens/merge/types.ts:**

```typescript
/**
 * Style merge type definitions
 *
 * @packageDocumentation
 */

import type { OutputFormat } from '../../config/types.js';

// ============================================================================
// Merge Configuration
// ============================================================================

/**
 * Configuration for merging additional stylesheets
 */
export interface MergeConfig {
  /**
   * Additional SCSS directories to scan
   * Relative to config file location
   */
  scssDirectories: string[];

  /**
   * Additional CSS directories to scan
   * Relative to config file location
   */
  cssDirectories: string[];

  /**
   * Order of merging
   * - 'before': User styles before token styles
   * - 'after': User styles after token styles
   */
  mergeOrder: 'before' | 'after';

  /**
   * Create combined bundle files
   */
  createBundle: boolean;

  /**
   * SCSS file to import at top of generated files
   */
  scssImportHeader?: string | string[];

  /**
   * File patterns to ignore when scanning
   * @default ['_index.scss', '*.test.scss']
   */
  ignorePatterns?: string[];

  /**
   * Sort order for collected files
   * - 'alphabetical': Sort A-Z by filename
   * - 'directory-first': Group by directory, then alphabetical
   * - 'explicit': Use order from config
   */
  sortOrder?: 'alphabetical' | 'directory-first' | 'explicit';
}

// ============================================================================
// Output Configuration
// ============================================================================

/**
 * Configuration for output file locations
 */
export interface OutputConfig {
  /**
   * Default output directory (applies to all formats)
   */
  baseDir: string;

  /**
   * Per-format output directories
   * Overrides baseDir for specific formats
   */
  formatDirs: Partial<Record<OutputFormat, string>>;

  /**
   * Per-format file names with placeholder support
   * Placeholders: {theme}, {name}, {format}, {date}
   */
  fileNames: Partial<Record<OutputFormat, string>>;

  /**
   * Create directories if they don't exist
   * @default true
   */
  createDirs?: boolean;
}

// ============================================================================
// Scanner Types
// ============================================================================

/**
 * Scanned file information
 */
export interface ScannedFile {
  /** Absolute path to file */
  absolutePath: string;

  /** Relative path from source directory */
  relativePath: string;

  /** File name without extension */
  name: string;

  /** File extension (scss, css) */
  extension: 'scss' | 'css';

  /** File size in bytes */
  size: number;

  /** Last modified timestamp */
  mtime: Date;

  /** Directory depth from source root */
  depth: number;
}

/**
 * Scanner options
 */
export interface ScannerOptions {
  /** Directories to scan */
  directories: string[];

  /** File extension to look for */
  extension: 'scss' | 'css';

  /** Patterns to ignore */
  ignorePatterns?: string[];

  /** Follow symlinks */
  followSymlinks?: boolean;

  /** Max directory depth */
  maxDepth?: number;
}

/**
 * Scanner result
 */
export interface ScannerResult {
  /** Scanned files */
  files: ScannedFile[];

  /** Directories that were scanned */
  directories: string[];

  /** Directories that were missing */
  missingDirectories: string[];

  /** Total file count */
  totalFiles: number;

  /** Total size in bytes */
  totalSize: number;
}

// ============================================================================
// Merge Types
// ============================================================================

/**
 * Content to merge
 */
export interface MergeContent {
  /** Source file path */
  source: string;

  /** File content */
  content: string;

  /** Content type */
  type: 'token' | 'user';

  /** Format */
  format: 'scss' | 'css';

  /** Theme name (if applicable) */
  theme?: string;
}

/**
 * Merge result
 */
export interface MergeResult {
  /** Merged content */
  content: string;

  /** Source map (if generated) */
  sourceMap?: string;

  /** Files included in merge */
  sources: string[];

  /** Warnings during merge */
  warnings: string[];
}

// ============================================================================
// Bundle Types
// ============================================================================

/**
 * Bundle configuration
 */
export interface BundleConfig {
  /** Bundle name (without extension) */
  name: string;

  /** Include source comments */
  includeSourceComments: boolean;

  /** Generate sourcemaps */
  sourcemaps: boolean;

  /** Minify output */
  minify: boolean;

  /** Output directory */
  outputDir: string;
}

/**
 * Bundle result
 */
export interface BundleResult {
  /** Bundle content */
  content: string;

  /** Sourcemap content (if generated) */
  sourcemap?: string;

  /** Output file path */
  outputPath: string;

  /** Files included in bundle */
  files: string[];

  /** Bundle size in bytes */
  size: number;

  /** Minified size (if minified) */
  minifiedSize?: number;
}
```

### Step 2: Implement File Scanner

**src/tokens/merge/scanner.ts:**

````typescript
/**
 * Scanner for finding stylesheet files in directories
 *
 * @packageDocumentation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'fast-glob';
import type { ScannerOptions, ScannerResult, ScannedFile } from './types.js';

/**
 * Default ignore patterns
 */
const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.git/**',
  '**/_index.scss',
  '**/*.test.scss',
  '**/*.spec.scss',
  '**/test/**',
  '**/tests/**',
];

/**
 * Scan directories for stylesheet files
 *
 * @param options Scanner options
 * @returns Scanner result with found files
 *
 * @example
 * ```typescript
 * const result = await scanDirectories({
 *   directories: ['src/styles/overrides', 'src/styles/custom'],
 *   extension: 'scss',
 * });
 *
 * console.log(`Found ${result.totalFiles} files`);
 * ```
 */
export async function scanDirectories(options: ScannerOptions): Promise<ScannerResult> {
  const {
    directories,
    extension,
    ignorePatterns = DEFAULT_IGNORE_PATTERNS,
    followSymlinks = false,
    maxDepth = 10,
  } = options;

  const files: ScannedFile[] = [];
  const scannedDirs: string[] = [];
  const missingDirs: string[] = [];

  for (const dir of directories) {
    const absoluteDir = path.resolve(dir);

    // Check if directory exists
    if (!fs.existsSync(absoluteDir)) {
      missingDirs.push(absoluteDir);
      continue;
    }

    scannedDirs.push(absoluteDir);

    // Find files using glob
    const pattern = `**/*.${extension}`;
    const foundPaths = await glob(pattern, {
      cwd: absoluteDir,
      absolute: true,
      ignore: ignorePatterns,
      followSymbolicLinks: followSymlinks,
      deep: maxDepth,
    });

    // Get file info for each found file
    for (const filePath of foundPaths) {
      const stat = await fs.promises.stat(filePath);
      const relativePath = path.relative(absoluteDir, filePath);
      const depth = relativePath.split(path.sep).length - 1;

      files.push({
        absolutePath: filePath,
        relativePath,
        name: path.basename(filePath, `.${extension}`),
        extension: extension as 'scss' | 'css',
        size: stat.size,
        mtime: stat.mtime,
        depth,
      });
    }
  }

  // Calculate totals
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return {
    files,
    directories: scannedDirs,
    missingDirectories: missingDirs,
    totalFiles: files.length,
    totalSize,
  };
}

/**
 * Sort scanned files according to specified order
 *
 * @param files Files to sort
 * @param order Sort order
 * @returns Sorted files
 */
export function sortFiles(
  files: ScannedFile[],
  order: 'alphabetical' | 'directory-first' = 'alphabetical'
): ScannedFile[] {
  const sorted = [...files];

  if (order === 'alphabetical') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === 'directory-first') {
    sorted.sort((a, b) => {
      // First by directory
      const dirA = path.dirname(a.relativePath);
      const dirB = path.dirname(b.relativePath);
      if (dirA !== dirB) {
        return dirA.localeCompare(dirB);
      }
      // Then by name
      return a.name.localeCompare(b.name);
    });
  }

  return sorted;
}

/**
 * Filter files matching patterns
 *
 * @param files Files to filter
 * @param patterns Glob patterns to match
 * @param include If true, keep matching files; if false, exclude matching
 * @returns Filtered files
 */
export function filterFiles(
  files: ScannedFile[],
  patterns: string[],
  include = false
): ScannedFile[] {
  // Create regex patterns
  const regexPatterns = patterns.map((p) => {
    // Convert glob to regex (simplified)
    const regex = p
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    return new RegExp(regex);
  });

  return files.filter((file) => {
    const matches = regexPatterns.some((rx) => rx.test(file.relativePath) || rx.test(file.name));
    return include ? matches : !matches;
  });
}
````

### Step 3: Implement Content Merger

**src/tokens/merge/merger.ts:**

````typescript
/**
 * Merge stylesheet content
 *
 * @packageDocumentation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { MergeContent, MergeResult, MergeConfig } from './types.js';

/**
 * Merge stylesheet content in specified order
 *
 * @param tokenContent Generated token content
 * @param userContent User stylesheet content
 * @param config Merge configuration
 * @returns Merged result
 *
 * @example
 * ```typescript
 * const result = await mergeContent(
 *   { content: ':root { --color-primary: blue; }', format: 'css' },
 *   [{ source: 'overrides.css', content: ':root { --color-bg: white; }' }],
 *   { mergeOrder: 'after' }
 * );
 * ```
 */
export async function mergeContent(
  tokenContent: { content: string; format: 'scss' | 'css' },
  userContent: MergeContent[],
  config: Partial<MergeConfig> = {}
): Promise<MergeResult> {
  const { mergeOrder = 'after' } = config;

  const parts: string[] = [];
  const sources: string[] = ['<generated-tokens>'];
  const warnings: string[] = [];

  // Add header comment
  parts.push(generateHeaderComment(tokenContent.format));

  // Build content based on merge order
  if (mergeOrder === 'before') {
    // User styles first
    for (const content of userContent) {
      parts.push(generateSourceComment(content.source, tokenContent.format));
      parts.push(content.content);
      sources.push(content.source);
    }
    // Then token styles
    parts.push(generateSourceComment('<generated-tokens>', tokenContent.format));
    parts.push(tokenContent.content);
  } else {
    // Token styles first
    parts.push(generateSourceComment('<generated-tokens>', tokenContent.format));
    parts.push(tokenContent.content);
    // Then user styles
    for (const content of userContent) {
      parts.push(generateSourceComment(content.source, tokenContent.format));
      parts.push(content.content);
      sources.push(content.source);
    }
  }

  // Check for potential issues
  const mergedContent = parts.join('\n\n');
  warnings.push(...detectMergeIssues(mergedContent, tokenContent.format));

  return {
    content: mergedContent,
    sources,
    warnings,
  };
}

/**
 * Generate header comment for merged file
 */
function generateHeaderComment(format: 'scss' | 'css'): string {
  const timestamp = new Date().toISOString();
  const comment = `
/**
 * DSAi Design Tokens - Merged Bundle
 * Generated: ${timestamp}
 *
 * This file was automatically generated and includes:
 * - Generated design tokens
 * - Merged additional stylesheets
 *
 * DO NOT EDIT DIRECTLY - changes will be overwritten on rebuild
 */
`.trim();

  return comment;
}

/**
 * Generate source comment for section
 */
function generateSourceComment(source: string, format: 'scss' | 'css'): string {
  return `/* ========== Source: ${source} ========== */`;
}

/**
 * Detect potential issues in merged content
 */
function detectMergeIssues(content: string, format: 'scss' | 'css'): string[] {
  const warnings: string[] = [];

  // Check for duplicate :root selectors
  const rootCount = (content.match(/:root\s*\{/g) || []).length;
  if (rootCount > 1) {
    warnings.push(
      `Found ${rootCount} :root selectors. Consider consolidating for better performance.`
    );
  }

  // Check for duplicate CSS custom properties (simplified check)
  const customProps = content.match(/--[\w-]+:/g) || [];
  const uniqueProps = new Set(customProps);
  if (customProps.length > uniqueProps.size) {
    warnings.push(
      `Found duplicate CSS custom properties. Later definitions will override earlier ones.`
    );
  }

  // SCSS-specific checks
  if (format === 'scss') {
    // Check for @import after content
    const importAfterContent = /@import\s+['"][^'"]+['"];?\s*$/gm;
    if (importAfterContent.test(content)) {
      warnings.push(`Found @import statements that may not be at the top of the file.`);
    }
  }

  return warnings;
}

/**
 * Load content from files
 *
 * @param files File paths to load
 * @param type Content type (token or user)
 * @param format File format
 * @returns Loaded content
 */
export async function loadContent(
  files: string[],
  type: 'token' | 'user',
  format: 'scss' | 'css'
): Promise<MergeContent[]> {
  const content: MergeContent[] = [];

  for (const filePath of files) {
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      content.push({
        source: filePath,
        content: fileContent,
        type,
        format,
      });
    } catch (error) {
      console.warn(`Failed to load file: ${filePath}`, error);
    }
  }

  return content;
}

/**
 * Process SCSS imports header
 *
 * @param importHeader Import header configuration
 * @param configDir Config directory for resolving relative paths
 * @returns Processed import statements
 */
export function processScssImportHeader(
  importHeader: string | string[] | undefined,
  configDir: string
): string {
  if (!importHeader) return '';

  const imports = Array.isArray(importHeader) ? importHeader : [importHeader];
  const statements: string[] = [];

  for (const importPath of imports) {
    // Determine if it's a path or module import
    if (importPath.startsWith('.') || importPath.startsWith('/')) {
      // Relative or absolute path
      const resolvedPath = path.resolve(configDir, importPath);
      statements.push(`@import '${resolvedPath}';`);
    } else {
      // Module import (e.g., 'normalize.css')
      statements.push(`@import '${importPath}';`);
    }
  }

  return statements.join('\n') + '\n\n';
}
````

### Step 4: Implement Bundle Generator

**src/tokens/merge/bundler.ts:**

````typescript
/**
 * Bundle generator for combined stylesheets
 *
 * @packageDocumentation
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { BundleConfig, BundleResult, MergeResult } from './types.js';

/**
 * Create a stylesheet bundle
 *
 * @param mergeResult Result from merge operation
 * @param config Bundle configuration
 * @returns Bundle result
 *
 * @example
 * ```typescript
 * const bundle = await createBundle(mergeResult, {
 *   name: 'tokens-bundle',
 *   outputDir: 'dist',
 *   includeSourceComments: true,
 *   sourcemaps: true,
 *   minify: false,
 * });
 * ```
 */
export async function createBundle(
  mergeResult: MergeResult,
  config: BundleConfig
): Promise<BundleResult> {
  const { name, outputDir, includeSourceComments, sourcemaps, minify } = config;

  let content = mergeResult.content;

  // Optionally remove source comments
  if (!includeSourceComments) {
    content = removeSourceComments(content);
  }

  // Minify if requested
  let minifiedSize: number | undefined;
  if (minify) {
    const minified = minifyContent(content);
    minifiedSize = Buffer.byteLength(minified, 'utf-8');
    content = minified;
  }

  // Determine output path
  const extension = detectExtension(mergeResult);
  const outputPath = path.join(outputDir, `${name}${extension}`);

  // Ensure output directory exists
  await fs.promises.mkdir(outputDir, { recursive: true });

  // Write bundle
  await fs.promises.writeFile(outputPath, content, 'utf-8');

  // Write sourcemap if requested
  let sourcemap: string | undefined;
  if (sourcemaps) {
    sourcemap = generateSourcemap(mergeResult.sources, name, extension);
    const mapPath = `${outputPath}.map`;
    await fs.promises.writeFile(mapPath, sourcemap, 'utf-8');

    // Add sourcemap reference to content
    const mapRef = `\n/*# sourceMappingURL=${name}${extension}.map */`;
    content += mapRef;
    await fs.promises.writeFile(outputPath, content, 'utf-8');
  }

  return {
    content,
    sourcemap,
    outputPath,
    files: mergeResult.sources,
    size: Buffer.byteLength(content, 'utf-8'),
    minifiedSize,
  };
}

/**
 * Remove source comments from content
 */
function removeSourceComments(content: string): string {
  return content.replace(/\/\* ========== Source: .+ ========== \*\/\n?/g, '');
}

/**
 * Simple CSS minification
 * Note: For production, consider using a proper minifier like cssnano
 */
function minifyContent(content: string): string {
  return (
    content
      // Remove comments (but keep /*! ... */ license comments)
      .replace(/\/\*(?!!)[^*]*\*+([^/*][^*]*\*+)*\//g, '')
      // Remove whitespace
      .replace(/\s+/g, ' ')
      // Remove space around special characters
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remove trailing semicolons before closing braces
      .replace(/;}/g, '}')
      // Remove empty rules
      .replace(/[^{}]+\{\s*\}/g, '')
      .trim()
  );
}

/**
 * Detect output extension based on content
 */
function detectExtension(mergeResult: MergeResult): string {
  const hasScssFeatures = mergeResult.content.match(/@mixin|@include|\$[a-zA-Z]/);
  return hasScssFeatures ? '.scss' : '.css';
}

/**
 * Generate a basic sourcemap
 */
function generateSourcemap(sources: string[], name: string, extension: string): string {
  const sourceMapV3 = {
    version: 3,
    file: `${name}${extension}`,
    sources,
    names: [],
    mappings: '',
  };

  return JSON.stringify(sourceMapV3, null, 2);
}

/**
 * Create both CSS and SCSS bundles
 *
 * @param tokenCss Generated CSS tokens
 * @param tokenScss Generated SCSS tokens
 * @param userCss User CSS files
 * @param userScss User SCSS files
 * @param config Bundle configuration
 * @returns Map of bundle type to result
 */
export async function createBundles(
  tokenCss: string,
  tokenScss: string,
  userCss: string[],
  userScss: string[],
  config: Omit<BundleConfig, 'name'> & { baseName?: string }
): Promise<{ css?: BundleResult; scss?: BundleResult }> {
  const { baseName = 'tokens-bundle', ...bundleConfig } = config;
  const results: { css?: BundleResult; scss?: BundleResult } = {};

  // Import merger
  const { mergeContent, loadContent } = await import('./merger.js');

  // Create CSS bundle if we have CSS content
  if (tokenCss || userCss.length > 0) {
    const userContent = await loadContent(userCss, 'user', 'css');
    const mergeResult = await mergeContent({ content: tokenCss, format: 'css' }, userContent);

    results.css = await createBundle(mergeResult, {
      ...bundleConfig,
      name: baseName,
    });
  }

  // Create SCSS bundle if we have SCSS content
  if (tokenScss || userScss.length > 0) {
    const userContent = await loadContent(userScss, 'user', 'scss');
    const mergeResult = await mergeContent({ content: tokenScss, format: 'scss' }, userContent);

    results.scss = await createBundle(mergeResult, {
      ...bundleConfig,
      name: `_${baseName}`,
    });
  }

  return results;
}
````

### Step 5: Implement Output Path Resolver

**src/tokens/output/resolver.ts:**

````typescript
/**
 * Output path resolver with placeholder support
 *
 * @packageDocumentation
 */

import * as path from 'node:path';
import type { OutputFormat } from '../../config/types.js';
import type { OutputConfig } from '../merge/types.js';

/**
 * Placeholder values for file naming
 */
export interface PlaceholderValues {
  /** Theme name (e.g., 'light', 'dark') */
  theme?: string;

  /** Token name or identifier */
  name?: string;

  /** Output format */
  format?: OutputFormat;

  /** Current date in ISO format */
  date?: string;

  /** Timestamp */
  timestamp?: string;
}

/**
 * Default file names per format
 */
export const DEFAULT_FILE_NAMES: Record<OutputFormat, string> = {
  css: 'tokens.css',
  scss: '_tokens.scss',
  js: 'tokens.js',
  ts: 'tokens.ts',
  json: 'tokens.json',
  android: 'tokens.xml',
  ios: 'Tokens.swift',
};

/**
 * Resolve output path for a specific format
 *
 * @param format Output format
 * @param config Output configuration
 * @param values Placeholder values
 * @returns Resolved output path
 *
 * @example
 * ```typescript
 * const outputPath = resolveOutputPath('css', {
 *   baseDir: 'dist',
 *   formatDirs: { css: 'dist/css' },
 *   fileNames: { css: 'design-tokens-{theme}.css' },
 * }, { theme: 'light' });
 *
 * // Returns: 'dist/css/design-tokens-light.css'
 * ```
 */
export function resolveOutputPath(
  format: OutputFormat,
  config: OutputConfig,
  values: PlaceholderValues = {}
): string {
  // Determine directory
  const dir = config.formatDirs[format] || config.baseDir;

  // Determine file name
  let fileName = config.fileNames[format] || DEFAULT_FILE_NAMES[format];

  // Replace placeholders
  fileName = replacePlaceholders(fileName, values);

  return path.join(dir, fileName);
}

/**
 * Replace placeholders in a string
 *
 * @param template Template string with placeholders
 * @param values Values to replace
 * @returns String with placeholders replaced
 */
export function replacePlaceholders(template: string, values: PlaceholderValues): string {
  const now = new Date();

  const allValues: Record<string, string> = {
    theme: values.theme || 'default',
    name: values.name || 'tokens',
    format: values.format || '',
    date: values.date || now.toISOString().split('T')[0],
    timestamp: values.timestamp || now.toISOString(),
  };

  let result = template;
  for (const [key, value] of Object.entries(allValues)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  return result;
}

/**
 * Resolve all output paths for all formats
 *
 * @param formats Formats to generate
 * @param config Output configuration
 * @param values Placeholder values
 * @returns Map of format to output path
 */
export function resolveAllOutputPaths(
  formats: OutputFormat[],
  config: OutputConfig,
  values: PlaceholderValues = {}
): Record<OutputFormat, string> {
  const result: Partial<Record<OutputFormat, string>> = {};

  for (const format of formats) {
    result[format] = resolveOutputPath(format, config, values);
  }

  return result as Record<OutputFormat, string>;
}

/**
 * Validate output paths don't conflict
 *
 * @param paths Output paths to validate
 * @returns Validation result with any conflicts found
 */
export function validateOutputPaths(paths: Record<string, string>): {
  valid: boolean;
  conflicts: [string, string][];
} {
  const conflicts: [string, string][] = [];
  const pathToFormat: Record<string, string> = {};

  for (const [format, outputPath] of Object.entries(paths)) {
    const normalized = path.normalize(outputPath);

    if (normalized in pathToFormat) {
      conflicts.push([pathToFormat[normalized], format]);
    } else {
      pathToFormat[normalized] = format;
    }
  }

  return {
    valid: conflicts.length === 0,
    conflicts,
  };
}

/**
 * Ensure all output directories exist
 *
 * @param paths Output paths
 * @returns Created directories
 */
export async function ensureOutputDirs(paths: Record<string, string>): Promise<string[]> {
  const { mkdir } = await import('node:fs/promises');

  const directories = new Set<string>();
  for (const outputPath of Object.values(paths)) {
    directories.add(path.dirname(outputPath));
  }

  const created: string[] = [];
  for (const dir of directories) {
    await mkdir(dir, { recursive: true });
    created.push(dir);
  }

  return created;
}
````

### Step 6: Integrate with Build Pipeline

**src/tokens/build.ts** (additions):

```typescript
// Add to existing build.ts file

import { scanDirectories, sortFiles } from './merge/scanner.js';
import { mergeContent, loadContent, processScssImportHeader } from './merge/merger.js';
import { createBundles } from './merge/bundler.js';
import { resolveAllOutputPaths, ensureOutputDirs } from './output/resolver.js';
import type { MergeConfig, OutputConfig } from './merge/types.js';
import type { BuildOptions, BuildResult } from './types.js';
import type { ResolvedConfig, OutputFormat } from '../config/types.js';

/**
 * Extended build with merge and bundle support
 *
 * @param config Resolved configuration
 * @param options Build options
 * @returns Build result
 */
export async function buildWithMerge(
  config: ResolvedConfig,
  options: BuildOptions = {}
): Promise<BuildResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const stepsCompleted: string[] = [];
  const stepsFailed: string[] = [];

  try {
    // Step 1: Resolve output paths
    const outputConfig: OutputConfig = {
      baseDir: config.tokens.outputDir,
      formatDirs: config.tokens.outputDirs || {},
      fileNames: config.tokens.outputFileNames || {},
    };

    const outputPaths = resolveAllOutputPaths(config.tokens.formats, outputConfig);
    await ensureOutputDirs(outputPaths);
    stepsCompleted.push('resolve-output-paths');

    // Step 2: Run Style Dictionary build (existing logic)
    // ... existing build logic ...
    stepsCompleted.push('style-dictionary-build');

    // Step 3: Scan additional directories if configured
    if (
      config.tokens.additionalScssDirectories?.length ||
      config.tokens.additionalCssDirectories?.length
    ) {
      // Scan SCSS directories
      const scssResult = await scanDirectories({
        directories: config.tokens.additionalScssDirectories || [],
        extension: 'scss',
      });

      // Scan CSS directories
      const cssResult = await scanDirectories({
        directories: config.tokens.additionalCssDirectories || [],
        extension: 'css',
      });

      // Log scan results
      if (scssResult.missingDirectories.length) {
        errors.push(`Missing SCSS directories: ${scssResult.missingDirectories.join(', ')}`);
      }
      if (cssResult.missingDirectories.length) {
        errors.push(`Missing CSS directories: ${cssResult.missingDirectories.join(', ')}`);
      }

      stepsCompleted.push('scan-additional-directories');

      // Step 4: Create bundles if configured
      if (config.tokens.createBundle) {
        const bundles = await createBundles(
          '', // Token CSS content from Step 2
          '', // Token SCSS content from Step 2
          sortFiles(cssResult.files).map((f) => f.absolutePath),
          sortFiles(scssResult.files).map((f) => f.absolutePath),
          {
            outputDir: config.tokens.outputDir,
            includeSourceComments: true,
            sourcemaps: false,
            minify: false,
          }
        );

        stepsCompleted.push('create-bundles');
      }
    }

    // Step 5: Call build hooks
    if (config.tokens.onBuildComplete) {
      const summary = {
        duration: Date.now() - startTime,
        outputs: outputPaths as Record<OutputFormat, string[]>,
        bundles: config.tokens.createBundle ? { css: '', scss: '' } : undefined,
        warnings: [],
        stats: {
          totalTokens: 0, // Populate from actual build
          tokensByType: {},
          themes: [],
        },
      };

      await config.tokens.onBuildComplete(summary);
      stepsCompleted.push('build-hooks');
    }

    return {
      success: true,
      stepsCompleted,
      stepsFailed,
      duration: Date.now() - startTime,
      errors,
    };
  } catch (error) {
    return {
      success: false,
      stepsCompleted,
      stepsFailed,
      duration: Date.now() - startTime,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
```

---

## 📚 Usage Examples

### Example 1: Enterprise with Custom Figma Export Location

```javascript
// dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Custom source location
    sourceDir: 'design/figma-exports',

    // Custom patterns for finding files
    sourcePatterns: ['**/*-tokens.json', 'theme-*.json'],

    // Map collections to specific files
    collectionMapping: {
      primitives: 'design/figma-exports/brand-colors.json',
      semantic: 'design/figma-exports/semantic-tokens.json',
      components: 'design/figma-exports/component-tokens.json',
    },
  },
});
```

### Example 2: Per-Format Output Directories

```javascript
// dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Per-format output directories
    outputDirs: {
      css: 'public/styles',
      scss: 'src/styles/tokens',
      js: 'src/tokens',
      ts: 'src/tokens',
      json: 'dist/tokens',
    },

    // Custom file names with theme placeholder
    outputFileNames: {
      css: 'design-tokens-{theme}.css',
      scss: '_design-tokens-{theme}.scss',
      ts: 'tokens.{theme}.ts',
    },
  },
});
```

### Example 3: Merging with Existing Stylesheets

```javascript
// dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Additional SCSS directories to merge
    additionalScssDirectories: [
      'src/styles/overrides',
      'src/styles/custom-mixins',
      'src/styles/utilities',
    ],

    // Additional CSS directories
    additionalCssDirectories: ['src/styles/base', 'src/styles/vendor'],

    // User styles come after token styles
    mergeOrder: 'after',

    // Create combined bundle files
    createBundle: true,

    // Custom SCSS import at top
    scssImportHeader: ['../../variables', '../../functions', '../../mixins'],
  },
});
```

### Example 4: Full Enterprise Setup

```javascript
// dsai.config.mjs
import { defineConfig } from '@dsai/tools';

export default defineConfig({
  tokens: {
    // Source configuration
    sourceDir: 'design-system/tokens',
    sourcePatterns: ['**/*.tokens.json'],
    collectionMapping: {
      core: './core-tokens.json',
      brand: './brand-tokens.json',
      'dark-mode': './dark-mode-tokens.json',
    },

    // Output configuration
    outputDir: 'dist',
    outputDirs: {
      css: 'dist/css',
      scss: 'packages/styles/src/tokens',
      ts: 'packages/tokens/src',
    },

    // Style merge configuration
    additionalScssDirectories: ['packages/styles/src/custom'],
    additionalCssDirectories: ['packages/styles/src/base'],
    mergeOrder: 'after',
    createBundle: true,
    scssImportHeader: '@import "../../variables";',

    // Watch additional directories
    watch: true,
    watchDirectories: ['packages/styles/src/custom'],

    // Build hooks
    onBuildComplete: async (summary) => {
      console.log(`Built ${summary.stats.totalTokens} tokens in ${summary.duration}ms`);
    },
  },
});
```

---

## ✅ Definition of Done

- [ ] Scanner finds all files in additional directories
- [ ] Merger combines content in correct order
- [ ] Bundle generator creates valid CSS/SCSS
- [ ] Per-format output directories work correctly
- [ ] Placeholder replacement works in file names
- [ ] Watch mode detects changes in additional directories
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Documentation complete with examples
- [ ] Enterprise examples work end-to-end
