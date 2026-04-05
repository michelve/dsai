/**
 * Theme Discovery Module
 *
 * Discovers and categorizes token files by theme based on file suffix patterns.
 * Supports both auto-detection from file names and explicit theme definitions.
 *
 * @packageDocumentation
 * @module @dsai-io/tools/tokens/theme-discovery
 */

import path from 'node:path';

import fg from 'fast-glob';

import type { ResolvedThemeDefinition, ResolvedThemesConfig } from '../config/types.js';

// ============================================================================
// Types
// ============================================================================

/**
 * Result of theme file discovery
 */
export interface ThemeFilesResult {
  /** Theme name */
  theme: string;
  /** Theme definition */
  definition: ResolvedThemeDefinition;
  /** Files belonging to this theme */
  files: string[];
}

/**
 * Discovery result with all themes
 */
export interface DiscoveryResult {
  /** Files organized by theme - Map of theme name to file paths */
  themes: Map<string, string[]>;
  /** Theme definitions organized by theme name */
  definitions: Map<string, ResolvedThemeDefinition>;
  /** Files that couldn't be matched to any theme (when autoDetect is false) */
  orphanFiles: string[];
  /** Themes with no files found */
  emptyThemes: string[];
  /** Total files discovered */
  totalFiles: number;
}

/**
 * Options for theme discovery
 */
