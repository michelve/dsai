/**
 * Bundle generator for combined stylesheets
 *
 * @packageDocumentation
 */

/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-unsafe-regex */

import * as fs from 'node:fs';
import * as path from 'node:path';

import { loadContent, mergeContent } from './merger.js';
import { sortFiles } from './scanner.js';

import type { BundleConfig, BundleResult, StyleScannedFile, StyleMergeResult } from './types.js';

// ============================================================================
// Content Processing
// ============================================================================

/**
 * Remove source comments from content
 */
function removeSourceComments(content: string): string {
  return content.replaceAll(/\/\* ========== Source: .+ ========== \*\/\n?/g, '');
}

/**
 * Simple CSS minification
 * Note: For production, consider using a proper minifier like cssnano
 */
function minifyContent(content: string): string {
  return (
    content
      // Remove comments (but keep /*! ... */ license comments)
      .replaceAll(/\/\*(?!!)[^*]*\*+([^/*][^*]*\*+)*\//g, '')
      // Remove whitespace
      .replaceAll(/\s+/g, ' ')
      // Remove space around special characters
      .replaceAll(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remove trailing semicolons before closing braces
      .replaceAll(';}', '}')
      // Remove empty rules
      .replaceAll(/[^{}]+\{\s*\}/g, '')
      .trim()
  );
}

/**
 * Detect output extension based on content
 */
function detectExtension(mergeResult: StyleMergeResult): string {
  const hasScssFeatures = /@mixin|@include|\$[a-zA-Z]/.exec(mergeResult.content);
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

// ============================================================================
// Main Functions
// ============================================================================

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
  mergeResult: StyleMergeResult,
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
 * Create both CSS and SCSS bundles
 *
 * @param tokenCss Generated CSS tokens
 * @param tokenScss Generated SCSS tokens
 * @param cssFiles User CSS files (StyleScannedFile objects)
 * @param scssFiles User SCSS files (StyleScannedFile objects)
 * @param config Bundle configuration
 * @returns Map of bundle type to result
 */
export async function createBundles(
  tokenCss: string,
  tokenScss: string,
  cssFiles: StyleScannedFile[],
  scssFiles: StyleScannedFile[],
  config: Omit<BundleConfig, 'name'> & { baseName?: string }
): Promise<{ css?: BundleResult; scss?: BundleResult }> {
  const { baseName = 'tokens-bundle', ...bundleConfig } = config;
  const results: { css?: BundleResult; scss?: BundleResult } = {};

  // Create CSS bundle if we have CSS content
  const sortedCss = sortFiles(cssFiles);
  if (tokenCss || sortedCss.length > 0) {
    const userContent = await loadContent(
      sortedCss.map((f) => f.absolutePath),
      'user',
      'css'
    );
    const mergeResult = await mergeContent({ content: tokenCss, format: 'css' }, userContent);

    results.css = await createBundle(mergeResult, {
      ...bundleConfig,
      name: baseName,
    });
  }

  // Create SCSS bundle if we have SCSS content
  const sortedScss = sortFiles(scssFiles);
  if (tokenScss || sortedScss.length > 0) {
    const userContent = await loadContent(
      sortedScss.map((f) => f.absolutePath),
      'user',
      'scss'
    );
    const mergeResult = await mergeContent({ content: tokenScss, format: 'scss' }, userContent);

    results.scss = await createBundle(mergeResult, {
      ...bundleConfig,
      name: `_${baseName}`,
    });
  }

  return results;
}

/**
 * Create a bundle from scanned files (no token content)
 *
 * @param files Scanned files to bundle
 * @param format Output format
 * @param config Bundle configuration
 * @returns Bundle result
 */
export async function createBundleFromFiles(
  files: StyleScannedFile[],
  format: 'css' | 'scss',
  config: BundleConfig
): Promise<BundleResult> {
  const sorted = sortFiles(files);
  const userContent = await loadContent(
    sorted.map((f) => f.absolutePath),
    'user',
    format
  );

  // Create merge result with empty token content
  const mergeResult = await mergeContent({ content: '', format }, userContent);

  return createBundle(mergeResult, config);
}
