/**
 * Merge stylesheet content
 *
 * @packageDocumentation
 */

/* eslint-disable security/detect-non-literal-fs-filename */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { MergeConfig, MergeContent, StyleMergeResult } from './types.js';

// ============================================================================
// Constants
// ============================================================================

/** Source label for generated token output */
const GENERATED_TOKENS_SOURCE = '<generated-tokens>';

// ============================================================================
// Content Generation
// ============================================================================

/**
 * Generate header comment for merged file
 */
function generateHeaderComment(_format: 'scss' | 'css'): string {
  const timestamp = new Date().toISOString();
  const comment = `/**
 * DSAi Design Tokens - Merged Bundle
 * Generated: ${timestamp}
 *
 * This file was automatically generated and includes:
 * - Generated design tokens
 * - Merged additional stylesheets
 *
 * DO NOT EDIT DIRECTLY - changes will be overwritten on rebuild
 */`;

  return comment;
}

/**
 * Generate source comment for section
 */
function generateSourceComment(source: string, _format: 'scss' | 'css'): string {
  return `/* ========== Source: ${source} ========== */`;
}

// ============================================================================
// Issue Detection
// ============================================================================

/**
 * Detect potential issues in merged content
 */
function detectMergeIssues(content: string, format: 'scss' | 'css'): string[] {
  const warnings: string[] = [];

  // Check for duplicate :root selectors
  const rootMatches = content.match(/:root\s*\{/g);
  const rootCount = rootMatches ? rootMatches.length : 0;
  if (rootCount > 1) {
    warnings.push(
      `Found ${rootCount} :root selectors. Consider consolidating for better performance.`
    );
  }

  // Check for duplicate CSS custom properties (simplified check)
  const customProps = content.match(/--[\w-]+:/g) ?? [];
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

// ============================================================================
// Main Functions
// ============================================================================

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
): Promise<StyleMergeResult> {
  const { mergeOrder = 'after' } = config;

  const parts: string[] = [];
  const sources: string[] = [GENERATED_TOKENS_SOURCE];
  const warnings: string[] = [];

  // Add header comment
  parts.push(generateHeaderComment(tokenContent.format));

  // Build content based on merge order
  if (mergeOrder === 'before') {
    for (const content of userContent) {
      parts.push(
        generateSourceComment(content.source, tokenContent.format),
        content.content
      );
      sources.push(content.source);
    }
    parts.push(
      generateSourceComment(GENERATED_TOKENS_SOURCE, tokenContent.format),
      tokenContent.content
    );
  } else {
    parts.push(
      generateSourceComment(GENERATED_TOKENS_SOURCE, tokenContent.format),
      tokenContent.content
    );
    for (const content of userContent) {
      parts.push(
        generateSourceComment(content.source, tokenContent.format),
        content.content
      );
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
  if (!importHeader) {
    return '';
  }

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

  return `${statements.join('\n')}\n\n`;
}

/**
 * Add SCSS import header to content
 *
 * @param content SCSS content
 * @param importHeader Import header to add
 * @param configDir Config directory for resolving paths
 * @returns Content with import header
 */
export function addScssImportHeader(
  content: string,
  importHeader: string | string[] | undefined,
  configDir: string
): string {
  const header = processScssImportHeader(importHeader, configDir);
  if (!header) {
    return content;
  }

  return header + content;
}