export interface DiscoveryOptions {
  /** Base directory for file patterns */
  sourceDir: string;
  /** Glob pattern for finding token files */
  pattern?: string;
  /** Whether to include verbose logging */
  verbose?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract theme suffixes from definitions
 */
function getThemeSuffixes(
  definitions: Record<string, ResolvedThemeDefinition>
): Map<string, string> {
  const suffixToTheme = new Map<string, string>();

  for (const [themeName, definition] of Object.entries(definitions)) {
    if (definition.suffix) {
      suffixToTheme.set(definition.suffix, themeName);
    }
  }

  return suffixToTheme;
}

/**
 * Get the default theme name from definitions
 */
function getDefaultThemeName(
  definitions: Record<string, ResolvedThemeDefinition>
): string | undefined {
  for (const [themeName, definition] of Object.entries(definitions)) {
    if (definition.isDefault) {
      return themeName;
    }
  }
  return undefined;
}

/**
 * Check if a file matches a theme suffix
 * Returns the theme name if matched, undefined otherwise
 */
function matchFileSuffix(filename: string, suffixToTheme: Map<string, string>): string | undefined {
  // Remove .json extension
  const baseName = filename.replace(/\.json$/i, '');

  // Check each suffix
  for (const [suffix, themeName] of suffixToTheme.entries()) {
    if (baseName.endsWith(suffix)) {
      return themeName;
    }
  }

  return undefined;
}

/**
 * Generate ignore patterns for non-default theme files
 */
function generateIgnorePatterns(
  sourceDir: string,
  definitions: Record<string, ResolvedThemeDefinition>
): string[] {
  const patterns: string[] = [];

  for (const definition of Object.values(definitions)) {
    if (definition.suffix) {
      patterns.push(`${sourceDir}/**/*${definition.suffix}.json`);
    }
  }

  return patterns;
}

// ============================================================================
// Main Discovery Function
// ============================================================================

/**
 * Discover token files organized by theme
 *
 * This function scans the source directory for JSON token files and
 * categorizes them by theme based on their file suffix patterns.
 *
 * @param themesConfig - Resolved themes configuration
 * @param options - Discovery options including source directory
 * @returns Discovery result with files organized by theme
 *
 * @example
 * ```typescript
 * const result = discoverThemeFiles(themesConfig, {
 *   sourceDir: 'src/collections',
 *   pattern: '**\/*.json',
 * });
 *
 * // result.themes = [
 * //   { theme: 'light', files: ['foundation.json', 'semantic.json'] },
 * //   { theme: 'dark', files: ['foundation-dark.json', 'semantic-dark.json'] },
 * // ]
 * ```
 */
export function discoverThemeFiles(
  themesConfig: ResolvedThemesConfig,
  options: DiscoveryOptions
): DiscoveryResult {
  const { sourceDir, pattern = '**/*.json', verbose = false } = options;
  const { definitions } = themesConfig;

  // Build suffix mapping
  const suffixToTheme = getThemeSuffixes(definitions);
  const defaultThemeName = getDefaultThemeName(definitions);

  // Initialize result containers
  const themeFilesMap = new Map<string, string[]>();
  const orphanFiles: string[] = [];
  const emptyThemes: string[] = [];

  // Initialize theme file arrays
  for (const themeName of Object.keys(definitions)) {
    themeFilesMap.set(themeName, []);
  }

  // Discover all JSON files
  const allFiles = fg.sync(pattern, {
    cwd: sourceDir,
    absolute: false,
  });

  if (verbose) {
    console.warn(`  📂 Found ${allFiles.length} token files in ${sourceDir}`);
  }

  // Categorize each file
  for (const file of allFiles) {
    const filename = path.basename(file);
    const matchedTheme = matchFileSuffix(filename, suffixToTheme);

    if (matchedTheme) {
      // File matches a non-default theme
      const files = themeFilesMap.get(matchedTheme);
      if (files) {
        files.push(file);
      } else if (!themesConfig.autoDetect) {
        // Theme not defined and autoDetect is off
        orphanFiles.push(file);
      }
    } else if (defaultThemeName) {
      // File has no theme suffix - belongs to default theme
      themeFilesMap.get(defaultThemeName)?.push(file);
    } else {
      // No default theme defined
      orphanFiles.push(file);
    }
  }

  // Build result Maps
  const themesMap = new Map<string, string[]>();
  const definitionsMap = new Map<string, ResolvedThemeDefinition>();
  const themeResults: ThemeFilesResult[] = [];

  for (const [themeName, files] of themeFilesMap.entries()) {
    // Safe access using Map lookup since we control the keys
    const definition = definitions[themeName as keyof typeof definitions];

    if (!definition) {
      continue;
    }

    const fullPaths = files.map((f) => path.join(sourceDir, f));

    if (files.length === 0) {
      emptyThemes.push(themeName);
    }

    // Add to Maps
    themesMap.set(themeName, fullPaths);
    definitionsMap.set(themeName, definition);

    // Also keep array format for sorting/iteration
    themeResults.push({
      theme: themeName,
      definition,
      files: fullPaths,
    });
  }

  // Sort themes: default first, then alphabetically
  themeResults.sort((a, b) => {
    if (a.definition.isDefault) {
      return -1;
    }
    if (b.definition.isDefault) {
      return 1;
    }
    return a.theme.localeCompare(b.theme);
  });

  const totalFiles = themeResults.reduce((sum, t) => sum + t.files.length, 0);

  if (verbose) {
    for (const { theme, files, definition } of themeResults) {
      const suffix = definition.suffix ?? '(no suffix)';
      console.warn(`  🎨 ${theme} [${suffix}]: ${files.length} files`);
    }
    if (orphanFiles.length > 0) {
      console.warn(`  ⚠️  ${orphanFiles.length} orphan files (no matching theme)`);
    }
    if (emptyThemes.length > 0) {
      console.warn(`  ⚠️  Empty themes: ${emptyThemes.join(', ')}`);
    }
  }

  return {
    themes: themesMap,
    definitions: definitionsMap,
    orphanFiles,
    emptyThemes,
    totalFiles,
  };
}

/**
 * Get files for a specific theme
 *
 * For the default theme, this returns all files EXCEPT those
 * matching other theme suffixes.
 *
 * For non-default themes, this returns only files with the
 * matching suffix.
 *
 * @param themeName - Name of the theme to get files for
 * @param themesConfig - Resolved themes configuration
 * @param options - Discovery options
 * @returns Array of file paths for the theme
 */
export function getThemeFiles(
  themeName: string,
  themesConfig: ResolvedThemesConfig,
  options: DiscoveryOptions
): string[] {
  const { sourceDir, pattern = '**/*.json' } = options;

  // Use Map for safe access
  const definitionsMap = new Map(Object.entries(themesConfig.definitions));
  const definition = definitionsMap.get(themeName);

  if (!definition) {
    throw new Error(`Unknown theme: ${themeName}`);
  }

  if (definition.isDefault) {
    // Default theme: all files EXCEPT those with theme suffixes
    const ignorePatterns = generateIgnorePatterns(sourceDir, themesConfig.definitions);

    return fg.sync(path.join(sourceDir, pattern), {
      ignore: ignorePatterns,
      absolute: true,
    });
  }

  // Non-default theme: files with specific suffix
  if (!definition.suffix) {
    return [];
  }

  const suffixPattern = pattern.replace(/\.json$/i, `${definition.suffix}.json`);

  return fg.sync(path.join(sourceDir, suffixPattern), {
    absolute: true,
  });
}

/**
 * Auto-detect themes from file suffixes
 *
 * Scans files in the source directory and extracts unique
 * theme suffixes to build a dynamic theme list.
 *
 * @param sourceDir - Directory to scan
 * @param pattern - Glob pattern for files
 * @param selectorPattern - Pattern for generating selectors
 * @returns Map of theme names to their suffixes
 */
export function autoDetectThemes(
  sourceDir: string,
  pattern: string = '**/*.json',
  selectorPattern: string = '[data-dsai-theme="{mode}"]'
): Map<string, { suffix: string | null; selector: string }> {
  const themes = new Map<string, { suffix: string | null; selector: string }>();

  // Get all files
  const files = fg.sync(pattern, { cwd: sourceDir });

  // Extract unique suffixes
  const suffixRegex = /-([a-z0-9]+)\.json$/i;
  const foundSuffixes = new Set<string>();

  for (const file of files) {
    const match = suffixRegex.exec(file);
    if (match?.[1]) {
      foundSuffixes.add(match[1].toLowerCase());
    }
  }

  // Add default theme (light)
  themes.set('light', {
    suffix: null,
    selector: ':root',
  });

  // Add detected themes
  for (const suffix of foundSuffixes) {
    themes.set(suffix, {
      suffix: `-${suffix}`,
      selector: selectorPattern.replace('{mode}', suffix),
    });
  }

  return themes;
}
