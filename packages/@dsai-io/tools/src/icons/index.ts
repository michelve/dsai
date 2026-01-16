/**
 * Icon tooling module for @dsai-io/tools
 *
 * Provides utilities for generating icon components from SVG source files.
 * Supports React components, SVG sprites, with SVGO optimization.
 *
 * @packageDocumentation
 */

import { join } from 'node:path';

import { optimizeSVGFiles, parseSVGFiles, scanSVGFiles } from './core/index.js';
import { generateReactIcons } from './generators/react.js';
import { generateSVGSprite } from './generators/svg-sprite.js';

import type {
  GeneratedIcon,
  IconBuildOptions,
  IconBuildResult,
  IconFormat,
  OptimizedSVG,
  SVGOConfig,
} from './types.js';
import type { ResolvedConfig } from '../config/types.js';

/**
 * Build icons from SVG source files
 *
 * Scans the source directory, parses and optimizes SVGs, then generates
 * output in the specified formats (React, SVG sprite).
 *
 * @param config - Resolved DSAi configuration
 * @param options - Build options
 * @returns Build result with generated files
 *
 * @example
 * ```typescript
 * import { loadConfig } from '@dsai-io/tools/config';
 * import { buildIcons } from '@dsai-io/tools/icons';
 *
 * const { config } = await loadConfig();
 * const result = await buildIcons(config, {
 *   formats: ['react', 'svg-sprite'],
 * });
 *
 * console.log(\`Generated \${result.totalIcons} icons\`);
 * ```
 */
export async function buildIcons(
  config: ResolvedConfig,
  options: IconBuildOptions = {}
): Promise<IconBuildResult> {
  const startTime = Date.now();
  const defaultFormat = config.icons.framework === 'react' ? 'react' : 'svg-sprite';
  const { formats = [defaultFormat as IconFormat], icons: iconFilter, dryRun = false } = options;

  const result: IconBuildResult = {
    success: false,
    icons: [],
    totalIcons: 0,
    filesWritten: 0,
    totalSizeReduction: 0,
    errors: [],
    warnings: [],
    duration: 0,
  };

  try {
    // Step 1: Scan for SVG files
    const rawFiles = await scanSVGFiles({
      sourceDir: config.icons.sourceDir,
    });

    if (rawFiles.length === 0) {
      result.warnings.push({
        icon: '*',
        message: `No SVG files found in ${config.icons.sourceDir}`,
      });
      result.success = true;
      result.duration = Date.now() - startTime;
      return result;
    }

    // Filter by specific icons if provided
    const filteredFiles = iconFilter
      ? rawFiles.filter((f) => iconFilter.includes(f.fileName))
      : rawFiles;

    // Step 2: Parse SVG content
    const parsedFiles = parseSVGFiles(filteredFiles);

    // Step 3: Optimize SVGs (if enabled)
    let optimizedFiles: OptimizedSVG[];
    if (config.icons.optimize) {
      const svgoConfig: SVGOConfig = {
        multipass: true,
      };
      optimizedFiles = await optimizeSVGFiles(parsedFiles, filteredFiles, svgoConfig);

      // Calculate total size reduction
      const totalReduction = optimizedFiles.reduce((sum, f) => sum + f.sizeReduction, 0);
      result.totalSizeReduction =
        optimizedFiles.length > 0 ? totalReduction / optimizedFiles.length : 0;
    } else {
      // Skip optimization - just add size metadata
      const { skipOptimization } = await import('./core/optimizer.js');
      optimizedFiles = parsedFiles.map((parsed, index) => {
        const rawFile = filteredFiles[index];
        if (!rawFile) {
          throw new Error(`Missing raw file for ${parsed.fileName}`);
        }
        return skipOptimization(parsed, rawFile);
      });
    }

    result.totalIcons = optimizedFiles.length;

    // Step 4: Generate output for each format
    const generated: GeneratedIcon[] = [];

    for (const format of formats) {
      const outputDir = join(config.icons.outputDir, format);

      switch (format) {
        case 'react':
          generated.push(...(await generateReactIcons(optimizedFiles, outputDir, { dryRun })));
          break;

        case 'svg':
        case 'svg-sprite':
          generated.push(...(await generateSVGSprite(optimizedFiles, outputDir, { dryRun })));
          break;

        default:
          result.warnings.push({
            icon: '*',
            message: `Unknown format: ${format}`,
          });
      }
    }

    result.icons = generated;
    result.filesWritten = dryRun ? 0 : generated.length;
    result.success = true;
  } catch (error) {
    result.errors.push({
      icon: '*',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'BUILD_ERROR',
    });
  }

  result.duration = Date.now() - startTime;
  return result;
}

// Re-export types
export type {
  GeneratedIcon,
  GeneratorOptions,
  IconBuildOptions,
  IconBuildResult,
  IconError,
  IconErrorCode,
  IconFormat,
  IconTemplate,
  IconWarning,
  IndexTemplate,
  OptimizedSVG,
  ParsedSVG,
  RawSVGData,
  ScannerOptions,
  SVGOConfig,
  SVGOPlugin,
  TypesTemplate,
} from './types.js';

// Re-export core utilities
export {
  cleanSVGForReact,
  defaultSVGOConfig,
  extractViewBox,
  optimizeSVG,
  optimizeSVGFiles,
  parseSVG,
  parseSVGFiles,
  readSVGFile,
  scanSVGFiles,
  skipOptimization,
} from './core/index.js';

// Re-export generators
export {
  defaultReactIndexTemplate,
  defaultReactTemplate,
  defaultReactTypesTemplate,
  generateReactIcons,
  generateSVGSprite,
} from './generators/index.js';

// Re-export naming utilities
export {
  isValidIconName,
  normalizeIconName,
  toComponentName,
  toIconName,
} from './utils/index.js';
